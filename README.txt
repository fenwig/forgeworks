=====================================
TI FORGEWORKS - CRAFTING TRACKER APP
=====================================

WHAT IS THIS?
Forgeworks is a Star Citizen crafting intelligence tracker. It helps you manage blueprints, track materials, place orders, and log your crafting work.

=====================================
SETUP (First Time Only)
=====================================

STEP 1: Install Python
-----------------------
Option A - Microsoft Store (Easiest):
  1. Open Microsoft Store (built into Windows)
  2. Search for "Python"
  3. Click the official "Python" app
  4. Click "Install"
  5. Wait 1-2 minutes
  6. Done

Option B - python.org (If Store doesn't work):
  1. Go to https://www.python.org/downloads/
  2. Click "Download Python 3.x" (big yellow button)
  3. Run the installer
  4. IMPORTANT: Check the box "Add Python to PATH"
  5. Click Install
  6. Done

STEP 2: Run the Server
----------------------
  1. In this folder, double-click "start_server.bat"
  2. A black terminal window appears
  3. Your browser automatically opens the app
  4. You'll see: "Server is running at: http://localhost:8000"

That's it! The app is now running.

=====================================
USING THE APP
=====================================

The app has 10 modules accessible from the left sidebar:
  1. Dashboard - Overview and navigation
  2. Materials - Track your ore/gem inventory
  3. Acquisition - Queue for materials you need
  4. Blueprints - Browse and track blueprints
  5. Orders - Manage customer orders
  6. Forge - Craft items and log builds
  7. Reports - View analytics and history
  8. OCR - Extract ore data from screenshots
  9. Data Sync - Update blueprint database from Wiki API
  10. Codex - Help and documentation

All your data is saved automatically in your browser.

=====================================
STOPPING THE SERVER
=====================================

To stop the server, close the black terminal window.

To use the app again, double-click start_server.bat again.

=====================================
TROUBLESHOOTING
=====================================

Q: The terminal opens but closes immediately
A: Python is not installed correctly.
   Try installing from python.org instead of Microsoft Store.
   Make sure to check "Add Python to PATH" during installation.

Q: Browser doesn't open automatically
A: Open your browser manually and go to:
   http://localhost:8000/forgeworks_dashboard.html

Q: "Python not found" error message
A: Python is installed but not in PATH.
   Try reinstalling Python and check "Add Python to PATH" during setup.

Q: Can I use this offline?
A: Yes, except for the "Data Sync" module which pulls data from the Wiki API.
   All other features work offline using your saved data.

=====================================
QUESTIONS?
=====================================

Check the "Codex" module (item 10) in the app for full documentation
and workflow guides.
