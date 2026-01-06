// Overwrite your existing login.js with this exact file.
// Keeps your HTML/CSS unchanged and **includes the on-page diagnostic console**.
// Guarantees: Show/Hide toggle works, password strength bar updates, Supabase-safe init (non-blocking),
// local-storage fallback auth, and a visible diagnostic panel that logs every stage and errors.

(function(){
  // -------------------- Diagnostic panel (on-page) --------------------
  if (!document.getElementById('diag-panel')) {
    const panel = document.createElement('div');
    panel.id = 'diag-panel';
    Object.assign(panel.style, {
      position: 'fixed',
      right: '10px',
      bottom: '10px',
      width: '320px',
      maxHeight: '45vh',
      overflowY: 'auto',
      zIndex: 999999,
      background: 'rgba(0,0,0,0.82)',
      color: '#fff',
      fontSize: '12px',
      padding: '10px',
      borderRadius: '8px',
      boxSizing: 'border-box',
      fontFamily: 'system-ui, Arial, sans-serif'
    });
    panel.innerHTML = '<strong style="display:block;margin-bottom:6px">Diagnostics</strong><div id="diag-log"></div><button id="diag-clear" style="margin-top:8px;padding:6px 8px;border-radius:6px;border:none;background:#0070f3;color:#fff;cursor:pointer">Clear</button>';
    document.documentElement.appendChild(panel);
    document.getElementById('diag-clear').addEventListener('click', ()=>{ document.getElementById('diag-log').innerHTML = ''; });
  }

  function diag(msg, level='info') {
    try {
      const log = document.getElementById('diag-log');
      const time = new Date().toLocaleTimeString();
      const line = document.createElement('div');
      line.className = 'diag-line';
      const color = level === 'error' ? '#ff6b6b' : level === 'warn' ? '#ffd166' : '#9ae6b4';
      line.style.marginBottom = '6px';
      line.innerHTML = `<span style="color:${color};font-weight:600">[${time}]</span> <span style="opacity:0.95">${String(msg)}</span>`;
      log.appendChild(line);
      log.scrollTop = log.scrollHeight;
    } catch (e) {}
    if (level === 'error') console.error('[DIAG]', msg);
    else if (level === 'warn') console.warn('[DIAG]', msg);
    else console.log('[DIAG]', msg);
  }

  diag('Diagnostic loader injected', 'info');

  // -------------------- Safe Supabase init (non-blocking) --------------------
  let supabaseClient = null;
  try {
    const supExists = typeof supabase !== 'undefined';
    diag(`Supabase global defined: ${supExists}`, supExists ? 'info' : 'warn');
    if (supExists && supabase && typeof supabase.createClient === 'function') {
      try {
        supabaseClient = supabase.createClient("https://fohzmnvqgtbwglapojuo.supabase.co", "sb_publishable_ooSqDRIkzjzbm_4lIyYmuQ_ylutHG77");
        diag('Supabase client created successfully', 'info');
      } catch (e) {
        diag('Supabase.createClient threw: ' + (e && e.message ? e.message : e), 'error');
        supabaseClient = null;
      }
    } else {
      diag('Supabase.createClient not available (library missing or different)', 'warn');
    }
  } catch (e) {
    diag('Error checking Supabase: ' + (e && e.message ? e.message : e), 'error');
    supabaseClient = null;
  }

  // -------------------- Utilities --------------------
  const $id = id => document.getElementById(id);
  const onReady = fn => { if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', fn); else fn(); };

  // -------------------- Toggle delegation --------------------
  function installToggleDelegation(){
    if (document.__toggleInstalled) { diag('Toggle delegation already installed', 'info'); return; }
    document.__toggleInstalled = true;
    document.addEventListener('click', function(ev){
      const el = ev.target;
      if (!el || !el.classList) return;
      if (!el.classList.contains('toggle-password')) return;
      const targetId = el.dataset && el.dataset.target;
      if (!targetId) {
        diag('toggle-password clicked but no data-target attribute found', 'warn');
        return;
      }
      const input = $id(targetId);
      if (!input) { diag(`toggle target not found for data-target="${targetId}"`, 'error'); return; }
      const was = input.type === 'password';
      try {
        input.type = was ? 'text' : 'password';
        el.textContent = was ? 'Hide' : 'Show';
        try { input.focus({preventScroll:true}); } catch(e){ input.focus(); }
        diag(`Toggled input #${targetId} to type="${input.type}"`, 'info');
      } catch (e) {
        diag('Error toggling input: ' + (e && e.message ? e.message : e), 'error');
      }
    }, { passive: true });
    diag('Toggle delegation installed', 'info');
  }

  // -------------------- Strength handler --------------------
  function attachStrengthHandler(){
    try {
      const regPass = $id('regPass');
      const regBar = $id('regBar');
      const regText = $id('regText');
      if (!regPass || !regBar || !regText) {
        diag('Strength handler skipped: regPass/regBar/regText not all present', 'warn');
        return;
      }
      if (regPass.__strengthAttached) { diag('Strength handler already attached', 'info'); return; }
      regPass.__strengthAttached = true;
      function score(p){
        let s=0; if(!p) return 0; if(p.length>=6) s++; if((p.match(/\d/g)||[]).length>=2) s++; if(/[!@#$%^&*()_\-+=

\[\]

{}|\\:;"\'<>,.?/]/.test(p)) s++; return s;
      }
      regPass.addEventListener('input', function(e){
        const s = score(e.target.value);
        const widths = ["5%","33%","66%","100%"];
        const colors = ["#eee","#ffe066","#ffd166","#2d6a4f"];
        regBar.style.width = widths[s] || widths[0];
        regBar.style.background = colors[s] || colors[0];
        regText.textContent = ["","Weak","Medium","Strong"][s] || "";
        diag(`Strength handler updated: score=${s}`, 'info');
      });
      const initScore = score(regPass.value || '');
      regBar.style.width = ["5%","33%","66%","100%"][initScore] || "5%";
      regBar.style.background = ["#eee","#ffe066","#ffd166","#2d6a4f"][initScore] || "#eee";
      regText.textContent = ["","Weak","Medium","Strong"][initScore] || "";
      diag('Strength handler attached and initialized', 'info');
    } catch (e) {
      diag('attachStrengthHandler error: ' + (e && e.message ? e.message : e), 'error');
    }
  }

  // -------------------- Auth handlers (Supabase or local fallback) --------------------
  function attachAuthHandlers(){
    try {
      const regBtn = $id('regBtn'), loginBtn = $id('loginBtn');
      const regUser = $id('regUser'), regPass = $id('regPass');
      const loginUser = $id('loginUser'), loginPass = $id('loginPass');
      const regMsg = $id('regMsg'), loginMsg = $id('loginMsg');
      const rememberMe = $id('rememberMe');

      const REMEMBER_KEY = 'remember_email_v1';
      const saveRemember = email => { try { localStorage.setItem(REMEMBER_KEY, email || ''); } catch(e){} };
      const loadRemember = () => { try { return localStorage.getItem(REMEMBER_KEY) || ''; } catch(e){ return ''; } };
      const clearRemember = () => { try { localStorage.removeItem(REMEMBER_KEY); } catch(e){} };

      try {
        const remembered = loadRemember();
        if (remembered && loginUser) { loginUser.value = remembered; if (rememberMe) rememberMe.checked = true; diag('Prefilled remembered email', 'info'); }
      } catch(e){}

      async function localRegister(){
        if (regMsg) regMsg.textContent = '';
        if (loginMsg) loginMsg.textContent = '';
        const email = regUser ? (regUser.value||'').trim() : '';
        const password = regPass ? regPass.value : '';
        if (!email) { if (regMsg) regMsg.textContent = 'Please enter an email.'; diag('Local register failed: no email', 'warn'); return; }
        const s = (function scoreLocal(p){ let ss=0; if(!p) return 0; if(p.length>=6) ss++; if((p.match(/\d/g)||[]).length>=2) ss++; if(/[!@#$%^&*()_\-+=

\[\]

{}|\\:;"\'<>,.?/]/.test(p)) ss++; return ss; })(password);
        if (s !== 3) { if (regMsg) regMsg.textContent = 'Weak password.'; diag('Local register failed: weak password', 'warn'); return; }
        const users = JSON.parse(localStorage.getItem('users')||'{}');
        if (users[email]) { if (regMsg) regMsg.textContent = 'Email exists'; diag('Local register failed: email exists', 'warn'); return; }
        const h = await (async p => { const b = await crypto.subtle.digest('SHA-256', new TextEncoder().encode(p)); return [...new Uint8Array(b)].map(x=>x.toString(16).padStart(2,'0')).join(''); })(password);
        users[email] = h;
        localStorage.setItem('users', JSON.stringify(users));
        diag('Local register succeeded (stored hashed password)', 'info');
        if (loginUser) loginUser.value = email;
        if (loginPass) loginPass.value = password;
        await localLogin();
      }

      async function localLogin(){
        if (regMsg) regMsg.textContent = '';
        if (loginMsg) loginMsg.textContent = '';
        const email = loginUser ? (loginUser.value||'').trim() : '';
        const password = loginPass ? loginPass.value : '';
        if (!email || !password) { if (loginMsg) loginMsg.textContent = 'Enter email and password'; diag('Local login failed: missing fields', 'warn'); return; }
        const users = JSON.parse(localStorage.getItem('users')||'{}');
        const h = await (async p => { const b = await crypto.subtle.digest('SHA-256', new TextEncoder().encode(p)); return [...new Uint8Array(b)].map(x=>x.toString(16).padStart(2,'0')).join(''); })(password);
        if (users[email] !== h) { if (loginMsg) loginMsg.textContent = 'Invalid credentials'; diag('Local login failed: invalid credentials', 'warn'); return; }
        localStorage.setItem('activeUser', email);
        if (rememberMe && rememberMe.checked) saveRemember(email); else clearRemember();
        diag('Local login succeeded; redirect would occur now', 'info');
        // Uncomment to enable redirect:
        // location.href = '/upload.html';
      }

      async function supabaseRegister(){
        if (!supabaseClient) { diag('Supabase register skipped: client not available', 'warn'); return localRegister(); }
        if (regMsg) regMsg.textContent = '';
        const email = regUser ? (regUser.value||'').trim() : '';
        const password = regPass ? regPass.value : '';
        if (!email) { if (regMsg) regMsg.textContent = 'Please enter an email.'; diag('Supabase register failed: no email', 'warn'); return; }
        const s = (function scoreLocal(p){ let ss=0; if(!p) return 0; if(p.length>=6) ss++; if((p.match(/\d/g)||[]).length>=2) ss++; if(/[!@#$%^&*()_\-+=

\[\]

{}|\\:;"\'<>,.?/]/.test(p)) ss++; return ss; })(password);
        if (s !== 3) { if (regMsg) regMsg.textContent = 'Weak password.'; diag('Supabase register failed: weak password', 'warn'); return; }
        try {
          const { error } = await supabaseClient.auth.signUp({ email, password });
          if (error) { if (regMsg) regMsg.textContent = error.message || 'Registration failed'; diag('Supabase signUp error: ' + (error.message||error), 'error'); return; }
          diag('Supabase signUp succeeded', 'info');
          const { error: loginError } = await supabaseClient.auth.signInWithPassword({ email, password });
          if (loginError) { if (regMsg) regMsg.textContent = 'Registered but login failed'; diag('Supabase signIn error: ' + (loginError.message||loginError), 'error'); return; }
          diag('Supabase auto-login succeeded', 'info');
          if (rememberMe && rememberMe.checked) saveRemember(email);
          // location.href = '/upload.html';
        } catch (e) {
          diag('Supabase register exception: ' + (e && e.message ? e.message : e), 'error');
        }
      }

      async function supabaseLogin(){
        if (!supabaseClient) { diag('Supabase login skipped: client not available', 'warn'); return localLogin(); }
        if (loginMsg) loginMsg.textContent = '';
        const email = loginUser ? (loginUser.value||'').trim() : '';
        const password = loginPass ? loginPass.value : '';
        if (!email || !password) { if (loginMsg) loginMsg.textContent = 'Enter email and password'; diag('Supabase login failed: missing fields', 'warn'); return; }
        try {
          const { error } = await supabaseClient.auth.signInWithPassword({ email, password });
          if (error) { if (loginMsg) loginMsg.textContent = error.message || 'Invalid credentials'; diag('Supabase signIn error: ' + (error.message||error), 'error'); return; }
          diag('Supabase login succeeded', 'info');
          if (rememberMe && rememberMe.checked) saveRemember(email); else clearRemember();
          // location.href = '/upload.html';
        } catch (e) {
          diag('Supabase login exception: ' + (e && e.message ? e.message : e), 'error');
        }
      }

      if (regBtn && !regBtn.__attached) {
        regBtn.addEventListener('click', function(){ if (supabaseClient) supabaseRegister(); else localRegister(); });
        regBtn.__attached = true;
        diag('Register button handler attached', 'info');
      }
      if (loginBtn && !loginBtn.__attached) {
        loginBtn.addEventListener('click', function(){ if (supabaseClient) supabaseLogin(); else localLogin(); });
        loginBtn.__attached = true;
        diag('Login button handler attached', 'info');
      }
    } catch (e) {
      diag('attachAuthHandlers error: ' + (e && e.message ? e.message : e), 'error');
    }
  }

  // -------------------- Quick simulation checks --------------------
  function runSimulations(){
    try {
      const toggles = Array.from(document.querySelectorAll('.toggle-password'));
      diag(`Found ${toggles.length} toggle elements`, toggles.length ? 'info' : 'warn');
      if (toggles.length > 0) {
        const t = toggles[0];
        const dt = t.dataset && t.dataset.target;
        const input = dt ? $id(dt) : null;
        if (!input) diag('Simulation: toggle target not found for first toggle', 'error');
        else {
          const orig = input.type;
          t.dispatchEvent(new MouseEvent('click', { bubbles: true, cancelable: true }));
          setTimeout(()=> {
            const now = input.type;
            diag(`Simulation: input type changed from "${orig}" to "${now}" -> ${now !== orig}`, now !== orig ? 'info' : 'error');
            try { input.type = orig; } catch(e){}
          }, 60);
        }
      }
      const regPass = $id('regPass'), regBar = $id('regBar'), regText = $id('regText');
      if (regPass && regBar && regText) {
        const prev = regPass.value || '';
        regPass.value = 'Abc123!@';
        regPass.dispatchEvent(new Event('input', { bubbles: true }));
        setTimeout(()=> {
          const width = regBar.style.width || '(no inline width)';
          const text = regText.textContent || '(no text)';
          diag(`Simulation: regBar width="${width}", regText="${text}"`, (width && text && text !== '(no text)') ? 'info' : 'error');
          regPass.value = prev;
          regPass.dispatchEvent(new Event('input', { bubbles: true }));
        }, 80);
      } else diag('Simulation: strength elements missing', 'warn');
    } catch (e) {
      diag('runSimulations error: ' + (e && e.message ? e.message : e), 'error');
    }
  }

  // -------------------- Global error hooks --------------------
  (function installGlobalHooks(){
    if (window.__diag_error_hook_installed) return;
    window.__diag_error_hook_installed = true;
    window.addEventListener('error', function(ev){ diag('Global error: ' + (ev && ev.message ? ev.message : JSON.stringify(ev)), 'error'); });
    window.addEventListener('unhandledrejection', function(ev){ diag('Unhandled rejection: ' + (ev && ev.reason ? (ev.reason.message||JSON.stringify(ev.reason)) : JSON.stringify(ev)), 'error'); });
    diag('Global error hooks installed', 'info');
  })();

  // -------------------- Initialize --------------------
  onReady(function initAll(){
    diag('DOM ready; initializing handlers', 'info');
    installToggleDelegation();
    attachStrengthHandler();
    attachAuthHandlers();
    setTimeout(runSimulations, 120);
    diag('Initialization complete; check diagnostic panel for any "error" messages', 'info');
  });
})();
