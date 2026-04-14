const roomsContainer = document.getElementById("roomsContainer");
const floorFilter = document.getElementById("floorFilter");
const typeFilter = document.getElementById("typeFilter");

const roomModal = document.getElementById("roomModal");
const modalBackdrop = document.getElementById("modalBackdrop");
const modalClose = document.getElementById("modalClose");
const modalTitle = document.getElementById("modalTitle");
const modalDetails = document.getElementById("modalDetails");

const checkInInput = document.getElementById("checkIn");
const checkOutInput = document.getElementById("checkOut");
const guestCountSelect = document.getElementById("guestCount");
const bookingRoomTypeSelect = document.getElementById("bookingRoomType");
const checkAvailabilityBtn = document.getElementById("checkAvailabilityBtn");

const availabilityPopup = document.getElementById("availabilityPopup");
const availabilityTitle = document.getElementById("availabilityTitle");
const availabilityMessage = document.getElementById("availabilityMessage");
const availabilityClose = document.getElementById("availabilityClose");
const availabilityDismiss = document.getElementById("availabilityDismiss");
const availabilityViewRooms = document.getElementById("availabilityViewRooms");

const menuToggle = document.getElementById("menuToggle");
const overlayMenu = document.getElementById("overlayMenu");
const overlayClose = document.getElementById("overlayClose");
const heroSlides = document.querySelectorAll(".hero-slide");

const exploreButtons = document.querySelectorAll(".explore-btn");
const locationPopup = document.getElementById("locationPopup");
const locationClose = document.getElementById("locationClose");
const locationDismiss = document.getElementById("locationDismiss");
const locationTitle = document.getElementById("locationTitle");
const locationAddress = document.getElementById("locationAddress");
const locationDistance = document.getElementById("locationDistance");
const locationMapLink = document.getElementById("locationMapLink");

const roomSearchInput = document.getElementById("roomSearch");
const modalActions = document.getElementById("modalActions");
const infoModal = document.getElementById("infoModal");
const infoModalBackdrop = document.getElementById("infoModalBackdrop");
const infoModalClose = document.getElementById("infoModalClose");
const infoModalEyebrow = document.getElementById("infoModalEyebrow");
const infoModalTitle = document.getElementById("infoModalTitle");
const infoModalBody = document.getElementById("infoModalBody");
const toastEl = document.getElementById("toast");
const newsletterForm = document.getElementById("newsletterForm");
const newsletterEmail = document.getElementById("newsletterEmail");
const newsletterError = document.getElementById("newsletterError");

/** Category profiles only—no room numbers or occupancy (guest safety). */
const roomCategories = [
  {
    id: "standard-classic",
    title: "Classic Queen & King",
    type: "Standard",
    floorLabel: "Typically floors 2–6",
    floorMin: 2,
    floorMax: 6,
    nightlyRate: 360,
    maxGuests: 2,
    occupancy: "Up to 2 guests",
    description:
      "Cozy, design-forward rooms with boutique detailing, brass beds, marble baths, and vintage-inspired character.",
    features: ["Queen or King bed", "Marble bath", "Smart TV", "Work desk", "Historic detail"]
  },
  {
    id: "deluxe-studio",
    title: "Deluxe & Studio King",
    type: "Deluxe",
    floorLabel: "Typically floors 4–9",
    floorMin: 4,
    floorMax: 9,
    nightlyRate: 520,
    maxGuests: 2,
    occupancy: "Up to 2 guests",
    description:
      "More space, arched windows, editorial styling, and elevated finishes—including studio-style layouts on select floors.",
    features: ["King bed", "Seating or studio layout", "Rain shower", "Premium touches"]
  },
  {
    id: "deluxe-two-queens",
    title: "Deluxe Two Queens",
    type: "Deluxe",
    floorLabel: "Typically floors 4–9",
    floorMin: 4,
    floorMax: 9,
    nightlyRate: 540,
    maxGuests: 4,
    occupancy: "Up to 4 guests",
    description:
      "Spacious layout with two queen beds—ideal for friends or family traveling together.",
    features: ["Two queen beds", "Marble bath", "Generous floor plan", "Smart TV"]
  },
  {
    id: "suite",
    title: "Suites",
    type: "Suite",
    floorLabel: "Typically floors 8–10",
    floorMin: 8,
    floorMax: 10,
    nightlyRate: 850,
    maxGuests: 4,
    occupancy: "Up to 4 guests",
    description:
      "Expanded layouts with added living space and residential comfort for longer stays or special occasions.",
    features: ["King bed", "Living lounge", "Luxury bath", "Room to unwind"]
  }
];

const nycLocations = {
  "Empire State Building": {
    address: "20 W 34th St, New York, NY 10001",
    distance: "About a 6-minute walk from Life Hotel NYC.",
    mapsUrl: "https://www.google.com/maps/search/?api=1&query=Empire+State+Building+New+York"
  },
  "Madison Square Garden": {
    address: "4 Pennsylvania Plaza, New York, NY 10001",
    distance: "About a 12-minute walk from Life Hotel NYC.",
    mapsUrl: "https://www.google.com/maps/search/?api=1&query=Madison+Square+Garden+New+York"
  },
  "Broadway": {
    address: "Broadway Theater District, New York, NY",
    distance: "A short ride or walk depending on the theater.",
    mapsUrl: "https://www.google.com/maps/search/?api=1&query=Broadway+Theater+District+New+York"
  },
  "Fifth Avenue": {
    address: "Fifth Avenue, Manhattan, New York, NY",
    distance: "Just minutes away for shopping and landmarks.",
    mapsUrl: "https://www.google.com/maps/search/?api=1&query=Fifth+Avenue+New+York"
  },
  "Koreatown": {
    address: "32nd Street between Fifth Avenue and Broadway, New York, NY",
    distance: "Only a 2-minute walk from Life Hotel NYC.",
    mapsUrl: "https://www.google.com/maps/search/?api=1&query=Koreatown+Manhattan+New+York"
  },
  "Flatiron District": {
    address: "Flatiron District, Manhattan, New York, NY",
    distance: "About a 10-minute walk from the hotel.",
    mapsUrl: "https://www.google.com/maps/search/?api=1&query=Flatiron+District+New+York"
  }
};

const OFFER_DEFS = {
  "stay-more": {
    title: "Stay More, Save More",
    percent: 10,
    applies: () => true,
    ineligibleReason: () => ""
  },
  empire: {
    title: "Empire Experience",
    percent: 15,
    applies: (room) => room.type === "Deluxe" || room.type === "Suite",
    ineligibleReason: () => "Empire Experience applies to Deluxe and Suite rooms only."
  },
  advance: {
    title: "Advance Experience",
    percent: 12,
    applies: (room, ctx) => ctx.daysAhead !== null && ctx.daysAhead >= 21,
    ineligibleReason: (room, ctx) =>
      ctx.daysAhead === null
        ? "Add check-in dates under Reserve Your Stay to see if you qualify (21+ days ahead)."
        : "Advance Experience requires check-in at least 21 days from today."
  }
};

const INFO_PAGES = {
  faq: {
    eyebrow: "Help",
    title: "Frequently asked questions",
    html: `<p><strong>Check-in &amp; check-out</strong><br />Check-in from 3:00 PM; check-out by 11:00 AM.</p>
<p><strong>Parking</strong><br />There is no on-site parking. Garages are available nearby in NoMad.</p>
<p><strong>Wi-Fi</strong><br />Complimentary Wi-Fi is available for guests.</p>
<p><strong>Pets</strong><br />Please contact the hotel for the current pet policy.</p>`
  },
  contact: {
    eyebrow: "Reach us",
    title: "Contact Life Hotel NYC",
    html: `<p><strong>Address</strong><br />19 West 31st Street, New York, NY 10001</p>
<p><strong>Phone</strong><br /><a href="tel:+12126159900">(212) 615-9900</a></p>
<p><strong>Email</strong><br /><a href="mailto:info@lifehotelnyc.com">info@lifehotelnyc.com</a></p>
<p>For the latest rooms and dining, visit <a href="https://www.lifehotelnewyork.com/" target="_blank" rel="noopener noreferrer">lifehotelnewyork.com</a>.</p>`
  },
  privacy: {
    eyebrow: "Legal",
    title: "Privacy policy",
    html: `<p>This demo site illustrates a boutique hotel experience. It does not collect personal data on a server. Newsletter sign-up is simulated in your browser only.</p>
<p>For official policies, refer to materials provided by the hotel or property management.</p>`
  },
  accessibility: {
    eyebrow: "Inclusion",
    title: "Accessibility",
    html: `<p>We aim for clear structure, keyboard-friendly navigation, and readable contrast on this demo.</p>
<p>For accessibility requests or room specifics, contact the hotel directly at (212) 615-9900.</p>`
  }
};

let selectedOfferId = null;
let lastOpenedRoom = null;

function getDaysAheadCheckIn() {
  if (!checkInInput || !checkInInput.value) return null;
  const ci = new Date(`${checkInInput.value}T12:00:00`);
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  return Math.ceil((ci - today) / 86400000);
}

function getStayNights() {
  if (!checkInInput || !checkOutInput) return null;
  const checkIn = checkInInput.value;
  const checkOut = checkOutInput.value;
  if (!checkIn || !checkOut) return null;
  const d1 = new Date(`${checkIn}T12:00:00`);
  const d2 = new Date(`${checkOut}T12:00:00`);
  if (d2 <= d1) return null;
  return Math.round((d2 - d1) / 86400000);
}

function getPricingForRoom(category) {
  const baseRate = category.nightlyRate;
  let rate = baseRate;
  let discount = 0;
  let promoLabel = null;
  let promoNote = null;

  if (selectedOfferId && OFFER_DEFS[selectedOfferId]) {
    const def = OFFER_DEFS[selectedOfferId];
    const ctx = { daysAhead: getDaysAheadCheckIn() };
    if (def.applies(category, ctx)) {
      discount = Math.round((baseRate * def.percent) / 100);
      rate = baseRate - discount;
      promoLabel = def.title;
    } else {
      promoNote = def.ineligibleReason(category, ctx);
    }
  }

  return { baseRate, rate, discount, promoLabel, promoNote };
}

function showToast(message) {
  if (!toastEl) return;
  toastEl.textContent = message;
  toastEl.classList.remove("hidden");
  window.clearTimeout(showToast._t);
  showToast._t = window.setTimeout(() => {
    toastEl.classList.add("hidden");
  }, 3200);
}

function buildRoomSummaryText(category) {
  const nights = getStayNights();
  const { baseRate, rate, discount, promoLabel, promoNote } = getPricingForRoom(category);
  const lines = [
    `Life Hotel NYC — ${category.title}`,
    `${category.type} · ${category.floorLabel}`,
    checkInInput?.value ? `Check-in: ${checkInInput.value}` : null,
    checkOutInput?.value ? `Check-out: ${checkOutInput.value}` : null,
    nights ? `Nights: ${nights}` : null,
    discount
      ? `Sample nightly rate: $${rate}/night (package rate; base sample $${baseRate})`
      : `Sample nightly rate: $${rate}/night`,
    promoLabel ? `Package: ${promoLabel}` : null,
    promoNote ? `Package note: ${promoNote}` : null,
    nights ? `Estimated room total (sample): $${rate * nights} before taxes & fees` : null,
    "",
    category.description,
    `Features: ${category.features.join(", ")}`,
    "",
    "Availability and exact room assignment are confirmed only when booking or contacting the hotel."
  ];
  return lines.filter(Boolean).join("\n");
}

function buildMailtoHref(category) {
  const subject = encodeURIComponent(`Reservation inquiry — ${category.title}`);
  const body = encodeURIComponent(buildRoomSummaryText(category));
  return `mailto:info@lifehotelnyc.com?subject=${subject}&body=${body}`;
}

function bindModalActionsOnce() {
  if (!modalActions || modalActions.dataset.bound) return;
  modalActions.dataset.bound = "1";
  modalActions.addEventListener("click", (event) => {
    const target = event.target;
    if (!(target instanceof HTMLElement)) return;
    if (target.matches("[data-action='copy-room']")) {
      if (!lastOpenedRoom) return;
      const text = buildRoomSummaryText(lastOpenedRoom);
      const done = () => showToast("Room details copied to clipboard.");
      if (navigator.clipboard && navigator.clipboard.writeText) {
        navigator.clipboard.writeText(text).then(done).catch(() => showToast("Unable to copy—select and copy manually."));
      } else {
        showToast("Clipboard not available in this browser.");
      }
    }
  });
}

function initDefaultBookingDates() {
  if (!checkInInput || !checkOutInput) return;

  const today = new Date();
  today.setHours(0, 0, 0, 0);
  const minStr = today.toISOString().slice(0, 10);
  checkInInput.min = minStr;
  checkOutInput.min = minStr;

  if (!checkInInput.value) {
    const ci = new Date(today);
    ci.setDate(ci.getDate() + 7);
    checkInInput.value = ci.toISOString().slice(0, 10);
  }
  if (!checkOutInput.value) {
    const base = new Date(`${checkInInput.value}T12:00:00`);
    const co = new Date(base);
    co.setDate(co.getDate() + 3);
    checkOutInput.value = co.toISOString().slice(0, 10);
  }

  checkOutInput.min = checkInInput.value;

  checkInInput.addEventListener("change", () => {
    checkOutInput.min = checkInInput.value;
    const ci = new Date(`${checkInInput.value}T12:00:00`);
    let co = new Date(`${checkOutInput.value}T12:00:00`);
    if (!checkOutInput.value || co <= ci) {
      co = new Date(ci);
      co.setDate(co.getDate() + 1);
      checkOutInput.value = co.toISOString().slice(0, 10);
    }
  });
}

function initAccommodationShortcuts() {
  document.querySelectorAll(".accommodation-card-action").forEach((card) => {
    const go = () => {
      const t = card.getAttribute("data-room-type");
      if (typeFilter && t) typeFilter.value = t;
      if (floorFilter) floorFilter.value = "all";
      if (roomSearchInput) roomSearchInput.value = "";
      displayRooms();
      document.getElementById("rooms")?.scrollIntoView({ behavior: "smooth" });
    };
    card.addEventListener("click", go);
    card.addEventListener("keydown", (event) => {
      if (event.key === "Enter" || event.key === " ") {
        event.preventDefault();
        go();
      }
    });
  });
}

function initOfferCards() {
  document.querySelectorAll(".offer-card-select").forEach((btn) => {
    btn.addEventListener("click", () => {
      const id = btn.getAttribute("data-offer");
      if (!id) return;

      if (selectedOfferId === id) {
        selectedOfferId = null;
        btn.setAttribute("aria-pressed", "false");
        btn.classList.remove("offer-card--active");
        showToast("Package removed.");
        return;
      }

      document.querySelectorAll(".offer-card-select").forEach((b) => {
        b.classList.remove("offer-card--active");
        b.setAttribute("aria-pressed", "false");
      });

      selectedOfferId = id;
      btn.classList.add("offer-card--active");
      btn.setAttribute("aria-pressed", "true");
      const title = OFFER_DEFS[id]?.title || "Package";
      showToast(`${title} applied. Open a category for an updated sample estimate.`);
    });
  });
}

function openInfoModal(key) {
  const page = INFO_PAGES[key];
  if (!page || !infoModal || !infoModalTitle || !infoModalBody) return;

  if (infoModalEyebrow) infoModalEyebrow.textContent = page.eyebrow;
  infoModalTitle.textContent = page.title;
  infoModalBody.innerHTML = page.html;

  infoModal.classList.remove("hidden");
}

function closeInfoModal() {
  if (infoModal) infoModal.classList.add("hidden");
}

function initInfoModal() {
  document.querySelectorAll("[data-info-modal]").forEach((btn) => {
    btn.addEventListener("click", () => {
      const key = btn.getAttribute("data-info-modal");
      if (key) openInfoModal(key);
    });
  });

  if (infoModalClose) infoModalClose.addEventListener("click", closeInfoModal);
  if (infoModalBackdrop) infoModalBackdrop.addEventListener("click", closeInfoModal);
}

if (floorFilter) {
  for (let i = 1; i <= 10; i++) {
    const option = document.createElement("option");
    option.value = i;
    option.textContent = `Floor ${i}`;
    floorFilter.appendChild(option);
  }
}

function categoryCardTemplate(category) {
  return `
    <div class="room-top">
      <div>
        <h3 class="room-number">${category.title}</h3>
        <div class="room-floor">${category.floorLabel}</div>
      </div>
    </div>
    <div class="room-meta">
      <div class="room-type">${category.type}</div>
      <div class="room-desc">From $${category.nightlyRate} / night · ${category.occupancy}</div>
    </div>
  `;
}

function displayRooms() {
  if (!roomsContainer || !floorFilter || !typeFilter) return;

  const selectedFloor = floorFilter.value;
  const selectedType = typeFilter.value;
  const guests = guestCountSelect ? Number(guestCountSelect.value || 1) : 1;
  const searchQ = roomSearchInput ? roomSearchInput.value.trim().toLowerCase() : "";

  const filteredCategories = roomCategories.filter((category) => {
    const floorNum = Number(selectedFloor);
    const matchesFloor =
      selectedFloor === "all" ||
      (floorNum >= category.floorMin && floorNum <= category.floorMax);

    const matchesType =
      selectedType === "all" || category.type === selectedType;

    const matchesGuests = category.maxGuests >= guests;

    const haystack = `${category.title} ${category.type} ${category.description} ${category.id}`.toLowerCase();
    const matchesSearch = !searchQ || haystack.includes(searchQ);

    return matchesFloor && matchesType && matchesGuests && matchesSearch;
  });

  roomsContainer.innerHTML = "";

  if (filteredCategories.length === 0) {
    roomsContainer.innerHTML = `
      <div style="grid-column: 1 / -1; padding: 24px; border: 1px solid rgba(255,255,255,0.08); border-radius: 18px; color: #b7c0cc;">
        No room categories match your filters. Try another floor, type, or guest count—or contact the hotel for options.
      </div>
    `;
    return;
  }

  filteredCategories.forEach((category) => {
    const card = document.createElement("div");
    card.className = "room-card";
    card.innerHTML = categoryCardTemplate(category);
    card.addEventListener("click", () => openModal(category));
    roomsContainer.appendChild(card);
  });
}

function openModal(category) {
  if (!roomModal || !modalTitle || !modalDetails) return;

  lastOpenedRoom = category;
  const nights = getStayNights();
  const { baseRate, rate, discount, promoLabel, promoNote } = getPricingForRoom(category);

  modalTitle.textContent = category.title;

  const rateRow =
    discount > 0
      ? `<div class="modal-detail-row"><strong>Sample rate:</strong> <s style="opacity:0.55">$${baseRate}</s> $${rate} / night <span style="color:var(--gold-soft)">(package)</span></div>`
      : `<div class="modal-detail-row"><strong>Sample rate:</strong> $${rate} / night</div>`;

  const stayBlock =
    nights && nights > 0
      ? `<div class="modal-detail-row"><strong>Your dates:</strong> ${checkInInput?.value || "—"} → ${checkOutInput?.value || "—"} (${nights} night${nights > 1 ? "s" : ""})</div>
         <div class="modal-detail-row"><strong>Est. total (sample):</strong> $${rate * nights} <span style="opacity:0.75;font-size:0.9em">before taxes & fees</span></div>`
      : `<div class="modal-detail-row"><strong>Tip:</strong> Add check-in and check-out under Reserve Your Stay to estimate a stay total.</div>`;

  const promoBlock = [
    promoLabel ? `<div class="modal-detail-row"><strong>Package:</strong> ${promoLabel}</div>` : "",
    promoNote && selectedOfferId ? `<div class="modal-detail-row" style="color:#e8c96a"><strong>Note:</strong> ${promoNote}</div>` : ""
  ]
    .filter(Boolean)
    .join("");

  modalDetails.innerHTML = `
    <div class="modal-detail-row"><strong>Category type:</strong> ${category.type}</div>
    <div class="modal-detail-row"><strong>Typical location:</strong> ${category.floorLabel}</div>
    ${rateRow}
    ${stayBlock}
    ${promoBlock}
    <div class="modal-detail-row"><strong>Occupancy:</strong> ${category.occupancy}</div>
    <div class="modal-detail-row"><strong>Description:</strong> ${category.description}</div>
    <div class="modal-detail-row"><strong>Features:</strong> ${category.features.join(", ")}</div>
    <p class="modal-disclaimer">We do not display which specific rooms are occupied or vacant. Final availability and room assignment are confirmed only through the official booking process or hotel staff.</p>
  `;

  if (modalActions) {
    modalActions.innerHTML = `
      <button type="button" class="btn btn-gold" data-action="copy-room">Copy details</button>
      <a class="btn btn-outline" id="modalEmailLink">Email reservation request</a>
    `;
    const mailLink = modalActions.querySelector("#modalEmailLink");
    if (mailLink) mailLink.href = buildMailtoHref(category);
    bindModalActionsOnce();
  }

  roomModal.classList.remove("hidden");
}

function closeModal() {
  if (roomModal) {
    roomModal.classList.add("hidden");
  }
}

function formatRoomType(value) {
  if (value === "all") return "all room types";
  return value;
}

function openAvailabilityPopup(title, message, showViewRooms = true) {
  if (!availabilityPopup || !availabilityTitle || !availabilityMessage || !availabilityViewRooms) return;

  availabilityTitle.textContent = title;
  availabilityMessage.textContent = message;
  availabilityViewRooms.style.display = showViewRooms ? "inline-flex" : "none";
  availabilityPopup.classList.remove("hidden");
}

function closeAvailabilityPopup() {
  if (availabilityPopup) {
    availabilityPopup.classList.add("hidden");
  }
}

function openLocationPopup(place) {
  const info = nycLocations[place];
  if (!info || !locationPopup) return;

  locationTitle.textContent = place;
  locationAddress.textContent = info.address;
  locationDistance.textContent = info.distance;
  locationMapLink.href = info.mapsUrl;

  locationPopup.classList.remove("hidden");
}

function closeLocationPopup() {
  if (locationPopup) {
    locationPopup.classList.add("hidden");
  }
}

function handleCheckAvailability() {
  if (
    !checkInInput ||
    !checkOutInput ||
    !guestCountSelect ||
    !bookingRoomTypeSelect ||
    !floorFilter ||
    !typeFilter
  ) {
    return;
  }

  const checkIn = checkInInput.value;
  const checkOut = checkOutInput.value;
  const guests = Number(guestCountSelect.value);
  const selectedRoomType = bookingRoomTypeSelect.value;

  if (!checkIn || !checkOut) {
    openAvailabilityPopup(
      "Select Your Dates",
      "Please choose both a check-in and check-out date to explore room categories that fit your stay.",
      false
    );
    return;
  }

  if (new Date(checkOut) <= new Date(checkIn)) {
    openAvailabilityPopup(
      "Update Your Stay Details",
      "Your check-out date must be after your check-in date. Please adjust your selection and try again.",
      false
    );
    return;
  }

  floorFilter.value = "all";
  typeFilter.value = selectedRoomType;
  if (roomSearchInput) roomSearchInput.value = "";

  displayRooms();

  const matchingCategories = roomCategories.filter((category) => {
    const matchesType =
      selectedRoomType === "all" || category.type === selectedRoomType;
    const matchesGuests = category.maxGuests >= guests;

    return matchesType && matchesGuests;
  });

  if (matchingCategories.length === 0) {
    openAvailabilityPopup(
      "Adjust Your Search",
      `No room categories match ${formatRoomType(selectedRoomType)} for ${guests} guest${guests > 1 ? "s" : ""}. Try another room type or guest count, or contact the hotel for options.`,
      false
    );
    return;
  }

  const catLabel = matchingCategories.length === 1 ? "category" : "categories";
  const offerHint =
    selectedOfferId && OFFER_DEFS[selectedOfferId]
      ? ` Package selected: ${OFFER_DEFS[selectedOfferId].title} (see each category for eligibility).`
      : "";

  openAvailabilityPopup(
    "Explore Your Options",
    `Here are ${matchingCategories.length} room ${catLabel} that fit your party size and type preference.${offerHint} Sample rates are for planning only—confirm availability when you book or email us. We never show live vacancy online.`,
    true
  );
}

function initOverlayMenu() {
  if (!menuToggle || !overlayMenu || !overlayClose) return;

  menuToggle.addEventListener("click", () => {
    overlayMenu.classList.remove("hidden");
  });

  overlayClose.addEventListener("click", () => {
    overlayMenu.classList.add("hidden");
  });

  overlayMenu.addEventListener("click", (event) => {
    if (event.target === overlayMenu) {
      overlayMenu.classList.add("hidden");
    }
  });

  overlayMenu.querySelectorAll("a").forEach((link) => {
    link.addEventListener("click", () => {
      overlayMenu.classList.add("hidden");
    });
  });
}

function initHeroSlideshow() {
  if (heroSlides.length <= 1) return;

  let currentSlide = 0;

  setInterval(() => {
    heroSlides[currentSlide].classList.remove("active");
    currentSlide = (currentSlide + 1) % heroSlides.length;
    heroSlides[currentSlide].classList.add("active");
  }, 4500);
}

function initNewsletterForm() {
  if (!newsletterForm) return;

  newsletterForm.addEventListener("submit", (event) => {
    event.preventDefault();

    if (newsletterError) {
      newsletterError.textContent = "";
      newsletterError.classList.add("hidden");
    }

    const email = newsletterEmail ? newsletterEmail.value.trim() : "";
    const name = document.getElementById("newsletterName")?.value.trim() || "";

    if (!email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      if (newsletterError) {
        newsletterError.textContent = "Please enter a valid email address.";
        newsletterError.classList.remove("hidden");
      }
      newsletterEmail?.focus();
      return;
    }

    try {
      const raw = localStorage.getItem("lifeHotelNewsletterDemo");
      const list = raw ? JSON.parse(raw) : [];
      list.push({ email, name, at: new Date().toISOString() });
      localStorage.setItem("lifeHotelNewsletterDemo", JSON.stringify(list.slice(-50)));
    } catch {
      /* ignore storage errors */
    }

    openAvailabilityPopup(
      "Thank You",
      "You’re signed up for hotel news, offers, and New York updates (saved locally in this browser for this demo).",
      false
    );

    newsletterForm.reset();
  });
}

if (floorFilter) floorFilter.addEventListener("change", displayRooms);
if (typeFilter) typeFilter.addEventListener("change", displayRooms);
if (guestCountSelect) guestCountSelect.addEventListener("change", displayRooms);

if (roomSearchInput) {
  roomSearchInput.addEventListener("input", displayRooms);
  roomSearchInput.addEventListener("search", displayRooms);
}

if (checkAvailabilityBtn) {
  checkAvailabilityBtn.addEventListener("click", handleCheckAvailability);
}

if (modalClose) modalClose.addEventListener("click", closeModal);
if (modalBackdrop) modalBackdrop.addEventListener("click", closeModal);

if (availabilityClose) availabilityClose.addEventListener("click", closeAvailabilityPopup);
if (availabilityDismiss) availabilityDismiss.addEventListener("click", closeAvailabilityPopup);

if (availabilityViewRooms) {
  availabilityViewRooms.addEventListener("click", () => {
    closeAvailabilityPopup();
    const roomsSection = document.getElementById("rooms");
    if (roomsSection) {
      roomsSection.scrollIntoView({ behavior: "smooth" });
    }
  });
}

if (availabilityPopup) {
  availabilityPopup.addEventListener("click", (event) => {
    if (event.target === availabilityPopup) {
      closeAvailabilityPopup();
    }
  });
}

exploreButtons.forEach((button) => {
  button.addEventListener("click", () => {
    openLocationPopup(button.dataset.place);
  });
});

if (locationClose) locationClose.addEventListener("click", closeLocationPopup);
if (locationDismiss) locationDismiss.addEventListener("click", closeLocationPopup);

if (locationPopup) {
  locationPopup.addEventListener("click", (event) => {
    if (event.target === locationPopup) {
      closeLocationPopup();
    }
  });
}

document.addEventListener("keydown", (event) => {
  if (event.key === "Escape") {
    closeModal();
    closeAvailabilityPopup();
    closeLocationPopup();
    closeInfoModal();

    if (overlayMenu && !overlayMenu.classList.contains("hidden")) {
      overlayMenu.classList.add("hidden");
    }
  }
});

initDefaultBookingDates();
initOverlayMenu();
initHeroSlideshow();
initNewsletterForm();
initAccommodationShortcuts();
initOfferCards();
initInfoModal();
displayRooms();

const chatButton = document.getElementById("chat-button");
const chatWindow = document.getElementById("chat-window");
const chatClose = document.getElementById("chat-close");
const chatSend = document.getElementById("chat-send");
const chatInput = document.getElementById("chat-input");
const chatMessages = document.getElementById("chat-messages");

const conciergeUrl =
  typeof window !== "undefined" && window.LIFE_HOTEL_CONCIERGE_URL
    ? String(window.LIFE_HOTEL_CONCIERGE_URL)
    : "/api/concierge";

/** OpenAI turns only (system prompt is applied on the server). */
const conciergeHistory = [];
let chatLoading = false;
let typingRow = null;

function trimConciergeHistory() {
  while (conciergeHistory.length > 20) {
    conciergeHistory.shift();
  }
}

function addChatMessage(text, type) {
  if (!chatMessages) return;

  const msg = document.createElement("div");
  msg.className = `chat-message ${type}`;
  msg.textContent = text;
  chatMessages.appendChild(msg);
  chatMessages.scrollTop = chatMessages.scrollHeight;
}

function setTypingIndicator(on) {
  if (!chatMessages) return;
  if (typingRow && typingRow.parentNode) {
    typingRow.remove();
  }
  typingRow = null;
  if (on) {
    typingRow = document.createElement("div");
    typingRow.className = "chat-message bot chat-typing";
    typingRow.textContent = "Thinking…";
    chatMessages.appendChild(typingRow);
    chatMessages.scrollTop = chatMessages.scrollHeight;
  }
}

function setChatBusy(busy) {
  if (chatSend) chatSend.disabled = busy;
  if (chatInput) chatInput.disabled = busy;
}

async function sendChatMessage() {
  if (!chatInput || chatLoading) return;

  const text = chatInput.value.trim();
  if (!text) return;

  addChatMessage(text, "user");
  chatInput.value = "";
  conciergeHistory.push({ role: "user", content: text });
  trimConciergeHistory();

  chatLoading = true;
  setChatBusy(true);
  setTypingIndicator(true);

  try {
    const res = await fetch(conciergeUrl, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ messages: conciergeHistory })
    });

    let data = {};
    try {
      data = await res.json();
    } catch {
      data = {};
    }

    setTypingIndicator(false);

    if (!res.ok) {
      const errText =
        typeof data.error === "string"
          ? data.error
          : "The concierge service is not available. If you’re previewing files directly, run `dev-server.mjs` with OPENAI_API_KEY set and open the site from that server—or call (212) 615-9900.";
      addChatMessage(errText, "bot");
      conciergeHistory.push({ role: "assistant", content: errText });
      trimConciergeHistory();
      return;
    }

    const reply = typeof data.reply === "string" ? data.reply.trim() : "";
    if (!reply) {
      const fallback =
        "I didn’t get a reply back. Please try again in a moment, or call (212) 615-9900.";
      addChatMessage(fallback, "bot");
      conciergeHistory.push({ role: "assistant", content: fallback });
      trimConciergeHistory();
      return;
    }

    addChatMessage(reply, "bot");
    conciergeHistory.push({ role: "assistant", content: reply });
    trimConciergeHistory();
  } catch {
    setTypingIndicator(false);
    const offline =
      "I can’t reach the AI service from this page. Serve the site with `node dev-server.mjs` (OPENAI_API_KEY set), use the same host/port, then try again—or email info@lifehotelnyc.com.";
    addChatMessage(offline, "bot");
    conciergeHistory.push({ role: "assistant", content: offline });
    trimConciergeHistory();
  } finally {
    chatLoading = false;
    setChatBusy(false);
  }
}

if (chatButton && chatWindow) {
  chatButton.addEventListener("click", () => {
    chatWindow.classList.toggle("hidden");
  });
}

if (chatClose && chatWindow) {
  chatClose.addEventListener("click", () => {
    chatWindow.classList.add("hidden");
  });
}

if (chatSend) {
  chatSend.addEventListener("click", sendChatMessage);
}

if (chatInput) {
  chatInput.addEventListener("keydown", (event) => {
    if (event.key === "Enter") {
      sendChatMessage();
    }
  });
}

const appTabMenu = document.getElementById("appTabMenu");
if (appTabMenu && menuToggle) {
  appTabMenu.addEventListener("click", () => {
    menuToggle.click();
  });
}