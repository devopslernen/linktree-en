/* Baut Filter-Leiste und Kurskarten aus courses.js (SHOP) auf. */
(function () {
  var root = document.getElementById("courses");
  var filterBar = document.getElementById("course-filter");
  if (!root || !filterBar || !window.SHOP) return;

  var T = SHOP.text;
  var money = new Intl.NumberFormat(SHOP.locale, { style: "currency", currency: SHOP.currency });
  var percent = new Intl.NumberFormat(SHOP.locale, { style: "percent" });

  function el(tag, cls, text) {
    var e = document.createElement(tag);
    if (cls) e.className = cls;
    if (text != null) e.textContent = text;
    return e;
  }

  function courseUrl(c) {
    return c.url || "https://www.udemy.com/course/" + c.slug + "/?couponCode=" + encodeURIComponent(SHOP.coupon);
  }

  function track(path, title) {
    if (window.goatcounter && window.goatcounter.count) {
      // Sprache voranstellen: DE- und EN-Seite zaehlen in dasselbe GoatCounter-Konto
      window.goatcounter.count({ path: document.documentElement.lang + "/" + path, title: title, event: true });
    }
  }

  function card(c) {
    var a = el("a", "course" + (c.free ? " course-free" : ""));
    a.href = courseUrl(c);
    a.target = "_blank";
    a.rel = "noopener";
    a.addEventListener("click", function () { track("kurs/" + c.slug, c.title); });

    var img = el("img", "course-img");
    img.src = "img/" + c.img;
    img.alt = "";
    img.loading = "lazy";
    a.appendChild(img);

    var body = el("div", "course-body");

    var badges = el("div", "course-badges");
    if (c.free) badges.appendChild(el("span", "badge badge-free", T.free));
    if (c.isNew) badges.appendChild(el("span", "badge badge-new", T.isNew));
    if (c.level) badges.appendChild(el("span", "badge", c.level));
    if (badges.childNodes.length) body.appendChild(badges);

    body.appendChild(el("div", "course-title", c.title));

    var price = el("div", "course-price");
    if (c.free) {
      price.appendChild(el("strong", "price-now", T.free));
    } else {
      var list = c.listPrice || SHOP.listPrice;
      price.appendChild(el("s", "price-old", money.format(list)));
      price.appendChild(el("strong", "price-now", money.format(SHOP.price)));
      price.appendChild(el("span", "price-off", percent.format(Math.round((SHOP.price / list - 1) * 100) / 100).replace("-", "−")));
    }
    body.appendChild(price);
    a.appendChild(body);

    a.appendChild(el("span", "course-cta", c.free ? T.ctaFree : T.cta));
    return a;
  }

  function section(title, list) {
    var s = el("section", "course-section");
    var h = el("h2", "course-section-title", title);
    h.appendChild(el("span", "course-count", list.length + " " + (list.length === 1 ? T.course : T.courses)));
    s.appendChild(h);
    list.forEach(function (c) { s.appendChild(card(c)); });
    return s;
  }

  function inCat(id) {
    return SHOP.courses.filter(function (c) { return c.cats.indexOf(id) !== -1; });
  }

  function render(catId) {
    root.innerHTML = "";
    if (catId) {
      var cat = SHOP.categories.filter(function (k) { return k.id === catId; })[0];
      root.appendChild(section(cat.label, inCat(catId)));
      return;
    }
    // "Alle": Gratis-Kurse oben, danach jeder Kurs genau einmal in seiner Hauptkategorie
    var free = SHOP.courses.filter(function (c) { return c.free; });
    if (free.length) root.appendChild(section(T.featured, free));
    SHOP.categories.forEach(function (k) {
      var list = SHOP.courses.filter(function (c) { return !c.free && c.cats[0] === k.id; });
      if (list.length) root.appendChild(section(k.label, list));
    });
  }

  function select(catId, scroll) {
    Array.prototype.forEach.call(filterBar.children, function (b) {
      var active = b.dataset.cat === (catId || "");
      b.setAttribute("aria-pressed", active ? "true" : "false");
      // Mobil scrollt die Leiste horizontal: aktiven Filter sichtbar machen
      if (active) filterBar.scrollLeft = b.offsetLeft - filterBar.offsetLeft - 10;
    });
    render(catId);
    // Kategorie in der URL merken -> teilbare Links wie ?kat=linux
    var url = new URL(window.location.href);
    if (catId) url.searchParams.set("kat", catId); else url.searchParams.delete("kat");
    history.replaceState(null, "", url.pathname + url.search);
    if (scroll) filterBar.scrollIntoView({ behavior: "smooth", block: "start" });
  }

  function chip(id, label, count) {
    var b = el("button", "chip", label);
    b.type = "button";
    b.dataset.cat = id;
    b.appendChild(el("span", "chip-count", String(count)));
    b.addEventListener("click", function () {
      track("filter/" + (id || "alle"), label);
      select(id, true);
    });
    return b;
  }

  filterBar.appendChild(chip("", T.all, SHOP.courses.length));
  SHOP.categories.forEach(function (k) {
    filterBar.appendChild(chip(k.id, k.label, inCat(k.id).length));
  });

  var start = new URLSearchParams(window.location.search).get("kat");
  var valid = SHOP.categories.some(function (k) { return k.id === start; });
  select(valid ? start : "", false);
})();
