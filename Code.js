function updateCryptoData() {
  const sheet = SpreadsheetApp.getActiveSpreadsheet().getActiveSheet();

  // Get all contract addresses from Column A (excluding the header)
  const tokenAddresses = sheet.getRange("A2:A").getValues()
    .filter(row => row[0] !== "")  // Filter out empty rows
    .map(row => row[0]);           // Extract address from array

  tokenAddresses.forEach((address, index) => {
    const url = `https://api.dexscreener.com/latest/dex/tokens/${address}`;

    try {
      const response = UrlFetchApp.fetch(url);
      const data = JSON.parse(response.getContentText());

      if (data.pairs && data.pairs.length > 0) {
        const pair = data.pairs[0];

        // Update row with new data
        const row = index + 2; // Account for header row

    sheet.getRange(row, 1, 1, 9).setValues([[
      pair.baseToken.address,              // Contract Address
      pair.baseToken.symbol,               // Symbol
      new Date(pair.pairCreatedAt).toISOString().split('T')[0],  // Pair Created
      getContractAge(pair.pairCreatedAt),  // Contract Age
      formatMarketCap(pair.marketCap),     // Market Cap
      formatVolume(pair.volume.h24),       // 24H Volume
      pair.priceNative,                    // Current Price Crypto
      formatPrice(pair.priceUsd),          // Current Price (USD)
      calculatePriceChange(pair.priceChange.h24)  // 24H Price Change %

    
]]);

sheet.getRange(row, 11, 1, 3).setValues([[
    pair.chainId,                        // Network
    pair.url,                           // DEX Link
    pair.info?.socials?.[1]?.url || ''  // Telegram/Discord
]]);



        
      }

      // Avoid hitting API rate limits
      Utilities.sleep(1000);
    } catch(error) {
      Logger.log(`Error fetching data for ${address}: ${error}`);
    }
  });
}

//helper functions

function getContractAge(timestamp) {
  const created = new Date(timestamp);
  const now = new Date();
  const diffTime = Math.abs(now - created);
  const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
  return `${diffDays}d`;
}

function formatMarketCap(marketCap) {
  return marketCap ? `$${(marketCap/1000000).toFixed(1)}M` : 'N/A';
}

function formatVolume(volume) {
  return volume ? `$${(volume/1000000).toFixed(1)}M` : 'N/A';
}

function formatPrice(priceUsd) {
  return priceUsd ? `$${(parseFloat(priceUsd).toFixed(8))}` : 'N/A';
}

function calculatePriceChange(change) {
  return change ? `${(parseFloat(change).toFixed(2))}%` : 'N/A';
}

// Create menu item to run update
function onOpen() {
  const ui = SpreadsheetApp.getUi();
  ui.createMenu('Crypto Tools')
    .addItem('Update Data', 'updateCryptoData')
    .addToUi();
}

// Optional: Set up trigger to auto-update every hour
function createHourlyTrigger() {
  ScriptApp.newTrigger('updateCryptoData')
    .timeBased()
    .everyHours(1)
    .create();
}
