/**
 * Ethio 21 Technologies & Digital Solutions - Flagship 2026 Engine
 * Pure Telegram Direct Interaction Engine (Zero Backend Required)
 */

document.addEventListener('DOMContentLoaded', () => {
  // ==========================================
  // 1. STATE & CONSTANTS
  // ==========================================
  const state = {
    lang: localStorage.getItem('ethio21_lang') || 'en',
    theme: localStorage.getItem('ethio21_theme') || 'dark',
    audioEnabled: localStorage.getItem('ethio21_audio') === 'true',
    currency: 'USD',
    exchangeRateETB: 125.0,
    telegramHandle: 'ethio21_tech',
    telegramChannel: 'ethio21_technologies',
    telegramGroup: 'ethio21_technologies_Discussion',
    telegramGroupUrl: 'https://t.me/+BhaIySnd9KVhMGNk',
    directEmail: 'ashenafitobe@gmail.com'
  };

  function openTelegram(messageText = '', isGroup = false) {
    playUiSound('success');
    const target = isGroup ? state.telegramGroup : state.telegramHandle;
    let url = `https://t.me/${target}`;
    if (messageText && !isGroup) {
      url += `?text=${encodeURIComponent(messageText)}`;
    }
    window.open(url, '_blank');
  }

  // ==========================================
  // 2. SYNTHESIZER AUDIO MICRO-INTERACTIONS
  // ==========================================
  let audioCtx = null;

  function initAudio() {
    if (!audioCtx && typeof window.AudioContext !== 'undefined') {
      audioCtx = new (window.AudioContext || window.webkitAudioContext)();
    }
  }

  function playUiSound(type = 'click') {
    if (!state.audioEnabled) return;
    try {
      initAudio();
      if (!audioCtx) return;
      if (audioCtx.state === 'suspended') {
        audioCtx.resume();
      }

      const osc = audioCtx.createOscillator();
      const gain = audioCtx.createGain();
      osc.connect(gain);
      gain.connect(audioCtx.destination);

      const now = audioCtx.currentTime;

      if (type === 'click') {
        osc.type = 'sine';
        osc.frequency.setValueAtTime(520, now);
        osc.frequency.exponentialRampToValueAtTime(880, now + 0.05);
        gain.gain.setValueAtTime(0.1, now);
        gain.gain.exponentialRampToValueAtTime(0.001, now + 0.05);
        osc.start(now);
        osc.stop(now + 0.06);
      } else if (type === 'toggle') {
        osc.type = 'triangle';
        osc.frequency.setValueAtTime(320, now);
        osc.frequency.exponentialRampToValueAtTime(640, now + 0.07);
        gain.gain.setValueAtTime(0.08, now);
        gain.gain.exponentialRampToValueAtTime(0.001, now + 0.07);
        osc.start(now);
        osc.stop(now + 0.08);
      } else if (type === 'success') {
        osc.type = 'sine';
        osc.frequency.setValueAtTime(523, now);
        osc.frequency.setValueAtTime(659, now + 0.08);
        osc.frequency.setValueAtTime(784, now + 0.16);
        gain.gain.setValueAtTime(0.12, now);
        gain.gain.exponentialRampToValueAtTime(0.001, now + 0.35);
        osc.start(now);
        osc.stop(now + 0.36);
      }
    } catch (e) {
      console.warn("Audio feedback error:", e);
    }
  }

  // Audio Toggle UI
  const audioToggleBtn = document.getElementById('audio-toggle-btn');
  const audioIcon = document.getElementById('audio-icon');

  function updateAudioUi() {
    if (audioIcon) {
      if (state.audioEnabled) {
        audioIcon.innerHTML = `<path d="M11 5L6 9H2v6h4l5 4V5z"></path><path d="M19.07 4.93a10 10 0 0 1 0 14.14M15.54 8.46a5 5 0 0 1 0 7.07"></path>`;
      } else {
        audioIcon.innerHTML = `<path d="M11 5L6 9H2v6h4l5 4V5z"></path><line x1="23" y1="9" x2="17" y2="15"></line><line x1="17" y1="9" x2="23" y2="15"></line>`;
      }
    }
  }

  if (audioToggleBtn) {
    audioToggleBtn.addEventListener('click', () => {
      state.audioEnabled = !state.audioEnabled;
      localStorage.setItem('ethio21_audio', state.audioEnabled);
      updateAudioUi();
      if (state.audioEnabled) playUiSound('toggle');
    });
    updateAudioUi();
  }

  // ==========================================
  // 3. THEME CONTROLLER
  // ==========================================
  const themeToggleBtn = document.getElementById('theme-toggle-btn');
  const themeIcon = document.getElementById('theme-icon');

  function applyTheme(theme) {
    document.documentElement.setAttribute('data-theme', theme);
    state.theme = theme;
    localStorage.setItem('ethio21_theme', theme);

    if (themeIcon) {
      if (theme === 'light') {
        themeIcon.innerHTML = `<circle cx="12" cy="12" r="5"></circle><line x1="12" y1="1" x2="12" y2="3"></line><line x1="12" y1="21" x2="12" y2="23"></line><line x1="4.22" y1="4.22" x2="5.64" y2="5.64"></line><line x1="18.36" y1="18.36" x2="19.78" y2="19.78"></line><line x1="1" y1="12" x2="3" y2="12"></line><line x1="21" y1="12" x2="23" y2="12"></line><line x1="4.22" y1="19.78" x2="5.64" y2="18.36"></line><line x1="18.36" y1="5.64" x2="19.78" y2="4.22"></line>`;
      } else {
        themeIcon.innerHTML = `<path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z"></path>`;
      }
    }
  }

  if (themeToggleBtn) {
    themeToggleBtn.addEventListener('click', () => {
      const nextTheme = state.theme === 'dark' ? 'light' : 'dark';
      applyTheme(nextTheme);
      playUiSound('toggle');
    });
  }
  applyTheme(state.theme);

  // ==========================================
  // 4. BILINGUAL LOCALIZATION ENGINE (EN / AM)
  // ==========================================
  const langToggleBtns = document.querySelectorAll('.lang-toggle-btn');
  const langDisplayLabel = document.getElementById('current-lang-text');

  function applyLanguage(lang) {
    if (!translations[lang]) return;
    state.lang = lang;
    localStorage.setItem('ethio21_lang', lang);
    document.documentElement.setAttribute('lang', lang);

    if (langDisplayLabel) {
      langDisplayLabel.textContent = lang === 'en' ? 'EN' : 'አማ';
    }

    const dict = translations[lang];

    document.querySelectorAll('[data-i18n]').forEach(el => {
      const key = el.getAttribute('data-i18n');
      if (dict[key]) {
        el.textContent = dict[key];
      }
    });

    document.querySelectorAll('[data-i18n-placeholder]').forEach(el => {
      const key = el.getAttribute('data-i18n-placeholder');
      if (dict[key]) {
        el.setAttribute('placeholder', dict[key]);
      }
    });
  }

  langToggleBtns.forEach(btn => {
    btn.addEventListener('click', () => {
      const nextLang = state.lang === 'en' ? 'am' : 'en';
      applyLanguage(nextLang);
      playUiSound('toggle');
    });
  });

  // ==========================================
  // 5. INTERACTIVE HERO CANVAS - NEURAL CONSTELLATION
  // ==========================================
  const canvas = document.getElementById('hero-canvas');
  if (canvas) {
    const ctx = canvas.getContext('2d');
    let width, height;
    let particles = [];
    const mouse = { x: null, y: null, radius: 150 };

    function resizeCanvas() {
      width = canvas.width = window.innerWidth;
      height = canvas.height = window.innerHeight;
      initParticles();
    }

    class Particle {
      constructor() {
        this.x = Math.random() * width;
        this.y = Math.random() * height;
        this.vx = (Math.random() - 0.5) * 0.85;
        this.vy = (Math.random() - 0.5) * 0.85;
        this.baseRadius = Math.random() * 1.8 + 1.2;
        this.radius = this.baseRadius;
        const palette = ['#10f2a7', '#00d2ff', '#818cf8'];
        this.color = palette[Math.floor(Math.random() * palette.length)];
      }

      draw() {
        ctx.beginPath();
        ctx.arc(this.x, this.y, this.radius, 0, Math.PI * 2);
        ctx.fillStyle = this.color;
        ctx.shadowBlur = 8;
        ctx.shadowColor = this.color;
        ctx.fill();
        ctx.shadowBlur = 0;
      }

      update() {
        this.x += this.vx;
        this.y += this.vy;

        if (this.x < 0 || this.x > width) this.vx = -this.vx;
        if (this.y < 0 || this.y > height) this.vy = -this.vy;

        if (mouse.x !== null && mouse.y !== null) {
          const dx = mouse.x - this.x;
          const dy = mouse.y - this.y;
          const dist = Math.sqrt(dx * dx + dy * dy);

          if (dist < mouse.radius) {
            const force = (mouse.radius - dist) / mouse.radius;
            this.x -= (dx / dist) * force * 2.5;
            this.y -= (dy / dist) * force * 2.5;
            this.radius = this.baseRadius * 1.5;
          } else {
            this.radius = this.baseRadius;
          }
        }
      }
    }

    function initParticles() {
      particles = [];
      const count = Math.min(Math.floor((width * height) / 13000), 85);
      for (let i = 0; i < count; i++) {
        particles.push(new Particle());
      }
    }

    function connectParticles() {
      const maxDistance = 135;
      for (let a = 0; a < particles.length; a++) {
        for (let b = a + 1; b < particles.length; b++) {
          const dx = particles[a].x - particles[b].x;
          const dy = particles[a].y - particles[b].y;
          const dist = Math.sqrt(dx * dx + dy * dy);

          if (dist < maxDistance) {
            const opacity = 1 - dist / maxDistance;
            ctx.strokeStyle = state.theme === 'dark' 
              ? `rgba(0, 210, 255, ${opacity * 0.22})` 
              : `rgba(16, 242, 167, ${opacity * 0.18})`;
            ctx.lineWidth = 1;
            ctx.beginPath();
            ctx.moveTo(particles[a].x, particles[a].y);
            ctx.lineTo(particles[b].x, particles[b].y);
            ctx.stroke();
          }
        }
      }

      if (mouse.x !== null && mouse.y !== null) {
        for (let i = 0; i < particles.length; i++) {
          const dx = mouse.x - particles[i].x;
          const dy = mouse.y - particles[i].y;
          const dist = Math.sqrt(dx * dx + dy * dy);
          if (dist < mouse.radius) {
            const opacity = 1 - dist / mouse.radius;
            ctx.strokeStyle = `rgba(16, 242, 167, ${opacity * 0.45})`;
            ctx.lineWidth = 1.2;
            ctx.beginPath();
            ctx.moveTo(mouse.x, mouse.y);
            ctx.lineTo(particles[i].x, particles[i].y);
            ctx.stroke();
          }
        }
      }
    }

    function animate() {
      ctx.clearRect(0, 0, width, height);
      for (let i = 0; i < particles.length; i++) {
        particles[i].update();
        particles[i].draw();
      }
      connectParticles();
      requestAnimationFrame(animate);
    }

    window.addEventListener('resize', resizeCanvas);
    window.addEventListener('mousemove', (e) => {
      mouse.x = e.clientX;
      mouse.y = e.clientY;
    });
    window.addEventListener('mouseleave', () => {
      mouse.x = null;
      mouse.y = null;
    });

    resizeCanvas();
    animate();
  }

  // ==========================================
  // 6. UTILITY: FORMATTED INTAKE TIMESTAMPS
  // ==========================================
  function getFormattedTimestamp() {
    return new Date().toLocaleString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric',
      hour: 'numeric',
      minute: '2-digit',
      hour12: true
    });
  }

  // ==========================================
  // 7. STARTUP PITCH MODAL -> DIRECT TELEGRAM
  // ==========================================
  const pitchModal = document.getElementById('pitch-modal');
  const openPitchBtns = document.querySelectorAll('.open-pitch-modal-btn');
  const closePitchBtn = document.getElementById('close-pitch-modal-btn');
  const pitchForm = document.getElementById('pitch-startup-form');

  openPitchBtns.forEach(btn => {
    btn.addEventListener('click', (e) => {
      e.preventDefault();
      if (pitchModal) {
        pitchModal.classList.add('open');
        playUiSound('toggle');
      }
    });
  });

  if (closePitchBtn && pitchModal) {
    closePitchBtn.addEventListener('click', () => {
      pitchModal.classList.remove('open');
      playUiSound('click');
    });
    pitchModal.addEventListener('click', (e) => {
      if (e.target === pitchModal) {
        pitchModal.classList.remove('open');
      }
    });
  }

  if (pitchForm) {
    pitchForm.addEventListener('submit', (e) => {
      e.preventDefault();
      const founderName = (pitchForm.querySelector('#pitch-name') || {}).value || 'Founder';
      const email = (pitchForm.querySelector('#pitch-email') || {}).value || '';
      const phone = (pitchForm.querySelector('#pitch-phone') || {}).value || '';
      const appName = (pitchForm.querySelector('#pitch-app-name') || {}).value || 'App';
      const stage = (pitchForm.querySelector('#pitch-stage') || {}).value || 'Raw Concept';
      
      // Collect selected resources
      const checkedNeeds = Array.from(pitchForm.querySelectorAll('input[name="pitch_needs"]:checked'))
        .map(cb => cb.value);
      const needs = checkedNeeds.length > 0 ? checkedNeeds.join(' • ') : 'Full Technical Squad + Seed Capital';
      
      const desc = (pitchForm.querySelector('#pitch-desc') || {}).value || '';
      const equityAck = (pitchForm.querySelector('#pitch-equity-ack') || {}).checked 
        ? 'Acknowledged & Agreed (Co-Founding Equity Model)' 
        : 'Pending Discussion';
      const timestamp = getFormattedTimestamp();

      const telegramPitch = 
`━━━━━━━━━━━━━━━━━━━━━━━━━━━
🚀 ETHIO 21 CO-BUILDER & EQUITY STUDIO
💡 FOUNDER APPLICATION & VENTURE DOSSIER
━━━━━━━━━━━━━━━━━━━━━━━━━━━

👤 FOUNDER PROFILE
• Lead Founder: ${founderName}
• Direct Phone / TG: ${phone || 'Not provided'}
• Email Address: ${email || 'Not provided'}

📱 VENTURE SPECIFICATION
• Startup / Idea Name: ${appName}
• Current Stage: ${stage}
• Resources Requested:
  ${needs}

💡 REAL-LIFE PROBLEM & SOLUTION VISION
${desc ? `"${desc}"` : 'Founder requested in-person technical evaluation.'}

🤝 CO-FOUNDING EQUITY PARTNERSHIP
• Model: ETHIO 21 Funds + Codes the Software + Co-Founding Equity
• Agreement Status: ${equityAck}
• Next Step: In-Person Founder Discovery Meeting (Addis Ababa)

📅 INTAKE METRIC
• Logged: ${timestamp}
• Priority: Fast-Track Founder Intake
━━━━━━━━━━━━━━━━━━━━━━━━━━━`;

      pitchForm.reset();
      if (pitchModal) pitchModal.classList.remove('open');

      // Directly launch Telegram with formatted pitch
      openTelegram(telegramPitch);
    });
  }

  // Keyboard accessibility for interactive pathway cards
  document.querySelectorAll('.pathway-founder').forEach(el => {
    el.addEventListener('keydown', (e) => {
      if (e.key === 'Enter' || e.key === ' ') {
        e.preventDefault();
        if (pitchModal) {
          pitchModal.classList.add('open');
          playUiSound('toggle');
        }
      }
    });
  });

  // ==========================================
  // 8. CONTACT FORM -> DIRECT TELEGRAM
  // ==========================================
  const contactForm = document.getElementById('project-contact-form');

  if (contactForm) {
    contactForm.addEventListener('submit', (e) => {
      e.preventDefault();
      const name = (contactForm.querySelector('#contact-name') || {}).value || '';
      const email = (contactForm.querySelector('#contact-email') || {}).value || '';
      const phone = (contactForm.querySelector('#contact-phone') || {}).value || '';
      const service = (contactForm.querySelector('#contact-service') || {}).value || '';
      const message = (contactForm.querySelector('#contact-message') || {}).value || '';
      const timestamp = getFormattedTimestamp();

      const telegramInquiry = 
`━━━━━━━━━━━━━━━━━━━━━━━━━━━
💎 ETHIO 21 TECHNOLOGIES & DIGITAL SOLUTIONS
📋 CLIENT PROJECT INQUIRY BRIEF
━━━━━━━━━━━━━━━━━━━━━━━━━━━

👤 CLIENT CREDENTIALS
• Client Name: ${name || 'Prospective Client'}
• Direct Phone / TG: ${phone || 'Not provided'}
• Email Address: ${email || 'Not provided'}

🛠️ ENGAGEMENT SPECIFICATION
• Required Service: ${service || 'General Tech Inquiry'}

📝 PROJECT REQUIREMENTS & OBJECTIVES
${message ? `"${message}"` : 'Client requested technical consultation and discovery call.'}

📅 INTAKE METRIC
• Logged: ${timestamp}
• Source: Official Web Portal (ethio21technologies.com)
━━━━━━━━━━━━━━━━━━━━━━━━━━━
💬 Action: Please review and respond with technical consultation availability.`;

      contactForm.reset();
      openTelegram(telegramInquiry);
    });
  }

  // ==========================================
  // 9. SCROLL HEADER & MOBILE DRAWER
  // ==========================================
  const siteHeader = document.querySelector('.site-header');
  window.addEventListener('scroll', () => {
    if (window.scrollY > 40) {
      siteHeader.classList.add('scrolled');
    } else {
      siteHeader.classList.remove('scrolled');
    }
  });

  const mobileNavToggle = document.getElementById('mobile-nav-toggle');
  const mobileDrawer = document.getElementById('mobile-drawer');
  const drawerBackdrop = document.getElementById('drawer-backdrop');
  const closeDrawerBtn = document.getElementById('close-drawer-btn');
  const drawerLinks = document.querySelectorAll('.mobile-drawer-links a');

  function openDrawer() {
    if (mobileDrawer && drawerBackdrop) {
      mobileDrawer.classList.add('open');
      drawerBackdrop.classList.add('open');
      playUiSound('toggle');
    }
  }

  function closeDrawer() {
    if (mobileDrawer && drawerBackdrop) {
      mobileDrawer.classList.remove('open');
      drawerBackdrop.classList.remove('open');
      playUiSound('toggle');
    }
  }

  if (mobileNavToggle) mobileNavToggle.addEventListener('click', openDrawer);
  if (closeDrawerBtn) closeDrawerBtn.addEventListener('click', closeDrawer);
  if (drawerBackdrop) drawerBackdrop.addEventListener('click', closeDrawer);
  drawerLinks.forEach(link => link.addEventListener('click', closeDrawer));

  // ==========================================
  // 10. TELEGRAM COMMUNITY LEAD FORM HANDLER
  // ==========================================
  const communityLeadForm = document.getElementById('community-lead-form');

  if (communityLeadForm) {
    communityLeadForm.addEventListener('submit', (e) => {
      e.preventDefault();
      const name = (communityLeadForm.querySelector('#community-name') || {}).value || 'Tech Innovator';
      const handle = (communityLeadForm.querySelector('#community-handle') || {}).value || '';
      const interest = (communityLeadForm.querySelector('#community-interest') || {}).value || 'Software Developer';
      const timestamp = getFormattedTimestamp();

      // Store lead in local storage for CRM sync
      try {
        const storedLeads = JSON.parse(localStorage.getItem('ethio21_community_leads') || '[]');
        storedLeads.push({ name, handle, interest, timestamp });
        localStorage.setItem('ethio21_community_leads', JSON.stringify(storedLeads));
      } catch (err) {
        console.warn('LocalStorage save skipped:', err);
      }

      playUiSound('success');

      const telegramCommunityLead = 
`━━━━━━━━━━━━━━━━━━━━━━━━━━━
👥 ETHIO 21 TECH COMMUNITY & DISCUSSION GROUP
🎫 VIP ONBOARDING & PASS ACTIVATION
━━━━━━━━━━━━━━━━━━━━━━━━━━━

👤 MEMBER PROFILE
• Name: ${name}
• Telegram / Phone: ${handle}
• Primary Focus: ${interest}

🚀 COMMUNITY ACCESS LEVEL
• Status: VIP Member Pass Issued
• Benefits: Direct Senior Q&A, Code Toolkits, Venture Calls
• Group: ETHIO 21 Tech Community & Discussion

📅 TIME LOGGED: ${timestamp}
• Source: Web Portal Community Hub (ethio21technologies.com)
━━━━━━━━━━━━━━━━━━━━━━━━━━━
👋 Welcome to the ETHIO 21 Tech Community! Opening discussion group...`;

      communityLeadForm.reset();

      const submitBtn = communityLeadForm.querySelector('button[type="submit"]');
      if (submitBtn) {
        const originalHtml = submitBtn.innerHTML;
        submitBtn.innerHTML = `<span>✓ VIP Pass Activated! Joining...</span>`;
        submitBtn.style.background = 'linear-gradient(135deg, #10f2a7 0%, #059669 100%)';
        setTimeout(() => {
          submitBtn.innerHTML = originalHtml;
          submitBtn.style.background = '';
        }, 3000);
      }

      openTelegram('', true);
    });
  }

  // ==========================================
  // 11. ANTI-CLONING, SOURCE SHIELD & ASSET PROTECTION
  // ==========================================
  // Console Security Watermark
  console.log(
    '%c🛑 STOP! PROTECTED SYSTEM',
    'color: #ef4444; font-size: 28px; font-weight: 900; -webkit-text-stroke: 1px black;'
  );
  console.log(
    '%cAll designs, code architectures, and branding assets are the proprietary intellectual property of ETHIO 21 Technologies & Digital Solutions.\nUnauthorized cloning, source scraping, or commercial reproduction is strictly prohibited.',
    'color: #00d2ff; font-size: 13px; font-weight: 600;'
  );

  // Security Toast Notification (Modern Classic Executive Shield)
  let securityToastTimeout = null;
  function showSecurityNotice(msg, customTag = 'ETHIO 21 PROPRIETARY SHIELD') {
    let toast = document.getElementById('security-toast');
    if (!toast) {
      toast = document.createElement('div');
      toast.id = 'security-toast';
      toast.className = 'security-toast';
      toast.innerHTML = `
        <div class="security-shield-icon-badge">🛡️</div>
        <div class="security-toast-content">
          <div class="security-toast-brand">${customTag}</div>
          <div class="security-toast-text">${msg || 'Protected Intellectual Property • Viewing Only'}</div>
        </div>
      `;
      document.body.appendChild(toast);
    } else {
      const brandSpan = toast.querySelector('.security-toast-brand');
      const textSpan = toast.querySelector('.security-toast-text');
      if (brandSpan) brandSpan.textContent = customTag;
      if (textSpan) textSpan.textContent = msg || 'Protected Intellectual Property • Viewing Only';
    }

    clearTimeout(securityToastTimeout);
    toast.classList.add('show');
    playUiSound('toggle');
    securityToastTimeout = setTimeout(() => {
      toast.classList.remove('show');
    }, 2800);
  }

  // 1. Disable Right-Click Context Menu (Capture Phase)
  window.addEventListener('contextmenu', (e) => {
    e.preventDefault();
    e.stopPropagation();
    e.stopImmediatePropagation();
    showSecurityNotice('Right-Click Disabled • Protected Intellectual Property', 'ETHIO 21 PROPRIETARY SHIELD');
    return false;
  }, true);

  // 2. Intercept DevTools & Source Inspector Keyboard Shortcuts (Capture Phase)
  window.addEventListener('keydown', (e) => {
    // F12 key
    if (e.key === 'F12' || e.keyCode === 123) {
      e.preventDefault();
      e.stopPropagation();
      e.stopImmediatePropagation();
      showSecurityNotice('Developer Tools Blocked • Protected Intellectual Property', 'ETHIO 21 PROPRIETARY SHIELD');
      return false;
    }

    const isCtrlOrMeta = e.ctrlKey || e.metaKey;

    // Ctrl+U / Cmd+U (View Source)
    if (isCtrlOrMeta && (e.key === 'u' || e.key === 'U' || e.keyCode === 85)) {
      e.preventDefault();
      e.stopPropagation();
      e.stopImmediatePropagation();
      showSecurityNotice('Source Code Viewer Blocked • Viewing Only', 'ETHIO 21 PROPRIETARY SHIELD');
      return false;
    }

    // Ctrl+Shift+I / J / C (Inspect Element & Console)
    if (isCtrlOrMeta && e.shiftKey && ['I', 'J', 'C', 'i', 'j', 'c'].includes(e.key)) {
      e.preventDefault();
      e.stopPropagation();
      e.stopImmediatePropagation();
      showSecurityNotice('Inspector Blocked • Protected Intellectual Property', 'ETHIO 21 PROPRIETARY SHIELD');
      return false;
    }

    // Ctrl+S / Cmd+S (Save Page)
    if (isCtrlOrMeta && (e.key === 's' || e.key === 'S')) {
      e.preventDefault();
      e.stopPropagation();
      e.stopImmediatePropagation();
      showSecurityNotice('Page Saving Disabled • Viewing Only', 'ETHIO 21 PROPRIETARY SHIELD');
      return false;
    }

    // Ctrl+P / Cmd+P (Print Page)
    if (isCtrlOrMeta && (e.key === 'p' || e.key === 'P')) {
      e.preventDefault();
      e.stopPropagation();
      e.stopImmediatePropagation();
      showSecurityNotice('Printing Disabled • Secure Viewing Mode', 'ETHIO 21 PROPRIETARY SHIELD');
      return false;
    }
  }, true);

  // 3. Prevent Dragging of Images and Visuals
  window.addEventListener('dragstart', (e) => {
    if (e.target.tagName === 'IMG' || e.target.tagName === 'svg' || e.target.closest('.hero-brand-glass-card')) {
      e.preventDefault();
      return false;
    }
  }, true);

  // 4. Active DevTools Detection & Full-Screen Shield Lockdown Overlay
  const mainDevToolsThreshold = 160;

  function setMainLockoutState(locked) {
    let overlay = document.getElementById('devtools-lockout-overlay');
    if (locked) {
      if (!overlay && document.body) {
        overlay = document.createElement('div');
        overlay.id = 'devtools-lockout-overlay';
        overlay.className = 'devtools-lockout-overlay';
        overlay.innerHTML = `
          <div class="lockout-box">
            <div class="lockout-shield-badge">🛡️</div>
            <span class="lockout-tag">ETHIO 21 PROPRIETARY SHIELD v2.4</span>
            <h2 class="lockout-title">INSPECTOR &amp; DEVTOOLS DETECTED</h2>
            <p class="lockout-desc">All system architectures, proprietary client interfaces, and interactive calculators are protected under ETHIO 21 Technologies intellectual property rights.</p>
            <div class="lockout-status">🔒 SESSION BLURRED &amp; SECURED</div>
            <p class="lockout-sub">Please close Developer Tools or Inspector window to resume exploring.</p>
          </div>
        `;
        document.body.appendChild(overlay);
      }
      if (overlay) overlay.classList.add('active');
      if (document.body) document.body.classList.add('shield-lockdown-blur');
    } else {
      if (overlay) overlay.classList.remove('active');
      if (document.body) document.body.classList.remove('shield-lockdown-blur');
    }
  }

  function checkMainDevToolsActivity() {
    const widthDiff = window.outerWidth - window.innerWidth > mainDevToolsThreshold;
    const heightDiff = window.outerHeight - window.innerHeight > mainDevToolsThreshold;
    if (widthDiff || heightDiff) {
      setMainLockoutState(true);
    } else {
      setMainLockoutState(false);
    }
  }

  window.addEventListener('resize', checkMainDevToolsActivity);
  setInterval(checkMainDevToolsActivity, 600);

  // 5. Anti-Debugger Trap Loop
  setInterval(() => {
    const start = performance.now();
    (function() {
      return false;
    }['constructor']('debugger')['call']());
    const duration = performance.now() - start;
    if (duration > 100) {
      setMainLockoutState(true);
    }
  }, 500);

  applyLanguage(state.lang);
});

