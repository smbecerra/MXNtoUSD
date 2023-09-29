require('dotenv').config();

// Cache object and cache validity duration (5 minutes)
const cache = {};
const cacheDuration = 5 * 60 * 1000;

async function fetchData(url) {
  const response = await fetch(url);
  if (!response.ok) {
    throw new Error(`HTTP error! status: ${response.status}`);
  }
  return await response.json();
}

async function getConversionRate(fromCurrency, toCurrency) {
  const cacheKey = `${fromCurrency}_${toCurrency}`;
  const cachedValue = cache[cacheKey];

  // Check if we have a recent cached value
  if (cachedValue && (Date.now() - cachedValue.timestamp < cacheDuration)) {
    return cachedValue.rate;
  }

  const apiURL = `https://api.example.com/currency/convert?from=${fromCurrency}&to=${toCurrency}`;
  const data = await fetchData(apiURL);

  // Store the fetched rate in cache
  cache[cacheKey] = {
    rate: data.rate,
    timestamp: Date.now()
  };

  return data.rate;
}

async function getCurrentPriceOfMXN() {
  try {
    const rate = await getConversionRate('USD', 'MXN');
    console.log(`Current price of 1 USD in MXN is ${rate}`);
  } catch (error) {
    console.log(`Failed to fetch currency rate: ${error}`);
  }
}

getCurrentPriceOfMXN();
