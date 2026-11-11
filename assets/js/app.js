/* Ellie Jewelry – לוגיקת האתר: הדר, פוטר, סל קניות ושליחת הזמנה בוואטסאפ */
(function () {
  const IMG = "assets/img/products/";
  // תמונות צילום אמיתי (דוגמנית / בובה) – מוצגות במלואן בלי "צביעת" הרקע
  const PHOTOS = new Set(["lotus-peer-model.webp", "lotus-drop-model.webp", "pear-tennis-bust.webp", "tennis-spikes-model.webp", "tennis-spikes.webp"]);
  const TONE_COLORS = {
    "זהב": "#d9b56a", "זהב 14 קראט": "#d9b56a", "ציפוי זהב 14 קראט": "#d9b56a",
    "כסף": "#d6d6d6", "רודיום": "#cfd2d6", "רוז גולד": "#d9a08a",
    "ורוד": "#f0c9cf", "שחור": "#2b2b2b",
  };

  const TONE_NAMES = { gold: "זהב", silver: "כסף", rose: "רוז גולד" };
  const toneOf = (v) => (/רוז/.test(v) ? "rose" : /זהב/.test(v) ? "gold" : /כסף|רודיום/.test(v) ? "silver" : null);
  // תמונה אמיתית של הגוון שנבחר, אם קיימת
  const toneImage = (p, opts) => {
    if (!p.toneImages) return null;
    const v = Object.values(opts || {}).find((x) => p.toneImages[x]);
    return v ? p.toneImages[v] : null;
  };
  const $ = (s, el = document) => el.querySelector(s);
  const $$ = (s, el = document) => [...el.querySelectorAll(s)];
  const esc = (s) => String(s).replace(/[&<>"']/g, (c) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" }[c]));
  const money = (n) => `${n.toLocaleString("he-IL")} ₪`;
  const byId = (id) => PRODUCTS.find((p) => p.id === id);
  const imgTag = (file, cls = "", alt = "") =>
    `<img src="${IMG}${file}" alt="${esc(alt)}" loading="lazy" class="${cls}${PHOTOS.has(file) ? " is-photo" : ""}">`;

  const DIAMOND = '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.2" aria-hidden="true"><path d="M7 4h10l4 5-9 11L3 9z M3 9h18 M10 4 8.5 9 12 20l3.5-11L14 4"/></svg>';
  const ICONS = {
    bag: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5"><path d="M5 8h14l-1 12H6L5 8Z"/><path d="M9 8V6a3 3 0 0 1 6 0v2"/></svg>',
    search: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5"><circle cx="11" cy="11" r="6.5"/><path d="m16 16 4.5 4.5"/></svg>',
    heart: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5"><path d="M12 20s-7.5-4.6-7.5-10A4.3 4.3 0 0 1 12 7.6 4.3 4.3 0 0 1 19.5 10c0 5.4-7.5 10-7.5 10Z"/></svg>',
    heartFill: '<svg viewBox="0 0 24 24" fill="currentColor" stroke="currentColor" stroke-width="1.5"><path d="M12 20s-7.5-4.6-7.5-10A4.3 4.3 0 0 1 12 7.6 4.3 4.3 0 0 1 19.5 10c0 5.4-7.5 10-7.5 10Z"/></svg>',
    instagram: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5"><rect x="3.5" y="3.5" width="17" height="17" rx="5"/><circle cx="12" cy="12" r="4"/><circle cx="17.2" cy="6.8" r=".6" fill="currentColor"/></svg>',
    facebook: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5"><path d="M14 8.5V7c0-.8.5-1.3 1.3-1.3H17V3h-2.4C12.3 3 11 4.5 11 6.7v1.8H8.5V11H11v10h3V11h2.6l.4-2.5Z"/></svg>',
    tiktok: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5"><path d="M14 3v11.5a3.5 3.5 0 1 1-3-3.46M14 3c.4 2.6 2.2 4.3 5 4.5"/></svg>',
    chevR: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5"><path d="m9 5 7 7-7 7"/></svg>',
    chevL: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5"><path d="m15 5-7 7 7 7"/></svg>',
    access: '<svg viewBox="0 0 24 24" fill="currentColor"><circle cx="12" cy="4.2" r="2"/><path d="M4 7.5 12 9l8-1.5.5 1.9-5.5 1.6V14l2.2 7-1.9.6L13 15h-2l-2.3 6.6-1.9-.6L9 14v-3L3.5 9.4z"/></svg>',
    menu: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5"><path d="M4 7h16M4 12h16M4 17h16"/></svg>',
    close: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5"><path d="M6 6l12 12M18 6 6 18"/></svg>',
    wa: '<svg viewBox="0 0 24 24" fill="currentColor"><path d="M17.5 14.4c-.3-.1-1.7-.8-2-.9-.3-.1-.5-.1-.7.1-.2.3-.8.9-.9 1.1-.2.2-.3.2-.6.1-.3-.1-1.2-.5-2.3-1.4-.9-.8-1.4-1.7-1.6-2-.2-.3 0-.4.1-.6l.4-.5c.2-.2.2-.3.3-.5.1-.2 0-.4 0-.5l-.9-2.2c-.2-.6-.5-.5-.7-.5h-.6c-.2 0-.5.1-.8.4-.3.3-1 1-1 2.4s1 2.8 1.2 3c.1.2 2 3.1 4.9 4.3.7.3 1.2.5 1.6.6.7.2 1.3.2 1.8.1.6-.1 1.7-.7 1.9-1.4.2-.7.2-1.3.2-1.4-.1-.1-.3-.2-.6-.3ZM12 21.8a9.8 9.8 0 0 1-5-1.4l-.4-.2-3.7 1 1-3.6-.2-.4A9.8 9.8 0 1 1 12 21.8Zm8.4-18.2A11.8 11.8 0 0 0 1.7 17.8L0 24l6.4-1.7A11.8 11.8 0 0 0 24 12a11.7 11.7 0 0 0-3.6-8.4Z"/></svg>',
  };

  /* ───────── שמירת הסל ───────── */
  const KEY = "ellie-cart-v1";
  let cart = [];
  try { cart = JSON.parse(localStorage.getItem(KEY)) || []; } catch (e) { cart = []; }
  cart = cart.filter((it) => byId(it.id));
  const save = () => { try { localStorage.setItem(KEY, JSON.stringify(cart)); } catch (e) {} };
  const lineKey = (id, opts) => id + "|" + JSON.stringify(opts);
  const cartCount = () => cart.reduce((s, it) => s + it.qty, 0);
  const cartTotal = () => cart.reduce((s, it) => s + byId(it.id).price * it.qty, 0);

  function addToCart(id, opts, qty = 1) {
    const k = lineKey(id, opts);
    const line = cart.find((it) => lineKey(it.id, it.opts) === k);
    if (line) line.qty += qty; else cart.push({ id, opts, qty });
    save(); renderCart(); bumpCount();
    toast(`${byId(id).name} נוסף לסל`);
  }

  /* ───────── מועדפים ───────── */
  const WKEY = "ellie-wish-v1";
  let wish = [];
  try { wish = JSON.parse(localStorage.getItem(WKEY)) || []; } catch (e) { wish = []; }
  wish = wish.filter((id) => byId(id));
  const saveWish = () => { try { localStorage.setItem(WKEY, JSON.stringify(wish)); } catch (e) {} };
  const inWish = (id) => wish.includes(id);
  const wishBtn = (id, cls = "wish-btn") =>
    `<button class="${cls}${inWish(id) ? " on" : ""}" data-wish="${id}" aria-pressed="${inWish(id)}" aria-label="שמירה למועדפים">${inWish(id) ? ICONS.heartFill : ICONS.heart}</button>`;
  function toggleWish(id) {
    const i = wish.indexOf(id);
    if (i > -1) wish.splice(i, 1); else wish.push(id);
    saveWish(); syncWish();
    toast(i > -1 ? "הוסר מהמועדפים" : "נשמר במועדפים ♥");
  }
  function syncWish() {
    const c = $(".wish-count");
    if (c) { c.textContent = wish.length; c.classList.toggle("has", wish.length > 0); }
    $$("[data-wish]").forEach((b) => {
      const on = inWish(b.dataset.wish);
      b.classList.toggle("on", on); b.setAttribute("aria-pressed", on);
      b.innerHTML = on ? ICONS.heartFill : ICONS.heart;
    });
    if (document.body.dataset.page === "wishlist") wishlistPage();
  }
  document.addEventListener("click", (e) => {
    const b = e.target.closest("[data-wish]");
    if (b) { e.preventDefault(); toggleWish(b.dataset.wish); }
  });

  /* ───────── חיפוש ───────── */
  const norm = (t) => String(t).toLowerCase().replace(/[״"׳'\-–]/g, " ");
  function searchText(p) {
    const c = CATEGORIES[p.category];
    return norm([p.name, c.name, (c.subs || {})[p.sub] || "", p.description || "", ...(p.options || []).flatMap((o) => o.values)].join(" "));
  }
  const findProducts = (q) => {
    const terms = norm(q).split(/\s+/).filter(Boolean);
    return terms.length ? PRODUCTS.filter((p) => { const t = searchText(p); return terms.every((w) => t.includes(w)); }) : [];
  };

  /* ───────── מבנה משותף לכל העמודים ───────── */
  function layout() {
    const page = document.body.dataset.page;
    const cat = new URLSearchParams(location.search).get("cat");
    const cur = (p, c) => (page === p && (c === undefined || c === cat) ? ' aria-current="page"' : "");

    const socials = [["instagram", "אינסטגרם"], ["facebook", "פייסבוק"], ["tiktok", "טיקטוק"]]
      .filter(([k]) => SITE[k])
      .map(([k, n]) => `<a class="icon-btn social" href="${esc(SITE[k])}" target="_blank" rel="noopener" aria-label="${n}">${ICONS[k]}</a>`).join("");

    document.body.insertAdjacentHTML("afterbegin", `
      <a class="skip-link" href="#main">דלג לתוכן</a>
      <div class="announce"><span id="announce-text">${esc(SITE.announcements[0] || "")}</span></div>
      <header class="header">
        <div class="container header__row">
          <div class="header__start">
            <button class="icon-btn menu-toggle" aria-label="תפריט" aria-expanded="false">${ICONS.menu}</button>
            <nav class="nav" aria-label="ראשי">
              <a href="index.html"${cur("home")}>ראשי</a>
              ${Object.entries(CATEGORIES).map(([k, c]) => `
              <div class="nav__item">
                <a href="shop.html?cat=${k}"${cur("shop", k)}>${c.name}</a>
                <button class="nav__expand" aria-expanded="false" aria-label="תתי-קטגוריות של ${c.name}">+</button>
                <div class="mega">
                  <a href="shop.html?cat=${k}">כל ה${c.name}</a>
                  ${Object.entries(c.subs || {}).map(([sk, sn]) => `<a href="shop.html?cat=${k}&sub=${sk}">${sn}</a>`).join("")}
                </div>
              </div>`).join("")}
              <a href="shop.html"${page === "shop" && !cat ? ' aria-current="page"' : ""}>כל התכשיטים</a>
              <a href="index.html#faq">שאלות נפוצות</a>
              ${SITE.instagram ? `<a class="nav__insta" href="${esc(SITE.instagram)}" target="_blank" rel="noopener" aria-label="אינסטגרם">${ICONS.instagram}<span>אינסטגרם</span></a>` : ""}
            </nav>
          </div>
          <a class="logo" href="index.html" aria-label="Ellie Jewelry – לדף הבית"><img src="assets/img/logo.webp" alt="Ellie Jewelry"></a>
          <div class="header__actions">
            ${socials}
            <a class="icon-btn social" href="https://wa.me/${WHATSAPP_NUMBER}" target="_blank" rel="noopener" aria-label="וואטסאפ">${ICONS.wa}</a>
            <button class="icon-btn" id="search-btn" aria-label="חיפוש">${ICONS.search}</button>
            <a class="icon-btn" href="wishlist.html" aria-label="המועדפים שלי">${ICONS.heart}<span class="cart-count wish-count"></span></a>
            <button class="icon-btn" id="cart-btn" aria-label="סל הקניות">${ICONS.bag}<span class="cart-count bag-count"></span></button>
          </div>
        </div>
      </header>`);

    document.body.insertAdjacentHTML("beforeend", `
      <footer class="footer">
        <div class="container footer__grid">
          <div class="footer__brand">
            <img src="assets/img/logo.webp" alt="" loading="lazy">
            <p>אלי תכשיטים – מותג תכשיטים נשי, אלגנטי ומודרני. תכשיטים מרודיום, כסף וגולדפילד שמשלבים עיצוב על-זמני עם איכות יומיומית.</p>
          </div>
          <div>
            <h4>קטגוריות</h4>
            <ul>
              <li><a href="shop.html?cat=necklaces">שרשראות</a></li>
              <li><a href="shop.html?cat=earrings">עגילים</a></li>
              <li><a href="shop.html">כל התכשיטים</a></li>
            </ul>
          </div>
          <div>
            <h4>מידע</h4>
            <ul>
              <li><a href="index.html#faq">שאלות נפוצות</a></li>
              <li><a href="shipping.html">משלוחים והחזרות</a></li>
              <li><a href="terms.html">תקנון האתר</a></li>
              <li><a href="accessibility.html">הצהרת נגישות</a></li>
            </ul>
          </div>
          <div>
            <h4>יצירת קשר</h4>
            <ul>
              <li><a href="https://wa.me/${WHATSAPP_NUMBER}" target="_blank" rel="noopener">וואטסאפ: ${SITE.phoneDisplay}</a></li>
              <li><a href="tel:+${WHATSAPP_NUMBER}">טלפון: ${SITE.phoneDisplay}</a></li>
              ${SITE.email ? `<li><a href="mailto:${esc(SITE.email)}">${esc(SITE.email)}</a></li>` : ""}
            </ul>
            ${socials ? `<div class="footer__socials">${socials}</div>` : ""}
          </div>
        </div>
        <div class="container footer__bottom">© ${new Date().getFullYear()} Ellie Jewelry. כל הזכויות שמורות.</div>
        <div class="footer__band">
          <span class="script" lang="en">Shine Everyday</span>
          <span class="slogan">More than a jewel · a part of you</span>
          <span class="tagline">תכשיטים שמספרים את הסיפור שלך</span>
        </div>
      </footer>
      <a class="wa-float" href="https://wa.me/${WHATSAPP_NUMBER}" target="_blank" rel="noopener" aria-label="שיחה בוואטסאפ">${ICONS.wa}</a>
      <div class="overlay" id="overlay"></div>
      <aside class="drawer" id="drawer" aria-label="סל הקניות" aria-hidden="true">
        <div class="drawer__head"><h2>הסל שלי</h2><button class="icon-btn" id="drawer-close" aria-label="סגירה">${ICONS.close}</button></div>
        <div class="drawer__body" id="drawer-body"></div>
        <div class="drawer__foot" id="drawer-foot"></div>
      </aside>
      <div class="toast" id="toast" role="status" aria-live="polite"></div>
      <div class="search" id="search" role="dialog" aria-modal="true" aria-label="חיפוש באתר" hidden>
        <div class="search__box">
          <form class="search__form" id="search-form" role="search">
            ${ICONS.search}
            <input id="search-input" type="search" placeholder="מה תרצי לחפש? טניס, הליקס, רוז גולד..." autocomplete="off" aria-label="חיפוש">
            <button class="icon-btn" type="button" id="search-close" aria-label="סגירת חיפוש">${ICONS.close}</button>
          </form>
          <div class="search__results" id="search-results"></div>
        </div>
      </div>
      <button class="a11y-btn" id="a11y-btn" aria-label="תפריט נגישות" aria-expanded="false" aria-controls="a11y-panel">${ICONS.access}</button>
      <div class="a11y-panel" id="a11y-panel" hidden>
        <h3>נגישות</h3>
        <button data-a11y="text">הגדלת טקסט</button>
        <button data-a11y="contrast">ניגודיות גבוהה</button>
        <button data-a11y="links">הדגשת קישורים</button>
        <button data-a11y="still">עצירת אנימציות</button>
        <button data-a11y="reset">איפוס</button>
        <a href="accessibility.html">הצהרת נגישות</a>
      </div>`);

    $("#cart-btn").addEventListener("click", openCart);
    $("#drawer-close").addEventListener("click", closeAll);
    $("#overlay").addEventListener("click", closeAll);
    document.addEventListener("keydown", (e) => e.key === "Escape" && closeAll());
    const nav = $(".nav"), mt = $(".menu-toggle");
    mt.addEventListener("click", () => {
      const open = !nav.classList.contains("open");
      nav.classList.toggle("open", open); $("#overlay").classList.toggle("open", open);
      mt.setAttribute("aria-expanded", open);
    });
    $$(".nav__expand").forEach((b) => b.addEventListener("click", () => {
      const item = b.closest(".nav__item"), open = !item.classList.contains("open");
      item.classList.toggle("open", open); b.setAttribute("aria-expanded", open); b.textContent = open ? "−" : "+";
    }));

    // פס הודעות מתחלף
    const msgs = SITE.announcements || [];
    if (msgs.length > 1 && !matchMedia("(prefers-reduced-motion: reduce)").matches) {
      let i = 0; const el = $("#announce-text");
      setInterval(() => {
        el.classList.add("fade");
        setTimeout(() => { i = (i + 1) % msgs.length; el.textContent = msgs[i]; el.classList.remove("fade"); }, 350);
      }, 4500);
    }

    // חיפוש
    const sBox = $("#search"), sIn = $("#search-input"), sRes = $("#search-results");
    const openSearch = () => { sBox.hidden = false; requestAnimationFrame(() => sBox.classList.add("open")); sIn.focus(); };
    const closeSearch = () => { sBox.classList.remove("open"); setTimeout(() => (sBox.hidden = true), 250); };
    $("#search-btn").addEventListener("click", openSearch);
    $("#search-close").addEventListener("click", closeSearch);
    sBox.addEventListener("click", (e) => e.target === sBox && closeSearch());
    document.addEventListener("keydown", (e) => e.key === "Escape" && !sBox.hidden && closeSearch());
    sIn.addEventListener("input", () => {
      const q = sIn.value.trim();
      if (!q) { sRes.innerHTML = ""; return; }
      const list = findProducts(q);
      sRes.innerHTML = list.length
        ? list.slice(0, 6).map((p) => `<a class="search__item" href="product.html?id=${p.id}"><span class="search__img">${imgTag(p.images[0], "", "")}</span><span>${esc(p.name)}</span><span class="price">${money(p.price)}</span></a>`).join("") +
          (list.length > 6 ? `<a class="search__all" href="shop.html?q=${encodeURIComponent(q)}">לכל ${list.length} התוצאות</a>` : "")
        : `<p class="search__empty">לא נמצאו תכשיטים עבור "${esc(q)}"</p>`;
    });
    $("#search-form").addEventListener("submit", (e) => {
      e.preventDefault();
      const q = sIn.value.trim(); if (q) location.href = `shop.html?q=${encodeURIComponent(q)}`;
    });

    // תפריט נגישות
    const A11Y_KEY = "ellie-a11y";
    let a11y = {};
    try { a11y = JSON.parse(localStorage.getItem(A11Y_KEY)) || {}; } catch (e) {}
    const applyA11y = () => {
      const h = document.documentElement;
      h.classList.toggle("a11y-text", !!a11y.text); h.classList.toggle("a11y-contrast", !!a11y.contrast);
      h.classList.toggle("a11y-links", !!a11y.links); h.classList.toggle("a11y-still", !!a11y.still);
      $$("[data-a11y]").forEach((b) => b.dataset.a11y !== "reset" && b.setAttribute("aria-pressed", !!a11y[b.dataset.a11y]));
    };
    applyA11y();
    const panel = $("#a11y-panel"), ab = $("#a11y-btn");
    ab.addEventListener("click", () => { panel.hidden = !panel.hidden; ab.setAttribute("aria-expanded", !panel.hidden); });
    $$("[data-a11y]").forEach((b) => b.addEventListener("click", () => {
      const k = b.dataset.a11y;
      if (k === "reset") a11y = {}; else a11y[k] = !a11y[k];
      try { localStorage.setItem(A11Y_KEY, JSON.stringify(a11y)); } catch (e) {}
      applyA11y();
    }));
  }

  function openCart() {
    checkoutStep = false; renderCart();
    $("#drawer").classList.add("open"); $("#drawer").setAttribute("aria-hidden", "false");
    $("#overlay").classList.add("open");
  }
  function closeAll() {
    $("#drawer").classList.remove("open"); $("#drawer").setAttribute("aria-hidden", "true");
    $(".nav").classList.remove("open"); $("#overlay").classList.remove("open");
    $(".menu-toggle").setAttribute("aria-expanded", "false");
  }

  function bumpCount() {
    const el = $(".bag-count"); el.classList.remove("bump"); void el.offsetWidth; el.classList.add("bump");
  }

  let toastTimer;
  function toast(msg) {
    const t = $("#toast"); t.textContent = msg; t.classList.add("show");
    clearTimeout(toastTimer); toastTimer = setTimeout(() => t.classList.remove("show"), 2200);
  }

  /* ───────── תצוגת הסל ───────── */
  let checkoutStep = false;
  const optText = (opts) => Object.entries(opts).map(([k, v]) => `${k}: ${v}`).join(" · ");

  function renderCart() {
    const n = cartCount(), cc = $(".bag-count");
    cc.textContent = n; cc.classList.toggle("has", n > 0);
    const body = $("#drawer-body"), foot = $("#drawer-foot");

    if (!cart.length) {
      body.innerHTML = `<div class="empty"><p>הסל עדיין ריק</p><a class="btn btn--outline" href="shop.html">לכל התכשיטים</a></div>`;
      foot.innerHTML = ""; return;
    }

    if (checkoutStep) { renderCheckout(body, foot); return; }

    body.innerHTML = cart.map((it, i) => {
      const p = byId(it.id);
      return `<div class="cart-item">
        <a class="cart-item__img" href="product.html?id=${p.id}">${imgTag(toneImage(p, it.opts) || p.images[0], "", p.name)}</a>
        <div>
          <h4>${esc(p.name)}</h4>
          <div class="meta">${esc(optText(it.opts))}</div>
          <div class="qty" aria-label="כמות">
            <button data-q="${i}" data-d="1" aria-label="הוספה">+</button><span>${it.qty}</span><button data-q="${i}" data-d="-1" aria-label="הפחתה">−</button>
          </div>
        </div>
        <div class="cart-item__end"><span class="price">${money(p.price * it.qty)}</span><button class="remove" data-rm="${i}">הסרה</button></div>
      </div>`;
    }).join("");

    foot.innerHTML = `
      <div class="total-row"><span>סה״כ</span><strong>${money(cartTotal())}</strong></div>
      <p class="foot-note">התשלום ופרטי המשלוח יתואמו איתך בוואטסאפ לאחר אישור ההזמנה.</p>
      <button class="btn btn--primary btn--block" id="to-checkout">להמשך הזמנה</button>`;

    $$("[data-q]", body).forEach((b) => b.addEventListener("click", () => {
      const it = cart[+b.dataset.q]; it.qty += +b.dataset.d;
      if (it.qty < 1) cart.splice(+b.dataset.q, 1);
      save(); renderCart();
    }));
    $$("[data-rm]", body).forEach((b) => b.addEventListener("click", () => { cart.splice(+b.dataset.rm, 1); save(); renderCart(); }));
    $("#to-checkout").addEventListener("click", () => { checkoutStep = true; renderCart(); });
  }

  let customer = {};
  try { customer = JSON.parse(localStorage.getItem("ellie-customer")) || {}; } catch (e) {}

  function renderCheckout(body, foot) {
    const c = customer;
    body.innerHTML = `
      <button class="back-link" id="back-to-cart">→ חזרה לסל</button>
      <form class="form" id="order-form" novalidate>
        <div class="field"><label for="f-name">שם מלא</label><input id="f-name" name="name" autocomplete="name" value="${esc(c.name || "")}" required><span class="err">נא למלא שם</span></div>
        <div class="field"><label for="f-phone">טלפון</label><input id="f-phone" name="phone" type="tel" inputmode="tel" autocomplete="tel" value="${esc(c.phone || "")}" required><span class="err">נא למלא מספר טלפון תקין</span></div>
        <div class="field"><label>אופן קבלה</label>
          <div class="radio-row">
            <label><input type="radio" name="delivery" value="משלוח עד הבית" ${c.delivery !== "איסוף עצמי" ? "checked" : ""}><span>משלוח עד הבית</span></label>
            <label><input type="radio" name="delivery" value="איסוף עצמי" ${c.delivery === "איסוף עצמי" ? "checked" : ""}><span>איסוף עצמי</span></label>
          </div>
        </div>
        <div class="field" id="addr-field"><label for="f-addr">כתובת למשלוח</label><input id="f-addr" name="address" autocomplete="street-address" value="${esc(c.address || "")}" placeholder="רחוב, מספר, עיר"><span class="err">נא למלא כתובת</span></div>
        <div class="field"><label for="f-notes">הערות (לא חובה)</label><textarea id="f-notes" name="notes" placeholder="למשל: אריזת מתנה, ברכה..."></textarea></div>
      </form>`;
    foot.innerHTML = `
      <div class="total-row"><span>סה״כ (${cartCount()} פריטים)</span><strong>${money(cartTotal())}</strong></div>
      <p class="foot-note">לחיצה תפתח את וואטסאפ עם ההזמנה מוכנה. נשאר רק ללחוץ "שליחה".</p>
      <button class="btn btn--wa btn--block" id="send-order">${ICONS.wa} שליחת ההזמנה בוואטסאפ</button>`;

    const form = $("#order-form");
    const syncAddr = () => { $("#addr-field").style.display = form.delivery.value === "איסוף עצמי" ? "none" : ""; };
    $$('input[name="delivery"]', form).forEach((r) => r.addEventListener("change", syncAddr)); syncAddr();
    $("#back-to-cart").addEventListener("click", () => { checkoutStep = false; renderCart(); });
    $("#send-order").addEventListener("click", () => sendOrder(form));
  }

  function sendOrder(form) {
    const d = {
      name: form.name.value.trim(), phone: form.phone.value.trim(),
      delivery: form.delivery.value, address: form.address.value.trim(), notes: form.notes.value.trim(),
    };
    const checks = [
      ["#f-name", d.name.length >= 2],
      ["#f-phone", d.phone.replace(/\D/g, "").length >= 9],
      ["#f-addr", d.delivery === "איסוף עצמי" || d.address.length >= 4],
    ];
    let ok = true;
    checks.forEach(([sel, valid]) => { $(sel).closest(".field").classList.toggle("is-error", !valid); if (!valid && ok) { $(sel).focus(); ok = false; } });
    if (!ok) return;

    customer = { name: d.name, phone: d.phone, delivery: d.delivery, address: d.address };
    try { localStorage.setItem("ellie-customer", JSON.stringify(customer)); } catch (e) {}

    const lines = cart.map((it, i) => {
      const p = byId(it.id);
      const o = optText(it.opts);
      return `${i + 1}. ${p.name}${o ? `\n   ${o}` : ""}\n   כמות: ${it.qty} | ${money(p.price * it.qty)}`;
    });
    const msg = [
      "שלום Ellie Jewelry! ✨",
      "אשמח לאשר את ההזמנה הבאה:",
      "",
      ...lines,
      "",
      `*סה״כ: ${money(cartTotal())}*`,
      "",
      `שם: ${d.name}`,
      `טלפון: ${d.phone}`,
      `אופן קבלה: ${d.delivery}`,
      d.delivery !== "איסוף עצמי" ? `כתובת: ${d.address}` : null,
      d.notes ? `הערות: ${d.notes}` : null,
    ].filter((l) => l !== null).join("\n");

    window.open(`https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent(msg)}`, "_blank", "noopener");
    toast("ההזמנה נפתחה בוואטסאפ – נשאר רק ללחוץ שליחה");
  }

  /* ───────── כרטיס מוצר ───────── */
  function card(p) {
    const alt = p.model || p.images[1];
    const out = p.inStock === false;
    return `<article class="card${out ? " is-out" : ""}">
      <div class="card__media">
        <a class="card__link" href="product.html?id=${p.id}" aria-label="${esc(p.name)}">
          ${imgTag(p.images[0], "main", p.name)}
          ${alt ? imgTag(alt, "alt", "") : ""}
        </a>
        ${out ? `<span class="badge badge--out">אזל מהמלאי</span>` : p.badge ? `<span class="badge">${esc(p.badge)}</span>` : ""}
        ${wishBtn(p.id)}
      </div>
      <a href="product.html?id=${p.id}"><h3 class="card__name">${esc(p.name)}</h3></a>
      <div class="price">${money(p.price)}${p.oldPrice ? `<del>${money(p.oldPrice)}</del>` : ""}</div>
    </article>`;
  }

  /* ───────── דף הבית ───────── */
  function heroSlider() {
    const slides = SITE.heroSlides || [];
    const root = $("#hero");
    root.innerHTML = `
      <div class="slides">
        ${slides.map((s, i) => `
        <div class="slide hero__inner${i === 0 ? " active" : ""}" role="group" aria-roledescription="שקופית" aria-label="${i + 1} מתוך ${slides.length}" aria-hidden="${i !== 0}">
          <div class="hero__text">
            <span class="eyebrow">${esc(s.eyebrow || "")}</span>
            <${i === 0 ? "h1" : "h2"} class="hero__title">${esc(s.title).replace(/\n/g, "<br>")}</${i === 0 ? "h1" : "h2"}>
            <span class="hero__rule" aria-hidden="true"></span>
            <p>${esc(s.text || "")}</p>
            <div class="hero__ctas">
              ${s.cta ? `<a class="btn btn--outline" href="${s.cta.href}" tabindex="${i === 0 ? 0 : -1}">${esc(s.cta.label)}</a>` : ""}
            </div>
          </div>
          <div class="hero__img"><img src="${s.image.includes("/") ? s.image : IMG + s.image}" alt="" ${i ? 'loading="lazy"' : ""}></div>
        </div>`).join("")}
      </div>
      ${slides.length > 1 ? `
      <div class="slider__nav">
        <button class="slider__arrow slider__prev" aria-label="הקודם">${ICONS.chevR}</button>
        <span class="slider__count" aria-hidden="true">01 / ${String(slides.length).padStart(2, "0")}</span>
        <button class="slider__arrow slider__next" aria-label="הבא">${ICONS.chevL}</button>
      </div>
      <div class="slider__dots">${slides.map((_, i) => `<button aria-label="שקופית ${i + 1}" aria-current="${i === 0}"></button>`).join("")}</div>` : ""}`;
    if (slides.length < 2) return;

    let cur = 0, timer;
    const els = $$(".slide", root), dots = $$(".slider__dots button", root);
    const go = (n) => {
      cur = (n + els.length) % els.length;
      els.forEach((el, i) => {
        el.classList.toggle("active", i === cur); el.setAttribute("aria-hidden", i !== cur);
        $$("a", el).forEach((a) => (a.tabIndex = i === cur ? 0 : -1));
      });
      dots.forEach((d, i) => d.setAttribute("aria-current", i === cur));
      const cnt = $(".slider__count", root);
      if (cnt) cnt.textContent = `${String(cur + 1).padStart(2, "0")} / ${String(els.length).padStart(2, "0")}`;
    };
    const still = () => matchMedia("(prefers-reduced-motion: reduce)").matches || document.documentElement.classList.contains("a11y-still");
    const play = () => { clearInterval(timer); if (!still()) timer = setInterval(() => go(cur + 1), 6000); };
    const stop = () => clearInterval(timer);
    $(".slider__next", root).addEventListener("click", () => { go(cur + 1); play(); });
    $(".slider__prev", root).addEventListener("click", () => { go(cur - 1); play(); });
    dots.forEach((d, i) => d.addEventListener("click", () => { go(i); play(); }));
    root.addEventListener("mouseenter", stop); root.addEventListener("mouseleave", play);
    root.addEventListener("focusin", stop); root.addEventListener("focusout", play);
    // החלקה במובייל
    let x0 = null;
    root.addEventListener("pointerdown", (e) => (x0 = e.clientX));
    root.addEventListener("pointerup", (e) => {
      if (x0 === null) return;
      const dx = e.clientX - x0; x0 = null;
      if (Math.abs(dx) > 50) { go(dx > 0 ? cur + 1 : cur - 1); play(); }
    });
    play();
  }

  /* ───────── פיד אינסטגרם ─────────
     אם SITE.instagramFeed מוגדר (כתובת JSON מ-behold.so) – מוצגים הפוסטים האמיתיים.
     אחרת מוצגות תמונות מהאתר, וכולן מקשרות לעמוד האינסטגרם. */
  async function instagramFeed() {
    const box = $("#insta"), grid = $("#insta-grid"), more = $("#insta-more");
    const url = SITE.instagram, PAGE = 12;
    box.hidden = false;
    $$(".insta-link", box).forEach((a) => (a.href = url));
    $("#insta-handle").textContent = SITE.instagramHandle ? "@" + SITE.instagramHandle : "Instagram";

    const PLAY = '<svg viewBox="0 0 24 24" fill="currentColor"><path d="M8 5.5v13l10.5-6.5z"/></svg>';
    const ALBUM = '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8"><rect x="7.5" y="7.5" width="12" height="12" rx="2"/><path d="M4.5 15.5v-9a2 2 0 0 1 2-2h9"/></svg>';
    let posts = [];
    if (SITE.instagramFeed) {
      try {
        const data = await (await fetch(SITE.instagramFeed)).json();
        const list = Array.isArray(data) ? data : data.posts || [];
        posts = list.map((p) => ({
          href: p.permalink || url,
          img: (p.sizes && p.sizes.medium && p.sizes.medium.mediaUrl) || p.thumbnailUrl || p.mediaUrl,
          type: p.mediaType || "IMAGE",
          alt: (p.prunedCaption || p.caption || "").slice(0, 120),
        })).filter((p) => p.img);
        if (data.profilePictureUrl) $("#insta-avatar").src = data.profilePictureUrl;
      } catch (e) { posts = []; }
    }
    if (!posts.length) {
      posts = ["lotus-drop-model.webp", "tennis-spikes-model.webp", "pear-tennis-bust.webp", "lotus-peer-model.webp",
        "collier-square.webp", "helix-tennis.webp", "oval-gold.webp", "lotus-peer.webp", "collier-marquises.webp",
        "rigid-pear.webp", "helix-marquise.webp", "tennis-graduated.webp"]
        .map((f) => ({ href: url, img: IMG + f, type: "IMAGE", alt: "" }));
    }

    let shown = 0;
    const draw = () => {
      const next = posts.slice(shown, shown + PAGE);
      grid.insertAdjacentHTML("beforeend", next.map((p) => `
        <a class="insta-post" href="${esc(p.href)}" target="_blank" rel="noopener" aria-label="${esc(p.alt || "פוסט באינסטגרם")}">
          <img src="${esc(p.img)}" alt="" loading="lazy">
          ${p.type === "VIDEO" ? `<i class="insta-post__type insta-post__type--play">${PLAY}</i>` : p.type === "CAROUSEL_ALBUM" ? `<i class="insta-post__type">${ALBUM}</i>` : ""}
          <span class="insta-post__hover">${ICONS.instagram}</span>
        </a>`).join(""));
      shown += next.length;
      more.hidden = shown >= posts.length;
    };
    more.addEventListener("click", draw);
    draw();
  }

  /* ───────── שופינג מהתמונה ───────── */
  function shopTheLook() {
    const box = $("#look"), cfg = SITE.shopTheLook;
    if (!box || !cfg) return;
    const items = cfg.items.map((it) => ({ ...it, p: byId(it.id) })).filter((it) => it.p);
    const total = items.reduce((s, it) => s + it.p.price, 0);
    $("#look-media").innerHTML = `
      <img src="${esc(cfg.image)}" alt="דוגמנית עונדת סט תכשיטים ברוז גולד" loading="lazy">
      ${items.map((it, i) => `
        <button class="look__dot" style="left:${it.x}%;top:${it.y}%" data-look="${i}" aria-label="${esc(it.p.name)}" aria-expanded="false">
          <span class="look__tip"><strong>${esc(it.p.name)}</strong><em>${money(it.p.price)}</em></span>
        </button>`).join("")}`;
    $("#look-list").innerHTML = items.map((it, i) => `
      <a class="look__item" href="product.html?id=${it.p.id}" data-look-item="${i}">
        <span class="look__thumb">${imgTag(it.p.images[0], "", "")}</span>
        <span class="look__info"><span class="look__name">${esc(it.p.name)}</span><span class="price">${money(it.p.price)}</span></span>
        <span class="look__go" aria-hidden="true">${ICONS.chevL}</span>
      </a>`).join("") + `<div class="look__total"><span>כל הסט</span><strong>${money(total)}</strong></div>`;

    const dots = $$(".look__dot", box), rows = $$(".look__item", box);
    const mark = (i) => { rows.forEach((r, k) => r.classList.toggle("is-hl", k === i)); dots.forEach((d, k) => d.classList.toggle("is-hl", k === i)); };
    dots.forEach((d, i) => {
      d.addEventListener("mouseenter", () => mark(i));
      d.addEventListener("focus", () => mark(i));
      d.addEventListener("click", () => {
        const open = d.getAttribute("aria-expanded") !== "true";
        dots.forEach((x) => x.setAttribute("aria-expanded", "false"));
        d.setAttribute("aria-expanded", open); mark(open ? i : -1);
        if (!open) location.href = rows[i].href;
      });
    });
    rows.forEach((r, i) => r.addEventListener("mouseenter", () => mark(i)));
    box.addEventListener("mouseleave", () => mark(-1));
  }

  function home() {
    heroSlider();

    $("#faq-list").innerHTML = (SITE.faq || []).map((f, i) =>
      `<details${i === 0 ? " open" : ""}><summary>${esc(f.q)}</summary><p>${esc(f.a)}</p></details>`).join("");

    if (SITE.instagram) instagramFeed();
    shopTheLook();

    const gift = $("#gift-wa");
    if (gift) gift.href = `https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent("היי Ellie Jewelry! 🎁\nאני מחפשת מתנה ואשמח לעזרה בבחירה.")}`;

    $("#featured").innerHTML = PRODUCTS.filter((p) => p.featured).slice(0, 8).map(card).join("");
    $("#earrings-row").innerHTML = PRODUCTS.filter((p) => p.category === "earrings").slice(0, 4).map(card).join("");
    $("#cats").innerHTML = Object.entries(CATEGORIES).map(([k, c]) => `
      <a class="cat" href="shop.html?cat=${k}">
        <img src="${IMG}${c.image}" alt="" loading="lazy">
        <div class="cat__label"><h3>${c.name}</h3><span>לקולקציה</span></div>
      </a>`).join("");
  }

  /* ───────── עמוד קטגוריה ───────── */
  function shop() {
    const params = new URLSearchParams(location.search);
    let cat = CATEGORIES[params.get("cat")] ? params.get("cat") : "all";
    let sub = cat !== "all" && (CATEGORIES[cat].subs || {})[params.get("sub")] ? params.get("sub") : "all";
    let q = (params.get("q") || "").trim();
    let sort = "default";
    const syncUrl = () => {
      const u = new URLSearchParams();
      if (cat !== "all") u.set("cat", cat);
      if (sub !== "all") u.set("sub", sub);
      if (q) u.set("q", q);
      history.replaceState(null, "", "shop.html" + (u.toString() ? "?" + u : ""));
    };
    const drawSubs = () => {
      const box = $("#subs");
      const subs = cat === "all" ? {} : CATEGORIES[cat].subs || {};
      box.innerHTML = Object.keys(subs).length
        ? [["all", "הכל"], ...Object.entries(subs)].map(([k, n]) => `<button class="chip" data-sub="${k}" aria-pressed="${k === sub}">${esc(n)}</button>`).join("")
        : "";
      $$("[data-sub]", box).forEach((b) => b.addEventListener("click", () => { sub = b.dataset.sub; syncUrl(); drawSubs(); draw(); }));
    };
    const tabs = [["all", "הכל"], ...Object.entries(CATEGORIES).map(([k, c]) => [k, c.name])];

    $("#tabs").innerHTML = tabs.map(([k, n]) => `<button class="tab" data-cat="${k}" aria-pressed="${k === cat}">${n}</button>`).join("");
    $$("#tabs .tab").forEach((t) => t.addEventListener("click", () => {
      cat = t.dataset.cat; sub = "all";
      $$("#tabs .tab").forEach((x) => x.setAttribute("aria-pressed", x === t));
      syncUrl();
      $$(".nav a").forEach((a) => a.removeAttribute("aria-current"));
      drawSubs(); draw();
    }));
    $("#sort").addEventListener("change", (e) => { sort = e.target.value; draw(); });

    function draw() {
      let list = q ? findProducts(q) : PRODUCTS;
      list = list.filter((p) => (cat === "all" || p.category === cat) && (sub === "all" || p.sub === sub));
      if (sort === "low") list = [...list].sort((a, b) => a.price - b.price);
      if (sort === "high") list = [...list].sort((a, b) => b.price - a.price);
      if (sort === "name") list = [...list].sort((a, b) => a.name.localeCompare(b.name, "he"));
      const base = cat === "all" ? "כל התכשיטים" : sub !== "all" ? CATEGORIES[cat].subs[sub] : CATEGORIES[cat].name;
      const title = q ? `תוצאות חיפוש: "${q}"` : base;
      $("#search-note").hidden = !q;
      $("#search-note").innerHTML = q ? `<button class="back-link" id="clear-q">ניקוי החיפוש</button>` : "";
      if (q) $("#clear-q").addEventListener("click", () => { q = ""; syncUrl(); draw(); });
      $("#page-title").textContent = title;
      document.title = `${title} | Ellie Jewelry`;
      $("#count").textContent = `${list.length} פריטים`;
      $("#shop-grid").innerHTML = list.length ? list.map(card).join("")
        : `<div class="empty" style="grid-column:1/-1"><p>לא נמצאו תכשיטים</p><a class="btn btn--outline" href="shop.html">לכל התכשיטים</a></div>`;
    }
    drawSubs();
    draw();
  }

  /* ───────── עמוד מוצר ───────── */
  function product() {
    const p = byId(new URLSearchParams(location.search).get("id"));
    const root = $("#product-root");
    if (!p) {
      root.innerHTML = `<div class="empty"><p>המוצר לא נמצא</p><a class="btn btn--outline" href="shop.html">לכל התכשיטים</a></div>`;
      return;
    }
    document.title = `${p.name} | Ellie Jewelry`;
    const imgs = [...new Set([...p.images, ...Object.values(p.toneImages || {}), ...(p.model ? [p.model] : [])])];
    const cat = CATEGORIES[p.category];
    const sel = {};
    (p.options || []).forEach((o) => { if (o.values.length === 1) sel[o.label] = o.values[0]; });
    let qty = 1;

    root.innerHTML = `
      <nav class="crumbs container" aria-label="מיקום"><a href="index.html">ראשי</a> / <a href="shop.html?cat=${p.category}">${cat.name}</a> / ${esc(p.name)}</nav>
      <div class="container product">
        <div class="gallery">
          <div class="gallery__main">${imgTag(imgs[0], "", p.name).replace(' loading="lazy"', "")}</div>
          <p class="tone-note" id="tone-note" hidden></p>
          ${imgs.length > 1 ? `<div class="gallery__thumbs">${imgs.map((f, i) => `<button data-i="${i}" aria-current="${i === 0}" aria-label="תמונה ${i + 1}">${imgTag(f)}</button>`).join("")}</div>` : ""}
        </div>
        <div class="product__info">
          ${p.badge ? `<span class="eyebrow" style="font-size:14px;letter-spacing:.1em">${esc(p.badge)}</span>` : ""}
          <div class="title-row"><h1>${esc(p.name)}</h1>${wishBtn(p.id, "wish-btn wish-btn--lg")}</div>
          ${p.inStock === false ? `<span class="badge badge--out badge--inline">אזל מהמלאי</span>` : ""}
          <div class="price">${money(p.price)}${p.oldPrice ? `<del>${money(p.oldPrice)}</del>` : ""}</div>
          <p class="product__desc">${esc(p.description || "")}</p>
          ${(p.options || []).map((o, oi) => `
            <fieldset class="opt" data-opt="${oi}">
              <legend>${esc(o.label)}<small class="chosen">${sel[o.label] ? esc(sel[o.label]) : ""}</small></legend>
              <div class="chips" role="radiogroup" aria-label="${esc(o.label)}">
                ${o.values.map((v) => `<button class="chip" role="radio" aria-checked="${sel[o.label] === v}" data-v="${esc(v)}">${TONE_COLORS[v] ? `<span class="swatch" style="background:${TONE_COLORS[v]}"></span>` : ""}${esc(v)}</button>`).join("")}
              </div>
            </fieldset>`).join("")}
          ${p.inStock === false ? `
          <form class="restock form" id="restock" novalidate>
            <h3>אהבת את הפריט? נעדכן אותך ברגע שהוא חוזר!</h3>
            <div class="field"><label for="r-name">שם מלא</label><input id="r-name" name="name" autocomplete="name"><span class="err">נא למלא שם</span></div>
            <div class="field"><label for="r-phone">טלפון</label><input id="r-phone" name="phone" type="tel" inputmode="tel" autocomplete="tel"><span class="err">נא למלא מספר טלפון תקין</span></div>
            <div class="field"><label for="r-notes">הערות (לא חובה)</label><textarea id="r-notes" name="notes"></textarea></div>
            <button class="btn btn--wa btn--block" type="submit">${ICONS.wa} עדכנו אותי בוואטסאפ</button>
          </form>` : `
          <div class="buy-row">
            <div class="qty" aria-label="כמות"><button id="q-plus" aria-label="הוספה">+</button><span id="q-val">1</span><button id="q-minus" aria-label="הפחתה">−</button></div>
            <button class="btn btn--primary" id="add">הוספה לסל</button>
          </div>`}
          <a class="ask-link" target="_blank" rel="noopener" href="https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent(`היי, יש לי שאלה על "${p.name}"`)}">${ICONS.wa} יש לך שאלה על התכשיט? דברי איתנו בוואטסאפ</a>
          <div class="accordion">
            <details><summary>מידע נוסף</summary>
              <dl class="specs">
                <dt>קטגוריה</dt><dd>${cat.name}${(cat.subs || {})[p.sub] ? ` · ${cat.subs[p.sub]}` : ""}</dd>
                ${(p.options || []).map((o) => `<dt>${esc(o.label)}</dt><dd>${o.values.map(esc).join(", ")}</dd>`).join("")}
                <dt>זמינות</dt><dd>${p.inStock === false ? "אזל מהמלאי" : "במלאי"}</dd>
              </dl>
            </details>
            <details open><summary>איך מזמינים?</summary><p>מוסיפים לסל, ממלאים שם וטלפון ולוחצים "שליחת ההזמנה בוואטסאפ". ההזמנה מגיעה אלינו, ואנחנו חוזרות אלייך לאישור, לתשלום ולתיאום המשלוח.</p></details>
            <details><summary>משלוח ואיסוף</summary><p>אפשר לבחור משלוח עד הבית או איסוף עצמי. זמני המשלוח והעלות יתואמו איתך בוואטסאפ בעת אישור ההזמנה.</p></details>
            <details><summary>שמירה על התכשיט</summary><p>מומלץ להימנע ממגע עם בשמים, קרמים ומים, ולשמור את התכשיט בנפרד בקופסה או בשקית בד.</p></details>
          </div>
        </div>
      </div>
      ${p.wear ? `
      <section class="container">
        <div class="wear">
          <div class="wear__img"><img src="assets/img/lifestyle/${esc(p.wear.image)}" alt="${esc(p.name)} על הגוף" loading="lazy"></div>
          <div class="wear__text">
            <span class="slogan">How to wear it</span>
            <h2>איך לענוד</h2>
            <p>${esc(p.wear.tip)}</p>
            <span class="script" lang="en">Shine Everyday</span>
          </div>
        </div>
      </section>` : ""}
      <section class="section container">
        <div class="section__head"><span class="ornament">${DIAMOND}</span><h2>אולי תאהבי גם</h2></div>
        <div class="grid">${PRODUCTS.filter((x) => x.category === p.category && x.id !== p.id).slice(0, 4).map(card).join("")}</div>
      </section>`;

    const main = $(".gallery__main");
    const showImage = (i) => {
      main.innerHTML = imgTag(imgs[i], "", p.name);
      $$(".gallery__thumbs button").forEach((x) => x.setAttribute("aria-current", +x.dataset.i === i));
    };
    $$(".gallery__thumbs button").forEach((b) => b.addEventListener("click", () => showImage(+b.dataset.i)));

    // בחירת גוון: מעבר לתמונה של הגוון אם יש, ואחרת הערה איזה גוון מופיע בתמונה
    const note = $("#tone-note");
    const onTone = (v) => {
      const file = p.toneImages && p.toneImages[v];
      if (file) { showImage(imgs.indexOf(file)); note.hidden = true; return; }
      const want = toneOf(v);
      if (p.baseTone && want && want !== p.baseTone) {
        showImage(0);
        note.textContent = `בתמונה: גוון ${TONE_NAMES[p.baseTone]}. התכשיט יישלח בגוון שבחרת – ${v}.`;
        note.hidden = false;
      } else note.hidden = true;
    };

    $$(".opt").forEach((fs) => {
      const o = p.options[+fs.dataset.opt];
      $$(".chip", fs).forEach((ch) => ch.addEventListener("click", () => {
        sel[o.label] = ch.dataset.v;
        $$(".chip", fs).forEach((x) => x.setAttribute("aria-checked", x === ch));
        $(".chosen", fs).textContent = ch.dataset.v;
        fs.classList.remove("is-error");
        onTone(ch.dataset.v);
      }));
    });

    if (p.inStock === false) {
      $("#restock").addEventListener("submit", (e) => {
        e.preventDefault();
        const f = e.target, name = f.name.value.trim(), phone = f.phone.value.trim(), notes = f.notes.value.trim();
        const okName = name.length >= 2, okPhone = phone.replace(/\D/g, "").length >= 9;
        f.name.closest(".field").classList.toggle("is-error", !okName);
        f.phone.closest(".field").classList.toggle("is-error", !okPhone);
        if (!okName || !okPhone) return;
        const chosen = optText(sel);
        const msg = ["היי Ellie Jewelry!", `אשמח לעדכון כש"${p.name}" חוזר למלאי.`, chosen || null, "", `שם: ${name}`, `טלפון: ${phone}`, notes ? `הערות: ${notes}` : null]
          .filter((l) => l !== null).join("\n");
        window.open(`https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent(msg)}`, "_blank", "noopener");
        toast("הבקשה נפתחה בוואטסאפ – נשאר רק ללחוץ שליחה");
      });
      return;
    }

    const qv = $("#q-val");
    $("#q-plus").addEventListener("click", () => { qty++; qv.textContent = qty; });
    $("#q-minus").addEventListener("click", () => { qty = Math.max(1, qty - 1); qv.textContent = qty; });

    $("#add").addEventListener("click", () => {
      const missing = (p.options || []).map((o, i) => [o, i]).filter(([o]) => !sel[o.label]);
      if (missing.length) {
        missing.forEach(([, i]) => { const fs = $(`.opt[data-opt="${i}"]`); fs.classList.remove("is-error"); void fs.offsetWidth; fs.classList.add("is-error"); });
        toast(`נא לבחור ${missing.map(([o]) => o.label).join(" ו")}`);
        return;
      }
      const opts = {}; (p.options || []).forEach((o) => (opts[o.label] = sel[o.label]));
      addToCart(p.id, opts, qty);
    });
  }

  /* ───────── עמוד מועדפים ───────── */
  function wishlistPage() {
    const list = wish.map(byId).filter(Boolean);
    $("#wish-count-note").textContent = list.length ? `${list.length} פריטים שמורים` : "";
    $("#wish-grid").innerHTML = list.length ? list.map(card).join("")
      : `<div class="empty" style="grid-column:1/-1"><p>עוד לא שמרת תכשיטים. לחצי על הלב ליד תכשיט כדי לשמור אותו כאן.</p><a class="btn btn--outline" href="shop.html">לכל התכשיטים</a></div>`;
  }

  /* ───────── הפעלה ───────── */
  layout();
  renderCart();
  ({ home, shop, product, wishlist: wishlistPage }[document.body.dataset.page] || (() => {}))();
  syncWish();
})();
