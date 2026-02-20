/**
 * TradeVia - CoinGecko Cache Proxy
 * Firebase Cloud Functions
 * 
 * Tüm CoinGecko istekleri buradan geçer.
 * 60 saniyede bir gerçek API isteği atılır, geri kalanı cache'den döner.
 * Böylece 100 kullanıcı = hâlâ 1 CoinGecko isteği/dakika.
 */

const functions = require("firebase-functions");
const admin = require("firebase-admin");
const https = require("https");

admin.initializeApp();
const db = admin.firestore();

// ─── AYARLAR ───────────────────────────────────────────────
const CG_API_KEY = "CG-G2hRKmRzcPTYJUA3L79dg8Ta"; // Senin API keyin
const CACHE_TTL_MS = 60 * 1000; // 60 saniye cache
const CG_BASE = "https://api.coingecko.com/api/v3";
// ───────────────────────────────────────────────────────────

/**
 * CoinGecko'ya istek atar (Node.js https modülü ile)
 */
function cgFetch(path) {
  return new Promise((resolve, reject) => {
    const sep = path.includes("?") ? "&" : "?";
    const url = `${CG_BASE}${path}${sep}x_cg_demo_api_key=${CG_API_KEY}`;
    https.get(url, (res) => {
      let raw = "";
      res.on("data", (chunk) => { raw += chunk; });
      res.on("end", () => {
        try { resolve(JSON.parse(raw)); }
        catch (e) { reject(new Error("JSON parse hatası")); }
      });
    }).on("error", reject);
  });
}

/**
 * Firestore'dan cache oku — geçerliyse döndür, değilse null
 */
async function readCache(key) {
  try {
    const doc = await db.collection("cg_cache").doc(key).get();
    if (!doc.exists) return null;
    const { data, ts } = doc.data();
    if (Date.now() - ts < CACHE_TTL_MS) return data;
    return null; // süresi dolmuş
  } catch { return null; }
}

/**
 * Firestore'a cache yaz
 */
async function writeCache(key, data) {
  await db.collection("cg_cache").doc(key).set({ data, ts: Date.now() });
}

/**
 * CORS başlıkları ekle
 */
function setCors(res) {
  res.set("Access-Control-Allow-Origin", "*");
  res.set("Access-Control-Allow-Methods", "GET, OPTIONS");
  res.set("Access-Control-Allow-Headers", "Content-Type");
}

// ═══════════════════════════════════════════════════════════
// ENDPOINT 1: /cgProxy/markets
// Kullanım: ?per_page=50&page=1&ids=bitcoin,ethereum&order=market_cap_desc
// ═══════════════════════════════════════════════════════════
exports.cgMarkets = functions.https.onRequest(async (req, res) => {
  setCors(res);
  if (req.method === "OPTIONS") return res.status(204).send("");

  const { per_page = 50, page = 1, ids = "", order = "market_cap_desc", price_change_percentage = "" } = req.query;

  // Cache anahtarı: parametrelere göre benzersiz
  const cacheKey = `markets_${per_page}_${page}_${ids}_${order}_${price_change_percentage}`;

  try {
    // 1. Cache'e bak
    const cached = await readCache(cacheKey);
    if (cached) {
      return res.json({ source: "cache", data: cached });
    }

    // 2. Cache yok veya süresi dolmuş → CoinGecko'dan çek
    let path = `/coins/markets?vs_currency=usd&order=${order}&per_page=${per_page}&page=${page}&sparkline=false`;
    if (ids) path += `&ids=${ids}`;
    if (price_change_percentage) path += `&price_change_percentage=${price_change_percentage}`;

    const data = await cgFetch(path);

    // 3. Cache'e yaz (arka planda)
    writeCache(cacheKey, data).catch(() => {});

    return res.json({ source: "live", data });
  } catch (err) {
    console.error("cgMarkets hata:", err);
    return res.status(500).json({ error: err.message });
  }
});

// ═══════════════════════════════════════════════════════════
// ENDPOINT 2: /cgProxy/search
// Kullanım: ?query=bitcoin
// ═══════════════════════════════════════════════════════════
exports.cgSearch = functions.https.onRequest(async (req, res) => {
  setCors(res);
  if (req.method === "OPTIONS") return res.status(204).send("");

  const { query } = req.query;
  if (!query) return res.status(400).json({ error: "query parametresi gerekli" });

  const cacheKey = `search_${query.toLowerCase()}`;

  try {
    const cached = await readCache(cacheKey);
    if (cached) return res.json({ source: "cache", data: cached });

    const data = await cgFetch(`/search?query=${encodeURIComponent(query)}`);
    writeCache(cacheKey, data).catch(() => {});

    return res.json({ source: "live", data });
  } catch (err) {
    console.error("cgSearch hata:", err);
    return res.status(500).json({ error: err.message });
  }
});

// ═══════════════════════════════════════════════════════════
// ENDPOINT 3: /cgProxy/coinDetail
// Kullanım: ?id=bitcoin
// ═══════════════════════════════════════════════════════════
exports.cgCoinDetail = functions.https.onRequest(async (req, res) => {
  setCors(res);
  if (req.method === "OPTIONS") return res.status(204).send("");

  const { id } = req.query;
  if (!id) return res.status(400).json({ error: "id parametresi gerekli" });

  const cacheKey = `detail_${id}`;

  try {
    const cached = await readCache(cacheKey);
    if (cached) return res.json({ source: "cache", data: cached });

    const data = await cgFetch(`/coins/${id}?localization=false&tickers=false&market_data=true&community_data=false&developer_data=false&sparkline=false`);
    writeCache(cacheKey, data).catch(() => {});

    return res.json({ source: "live", data });
  } catch (err) {
    console.error("cgCoinDetail hata:", err);
    return res.status(500).json({ error: err.message });
  }
});

// ═══════════════════════════════════════════════════════════
// ENDPOINT 4: /cgProxy/marketChart
// Kullanım: ?id=bitcoin&days=30
// ═══════════════════════════════════════════════════════════
exports.cgMarketChart = functions.https.onRequest(async (req, res) => {
  setCors(res);
  if (req.method === "OPTIONS") return res.status(204).send("");

  const { id, days = 30 } = req.query;
  if (!id) return res.status(400).json({ error: "id parametresi gerekli" });

  const cacheKey = `chart_${id}_${days}`;

  try {
    const cached = await readCache(cacheKey);
    if (cached) return res.json({ source: "cache", data: cached });

    const data = await cgFetch(`/coins/${id}/market_chart?vs_currency=usd&days=${days}`);
    writeCache(cacheKey, data).catch(() => {});

    return res.json({ source: "live", data });
  } catch (err) {
    console.error("cgMarketChart hata:", err);
    return res.status(500).json({ error: err.message });
  }
});

// ═══════════════════════════════════════════════════════════
// ENDPOINT 5: /cgProxy/global
// Global kripto piyasa verileri
// ═══════════════════════════════════════════════════════════
exports.cgGlobal = functions.https.onRequest(async (req, res) => {
  setCors(res);
  if (req.method === "OPTIONS") return res.status(204).send("");

  const cacheKey = "global";

  try {
    const cached = await readCache(cacheKey);
    if (cached) return res.json({ source: "cache", data: cached });

    const data = await cgFetch("/global");
    writeCache(cacheKey, data).catch(() => {});

    return res.json({ source: "live", data });
  } catch (err) {
    console.error("cgGlobal hata:", err);
    return res.status(500).json({ error: err.message });
  }
});

// ═══════════════════════════════════════════════════════════
// ENDPOINT 6: /cgProxy/simplePrice
// Kullanım: ?ids=bitcoin,ethereum
// ═══════════════════════════════════════════════════════════
exports.cgSimplePrice = functions.https.onRequest(async (req, res) => {
  setCors(res);
  if (req.method === "OPTIONS") return res.status(204).send("");

  const { ids } = req.query;
  if (!ids) return res.status(400).json({ error: "ids parametresi gerekli" });

  const cacheKey = `simpleprice_${ids}`;

  try {
    const cached = await readCache(cacheKey);
    if (cached) return res.json({ source: "cache", data: cached });

    const data = await cgFetch(`/simple/price?ids=${ids}&vs_currencies=usd&include_24hr_change=true`);
    writeCache(cacheKey, data).catch(() => {});

    return res.json({ source: "live", data });
  } catch (err) {
    console.error("cgSimplePrice hata:", err);
    return res.status(500).json({ error: err.message });
  }
});

