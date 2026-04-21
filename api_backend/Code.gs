/**
 * DAILY FAT LOSS SYSTEM - BACKEND API
 * Connects Frontend JS to Google Sheets as a database.
 */

const SPREADSHEET_ID = '1F2pN6rclS-SfFHooy99xOunBHm3JVVX0fntHYEB6mDs';

function doPost(e) {
  try {
    const params = JSON.parse(e.postData.contents);
    const ss = SpreadsheetApp.openById(SPREADSHEET_ID);
    let result;

    switch (params.type) {
      case 'workout':
        result = handleWorkout(ss, params);
        break;
      case 'food':
        result = handleFood(ss, params);
        break;
      case 'weight':
        result = handleWeight(ss, params);
        break;
      case 'delete':
        result = handleDelete(ss, params);
        break;
      default:
        throw new Error('Invalid request type');
    }

    return createJsonResponse({ status: 'success', message: 'Data saved successfully', result: result });
  } catch (error) {
    return createJsonResponse({ status: 'error', message: error.toString() });
  }
}

function doGet(e) {
  try {
    const type = e.parameter.type;
    const ss = SpreadsheetApp.openById(SPREADSHEET_ID);
    let data;

    switch (type) {
      case 'workout':
        data = getSheetData(ss, 'WorkoutLogs');
        break;
      case 'food':
        data = getSheetData(ss, 'FoodLogs');
        break;
      case 'weight':
        data = getSheetData(ss, 'WeightLogs');
        break;
      default:
        throw new Error('Invalid query type');
    }

    return createJsonResponse({ status: 'success', data: data });
  } catch (error) {
    return createJsonResponse({ status: 'error', message: error.toString() });
  }
}

/**
 * --- Handlers ---
 */

function handleWorkout(ss, data) {
  const sheet = getOrCreateSheet(ss, 'WorkoutLogs', ['Date', 'Exercise', 'CaloriesBurned', 'Completed', 'ID']);
  sheet.appendRow([data.date, data.exercise, data.calories, data.completed, data.id]);
  return true;
}

function handleFood(ss, data) {
  const sheet = getOrCreateSheet(ss, 'FoodLogs', ['Date', 'Food', 'Calories', 'ID']);
  sheet.appendRow([data.date, data.food, data.calories, data.id]);
  return true;
}

function handleWeight(ss, data) {
  const sheet = getOrCreateSheet(ss, 'WeightLogs', ['Date', 'Weight', 'ID']);
  sheet.appendRow([data.date, data.weight, data.id]);
  return true;
}

function handleDelete(ss, data) {
  const sheetNameMap = { 'food': 'FoodLogs', 'workout': 'WorkoutLogs', 'weight': 'WeightLogs' };
  const sheetName = sheetNameMap[data.subType];
  const sheet = ss.getSheetByName(sheetName);
  
  if (!sheet) return false;
  
  const values = sheet.getDataRange().getValues();
  const headers = values[0];
  const idColIndex = headers.indexOf('ID');
  
  if (idColIndex === -1) return false;
  
  // Find row with matching ID
  for (let i = 1; i < values.length; i++) {
    if (values[i][idColIndex].toString() === data.id.toString()) {
      sheet.deleteRow(i + 1);
      return true;
    }
  }
  return false;
}

/**
 * --- Utilities ---
 */

function getSheetData(ss, sheetName) {
  const sheet = ss.getSheetByName(sheetName);
  if (!sheet) return [];
  
  const values = sheet.getDataRange().getValues();
  if (values.length <= 1) return []; // Only header
  
  const headers = values[0];
  const rows = values.slice(1);
  
  return rows.map(row => {
    let obj = {};
    headers.forEach((header, i) => {
      // Map 'id' specially to ensure it doesn't collide or get mangled
      obj[header.toString().toLowerCase()] = row[i];
    });
    return obj;
  });
}

function getOrCreateSheet(ss, name, headers) {
  let sheet = ss.getSheetByName(name);
  if (!sheet) {
    sheet = ss.insertSheet(name);
    sheet.appendRow(headers);
    sheet.getRange(1, 1, 1, headers.length).setFontWeight('bold').setBackground('#efefef');
  } else {
    // If sheet exists, ensure ID column is present if not already
    const existingHeaders = sheet.getRange(1, 1, 1, sheet.getLastColumn()).getValues()[0];
    if (existingHeaders.indexOf('ID') === -1) {
       sheet.getRange(1, sheet.getLastColumn() + 1).setValue('ID').setFontWeight('bold').setBackground('#efefef');
    }
  }
  return sheet;
}

function createJsonResponse(obj) {
  return ContentService.createTextOutput(JSON.stringify(obj))
    .setMimeType(ContentService.MimeType.JSON);
}

/**
 * Setup function - Optional: Run this once manually to initialize sheets
 */
function setup() {
  const ss = SpreadsheetApp.openById(SPREADSHEET_ID);
  getOrCreateSheet(ss, 'WorkoutLogs', ['Date', 'Exercise', 'CaloriesBurned', 'Completed']);
  getOrCreateSheet(ss, 'FoodLogs', ['Date', 'Food', 'Calories']);
  getOrCreateSheet(ss, 'WeightLogs', ['Date', 'Weight']);
  Logger.log('Environment Setup Complete');
}
