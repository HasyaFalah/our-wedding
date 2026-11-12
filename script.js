/* ================================================================
   CONFIG — edit everything here. This is the ONLY place you should
   need to touch to personalize the invitation.
   ================================================================ */
const CONFIG = {
  groom: {
    name: "Falah Kharisma",
    coverName: "Falah",
    father: "Daud Adhi Suharto",
    mother: "Hartati"
  },
  bride: {
    name: "Hasya Syabilla\nPutri Basae",
    coverName: "Hasya",
    father: "Hasbillah",
    mother: "Nur Syahidah"
  },
  event: {
    // ISO 8601 format, include timezone offset for your region, e.g. Jakarta = +07:00
    dateTimeISO: "2027-01-10T09:00:00+07:00",
    displayDateTime: "Minggu, 10 Januari 2027\n09:00 - 13:00 WIB", // human-readable, e.g. "Sabtu, 12 Desember 2026 — 09:00 WIB"
    title: "Akad Nikah & Resepsi",
    endDateTimeISO: "2027-01-10T13:00:00+07:00", // used for Calendar event end time
    venueName: "Sepiring Nusantara",
    venueAddress: "Jl. Raya Karadenan No.88, RT.03/RW.10, Karadenan, Kec. Cibinong, Kabupaten Bogor, Jawa Barat 16913", // full address used for Google Maps + Calendar description
    mapsQuery: "Sepiring Nusantara" // venue name/address as it should appear in a Google Maps search
  },
  gift: {
    bank: "Krom Bank",
    account: "770009707897",
    name: "a.n Hasya Syabilla Putri Basae",
    address: "Tamansari Persada, Cluster Taman Orchid Blok C6/12A Cibadak, Kec. Tanah Sareal, Kota Bogor, Jawa Barat 16166"
  },
  // Google Apps Script Web App URL (see google-apps-script.gs + README for setup)
  scriptURL: "https://script.google.com/macros/s/AKfycbx1I1VhPSb41jq8KZQ5ZfEN09JWDXacP_27jhpYga2ytrsS2AQ5V6z1LSsc27-UUlN8/exec"
};

/* ================================================================
   POPULATE CONTENT FROM CONFIG
   ================================================================ */
document.getElementById('cover-groom').textContent = CONFIG.groom.coverName || CONFIG.groom.name;
document.getElementById('cover-bride').textContent = CONFIG.bride.coverName || CONFIG.bride.name;
document.getElementById('cover-date').textContent = CONFIG.event.displayDateTime;
document.getElementById('groom-name').textContent = CONFIG.groom.name;
document.getElementById('bride-name').textContent = CONFIG.bride.name;
document.querySelectorAll('.groom-father').forEach(el => el.textContent = CONFIG.groom.father);
document.querySelectorAll('.groom-mother').forEach(el => el.textContent = CONFIG.groom.mother);
document.querySelectorAll('.bride-father').forEach(el => el.textContent = CONFIG.bride.father);
document.querySelectorAll('.bride-mother').forEach(el => el.textContent = CONFIG.bride.mother);
document.getElementById('event-datetime-1').textContent = CONFIG.event.displayDateTime;
document.getElementById('event-venue-1').textContent = CONFIG.event.venueName;
document.getElementById('map-address').textContent = CONFIG.event.venueAddress;
document.getElementById('gift-bank').textContent = CONFIG.gift.bank;
document.getElementById('gift-address').textContent = CONFIG.gift.address;
document.getElementById('gift-account').textContent = CONFIG.gift.account;
document.getElementById('gift-name').textContent = CONFIG.gift.name;

/* ================================================================
   GUEST NAME FROM URL — e.g. invite.html?to=Ade+Fitriyani
   ================================================================ */
const urlParams = new URLSearchParams(window.location.search);
const guestName = urlParams.get('to');
if (guestName) {
  document.getElementById('gate-guest-name').textContent = decodeURIComponent(guestName.replace(/\+/g, ' '));
}

/* ================================================================
   OPENING GATE
   ================================================================ */
document.getElementById('open-invitation').addEventListener('click', () => {
  document.getElementById('gate').classList.add('hidden');
  document.body.style.overflow = 'auto';
  const audio = document.getElementById('bg-music');
  audio.play().then(() => {
    document.getElementById('music-toggle').classList.add('playing');
  }).catch(() => { /* autoplay blocked — user can tap the music button */ });
});
document.body.style.overflow = 'hidden'; // lock scroll until gate opens

/* ================================================================
   MUSIC TOGGLE
   ================================================================ */
const musicBtn = document.getElementById('music-toggle');
const bgMusic = document.getElementById('bg-music');
bgMusic.volume = 0.2;
musicBtn.addEventListener('click', () => {
  if (bgMusic.paused) {
    bgMusic.play();
    musicBtn.classList.add('playing');
  } else {
    bgMusic.pause();
    musicBtn.classList.remove('playing');
  }
});

/* ================================================================
   SCROLL REVEAL ANIMATION
   ================================================================ */
const revealEls = document.querySelectorAll('.reveal');
const observer = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      entry.target.classList.add('is-visible');
      observer.unobserve(entry.target);
    }
  });
}, { threshold: 0.15 });
revealEls.forEach(el => observer.observe(el));

/* ================================================================
   COUNTDOWN TIMER
   ================================================================ */
function updateCountdown() {
  const target = new Date(CONFIG.event.dateTimeISO).getTime();
  const now = Date.now();
  const diff = target - now;

  if (diff <= 0) {
    ['cd-days','cd-hours','cd-minutes','cd-seconds'].forEach(id => document.getElementById(id).textContent = '00');
    return;
  }
  const days = Math.floor(diff / (1000*60*60*24));
  const hours = Math.floor((diff % (1000*60*60*24)) / (1000*60*60));
  const minutes = Math.floor((diff % (1000*60*60)) / (1000*60));
  const seconds = Math.floor((diff % (1000*60)) / 1000);

  document.getElementById('cd-days').textContent = String(days).padStart(2,'0');
  document.getElementById('cd-hours').textContent = String(hours).padStart(2,'0');
  document.getElementById('cd-minutes').textContent = String(minutes).padStart(2,'0');
  document.getElementById('cd-seconds').textContent = String(seconds).padStart(2,'0');
}
updateCountdown();
setInterval(updateCountdown, 1000);

/* ================================================================
   GOOGLE MAPS LINK
   ================================================================ */
const mapsURL = `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(CONFIG.event.mapsQuery || CONFIG.event.venueAddress)}`;
document.getElementById('btn-maps').href = mapsURL;
document.getElementById('map-image-link').href = mapsURL;

/* ================================================================
   GOOGLE CALENDAR "SAVE THE DATE" LINK
   ================================================================ */
function toGCalDate(isoString) {
  // Google Calendar wants UTC in format YYYYMMDDTHHMMSSZ
  const d = new Date(isoString);
  return d.toISOString().replace(/[-:]/g, '').split('.')[0] + 'Z';
}
document.getElementById('btn-calendar').addEventListener('click', () => {
  const start = toGCalDate(CONFIG.event.dateTimeISO);
  const end = toGCalDate(CONFIG.event.endDateTimeISO || CONFIG.event.dateTimeISO);
  const title = `Pernikahan ${CONFIG.groom.name} & ${CONFIG.bride.name}`;
  const details = `${CONFIG.event.title} — ${CONFIG.groom.name} & ${CONFIG.bride.name}\n${CONFIG.event.venueAddress}`;
  const location = CONFIG.event.venueAddress;

  const gcalURL = `https://calendar.google.com/calendar/render?action=TEMPLATE` +
    `&text=${encodeURIComponent(title)}` +
    `&dates=${start}/${end}` +
    `&details=${encodeURIComponent(details)}` +
    `&location=${encodeURIComponent(location)}`;

  window.open(gcalURL, '_blank');
});

/* ================================================================
   RSVP RADIO TOGGLE (visual state)
   ================================================================ */
document.querySelectorAll('#attendance-group .radio-option').forEach(opt => {
  opt.addEventListener('click', () => {
    document.querySelectorAll('#attendance-group .radio-option').forEach(o => o.classList.remove('active'));
    opt.classList.add('active');
    opt.querySelector('input').checked = true;
  });
});

/* ================================================================
   RSVP FORM SUBMISSION → GOOGLE SHEETS (via Apps Script Web App)
   ================================================================ */
const rsvpForm = document.getElementById('rsvp-form');
const rsvpMsg = document.getElementById('rsvp-msg');
const rsvpSubmitBtn = document.getElementById('rsvp-submit');

rsvpForm.addEventListener('submit', async (e) => {
  e.preventDefault();

  if (!CONFIG.scriptURL || CONFIG.scriptURL.includes('PASTE_YOUR')) {
    rsvpMsg.textContent = 'RSVP belum terhubung. Lengkapi scriptURL di CONFIG (lihat README).';
    rsvpMsg.className = 'form-msg error';
    return;
  }

  const formData = new FormData(rsvpForm);
  const payload = {
    name: formData.get('name'),
    attendance: formData.get('attendance'),
    guests: formData.get('guests'),
    message: formData.get('message') || ''
  };

  rsvpSubmitBtn.disabled = true;
  rsvpSubmitBtn.textContent = 'Mengirim...';
  rsvpMsg.textContent = '';
  rsvpMsg.className = 'form-msg';

  try {
    // Apps Script Web Apps require 'text/plain' content-type to avoid
    // a CORS preflight request, which Apps Script cannot answer.
    const response = await fetch(CONFIG.scriptURL, {
      method: 'POST',
      headers: { 'Content-Type': 'text/plain;charset=utf-8' },
      body: JSON.stringify({ action: 'addRSVP', ...payload })
    });
    const result = await response.json();

    if (result.status === 'success') {
      rsvpMsg.textContent = 'Terima kasih! RSVP Anda telah kami terima.';
      rsvpMsg.className = 'form-msg success';
      rsvpForm.reset();
      document.querySelectorAll('#attendance-group .radio-option').forEach(o => o.classList.remove('active'));
      document.querySelector('#attendance-group .radio-option[data-value="Attending"]').classList.add('active');
      loadWishes(); // refresh wishes list to show the new message
    } else {
      throw new Error(result.message || 'Unknown error');
    }
  } catch (err) {
    rsvpMsg.textContent = 'Gagal mengirim. Silakan coba lagi.';
    rsvpMsg.className = 'form-msg error';
    console.error('RSVP submission error:', err);
  } finally {
    rsvpSubmitBtn.disabled = false;
    rsvpSubmitBtn.textContent = 'Kirim RSVP';
  }
});

/* ================================================================
   LOAD WEDDING WISHES FROM GOOGLE SHEETS
   ================================================================ */
async function loadWishes() {
  const list = document.getElementById('wishes-list');

  if (!CONFIG.scriptURL || CONFIG.scriptURL.includes('PASTE_YOUR')) {
    list.innerHTML = '<div class="wishes-empty">Ucapan akan tampil di sini setelah RSVP terhubung ke Google Sheets.</div>';
    return;
  }

  try {
    const response = await fetch(`${CONFIG.scriptURL}?action=getWishes`);
    const result = await response.json();

    if (!result.data || result.data.length === 0) {
      list.innerHTML = '<div class="wishes-empty">Jadilah yang pertama mengirimkan ucapan!</div>';
      return;
    }

    // newest first
    const items = result.data.slice().reverse();
    list.innerHTML = items.map(w => `
      <div class="wish-card">
        <div class="wish-name">${escapeHTML(w.name)}</div>
        <div class="wish-text">"${escapeHTML(w.message)}"</div>
      </div>
    `).join('');
  } catch (err) {
    list.innerHTML = '<div class="wishes-empty">Tidak dapat memuat ucapan saat ini.</div>';
    console.error('Load wishes error:', err);
  }
}
function escapeHTML(str) {
  const div = document.createElement('div');
  div.textContent = str || '';
  return div.innerHTML;
}
document.getElementById('wishes-refresh').addEventListener('click', loadWishes);
loadWishes();
// Poll every 30s for near-real-time updates while the page is open
setInterval(loadWishes, 30000);

/* ================================================================
   COPY BANK NUMBER
   ================================================================ */
document.getElementById('copy-bank').addEventListener('click', () => {
  navigator.clipboard.writeText(CONFIG.gift.account).then(() => {
    const btn = document.getElementById('copy-bank');
    const original = btn.textContent;
    btn.textContent = 'Tersalin!';
    setTimeout(() => btn.textContent = original, 1800);
  });
});