/* --- SW.JS (PREMIUM VERSION - İKON DESTEKLİ) --- */

const CACHE_NAME = 'tradevia-premium-v2';
const ASSETS = [
    './',              // Ana dizin
    './zaman.html',    // Senin ana dosyan
    './ikon.png',      // <-- ÖNEMLİ: Logoyu hafızaya alıyoruz
    './manifest.json'
];

// 1. KURULUM (Dosyaları ve Logoyu İndir)
self.addEventListener('install', (event) => {
    self.skipWaiting();
    event.waitUntil(
        caches.open(CACHE_NAME).then((cache) => {
            // Dosyalar varsa önbelleğe al, yoksa hata verme devam et
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
    event.notification.close(); // Bildirimi kapat

    // Kullanıcı bildirime basınca uygulamayı aç veya odaklan
    event.waitUntil(
        clients.matchAll({type: 'window', includeUncontrolled: true}).then(function(clientList) {
            // Zaten açıksa ona git
            for (var i = 0; i < clientList.length; i++) {
                var client = clientList[i];
                if (client.url.indexOf('zaman.html') > -1 && 'focus' in client) {
                    return client.focus();
                }
            }
            // Kapalıysa yeni aç
            if (clients.openWindow) {
                return clients.openWindow('./zaman.html');
            }
        })
    );
});
