(function () {
  // ── STYLES ────────────────────────────────────────────────────────────────
  const style = document.createElement('style');
  style.textContent = `
    /* NAV BAR */
    #kim-nav {
      position: fixed; top: 0; left: 0; right: 0; z-index: 1000;
      display: flex; align-items: center; justify-content: space-between;
      padding: 0 40px; height: 72px;
      background: rgba(13,13,13,0.95);
      backdrop-filter: blur(12px);
      border-bottom: 1px solid rgba(200,146,42,0.12);
    }

    #kim-nav-logo img { height: 44px; display: block; }

    /* HAMBURGER */
    #kim-nav-toggle {
      display: flex; flex-direction: column; justify-content: center;
      gap: 5px; width: 32px; height: 32px;
      background: none; border: none; cursor: pointer; padding: 0;
      z-index: 1002; position: relative;
    }
    #kim-nav-toggle span {
      display: block; width: 100%; height: 1.5px;
      background: rgba(245,237,216,0.7);
      transition: all 0.3s ease;
      transform-origin: center;
    }
    #kim-nav-toggle.open span:nth-child(1) { transform: translateY(6.5px) rotate(45deg); background: #C8922A; }
    #kim-nav-toggle.open span:nth-child(2) { opacity: 0; transform: scaleX(0); }
    #kim-nav-toggle.open span:nth-child(3) { transform: translateY(-6.5px) rotate(-45deg); background: #C8922A; }

    /* OVERLAY */
    #kim-nav-overlay {
      position: fixed; inset: 0; z-index: 1001;
      background: #0D0D0D;
      display: flex; flex-direction: column;
      opacity: 0; pointer-events: none;
      transition: opacity 0.35s ease;
      overflow-y: auto;
    }
    #kim-nav-overlay.open {
      opacity: 1; pointer-events: all;
    }

    .kim-overlay-inner {
      flex: 1;
      display: grid;
      grid-template-columns: 1fr 320px;
      gap: 0;
      max-width: 1100px;
      margin: 0 auto;
      width: 100%;
      padding: 120px 40px 60px;
      align-items: start;
    }

    /* LEFT — LINKS */
    .kim-nav-links { padding-right: 60px; border-right: 1px solid rgba(200,146,42,0.12); }

    .kim-nav-group { margin-bottom: 48px; }
    .kim-nav-group-label {
      font-family: 'DM Sans', sans-serif;
      font-size: 10px; font-weight: 500;
      letter-spacing: 0.3em; text-transform: uppercase;
      color: rgba(200,146,42,0.6);
      margin-bottom: 16px;
      display: flex; align-items: center; gap: 12px;
    }
    .kim-nav-group-label::after {
      content: ''; flex: 1; height: 1px;
      background: rgba(200,146,42,0.15);
    }

    .kim-nav-group a {
      display: block;
      font-family: 'Cormorant Garamond', serif;
      font-size: clamp(28px, 4vw, 42px);
      font-weight: 600; line-height: 1.15;
      color: rgba(245,237,216,0.55);
      text-decoration: none;
      padding: 6px 0;
      transition: color 0.2s, transform 0.2s;
      position: relative;
    }
    .kim-nav-group a em { font-style: italic; }
    .kim-nav-group a:hover { color: #F5EDD8; transform: translateX(6px); }
    .kim-nav-group a.active { color: #C8922A; }
    .kim-nav-group a::before {
      content: '✦';
      position: absolute; left: -20px;
      font-size: 10px; color: #C8922A;
      opacity: 0; transition: opacity 0.2s;
      top: 50%; transform: translateY(-50%);
    }
    .kim-nav-group a:hover::before { opacity: 1; }

    /* RIGHT — ASIDE */
    .kim-nav-aside { padding-left: 60px; padding-top: 8px; }

    .kim-aside-scripture {
      margin-bottom: 48px;
    }
    .kim-aside-scripture p {
      font-family: 'Cormorant Garamond', serif;
      font-size: 18px; font-style: italic; font-weight: 400;
      line-height: 1.7; color: rgba(245,237,216,0.35);
      margin-bottom: 10px;
    }
    .kim-aside-scripture span {
      font-size: 10px; font-weight: 500;
      letter-spacing: 0.2em; text-transform: uppercase;
      color: rgba(200,146,42,0.5);
    }

    .kim-aside-event {
      border: 1px solid rgba(200,146,42,0.2);
      padding: 24px;
      margin-bottom: 32px;
    }
    .kim-aside-event-label {
      font-size: 10px; font-weight: 500;
      letter-spacing: 0.2em; text-transform: uppercase;
      color: #C8922A; margin-bottom: 8px;
    }
    .kim-aside-event-title {
      font-family: 'Cormorant Garamond', serif;
      font-size: 20px; font-weight: 600;
      color: #F5EDD8; margin-bottom: 4px;
    }
    .kim-aside-event-date {
      font-size: 13px; font-weight: 300;
      color: rgba(245,237,216,0.4); margin-bottom: 16px;
      line-height: 1.5;
    }
    .kim-aside-event-btn {
      display: inline-block;
      padding: 10px 20px;
      background: #C8922A; color: #0D0D0D;
      font-family: 'DM Sans', sans-serif;
      font-size: 12px; font-weight: 500;
      letter-spacing: 0.1em; text-decoration: none;
      transition: background 0.2s;
    }
    .kim-aside-event-btn:hover { background: #E8B84B; }

    /* SOCIAL */
    .kim-overlay-footer {
      border-top: 1px solid rgba(200,146,42,0.1);
      padding: 24px 40px;
      display: flex; align-items: center;
      justify-content: space-between; flex-wrap: wrap; gap: 16px;
      max-width: 100%;
    }
    .kim-overlay-footer-left {
      font-family: 'Cormorant Garamond', serif;
      font-size: 15px; font-weight: 600;
      color: rgba(245,237,216,0.3);
      letter-spacing: 0.05em;
    }
    .kim-social-links { display: flex; gap: 20px; }
    .kim-social-links a {
      font-size: 12px; font-weight: 500;
      letter-spacing: 0.15em; text-transform: uppercase;
      color: rgba(245,237,216,0.3); text-decoration: none;
      transition: color 0.2s;
    }
    .kim-social-links a:hover { color: #C8922A; }

    /* BODY LOCK */
    body.kim-nav-open { overflow: hidden; }

    /* MOBILE */
    @media (max-width: 700px) {
      #kim-nav { padding: 0 20px; }
      .kim-overlay-inner {
        grid-template-columns: 1fr;
        padding: 100px 24px 40px;
      }
      .kim-nav-links { padding-right: 0; border-right: none; border-bottom: 1px solid rgba(200,146,42,0.12); padding-bottom: 40px; margin-bottom: 40px; }
      .kim-nav-aside { padding-left: 0; }
      .kim-overlay-footer { padding: 20px 24px; }
      .kim-nav-group a { font-size: clamp(24px, 6vw, 34px); }
    }
  `;
  document.head.appendChild(style);

  // ── CURRENT PAGE ──────────────────────────────────────────────────────────
  const path = window.location.pathname.replace(/\/$/, '') || '/';

  function isActive(href) {
    const h = href.replace(/\/$/, '') || '/';
    return path === h ? 'active' : '';
  }

  // ── HTML ──────────────────────────────────────────────────────────────────
  const nav = document.createElement('div');
  nav.innerHTML = `
    <!-- NAV BAR -->
    <nav id="kim-nav">
      <a id="kim-nav-logo" href="/"><img src="/kim-logo.png" alt="Kingdom Insights Ministries"></a>
      <button id="kim-nav-toggle" aria-label="Open menu" aria-expanded="false">
        <span></span><span></span><span></span>
      </button>
    </nav>

    <!-- FULL SCREEN OVERLAY -->
    <div id="kim-nav-overlay" role="dialog" aria-label="Site navigation">
      <div class="kim-overlay-inner">

        <!-- LEFT: LINKS -->
        <div class="kim-nav-links">

          <div class="kim-nav-group">
            <p class="kim-nav-group-label">Ministry</p>
            <a href="/" class="${isActive('/')}">Home</a>
            <a href="/thevision" class="${isActive('/thevision')}">The <em>Vision</em></a>
          </div>

          <div class="kim-nav-group">
            <p class="kim-nav-group-label">Events</p>
            <a href="/vision" class="${isActive('/vision')}">Vision Night</a>
            <a href="/builders" class="${isActive('/builders')}">Builders <em>Gathering</em></a>
          </div>

          <div class="kim-nav-group">
            <p class="kim-nav-group-label">Connect</p>
            <a href="/contact" class="${isActive('/contact')}">Contact <em>Us</em></a>
            <a href="/prayer" class="${isActive('/prayer')}">Prayer <em>Request</em></a>
            <a href="/register" class="${isActive('/register')}">Join the <em>Team</em></a>
          </div>

          <div class="kim-nav-group">
            <p class="kim-nav-group-label">Give</p>
            <a href="/generosity" class="${isActive('/generosity')}">Generosity</a>
            <a href="/give" class="${isActive('/give')}">Give <em>Now</em></a>
          </div>

        </div>

        <!-- RIGHT: ASIDE -->
        <div class="kim-nav-aside">

          <div class="kim-aside-scripture">
            <p>"As each one has received a gift, minister it to one another, as good stewards of the manifold grace of God."</p>
            <span>1 Peter 4:10</span>
          </div>

          <div class="kim-aside-event">
            <p class="kim-aside-event-label">Next Event</p>
            <p class="kim-aside-event-title">The Builders Gathering</p>
            <p class="kim-aside-event-date">Saturday, July 25, 2026<br>6:00 PM – 8:00 PM<br>Compass Center · Grapevine, TX</p>
            <a href="/builders" class="kim-aside-event-btn">Reserve My Seat</a>
          </div>

        </div>
      </div>

      <!-- OVERLAY FOOTER -->
      <div class="kim-overlay-footer">
        <span class="kim-overlay-footer-left">Kingdom Insights Ministries · kim.church</span>
        <div class="kim-social-links">
          <a href="https://www.youtube.com/@joshuaporo" target="_blank">YouTube</a>
          <a href="https://www.instagram.com/joshuaporo/" target="_blank">Instagram</a>
          <a href="https://www.facebook.com/JoshuaPoroII" target="_blank">Facebook</a>
          <a href="https://www.tiktok.com/@porojosh" target="_blank">TikTok</a>
        </div>
      </div>
    </div>
  `;
  document.body.prepend(nav);

  // ── LOGIC ─────────────────────────────────────────────────────────────────
  const toggle = document.getElementById('kim-nav-toggle');
  const overlay = document.getElementById('kim-nav-overlay');

  function openMenu() {
    toggle.classList.add('open');
    overlay.classList.add('open');
    document.body.classList.add('kim-nav-open');
    toggle.setAttribute('aria-expanded', 'true');
  }

  function closeMenu() {
    toggle.classList.remove('open');
    overlay.classList.remove('open');
    document.body.classList.remove('kim-nav-open');
    toggle.setAttribute('aria-expanded', 'false');
  }

  toggle.addEventListener('click', () => {
    overlay.classList.contains('open') ? closeMenu() : openMenu();
  });

  // Close on ESC
  document.addEventListener('keydown', e => { if (e.key === 'Escape') closeMenu(); });

  // Close when a nav link is clicked
  overlay.querySelectorAll('a').forEach(a => {
    a.addEventListener('click', closeMenu);
  });

  // Add top padding to body so content clears the fixed nav
  document.body.style.paddingTop = '72px';

})();
