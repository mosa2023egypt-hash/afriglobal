/**
 * new-app.js – مشترك لجميع صفحات new-*.html
 * يحتوي على: إدارة الجلسة (sessionStorage)، guard، logout، دوال مساعدة
 */

// ===== Session helpers =====
const Session = {
    KEY: 'afriglobal_user',
    get() { try { return JSON.parse(sessionStorage.getItem(this.KEY)); } catch { return null; } },
    set(user) { sessionStorage.setItem(this.KEY, JSON.stringify(user)); },
    clear() { sessionStorage.removeItem(this.KEY); },
    isLoggedIn() { return !!this.get(); }
};

// ===== Role helpers =====
const Roles = {
    isAdmin(r)             { return r === 'admin'; },
    isSales(r)             { return r === 'sales'; },
    isProcurement(r)       { return r === 'procurement' || r === 'procurement_manager'; },
    isProcManager(r)       { return r === 'procurement_manager'; },
    isGM(r)                { return r === 'gm'; },
    isManager(r)           { return r === 'gm' || r === 'admin' || r === 'procurement_manager'; },
    label(r) {
        return { admin: 'مدير النظام', sales: 'مبيعات', procurement: 'مشتريات',
                 procurement_manager: 'مدير المشتريات', gm: 'مدير عام' }[r] || r;
    }
};

// ===== Guard: redirect to login if no session =====
function requireAuth() {
    if (!Session.isLoggedIn()) {
        window.location.href = '/new-login.html';
        return null;
    }
    return Session.get();
}

// ===== Guard: redirect to home if already logged in =====
function requireGuest() {
    if (Session.isLoggedIn()) {
        window.location.href = '/new-home.html';
    }
}

// ===== Logout =====
function logout() {
    Session.clear();
    window.location.href = '/new-login.html';
}

// ===== Render navbar =====
function roleBadgeClass(r) {
    if (r === 'admin') return 'badge-admin';
    if (r === 'sales') return 'badge-sales';
    if (r === 'procurement' || r === 'procurement_manager') return 'badge-proc';
    return 'badge-gm';
}

function renderNavbar(user) {
    const nav = document.getElementById('navbar');
    if (!nav || !user) return;
    nav.innerHTML = `
        <span class="brand">🌍 أفري جلوبال</span>
        <span class="nav-user">👤 ${user.name} &nbsp;|&nbsp; <span class="badge ${roleBadgeClass(user.role)}">${Roles.label(user.role)}</span></span>
        <button class="btn-logout" onclick="logout()">تسجيل الخروج</button>
    `;
}

// ===== Fetch today's date from server =====
async function fetchTodayDate() {
    try {
        const res = await fetch('/api/time/today');
        const data = await res.json();
        return data.date;
    } catch {
        return new Date().toISOString().slice(0, 10);
    }
}

// ===== In-memory data stores (shared per session/tab) =====
// These are module-level arrays shared across page visits within same tab.
// For MVP, data persists only while the tab is open.

function getStore(key) {
    try { return JSON.parse(sessionStorage.getItem('store_' + key)) || []; } catch { return []; }
}
function setStore(key, arr) {
    sessionStorage.setItem('store_' + key, JSON.stringify(arr));
}

// ===== Demo Login =====
async function demoLogin(username, password) {
    const res = await fetch('/api/demo-auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ username, password })
    });
    return res.json();
}

// ===== Month filter helpers =====
function currentPeriod() {
    const d = new Date();
    return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}`;
}

function periodLabel(p) {
    if (!p) return '';
    const [y, m] = p.split('-');
    const names = ['يناير','فبراير','مارس','أبريل','مايو','يونيو','يوليو','أغسطس','سبتمبر','أكتوبر','نوفمبر','ديسمبر'];
    return `${names[parseInt(m) - 1]} ${y}`;
}

// ===== Utility: format date =====
function fmtDate(iso) {
    if (!iso) return '';
    return iso.slice(0, 10);
}

// ===== Unique ID =====
function uid() {
    return Date.now().toString(36) + Math.random().toString(36).slice(2, 6);
}
