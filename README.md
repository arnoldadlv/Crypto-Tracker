# Crypto-Tracker

A Google Apps Script that automatically fetches and updates cryptocurrency data from Dexscreener's API, specifically designed for tracking in a Google Sheets spreadsheet## What it does

This script:

- Reads contract addresses from a Google Sheet
- Fetches real-time data from Dexscreener API including:
  - Current price (in both USD and SOL)
  - Market cap
  - 24h volume
  - Price changes
  - Contract age
  - Trading pair information
- Automatically updates the spreadsheet while preserving manually entered data
- Creates a custom menu in Google Sheets for easy updates
