const SPREADSHEET_NAME = '2026_公司旅遊';
const SHEET_NAME = '報名資料';
const HEADERS = ['姓名', 'Email', '單位', '電話', '職稱', '報名時間'];

function setup() {
  const properties = PropertiesService.getScriptProperties();
  let spreadsheetId = properties.getProperty('SPREADSHEET_ID');
  let spreadsheet;

  if (spreadsheetId) {
    try {
      spreadsheet = SpreadsheetApp.openById(spreadsheetId);
    } catch (error) {
      spreadsheetId = null;
    }
  }

  if (!spreadsheetId) {
    const files = DriveApp.getFilesByName(SPREADSHEET_NAME);
    while (files.hasNext()) {
      const file = files.next();
      if (file.getMimeType() === MimeType.GOOGLE_SHEETS) {
        spreadsheet = SpreadsheetApp.openById(file.getId());
        break;
      }
    }
    if (!spreadsheet) spreadsheet = SpreadsheetApp.create(SPREADSHEET_NAME);
    spreadsheetId = spreadsheet.getId();
    properties.setProperty('SPREADSHEET_ID', spreadsheetId);
  }

  let sheet = spreadsheet.getSheetByName(SHEET_NAME);
  if (!sheet) sheet = spreadsheet.insertSheet(SHEET_NAME);
  sheet.getRange(1, 1, 1, HEADERS.length).setValues([HEADERS]);
  sheet.setFrozenRows(1);
  sheet.getRange('D:D').setNumberFormat('@');
  return spreadsheet.getUrl();
}

function doGet() {
  return ContentService.createTextOutput('Registration endpoint ready.');
}

function doPost(event) {
  let ok = false;

  try {
    const values = event.parameter;
    const required = ['name', 'email', 'phone'];
    if (required.some((key) => !values[key] || !values[key].trim())) {
      throw new Error('Missing required registration fields.');
    }

    const spreadsheetId = PropertiesService.getScriptProperties().getProperty('SPREADSHEET_ID');
    if (!spreadsheetId) throw new Error('Run setup() before accepting registrations.');

    const lock = LockService.getScriptLock();
    lock.waitLock(10000);
    try {
      const sheet = SpreadsheetApp.openById(spreadsheetId).getSheetByName(SHEET_NAME);
      const row = sheet.getLastRow() + 1;
      sheet.getRange(row, 4).setNumberFormat('@');
      sheet.getRange(row, 1, 1, HEADERS.length).setValues([[
        values.name.trim(),
        values.email.trim(),
        (values.department || '').trim(),
        String(values.phone).trim(),
        (values.jobTitle || '').trim(),
        new Date()
      ]]);
    } finally {
      lock.releaseLock();
    }
    ok = true;
  } catch (error) {
    console.error(error);
  }

  return HtmlService.createHtmlOutput(
    '<script>window.top.postMessage({type:"registration-result",ok:' + ok + '},"*");</script>'
  );
}