/* ======================================================
   TRADEVIA - PRO LINGUISTIC ENGINE (V3 - CRASH PROOF)
   Özellikler:
   1. CSS/JS Koruması (Tasarım ve kod bozulmaz)
   2. Akıllı Kuyruk (Aynı kelime için 100 kere istek atmaz)
   3. Hafıza (Cache) Sistemi
   ====================================================== */

// 1. SABİT SÖZLÜK (Kritik Finansal Terimler - Hata Yapmaz)
const dictionary = {
    // --- GENEL ---
    "Cüzdan": "Wallet",
    "Piyasa": "Market",
    "Analiz": "Analytics",
    "Haber": "News",
    "Ayarlar": "Settings",
    "Gelişmiş Finans Terminali": "Advanced Finance Terminal",
    "Yükleniyor...": "Loading...",
    "Hata": "Error",
    "Başarılı": "Success",
    "Kaydet": "Save",
    "İptal": "Cancel",
    "Tamam": "OK",
    "Kapat": "Close",
    "Geri": "Back",
    "Veri Yok": "No Data",
    "Bulunamadı": "Not Found",
    
    // --- CÜZDAN & İŞLEM ---
    "TOPLAM VARLIK": "TOTAL ASSETS",
    "Kâr": "Profit",
    "Zarar": "Loss",
    "Nakit": "Cash",
    "Yatır": "Deposit",
    "Çek": "Withdraw",
    "Temettü": "Dividend",
    "Hızlı İşlem": "Quick Trade",
    "Alış": "Buy",
    "Satış": "Sell",
    "Adet": "Amount",
    "Fiyat": "Price",
    "Sembol": "Symbol",
    "Değişim": "Change",
    "PORTFÖYE EKLE": "ADD TO PORTFOLIO",
    "Portföy Boş": "Portfolio Empty",
    "İşlem Başarılı": "Transaction Successful",
    
    // --- ANALİZ & GRAFİK ---
    "Finansal Planlama": "Financial Planning",
    "Gelecekteki Varlığınızı Bugünden Kurgulayın": "Design Your Future Wealth Today",
    "PERFORMANS": "PERFORMANCE",
    "HEDEFLERİM": "MY GOALS",
    "PSİKOLOJİ": "PSYCHOLOGY",
    "AR-GE": "R&D LAB",
    "TOPLAM NET VARLIK": "TOTAL NET WORTH",
    "BAŞARI ORANI": "WIN RATE",
    "TRADER KARNESİ": "TRADER SCORE",
    "Zaman Makinesi": "Time Machine",
    "Maliyet Sihirbazı": "Cost Wizard",
    "Risk Sihirbazı": "Risk Wizard",
    "Kaos Odası": "Chaos Room",
    "Yapay Zeka": "AI",
    "Tahmin": "Forecast",
    
    // --- HABERLER & ÜYELİK ---
    "Haber Merkezi": "News Center",
    "Son 24 saat": "Last 24 hours",
    "MANŞET": "HEADLINE",
    "Kaynağa Git": "Go to Source",
    "Kayıtlı Stratejilerim": "Saved Strategies",
    "PRO'ya Yükselt": "Upgrade to PRO",
    "Tüm özellikleri aç": "Unlock all features",
    "Üyelik": "Membership",
    "Giriş": "Login",
    "Çıkış": "Logout"
};

/* --- AKILLI ÇEVİRİ MOTORU --- */
const LangSystem = {
    currentLang: 'tr',
    observer: null,
    cacheKey: 'tradevia_lang_cache_v3', 
    dynamicCache: {},
    pendingRequests: {}, // Aynı anda aynı kelimeyi sormamak için kuyruk
    
    // Teknik kodların bozulmaması için yasaklı etiketler
    ignoredTags: ['SCRIPT', 'STYLE', 'NOSCRIPT', 'TEXTAREA', 'CODE', 'PRE', 'LINK', 'META', 'IFRAME'],

    init: function() {
        // Ayarları Yükle
        const settings = JSON.parse(localStorage.getItem('tm_settings')) || {};
        this.currentLang = settings.lang || 'tr';
        
        // Cache Yükle (Daha önce çevrilenleri hatırla)
        const savedCache = localStorage.getItem(this.cacheKey);
        if (savedCache) {
            try { this.dynamicCache = JSON.parse(savedCache); } catch(e) { this.dynamicCache = {}; }
        }

        console.log(`🌍 Dil Modülü: ${this.currentLang.toUpperCase()} (Güvenli Mod Aktif)`);

        // Sadece İngilizce seçiliyse motoru çalıştır
        if (this.currentLang === 'en') {
            this.startTranslation();
        }
    },

    set: function(lang) {
        this.currentLang = lang;
        let settings = JSON.parse(localStorage.getItem('tm_settings')) || {};
        settings.lang = lang;
        localStorage.setItem('tm_settings', JSON.stringify(settings));
        
        // Temiz bir başlangıç için sayfayı yenile
        location.reload();
    },

    startTranslation: function() {
        // 1. Mevcut sayfayı tara
        this.translateNode(document.body);

        // 2. Sayfaya sonradan eklenenleri izle (Canlı Takip)
        this.observer = new MutationObserver((mutations) => {
            mutations.forEach((mutation) => {
                mutation.addedNodes.forEach((node) => {
                    this.translateNode(node);
                });
                
                // Bir yazı değişirse onu da yakala (Sayaçlar vb.)
                if (mutation.type === 'characterData') {
                    // Ebeveyni yasaklı değilse çevir
                    if(mutation.target.parentNode && !this.isIgnored(mutation.target.parentNode)) {
                        this.processTextNode(mutation.target);
                    }
                }
            });
        });

        this.observer.observe(document.body, {
            childList: true,
            subtree: true,
            characterData: true
        });
    },

    // Yasaklı etiket kontrolü (Çökme Önleyici)
    isIgnored: function(node) {
        if (!node) return false;
        // Element kendisi yasaklı mı?
        if (node.tagName && this.ignoredTags.includes(node.tagName.toUpperCase())) return true;
        // Ebeveyni yasaklı mı? (Örn: <style> içindeki metin)
        if (node.parentNode && node.parentNode.tagName && this.ignoredTags.includes(node.parentNode.tagName.toUpperCase())) return true;
        // Google Translate'in kendi widget'ı mı? (Sonsuz döngü olmasın)
        if (node.classList && (node.classList.contains('goog-te-menu-value') || node.id === 'google_translate_element')) return true;
        return false;
    },

    translateNode: function(node) {
        // Yasaklı alandaysak hemen çık (CSS/JS koruması)
        if (this.isIgnored(node)) return;

        // 1. Metin Düğümü ise İşle
        if (node.nodeType === 3) { 
            this.processTextNode(node);
            return;
        }

        // 2. Element ise (Input, Button vb.)
        if (node.nodeType === 1) {
            // Input Placeholder Çevirisi
            if (node.hasAttribute('placeholder')) {
                const ph = node.getAttribute('placeholder');
                if (ph && ph.trim() !== "") {
                    this.getTranslation(ph, (res) => { if(res) node.setAttribute('placeholder', res); });
                }
            }
            
            // Buton Value Çevirisi
            if (node.tagName === 'INPUT' && (node.type === 'button' || node.type === 'submit')) {
                const val = node.value;
                if (val && val.trim() !== "") {
                    this.getTranslation(val, (res) => { if(res) node.value = res; });
                }
            }

            // Alt elemanlara in (Recursive)
            node.childNodes.forEach((child) => this.translateNode(child));
        }
    },

    processTextNode: function(node) {
        const text = node.nodeValue.trim();
        
        // Boşsa, sadece sayıysa veya çok kısaysa geç (Performans için)
        // Regex: Sadece rakam, nokta, virgül ve sembollerden oluşuyorsa çevirme
        if (!text || text.length < 2 || !/[a-zA-ZğüşıöçĞÜŞİÖÇ]/.test(text)) return;
        
        // Sembol kontrolü (BTC, USD/TRY vb. çevrilmesin)
        if (text.length <= 5 && text === text.toUpperCase()) return; 

        this.getTranslation(text, (translatedText) => {
            // Sadece gerçekten değişmişse DOM'u güncelle
            if (translatedText && translatedText !== text) {
                // DOM hala oradaysa güncelle
                if(node.parentNode) node.nodeValue = translatedText;
            }
        });
    },

    // --- AKILLI ÇEVİRİ İSTEMCİSİ ---
    getTranslation: function(text, callback) {
        // 1. Sabit Sözlükte var mı? (En Hızlı)
        if (dictionary[text]) { callback(dictionary[text]); return; }

        // 2. Cache'te (Hafızada) var mı? (Hızlı)
        if (this.dynamicCache[text]) { callback(this.dynamicCache[text]); return; }

        // 3. KUYRUK KONTROLÜ (ÇÖKME ÖNLEYİCİ)
        // Eğer bu kelime şu an zaten soruluyorsa, tekrar sorma! Beni listeye ekle.
        if (this.pendingRequests[text]) {
            this.pendingRequests[text].push(callback);
            return;
        }

        // İlk kez soruluyor, kuyruğu başlat
        this.pendingRequests[text] = [callback];

        // 4. İnternetten Çek (Google API)
        const sourceText = encodeURIComponent(text);
        const url = `https://translate.googleapis.com/translate_a/single?client=gtx&sl=tr&tl=en&dt=t&q=${sourceText}`;

        fetch(url)
            .then(res => res.json())
            .then(data => {
                let translatedText = text; // Varsayılan: Orijinal kalsın
                
                if (data && data[0] && data[0][0] && data[0][0][0]) {
                    translatedText = data[0][0][0];
                    
                    // Cache'e kaydet
                    this.dynamicCache[text] = translatedText;
                    localStorage.setItem(this.cacheKey, JSON.stringify(this.dynamicCache));
                }

                // KUYRUKTAKİ HERKESE CEVABI VER
                const waitingCallbacks = this.pendingRequests[text];
                if (waitingCallbacks) {
                    waitingCallbacks.forEach(cb => cb(translatedText));
                    delete this.pendingRequests[text]; // Kuyruğu temizle
                }
            })
            .catch(() => {
                // Hata olursa (İnternet yoksa) kuyruktakilere orijinali dön
                const waitingCallbacks = this.pendingRequests[text];
                if (waitingCallbacks) {
                    waitingCallbacks.forEach(cb => cb(text));
                    delete this.pendingRequests[text];
                }
            });
    }
};

// Başlatıcı
document.addEventListener('DOMContentLoaded', () => { LangSystem.init(); });
// Eski kodlarla uyumluluk
function changeLanguage(val) { LangSystem.set(val); }
