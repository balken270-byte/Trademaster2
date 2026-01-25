/* --- sw.js (SERVICE WORKER - BİLDİRİM VE ÖNBELLEK) --- */

const CACHE_NAME = 'tradevia-cache-v1';

// 1. KURULUM (Install)
self.addEventListener('install', (event) => {
    // Yeni SW yüklendiğinde hemen aktif ol
    self.skipWaiting();
});

// 2. AKTİF OLMA (Activate)
self.addEventListener('activate', (event) => {
    // Eski önbellekleri temizle ve kontrolü devral
    event.waitUntil(clients.claim());
});

// 3. BİLDİRİME TIKLAMA OLAYI (Çok Önemli)
// Kullanıcı telefonun tepesindeki bildirime tıkladığında ne olacağını belirler
self.addEventListener('notificationclick', function(event) {
    event.notification.close(); // Bildirimi kapat

    event.waitUntil(
        clients.matchAll({type: 'window'}).then(function(clientList) {
            // 1. Zaten açık bir TradeVia sekmesi varsa ona odaklan
            for (var i = 0; i < clientList.length; i++) {
                var client = clientList[i];
                if (client.url.indexOf(self.registration.scope) > -1 && 'focus' in client) {
                    return client.focus();
                }
            }
            // 2. Yoksa uygulamayı yeni pencerede aç
            if (clients.openWindow) {
                return clients.openWindow('./zaman.html'); // Dosya adın neyse o
            }
        })
    );
});
