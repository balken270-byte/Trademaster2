/* --- SW.JS (PREMIUM VERSION - CRYSTAL PREMIUM İKON) --- */

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
        body: body,
        icon: './ikon.png',
        badge: './ikon.png',
        tag: 'tradevia-social',
        renotify: true,
        vibrate: [200, 100, 200]
    });
});
// ===== FİREBASE MESSAGING SONU =====


const CACHE_NAME = 'tradevia-premium-v3';
const ASSETS = [
    './',
    './index.html',
    './ikon.png',
    './ikon.svg',
    './manifest.json'
];

// 1. KURULUM (Dosyaları ve Logoyu İndir)
self.addEventListener('install', (event) => {
    self.skipWaiting();
    event.waitUntil(
        caches.open(CACHE_NAME).then((cache) => {
            return cache.addAll(ASSETS).catch(err => console.log("Cache uyarısı:", err));
        })
    );
});

// 2. AKTİF OLMA
self.addEventListener('activate', (event) => {
    event.waitUntil(clients.claim());
});

// 3. BİLDİRİME TIKLAMA (Uygulamayı Aç)
self.addEventListener('notificationclick', function(event) {
    event.notification.close();

    event.waitUntil(
        clients.matchAll({type: 'window', includeUncontrolled: true}).then(function(clientList) {
            for (var i = 0; i < clientList.length; i++) {
                var client = clientList[i];
                if (client.url.indexOf('index.html') > -1 && 'focus' in client) {
                    return client.focus();
                }
            }
            if (clients.openWindow) {
                return clients.openWindow('./index.html');
            }
        })
    );
});
