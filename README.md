# AI Job Application Tracker

A lightweight Chrome browser extension designed to help track job applications and organize career search data directly from job boards with the assistance of AI.

This is an unreleased personal software project built using the standard Chrome Extension architecture (Manifest V3). It runs entirely locally in your browser and requires cloning the repository and setting up your own AI API key.

---

## 1. Overview & Problem Solved

Searching and applying for jobs across multiple websites can quickly become chaotic. Keeping track of descriptions, requirements, and application statuses often requires constant context-switching between job boards and external spreadsheets.

This extension inserts directly into your browser workflow to help you extract job details from web pages, process them using AI, and keep your career tracking organized without leaving your active tab.

---

## 2. Key Features

- **In-Page Workflow:** Capture and interact with application details right on the job posting page.
- **AI-Assisted Processing:** Parse, extract, or summarize key job details using your own API key.
- **Local Data Storage:** Track application progress locally without relying on paid third-party platforms.
- **Zero Build Step:** Built with plain vanilla web technologies—no build tools, compilation, or bundlers required.

---

## 3. Technologies Used

- **JavaScript (ES6+ Vanilla)**
- **HTML5 & CSS3**
- **Chrome Extension API (Manifest V3)**

---

## 4. Prerequisites & API Key Setup

Because this project is for personal use and is not published on the Chrome Web Store, you must provide your own API key to enable the AI features.

Before loading the extension into your browser:

1. Open the project folder in your code editor (e.g., VS Code).
2. Locate the configuration file (e.g., `config.js`, `popup.js`, or `.env`).
3. Insert your personal API key into the designated variable:
   ```javascript
   const API_KEY = "YOUR_ACTUAL_API_KEY_HERE";
   ```
4. Save the file.

> **Note:** Never commit your actual API key to a public GitHub repository.

---

## 5. Download & Installation Guide

To run this extension, clone the code locally and activate it manually in Chrome or Opera GX using Developer Mode.

### Step 1: Clone or Download the Repository
- **Option A (Git):** Clone the repository to your computer:
  ```bash
  git clone https://github.com/your-username/your-repo-name.git
  ```
- **Option B (ZIP):** Click **Code > Download ZIP** on GitHub, and extract the archive to a folder on your computer.

### Step 2: Manually Activate the Extension in Chrome / Opera GX
1. Open your browser and navigate to `chrome://extensions` (or `opera://extensions`).
2. In the top-right corner, toggle **Developer mode** to **ON**.
3. Click the **Load unpacked** button in the top menu bar.
4. In the file selector, select the root folder of this project (the folder containing `manifest.json`).

The extension is now manually loaded and ready to use in your browser.

---

## 6. How to Use

1. Click the **puzzle piece icon** (Extensions menu) in your browser toolbar and pin **AI Job Application Tracker**.
2. Navigate to any job posting page on the web.
3. Click the extension icon to open the popup interface and process application data using your AI setup.

---

## 7. How to Reload / Update

If you pull updates from GitHub or edit the source code locally in VS Code:

1. Go back to `chrome://extensions` (or `opera://extensions`).
2. Locate the **AI Job Application Tracker** card.
3. Click the circular **Reload (Refresh)** icon on the extension card.
4. Refresh any active browser tabs where the extension is running.

---

## 8. Project Structure

```text
├── manifest.json      # Extension metadata, permissions, and script declarations
├── popup.html         # Main browser extension popup interface
├── popup.css          # Styling for the extension popup UI
├── popup.js           # UI interaction handling and API calls
├── content.js         # Script running directly on web pages to extract job text
├── background.js      # Background service worker for extension lifecycle events
└── README.md          # Documentation
```

---

## 9. Troubleshooting

- **Extension fails to load:** Make sure you selected the folder containing `manifest.json`, not a parent directory.
- **AI features are not responding:** Open the extension's console (`Right-click popup -> Inspect`) to verify that your API key is correctly inserted and that your provider account has active quota.
- **Code edits are not taking effect:** Always click the **Reload** button on `chrome://extensions` and refresh your web page after saving file changes.

---

## 10. How to Uninstall

1. Go to `chrome://extensions`.
2. Find **AI Job Application Tracker**.
3. Click **Remove**.