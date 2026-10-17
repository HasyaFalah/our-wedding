# Wedding Invitation — Setup & Maintenance Guide

This package contains everything needed to run your digital wedding invitation:

```
wedding-invitation/
├── index.html              ← the website (edit CONFIG at the bottom of the <script> to personalize)
├── google-apps-script.gs   ← backend code that connects RSVP to Google Sheets
├── assets/                 ← put your photos, video, and music here
└── README.md               ← this file
```

I could not access a GitHub account, Google account, or the internet from my side, so the three
setup steps below need to be done by you. Each takes a couple of minutes.

---

## 1. Connect the RSVP form to Google Sheets

1. Go to [sheets.google.com](https://sheets.google.com) and create a new blank spreadsheet.
   Name it something like "Wedding RSVP Data".
2. In the sheet, go to **Extensions → Apps Script**.
3. Delete any starter code in the editor, then paste in the entire contents of
   `google-apps-script.gs` from this package.
4. Click **Save** (the disk icon), then in the function dropdown at the top pick
   `setupSheet` and click **Run**. The first time you run it, Google will ask you to
   authorize the script — click through **Review permissions → (your account) →
   Advanced → Go to [project name] (unsafe) → Allow**. This is expected: it's your own
   script running on your own sheet, Google just flags any unpublished script this way.
   This creates the header row (Timestamp, Name, Attendance, Guests, Message) in a tab
   called `RSVP`.
5. Click **Deploy → New deployment**.
   - Click the gear icon next to "Select type" and choose **Web app**.
   - Description: anything, e.g. "Wedding RSVP API".
   - Execute as: **Me**.
   - Who has access: **Anyone**.
   - Click **Deploy**, authorize again if asked.
6. Copy the **Web app URL** it gives you (ends in `/exec`).
7. Open `index.html`, find this line near the top of the `<script>` block:
   ```js
   scriptURL: "PASTE_YOUR_GOOGLE_APPS_SCRIPT_WEB_APP_URL_HERE"
   ```
   and replace the placeholder with the URL you copied.

That's it — every RSVP submission now becomes a new row in your Google Sheet in real time,
and the "Wedding Wishes" section on the site reads guest names + messages back from that
same sheet (it refreshes automatically every 30 seconds while someone has the page open).

**Whenever you redeploy the script** (e.g. after editing `google-apps-script.gs`), use
**Deploy → Manage deployments → edit (pencil) → New version → Deploy** rather than creating
a brand-new deployment — that way the URL in your site stays valid.

---

## 2. Personalize the content

Open `index.html` and edit the `CONFIG` object near the top of the `<script>` tag at the
bottom of the file — this is the only place you should need to touch:

```js
const CONFIG = {
  groom:  { name: "...", father: "...", mother: "..." },
  bride:  { name: "...", father: "...", mother: "..." },
  event: {
    dateTimeISO: "2026-12-12T09:00:00+07:00",   // used by the countdown + calendar
    displayDateTime: "Sabtu, 12 Desember 2026 — 09:00 WIB", // shown to guests
    endDateTimeISO: "2026-12-12T11:00:00+07:00",
    venueName: "...",
    venueAddress: "...",                         // full address, used for Maps + Calendar
    mapsQuery: "..."                              // what to search for on Google Maps
  },
  gift: { bank: "...", address: "..." },
  scriptURL: "..."  // from step 1
};
```

- `dateTimeISO` / `endDateTimeISO` must include your timezone offset (Jakarta = `+07:00`,
  Makassar = `+08:00`, Jayapura = `+09:00`) so the countdown and calendar event are correct.
- `mapsQuery` can just be the venue name if it's a well-known place, or the full address.

### Guest names in the invitation link
Send each guest a link like:
```
https://yourusername.github.io/your-repo/?to=Ade+Fitriyani
```
The opening screen will greet them by name automatically (spaces as `+` or `%20`).

---

## 3. Add your photos, video, and music

Drop your files into the `assets/` folder using these names (or update the paths in
`index.html` to match your own filenames):

- `assets/groom.jpg`, `assets/bride.jpg` — portrait photos. In `index.html`, replace each
  `<span class="portrait-placeholder">...</span>` with `<img src="assets/groom.jpg" alt="...">`
  (an example line is already commented directly above each placeholder).
- `assets/music.mp3` — background music. Add `<source src="assets/music.mp3" type="audio/mpeg">`
  inside the existing `<audio id="bg-music" loop>` tag.

**Before uploading, compress your media** so the site stays fast on mobile:
- Photos: resize to roughly 800–1200px on the longest side, export as JPG at ~75–80% quality.
  Free tools: [squoosh.app](https://squoosh.app) or [tinypng.com](https://tinypng.com).
- Music: an MP3 under ~3MB (128kbps is plenty for background music) keeps first load fast.
- If you want a pre-wedding video, keep it under ~15–20MB, in `.mp4` format, and host it
  in `assets/`. For anything larger, host it on YouTube (unlisted) and embed it instead —
  GitHub Pages isn't meant for large video files.

---

## 4. Deploy to GitHub Pages

1. Create a new repository on [github.com](https://github.com), e.g. `our-wedding`.
2. Upload the contents of this `wedding-invitation` folder to the repository
   (drag-and-drop through the GitHub web UI works fine, or use `git push` if you're
   comfortable with the command line).
3. In the repository, go to **Settings → Pages**.
4. Under "Build and deployment", set **Source** to **Deploy from a branch**, branch
   `main`, folder `/ (root)`. Click **Save**.
5. After a minute or two, your site will be live at:
   ```
   https://yourusername.github.io/your-repo/
   ```
6. Come back to `index.html`, double check the `CONFIG.scriptURL` is filled in, and
   commit/push the change if you edited it after the first deploy.

Every time you push a change to the repository, GitHub Pages automatically redeploys —
no separate build step needed, since this is a static HTML/CSS/JS site.

---

## Google Sheet structure

The `RSVP` tab created by `setupSheet()` has these columns:

| Timestamp | Name | Attendance | Guests | Message |
|---|---|---|---|---|
| 2026-08-30 10:15:00 | Ade Fitriyani | Attending | 2 | Wishing you both a lifetime of happiness! |

You can sort, filter, or export this sheet (File → Download → CSV/Excel) at any time —
it's a normal Google Sheet, the script only ever appends rows to it.

---

## Ongoing maintenance

- **Change wording/photos/dates**: edit `index.html` directly (the `CONFIG` object and
  the HTML text in each `<section>`), then push to GitHub — the live site updates
  automatically.
- **See RSVP counts**: open the Google Sheet directly any time; no need to touch the code.
- **Something looks broken after an edit**: open the site, then your browser's
  developer console (F12 → Console tab) — JavaScript errors will show there.
- **RSVP submissions stop working**: usually means the Apps Script deployment was
  replaced instead of updated. Go to Apps Script → Deploy → Manage deployments and
  confirm the `/exec` URL still matches what's in `CONFIG.scriptURL`.

---

## Requirements checklist

- [x] RSVP form (name, attendance, guest count, message) syncing to Google Sheets in real time, one row per submission
- [x] Wedding wishes section displaying guest name + message, auto-refreshing (~30s polling)
- [x] Countdown timer (days / hours / minutes / seconds)
- [x] Clickable venue address opening Google Maps
- [x] Clickable date/time opening Google Calendar with title, date, time, venue, and description pre-filled
- [x] All wedding info (names, parents, venue, date) centralized in one editable `CONFIG` object
- [x] Gift section ("Wanna give us some gifts?") with bank account + delivery address, elegant/minimal styling
- [x] Mobile-first, responsive, smooth-scrolling design with scroll-reveal fade-ins
- [x] Floating music toggle button
- [x] Opening "envelope" gate with personalized guest name from the invitation link
- [x] Frontend files, Apps Script code, Sheets integration instructions, GitHub Pages deployment steps, and maintenance instructions delivered
- [ ] Actual deployment to your GitHub Pages URL and live Google Sheet — requires your accounts (steps 1 and 4 above); I don't have access to create these on your behalf
- [ ] Real photos/video/music — no media files were attached to hand off, so placeholders are in `assets/` and `index.html` with clear swap-in instructions
