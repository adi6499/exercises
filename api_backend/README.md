# Backend Deployment & Usage Guide

Follow these steps to deploy your Google Apps Script API and connect it to your web app.

## 1. Google Apps Script Setup
1.  Open your [Google Sheet](https://docs.google.com/spreadsheets/d/1F2pN6rclS-SfFHooy99xOunBHm3JVVX0fntHYEB6mDs/edit).
2.  Go to **Extensions** > **Apps Script**.
3.  Delete any code in the editor and paste the content of [Code.gs](file:///d:/download/exercises-master/exercises-master/api_backend/Code.gs).
4.  Click the **Save** icon (disk).
5.  (Optional) Select the `setup` function in the toolbar and click **Run** to initialize the sheets.

## 2. Deploy as Web App
1.  Click **Deploy** > **New deployment**.
2.  Select **Type**: `Web App`.
3.  **Description**: `Daily Fat Loss API`.
4.  **Execute as**: `Me`.
5.  **Who has access**: `Anyone`.
6.  Click **Deploy**.
7.  Copy the **Web App URL**. It will look like: `https://script.google.com/macros/s/.../exec`.

## 3. Frontend Integration Example (fetch)

Paste this into your `app.js` and update the `API_URL`.

```javascript
const API_URL = 'PASTE_YOUR_COPIED_URL_HERE';

/**
 * SAVE DATA EXAMPLE
 */
async function syncToCloud(type, data) {
    try {
        const response = await fetch(API_URL, {
            method: 'POST',
            mode: 'no-cors', // CRITICAL for Apps Script redirects
            cache: 'no-cache',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ type, date: new Date().toISOString().split('T')[0], ...data })
        });
        console.log('Syncing to cloud...');
        // Note: With no-cors, you won't see the response body, but the data will save.
    } catch (e) {
        console.error('Cloud Sync Error:', e);
    }
}

/**
 * FETCH DATA EXAMPLE
 */
async function fetchFromCloud(type) {
    const res = await fetch(`${API_URL}?type=${type}`);
    const json = await res.json();
    if (json.status === 'success') {
        return json.data;
    }
    return [];
}

// Example usage:
// syncToCloud('food', { food: 'Rice', calories: 200 });
```

---

> [!WARNING]
> When using `fetch` with Google Apps Script, `no-cors` mode is often required to bypass browser security blocks on redirects. This means the frontend won't receive the "Success" JSON response directly, but the data **will** be successfully appended to your spreadsheet.
