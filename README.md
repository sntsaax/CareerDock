# Career Doc - AI Job Application Tracker

<p align="center">
  <img src="extension/icons/icon128.png" alt="Career Doc Logo" width="128" height="128">
</p>

A Chrome extension and local Python backend designed to help you track job applications and process job details with AI directly from your browser.

This project is built for local personal use. The Chrome extension extracts job information from web pages and sends it to a local FastAPI server, which processes the data using your custom AI API key.

---

## Key Features

- **In-Page Extraction:** Capture and parse job posting details directly while browsing job boards.
- **AI-Powered Insights:** Uses your local backend service to summarize requirements and analyze job descriptions.
- **Privacy & Local Control:** Runs entirely on your machine—your data and API keys stay under your direct control.
- **No Complex Bundling:** Built using standard web technologies and standard Python scripts.

---

## Tech Stack

- **Extension:** HTML5, CSS3, Vanilla JavaScript (Manifest V3)
- **Backend:** Python, FastAPI, Uvicorn
- **Environment Handling:** `python-dotenv` for managing local configuration

---

## Project Structure

```text
├── .gitignore
├── README.md
├── backend/
│   ├── .env
│   ├── main.py
│   └── requirements.txt
└── extension/
    ├── content.js
    ├── manifest.json
    ├── popup.html
    ├── popup.js
    ├── style.css
    └── icons/
        ├── icon16.png
        ├── icon32.png
        ├── icon48.png
        └── icon128.png
```

---

## Prerequisites & Setup

### 1. Clone or Download the Repository

Clone this repository to your local machine using Git, or download and extract the ZIP archive:

```bash
git clone https://github.com/your-username/your-repo-name.git
cd your-repo-name
```

---

### 2. Set Up the Local Backend

The backend is a local Python server that communicates with your AI model provider.

1. Navigate to the `backend` directory:
   ```bash
   cd backend
   ```

2. Create and activate a Python virtual environment:
   ```bash
   # On Windows:
   python -m venv venv
   venv\Scripts\activate

   # On macOS/Linux:
   python3 -m venv venv
   source venv/bin/activate
   ```

3. Install the required dependencies:
   ```bash
   pip install -r requirements.txt
   ```

4. Configure your environment variables:
   Open the `backend/.env` file and insert your API key:
   ```env
   API_KEY=your_actual_api_key_here
   ```

5. Start the backend server:
   ```bash
   python main.py
   ```
   *(Keep this terminal open and running while using the extension.)*

---

### 3. Install the Extension in Chrome / Opera GX

1. Open your browser and navigate to `chrome://extensions` (or `opera://extensions`).
2. Toggle **Developer mode** in the top-right corner to **ON**.
3. Click the **Load unpacked** button in the top-left menu.
4. In the file selector, browse to your cloned repository folder and select the **`extension`** folder (the subfolder containing `manifest.json`).

The extension icon will now appear in your browser's toolbar.

---

## How to Use

1. Ensure the backend server is running (`python main.py` inside `backend/`).
2. Navigate to a job listing on any job board.
3. Click the extension icon in your browser toolbar to open the popup and run AI operations on the active page.

---

## Updating & Reloading Code

- **Updating Extension Code:** If you edit files inside `extension/` (`popup.js`, `content.js`, `style.css`, etc.), go to `chrome://extensions`, locate the extension card, and click the circular **Reload** icon. Then refresh the active job page tab.
- **Updating Backend Code:** If you edit `backend/main.py` or `.env`, restart the Python process in your terminal (`Ctrl+C` and run `python main.py` again).

---

## Troubleshooting

- **Extension fails to load in Chrome:** Ensure you selected the `extension/` subfolder during the "Load unpacked" step, rather than the root directory.
- **AI features fail or return errors:** Verify that your local backend server is running and check `backend/.env` to confirm your API key is properly formatted and active.
- **Changes not reflecting:** Remember to click the **Reload** icon on `chrome://extensions` after modifying frontend scripts or CSS.

---

## How to Uninstall

1. Open `chrome://extensions/`.
2. Locate the extension and click **Remove**.
3. Delete the repository folder from your computer.

---

## License

Personal project intended for non-commercial use.