// sw.js dosyasının içeriği:

// HER GÜNCELLEMEDE BURAYI DEĞİŞTİR: v1 -> v2 -> v3
const CACHE_NAME = 'tradevia-v2'; 

const ASSETS_TO_CACHE = [
  './',
  './index.html',
  './manifest.json',
  './icon.svg',
  // Buraya diğer statik dosyalarını (css, js, resimler) ekleyebilirsin
];

// 1. KURULUM (Install)
self.addEventListener('install', (event) => {
  // Yeni SW kurulurken eskisini bekleme, hemen devreye gir
  self.skipWaiting();
  
  event.waitUntil(
    caches.open(CACHE_NAME).then((cache) => {
      return cache.addAll(ASSETS_TO_CACHE);
    })
  );
});

// 2. AKTİFLEŞTİRME (Activate) - Eski Cache'leri Sil
self.addEventListener('activate', (event) => {
  // Yeni SW aktif olduğunda sayfayı hemen kontrolüne al
  event.waitUntil(clients.claim());

  event.waitUntil(
    caches.keys().then((cacheNames) => {
      return Promise.all(
        cacheNames.map((cache) => {
          // Eğer cache ismi bizim şu anki versiyonumuz değilse sil
          if (cache !== CACHE_NAME) {
            console.log('Eski cache temizleniyor:', cache);
            return caches.delete(cache);
          }
        })
      );
    })
  );
});

// 3. İSTEKLERİ YAKALAMA (Fetch) - Network First (Önce İnternet) Stratejisi
// Bu strateji HTML dosyaları için interneti zorlar, böylece güncellemeler hemen görünür.
self.addEventListener('fetch', (event) => {
  event.respondWith(
    fetch(event.request)
      .then((response) => {
        // İnternetten başarılı yanıt geldiyse, cache'i güncelle ve yanıtı döndür
        if (!response || response.status !== 200 || response.type !== 'basic') {
          return response;
        }
        
        // Yanıtı klonla çünkü hem tarayıcıya hem cache'e gidecek
        const responseToCache = response.clone();
        caches.open(CACHE_NAME).then((cache) => {
          cache.put(event.request, responseToCache);
        });

        return response;
      })
      .catch(() => {
        // İnternet yoksa cache'den döndür
        return caches.match(event.request);
      })
  );
});
