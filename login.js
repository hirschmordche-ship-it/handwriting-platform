// Diagnostic login.js — comprehensive stage-by-stage logging + on-page console
// Overwrite your existing login.js with this file. It will:
//  - Create an on-page diagnostic panel (visible on mobile).
//  - Log each stage to console and the panel with clear labels.
//  - Test Supabase availability and safe initialization.
//  - Verify presence of key elements and data-target/id matches.
//  - Attach non-invasive test listeners for toggle, strength bar, and auth buttons.
//  - Run small runtime tests (simulate toggle click, simulate input) to show whether handlers respond.
//  - Never removes or replaces your existing handlers; only adds safe listeners and diagnostics.

// ----------------------------- Diagnostic UI -----------------------------
(function createDiagPanel() {
  if (document.getElementById('__diag_panel')) return;
  const panel = document.createElement('div');
  panel.id = '__diag_panel';
  panel.style.position = 'fixed';
  panel.style.right = '12px';
  panel.style.bottom = '12px';
  panel.style.width = '320px';
  panel.style.maxHeight = '45vh';
  panel.style.overflowY = 'auto';
  panel.style.zIndex = 999999;
  panel.style.background = 'rgba(0,0,0,0.85)';
  panel.style.color = '#fff';
  panel.style.fontSize = '12px';
  panel.style.lineHeight = '1.3';
  panel.style.padding = '10px';
  panel.style.borderRadius = '8px';
  panel.style.boxShadow = '0 6px 18px rgba(0,0,0,0.4)';
  panel.style.fontFamily = 'system-ui, Arial, sans-serif';
  panel.style.backdropFilter = 'blur(4px)';
  panel.innerHTML = '<strong style="display:block;margin-bottom:6px">Diagnostics</strong><div id="__diag_log"></div><button id="__diag_clear" style="margin-top:8px;padding:6px 8px;border-radius:6px;border:none;background:#0070f3;color:#fff;cursor:pointer">Clear</button>';
  document.documentElement.appendChild(panel);
  document.getElementById('__diag_clear').addEventListener('click', () => {
    document.getElementById('__diag_log').innerHTML = '';
  });
})();

// Logging helper (console + on-page)
function diagLog(msg, level = 'info') {
  try {
    const el = document.getElementById('__diag_log');
    const time = new Date().toLocaleTimeString();
    const color = level === 'error' ? '#ff6b6b' : level === 'warn' ? '#ffd166' : '#9ae6b4';
    const line = document.createElement('div');
    line.style.marginBottom = '6px';
    line.innerHTML = `<span style="color:${color};font-weight:600">[${time}]</span> <span style="opacity:0.95">${escapeHtml(msg)}</span>`;
    el.appendChild(line);
    // keep newest visible
    el.scrollTop = el.scrollHeight;
  } catch (e) { /* ignore UI errors */ }

  if (level === 'error') console.error('[DIAG]', msg);
  else if (level === 'warn') console.warn('[DIAG]', msg);
  else console.log('[DIAG]', msg);
}

function escapeHtml(s) {
  return String(s).replace(/[&<>"']/g, c => ({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
}

// ----------------------------- Stage runner -----------------------------
diagLog('Diagnostic script loaded', 'info');

function runDiagnostics() {
  diagLog('Starting diagnostics...', 'info');

  // Stage 1: DOM readiness
  diagLog(`Document readyState: ${document.readyState}`, 'info');

  // Stage 2: Supabase presence and safe init
  try {
    const supExists = typeof supabase !== 'undefined';
    diagLog(`Supabase global defined: ${supExists}`, supExists ? 'info' : 'warn');

    let supClient = null;
    if (supExists && supabase && typeof supabase.createClient === 'function') {
      try {
        supClient = supabase.createClient("https://fohzmnvqgtbwglapojuo.supabase.co", "sb_publishable_ooSqDRIkzjzbm_4lIyYmuQ_ylutHG77");
        diagLog('Supabase.createClient() succeeded (client created)', 'info');
      } catch (e) {
        diagLog('Supabase.createClient() threw an error: ' + e.message, 'error');
      }
    } else {
      diagLog('Supabase.createClient not available (library missing or different version)', 'warn');
    }
  } catch (e) {
    diagLog('Error while checking Supabase: ' + e.message, 'error');
  }

  // Stage 3: Element presence checks
  const idsToCheck = ['regUser','regPass','regBar','regText','regBtn','loginUser','loginPass','loginBtn','rememberMe'];
  const found = {};
  idsToCheck.forEach(id => {
    const el = document.getElementById(id);
    found[id] = !!el;
    diagLog(`Element #${id} present: ${!!el}`, el ? 'info' : 'warn');
  });

  // Stage 4: Toggle elements and data-target checks
  const toggles = Array.from(document.querySelectorAll('.toggle-password'));
  diagLog(`Found ${toggles.length} .toggle-password elements`, toggles.length ? 'info' : 'warn');

  toggles.forEach((t, i) => {
    const dt = t.dataset && t.dataset.target;
    const exists = dt && !!document.getElementById(dt);
    diagLog(`Toggle[${i}] data-target="${dt}" -> target exists: ${exists}`, exists ? 'info' : 'error');
  });

  // Stage 5: Attach non-invasive test listeners (capture phase) to log actual user interactions
  try {
    // Toggle click listener (capture) — logs when user clicks a toggle
    function toggleCapture(ev) {
      const el = ev.target;
      if (!el || !el.classList) return;
      if (!el.classList.contains('toggle-password')) return;
      diagLog('User clicked a .toggle-password element (capture)', 'info');
    }
    document.addEventListener('click', toggleCapture, true);

    // Buttons: capture clicks
    ['regBtn','loginBtn'].forEach(id => {
      const b = document.getElementById(id);
      if (b) {
        b.addEventListener('click', function () {
          diagLog(`#${id} clicked`, 'info');
        }, true);
      }
    });

    // Strength bar: attach a non-invasive input listener to regPass to log input events
    const regPass = document.getElementById('regPass');
    if (regPass) {
      regPass.addEventListener('input', function (e) {
        diagLog(`regPass input event fired (length=${(e.target.value||'').length})`, 'info');
      }, true);
    } else {
      diagLog('regPass element missing; cannot attach strength input listener', 'warn');
    }
  } catch (e) {
    diagLog('Error attaching capture listeners: ' + e.message, 'error');
  }

  // Stage 6: Runtime tests (simulate small actions to see if handlers respond)
  // 6a: Simulate toggle click on first toggle (non-destructive)
  try {
    if (toggles.length > 0) {
      const t = toggles[0];
      const dt = t.dataset && t.dataset.target;
      const input = dt ? document.getElementById(dt) : null;
      if (!input) {
        diagLog('Cannot run toggle simulation: target input not found for first toggle', 'error');
      } else {
        // Save original type
        const origType = input.type;
        // Dispatch a click event on the toggle element
        const ev = new MouseEvent('click', { bubbles: true, cancelable: true });
        t.dispatchEvent(ev);
        // Check whether input type changed
        setTimeout(() => {
          const newType = input.type;
          const changed = newType !== origType;
          diagLog(`Toggle simulation: input type changed from "${origType}" to "${newType}" -> ${changed}`, changed ? 'info' : 'error');
          // If changed, revert to original to avoid altering UI state
          try { input.type = origType; } catch (e) {}
        }, 50);
      }
    } else {
      diagLog('No toggle elements to simulate', 'warn');
    }
  } catch (e) {
    diagLog('Toggle simulation error: ' + e.message, 'error');
  }

  // 6b: Simulate strength input event
  try {
    const regPassEl = document.getElementById('regPass');
    const regBarEl = document.getElementById('regBar');
    const regTextEl = document.getElementById('regText');
    if (regPassEl && regBarEl && regTextEl) {
      const prevVal = regPassEl.value || '';
      // set a test value that should produce a strong score
      regPassEl.value = 'Abc123!@';
      const ev = new Event('input', { bubbles: true, cancelable: true });
      regPassEl.dispatchEvent(ev);
      // wait a tick to let any handlers run
      setTimeout(() => {
        const width = regBarEl.style.width || '(no inline width)';
        const text = regTextEl.textContent || '(no text)';
        diagLog(`Strength simulation: regBar width="${width}", regText="${text}"`, (width && text) ? 'info' : 'error');
        // restore previous value
        regPassEl.value = prevVal;
        regPassEl.dispatchEvent(new Event('input', { bubbles: true }));
      }, 60);
    } else {
      diagLog('Strength simulation skipped: regPass/regBar/regText not all present', 'warn');
    }
  } catch (e) {
    diagLog('Strength simulation error: ' + e.message, 'error');
  }

  // Stage 7: Check for JS runtime errors captured via window.onerror
  (function installGlobalErrorHook() {
    if (window.__diag_error_hook_installed) return;
    window.__diag_error_hook_installed = true;
    window.addEventListener('error', function (ev) {
      diagLog('Global error captured: ' + (ev && ev.message ? ev.message : JSON.stringify(ev)), 'error');
    });
    window.addEventListener('unhandledrejection', function (ev) {
      diagLog('Unhandled promise rejection: ' + (ev && ev.reason ? (ev.reason.message || JSON.stringify(ev.reason)) : JSON.stringify(ev)), 'error');
    });
    diagLog('Global error hooks installed', 'info');
  })();

  // Stage 8: Final summary and guidance
  setTimeout(() => {
    diagLog('Diagnostics complete. Look for the first "error" message above — that is where execution failed or a required element is missing.', 'info');
    diagLog('If Supabase is missing or createClient is unavailable, your auth code may throw and stop other handlers from attaching.', 'warn');
    diagLog('If a toggle data-target does not match an input id, the toggle cannot find its input (fix data-target to match id exactly).', 'warn');
    diagLog('If you cannot access DevTools on mobile, use this panel to read the messages; copy them and share here if you want me to interpret.', 'info');
  }, 200);
}

// Run diagnostics after DOM ready
if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', runDiagnostics);
} else {
  runDiagnostics();
}
