/* ============================================================
   TRADEVIA — PRO LINGUISTIC ENGINE V4
   Yenilikler:
   1. Sohbet Mesajı Çevirisi (Satır içi çeviri butonu)
   2. Otomatik Dil Algılama (TR/EN fark etmez)
   3. Çift Yönlü Çeviri (TR→EN ve EN→TR)
   4. CSS/JS Koruması
   5. Akıllı Kuyruk
   6. Kalıcı Cache
   ============================================================ */

// ── SABİT SÖZLÜK ──────────────────────────────────────────
const dictionary = {
    tr_to_en: {
        "Cüzdan":"Wallet","Piyasa":"Market","Analiz":"Analytics","Haber":"News",
        "Ayarlar":"Settings","Gelişmiş Finans Terminali":"Advanced Finance Terminal",
        "Yükleniyor...":"Loading...","Hata":"Error","Başarılı":"Success",
        "Kaydet":"Save","İptal":"Cancel","Tamam":"OK","Kapat":"Close","Geri":"Back",
        "Veri Yok":"No Data","Bulunamadı":"Not Found",
        "TOPLAM VARLIK":"TOTAL ASSETS","Kâr":"Profit","Zarar":"Loss","Nakit":"Cash",
        "Yatır":"Deposit","Çek":"Withdraw","Temettü":"Dividend","Hızlı İşlem":"Quick Trade",
        "Alış":"Buy","Satış":"Sell","Adet":"Amount","Fiyat":"Price","Sembol":"Symbol",
        "Değişim":"Change","PORTFÖYE EKLE":"ADD TO PORTFOLIO","Portföy Boş":"Portfolio Empty",
        "İşlem Başarılı":"Transaction Successful","Finansal Planlama":"Financial Planning",
        "PERFORMANS":"PERFORMANCE","HEDEFLERİM":"MY GOALS","PSİKOLOJİ":"PSYCHOLOGY",
        "AR-GE":"R&D LAB","TOPLAM NET VARLIK":"TOTAL NET WORTH","BAŞARI ORANI":"WIN RATE",
        "TRADER KARNESİ":"TRADER SCORE","Zaman Makinesi":"Time Machine",
        "Maliyet Sihirbazı":"Cost Wizard","Risk Sihirbazı":"Risk Wizard",
        "Kaos Odası":"Chaos Room","Yapay Zeka":"AI","Tahmin":"Forecast",
        "Haber Merkezi":"News Center","Son 24 saat":"Last 24 hours","MANŞET":"HEADLINE",
        "Kaynağa Git":"Go to Source","Kayıtlı Stratejilerim":"Saved Strategies",
        "PRO'ya Yükselt":"Upgrade to PRO","Tüm özellikleri aç":"Unlock all features",
        "Üyelik":"Membership","Giriş":"Login","Çıkış":"Logout",
        "Üye":"Member","Mesaj":"Message","Medya":"Media",
        "Mesajlarda Ara":"Search Messages","Medya & Dosyalar":"Media & Files",
        "Bildirimleri Sessize Al":"Mute Notifications","Gruptan Ayrıl":"Leave Group",
        "Canlı Fiyat":"Live Price","Mesaj yaz...":"Write a message...",
        "Topluluğu":"Community","Topluluğuna Hoş Geldin!":"Welcome to Community!"
    },
    en_to_tr: {
        "Wallet":"Cüzdan","Market":"Piyasa","Analytics":"Analiz","News":"Haber",
        "Settings":"Ayarlar","Loading...":"Yükleniyor...","Error":"Hata",
        "Success":"Başarılı","Save":"Kaydet","Cancel":"İptal","OK":"Tamam",
        "Close":"Kapat","Back":"Geri","Profit":"Kâr","Loss":"Zarar","Cash":"Nakit",
        "Buy":"Alış","Sell":"Satış","Price":"Fiyat","Member":"Üye",
        "Message":"Mesaj","Media":"Medya","Live Price":"Canlı Fiyat",
        "Community":"Topluluk"
    }
};

/* ── DİL ALGILAMA ─────────────────────────────────────── */
function detectLang(text) {
    if (/[ğüşıöçĞÜŞİÖÇ]/.test(text)) return 'tr';
    const trWords = ['bir','ve','bu','ile','için','olan','değil','ama','çok','var',
                     'daha','ben','sen','biz','siz','olan','nasıl','neden','olan'];
    const words = text.toLowerCase().split(/\s+/);
    const trCount = words.filter(w => trWords.includes(w)).length;
    if (trCount >= 2 || (trCount >= 1 && words.length <= 5)) return 'tr';
    return 'en';
}

/* ── ANA SİSTEM ───────────────────────────────────────── */
const LangSystem = {
    currentLang: 'tr',
    observer: null,
    cacheKey: 'tradevia_lang_cache_v4',
    dynamicCache: {},
    pendingRequests: {},
    ignoredTags: ['SCRIPT','STYLE','NOSCRIPT','TEXTAREA','CODE','PRE','LINK','META','IFRAME'],

    init: function() {
        const settings = JSON.parse(localStorage.getItem('tm_settings') || '{}');
        this.currentLang = settings.lang || 'tr';
        const savedCache = localStorage.getItem(this.cacheKey);
        if (savedCache) {
            try { this.dynamicCache = JSON.parse(savedCache); } catch(e) { this.dynamicCache = {}; }
        }
        console.log('🌍 Dil Motoru V4: ' + this.currentLang.toUpperCase() + ' | Chat Çevirisi AKTİF');
        if (this.currentLang === 'en') {
            this.startTranslation();
        }
        this._initChatTranslation();
    },

    set: function(lang) {
        const prevLang = this.currentLang;
        this.currentLang = lang;

        // Ayarı kaydet
        let settings = JSON.parse(localStorage.getItem('tm_settings') || '{}');
        settings.lang = lang;
        localStorage.setItem('tm_settings', JSON.stringify(settings));

        // Aynı dil seçildiyse bir şey yapma
        if (prevLang === lang) return;

        if (lang === 'en') {
            // TR → EN: Tüm sayfayı çevir + observer başlat
            this.startTranslation();
        } else {
            // EN → TR: Sayfayı orijinaline döndür
            this._restoreOriginal();
            // Observer'ı durdur
            if (this.observer) { this.observer.disconnect(); this.observer = null; }
        }

        // Chat butonlarını güncelle (mevcut mesajlar)
        const self = this;
        setTimeout(function() {
            const feed = document.getElementById('commChatMessages');
            if (!feed) return;
            // Eski translate butonlarını kaldır, yeniden enjekte et
            feed.querySelectorAll('.chat-translate-btn').forEach(function(btn) { btn.remove(); });
            Array.from(feed.children).forEach(function(child) { self._injectTranslateButtons(child); });
        }, 100);
    },

    // Sayfayı orijinal TR'ye döndür
    _restoreOriginal: function() {
        const self = this;
        // data-original-text attribute'u ile saklanan orijinal metinleri geri yükle
        document.querySelectorAll('[data-original-text]').forEach(function(el) {
            el.textContent = el.getAttribute('data-original-text');
            el.removeAttribute('data-original-text');
        });
        // Cache'i temizleme — sadece DOM'u geri yükle
        // Placeholder'ları geri yükle
        document.querySelectorAll('[data-original-placeholder]').forEach(function(el) {
            el.setAttribute('placeholder', el.getAttribute('data-original-placeholder'));
            el.removeAttribute('data-original-placeholder');
        });
    },

    startTranslation: function() {
        this.translateNode(document.body);
        const self = this;
        this.observer = new MutationObserver(function(mutations) {
            mutations.forEach(function(mutation) {
                mutation.addedNodes.forEach(function(node) {
                    if (node.nodeType === 1) self._injectTranslateButtons(node);
                    self.translateNode(node);
                });
                if (mutation.type === 'characterData') {
                    if (mutation.target.parentNode && !self.isIgnored(mutation.target.parentNode)) {
                        self.processTextNode(mutation.target);
                    }
                }
            });
        });
        this.observer.observe(document.body, { childList: true, subtree: true, characterData: true });
    },

    isIgnored: function(node) {
        if (!node) return false;
        if (node.tagName && this.ignoredTags.includes(node.tagName.toUpperCase())) return true;
        if (node.parentNode && node.parentNode.tagName &&
            this.ignoredTags.includes(node.parentNode.tagName.toUpperCase())) return true;
        if (node.classList && (node.classList.contains('goog-te-menu-value') ||
            node.id === 'google_translate_element' ||
            node.classList.contains('chat-translate-btn') ||
            node.classList.contains('chat-translated-text'))) return true;
        // Chat mesajlarını koru — çeviri butonu ayrıca hallediyor
        if (node.id === 'commChatMessages') return true;
        if (node.id && node.id.startsWith('msg-')) return true;
        // Herhangi bir ebeveyn commChatMessages ise koru
        var parent = node.parentNode;
        while (parent) {
            if (parent.id === 'commChatMessages') return true;
            parent = parent.parentNode;
        }
        return false;
    },

    translateNode: function(node) {
        if (this.isIgnored(node)) return;
        if (node.nodeType === 3) { this.processTextNode(node); return; }
        if (node.nodeType === 1) {
            if (node.hasAttribute('placeholder')) {
                const ph = node.getAttribute('placeholder');
                if (ph && ph.trim()) {
                    if (!node.hasAttribute('data-original-placeholder')) {
                        node.setAttribute('data-original-placeholder', ph);
                    }
                    this.getTranslation(ph, 'tr', 'en', function(res) { if (res) node.setAttribute('placeholder', res); });
                }
            }
            if (node.tagName === 'INPUT' && (node.type === 'button' || node.type === 'submit')) {
                const val = node.value;
                if (val && val.trim()) {
                    this.getTranslation(val, 'tr', 'en', function(res) { if (res) node.value = res; });
                }
            }
            node.childNodes.forEach(child => this.translateNode(child));
        }
    },

    processTextNode: function(node) {
        const text = node.nodeValue.trim();
        if (!text || text.length < 2 || !/[a-zA-ZğüşıöçĞÜŞİÖÇ]/.test(text)) return;
        if (text.length <= 5 && text === text.toUpperCase()) return;
        const self = this;
        this.getTranslation(text, 'tr', 'en', function(translatedText) {
            if (translatedText && translatedText !== text && node.parentNode) {
                // Orijinali parent element'e sakla (geri dönüş için)
                if (node.parentNode && !node.parentNode.hasAttribute('data-original-text')) {
                    node.parentNode.setAttribute('data-original-text', text);
                }
                node.nodeValue = translatedText;
            }
        });
    },

    /* ── SOHBET MESAJ ÇEVİRİ BUTONU ─────────────────── */
    _initChatTranslation: function() {
        const self = this;
        const chatObserver = new MutationObserver(function(mutations) {
            mutations.forEach(function(mutation) {
                mutation.addedNodes.forEach(function(node) {
                    if (node.nodeType === 1) self._injectTranslateButtons(node);
                });
            });
        });

        function tryObserve() {
            const feed = document.getElementById('commChatMessages');
            if (feed) {
                chatObserver.observe(feed, { childList: true, subtree: false });
                Array.from(feed.children).forEach(function(child) {
                    self._injectTranslateButtons(child);
                });
            } else {
                setTimeout(tryObserve, 800);
            }
        }

        if (document.readyState === 'loading') {
            document.addEventListener('DOMContentLoaded', tryObserve);
        } else {
            tryObserve();
        }

        // commChatModal açıldığında da tara
        const origShowComm = window.showCommChatModal;
        if (origShowComm) {
            window.showCommChatModal = function() {
                origShowComm.apply(this, arguments);
                setTimeout(function() {
                    const feed = document.getElementById('commChatMessages');
                    if (feed) {
                        chatObserver.observe(feed, { childList: true, subtree: false });
                        Array.from(feed.children).forEach(function(c) { self._injectTranslateButtons(c); });
                    }
                }, 600);
            };
        }
    },

    _injectTranslateButtons: function(el) {
        if (!el || !el.id || !el.id.startsWith('msg-')) return;
        if (el.querySelector('.chat-translate-btn')) return;

        const self = this;
        const appLang = this.currentLang; // 'tr' veya 'en'

        // Mesaj baloncuklarını bul
        const bubbles = el.querySelectorAll('[style*="line-height:1.55"]');
        bubbles.forEach(function(bubble) {
            // Metin içeren div'i bul (ikonlu/saatli divleri atla)
            let textDiv = null;
            const allDivs = bubble.querySelectorAll('div');
            allDivs.forEach(function(d) {
                if (d.querySelector('.chat-translate-btn')) return;
                if (d.querySelector('i.fas')) return;  // İkon içeriyorsa meta satır
                if (d.querySelector('span[style*="font-size:10px"]')) return; // Saat satırı
                const txt = d.textContent.trim();
                if (txt.length > 3 && !textDiv) textDiv = d;
            });
            if (!textDiv) return;

            const originalText = textDiv.textContent.trim();
            if (!originalText || originalText.length < 3) return;

            const msgLang = detectLang(originalText);

            // Hedef dil: mesaj dili ≠ uygulama dili ise çeviri yap
            // TR kullanıcı EN mesaj görüyor → EN→TR butonu göster
            // EN kullanıcı TR mesaj görüyor → TR→EN butonu göster
            // Aynı dildeyse de butonu gizleme — kullanıcı tercihine bırak
            const targetLang = msgLang === 'tr' ? 'en' : 'tr';
            const btnLabel = msgLang === 'tr'
                ? (appLang === 'en' ? '🌐 Translate' : '🌐 Çevir')
                : (appLang === 'en' ? '🌐 Translate' : '🌐 Çevir');
            const origLabel = appLang === 'en' ? '↩ Original' : '↩ Orijinal';

            // Buton oluştur
            const btn = document.createElement('div');
            btn.className = 'chat-translate-btn';
            btn.setAttribute('data-original', originalText);
            btn.setAttribute('data-translated', '');
            btn.setAttribute('data-state', 'original');
            btn.style.cssText = 'display:inline-flex;align-items:center;gap:5px;margin-top:6px;cursor:pointer;font-size:11px;color:rgba(147,210,255,0.9);background:rgba(147,210,255,0.07);border:1px solid rgba(147,210,255,0.18);border-radius:10px;padding:4px 10px;user-select:none;-webkit-user-select:none;transition:background 0.18s;';

            btn.innerHTML = '<i class="fas fa-language" style="font-size:12px;"></i>&nbsp;' + btnLabel;

            btn.addEventListener('touchstart', function() { btn.style.background = 'rgba(147,210,255,0.15)'; });
            btn.addEventListener('touchend', function() { btn.style.background = 'rgba(147,210,255,0.07)'; });

            btn.addEventListener('click', function(e) {
                e.stopPropagation();
                const state = btn.getAttribute('data-state');

                if (state === 'translated') {
                    textDiv.textContent = btn.getAttribute('data-original');
                    btn.innerHTML = '<i class="fas fa-language" style="font-size:12px;"></i>&nbsp;' + btnLabel;
                    btn.setAttribute('data-state', 'original');
                    return;
                }

                const cached = btn.getAttribute('data-translated');
                if (cached) {
                    textDiv.textContent = cached;
                    btn.innerHTML = '<i class="fas fa-undo" style="font-size:11px;"></i>&nbsp;' + origLabel;
                    btn.setAttribute('data-state', 'translated');
                    return;
                }

                // Spinner
                btn.innerHTML = '<i class="fas fa-circle-notch fa-spin" style="font-size:11px;"></i>';
                btn.style.pointerEvents = 'none';

                self.getTranslation(originalText, msgLang, targetLang, function(result) {
                    btn.style.pointerEvents = '';
                    if (!result || result === originalText) {
                        btn.innerHTML = '<i class="fas fa-exclamation-triangle" style="font-size:11px;"></i>';
                        setTimeout(function() {
                            btn.innerHTML = '<i class="fas fa-language" style="font-size:12px;"></i>&nbsp;' + btnLabel;
                        }, 2000);
                        return;
                    }
                    btn.setAttribute('data-translated', result);
                    textDiv.textContent = result;
                    btn.innerHTML = '<i class="fas fa-undo" style="font-size:11px;"></i>&nbsp;' + origLabel;
                    btn.setAttribute('data-state', 'translated');
                });
            });

            bubble.appendChild(btn);
        });
    },

    /* ── ÇEVİRİ API ───────────────────────────────────── */
    getTranslation: function(text, fromLang, toLang, callback) {
        const cacheKey = fromLang + '→' + toLang + '|' + text;
        const dictKey = fromLang + '_to_' + toLang;

        // 1. Sabit sözlük
        if (dictionary[dictKey] && dictionary[dictKey][text]) {
            callback(dictionary[dictKey][text]); return;
        }
        // 2. Cache
        if (this.dynamicCache[cacheKey]) {
            callback(this.dynamicCache[cacheKey]); return;
        }
        // 3. Kuyruk
        if (this.pendingRequests[cacheKey]) {
            this.pendingRequests[cacheKey].push(callback); return;
        }
        this.pendingRequests[cacheKey] = [callback];

        // 4. Google Translate
        const url = 'https://translate.googleapis.com/translate_a/single?client=gtx&sl='
            + fromLang + '&tl=' + toLang + '&dt=t&q=' + encodeURIComponent(text);
        const self = this;

        fetch(url)
            .then(function(res) { return res.json(); })
            .then(function(data) {
                let result = text;
                if (data && data[0]) {
                    result = data[0]
                        .filter(function(p) { return p && p[0]; })
                        .map(function(p) { return p[0]; })
                        .join('');
                }
                if (result && result !== text) {
                    self.dynamicCache[cacheKey] = result;
                    try { localStorage.setItem(self.cacheKey, JSON.stringify(self.dynamicCache)); } catch(e) {}
                }
                const waiting = self.pendingRequests[cacheKey];
                if (waiting) {
                    waiting.forEach(function(cb) { cb(result); });
                    delete self.pendingRequests[cacheKey];
                }
            })
            .catch(function() {
                const waiting = self.pendingRequests[cacheKey];
                if (waiting) {
                    waiting.forEach(function(cb) { cb(text); });
                    delete self.pendingRequests[cacheKey];
                }
            });
    }
};

/* ── BAŞLATICI ─────────────────────────────────────────── */
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', function() { LangSystem.init(); });
} else {
    LangSystem.init();
}

function changeLanguage(val) { LangSystem.set(val); }
window.LangSystem = LangSystem;

/* buildChatMessage sonrası çağrılacak global hook */
window.injectChatTranslateBtn = function(msgEl) {
    setTimeout(function() { LangSystem._injectTranslateButtons(msgEl); }, 50);
};
