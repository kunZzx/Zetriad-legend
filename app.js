document.addEventListener("DOMContentLoaded", () => {
  const { ip, port, contacts } = SERVER_CONFIG;

  // ==========================================
  // PROTEKSI ANTI-F12 / ANTI-INSPECT / ANTI-CURI ASSET
  // ==========================================
  document.addEventListener("contextmenu", (e) => e.preventDefault());
  document.addEventListener("dragstart", (e) => e.preventDefault());
  document.addEventListener("keydown", (e) => {
    const key = e.key.toUpperCase();
    const isF12 = e.key === "F12" || e.keyCode === 123;
    const isCtrlShift = (e.ctrlKey || e.metaKey) && e.shiftKey && ["I", "J", "C", "K"].includes(key);
    const isCtrlViewSource = (e.ctrlKey || e.metaKey) && ["U", "S"].includes(key);
    if (isF12 || isCtrlShift || isCtrlViewSource) {
      e.preventDefault();
      e.stopPropagation();
      return false;
    }
  });

  const yearEl = document.getElementById("currentYear");
  if (yearEl) yearEl.textContent = new Date().getFullYear();

  // ==========================================
  // FLOATING PARTICLES ANIMATION (MOBILE-SAFE 60FPS)
  // ==========================================
  const canvas = document.getElementById("particlesCanvas");
  const prefersReducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  if (canvas && !prefersReducedMotion) {
    const ctx = canvas.getContext("2d");
    const particles = [];
    const isMobile = window.innerWidth < 768;
    const count = isMobile ? 14 : 26;
    let animId = null;

    function resizeCanvas() {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
    }
    resizeCanvas();
    window.addEventListener("resize", resizeCanvas, { passive: true });

    for (let i = 0; i < count; i++) {
      particles.push({
        x: Math.random() * canvas.width,
        y: Math.random() * canvas.height,
        r: Math.random() * 1.6 + 0.6,
        vy: -(Math.random() * 0.3 + 0.12),
        vx: (Math.random() - 0.5) * 0.16,
        alpha: Math.random() * 0.38 + 0.12
      });
    }

    function drawParticles() {
      if (document.hidden) {
        animId = null;
        return;
      }
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      for (const p of particles) {
        p.x += p.vx;
        p.y += p.vy;
        if (p.y < -10) {
          p.y = canvas.height + 10;
          p.x = Math.random() * canvas.width;
        }
        if (p.x < -10) p.x = canvas.width + 10;
        if (p.x > canvas.width + 10) p.x = -10;

        ctx.beginPath();
        ctx.arc(p.x, p.y, p.r, 0, Math.PI * 2);
        ctx.fillStyle = `rgba(242, 184, 75, ${p.alpha})`;
        ctx.fill();
      }
      animId = requestAnimationFrame(drawParticles);
    }

    document.addEventListener("visibilitychange", () => {
      if (!document.hidden && !animId) {
        animId = requestAnimationFrame(drawParticles);
      }
    });

    animId = requestAnimationFrame(drawParticles);
  }

  // Toast helper
  const toastEl = document.getElementById("toast");
  let toastTimer = null;
  function showToast(message) {
    if (!toastEl) return;
    toastEl.textContent = message;
    toastEl.classList.remove("hidden");
    clearTimeout(toastTimer);
    toastTimer = setTimeout(() => toastEl.classList.add("hidden"), 2400);
  }

  // Copy to clipboard helper
  async function copyText(text, label) {
    try {
      await navigator.clipboard.writeText(text);
      showToast(`Berhasil disalin: ${label || text}`);
    } catch {
      const textarea = document.createElement("textarea");
      textarea.value = text;
      document.body.appendChild(textarea);
      textarea.select();
      document.execCommand("copy");
      document.body.removeChild(textarea);
      showToast(`Berhasil disalin: ${label || text}`);
    }
  }

  const navCopyIp = document.getElementById("navCopyIp");
  if (navCopyIp) {
    navCopyIp.addEventListener("click", () => copyText(`${ip}:${port}`));
  }

  // ==========================================
  // KERANJANG BELANJA (SHARED ACROSS PAGES)
  // ==========================================
  const CART_KEY = "zetriad_legend_cart";
  let cart = [];
  try {
    cart = JSON.parse(localStorage.getItem(CART_KEY) || "[]");
  } catch {
    cart = [];
  }

  const cartTrigger = document.getElementById("cartTrigger");
  const cartCountBadge = document.getElementById("cartCountBadge");
  const cartDrawer = document.getElementById("cartDrawer");
  const drawerBackdrop = document.getElementById("drawerBackdrop");
  const closeDrawerBtn = document.getElementById("closeDrawerBtn");
  const cartItemsContainer = document.getElementById("cartItemsContainer");
  const cartCheckoutForm = document.getElementById("cartCheckoutForm");
  const cartTotalDisplay = document.getElementById("cartTotalDisplay");
  const clearCartBtn = document.getElementById("clearCartBtn");
  const cartPlayerIgn = document.getElementById("cartPlayerIgn");
  const cartPlayerNote = document.getElementById("cartPlayerNote");

  // Floating Bottom Cart Bar elements (toko.html)
  const floatingCartBar = document.getElementById("floatingCartBar");
  const floatingCartCount = document.getElementById("floatingCartCount");
  const floatingCartTotal = document.getElementById("floatingCartTotal");
  const floatingCartOpenBtn = document.getElementById("floatingCartOpenBtn");

  function saveCart() {
    localStorage.setItem(CART_KEY, JSON.stringify(cart));
  }

  function parsePriceRange(priceStr) {
    if (/unlimited/i.test(priceStr)) return { min: 0, max: 0, hasUnlimited: true };
    const matches = priceStr.match(/\d+/g);
    if (!matches || matches.length === 0) return { min: 0, max: 0, hasUnlimited: false };
    const min = parseInt(matches[0], 10);
    const max = matches.length > 1 ? parseInt(matches[1], 10) : min;
    return { min, max, hasUnlimited: false };
  }

  function estimateCartTotal() {
    let minTotal = 0;
    let maxTotal = 0;
    let hasUnlimited = false;

    cart.forEach((entry) => {
      const { min, max, hasUnlimited: isUnl } = parsePriceRange(entry.price);
      if (isUnl) hasUnlimited = true;
      minTotal += min * entry.qty;
      maxTotal += max * entry.qty;
    });

    if (cart.length === 0) return "0K";
    let label = minTotal === maxTotal ? `${minTotal}K` : `${minTotal}K – ${maxTotal}K`;
    if (hasUnlimited) {
      label = minTotal > 0 ? `${label} + Unlimited` : "Unlimited";
    }
    return label;
  }

  function openDrawer() {
    if (!cartDrawer || !drawerBackdrop) return;
    cartDrawer.classList.add("open");
    drawerBackdrop.classList.add("open");
  }

  function closeDrawer() {
    if (!cartDrawer || !drawerBackdrop) return;
    cartDrawer.classList.remove("open");
    drawerBackdrop.classList.remove("open");
  }

  function renderCart() {
    const totalQty = cart.reduce((sum, item) => sum + item.qty, 0);
    const totalLabel = estimateCartTotal();

    if (cartCountBadge) cartCountBadge.textContent = totalQty;

    if (floatingCartBar) {
      floatingCartBar.classList.toggle("hidden", totalQty === 0);
      if (floatingCartCount) floatingCartCount.textContent = `${totalQty} Item di Keranjang`;
      if (floatingCartTotal) floatingCartTotal.textContent = totalLabel;
    }

    if (!cartItemsContainer || !cartCheckoutForm) return;

    if (cart.length === 0) {
      cartItemsContainer.innerHTML = `<div class="cart-empty">Keranjang masih kosong.<br/>Tambahkan item dari halaman Toko untuk membeli semuanya sekaligus.</div>`;
      cartCheckoutForm.classList.add("hidden");
      return;
    }

    cartCheckoutForm.classList.remove("hidden");
    cartItemsContainer.innerHTML = cart
      .map(
        (item) => `
        <div class="cart-item">
          <div class="cart-item-info">
            <span class="cart-item-cat">${item.category}</span>
            <strong class="cart-item-name">${item.name}</strong>
            <span class="cart-item-price">${item.price}</span>
          </div>
          <div class="qty-controls">
            <button type="button" class="qty-btn" data-action="dec" data-id="${item.id}" aria-label="Kurangi">−</button>
            <span class="qty-val">${item.qty}</span>
            <button type="button" class="qty-btn" data-action="inc" data-id="${item.id}" aria-label="Tambah">+</button>
          </div>
        </div>
      `
      )
      .join("");

    if (cartTotalDisplay) {
      cartTotalDisplay.textContent = totalLabel;
    }
  }

  function addToCart(category, name, price, silent = false) {
    const id = `${category}::${name}`;
    const existing = cart.find((item) => item.id === id);
    if (existing) {
      existing.qty += 1;
    } else {
      cart.push({ id, category, name, price, qty: 1 });
    }
    saveCart();
    renderCart();
    if (cartCountBadge) {
      cartCountBadge.classList.remove("pop");
      void cartCountBadge.offsetWidth;
      cartCountBadge.classList.add("pop");
    }
    if (!silent) showToast(`Ditambahkan ke keranjang: ${name}`);
  }

  if (cartTrigger) cartTrigger.addEventListener("click", openDrawer);
  if (floatingCartOpenBtn) floatingCartOpenBtn.addEventListener("click", openDrawer);
  if (closeDrawerBtn) closeDrawerBtn.addEventListener("click", closeDrawer);
  if (drawerBackdrop) drawerBackdrop.addEventListener("click", closeDrawer);
  document.addEventListener("keydown", (e) => {
    if (e.key === "Escape") closeDrawer();
  });

  if (cartItemsContainer) {
    cartItemsContainer.addEventListener("click", (e) => {
      const btn = e.target.closest(".qty-btn");
      if (!btn) return;
      const id = btn.dataset.id;
      const action = btn.dataset.action;
      const idx = cart.findIndex((i) => i.id === id);
      if (idx === -1) return;

      if (action === "inc") {
        cart[idx].qty += 1;
      } else if (action === "dec") {
        cart[idx].qty -= 1;
        if (cart[idx].qty <= 0) cart.splice(idx, 1);
      }
      saveCart();
      renderCart();
      if (typeof syncShopButtons === "function") syncShopButtons();
    });
  }

  if (clearCartBtn) {
    clearCartBtn.addEventListener("click", () => {
      cart = [];
      saveCart();
      renderCart();
      if (typeof syncShopButtons === "function") syncShopButtons();
      showToast("Keranjang dikosongkan");
    });
  }

  if (cartCheckoutForm) {
    cartCheckoutForm.addEventListener("submit", (e) => {
      e.preventDefault();
      if (cart.length === 0) return;

      const ign = cartPlayerIgn.value.trim();
      const note = cartPlayerNote.value.trim();
      const totalEst = estimateCartTotal();

      const itemLines = cart.map(
        (item, i) => `${i + 1}. *${item.name}* (${item.category}) x${item.qty} — ${item.price}`
      );

      const msgLines = [
        `Halo Owner *Zetriad Legend*, saya ingin membeli pesanan berikut:`,
        ``,
        ...itemLines,
        ``,
        `• Estimasi Total: *${totalEst}*`,
        `• Nickname MC (IGN): *${ign}*`
      ];
      if (note) msgLines.push(`• Catatan: ${note}`);
      msgLines.push(``, `Mohon info pembayarannya. Terima kasih!`);

      const waUrl = `https://wa.me/${contacts.ownerPhone}?text=${encodeURIComponent(msgLines.join("\n"))}`;
      window.open(waUrl, "_blank", "noopener,noreferrer");
    });
  }

  renderCart();

  // ==========================================
  // HALAMAN HOME (index.html)
  // ==========================================
  const serverIpDisplay = document.getElementById("serverIpDisplay");
  if (serverIpDisplay) {
    serverIpDisplay.textContent = ip;
    document.getElementById("serverPortDisplay").textContent = port;

    document.getElementById("linkWaGroup").href = contacts.whatsappGroup;
    document.getElementById("linkDiscord").href = contacts.discord;
    document.getElementById("ownerNumberDisplay").textContent = contacts.ownerDisplay;
    document.getElementById("linkOwnerWa").href = `https://wa.me/${contacts.ownerPhone}?text=${encodeURIComponent(
      "Halo Owner Zetriad Legend, saya ingin bertanya tentang server."
    )}`;

    document.querySelectorAll("[data-copy]").forEach((btn) => {
      btn.addEventListener("click", () => copyText(btn.getAttribute("data-copy")));
    });

    document.getElementById("btnCopyOwner").addEventListener("click", () => {
      copyText(contacts.ownerDisplay, `No. Owner (${contacts.ownerDisplay})`);
    });
  }

  // Check Minecraft Server Status (mcsrvstat.us)
  async function checkServerStatus() {
    const badgeText = document.getElementById("serverStatusText");
    const heroDot = document.getElementById("heroStatusDot");
    const navDot = document.getElementById("navStatusDot");

    try {
      const res = await fetch(`https://api.mcsrvstat.us/2/${ip}:${port}`);
      if (!res.ok) throw new Error("Status fetch failed");
      const data = await res.json();

      if (data.online) {
        const onlinePlayers = data.players?.online ?? 0;
        const maxPlayers = data.players?.max ?? "?";
        if (badgeText) badgeText.textContent = `Server Online • ${onlinePlayers}/${maxPlayers} Pemain`;
        if (heroDot) heroDot.classList.add("online");
        if (navDot) navDot.classList.add("online");
      } else {
        if (badgeText) badgeText.textContent = `Server Siap • ${ip}:${port}`;
        if (heroDot) heroDot.classList.add("offline");
        if (navDot) navDot.classList.add("offline");
      }
    } catch {
      if (badgeText) badgeText.textContent = `IP: ${ip} • Port: ${port}`;
    }
  }
  checkServerStatus();

  // ==========================================
  // HALAMAN TOKO (toko.html)
  // ==========================================
  const shopContainer = document.getElementById("shopContainer");
  if (!shopContainer) return;

  const CATEGORY_ICONS = {
    "paket-custom": `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M14.5 17.5L3 6V3h3l11.5 11.5"/><path d="M13 19l6-6"/><path d="M16 16l4 4"/><path d="M19 21l2-2"/></svg>`,
    "exclusive-addon": `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"/></svg>`,
    "armor-kontrak": `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/></svg>`,
    "max-skills": `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><polygon points="13 2 3 14 12 14 11 22 21 10 12 10 13 2"/></svg>`,
    "battle-pass": `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M6 9H4.5a2.5 2.5 0 0 1 0-5H6"/><path d="M18 9h1.5a2.5 2.5 0 0 0 0-5H18"/><path d="M4 22h16"/><path d="M10 14.66V17c0 .55-.47.98-.97 1.21C7.85 18.75 7 20.24 7 22"/><path d="M14 14.66V17c0 .55.47.98.97 1.21C16.15 18.75 17 20.24 17 22"/><path d="M18 2H6v7a6 6 0 0 0 12 0V2Z"/></svg>`,
    "book-kontrak": `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M4 19.5A2.5 2.5 0 0 1 6.5 17H20"/><path d="M6.5 2H20v20H6.5A2.5 2.5 0 0 1 4 19.5v-15A2.5 2.5 0 0 1 6.5 2z"/></svg>`,
    "sl-exclusive": `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="12" cy="12" r="10"/><path d="M12 2a14.5 14.5 0 0 0 0 20 14.5 14.5 0 0 0 0-20"/><path d="M2 12h20"/></svg>`,
    "ranks": `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M2 4l3 12h14l3-12-6 7-4-7-4 7-6-7zm3 16h14"/></svg>`,
    "armor-custom": `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M12 3l8 4.5v9L12 21l-8-4.5v-9L12 3z"/><path d="M12 12l8-4.5"/><path d="M12 12v9"/><path d="M12 12L4 7.5"/></svg>`
  };

  const filterPillsContainer = document.getElementById("filterPills");
  const searchInput = document.getElementById("shopSearch");
  const emptyState = document.getElementById("emptyState");
  const resetFilterBtn = document.getElementById("resetFilterBtn");

  let activeCategory = "all";
  let searchQuery = "";

  SHOP_CATEGORIES.forEach((cat) => {
    const btn = document.createElement("button");
    btn.className = "filter-pill";
    btn.dataset.category = cat.id;
    btn.textContent = `${cat.number}. ${cat.title}`;
    filterPillsContainer.appendChild(btn);
  });

  filterPillsContainer.addEventListener("click", (e) => {
    const pill = e.target.closest(".filter-pill");
    if (!pill) return;

    activeCategory = pill.dataset.category;
    filterPillsContainer.querySelectorAll(".filter-pill").forEach((p) => p.classList.remove("active"));
    pill.classList.add("active");
    renderShop();
  });

  searchInput.addEventListener("input", (e) => {
    searchQuery = e.target.value.trim().toLowerCase();
    renderShop();
  });

  resetFilterBtn.addEventListener("click", () => {
    activeCategory = "all";
    searchQuery = "";
    searchInput.value = "";
    filterPillsContainer.querySelectorAll(".filter-pill").forEach((p) => {
      p.classList.toggle("active", p.dataset.category === "all");
    });
    renderShop();
  });

  function itemMatchesSearch(item, cat, query) {
    if (!query) return true;
    const haystack = [
      cat.title,
      item.name,
      item.price,
      item.note || "",
      item.kit || "",
      ...(item.specs || []),
      ...(item.commands || [])
    ]
      .join(" ")
      .toLowerCase();
    return haystack.includes(query);
  }

  function getCartQty(categoryLabel, itemName) {
    const found = cart.find((i) => i.id === `${categoryLabel}::${itemName}`);
    return found ? found.qty : 0;
  }

  function syncShopButtons() {
    shopContainer.querySelectorAll(".btn-order").forEach((btn) => {
      const qty = getCartQty(btn.dataset.cat, btn.dataset.item);
      btn.classList.toggle("in-cart", qty > 0);
      btn.textContent = qty > 0 ? `✓ Di Keranjang (${qty})` : "+ Keranjang";
    });
  }

  const _XK = [0x5a, 0x45, 0x54, 0x52, 0x49, 0x41, 0x44, 0x99];
  const _spriteCache = new Map();

  function decodeVaultSprite(key, callback) {
    if (_spriteCache.has(key)) {
      callback(_spriteCache.get(key));
      return;
    }
    if (typeof _0xZET_VAULT === "undefined" || !_0xZET_VAULT[key]) return;
    try {
      const binStr = atob(_0xZET_VAULT[key]);
      const len = binStr.length;
      const bytes = new Uint8Array(len);
      for (let i = 0; i < len; i++) {
        bytes[i] = binStr.charCodeAt(i) ^ _XK[i % _XK.length];
      }
      const blob = new Blob([bytes], { type: "image/png" });
      const url = URL.createObjectURL(blob);
      const img = new Image();
      img.onload = () => {
        URL.revokeObjectURL(url);
        _spriteCache.set(key, img);
        callback(img);
      };
      img.src = url;
    } catch {
      // Fallback silently if corrupted
    }
  }

  function hydrateVaultCanvases() {
    shopContainer.querySelectorAll("canvas.ia-sprite-canvas[data-vk]").forEach((cvs) => {
      const key = cvs.getAttribute("data-vk");
      cvs.removeAttribute("data-vk");
      decodeVaultSprite(key, (img) => {
        const ctx = cvs.getContext("2d");
        ctx.clearRect(0, 0, cvs.width, cvs.height);
        ctx.imageSmoothingEnabled = false;
        const scale = Math.min((cvs.width - 8) / img.width, (cvs.height - 8) / img.height);
        const dw = Math.round(img.width * scale);
        const dh = Math.round(img.height * scale);
        const dx = Math.round((cvs.width - dw) / 2);
        const dy = Math.round((cvs.height - dh) / 2);
        ctx.drawImage(img, dx, dy, dw, dh);
      });
    });
  }

  const NO_TEXTURE_CATEGORIES = ["armor-kontrak", "max-skills", "armor-custom"];

  function getItemVisualHtml(item, cat) {
    if (NO_TEXTURE_CATEGORIES.includes(cat.id)) return "";
    let tag = cat.title.toUpperCase();
    const isRank = cat.id === "ranks";
    const artClass = isRank ? "item-visual-art rank-art" : "item-visual-art";
    const cw = isRank ? 180 : 128;
    const ch = isRank ? 72 : 128;
    const viewPill = `
      <span class="item-view-pill">
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2">
          <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"/>
          <circle cx="12" cy="12" r="3"/>
        </svg>
        View
      </span>`;

    if (typeof _0xZET_VAULT !== "undefined" && _0xZET_VAULT[item.name]) {
      return `
        <div class="item-visual-box" data-view-cat="${cat.id}" data-view-item="${item.name}" title="Klik untuk melihat detail item">
          ${viewPill}
          <div class="item-visual-grid"></div>
          <div class="${artClass}">
            <canvas class="ia-sprite-canvas" data-vk="${item.name}" width="${cw}" height="${ch}"></canvas>
          </div>
          <span class="item-type-tag">${tag}</span>
        </div>
      `;
    }

    // Jika user memasang gambar PNG manual (properti image di data.js)
    if (item.image) {
      return `
        <div class="item-visual-box" data-view-cat="${cat.id}" data-view-item="${item.name}" title="Klik untuk melihat detail item">
          ${viewPill}
          <div class="item-visual-grid"></div>
          <div class="${artClass}">
            <img src="${item.image}" alt="${item.name}" loading="lazy" />
          </div>
          <span class="item-type-tag">${tag}</span>
        </div>
      `;
    }

    const nameKey = item.name.toLowerCase();
    let svg = "";

    // 1. NUSANTARA — Keris / Pedang Luk Nusantara dengan sayap Garuda emas
    if (nameKey.includes("nusantara")) {
      tag = "MYTHIC KERIS SL";
      svg = `
        <svg viewBox="0 0 64 64" fill="none">
          <circle cx="32" cy="30" r="20" stroke="#f2b84b" stroke-opacity="0.25" stroke-dasharray="3 3"/>
          <!-- Wavy Keris Blade (Luk) -->
          <path d="M32 6 C28 13, 36 18, 30 25 C26 30, 36 35, 32 42 L28 42 C31 35, 23 30, 27 24 C32 18, 25 13, 32 6 Z" fill="url(#goldGrad)" stroke="#ffe49e" stroke-width="1.5"/>
          <!-- Ornate Garuda Crossguard (Ganja) -->
          <path d="M16 42 C22 39, 27 41, 32 42 C37 41, 42 39, 48 42 C44 46, 38 45, 32 46 C26 45, 20 46, 16 42 Z" fill="#f2b84b" stroke="#ffe49e" stroke-width="1.4"/>
          <!-- Hilt (Ukiran Hulu) -->
          <path d="M30 46 L34 46 L35 55 C35 57, 29 57, 29 55 Z" fill="#d49424" stroke="#ffe49e" stroke-width="1.3"/>
          <circle cx="32" cy="43.5" r="2.2" fill="#fff"/>
          <path d="M19 18 L22 21 M45 18 L42 21 M32 2 L32 4" stroke="#ffe49e" stroke-width="1.5" stroke-linecap="round"/>
          <defs>
            <linearGradient id="goldGrad" x1="32" y1="6" x2="32" y2="42" gradientUnits="userSpaceOnUse">
              <stop offset="0%" stop-color="#ffffff"/>
              <stop offset="55%" stop-color="#ffe49e"/>
              <stop offset="100%" stop-color="#d49424"/>
            </linearGradient>
          </defs>
        </svg>`;
    }
    // 2. VOIDGAUNTLET — Sarung Tangan Petarung Void dengan Cakar & Inti Energi
    else if (nameKey.includes("voidgauntlet")) {
      tag = "ABYSS GAUNTLET";
      svg = `
        <svg viewBox="0 0 64 64" fill="none">
          <circle cx="32" cy="32" r="21" stroke="#f2b84b" stroke-opacity="0.22" stroke-dasharray="2 4"/>
          <!-- Claws / Knuckles -->
          <path d="M20 22 L22 12 L25 20 M27 19 L29 9 L32 19 M34 19 L36 10 L39 20 M40 22 L44 14 L43 24" stroke="#ffe49e" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"/>
          <!-- Gauntlet Body -->
          <path d="M18 24 L46 24 L49 38 L42 52 L22 52 L15 38 Z" fill="#171b29" stroke="#f2b84b" stroke-width="2"/>
          <!-- Void Core -->
          <polygon points="32,26 39,34 32,42 25,34" fill="#f2b84b" stroke="#fff" stroke-width="1.3"/>
          <path d="M20 45 L44 45" stroke="#ffe49e" stroke-width="1.5"/>
        </svg>`;
    }
    // 3. GAUNTLETTIME / GAUNTLET OF TIMER — Sarung Tangan Jam Waktu (Chrono)
    else if (nameKey.includes("gauntlet")) {
      tag = "CHRONO GAUNTLET";
      svg = `
        <svg viewBox="0 0 64 64" fill="none">
          <circle cx="32" cy="32" r="22" stroke="#ffe49e" stroke-opacity="0.3" stroke-dasharray="4 3"/>
          <path d="M20 18 L44 18 L47 36 L41 52 L23 52 L17 36 Z" fill="#161a28" stroke="#f2b84b" stroke-width="1.8"/>
          <!-- Clock Face inside Gauntlet -->
          <circle cx="32" cy="34" r="10" fill="#0b0d14" stroke="#ffe49e" stroke-width="1.8"/>
          <path d="M32 28 V34 L36 37" stroke="#f2b84b" stroke-width="2" stroke-linecap="round"/>
          <path d="M22 14 H42 M24 10 H40" stroke="#ffe49e" stroke-width="1.6" stroke-linecap="round"/>
        </svg>`;
    }
    // 4. KURAYAGAMI / KURIYAGAMI — Dual Katana Bayangan & Bulan Sabit
    else if (nameKey.includes("kurayagami") || nameKey.includes("kuriyagami")) {
      tag = "SHADOW KATANA";
      svg = `
        <svg viewBox="0 0 64 64" fill="none">
          <!-- Crescent Moon Aura -->
          <path d="M44 14 A18 18 0 1 0 46 46 A14 14 0 1 1 44 14 Z" fill="#f2b84b" fill-opacity="0.22" stroke="#f2b84b" stroke-width="1.2"/>
          <!-- Crossed Katanas -->
          <path d="M12 52 L50 12" stroke="#ffffff" stroke-width="2.6" stroke-linecap="round"/>
          <path d="M18 40 L26 48" stroke="#f2b84b" stroke-width="2.4" stroke-linecap="round"/>
          <path d="M52 52 L14 12" stroke="#ffe49e" stroke-width="2.4" stroke-linecap="round"/>
          <path d="M38 48 L46 40" stroke="#f2b84b" stroke-width="2.4" stroke-linecap="round"/>
        </svg>`;
    }
    // 5. SAVIOR / SAVIOR THE LIGHT — Pedang Agung Bersayap Cahaya
    else if (nameKey.includes("savior")) {
      tag = "HOLY GREATSWORD";
      svg = `
        <svg viewBox="0 0 64 64" fill="none">
          <circle cx="32" cy="24" r="14" stroke="#ffe49e" stroke-opacity="0.35" stroke-width="1.4"/>
          <!-- Wings on Crossguard -->
          <path d="M32 38 C22 36, 14 30, 10 22 C14 33, 20 40, 32 42 C44 40, 50 33, 54 22 C50 30, 42 36, 32 38 Z" fill="#f2b84b" stroke="#ffe49e" stroke-width="1.3"/>
          <!-- Greatsword Blade -->
          <polygon points="32,7 36,38 32,42 28,38" fill="#ffffff" stroke="#ffe49e" stroke-width="1.4"/>
          <!-- Hilt & Pommel -->
          <path d="M32 42 V54" stroke="#f2b84b" stroke-width="3" stroke-linecap="round"/>
          <circle cx="32" cy="56" r="2.5" fill="#ffe49e"/>
        </svg>`;
    }
    // 6. DEATHREALM — Sabit Malaikat Maut (Grim Scythe)
    else if (nameKey.includes("deathrealm")) {
      tag = "REAPER SCYTHE";
      svg = `
        <svg viewBox="0 0 64 64" fill="none">
          <!-- Scythe Pole -->
          <path d="M16 54 L44 12" stroke="#f2b84b" stroke-width="2.6" stroke-linecap="round"/>
          <!-- Crescent Scythe Blade -->
          <path d="M42 12 C26 10, 14 18, 12 30 C20 22, 30 20, 40 22 Z" fill="#ffe49e" stroke="#ffffff" stroke-width="1.4"/>
          <circle cx="42" cy="15" r="2.5" fill="#140f02" stroke="#ffe49e" stroke-width="1.4"/>
        </svg>`;
    }
    // 7. DEATHFURY — Kapak Kembar Berserker (Twin Battleaxe)
    else if (nameKey.includes("deathfury")) {
      tag = "FURY BATTLEAXE";
      svg = `
        <svg viewBox="0 0 64 64" fill="none">
          <path d="M32 10 V54" stroke="#f2b84b" stroke-width="3" stroke-linecap="round"/>
          <!-- Double Axe Blades -->
          <path d="M30 16 C18 12, 12 20, 14 30 C18 36, 24 34, 30 30 Z" fill="#ffe49e" stroke="#f2b84b" stroke-width="1.5"/>
          <path d="M34 16 C46 12, 52 20, 50 30 C46 36, 40 34, 34 30 Z" fill="#ffe49e" stroke="#f2b84b" stroke-width="1.5"/>
          <polygon points="32,7 35,14 29,14" fill="#ffffff"/>
        </svg>`;
    }
    // 8. ARMOR KONTRAK & ARMOR CUSTOM — Chestplate RPG Bertingkat
    else if (cat.id === "armor-kontrak" || cat.id === "armor-custom") {
      tag = cat.id === "armor-custom" ? "CUSTOM FORGE ARMOR" : "CONTRACT ARMOR";
      const hasWings = nameKey.includes("noctyra") || nameKey.includes("aurora") || nameKey.includes("termahal");
      svg = `
        <svg viewBox="0 0 64 64" fill="none">
          ${hasWings ? `<path d="M12 20 L6 12 L10 30 M52 20 L58 12 L54 30" stroke="#ffe49e" stroke-width="1.8" stroke-linecap="round"/>` : ""}
          <!-- Pauldrons & Chestplate -->
          <path d="M14 18 L24 14 L32 19 L40 14 L50 18 L54 28 L46 32 L44 52 L32 56 L20 52 L18 32 L10 28 Z" fill="#161a28" stroke="#f2b84b" stroke-width="2" stroke-linejoin="round"/>
          <!-- Chest Emblem -->
          <polygon points="32,24 38,32 32,44 26,32" fill="#f2b84b" stroke="#ffe49e" stroke-width="1.2"/>
          <path d="M22 48 L32 51 L42 48" stroke="#ffe49e" stroke-width="1.4"/>
        </svg>`;
    }
    // 9. BOOK KONTRAK — Grimoire / Buku Sihir Segel Emas
    else if (cat.id === "book-kontrak") {
      tag = nameKey.includes("zetriad") ? "SUPREME GRIMOIRE" : "CONTRACT TOME";
      const isTop = nameKey.includes("zetriad") || nameKey.includes("glory");
      svg = `
        <svg viewBox="0 0 64 64" fill="none">
          ${isTop ? `<circle cx="32" cy="32" r="23" stroke="#ffe49e" stroke-opacity="0.35" stroke-dasharray="3 3"/>` : ""}
          <!-- Book Cover -->
          <rect x="16" y="10" width="32" height="44" rx="4" fill="#161a28" stroke="#f2b84b" stroke-width="2"/>
          <path d="M21 10 V54" stroke="#ffe49e" stroke-width="1.6"/>
          <!-- Seal Emblem on Cover -->
          <circle cx="34" cy="30" r="8" stroke="#ffe49e" stroke-width="1.5"/>
          <polygon points="34,23 37,30 34,37 31,30" fill="#f2b84b"/>
          <path d="M28 44 H40" stroke="#f2b84b" stroke-width="1.6" stroke-linecap="round"/>
        </svg>`;
    }
    // 10. RANKS — Mahkota & Crest Kekuasaan
    else if (cat.id === "ranks") {
      tag = `RANK ${item.name.toUpperCase()}`;
      svg = `
        <svg viewBox="0 0 64 64" fill="none">
          <circle cx="32" cy="32" r="22" stroke="#f2b84b" stroke-opacity="0.22"/>
          <path d="M12 44 L16 20 L26 30 L32 16 L38 30 L48 20 L52 44 Z" fill="#171b29" stroke="#ffe49e" stroke-width="2" stroke-linejoin="round"/>
          <rect x="14" y="46" width="36" height="5" rx="2" fill="#f2b84b"/>
          <circle cx="32" cy="14" r="2.5" fill="#ffffff"/>
          <circle cx="16" cy="18" r="2" fill="#ffe49e"/>
          <circle cx="48" cy="18" r="2" fill="#ffe49e"/>
        </svg>`;
    }
    // 11. PAKET CUSTOM — Arsenal Pedang & Relik Skill
    else if (cat.id === "paket-custom") {
      tag = item.featured ? "BEST LOADOUT" : "CUSTOM BUILD";
      svg = `
        <svg viewBox="0 0 64 64" fill="none">
          <circle cx="32" cy="32" r="21" stroke="#f2b84b" stroke-opacity="0.25" stroke-dasharray="4 3"/>
          <!-- Crossed Swords -->
          <path d="M14 50 L48 14 M42 14 H48 V20" stroke="#ffe49e" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round"/>
          <path d="M50 50 L16 14 M22 14 H16 V20" stroke="#f2b84b" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round"/>
          <!-- Center Skill Core -->
          <polygon points="32,20 40,32 32,44 24,32" fill="#161a28" stroke="#ffffff" stroke-width="1.6"/>
          <circle cx="32" cy="32" r="4" fill="#f2b84b"/>
        </svg>`;
    }
    // 12. DEFAULT (Max Skills, Battle Pass, Lainnya)
    else {
      svg = `
        <svg viewBox="0 0 64 64" fill="none">
          <polygon points="32,8 48,24 32,56 16,24" fill="#161a28" stroke="#ffe49e" stroke-width="2"/>
          <polygon points="32,14 42,24 32,48 22,24" fill="#f2b84b" fill-opacity="0.35"/>
          <circle cx="32" cy="26" r="4" fill="#ffffff"/>
        </svg>`;
    }

    return `
      <div class="item-visual-box">
        <div class="item-visual-grid"></div>
        <div class="item-visual-art">${svg}</div>
        <span class="item-type-tag">${tag}</span>
      </div>
    `;
  }

  function buildSpecsHtml(specs) {
    if (!specs || specs.length === 0) return "";
    // Parse Paket Custom 3-stat structure (Skill, Physical, CD SL)
    const skillRaw = specs[0] || "";
    const hasUnlockFanny = /fanny/i.test(skillRaw);
    const skillCount = skillRaw.split("+")[0].trim();
    const physicalVal = (specs[1] || "").replace(/physical\s*/i, "");
    const cdVal = (specs[2] || "").replace(/cd\s*sl\s*/i, "");

    const fannyBadge = hasUnlockFanny
      ? `<div class="extra-spec-pill">★ Bonus: Unlock Fanny</div>`
      : "";

    return `
      <div class="stat-meters">
        <div class="stat-box">
          <span class="stat-label">SLOT SKILL</span>
          <span class="stat-val">${skillCount}</span>
        </div>
        <div class="stat-box">
          <span class="stat-label">PHYSICAL</span>
          <span class="stat-val">${physicalVal}</span>
        </div>
        <div class="stat-box">
          <span class="stat-label">CD SL</span>
          <span class="stat-val">${cdVal}s</span>
        </div>
      </div>
      ${fannyBadge}
    `;
  }

  function buildRankHtml(item) {
    if (!item.commands) return "";
    const sethomeCmd = item.commands.find((c) => c.includes("sethome")) || "/sethome";
    const otherCmds = item.commands.filter((c) => !c.includes("sethome"));

    return `
      <div class="rank-meta-bar">
        <span class="rank-sethome">🏠 ${sethomeCmd}</span>
        ${item.kit ? `<span class="kit-badge">⚔️ ${item.kit}</span>` : ""}
      </div>
      <div class="commands-wrap">
        ${otherCmds.map((cmd) => `<span class="cmd-chip">${cmd}</span>`).join("")}
      </div>
    `;
  }

  function observeReveals() {
    const reveals = document.querySelectorAll(".reveal");
    if (!("IntersectionObserver" in window)) {
      reveals.forEach((el) => el.classList.add("is-visible"));
      return;
    }
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            const cards = entry.target.querySelectorAll(".item-card");
            cards.forEach((card, idx) => {
              card.style.transitionDelay = `${Math.min(idx * 35, 210)}ms`;
            });
            entry.target.classList.add("is-visible");
            setTimeout(() => {
              cards.forEach((card) => {
                card.style.transitionDelay = "0ms";
              });
            }, 650);
            observer.unobserve(entry.target);
          }
        });
      },
      { threshold: 0.04 }
    );
    reveals.forEach((el) => observer.observe(el));
  }

  function renderShop() {
    shopContainer.innerHTML = "";
    let totalRendered = 0;

    SHOP_CATEGORIES.forEach((cat) => {
      if (activeCategory !== "all" && activeCategory !== cat.id) return;

      const filteredItems = cat.items.filter((item) => itemMatchesSearch(item, cat, searchQuery));
      if (filteredItems.length === 0) return;

      totalRendered += filteredItems.length;

      const section = document.createElement("div");
      section.className = "category-block reveal";
      section.id = `cat-${cat.id}`;

      const bannerHtml = cat.priceBanner
        ? `<span class="category-banner">${cat.priceBanner}</span>`
        : "";

      const infoBoxHtml = cat.infoBox
        ? `<div class="category-info-box">
             <strong>${cat.infoBox.title}</strong>
             <ul>${cat.infoBox.lines.map((line) => `<li>• ${line}</li>`).join("")}</ul>
           </div>`
        : "";

      const gridClass = cat.isRankGrid ? "items-grid rank-grid" : "items-grid";
      const catLabel = `${cat.number}. ${cat.title}`;
      const iconSvg = CATEGORY_ICONS[cat.id] || CATEGORY_ICONS["paket-custom"];

      const cardsHtml = filteredItems
        .map((item) => {
          const featuredClass = item.featured ? "featured" : "";
          const featuredRibbon = item.featured
            ? `<span class="featured-ribbon">★ REKOMENDASI</span>`
            : "";
          const qty = getCartQty(catLabel, item.name);

          const visualHtml = getItemVisualHtml(item, cat);
          const specsHtml = buildSpecsHtml(item.specs);
          const rankHtml = buildRankHtml(item);

          const noteHtml = item.note
            ? `<p class="item-note ${item.highlightNote ? "highlight" : ""}">${item.note}</p>`
            : "";

          return `
            <article class="item-card ${featuredClass}">
              <div>
                ${featuredRibbon}
                ${visualHtml}
                <div class="item-top">
                  <h3 class="item-name">[ ${item.name} ]</h3>
                  <span class="price-tag">${item.price}</span>
                </div>
                ${specsHtml}
                ${rankHtml}
                ${noteHtml}
              </div>
              <div class="card-actions">
                <button
                  class="btn-order ${qty > 0 ? "in-cart" : ""}"
                  data-cat="${catLabel}"
                  data-item="${item.name}"
                  data-price="${item.price}"
                >
                  ${qty > 0 ? `✓ Di Keranjang (${qty})` : "+ Keranjang"}
                </button>
                <button
                  class="btn-quick-buy"
                  data-cat="${catLabel}"
                  data-item="${item.name}"
                  data-price="${item.price}"
                  title="Langsung beli item ini"
                >
                  Beli
                </button>
              </div>
            </article>
          `;
        })
        .join("");

      section.innerHTML = `
        <div class="category-head">
          <div class="category-title-wrap">
            <div class="category-emblem">${iconSvg}</div>
            <div>
              <span class="category-num">KATEGORI ${cat.number}</span>
              <h2 class="category-title">${cat.title}</h2>
              <p class="category-subtitle">${cat.subtitle}</p>
            </div>
          </div>
          ${bannerHtml}
        </div>
        ${infoBoxHtml}
        <div class="${gridClass}">
          ${cardsHtml}
        </div>
      `;

      shopContainer.appendChild(section);
    });

    emptyState.classList.toggle("hidden", totalRendered > 0);
    hydrateVaultCanvases();
    observeReveals();
  }

  // ==========================================
  // INTERACTIVE 3D ITEM VIEW / INSPECT MODAL (360° EXTRUDED 3D)
  // ==========================================
  const itemViewModal = document.getElementById("itemViewModal");
  const closeViewModalBtn = document.getElementById("closeViewModalBtn");
  const viewStage = document.getElementById("viewStage");
  const viewCanvasHolder = document.getElementById("viewCanvasHolder");
  const viewModalCategory = document.getElementById("viewModalCategory");
  const viewModalTitle = document.getElementById("viewModalTitle");
  const viewModalPrice = document.getElementById("viewModalPrice");
  const viewModalBody = document.getElementById("viewModalBody");
  const viewModalAddBtn = document.getElementById("viewModalAddBtn");
  const viewModalBuyBtn = document.getElementById("viewModalBuyBtn");
  const prevItemBtn = document.getElementById("prevItemBtn");
  const nextItemBtn = document.getElementById("nextItemBtn");
  const toggleAutoSpinBtn = document.getElementById("toggleAutoSpinBtn");

  // Build 14-layer 3D extruded canvas stack inside viewCanvasHolder
  const LAYER_COUNT = 14;
  const DEPTH_SPREAD = 13; // px thickness in 3D space
  const layerCanvases = [];
  if (viewCanvasHolder) {
    viewCanvasHolder.innerHTML = "";
    for (let i = 0; i < LAYER_COUNT; i++) {
      const c = document.createElement("canvas");
      c.width = 240;
      c.height = 240;
      const isOuter = i === 0 || i === LAYER_COUNT - 1;
      c.className = `view-3d-layer ${isOuter ? "front-slice" : "edge-slice"}`;
      const zOffset = ((i / (LAYER_COUNT - 1)) - 0.5) * DEPTH_SPREAD;
      c.style.transform = `translateZ(${zOffset.toFixed(2)}px)`;
      viewCanvasHolder.appendChild(c);
      layerCanvases.push(c);
    }
  }

  // Flatten items with textures for Prev/Next navigation
  const flatItemsList = [];
  SHOP_CATEGORIES.forEach((cat) => {
    if (NO_TEXTURE_CATEGORIES.includes(cat.id)) return;
    cat.items.forEach((item) => {
      flatItemsList.push({ cat, item });
    });
  });

  let currentViewIndex = -1;
  let currentZoom = 1;
  let rotX = -8;
  let rotY = -22;
  let autoSpin3D = true;
  let isDragging3D = false;
  let dragStartX = 0;
  let dragStartY = 0;
  let spinRafId = null;

  function applyViewTransform() {
    if (!viewCanvasHolder) return;
    viewCanvasHolder.style.transform = `scale(${currentZoom}) rotateX(${rotX.toFixed(1)}deg) rotateY(${rotY.toFixed(1)}deg)`;
  }

  function runSpinLoop() {
    if (!itemViewModal || itemViewModal.classList.contains("hidden")) {
      spinRafId = null;
      return;
    }
    if (autoSpin3D && !isDragging3D) {
      rotY = (rotY + 0.75) % 360;
      applyViewTransform();
    }
    spinRafId = requestAnimationFrame(runSpinLoop);
  }

  function setZoomLevel(z) {
    currentZoom = Math.max(0.85, Math.min(2.2, z));
    if (itemViewModal) {
      itemViewModal.querySelectorAll("[data-zoom]").forEach((btn) => {
        btn.classList.toggle("active", Math.abs(parseFloat(btn.dataset.zoom) - currentZoom) < 0.15);
      });
    }
    applyViewTransform();
  }

  function openItemView(catId, itemName) {
    const idx = flatItemsList.findIndex((entry) => entry.cat.id === catId && entry.item.name === itemName);
    if (idx === -1) return;
    renderItemViewByIndex(idx);
    if (itemViewModal) itemViewModal.classList.remove("hidden");
    if (!spinRafId) spinRafId = requestAnimationFrame(runSpinLoop);
  }

  function closeItemView() {
    if (itemViewModal) itemViewModal.classList.add("hidden");
  }

  function renderItemViewByIndex(idx) {
    currentViewIndex = (idx + flatItemsList.length) % flatItemsList.length;
    const { cat, item } = flatItemsList[currentViewIndex];
    const catLabel = `${cat.number}. ${cat.title}`;

    rotX = -8;
    rotY = -22;
    setZoomLevel(1);

    if (viewModalCategory) viewModalCategory.textContent = `KATEGORI ${cat.number} • ${cat.title.toUpperCase()}`;
    if (viewModalTitle) viewModalTitle.textContent = `[ ${item.name} ]`;
    if (viewModalPrice) viewModalPrice.textContent = item.price;

    const specsHtml = buildSpecsHtml(item.specs);
    const rankHtml = buildRankHtml(item);
    const noteHtml = item.note
      ? `<p class="item-note ${item.highlightNote ? "highlight" : ""}">${item.note}</p>`
      : "";
    const catSubHtml = `<p class="muted" style="font-size:0.75rem;margin-top:8px;">${cat.subtitle}</p>`;

    if (viewModalBody) {
      viewModalBody.innerHTML = `${specsHtml}${rankHtml}${noteHtml}${catSubHtml}`;
    }

    const qty = getCartQty(catLabel, item.name);
    if (viewModalAddBtn) {
      viewModalAddBtn.classList.toggle("in-cart", qty > 0);
      viewModalAddBtn.textContent = qty > 0 ? `✓ Di Keranjang (${qty})` : "+ Keranjang";
    }

    // Draw sprite onto all 14 3D extruded layer canvases
    layerCanvases.forEach((c) => {
      const ctx = c.getContext("2d");
      ctx.clearRect(0, 0, c.width, c.height);
    });

    decodeVaultSprite(item.name, (img) => {
      layerCanvases.forEach((c) => {
        const ctx = c.getContext("2d");
        ctx.clearRect(0, 0, c.width, c.height);
        ctx.imageSmoothingEnabled = false;
        const pad = 14;
        const scale = Math.min((c.width - pad * 2) / img.width, (c.height - pad * 2) / img.height);
        const dw = Math.round(img.width * scale);
        const dh = Math.round(img.height * scale);
        const dx = Math.round((c.width - dw) / 2);
        const dy = Math.round((c.height - dh) / 2);
        ctx.drawImage(img, dx, dy, dw, dh);
      });
    });
  }

  if (toggleAutoSpinBtn) {
    toggleAutoSpinBtn.addEventListener("click", () => {
      autoSpin3D = !autoSpin3D;
      toggleAutoSpinBtn.classList.toggle("active", autoSpin3D);
    });
  }

  if (closeViewModalBtn) closeViewModalBtn.addEventListener("click", closeItemView);
  if (itemViewModal) {
    itemViewModal.addEventListener("click", (e) => {
      if (e.target === itemViewModal) closeItemView();
      const zBtn = e.target.closest("[data-zoom]");
      if (zBtn) setZoomLevel(parseFloat(zBtn.dataset.zoom));
    });
  }

  if (prevItemBtn) prevItemBtn.addEventListener("click", () => renderItemViewByIndex(currentViewIndex - 1));
  if (nextItemBtn) nextItemBtn.addEventListener("click", () => renderItemViewByIndex(currentViewIndex + 1));

  if (viewModalAddBtn) {
    viewModalAddBtn.addEventListener("click", () => {
      if (currentViewIndex < 0) return;
      const { cat, item } = flatItemsList[currentViewIndex];
      const catLabel = `${cat.number}. ${cat.title}`;
      addToCart(catLabel, item.name, item.price);
      syncShopButtons();
      const qty = getCartQty(catLabel, item.name);
      viewModalAddBtn.classList.add("in-cart");
      viewModalAddBtn.textContent = `✓ Di Keranjang (${qty})`;
    });
  }

  if (viewModalBuyBtn) {
    viewModalBuyBtn.addEventListener("click", () => {
      if (currentViewIndex < 0) return;
      const { cat, item } = flatItemsList[currentViewIndex];
      const catLabel = `${cat.number}. ${cat.title}`;
      if (getCartQty(catLabel, item.name) === 0) {
        addToCart(catLabel, item.name, item.price, true);
        syncShopButtons();
      }
      closeItemView();
      openDrawer();
      if (cartPlayerIgn) cartPlayerIgn.focus();
    });
  }

  // Interactive 360° 3D Drag Rotation on Mouse & Touch + Wheel Zoom
  if (viewStage) {
    viewStage.addEventListener("mousedown", (e) => {
      isDragging3D = true;
      dragStartX = e.clientX;
      dragStartY = e.clientY;
    });

    window.addEventListener("mousemove", (e) => {
      if (!isDragging3D) return;
      const dx = e.clientX - dragStartX;
      const dy = e.clientY - dragStartY;
      dragStartX = e.clientX;
      dragStartY = e.clientY;
      rotY += dx * 0.85;
      rotX = Math.max(-65, Math.min(65, rotX - dy * 0.65));
      applyViewTransform();
    });

    window.addEventListener("mouseup", () => {
      isDragging3D = false;
    });

    viewStage.addEventListener(
      "touchstart",
      (e) => {
        if (!e.touches[0]) return;
        isDragging3D = true;
        dragStartX = e.touches[0].clientX;
        dragStartY = e.touches[0].clientY;
      },
      { passive: true }
    );

    viewStage.addEventListener(
      "touchmove",
      (e) => {
        if (!isDragging3D || !e.touches[0]) return;
        const dx = e.touches[0].clientX - dragStartX;
        const dy = e.touches[0].clientY - dragStartY;
        dragStartX = e.touches[0].clientX;
        dragStartY = e.touches[0].clientY;
        rotY += dx * 0.85;
        rotX = Math.max(-65, Math.min(65, rotX - dy * 0.65));
        applyViewTransform();
      },
      { passive: true }
    );

    viewStage.addEventListener("touchend", () => {
      isDragging3D = false;
    });

    viewStage.addEventListener(
      "wheel",
      (e) => {
        e.preventDefault();
        const delta = e.deltaY < 0 ? 0.18 : -0.18;
        setZoomLevel(currentZoom + delta);
      },
      { passive: false }
    );
  }

  document.addEventListener("keydown", (e) => {
    if (!itemViewModal || itemViewModal.classList.contains("hidden")) return;
    if (e.key === "Escape") closeItemView();
    if (e.key === "ArrowLeft") renderItemViewByIndex(currentViewIndex - 1);
    if (e.key === "ArrowRight") renderItemViewByIndex(currentViewIndex + 1);
  });

  shopContainer.addEventListener("click", (e) => {
    const viewBox = e.target.closest(".item-visual-box[data-view-item]");
    if (viewBox) {
      openItemView(viewBox.dataset.viewCat, viewBox.dataset.viewItem);
      return;
    }

    const addBtn = e.target.closest(".btn-order");
    if (addBtn) {
      addToCart(addBtn.dataset.cat, addBtn.dataset.item, addBtn.dataset.price);
      syncShopButtons();
      return;
    }

    const quickBtn = e.target.closest(".btn-quick-buy");
    if (quickBtn) {
      const qty = getCartQty(quickBtn.dataset.cat, quickBtn.dataset.item);
      if (qty === 0) {
        addToCart(quickBtn.dataset.cat, quickBtn.dataset.item, quickBtn.dataset.price, true);
        syncShopButtons();
      }
      openDrawer();
      if (cartPlayerIgn) cartPlayerIgn.focus();
    }
  });

  renderShop();
});
