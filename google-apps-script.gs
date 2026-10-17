/**
 * ============================================================
 * WEDDING RSVP — GOOGLE APPS SCRIPT BACKEND
 * ============================================================
 * This script turns a Google Sheet into the database for the
 * wedding invitation's RSVP form and wishes wall.
 *
 * SETUP (see README.md for the full walkthrough):
 * 1. Create a new Google Sheet.
 * 2. Extensions > Apps Script, paste this whole file in.
 * 3. Run setupSheet() once (top toolbar > Run > setupSheet)
 *    to create the header row automatically.
 * 4. Deploy > New deployment > Web app
 *      - Execute as: Me
 *      - Who has access: Anyone
 * 5. Copy the Web App URL into CONFIG.scriptURL in index.html.
 * ============================================================
 */

const SHEET_NAME = 'RSVP';

/**
 * Run this once manually from the Apps Script editor to create
 * the header row. Safe to re-run — it won't duplicate headers.
 */
function setupSheet() {
  const ss = SpreadsheetApp.getActiveSpreadsheet();
  let sheet = ss.getSheetByName(SHEET_NAME);
  if (!sheet) {
    sheet = ss.insertSheet(SHEET_NAME);
  }
  const headers = ['Timestamp', 'Name', 'Attendance', 'Guests', 'Message'];
  const firstRow = sheet.getRange(1, 1, 1, headers.length).getValues()[0];
  const alreadySet = headers.every((h, i) => firstRow[i] === h);
  if (!alreadySet) {
    sheet.getRange(1, 1, 1, headers.length).setValues([headers]);
    sheet.getRange(1, 1, 1, headers.length).setFontWeight('bold');
    sheet.setFrozenRows(1);
  }
}

/**
 * Handles POST requests — used for new RSVP submissions.
 * Body: { action: 'addRSVP', name, attendance, guests, message }
 */
function doPost(e) {
  try {
    const body = JSON.parse(e.postData.contents);

    if (body.action === 'addRSVP') {
      return addRSVP(body);
    }

    return jsonResponse({ status: 'error', message: 'Unknown action' });
  } catch (err) {
    return jsonResponse({ status: 'error', message: err.message });
  }
}

/**
 * Handles GET requests — used to fetch wishes for the wishes wall.
 * Query: ?action=getWishes
 */
function doGet(e) {
  try {
    const action = e.parameter.action;

    if (action === 'getWishes') {
      return getWishes();
    }

    return jsonResponse({ status: 'error', message: 'Unknown action' });
  } catch (err) {
    return jsonResponse({ status: 'error', message: err.message });
  }
}

function addRSVP(data) {
  const sheet = getSheet();
  sheet.appendRow([
    new Date(),
    data.name || '',
    data.attendance || '',
    data.guests || '',
    data.message || ''
  ]);
  return jsonResponse({ status: 'success' });
}

function getWishes() {
  const sheet = getSheet();
  const values = sheet.getDataRange().getValues();
  // values[0] is the header row: Timestamp, Name, Attendance, Guests, Message
  const rows = values.slice(1);

  const wishes = rows
    .filter(row => row[4] && String(row[4]).trim() !== '') // only rows with a message
    .map(row => ({
      name: row[1],
      message: row[4]
    }));

  return jsonResponse({ status: 'success', data: wishes });
}

function getSheet() {
  const ss = SpreadsheetApp.getActiveSpreadsheet();
  let sheet = ss.getSheetByName(SHEET_NAME);
  if (!sheet) {
    sheet = ss.insertSheet(SHEET_NAME);
    setupSheet();
  }
  return sheet;
}

function jsonResponse(obj) {
  return ContentService
    .createTextOutput(JSON.stringify(obj))
    .setMimeType(ContentService.MimeType.JSON);
}
