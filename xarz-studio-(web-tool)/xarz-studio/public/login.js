/* ══════════════════════════════
   login.js — Xarz Studio
   غيّر القيمتين هنا فقط
══════════════════════════════ */

const EMAIL    = 'mmyazan88@gmail.com';
const PASSWORD = 'Abooh@1397';

/* ─────────────────────────── */

function doLogin() {
  const emailVal = document.getElementById('li-email').value.trim().toLowerCase();
  const passVal  = document.getElementById('li-pass').value;
  const errEl    = document.getElementById('li-err');
  const errMsg   = document.getElementById('li-err-msg');
  const btn      = document.getElementById('li-btn');

  if (!emailVal || !passVal) {
    errMsg.textContent = 'يرجى إدخال البريد وكلمة المرور';
    errEl.classList.add('show');
    return;
  }

  const ok = emailVal === EMAIL.toLowerCase() && passVal === PASSWORD;

  if (ok) {
    btn.textContent = '✓ جارٍ الدخول…';
    btn.disabled = true;
    sessionStorage.setItem('xarz_access', 'granted');
    setTimeout(() => { window.location.href = 'app.html'; }, 400);
  } else {
    errMsg.textContent = 'بيانات غير صحيحة، حاول مجدداً';
    errEl.classList.add('show');
    document.getElementById('li-pass').value = '';
    document.getElementById('li-pass').focus();
  }
}

// Enter key support
document.addEventListener('DOMContentLoaded', () => {
  ['li-email', 'li-pass'].forEach(id => {
    document.getElementById(id)?.addEventListener('keydown', e => {
      if (e.key === 'Enter') doLogin();
    });
  });
});
