/**
 * Siddhant High School — Attendance System (Google Apps Script Backend)
 * Approach: 1 Spreadsheet with Students, Users, Daily_Summary,
 *           and auto-created Row-per-day Division Tabs (e.g. Att_8A, Att_8B).
 */

const CONFIG = {
  // Leave blank ("") if this script is bound to your Google Sheet (Extensions -> Apps Script).
  // If standalone, paste your Google Sheet ID between the quotes.
  SPREADSHEET_ID: '',
  TIMEZONE: 'Asia/Kolkata',
  STUDENTS_SHEET: 'Students',
  USERS_SHEET: 'Users',
  SUMMARY_SHEET: 'Daily_Summary',
  DIVISION_TAB_PREFIX: 'Att_',
  STUDENTS_CACHE_KEY: 'SHS_STUDENTS_V1',
  USERS_CACHE_KEY: 'SHS_USERS_V1',
  CACHE_TTL_SECONDS: 600, // 10 minutes
  DEFAULT_PRINCIPAL_PIN: '2026' // Change via Script Properties (PRINCIPAL_PIN) or setupSheets()
};

const HEADERS = {
  STUDENTS: ['RollNo', 'Name', 'Class', 'Division'],
  USERS: ['Email', 'Name', 'Role'],
  SUMMARY: [
    'Date',
    'Class',
    'Division',
    'Total',
    'Present',
    'Absent',
    'Pct',
    'AbsentNames',
    'MarkedBy',
    'UpdatedAt'
  ],
  DIVISION: ['Date', 'RollNo', 'Name', 'Status', 'MarkedBy', 'UpdatedAt']
};

/* =========================================================
   WEB APP ENTRY & TEMPLATE INCLUDE
   ========================================================= */

function doGet() {
  return HtmlService.createTemplateFromFile('index')
    .evaluate()
    .setTitle('Siddhant High School | Attendance')
    .addMetaTag('viewport', 'width=device-width, initial-scale=1')
    .setXFrameOptionsMode(HtmlService.XFrameOptionsMode.ALLOWALL);
}

function include(filename) {
  return HtmlService.createHtmlOutputFromFile(filename).getContent();
}

/* =========================================================
   ONE-TIME DATABASE SETUP & CACHE REFRESH
   ========================================================= */

/**
 * Run this once from the Apps Script editor to create tabs & sample students.
 */
function setupSheets() {
  const ss = getSpreadsheet_();

  const studentsSheet = ensureSheetWithHeaders_(ss, CONFIG.STUDENTS_SHEET, HEADERS.STUDENTS);
  if (studentsSheet.getLastRow() <= 1) {
    const sampleStudents = [
      [1, 'Aarav Sharma', '8', 'A'],
      [2, 'Rahul Patil', '8', 'A'],
      [3, 'Priya Shah', '8', 'A'],
      [4, 'Rohan More', '8', 'A'],
      [5, 'Sneha Joshi', '8', 'A'],
      [6, 'Amit Kumar', '8', 'A'],
      [7, 'Neha Singh', '8', 'A'],
      [8, 'Sahil Verma', '8', 'A'],
      [9, 'Ananya Desai', '8', 'A'],
      [10, 'Karan Mehta', '8', 'A'],
      [11, 'Isha Kulkarni', '8', 'A'],
      [12, 'Aditya Joshi', '8', 'A'],
      [1, 'Tanvi Deshmukh', '8', 'B'],
      [2, 'Omkar Kulkarni', '8', 'B'],
      [3, 'Riya Nair', '8', 'B'],
      [1, 'Vivaan Joshi', '9', 'A'],
      [2, 'DiyaPatel', '9', 'A']
    ];
    // Fix minor typo in sample name cleanly
    sampleStudents[16][1] = 'Diya Patel';
    studentsSheet.getRange(2, 1, sampleStudents.length, 4).setValues(sampleStudents);
  }

  const usersSheet = ensureSheetWithHeaders_(ss, CONFIG.USERS_SHEET, HEADERS.USERS);
  if (usersSheet.getLastRow() <= 1) {
    const ownerEmail = (Session.getEffectiveUser().getEmail() || 'principal@siddhanthighschool.edu.in').trim();
    usersSheet.getRange(2, 1, 1, 3).setValues([[ownerEmail, 'Principal', 'Principal']]);
  }

  const summarySheet = ensureSheetWithHeaders_(ss, CONFIG.SUMMARY_SHEET, HEADERS.SUMMARY);
  summarySheet.getRange('A:A').setNumberFormat('@');

  const props = PropertiesService.getScriptProperties();
  if (!props.getProperty('PRINCIPAL_PIN')) {
    props.setProperty('PRINCIPAL_PIN', CONFIG.DEFAULT_PRINCIPAL_PIN);
  }

  refreshCache();
  Logger.log('Setup complete. Principal PIN is stored in Script Property PRINCIPAL_PIN.');
  return { ok: true, message: 'Sheets initialized successfully.' };
}

/**
 * Simple trigger: clears cached Students/Users when edited manually in Google Sheets.
 */
function onEdit(e) {
  if (!e || !e.range) return;
  const sheetName = e.range.getSheet().getName();
  if (sheetName === CONFIG.STUDENTS_SHEET || sheetName === CONFIG.USERS_SHEET) {
    refreshCache();
  }
}

function refreshCache() {
  const cache = CacheService.getScriptCache();
  cache.removeAll([CONFIG.STUDENTS_CACHE_KEY, CONFIG.USERS_CACHE_KEY]);
  return { ok: true };
}

/* =========================================================
   PUBLIC CLIENT ENDPOINTS (google.script.run)
   ========================================================= */

/**
 * Single fast bootstrap call on page load:
 * returns today's date, available classes/divisions, user role, and initial class data.
 */
function getInitData() {
  const todayStr = getTodayIso_();
  const todayDisplay = Utilities.formatDate(new Date(), CONFIG.TIMEZONE, 'd MMMM yyyy');
  const students = getStudentsList_();
  const classStructure = buildClassStructure_(students);
  const user = resolveCurrentUser_();

  const defaultClass = classStructure.classes[0] || '8';
  const defaultDivision = (classStructure.divisionsByClass[defaultClass] || ['A'])[0] || 'A';
  const initialAttendance = getClassAttendance(defaultClass, defaultDivision, todayStr);

  return {
    todayStr: todayStr,
    todayDisplay: todayDisplay,
    classes: classStructure.classes,
    divisionsByClass: classStructure.divisionsByClass,
    defaultClass: defaultClass,
    defaultDivision: defaultDivision,
    user: user,
    initialAttendance: initialAttendance
  };
}

/**
 * Loads students for (className, division) merged with any saved attendance for dateStr.
 */
function getClassAttendance(className, division, dateStr) {
  const cls = normalizeText_(className);
  const div = normalizeText_(division).toUpperCase();
  const date = normalizeDateInput_(dateStr);

  if (!cls || !div) {
    throw new Error('Please select both Class and Division.');
  }
  if (!date) {
    throw new Error('Please select a valid attendance date (YYYY-MM-DD).');
  }

  const allStudents = getStudentsList_();
  const classStudents = allStudents.filter(function (s) {
    return s.className === cls && s.division === div;
  });

  const savedResult = getSavedDivisionRecords_(cls, div, date);
  const savedByRoll = savedResult.byRoll;
  const isMarked = savedResult.isMarked;

  const students = classStudents.map(function (s) {
    const saved = savedByRoll[String(s.roll)];
    return {
      roll: s.roll,
      name: s.name,
      status: saved ? saved.status : 'Present'
    };
  });

  return {
    className: cls,
    division: div,
    dateStr: date,
    isMarked: isMarked,
    meta: savedResult.meta,
    students: students
  };
}

/**
 * Saves or updates attendance for one Class + Division + Date using LockService & batch I/O.
 */
function submitAttendance(payload) {
  if (!payload || !Array.isArray(payload.records)) {
    throw new Error('Invalid attendance payload.');
  }

  const cls = normalizeText_(payload.className);
  const div = normalizeText_(payload.division).toUpperCase();
  const date = normalizeDateInput_(payload.dateStr);

  if (!cls || !div || !date) {
    throw new Error('Class, Division, and a valid Date are required.');
  }

  const cleanRecords = payload.records.map(function (rec) {
    const roll = Number(rec.roll);
    const name = normalizeText_(rec.name);
    const status = rec.status === 'Absent' ? 'Absent' : 'Present';
    if (!roll || !name) {
      throw new Error('Invalid student record encountered.');
    }
    return { roll: roll, name: name, status: status };
  });

  const user = resolveCurrentUser_();
  const actorLabel =
    user.email ||
    normalizeText_(payload.teacherName) ||
    'Class Teacher';
  const nowStr = Utilities.formatDate(new Date(), CONFIG.TIMEZONE, 'yyyy-MM-dd HH:mm');

  const lock = LockService.getScriptLock();
  lock.waitLock(15000);

  try {
    const ss = getSpreadsheet_();
    const tabName = getDivisionTabName_(cls, div);
    const divSheet = ensureSheetWithHeaders_(ss, tabName, HEADERS.DIVISION);
    divSheet.getRange('A:A').setNumberFormat('@');

    const newRows = cleanRecords.map(function (r) {
      return [date, r.roll, r.name, r.status, actorLabel, nowStr];
    });

    const isUpdate = upsertDivisionRows_(divSheet, date, newRows);

    const total = cleanRecords.length;
    const absentList = cleanRecords.filter(function (r) {
      return r.status === 'Absent';
    });
    const absent = absentList.length;
    const present = total - absent;
    const pct = total > 0 ? Math.round((present / total) * 100) : 0;
    const absentNames =
      absentList.length > 0
        ? absentList
            .map(function (s) {
              return s.name + ' (' + s.roll + ')';
            })
            .join(', ')
        : 'None';

    const summarySheet = ensureSheetWithHeaders_(ss, CONFIG.SUMMARY_SHEET, HEADERS.SUMMARY);
    summarySheet.getRange('A:A').setNumberFormat('@');
    const summaryRow = [
      date,
      cls,
      div,
      total,
      present,
      absent,
      pct,
      absentNames,
      actorLabel,
      nowStr
    ];
    upsertSummaryRow_(summarySheet, date, cls, div, summaryRow);

    SpreadsheetApp.flush();

    const cache = CacheService.getScriptCache();
    cache.removeAll([
      getAttendanceCacheKey_(cls, div, date),
      getSummaryCacheKey_(date)
    ]);

    return {
      ok: true,
      isUpdate: isUpdate,
      dateStr: date,
      className: cls,
      division: div,
      total: total,
      present: present,
      absent: absent,
      pct: pct,
      absentStudents: absentList,
      markedBy: actorLabel,
      updatedAt: nowStr
    };
  } finally {
    lock.releaseLock();
  }
}

/**
 * Verifies Principal Passcode for deployments where Session email is unavailable.
 */
function verifyPrincipalPin(pin) {
  const expected =
    PropertiesService.getScriptProperties().getProperty('PRINCIPAL_PIN') ||
    CONFIG.DEFAULT_PRINCIPAL_PIN;
  if (String(pin || '').trim() === String(expected).trim()) {
    return { ok: true };
  }
  return { ok: false, message: 'Incorrect Principal passcode.' };
}

/**
 * Fast Principal Dashboard read: reads ONLY Daily_Summary + cached Students structure.
 */
function getPrincipalSummary(dateStr, pin) {
  const date = normalizeDateInput_(dateStr) || getTodayIso_();
  const user = resolveCurrentUser_();

  if (!user.isPrincipal) {
    const pinCheck = verifyPrincipalPin(pin);
    if (!pinCheck.ok) {
      throw new Error('Principal access required. Please enter a valid Principal passcode.');
    }
  }

  const cache = CacheService.getScriptCache();
  const cacheKey = getSummaryCacheKey_(date);
  const cachedJson = cache.get(cacheKey);
  if (cachedJson) {
    return JSON.parse(cachedJson);
  }

  const allStudents = getStudentsList_();
  const countsByClassDiv = {};
  allStudents.forEach(function (s) {
    const key = s.className + '|' + s.division;
    countsByClassDiv[key] = (countsByClassDiv[key] || 0) + 1;
  });

  const ss = getSpreadsheet_();
  const summarySheet = ss.getSheetByName(CONFIG.SUMMARY_SHEET);
  const summaryByKey = {};

  if (summarySheet && summarySheet.getLastRow() > 1) {
    const values = summarySheet
      .getRange(2, 1, summarySheet.getLastRow() - 1, HEADERS.SUMMARY.length)
      .getValues();

    for (let i = 0; i < values.length; i++) {
      const row = values[i];
      const rowDate = formatDateCell_(row[0]);
      if (rowDate !== date) continue;

      const cls = normalizeText_(row[1]);
      const div = normalizeText_(row[2]).toUpperCase();
      const key = cls + '|' + div;
      summaryByKey[key] = {
        total: Number(row[3]) || 0,
        present: Number(row[4]) || 0,
        absent: Number(row[5]) || 0,
        pct: Number(row[6]) || 0,
        absentNames: normalizeText_(row[7]) || 'None',
        markedBy: normalizeText_(row[8]) || '',
        updatedAt: normalizeText_(row[9]) || ''
      };
    }
  }

  const allKeys = Object.keys(countsByClassDiv).sort(function (a, b) {
    const pa = a.split('|');
    const pb = b.split('|');
    const numDiff = (parseInt(pa[0], 10) || 0) - (parseInt(pb[0], 10) || 0);
    if (numDiff !== 0) return numDiff;
    if (pa[0] !== pb[0]) return pa[0].localeCompare(pb[0]);
    return pa[1].localeCompare(pb[1]);
  });

  let submittedClasses = 0;
  let totalStudents = 0;
  let presentStudents = 0;
  let absentStudents = 0;

  const classes = allKeys.map(function (key) {
    const parts = key.split('|');
    const cls = parts[0];
    const div = parts[1];
    const rosterCount = countsByClassDiv[key] || 0;
    const saved = summaryByKey[key];

    if (saved) {
      submittedClasses++;
      totalStudents += saved.total;
      presentStudents += saved.present;
      absentStudents += saved.absent;

      return {
        className: cls,
        division: div,
        status: 'Submitted',
        total: saved.total,
        present: saved.present,
        absent: saved.absent,
        pct: saved.pct,
        absentNames: saved.absentNames,
        markedBy: saved.markedBy,
        updatedAt: saved.updatedAt
      };
    }

    totalStudents += rosterCount;
    return {
      className: cls,
      division: div,
      status: 'Pending',
      total: rosterCount,
      present: 0,
      absent: 0,
      pct: 0,
      absentNames: '-',
      markedBy: '-',
      updatedAt: '-'
    };
  });

  const overallPct =
    presentStudents + absentStudents > 0
      ? Math.round((presentStudents / (presentStudents + absentStudents)) * 100)
      : 0;

  const result = {
    dateStr: date,
    totals: {
      totalClasses: classes.length,
      submittedClasses: submittedClasses,
      pendingClasses: classes.length - submittedClasses,
      totalStudents: totalStudents,
      presentStudents: presentStudents,
      absentStudents: absentStudents,
      overallPct: overallPct
    },
    classes: classes
  };

  cache.put(cacheKey, JSON.stringify(result), 120); // 2 min cache
  return result;
}

/* =========================================================
   INTERNAL HELPERS
   ========================================================= */

function getSpreadsheet_() {
  if (CONFIG.SPREADSHEET_ID) {
    return SpreadsheetApp.openById(CONFIG.SPREADSHEET_ID);
  }
  const active = SpreadsheetApp.getActiveSpreadsheet();
  if (!active) {
    throw new Error('No Spreadsheet found. Set CONFIG.SPREADSHEET_ID in Code.gs.');
  }
  return active;
}

function ensureSheetWithHeaders_(ss, name, headers) {
  let sheet = ss.getSheetByName(name);
  if (!sheet) {
    sheet = ss.insertSheet(name);
    sheet.getRange(1, 1, 1, headers.length).setValues([headers]);
    sheet.getRange(1, 1, 1, headers.length).setFontWeight('bold');
    sheet.setFrozenRows(1);
  } else if (sheet.getLastRow() === 0) {
    sheet.getRange(1, 1, 1, headers.length).setValues([headers]);
    sheet.getRange(1, 1, 1, headers.length).setFontWeight('bold');
    sheet.setFrozenRows(1);
  }
  return sheet;
}

function getStudentsList_() {
  const cache = CacheService.getScriptCache();
  const cached = cache.get(CONFIG.STUDENTS_CACHE_KEY);
  if (cached) {
    return JSON.parse(cached);
  }

  const ss = getSpreadsheet_();
  const sheet = ss.getSheetByName(CONFIG.STUDENTS_SHEET);
  if (!sheet || sheet.getLastRow() <= 1) {
    return [];
  }

  const allRows = sheet.getDataRange().getValues();
  const headerRow = allRows[0].map(function (h) {
    return normalizeText_(h).toLowerCase().replace(/[^a-z0-9]/g, '');
  });

  const idx = {
    roll: findHeaderIndex_(headerRow, ['rollno', 'roll', 'rollnumber']),
    name: findHeaderIndex_(headerRow, ['fullname', 'name', 'studentname']),
    classSection: findHeaderIndex_(headerRow, ['classsection', 'gradesection', 'classdiv']),
    className: findHeaderIndex_(headerRow, ['class', 'grade']),
    division: findHeaderIndex_(headerRow, ['division', 'section', 'div']),
    status: findHeaderIndex_(headerRow, ['status'])
  };

  const useHeaderMap =
    idx.roll !== -1 &&
    idx.name !== -1 &&
    (idx.classSection !== -1 || (idx.className !== -1 && idx.division !== -1));

  const students = [];
  for (let i = 1; i < allRows.length; i++) {
    const row = allRows[i];
    let roll, name, className, division;

    if (useHeaderMap) {
      if (idx.status !== -1) {
        const rowStatus = normalizeText_(row[idx.status]).toLowerCase();
        if (rowStatus && rowStatus !== 'active') continue;
      }
      roll = Number(row[idx.roll]);
      name = normalizeText_(row[idx.name]);
      if (idx.classSection !== -1) {
        const parsed = parseClassAndSection_(row[idx.classSection]);
        className = parsed.className;
        division = parsed.division;
      } else {
        className = normalizeText_(row[idx.className]).replace(/^(?:grade|class)\s*/i, '');
        division = normalizeText_(row[idx.division]).toUpperCase();
      }
    } else {
      roll = Number(row[0]);
      name = normalizeText_(row[1]);
      className = normalizeText_(row[2]).replace(/^(?:grade|class)\s*/i, '');
      division = normalizeText_(row[3]).toUpperCase();
    }

    if (!roll || !name || !className || !division) continue;
    students.push({
      roll: roll,
      name: name,
      className: className,
      division: division
    });
  }

  students.sort(function (a, b) {
    return a.roll - b.roll;
  });

  if (students.length > 0) {
    try {
      cache.put(CONFIG.STUDENTS_CACHE_KEY, JSON.stringify(students), CONFIG.CACHE_TTL_SECONDS);
    } catch (err) {
      // Ignore if roster exceeds 100KB cache key limit
    }
  }
  return students;
}

function findHeaderIndex_(headerRow, candidates) {
  for (let i = 0; i < candidates.length; i++) {
    const idx = headerRow.indexOf(candidates[i]);
    if (idx !== -1) return idx;
  }
  return -1;
}

function parseClassAndSection_(val) {
  const raw = normalizeText_(val);
  const match = raw.match(/^(?:grade|class)?\s*([a-z0-9]+)\s*[-\s]\s*([a-z0-9]+)$/i);
  if (match) {
    return {
      className: match[1].trim(),
      division: match[2].trim().toUpperCase()
    };
  }
  return { className: '', division: '' };
}

function buildClassStructure_(students) {
  const divMap = {};
  students.forEach(function (s) {
    if (!divMap[s.className]) {
      divMap[s.className] = {};
    }
    divMap[s.className][s.division] = true;
  });

  const classes = Object.keys(divMap).sort(function (a, b) {
    const diff = (parseInt(a, 10) || 0) - (parseInt(b, 10) || 0);
    return diff !== 0 ? diff : a.localeCompare(b);
  });

  const divisionsByClass = {};
  classes.forEach(function (cls) {
    divisionsByClass[cls] = Object.keys(divMap[cls]).sort();
  });

  return {
    classes: classes,
    divisionsByClass: divisionsByClass
  };
}

function resolveCurrentUser_() {
  let email = '';
  try {
    email = (Session.getActiveUser().getEmail() || '').trim().toLowerCase();
  } catch (err) {
    email = '';
  }

  if (!email) {
    return {
      email: '',
      name: 'Teacher',
      role: 'Teacher',
      isPrincipal: false,
      emailAvailable: false
    };
  }

  const users = getUsersMap_();
  const matched = users[email];
  if (matched) {
    const isPrincipal = matched.role.toLowerCase() === 'principal';
    return {
      email: email,
      name: matched.name || email,
      role: isPrincipal ? 'Principal' : 'Teacher',
      isPrincipal: isPrincipal,
      emailAvailable: true
    };
  }

  return {
    email: email,
    name: email.split('@')[0],
    role: 'Teacher',
    isPrincipal: false,
    emailAvailable: true
  };
}

function getUsersMap_() {
  const cache = CacheService.getScriptCache();
  const cached = cache.get(CONFIG.USERS_CACHE_KEY);
  if (cached) {
    return JSON.parse(cached);
  }

  const ss = getSpreadsheet_();
  const sheet = ss.getSheetByName(CONFIG.USERS_SHEET);
  const map = {};
  if (!sheet || sheet.getLastRow() <= 1) {
    return map;
  }

  const rows = sheet.getRange(2, 1, sheet.getLastRow() - 1, 3).getValues();
  rows.forEach(function (r) {
    const email = normalizeText_(r[0]).toLowerCase();
    if (!email) return;
    map[email] = {
      name: normalizeText_(r[1]),
      role: normalizeText_(r[2]) || 'Teacher'
    };
  });

  cache.put(CONFIG.USERS_CACHE_KEY, JSON.stringify(map), CONFIG.CACHE_TTL_SECONDS);
  return map;
}

function getSavedDivisionRecords_(className, division, dateStr) {
  const cache = CacheService.getScriptCache();
  const cacheKey = getAttendanceCacheKey_(className, division, dateStr);
  const cached = cache.get(cacheKey);
  if (cached) {
    return JSON.parse(cached);
  }

  const ss = getSpreadsheet_();
  const tabName = getDivisionTabName_(className, division);
  const sheet = ss.getSheetByName(tabName);

  const result = {
    isMarked: false,
    meta: null,
    byRoll: {}
  };

  if (!sheet || sheet.getLastRow() <= 1) {
    return result;
  }

  const values = sheet
    .getRange(2, 1, sheet.getLastRow() - 1, HEADERS.DIVISION.length)
    .getValues();

  let markedBy = '';
  let updatedAt = '';

  for (let i = 0; i < values.length; i++) {
    const rowDate = formatDateCell_(values[i][0]);
    if (rowDate !== dateStr) continue;

    result.isMarked = true;
    const roll = String(Number(values[i][1]));
    const status = values[i][3] === 'Absent' ? 'Absent' : 'Present';
    markedBy = normalizeText_(values[i][4]) || markedBy;
    updatedAt = normalizeText_(values[i][5]) || updatedAt;

    result.byRoll[roll] = { status: status };
  }

  if (result.isMarked) {
    result.meta = {
      markedBy: markedBy,
      updatedAt: updatedAt
    };
    cache.put(cacheKey, JSON.stringify(result), 300); // 5 min cache
  }

  return result;
}

function upsertDivisionRows_(sheet, dateStr, newRows) {
  const lastRow = sheet.getLastRow();
  if (lastRow <= 1) {
    if (newRows.length > 0) {
      sheet.getRange(2, 1, newRows.length, HEADERS.DIVISION.length).setValues(newRows);
      sheet.getRange(2, 1, newRows.length, 1).setNumberFormat('@');
    }
    return false;
  }

  const allValues = sheet
    .getRange(2, 1, lastRow - 1, HEADERS.DIVISION.length)
    .getValues();

  const matchingIndices = [];
  const keptRows = [];
  let lastKeptDate = '';

  for (let i = 0; i < allValues.length; i++) {
    const rowDate = formatDateCell_(allValues[i][0]);
    if (!rowDate) continue; // Ignore blank separator rows

    if (rowDate === dateStr) {
      matchingIndices.push(i + 2); // 1-based sheet row
    } else {
      if (lastKeptDate && lastKeptDate !== rowDate) {
        keptRows.push(['', '', '', '', '', '']);
      }
      keptRows.push([
        rowDate,
        allValues[i][1],
        allValues[i][2],
        allValues[i][3],
        allValues[i][4],
        allValues[i][5]
      ]);
      lastKeptDate = rowDate;
    }
  }

  if (matchingIndices.length === 0) {
    if (newRows.length > 0) {
      const startRow = keptRows.length > 0 ? lastRow + 2 : 2;
      sheet.getRange(startRow, 1, newRows.length, HEADERS.DIVISION.length).setValues(newRows);
      sheet.getRange(startRow, 1, newRows.length, 1).setNumberFormat('@');
    }
    return false;
  }

  // Fast path: same student count & contiguous rows -> update in-place
  const isContiguous =
    matchingIndices[matchingIndices.length - 1] - matchingIndices[0] + 1 ===
    matchingIndices.length;

  if (isContiguous && matchingIndices.length === newRows.length) {
    const startRow = matchingIndices[0];
    sheet.getRange(startRow, 1, newRows.length, HEADERS.DIVISION.length).setValues(newRows);
    sheet.getRange(startRow, 1, newRows.length, 1).setNumberFormat('@');
    return true;
  }

  // Roster size changed: rewrite clean data block with 1 blank row between dates
  const combined = keptRows.length > 0
    ? keptRows.concat([['', '', '', '', '', '']], newRows)
    : newRows;
  sheet.getRange(2, 1, lastRow - 1, HEADERS.DIVISION.length).clearContent();
  if (combined.length > 0) {
    sheet.getRange(2, 1, combined.length, HEADERS.DIVISION.length).setValues(combined);
    sheet.getRange(2, 1, combined.length, 1).setNumberFormat('@');
  }
  return true;
}

function upsertSummaryRow_(sheet, dateStr, className, division, summaryRow) {
  const lastRow = sheet.getLastRow();
  if (lastRow > 1) {
    const existing = sheet.getRange(2, 1, lastRow - 1, 3).getValues();
    for (let i = 0; i < existing.length; i++) {
      const rDate = formatDateCell_(existing[i][0]);
      const rCls = normalizeText_(existing[i][1]);
      const rDiv = normalizeText_(existing[i][2]).toUpperCase();
      if (rDate === dateStr && rCls === className && rDiv === division) {
        const targetRow = i + 2;
        sheet.getRange(targetRow, 1, 1, HEADERS.SUMMARY.length).setValues([summaryRow]);
        sheet.getRange(targetRow, 1, 1, 1).setNumberFormat('@');
        return;
      }
    }
  }

  const appendRow = lastRow + 1;
  sheet.getRange(appendRow, 1, 1, HEADERS.SUMMARY.length).setValues([summaryRow]);
  sheet.getRange(appendRow, 1, 1, 1).setNumberFormat('@');
}

function getDivisionTabName_(className, division) {
  const safeClass = String(className).replace(/[^a-zA-Z0-9_-]/g, '');
  const safeDiv = String(division).replace(/[^a-zA-Z0-9_-]/g, '').toUpperCase();
  return CONFIG.DIVISION_TAB_PREFIX + safeClass + safeDiv;
}

function getAttendanceCacheKey_(className, division, dateStr) {
  return 'SHS_ATT_' + className + '_' + division + '_' + dateStr;
}

function getSummaryCacheKey_(dateStr) {
  return 'SHS_SUM_' + dateStr;
}

function getTodayIso_() {
  return Utilities.formatDate(new Date(), CONFIG.TIMEZONE, 'yyyy-MM-dd');
}

function normalizeDateInput_(val) {
  const str = String(val || '').trim();
  return /^\d{4}-\d{2}-\d{2}$/.test(str) ? str : '';
}

function formatDateCell_(cellVal) {
  if (cellVal instanceof Date) {
    return Utilities.formatDate(cellVal, CONFIG.TIMEZONE, 'yyyy-MM-dd');
  }
  return String(cellVal || '').trim();
}

function normalizeText_(val) {
  return String(val || '').trim();
}
