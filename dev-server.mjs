/**
 * Serves the static site and POST /api/concierge (OpenAI) so the API key stays on the server.
 *
 * PowerShell:
 *   $env:OPENAI_API_KEY="sk-..."
 *   node dev-server.mjs
 *
 * Optional: $env:OPENAI_MODEL="gpt-4o-mini" (default gpt-4o-mini)
 * Optional: node dev-server.mjs 4180
 */

import http from "http";
import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const rootResolved = path.resolve(__dirname);
const port = Number(process.env.PORT || process.argv[2] || 4180);

const CONCIERGE_SYSTEM = `You are the digital concierge for Life Hotel NYC, a historic boutique hotel at 19 West 31st Street, New York, NY 10001 (NoMad). Phone (212) 615-9900, email info@lifehotelnyc.com. Dining: Zoi Mediterranean and TEN 11 Lounge on property. Official site for reference: https://www.lifehotelnewyork.com/

Your job is to FULLY answer questions and respond helpfully to guest requests and demands—not to give one-line brush-offs. Be proactive, clear, and actionable.

What you MUST do:
- Answer factual questions about the hotel, neighborhood, getting around NYC, dining near NoMad, what to expect at check-in, room types on this brochure site, packages, and using “Reserve Your Stay” / room categories on the page.
- When guests state demands or requests (e.g. extra towels, late checkout, wake-up call, luggage help, ADA needs, celebration setup, restaurant booking, airport transfer, complaints, “I need…”, “Arrange…”, “Book me…”), respond with empathy and concrete guidance: what the hotel or guest typically does, realistic expectations, and the clearest next step (call the front desk, email, visit the desk on arrival, use the booking tools on the site). You cannot execute requests yourself—say that plainly once—but still tell them exactly what to ask for and when.
- If they want something you cannot confirm (policy, availability, price), say you cannot lock it in here and give the exact channel (phone/email) and what information to have ready (dates, room type, party size).
- For complaints or urgent issues, acknowledge feelings, apologize when appropriate, and escalate: front desk or management via phone/email immediately.

Hard limits (never break these):
- Never invent live room availability, occupancy, housekeeping status, or specific room numbers. Sample rates on the site are planning only.
- No medical diagnosis, legal advice, or financial guarantees. For those, suggest a professional or call the hotel for accessibility/legal questions they can route.
- If the topic has nothing to do with travel, NYC as a visitor, hotels, or this property (e.g. coding homework, unrelated product support), briefly decline and invite a hotel or trip-related question.

Style:
- Match the user’s energy: short question → focused answer; long or emotional message → thorough, structured reply (bullets OK if helpful).
- Default length: enough to fully address the question; go longer when they ask for detail, steps, or options.
- Tone: warm, capable, boutique hotel—you are trying to solve their problem, not gatekeep.`;

const mimeTypes = {
  ".css": "text/css; charset=utf-8",
  ".html": "text/html; charset=utf-8",
  ".ico": "image/x-icon",
  ".jpeg": "image/jpeg",
  ".jpg": "image/jpeg",
  ".js": "application/javascript; charset=utf-8",
  ".json": "application/json; charset=utf-8",
  ".pdf": "application/pdf",
  ".png": "image/png",
  ".svg": "image/svg+xml",
  ".webp": "image/webp",
};

function readBody(req) {
  return new Promise((resolve, reject) => {
    const chunks = [];
    req.on("data", (c) => chunks.push(c));
    req.on("end", () => resolve(Buffer.concat(chunks).toString("utf8")));
    req.on("error", reject);
  });
}

function sendJson(res, status, obj) {
  const body = JSON.stringify(obj);
  res.writeHead(status, {
    "Content-Type": "application/json; charset=utf-8",
    "Content-Length": Buffer.byteLength(body),
    "Access-Control-Allow-Origin": "*",
    "Access-Control-Allow-Methods": "GET, POST, OPTIONS",
    "Access-Control-Allow-Headers": "Content-Type"
  });
  res.end(body);
}

function sendFile(res, filePath) {
  const extension = path.extname(filePath).toLowerCase();
  const contentType = mimeTypes[extension] || "application/octet-stream";

  const stream = fs.createReadStream(filePath);
  stream.on("error", () => {
    res.writeHead(404, { "Content-Type": "text/plain; charset=utf-8" });
    res.end("Not found");
  });

  res.writeHead(200, {
    "Content-Type": contentType,
    "Access-Control-Allow-Origin": "*"
  });

  stream.pipe(res);
}

async function handleConcierge(req, res) {
  if (req.method === "OPTIONS") {
    res.writeHead(204, {
      "Access-Control-Allow-Origin": "*",
      "Access-Control-Allow-Methods": "GET, POST, OPTIONS",
      "Access-Control-Allow-Headers": "Content-Type",
      "Access-Control-Max-Age": "86400"
    });
    res.end();
    return;
  }

  const apiKey = process.env.OPENAI_API_KEY;
  if (!apiKey) {
    sendJson(res, 503, {
      error: "Server missing OPENAI_API_KEY. Set it and restart dev-server.mjs."
    });
    return;
  }

  let body;
  try {
    body = JSON.parse(await readBody(req));
  } catch {
    sendJson(res, 400, { error: "Invalid JSON body" });
    return;
  }

  const raw = Array.isArray(body.messages) ? body.messages : [];
  const safe = raw
    .filter(
      (m) =>
        m &&
        (m.role === "user" || m.role === "assistant") &&
        typeof m.content === "string" &&
        m.content.length > 0 &&
        m.content.length < 8000
    )
    .slice(-24);

  const messages = [{ role: "system", content: CONCIERGE_SYSTEM }, ...safe];

  const model = process.env.OPENAI_MODEL || "gpt-4o-mini";

  let openaiRes;
  try {
    openaiRes = await fetch("https://api.openai.com/v1/chat/completions", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${apiKey}`,
        "Content-Type": "application/json"
      },
      body: JSON.stringify({
        model,
        messages,
        max_tokens: 1000,
        temperature: 0.72
      })
    });
  } catch (e) {
    sendJson(res, 502, { error: "Could not reach OpenAI. Check your network." });
    return;
  }

  const data = await openaiRes.json().catch(() => ({}));
  if (!openaiRes.ok) {
    const msg = data.error?.message || data.error || "OpenAI request failed";
    sendJson(res, openaiRes.status >= 400 && openaiRes.status < 600 ? openaiRes.status : 502, {
      error: typeof msg === "string" ? msg : JSON.stringify(msg)
    });
    return;
  }

  const reply = data.choices?.[0]?.message?.content?.trim() || "";
  if (!reply) {
    sendJson(res, 502, { error: "Empty response from model" });
    return;
  }

  sendJson(res, 200, { reply });
}

const server = http.createServer(async (req, res) => {
  const url = new URL(req.url || "/", `http://${req.headers.host}`);

  if (url.pathname === "/api/concierge" && (req.method === "POST" || req.method === "OPTIONS")) {
    await handleConcierge(req, res);
    return;
  }

  const rawPath = decodeURIComponent(url.pathname.split("?")[0]);
  const relativePath = rawPath === "/" ? "index.html" : rawPath.replace(/^\/+/, "");
  const joined = path.normalize(path.join(rootResolved, relativePath));
  const resolvedFile = path.resolve(joined);
  const relToRoot = path.relative(rootResolved, resolvedFile);

  if (relToRoot.startsWith("..") || path.isAbsolute(relToRoot)) {
    res.writeHead(403, { "Content-Type": "text/plain; charset=utf-8" });
    res.end("Forbidden");
    return;
  }

  sendFile(res, resolvedFile);
});

server.listen(port, "0.0.0.0", () => {
  console.log(`Life Hotel site + AI concierge: http://0.0.0.0:${port}`);
  console.log(`POST /api/concierge (requires OPENAI_API_KEY in environment)`);
});
