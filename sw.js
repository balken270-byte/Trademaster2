/* --- SW.JS (TradeVia - PWA v4 - iOS & Android) --- */

// ===== FİREBASE MESSAGING =====
importScripts('https://www.gstatic.com/firebasejs/10.12.0/firebase-app-compat.js');
importScripts('https://www.gstatic.com/firebasejs/10.12.0/firebase-messaging-compat.js');

firebase.initializeApp({
    apiKey: "AIzaSyCqXkIAaDXMvXyZXStRtAU_mVZCZiDjriA",
    authDomain: "tradevia-b9fd0.firebaseapp.com",
    projectId: "tradevia-b9fd0",
    storageBucket: "tradevia-b9fd0.firebasestorage.app",
    messagingSenderId: "719787960245",
    appId: "1:719787960245:web:544cd596903f29e4a41bfc"
});

const messaging = firebase.messaging();

// Uygulama arka plandayken gelen push bildirimleri
messaging.onBackgroundMessage(function(payload) {
    const title = payload.notification?.title || '🔔 TradeVia';
    const body  = payload.notification?.body  || '';
    self.registration.showNotification(title, {
        body:     body,
        icon:     './ikon.png',
        badge:    './ikon.png',
        tag:      'tradevia-social',
        renotify: true,
        vibrate:  [200, 100, 200]
    });
});
// ===== FİREBASE MESSAGING SONU =====


// ─── CACHE AYARLARI ───────────────────────────────────────────────────────────
// Versiyon değiştiğinde eski cache otomatik silinir.
// Sürüm numarasını her deploy'da artır → v4, v5 ...
const CACHE_NAME = 'tradevia-v4';

// Sadece küçük, güvenilir dosyalar cache'lenir.
// Büyük 3. parti CDN'leri (Firebase, TradingView, Chart.js) buraya EKLEME
// çünkü CORS / opaque response nedeniyle iOS'ta cache boyutu patlar.
const PRECACHE_ASSETS = [
    './',
    './index.html',
    './manifest.json',
    './ikon.png',
    './ikon.svg'
];
// ─────────────────────────────────────────────────────────────────────────────


// 1. KURULUM ──────────────────────────────────────────────────────────────────
self.addEventListener('install', (event) => {
    // Yeni SW beklemeden aktifleşsin (index.html'den SKIP_WAITING mesajı da geliyor)
    self.skipWaiting();

    event.waitUntil(
        caches.open(CACHE_NAME).then((cache) => {
            // addAll yerine tek tek ekle; bir dosya 404 olursa tüm install çökmez
            return Promise.allSettled(
                PRECACHE_ASSETS.map(url =>
                    cache.add(url).catch(() => { /* sessizce geç */ })
                )
            );
        })
    );
});


// 2. AKTİF OLMA ───────────────────────────────────────────────────────────────
self.addEventListener('activate', (event) => {
    event.waitUntil(
        // Eski versiyonlara ait cache'leri temizle
        caches.keys().then((cacheNames) => {
            return Promise.all(
                cacheNames
                    .filter(name => name.startsWith('tradevia-') && name !== CACHE_NAME)
                    .map(name => caches.delete(name))
            );
        }).then(() => {
            // Açık sekmeler yeni SW'yi hemen kullansın, yeniden yükleme gerektirmez
            return clients.claim();
        })
    );
});


// 3. FETCH (Ağ İstekleri) ─────────────────────────────────────────────────────
self.addEventListener('fetch', (event) => {
    const req = event.request;
    const url = new URL(req.url);

    // ① iOS Safari: POST isteklerini ve chrome-extension'ları atla
    if (req.method !== 'GET') return;
    if (url.protocol === 'chrome-extension:') return;

    // ② Firebase, API, CDN isteklerini atla → her zaman ağdan al
    const skipHosts = [
        'firebaseio.com',
        'firestore.googleapis.com',
        'googleapis.com',
        'gstatic.com',
        'tradingview.com',
        'coingecko.com',
        'polygon.io',
        'cdn.jsdelivr.net',
        'cdnjs.cloudflare.com',
        'fonts.googleapis.com',
        'fonts.gstatic.com',
        'unpkg.com'
    ];
    if (skipHosts.some(h => url.hostname.includes(h))) return;

    // ③ HTML sayfası istekleri: Network-first (güncelleme öncelikli)
    if (req.headers.get('accept')?.includes('text/html')) {
        event.respondWith(
            fetch(req)
                .then(res => {
                    // Başarılı cevabı cache'e yaz
                    if (res && res.status === 200) {
                        const clone = res.clone();
                        caches.open(CACHE_NAME).then(c => c.put(req, clone));
                    }
                    return res;
                })
                .catch(() => caches.match(req).then(cached => cached || caches.match('./index.html')))
        );
        return;
    }

    // ④ Diğer lokal dosyalar (ikon, manifest vb.): Cache-first
    event.respondWith(
        caches.match(req).then(cached => {
            if (cached) return cached;
            return fetch(req).then(res => {
                // Sadece başarılı, opaque olmayan (cross-origin) cevapları cache'le
                if (res && res.status === 200 && res.type === 'basic') {
                    const clone = res.clone();
                    caches.open(CACHE_NAME).then(c => c.put(req, clone));
                }
                return res;
            }).catch(() => caches.match('./index.html'));
        })
    );
});


// 4. BİLDİRİME TIKLAMA ────────────────────────────────────────────────────────
self.addEventListener('notificationclick', (event) => {
    event.notification.close();

    const targetUrl = './';   // Her zaman ana sayfayı aç

    event.waitUntil(
        clients.matchAll({ type: 'window', includeUncontrolled: true }).then((clientList) => {
            // Zaten açık bir sekme varsa onu öne getir
            for (const client of clientList) {
                if ('focus' in client) return client.focus();
            }
            // Yoksa yeni sekme/pencere aç
            if (clients.openWindow) return clients.openWindow(targetUrl);
        })
    );
});


// 5. MESAJ DİNLEYİCİSİ (index.html'den SKIP_WAITING komutu) ──────────────────
self.addEventListener('message', (event) => {
    if (event.data && event.data.type === 'SKIP_WAITING') {
        self.skipWaiting();
    }
});
