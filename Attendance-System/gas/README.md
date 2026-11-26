# Siddhant High School Attendance System (Google Apps Script)

## Files Included
- `Code.gs` — Google Apps Script backend (batch Sheet I/O, `CacheService`, `LockService`, auto-created division tabs `Att_<Class><Division>`, and `Daily_Summary`)
- `index.html` — Teacher Attendance Portal + Principal Overview UI
- `style.html` — Stylesheet partial included by `index.html`
- `script.html` — Frontend logic wired to `google.script.run`
- `appsscript.json` — GAS manifest (`Asia/Kolkata`, V8 runtime)

## Quick Setup Steps
1. Open your Google Sheet and go to **Extensions → Apps Script**.
2. Create/replace the files in the Apps Script editor with `Code.gs`, `index.html`, `style.html`, and `script.html` (and optionally `appsscript.json` under Project Settings → Show manifest file).
3. In `Code.gs`, select **`setupSheets`** from the function dropdown and click **Run** once.
   - This creates `Students`, `Users`, and `Daily_Summary` with headers and sample students.
   - Default Principal Passcode is set to `2026` in **Project Settings → Script Properties (`PRINCIPAL_PIN`)** — change it before sharing.
4. Click **Deploy → New deployment → Web app**:
   - **Execute as:** `Me`
   - **Who has access:** `Anyone` (or `Anyone within [your school domain]` if using Google Workspace)
5. Open the deployed Web App URL:
   - Class Teachers mark and submit attendance (automatically saves to `Att_8A`, `Att_8B`, etc., and updates `Daily_Summary`).
   - The Principal clicks **Principal View** in the header (auto-unlocked if their email is marked `Principal` in the `Users` tab, or unlocked via `PRINCIPAL_PIN`).
