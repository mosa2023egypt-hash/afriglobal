// app.js – shared auth utilities (session stored in localStorage)

const AG_SESSION_KEY = 'ag_session';
const AG_LANG_KEY    = 'ag_lang';

const AG_USERS = [
    { username: 'admin',       password: 'admin123', role: 'admin',       nameAr: 'مدير النظام',      nameEn: 'System Admin' },
    { username: 'accountant',  password: 'acc123',   role: 'accountant',  nameAr: 'المحاسب',          nameEn: 'Accountant' },
    { username: 'procurement', password: 'proc123',  role: 'procurement', nameAr: 'مسؤول المشتريات', nameEn: 'Procurement Officer' },
    { username: 'warehouse',   password: 'ware123',  role: 'warehouse',   nameAr: 'مسؤول المخزن',    nameEn: 'Warehouse Manager' },
    { username: 'sales',       password: 'sales123', role: 'sales',       nameAr: 'مسؤول المبيعات',  nameEn: 'Sales Officer' },
];

function agLogin(username, password) {
    const user = AG_USERS.find(u => u.username === username && u.password === password);
    if (!user) return false;
    localStorage.setItem(AG_SESSION_KEY, JSON.stringify({
        username: user.username,
        role:     user.role,
        nameAr:   user.nameAr,
        nameEn:   user.nameEn,
        loginTime: Date.now(),
    }));
    return true;
}

function agLogout() {
    localStorage.removeItem(AG_SESSION_KEY);
    window.location.href = 'index.html';
}

function agGetSession() {
    try { return JSON.parse(localStorage.getItem(AG_SESSION_KEY)); } catch { return null; }
}

function agRequireAuth() {
    if (!agGetSession()) window.location.href = 'index.html';
}