const CACHE_NAME = 'tradevia-v2'; // Versiyonu değiştirdik ki eskisi silinsin

// Sadece en kritik dosyaları listeliyoruz.
// İkonlarda hata varsa bile uygulama çalışsın diye onları "try-catch" ile alacağız.
const CORE_ASSETS = [
  './',
  './index.html',
  './manifest.json'
];

// 1. KURULUM (INSTALL)
self.addEventListener('install', (event) => {
  console.log('[Service Worker] Kuruluyor...');
  event.waitUntil(
    caches.open(CACHE_NAME).then(async (cache) => {
      
      // Önce kritik dosyaları ekle (Bunlar zorunlu)
      try {
        await cache.addAll(CORE_ASSETS);
        console.log('[Service Worker] Kritik dosyalar önbelleklendi.');
      } catch (error) {
        console.error('[Service Worker] Kritik dosya hatası:', error);
      }

      // Şimdi ikonları EKLEMEYİ DENE (Hata verirse işlemi durdurma!)
      const optionalAssets = ['./icon.svg', './icon.png'];
      for (const asset of optionalAssets) {
        try {
          await cache.add(asset);
        } catch (err) {
          console.warn(`[UYARI] ${asset} dosyası bulunamadı, önbelleğe alınmadı. (Ama sorun değil)`);
        }
      }
      
      return self.skipWaiting();
    })
  );
});

// 2. AKTİFLEŞTİRME (ACTIVATE)
self.addEventListener('activate', (event) => {
  console.log('[Service Worker] Aktifleşti.');
  event.waitUntil(
    caches.keys().then((keyList) => {
      return Promise.all(
        keyList.map((key) => {
          if (key !== CACHE_NAME) {
            console.log('[Service Worker] Eski önbellek silindi:', key);
            return caches.delete(key);
          }
        })
      );
    })
  );
  return self.clients.claim();
});

// 3. İSTEK YAKALAMA (FETCH)
self.addEventListener('fetch', (event) => {
  event.respondWith(
    caches.match(event.request).then((response) => {
      // Önbellekte varsa ver, yoksa internetten çek
      return response || fetch(event.request).catch(() => {
        // İnternet de yoksa ve önbellekte de yoksa...
        console.log('[Service Worker] İnternet yok ve dosya önbellekte değil:', event.request.url);
      });
    })
  );
});
