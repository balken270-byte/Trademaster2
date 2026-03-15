/* ============================================================
   TRADEVIA — PRO LINGUISTIC ENGINE V5
   - Genişletilmiş TradeVia sözlüğü (TR↔EN)
   - Batch (toplu) çeviri istekleri
   - MutationObserver optimizasyonu (sayıları atla)
   - Cache sınırı ve otomatik temizleme
   - Otomatik sohbet çevirisi
   - Dil algılama (yerel + Google)
   - Para birimi otomatik değişimi
   ============================================================ */

const dictionary = {
    tr_to_en: {
        // ── Navigasyon ──
        "Cüzdan":"Wallet","Piyasa":"Market","Analiz":"Analytics",
        "Haber":"News","Ayarlar":"Settings","Geri":"Back",
        // ── Genel UI ──
        "Yükleniyor...":"Loading...","Hata":"Error","Başarılı":"Success",
        "Kaydet":"Save","İptal":"Cancel","Tamam":"OK","Kapat":"Close",
        "Veri Yok":"No Data","Bulunamadı":"Not Found","Evet":"Yes","Hayır":"No",
        "Yenile":"Refresh","Sil":"Delete","Düzenle":"Edit","Ekle":"Add",
        "Onayla":"Confirm","Vazgeç":"Cancel","Devam":"Continue",
        // ── Portföy ──
        "TOPLAM VARLIK":"TOTAL ASSETS","Kâr":"Profit","Zarar":"Loss",
        "Nakit":"Cash","Temettü":"Dividend","Hızlı İşlem":"Quick Trade",
        "Alış":"Buy","Satış":"Sell","Adet":"Pieces","Fiyat":"Price",
        "Sembol":"Symbol","Değişim":"Change","Ortalama":"Average",
        "Maliyet":"Cost","Toplam Değer":"Total Value","Güncel":"Current",
        "PORTFÖYE EKLE":"ADD TO PORTFOLIO","Portföy Boş":"Portfolio Empty",
        "İşlem Başarılı":"Transaction Successful","Kategori":"Category",
        "Değer":"Value","Kazanç":"Earnings","Kayıp":"Loss","A-Z":"A-Z",
        "KRİPTO":"CRYPTO","HİSSE":"STOCK","ALTIN":"GOLD","DÖVİZ":"FOREX",
        "Varlık Ekle":"Add Asset","Varlık Sil":"Delete Asset",
        "Varlık Düzenle":"Edit Asset","Portföy":"Portfolio",
        // ── İstatistik & Analiz ──
        "İstatistik":"Statistics","PERFORMANS":"PERFORMANCE",
        "HEDEFLERİM":"MY GOALS","PSİKOLOJİ":"PSYCHOLOGY",
        "AR-GE":"R&D LAB","TOPLAM NET VARLIK":"TOTAL NET WORTH",
        "BAŞARI ORANI":"WIN RATE","TRADER KARNESİ":"TRADER SCORE",
        "Zaman Makinesi":"Time Machine","Maliyet Sihirbazı":"Cost Wizard",
        "Risk Sihirbazı":"Risk Wizard","Kaos Odası":"Chaos Room",
        "Yapay Zeka":"AI","Tahmin":"Forecast","Grafik":"Chart",
        "Günlük":"Daily","Haftalık":"Weekly","Aylık":"Monthly","Yıllık":"Yearly",
        "Son 7 Gün":"Last 7 Days","Son 30 Gün":"Last 30 Days",
        "Son 1 Yıl":"Last 1 Year","Tümü":"All",
        // ── Borsa & Bağlantılar ──
        "Borsa Bağlantıları":"Exchange Connections","Bağlı":"Connected",
        "Bağlantı yok":"Not connected","Bağlan":"Connect","Bağlantıyı Kes":"Disconnect",
        "Açık Emirler":"Open Orders","Emir yok":"No orders",
        "Limit Fiyat":"Limit Price","Piyasa Fiyatı":"Market Price",
        "TradeVia Cüzdanına Aktar":"Import to TradeVia Wallet",
        // ── Haber ──
        "Haber Merkezi":"News Center","Son 24 saat":"Last 24 hours",
        "MANŞET":"HEADLINE","Kaynağa Git":"Go to Source",
        // ── Üyelik & Hesap ──
        "PRO'ya Yükselt":"Upgrade to PRO","Tüm özellikleri aç":"Unlock all features",
        "Üyelik":"Membership","Giriş":"Login","Çıkış":"Logout",
        "Üye":"Member","Hesap":"Account","Profil":"Profile",
        // ── Topluluk ──
        "Mesaj":"Message","Medya":"Media","Mesajlarda Ara":"Search Messages",
        "Medya & Dosyalar":"Media & Files","Bildirimleri Sessize Al":"Mute Notifications",
        "Gruptan Ayrıl":"Leave Group","Canlı Fiyat":"Live Price",
        "Mesaj yaz...":"Write a message...","Topluluğu":"Community",
        "Topluluğuna Hoş Geldin!":"Welcome to Community!",
        // ── İşlem Geçmişi ──
        "İşlem Geçmişi":"Transaction History","ALIM":"BUY","SATIŞ":"SELL",
        "Geçmiş Yok":"No History","Tüm İşlemler":"All Transactions",
        // ── Bildirimler ──
        "Bildirimler":"Notifications","Yeni Bildirim":"New Notification",
        "Tümünü Okundu İşaretle":"Mark All as Read","Bildirim Yok":"No Notifications",
        // ── Fiyat Alarmı ──
        "Fiyat Alarmı":"Price Alert","Alarm Ekle":"Add Alert",
        "Alarm Sil":"Delete Alert","Hedef Fiyat":"Target Price",
        // ── Genel Finans ──
        "Toplam":"Total","Net":"Net","Brüt":"Gross",
        "Komisyon":"Commission","Vergi":"Tax","Kur":"Rate",
        "Dolar":"Dollar","Lira":"Lira","Euro":"Euro",
        "Portföy Değeri":"Portfolio Value","Kar/Zarar":"Profit/Loss",
        "Gerçekleşmemiş":"Unrealized","Gerçekleşmiş":"Realized",
        // ── Hata Mesajları ──
        "Bağlantı Hatası":"Connection Error","API Hatası":"API Error",
        "Zaman Aşımı":"Timeout","Tekrar Dene":"Retry",
        "Giriş Gerekli":"Login Required","İzin Yok":"No Permission"
    },
    en_to_tr: {
        // ── Navigasyon ──
        "Wallet":"Cüzdan","Market":"Piyasa","Analytics":"Analiz",
        "News":"Haber","Settings":"Ayarlar","Back":"Geri",
        // ── Genel UI ──
        "Loading...":"Yükleniyor...","Error":"Hata","Success":"Başarılı",
        "Save":"Kaydet","Cancel":"İptal","OK":"Tamam","Close":"Kapat",
        "Yes":"Evet","No":"Hayır","Refresh":"Yenile","Delete":"Sil",
        "Edit":"Düzenle","Add":"Ekle","Confirm":"Onayla","Continue":"Devam",
        // ── Portföy ──
        "Profit":"Kâr","Loss":"Zarar","Cash":"Nakit","Buy":"Alış","Sell":"Satış",
        "Price":"Fiyat","Average":"Ortalama","Cost":"Maliyet",
        "Total Value":"Toplam Değer","Current":"Güncel","Change":"Değişim",
        "Category":"Kategori","Value":"Değer","Earnings":"Kazanç",
        "CRYPTO":"KRİPTO","STOCK":"HİSSE","GOLD":"ALTIN","FOREX":"DÖVİZ",
        "Portfolio":"Portföy","Pieces":"Adet","Symbol":"Sembol",
        // ── Borsa ──
        "Connected":"Bağlı","Connect":"Bağlan","Disconnect":"Bağlantıyı Kes",
        "Open Orders":"Açık Emirler","Limit Price":"Limit Fiyat",
        // ── Üyelik ──
        "Member":"Üye","Login":"Giriş","Logout":"Çıkış",
        "Membership":"Üyelik","Account":"Hesap","Profile":"Profil",
        // ── Topluluk ──
        "Message":"Mesaj","Media":"Medya","Live Price":"Canlı Fiyat",
        "Community":"Topluluk",
        // ── Finans ──
        "Total":"Toplam","Commission":"Komisyon","Rate":"Kur",
        "Profit/Loss":"Kar/Zarar","Unrealized":"Gerçekleşmemiş","Realized":"Gerçekleşmiş"
    }
};

/* ── DİL ALGILAMA ──────────────────────────────────────── */
var _langDetectCache = {};

function detectLangLocal(text) {
    if (/[ğüşıöçĞÜŞİÖÇ]/.test(text)) return 'tr';
    var words = text.toLowerCase().split(/\s+/);
    var trWords = [
        'bir','ve','bu','ile','için','olan','değil','ama','çok','var','daha',
        'ben','sen','biz','siz','onlar','nasıl','neden','nerede','ne','kim',
        'da','de','ki','mi','mı','mu','mü','ya','yok','evet','hayır',
        'gibi','kadar','sonra','önce','bugün','yarın','satın','al','sat',
        'borsa','kripto','dolar','lira','piyasa','uygulama','sistem','analiz'
    ];
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
    return null;
}

function detectLang(text, callback) {
    if (_langDetectCache[text]) { if (callback) callback(_langDetectCache[text]); return _langDetectCache[text]; }
    var local = detectLangLocal(text);
    if (local) { _langDetectCache[text] = local; if (callback) callback(local); return local; }
    if (callback) {
        var url = 'https://translate.googleapis.com/translate_a/single?client=gtx&sl=auto&tl=en&dt=t&q=' + encodeURIComponent(text);
        fetch(url)
            .then(function(r) { return r.json(); })
            .then(function(d) {
                var detected = (d && d[2]) ? d[2] : 'tr';
                if (detected !== 'en') detected = 'tr';
                _langDetectCache[text] = detected;
                callback(detected);
            })
            .catch(function() { callback('tr'); });
        return null;
    }
    return 'tr';
}

var LangSystem = {
    currentLang: 'tr',
    observer: null,
    cacheKey: 'tradevia_lang_cache_v5',
    dynamicCache: {},
    pendingRequests: {},
    // Batch sistemi
    _batchQueue: [],
    _batchTimer: null,
    _batchDelay: 120, // ms — bu süre içindeki istekleri birleştir
    // Cache limiti
    _cacheMaxSize: 500,
    ignoredTags: ['SCRIPT','STYLE','NOSCRIPT','TEXTAREA','CODE','PRE','LINK','META','IFRAME'],
    // Sayı/sembol regex — bunları çevirme
    _skipPattern: /^[\d\s\.\,\$\₺\€\%\+\-\*\/\(\)\[\]\{\}:]+$|^\d+(\.\d+)?[KkMmBb]?$|^[A-Z]{2,6}(USDT|BTC|ETH)?$/,

    init: function() {
        var settings = JSON.parse(localStorage.getItem('tm_settings') || '{}');
        this.currentLang = settings.lang || 'tr';
        // Cache yükle
        var savedCache = localStorage.getItem(this.cacheKey);
        if (savedCache) {
            try { this.dynamicCache = JSON.parse(savedCache); } catch(e) { this.dynamicCache = {}; }
        }
        // Cache boyutu kontrol
        this._trimCache();
        console.log('🌍 LangSystem V5: ' + this.currentLang.toUpperCase());
        if (this.currentLang === 'en') this.startTranslation();
        this._initChatAutoTranslate();
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
            var usdRate = (typeof usdTryRate !== 'undefined' && usdTryRate > 10) ? usdTryRate : 44.2;
            var cash = parseFloat(localStorage.getItem('tm_cash_balance') || '0');
            if (newCurrency === 'USD') cash = cash / usdRate;
            else cash = cash * usdRate;
            localStorage.setItem('tm_cash_balance', cash);
            var currSel = document.getElementById('currSelect');
            if (currSel) currSel.value = newCurrency;
            var currLabels = { TRY: 'TRY (₺)', USD: 'USD ($)' };
            var clEl = document.getElementById('currSelectLabel');
            if (clEl) clEl.textContent = currLabels[newCurrency] || 'TRY (₺)';
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
                    self._restoreChatMsg(child);
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
        var allNodes = document.body.querySelectorAll('*');
        var isLargePage = allNodes.length > 500;
        if (isLargePage) {
            self._lazyTranslate();
        } else {
            self.translateNode(document.body);
        }
        // ── OPTİMİZE MutationObserver — sayıları ve fiyatları atla ──
        self.observer = new MutationObserver(function(mutations) {
            mutations.forEach(function(mutation) {
                // characterData: sadece gerçek metin değişikliklerini işle, sayıları atla
                if (mutation.type === 'characterData') {
                    var text = mutation.target.nodeValue || '';
                    if (self._skipPattern.test(text.trim())) return; // sayı/sembol → atla
                    if (text.trim().length < 2) return;
                    if (mutation.target.parentNode && !self.isIgnored(mutation.target.parentNode)) {
                        self.processTextNode(mutation.target);
                    }
                    return;
                }
                // childList: eklenen node'ları çevir
                mutation.addedNodes.forEach(function(node) {
                    // Fiyat güncellemesi gibi live_ id'li elementleri atla
                    if (node.id && (node.id.startsWith('live_') || node.id.startsWith('mini_chart_'))) return;
                    if (node.nodeType === 1 && node.classList &&
                        (node.classList.contains('asset-pnl') || node.classList.contains('pnl-up') || node.classList.contains('pnl-down'))) return;
                    self.translateNode(node);
                });
            });
        });
        self.observer.observe(document.body, {
            childList: true,
            subtree: true,
            characterData: true,
            // attributeFilter kaldırıldı — gereksiz event azaltır
        });
    },

    _lazyTranslate: function() {
        var self = this;
        var elements = document.body.querySelectorAll('p,h1,h2,h3,h4,h5,h6,li,td,th,span,div,button,a,label');
        // Fiyat elementlerini filtrele
        elements = Array.from(elements).filter(function(el) {
            if (el.id && (el.id.startsWith('live_') || el.id.startsWith('mini_chart_'))) return false;
            if (el.classList.contains('asset-pnl') || el.classList.contains('pnl-up') || el.classList.contains('pnl-down')) return false;
            return true;
        });
        if ('IntersectionObserver' in window) {
            var io = new IntersectionObserver(function(entries) {
                entries.forEach(function(entry) {
                    if (entry.isIntersecting) {
                        self.translateNode(entry.target);
                        io.unobserve(entry.target);
                    }
                });
            }, { rootMargin: '200px' });
            elements.forEach(function(el) { io.observe(el); });
        } else {
            var i = 0; var chunk = 30;
            function translateChunk() {
                var end = Math.min(i + chunk, elements.length);
                for (; i < end; i++) self.translateNode(elements[i]);
                if (i < elements.length) setTimeout(translateChunk, 50);
            }
            translateChunk();
        }
    },

    isIgnored: function(node) {
        if (!node) return false;
        if (node.tagName && this.ignoredTags.indexOf(node.tagName.toUpperCase()) > -1) return true;
        if (node.parentNode && node.parentNode.tagName &&
            this.ignoredTags.indexOf(node.parentNode.tagName.toUpperCase()) > -1) return true;
        if (node.classList && node.classList.contains('goog-te-menu-value')) return true;
        // Fiyat/değer elementlerini atla
        if (node.id && (node.id.startsWith('live_') || node.id.startsWith('mini_chart_'))) return true;
        if (node.classList && (node.classList.contains('asset-pnl') ||
            node.classList.contains('pnl-up') || node.classList.contains('pnl-down') ||
            node.classList.contains('asset-meta'))) return true;
        // Chat alanı
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
                if (ph && ph.trim() && !this._skipPattern.test(ph.trim())) {
                    if (!node.hasAttribute('data-original-placeholder'))
                        node.setAttribute('data-original-placeholder', ph);
                    this.getTranslation(ph, 'tr', 'en', function(res) { if (res) node.setAttribute('placeholder', res); });
                }
            }
            if (node.tagName === 'INPUT' && (node.type === 'button' || node.type === 'submit')) {
                var val = node.value;
                if (val && val.trim() && !this._skipPattern.test(val.trim()))
                    this.getTranslation(val, 'tr', 'en', function(res) { if (res) node.value = res; });
            }
            var self = this;
            node.childNodes.forEach(function(child) { self.translateNode(child); });
        }
    },

    processTextNode: function(node) {
        var text = node.nodeValue.trim();
        if (!text || text.length < 2) return;
        if (!/[a-zA-ZğüşıöçĞÜŞİÖÇ]/.test(text)) return; // Sadece harf içeriyorsa çevir
        if (this._skipPattern.test(text)) return; // Sayı/sembol/ticker atla
        if (text.length <= 5 && text === text.toUpperCase()) return; // MOVR, BTC gibi tickerlar atla
        this.getTranslation(text, 'tr', 'en', function(translatedText) {
            if (translatedText && translatedText !== text && node.parentNode) {
                if (!node.parentNode.hasAttribute('data-original-text'))
                    node.parentNode.setAttribute('data-original-text', text);
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
                    if (node.nodeType === 1 && node.id && node.id.startsWith('msg-'))
                        self._autoTranslateChatMsg(node);
                });
            });
        });
        function tryObserve() {
            var feed = document.getElementById('commChatMessages');
            if (feed) {
                chatObserver.observe(feed, { childList: true, subtree: false });
                Array.from(feed.children).forEach(function(child) {
                    if (child.id && child.id.startsWith('msg-'))
                        self._autoTranslateChatMsg(child);
                });
            } else { setTimeout(tryObserve, 800); }
        }
        if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', tryObserve);
        else tryObserve();
    },

    _autoTranslateChatMsg: function(el) {
        if (!el || !el.id || !el.id.startsWith('msg-')) return;
        if (el.getAttribute('data-translated')) return;
        var self = this;
        var appLang = this.currentLang;
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
                    if (txt2.length >= 2 && !textDiv) textDiv = d2;
                }
            }
            if (!textDiv) return;
            var originalText = textDiv.textContent.trim();
            if (!originalText || originalText.length < 2) return;
            if (!textDiv.hasAttribute('data-orig')) textDiv.setAttribute('data-orig', originalText);
            function doTranslate(msgLang) {
                if (msgLang === appLang) return;
                self.getTranslation(originalText, msgLang, appLang, function(result) {
                    if (!result || result === originalText) return;
                    var node = textDiv.firstChild;
                    while (node) {
                        if (node.nodeType === 3 && node.nodeValue.trim().length > 0) { node.nodeValue = result; return; }
                        node = node.nextSibling;
                    }
                    textDiv.textContent = result;
                });
            }
            if (savedLang === 'tr' || savedLang === 'en') doTranslate(savedLang);
            else detectLang(originalText, function(msgLang) { doTranslate(msgLang); });
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

    /* ── BATCH ÇEVİRİ SİSTEMİ ────────────────────────────
       Aynı anda gelen istekleri birleştirip tek Google isteği yapar
       Öncelik: Sözlük → Bellek cache → Firebase → Google Batch
    ──────────────────────────────────────────────────── */
    _getFirestore: function() {
        return window.fbDb || (typeof fbDb !== 'undefined' ? fbDb : null);
    },

    _flushBatch: function() {
        var self = this;
        if (!this._batchQueue.length) return;
        var batch = this._batchQueue.splice(0, 20); // Max 20 metin per istek

        // 1. Sözlük ve bellek cache'den çözülebilenleri hemen çöz
        var needsFirebase = [];
        batch.forEach(function(item) {
            var dictKey = item.from + '_to_' + item.to;
            var cKey = item.from + '→' + item.to + '|' + item.text;
            if (dictionary[dictKey] && dictionary[dictKey][item.text]) {
                item.resolve(dictionary[dictKey][item.text]);
            } else if (self.dynamicCache[cKey]) {
                item.resolve(self.dynamicCache[cKey]);
            } else {
                needsFirebase.push(item);
            }
        });

        if (!needsFirebase.length) return;

        // 2. Firebase'den toplu kontrol
        var db = self._getFirestore();
        if (db) {
            var firebaseChecks = needsFirebase.map(function(item) {
                var safeText = item.text.substring(0, 80).replace(/[\/\.#\[\]\s]/g, '_');
                var fbDocId = item.from + '-' + item.to + '_' + safeText;
                return db.collection('translations').doc(fbDocId).get()
                    .then(function(doc) {
                        if (doc.exists && doc.data().translation) {
                            var result = doc.data().translation;
                            var cKey = item.from + '→' + item.to + '|' + item.text;
                            self.dynamicCache[cKey] = result;
                            item.resolve(result);
                            // Hit sayacını artır (arka planda)
                            try { db.collection('translations').doc(fbDocId)
                                .update({ hits: firebase.firestore.FieldValue.increment(1) })
                                .catch(function(){}); } catch(e) {}
                            item._resolved = true;
                        }
                    })
                    .catch(function() {});
            });

            Promise.all(firebaseChecks).then(function() {
                // Firebase'den çözülemeyen kalanları Google'a gönder
                var needsGoogle = needsFirebase.filter(function(item) { return !item._resolved; });
                if (needsGoogle.length) self._fetchFromGoogle(needsGoogle);
            });
        } else {
            // Firebase yok → direkt Google batch
            self._fetchFromGoogle(needsFirebase);
        }
    },

    _fetchFromGoogle: function(items, retryCount) {
        var self = this;
        retryCount = retryCount || 0;
        if (!items.length) return;

        var from = items[0].from;
        var to = items[0].to;
        var texts = items.map(function(i) { return i.text; });

        // Google Translate birden fazla q parametresi destekler
        var params = texts.map(function(t) { return 'q=' + encodeURIComponent(t); }).join('&');
        var endpoints = [
            'https://translate.googleapis.com/translate_a/single?client=gtx&sl=' + from + '&tl=' + to + '&dt=t&' + params,
            'https://clients5.google.com/translate_a/t?client=dict-chrome-ex&sl=' + from + '&tl=' + to + '&' + params
        ];
        var url = endpoints[retryCount % 2];

        fetch(url)
            .then(function(res) {
                if (res.status === 429 && retryCount < 2) {
                    setTimeout(function() { self._fetchFromGoogle(items, retryCount + 1); }, 1000);
                    return null;
                }
                return res.json();
            })
            .then(function(data) {
                if (!data) return; // retry bekleniyor
                var results = [];
                if (Array.isArray(data) && Array.isArray(data[0])) {
                    data[0].forEach(function(part) { if (part && part[0]) results.push(part[0]); });
                }
                var db = self._getFirestore();
                items.forEach(function(item, idx) {
                    var result = results[idx] || item.text;
                    var cKey = item.from + '→' + item.to + '|' + item.text;
                    self.dynamicCache[cKey] = result;
                    item.resolve(result);

                    // Firebase'e kaydet (arka planda, sadece gerçek çeviri varsa)
                    if (result && result !== item.text && db) {
                        try {
                            var safeText = item.text.substring(0, 80).replace(/[\/\.#\[\]\s]/g, '_');
                            var fbDocId = item.from + '-' + item.to + '_' + safeText;
                            var ts = firebase.firestore.FieldValue.serverTimestamp();
                            db.collection('translations').doc(fbDocId)
                                .set({ translation: result, from: item.from, to: item.to, hits: 1, updatedAt: ts }, { merge: true })
                                .catch(function() {});
                        } catch(e) {}
                    }
                });
                self._saveCache();
            })
            .catch(function() {
                if (retryCount < 1) {
                    setTimeout(function() { self._fetchFromGoogle(items, retryCount + 1); }, 800);
                } else {
                    items.forEach(function(item) { item.resolve(item.text); });
                }
            });
    },

    _saveCache: function() {
        this._trimCache();
        try { localStorage.setItem(this.cacheKey, JSON.stringify(this.dynamicCache)); } catch(e) {}
    },

    /* ── CACHE BOYUT YÖNETİMİ ──────────────────────────── */
    _trimCache: function() {
        var keys = Object.keys(this.dynamicCache);
        if (keys.length > this._cacheMaxSize) {
            // En eski %30'u sil
            var deleteCount = Math.floor(keys.length * 0.3);
            for (var i = 0; i < deleteCount; i++) delete this.dynamicCache[keys[i]];
            console.log('[LangSystem] Cache temizlendi:', deleteCount + ' kayıt silindi');
        }
    },

    /* ── ÇEVİRİ API — 4 Katmanlı Cache + Batch ──────────
       1. Sabit sözlük (anında)
       2. Bellek cache (anında)
       3. Batch kuyruğu (120ms gecikmeyle toplu Google isteği)
       4. Firebase (ortak cache) — async background save
    ──────────────────────────────────────────────────── */
    getTranslation: function(text, fromLang, toLang, callback) {
        if (!text || !text.trim()) return;
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
        // 3. Batch kuyruğuna ekle
        this._batchQueue.push({ text: text, from: fromLang, to: toLang, resolve: callback });
        // Timer varsa iptal et, yeniden başlat (debounce)
        if (this._batchTimer) clearTimeout(this._batchTimer);
        this._batchTimer = setTimeout(function() {
            self._batchTimer = null;
            self._flushBatch();
        }, this._batchDelay);
    }
};

if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', function() { LangSystem.init(); });
} else {
    LangSystem.init();
}

window.LangSystem = LangSystem;

// changeLanguage: index.html'de zaten tanımlı ve para birimi + loadPF mantığını içeriyor.
// lang.js sadece LangSystem.set() çağrısını ekler, geri kalanını index.html halleder.
// Eğer index.html'deki _tvChangeLanguage varsa onu kullan, yoksa buradaki fallback çalışır.
async function changeLanguage(val) {
    if (typeof window._tvChangeLanguage === 'function') {
        // index.html'deki tam versiyon — para birimi + kur + loadPF hepsi orada
        await window._tvChangeLanguage(val);
    } else {
        // Fallback: sadece LangSystem
        LangSystem.set(val);
        if (typeof fetchUsdRate === 'function') await fetchUsdRate();
        if (typeof loadPF === 'function') loadPF(true);
        if (typeof renderHistory === 'function') renderHistory();
    }
}
window.changeLanguage = changeLanguage;

/* index.html'den çağrılır — mesaj DOM'a eklenince hemen çevir */
window.injectChatTranslateBtn = function(msgEl) {
    setTimeout(function() {
        if (typeof LangSystem !== 'undefined') LangSystem._autoTranslateChatMsg(msgEl);
    }, 80);
};
