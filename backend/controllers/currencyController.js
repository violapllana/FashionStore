const { getRates } = require("../utils/currencyCache");

exports.getRates = async (req, res) => {
  try {
    const base = req.query.base || "USD";
    const symbols = (req.query.symbols) || "EUR,GBP";
    const data = await getRates(base, symbols);
    return res.json(data);
  } catch (err) {
    return res.status(500).json({ message: err.message });
  }
};
