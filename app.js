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
    if (c.bestseller) badges.appendChild(el("span", "badge badge-best", T.bestseller));
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

  function section(title, list, hint) {
    var s = el("section", "course-section");
    var h = el("h2", "course-section-title");
    var name = el("span", "course-section-name", title);
    if (hint) name.appendChild(el("small", "course-section-hint", hint));
    h.appendChild(name);
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
      root.appendChild(section(cat.label, inCat(catId), cat.hint));
      return;
    }
    // "Alle": jeder Kurs genau einmal in seiner Hauptkategorie,
    // Gratis-Kurse als eigener Abschnitt an zweiter Stelle (nach dem Topseller-Bereich)
    var free = SHOP.courses.filter(function (c) { return c.free; });
    var shown = 0;
    SHOP.categories.forEach(function (k) {
      var list = SHOP.courses.filter(function (c) { return !c.free && c.cats[0] === k.id; });
      if (!list.length) return;
      root.appendChild(section(k.label, list, k.hint));
      if (++shown === 1 && free.length) root.appendChild(section(T.featured, free));
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

  function chip(id, label, count, hint) {
    var b = el("button", "chip");
    b.type = "button";
    b.dataset.cat = id;
    var top = el("span", "chip-label", label);
    top.appendChild(el("span", "chip-count", String(count)));
    b.appendChild(top);
    if (hint) b.appendChild(el("span", "chip-hint", hint));
    b.addEventListener("click", function () {
      track("filter/" + (id || "alle"), label);
      select(id, true);
    });
    return b;
  }

  filterBar.appendChild(chip("", T.all, SHOP.courses.length));
  SHOP.categories.forEach(function (k) {
    filterBar.appendChild(chip(k.id, k.label, inCat(k.id).length, k.hint));
  });

  // Kennzahlen im Kopfbereich; Kursanzahl ergibt sich aus der Liste
  var stats = document.getElementById("hero-stats");
  if (stats && SHOP.stats) {
    var num = new Intl.NumberFormat(SHOP.locale);
    var one = new Intl.NumberFormat(SHOP.locale, { minimumFractionDigits: 1, maximumFractionDigits: 1 });
    [
      [one.format(SHOP.stats.rating), T.rating, true],
      [num.format(SHOP.stats.students), T.students],
      [num.format(SHOP.stats.reviews), T.reviews],
      [String(SHOP.courses.length), T.courses]
    ].forEach(function (st) {
      var li = el("li");
      var v = el("span", "stat-value", st[0]);
      if (st[2]) v.appendChild(el("span", "star", " ★"));
      li.appendChild(v);
      li.appendChild(el("span", "stat-label", st[1]));
      stats.appendChild(li);
    });
  }

  var start = new URLSearchParams(window.location.search).get("kat");
  var valid = SHOP.categories.some(function (k) { return k.id === start; });
  select(valid ? start : "", false);
})();
