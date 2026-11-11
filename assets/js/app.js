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

  const $ = (s, el = document) => el.querySelector(s);
  const $$ = (s, el = document) => [...el.querySelectorAll(s)];
  const esc = (s) => String(s).replace(/[&<>"']/g, (c) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" }[c]));
  const money = (n) => `${n.toLocaleString("he-IL")} ₪`;
  const byId = (id) => PRODUCTS.find((p) => p.id === id);
  const imgTag = (file, cls = "", alt = "") =>
    `<img src="${IMG}${file}" alt="${esc(alt)}" loading="lazy" class="${cls}${PHOTOS.has(file) ? " is-photo" : ""}">`;

  const ICONS = {
    bag: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5"><path d="M5 8h14l-1 12H6L5 8Z"/><path d="M9 8V6a3 3 0 0 1 6 0v2"/></svg>',
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

  /* ───────── מבנה משותף לכל העמודים ───────── */
  function layout() {
    const page = document.body.dataset.page;
    const cat = new URLSearchParams(location.search).get("cat");
    const cur = (p, c) => (page === p && (c === undefined || c === cat) ? ' aria-current="page"' : "");

    document.body.insertAdjacentHTML("afterbegin", `
      <a class="skip-link" href="#main">דלג לתוכן</a>
      <div class="announce">בוחרים תכשיט ✦ שולחים הזמנה בוואטסאפ ✦ אנחנו חוזרות אלייך לאישור</div>
      <header class="header">
        <div class="container header__row">
          <div style="display:flex;align-items:center;gap:8px">
            <button class="icon-btn menu-toggle" aria-label="תפריט" aria-expanded="false">${ICONS.menu}</button>
            <nav class="nav" aria-label="ראשי">
              <a href="index.html"${cur("home")}>ראשי</a>
              <a href="shop.html?cat=necklaces"${cur("shop", "necklaces")}>שרשראות</a>
              <a href="shop.html?cat=earrings"${cur("shop", "earrings")}>עגילים</a>
              <a href="shop.html"${page === "shop" && !cat ? ' aria-current="page"' : ""}>כל התכשיטים</a>
            </nav>
          </div>
          <a class="logo" href="index.html" aria-label="Ellie Jewelry – לדף הבית"><img src="assets/img/logo.webp" alt="Ellie Jewelry"></a>
          <div class="header__actions">
            <button class="icon-btn" id="cart-btn" aria-label="סל הקניות">${ICONS.bag}<span class="cart-count"></span></button>
          </div>
        </div>
      </header>`);

    document.body.insertAdjacentHTML("beforeend", `
      <footer class="footer">
        <div class="container footer__grid">
          <div class="footer__brand">
            <img src="assets/img/logo.webp" alt="" loading="lazy">
            <p>Ellie Jewelry – תכשיטים עדינים ונוצצים לכל יום ולכל רגע מיוחד. בוחרים באתר, שולחים בוואטסאפ, ואנחנו דואגות לכל השאר.</p>
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
            <h4>יצירת קשר</h4>
            <ul>
              <li><a href="https://wa.me/${WHATSAPP_NUMBER}" target="_blank" rel="noopener">וואטסאפ: 050-589-9955</a></li>
              <li><a href="tel:+${WHATSAPP_NUMBER}">טלפון: 050-589-9955</a></li>
            </ul>
          </div>
        </div>
        <div class="container footer__bottom">© ${new Date().getFullYear()} Ellie Jewelry. כל הזכויות שמורות.</div>
      </footer>
      <a class="wa-float" href="https://wa.me/${WHATSAPP_NUMBER}" target="_blank" rel="noopener" aria-label="שיחה בוואטסאפ">${ICONS.wa}</a>
      <div class="overlay" id="overlay"></div>
      <aside class="drawer" id="drawer" aria-label="סל הקניות" aria-hidden="true">
        <div class="drawer__head"><h2>הסל שלי</h2><button class="icon-btn" id="drawer-close" aria-label="סגירה">${ICONS.close}</button></div>
        <div class="drawer__body" id="drawer-body"></div>
        <div class="drawer__foot" id="drawer-foot"></div>
      </aside>
      <div class="toast" id="toast" role="status" aria-live="polite"></div>`);

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
    const el = $(".cart-count"); el.classList.remove("bump"); void el.offsetWidth; el.classList.add("bump");
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
    const n = cartCount(), cc = $(".cart-count");
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
        <a class="cart-item__img" href="product.html?id=${p.id}">${imgTag(p.images[0], "", p.name)}</a>
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
    return `<article class="card">
      <a class="card__media" href="product.html?id=${p.id}" aria-label="${esc(p.name)}">
        ${p.badge ? `<span class="badge">${esc(p.badge)}</span>` : ""}
        ${imgTag(p.images[0], "main", p.name)}
        ${alt ? imgTag(alt, "alt", "") : ""}
      </a>
      <a href="product.html?id=${p.id}"><h3 class="card__name">${esc(p.name)}</h3></a>
      <div class="price">${money(p.price)}${p.oldPrice ? `<del>${money(p.oldPrice)}</del>` : ""}</div>
    </article>`;
  }

  /* ───────── דף הבית ───────── */
  function home() {
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
    let sort = "default";
    const tabs = [["all", "הכל"], ...Object.entries(CATEGORIES).map(([k, c]) => [k, c.name])];

    $("#tabs").innerHTML = tabs.map(([k, n]) => `<button class="tab" data-cat="${k}" aria-pressed="${k === cat}">${n}</button>`).join("");
    $$("#tabs .tab").forEach((t) => t.addEventListener("click", () => {
      cat = t.dataset.cat;
      $$("#tabs .tab").forEach((x) => x.setAttribute("aria-pressed", x === t));
      history.replaceState(null, "", cat === "all" ? "shop.html" : `shop.html?cat=${cat}`);
      $$(".nav a").forEach((a) => a.removeAttribute("aria-current"));
      draw();
    }));
    $("#sort").addEventListener("change", (e) => { sort = e.target.value; draw(); });

    function draw() {
      let list = PRODUCTS.filter((p) => cat === "all" || p.category === cat);
      if (sort === "low") list = [...list].sort((a, b) => a.price - b.price);
      if (sort === "high") list = [...list].sort((a, b) => b.price - a.price);
      const title = cat === "all" ? "כל התכשיטים" : CATEGORIES[cat].name;
      $("#page-title").textContent = title;
      document.title = `${title} | Ellie Jewelry`;
      $("#count").textContent = `${list.length} פריטים`;
      $("#shop-grid").innerHTML = list.map(card).join("");
    }
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
    const imgs = [...p.images, ...(p.model ? [p.model] : [])];
    const cat = CATEGORIES[p.category];
    const sel = {};
    (p.options || []).forEach((o) => { if (o.values.length === 1) sel[o.label] = o.values[0]; });
    let qty = 1;

    root.innerHTML = `
      <nav class="crumbs container" aria-label="מיקום"><a href="index.html">ראשי</a> / <a href="shop.html?cat=${p.category}">${cat.name}</a> / ${esc(p.name)}</nav>
      <div class="container product">
        <div class="gallery">
          <div class="gallery__main">${imgTag(imgs[0], "", p.name).replace(' loading="lazy"', "")}</div>
          ${imgs.length > 1 ? `<div class="gallery__thumbs">${imgs.map((f, i) => `<button data-i="${i}" aria-current="${i === 0}" aria-label="תמונה ${i + 1}">${imgTag(f)}</button>`).join("")}</div>` : ""}
        </div>
        <div class="product__info">
          ${p.badge ? `<span class="eyebrow" style="font-size:14px;letter-spacing:.1em">${esc(p.badge)}</span>` : ""}
          <h1>${esc(p.name)}</h1>
          <div class="price">${money(p.price)}${p.oldPrice ? `<del>${money(p.oldPrice)}</del>` : ""}</div>
          <p class="product__desc">${esc(p.description || "")}</p>
          ${(p.options || []).map((o, oi) => `
            <fieldset class="opt" data-opt="${oi}">
              <legend>${esc(o.label)}<small class="chosen">${sel[o.label] ? esc(sel[o.label]) : ""}</small></legend>
              <div class="chips" role="radiogroup" aria-label="${esc(o.label)}">
                ${o.values.map((v) => `<button class="chip" role="radio" aria-checked="${sel[o.label] === v}" data-v="${esc(v)}">${TONE_COLORS[v] ? `<span class="swatch" style="background:${TONE_COLORS[v]}"></span>` : ""}${esc(v)}</button>`).join("")}
              </div>
            </fieldset>`).join("")}
          <div class="buy-row">
            <div class="qty" aria-label="כמות"><button id="q-plus" aria-label="הוספה">+</button><span id="q-val">1</span><button id="q-minus" aria-label="הפחתה">−</button></div>
            <button class="btn btn--primary" id="add">הוספה לסל</button>
          </div>
          <a class="ask-link" target="_blank" rel="noopener" href="https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent(`היי, יש לי שאלה על "${p.name}"`)}">${ICONS.wa} יש לך שאלה על התכשיט? דברי איתנו בוואטסאפ</a>
          <div class="accordion">
            <details open><summary>איך מזמינים?</summary><p>מוסיפים לסל, ממלאים שם וטלפון ולוחצים "שליחת ההזמנה בוואטסאפ". ההזמנה מגיעה אלינו, ואנחנו חוזרות אלייך לאישור, לתשלום ולתיאום המשלוח.</p></details>
            <details><summary>משלוח ואיסוף</summary><p>אפשר לבחור משלוח עד הבית או איסוף עצמי. זמני המשלוח והעלות יתואמו איתך בוואטסאפ בעת אישור ההזמנה.</p></details>
            <details><summary>שמירה על התכשיט</summary><p>מומלץ להימנע ממגע עם בשמים, קרמים ומים, ולשמור את התכשיט בנפרד בקופסה או בשקית בד.</p></details>
          </div>
        </div>
      </div>
      <section class="section container">
        <div class="section__head"><span class="ornament">✦</span><h2>אולי תאהבי גם</h2></div>
        <div class="grid">${PRODUCTS.filter((x) => x.category === p.category && x.id !== p.id).slice(0, 4).map(card).join("")}</div>
      </section>`;

    const main = $(".gallery__main");
    $$(".gallery__thumbs button").forEach((b) => b.addEventListener("click", () => {
      main.innerHTML = imgTag(imgs[+b.dataset.i], "", p.name);
      $$(".gallery__thumbs button").forEach((x) => x.setAttribute("aria-current", x === b));
    }));

    $$(".opt").forEach((fs) => {
      const o = p.options[+fs.dataset.opt];
      $$(".chip", fs).forEach((ch) => ch.addEventListener("click", () => {
        sel[o.label] = ch.dataset.v;
        $$(".chip", fs).forEach((x) => x.setAttribute("aria-checked", x === ch));
        $(".chosen", fs).textContent = ch.dataset.v;
        fs.classList.remove("is-error");
      }));
    });

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

  /* ───────── הפעלה ───────── */
  layout();
  renderCart();
  ({ home, shop, product }[document.body.dataset.page] || (() => {}))();
})();
