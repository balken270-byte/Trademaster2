/* ============================================================
   TRADEVIA — PRO LINGUISTIC ENGINE V4
   - Otomatik sohbet çevirisi (buton yok, sessiz)
   - Çift yönlü TR↔EN
   - Dil algılama
   - Reload yok — canlı geçiş
   ============================================================ */

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

/* ── DİL ALGILAMA ─────────────────────────────────────────
   Önce yerel kontrol, belirsizse Google Translate API ile algıla
─────────────────────────────────────────────────────────── */
var _langDetectCache = {};

function detectLangLocal(text) {
    // 1. Türkçe özel karakter kesin TR
    if (/[ğüşıöçĞÜŞİÖÇ]/.test(text)) return 'tr';

    var words = text.toLowerCase().split(/\s+/);

    // 2. Genişletilmiş Türkçe kelime listesi
    var trWords = [
        'bir','ve','bu','ile','için','olan','değil','ama','çok','var','daha',
        'ben','sen','biz','siz','onlar','nasıl','neden','nerede','ne','kim',
        'da','de','ki','mi','mı','mu','mü','ya','yok','evet','hayır',
        'gibi','kadar','sonra','önce','üzer','altın','para','fiyat',
        'deneme','test','merhaba','selam','tamam','iyi','kötü','güzel',
        'büyük','küçük','yeni','eski','hızlı','yavaş','bugün','yarın',
        'satın','al','sat','borsa','kripto','dolar','lira','piyasa',
        'uygulama','sistem','bilgi','analiz','grafik','haber','ayar'
    ];

    // 3. Genişletilmiş İngilizce kelime listesi
    var enWords = [
        'the','a','an','is','are','was','were','be','been','have','has',
        'do','does','did','will','would','could','should','may','might',
        'i','you','he','she','we','they','it','my','your','his','her',
        'and','or','but','so','if','when','where','what','how','why',
        'in','on','at','to','for','of','with','by','from','about',
        'hello','hi','test','ok','yes','no','good','bad','new','old'
    ];

    var trCount = words.filter(function(w) { return trWords.indexOf(w) > -1; }).length;
    var enCount = words.filter(function(w) { return enWords.indexOf(w) > -1; }).length;

    if (trCount > enCount) return 'tr';
    if (enCount > trCount) return 'en';

    // 4. Tek kelime veya belirsiz → null döndür (API ile algıla)
    return null;
}

function detectLang(text, callback) {
    // Cache kontrolü
    if (_langDetectCache[text]) {
        if (callback) callback(_langDetectCache[text]);
        return _langDetectCache[text];
    }

    var local = detectLangLocal(text);

    if (local) {
        _langDetectCache[text] = local;
        if (callback) callback(local);
        return local;
    }

    // Belirsiz — Google Translate API ile algıla (sl=auto)
    if (callback) {
        var url = 'https://translate.googleapis.com/translate_a/single?client=gtx&sl=auto&tl=en&dt=t&q=' + encodeURIComponent(text);
        fetch(url)
            .then(function(r) { return r.json(); })
            .then(function(d) {
                // d[2] = algılanan dil kodu
                var detected = (d && d[2]) ? d[2] : 'tr';
                // tr veya en dışındaki dilleri tr say (Türk kullanıcı ağırlıklı)
                if (detected !== 'en') detected = 'tr';
                _langDetectCache[text] = detected;
                callback(detected);
            })
            .catch(function() { callback('tr'); });
        return null; // async, callback ile gelecek
    }

    return 'tr'; // sync fallback
}

var LangSystem = {
    currentLang: 'tr',
    observer: null,
    cacheKey: 'tradevia_lang_cache_v4',
    dynamicCache: {},
    pendingRequests: {},
    ignoredTags: ['SCRIPT','STYLE','NOSCRIPT','TEXTAREA','CODE','PRE','LINK','META','IFRAME'],

    init: function() {
        var settings = JSON.parse(localStorage.getItem('tm_settings') || '{}');
        this.currentLang = settings.lang || 'tr';
        var savedCache = localStorage.getItem(this.cacheKey);
        if (savedCache) {
            try { this.dynamicCache = JSON.parse(savedCache); } catch(e) { this.dynamicCache = {}; }
        }
        console.log('🌍 LangSystem V4: ' + this.currentLang.toUpperCase());
        if (this.currentLang === 'en') {
            this.startTranslation(); // UI çevirisi sadece EN modunda
        }
        this._initChatAutoTranslate(); // Chat çevirisi her zaman aktif (TR↔EN)
    },

    set: function(lang) {
        var prevLang = this.currentLang;
        this.currentLang = lang;
        var settings = JSON.parse(localStorage.getItem('tm_settings') || '{}');
        settings.lang = lang;

        // ── Para birimi otomatik değişimi ──
        var LANG_CURRENCY = { 'tr': 'TRY', 'en': 'USD' };
        var newCurrency = LANG_CURRENCY[lang] || 'TRY';
        var oldCurrency = settings.currency || 'TRY';
        if (newCurrency !== oldCurrency) {
            settings.currency = newCurrency;
            // Kasa bakiyesini dönüştür
            var usdRate = (typeof usdTryRate !== 'undefined' && usdTryRate > 10) ? usdTryRate : 44.2;
            var cash = parseFloat(localStorage.getItem('tm_cash_balance') || '0');
            if (newCurrency === 'USD') cash = cash / usdRate;
            else cash = cash * usdRate;
            localStorage.setItem('tm_cash_balance', cash);
            // Para birimi seçiciyi güncelle
            var currSel = document.getElementById('currSelect');
            if (currSel) currSel.value = newCurrency;
            var currLabels = { TRY: 'TRY (₺)', USD: 'USD ($)' };
            var clEl = document.getElementById('currSelectLabel');
            if (clEl) clEl.textContent = currLabels[newCurrency] || 'TRY (₺)';
            // appSettings global varsa güncelle
            if (typeof appSettings !== 'undefined') appSettings.currency = newCurrency;
        }

        localStorage.setItem('tm_settings', JSON.stringify(settings));
        if (prevLang === lang) return;

        if (lang === 'en') {
            this.startTranslation();
        } else {
            this._restoreOriginal();
            if (this.observer) { this.observer.disconnect(); this.observer = null; }
        }

        // Chat mesajlarını yeni dile göre yeniden çevir
        var self = this;
        setTimeout(function() {
            var feed = document.getElementById('commChatMessages');
            if (!feed) return;
            Array.from(feed.children).forEach(function(child) {
                if (child.id && child.id.startsWith('msg-')) {
                    // Önce orijinale döndür
                    self._restoreChatMsg(child);
                    // Sonra yeni dile çevir
                    self._autoTranslateChatMsg(child);
                }
            });
        }, 100);
    },

    _restoreOriginal: function() {
        document.querySelectorAll('[data-original-text]').forEach(function(el) {
            el.textContent = el.getAttribute('data-original-text');
            el.removeAttribute('data-original-text');
        });
        document.querySelectorAll('[data-original-placeholder]').forEach(function(el) {
            el.setAttribute('placeholder', el.getAttribute('data-original-placeholder'));
            el.removeAttribute('data-original-placeholder');
        });
    },

    startTranslation: function() {
        var self = this;

        // Büyük sayfalarda tüm DOM yerine sadece görünür alanı çevir
        var allNodes = document.body.querySelectorAll('*');
        var isLargePage = allNodes.length > 500;

        if (isLargePage) {
            // Lazy translation: IntersectionObserver ile sadece görünür elementleri çevir
            self._lazyTranslate();
        } else {
            self.translateNode(document.body);
        }

        self.observer = new MutationObserver(function(mutations) {
            mutations.forEach(function(mutation) {
                mutation.addedNodes.forEach(function(node) {
                    self.translateNode(node);
                });
                if (mutation.type === 'characterData') {
                    if (mutation.target.parentNode && !self.isIgnored(mutation.target.parentNode)) {
                        self.processTextNode(mutation.target);
                    }
                }
            });
        });
        self.observer.observe(document.body, { childList: true, subtree: true, characterData: true });
    },

    _lazyTranslate: function() {
        var self = this;
        // Önce sadece viewport içindeki elementleri çevir
        var elements = document.body.querySelectorAll('p, h1, h2, h3, h4, h5, h6, li, td, th, span, div, button, a, label');

        if ('IntersectionObserver' in window) {
            var io = new IntersectionObserver(function(entries) {
                entries.forEach(function(entry) {
                    if (entry.isIntersecting) {
                        self.translateNode(entry.target);
                        io.unobserve(entry.target);
                    }
                });
            }, { rootMargin: '200px' }); // 200px önceden çevir

            elements.forEach(function(el) { io.observe(el); });
        } else {
            // IntersectionObserver yoksa küçük parçalar halinde çevir (UI donmasın)
            var i = 0;
            var chunk = 30;
            function translateChunk() {
                var end = Math.min(i + chunk, elements.length);
                for (; i < end; i++) {
                    self.translateNode(elements[i]);
                }
                if (i < elements.length) {
                    setTimeout(translateChunk, 50);
                }
            }
            translateChunk();
        }
    },

    isIgnored: function(node) {
        if (!node) return false;
        if (node.tagName && this.ignoredTags.indexOf(node.tagName.toUpperCase()) > -1) return true;
        if (node.parentNode && node.parentNode.tagName &&
            this.ignoredTags.indexOf(node.parentNode.tagName.toUpperCase()) > -1) return true;
        if (node.classList && (node.classList.contains('goog-te-menu-value') ||
            node.id === 'google_translate_element')) return true;
        // Chat alanını koru — kendi sistemimiz hallediyor
        if (node.id === 'commChatMessages') return true;
        if (node.id && node.id.startsWith('msg-')) return true;
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
                var ph = node.getAttribute('placeholder');
                if (ph && ph.trim()) {
                    if (!node.hasAttribute('data-original-placeholder')) {
                        node.setAttribute('data-original-placeholder', ph);
                    }
                    this.getTranslation(ph, 'tr', 'en', function(res) { if (res) node.setAttribute('placeholder', res); });
                }
            }
            if (node.tagName === 'INPUT' && (node.type === 'button' || node.type === 'submit')) {
                var val = node.value;
                if (val && val.trim()) {
                    this.getTranslation(val, 'tr', 'en', function(res) { if (res) node.value = res; });
                }
            }
            var self = this;
            node.childNodes.forEach(function(child) { self.translateNode(child); });
        }
    },

    processTextNode: function(node) {
        var text = node.nodeValue.trim();
        if (!text || text.length < 2 || !/[a-zA-ZğüşıöçĞÜŞİÖÇ]/.test(text)) return;
        if (text.length <= 5 && text === text.toUpperCase()) return;
        this.getTranslation(text, 'tr', 'en', function(translatedText) {
            if (translatedText && translatedText !== text && node.parentNode) {
                if (!node.parentNode.hasAttribute('data-original-text')) {
                    node.parentNode.setAttribute('data-original-text', text);
                }
                node.nodeValue = translatedText;
            }
        });
    },

    /* ── OTOMATİK SOHBET ÇEVİRİSİ ───────────────────── */
    _initChatAutoTranslate: function() {
        var self = this;
        var chatObserver = new MutationObserver(function(mutations) {
            mutations.forEach(function(mutation) {
                mutation.addedNodes.forEach(function(node) {
                    if (node.nodeType === 1 && node.id && node.id.startsWith('msg-')) {
                        self._autoTranslateChatMsg(node);
                    }
                });
            });
        });

        function tryObserve() {
            var feed = document.getElementById('commChatMessages');
            if (feed) {
                chatObserver.observe(feed, { childList: true, subtree: false });
                // Zaten yüklü mesajları çevir
                Array.from(feed.children).forEach(function(child) {
                    if (child.id && child.id.startsWith('msg-')) {
                        self._autoTranslateChatMsg(child);
                    }
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
    },

    _autoTranslateChatMsg: function(el) {
        if (!el || !el.id || !el.id.startsWith('msg-')) return;
        if (el.getAttribute('data-translated')) return;

        var self = this;
        var appLang = this.currentLang;

        // Firebase'den gelen dil bilgisi varsa direkt kullan
        var savedLang = el.getAttribute('data-msglang') || '';

        var bubbles = el.querySelectorAll('[style*="line-height:1.55"]');
        bubbles.forEach(function(bubble) {

            var textDiv = null;
            var children = bubble.children;
            for (var i = 0; i < children.length; i++) {
                var d = children[i];
                if (d.querySelector('i.fas')) continue;
                if (d.style && d.style.borderLeft) continue;
                if (d.getAttribute('style') && d.getAttribute('style').indexOf('border-left') > -1) continue;
                if (d.getAttribute('style') && d.getAttribute('style').indexOf('font-size:11px') > -1) continue;
                var txt = d.textContent.trim();
                if (txt.length >= 2) { textDiv = d; break; }
            }

            if (!textDiv) {
                var allDivs = bubble.querySelectorAll('div');
                for (var j = 0; j < allDivs.length; j++) {
                    var d2 = allDivs[j];
                    if (d2.querySelector('i.fas')) continue;
                    if (d2.getAttribute('style') && d2.getAttribute('style').indexOf('border-left') > -1) continue;
                    if (d2.getAttribute('style') && d2.getAttribute('style').indexOf('font-size:11px') > -1) continue;
                    if (d2.getAttribute('style') && d2.getAttribute('style').indexOf('font-size:10px') > -1) continue;
                    var txt2 = d2.textContent.trim();
                    if (txt2.length >= 2 && !textDiv) { textDiv = d2; }
                }
            }

            if (!textDiv) return;

            var originalText = textDiv.textContent.trim();
            if (!originalText || originalText.length < 2) return;

            if (!textDiv.hasAttribute('data-orig')) {
                textDiv.setAttribute('data-orig', originalText);
            }

            function doTranslate(msgLang) {
                // Mesaj zaten uygulama dilindeyse çevirme
                if (msgLang === appLang) return;
                self.getTranslation(originalText, msgLang, appLang, function(result) {
                    if (!result || result === originalText) return;
                    var node = textDiv.firstChild;
                    while (node) {
                        if (node.nodeType === 3 && node.nodeValue.trim().length > 0) {
                            node.nodeValue = result;
                            return;
                        }
                        node = node.nextSibling;
                    }
                    textDiv.textContent = result;
                });
            }

            // Firebase'de dil bilgisi varsa direkt çevir
            if (savedLang === 'tr' || savedLang === 'en') {
                doTranslate(savedLang);
            } else {
                // Yoksa algıla
                detectLang(originalText, function(msgLang) {
                    doTranslate(msgLang);
                });
            }
        });

        el.setAttribute('data-translated', '1');
    },

    _restoreChatMsg: function(el) {
        if (!el) return;
        el.querySelectorAll('[data-orig]').forEach(function(d) {
            d.textContent = d.getAttribute('data-orig');
            d.removeAttribute('data-orig');
        });
        el.removeAttribute('data-translated');
    },

    /* ── ÇEVİRİ API — 4 Katmanlı Cache ──────────────────
       1. Bellek (anında)
       2. localStorage (hızlı, yerel)
       3. Firebase translations koleksiyonu (ortak, zenginleşen)
       4. Google Translate API (son çare) + Firebase'e kaydet
    ─────────────────────────────────────────────────── */
    getTranslation: function(text, fromLang, toLang, callback) {
        var cacheKey = fromLang + '→' + toLang + '|' + text;
        var dictKey  = fromLang + '_to_' + toLang;
        var self     = this;

        // 1. Sabit sözlük
        if (dictionary[dictKey] && dictionary[dictKey][text]) {
            callback(dictionary[dictKey][text]); return;
        }

        // 2. Bellek cache
        if (this.dynamicCache[cacheKey]) {
            callback(this.dynamicCache[cacheKey]); return;
        }

        // 3. Kuyruk — aynı metin zaten soruluyorsa beklet
        if (this.pendingRequests[cacheKey]) {
            this.pendingRequests[cacheKey].push(callback); return;
        }
        this.pendingRequests[cacheKey] = [callback];

        function deliver(result) {
            // Belleğe ve localStorage'a kaydet
            self.dynamicCache[cacheKey] = result;
            try { localStorage.setItem(self.cacheKey, JSON.stringify(self.dynamicCache)); } catch(e) {}
            // Kuyruktakilere dağıt
            var waiting = self.pendingRequests[cacheKey];
            if (waiting) {
                waiting.forEach(function(cb) { cb(result); });
                delete self.pendingRequests[cacheKey];
            }
        }

        function getFirestore() {
            return window.fbDb || (typeof fbDb !== 'undefined' ? fbDb : null);
        }

        function fetchFromGoogle(fbDocId, retryCount) {
            retryCount = retryCount || 0;
            // İki farklı Google endpoint dene
            var endpoints = [
                'https://translate.googleapis.com/translate_a/single?client=gtx&sl=' + fromLang + '&tl=' + toLang + '&dt=t&q=' + encodeURIComponent(text),
                'https://clients5.google.com/translate_a/t?client=dict-chrome-ex&sl=' + fromLang + '&tl=' + toLang + '&q=' + encodeURIComponent(text)
            ];
            var url = endpoints[retryCount % 2];

            fetch(url)
                .then(function(res) {
                    if (res.status === 429 && retryCount < 2) {
                        // Rate limit — 1 saniye bekle, tekrar dene
                        setTimeout(function() { fetchFromGoogle(fbDocId, retryCount + 1); }, 1000);
                        return null;
                    }
                    return res.json();
                })
                .then(function(data) {
                    if (!data) return; // retry bekleniyor
                    var result = text;
                    if (data && data[0]) {
                        // Standart format
                        if (Array.isArray(data[0]) && data[0][0] && Array.isArray(data[0][0])) {
                            result = data[0].filter(function(p) { return p && p[0]; }).map(function(p) { return p[0]; }).join('');
                        } else if (typeof data[0] === 'string') {
                            result = data[0];
                        }
                    }

                    // Firebase'e kaydet
                    var db = getFirestore();
                    if (result && result !== text && db && fbDocId) {
                        try {
                            var ts = firebase.firestore.FieldValue.serverTimestamp();
                            db.collection('translations').doc(fbDocId)
                              .set({ translation: result, from: fromLang, to: toLang, hits: 1, updatedAt: ts }, { merge: true })
                              .catch(function() {});
                        } catch(e) {}
                    }

                    deliver(result);
                })
                .catch(function() {
                    if (retryCount < 1) {
                        setTimeout(function() { fetchFromGoogle(fbDocId, retryCount + 1); }, 800);
                    } else {
                        deliver(text);
                    }
                });
        }

        // 4. Firebase koleksiyonuna bak
        var safeText = text.substring(0, 80).replace(/[\/\\.#\[\]\s]/g, '_');
        var fbDocId  = fromLang + '-' + toLang + '_' + safeText;

        var db = getFirestore();
        if (db) {
            db.collection('translations').doc(fbDocId).get()
                .then(function(doc) {
                    if (doc.exists && doc.data().translation) {
                        var result = doc.data().translation;
                        // Hit sayacını artır
                        try {
                            db.collection('translations').doc(fbDocId)
                              .update({ hits: firebase.firestore.FieldValue.increment(1) })
                              .catch(function() {});
                        } catch(e) {}
                        deliver(result);
                    } else {
                        fetchFromGoogle(fbDocId);
                    }
                })
                .catch(function() {
                    fetchFromGoogle(null);
                });
        } else {
            // Firebase yok → direkt Google
            fetchFromGoogle(null);
        }
    }
};

if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', function() { LangSystem.init(); });
} else {
    LangSystem.init();
}

async function changeLanguage(val) {
    LangSystem.set(val);
    // Kuru güncelle, sonra portföyü yenile
    if (typeof fetchUsdRate === 'function') await fetchUsdRate();
    if (typeof loadPF === 'function') loadPF(true);
    if (typeof renderHistory === 'function') renderHistory();
}
window.LangSystem = LangSystem;

/* index.html'den çağrılır — mesaj DOM'a eklenince hemen çevir */
window.injectChatTranslateBtn = function(msgEl) {
    setTimeout(function() {
        if (typeof LangSystem !== 'undefined') {
            LangSystem._autoTranslateChatMsg(msgEl);
        }
    }, 80);
};
