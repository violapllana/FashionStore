const axios = require("axios");
let cache = { data: null, ts: 0 };

exports.getRates = async (base = "USD", symbols = "EUR,GBP") => {
  const now = Date.now();
  const oneHour = 1000 * 60 * 60;
  if (cache.data && (now - cache.ts) < oneHour && cache.base === base && cache.symbols === symbols) {
    return cache.data;
  }
  const res = await axios.get(`https://api.exchangerate.host/latest?base=${base}&symbols=${symbols}`);
  cache = { data: res.data, ts: now, base, symbols };
  return res.data;
};
