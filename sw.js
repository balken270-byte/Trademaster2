/* --- SW.JS (PREMIUM VERSION - CRYSTAL PREMIUM İKON) --- */

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
