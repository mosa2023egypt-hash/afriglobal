/**
 * Normalize Egyptian phone number to E.164 format (+20...)
 */
function normalizeEgyptianPhone(phone) {
    if (!phone) return phone;
    const digits = phone.replace(/\D/g, '');
    if (digits.startsWith('20') && digits.length === 12) return '+' + digits;
    if (digits.startsWith('0') && digits.length === 11) return '+20' + digits.slice(1);
    if (digits.length === 10 && digits.startsWith('1')) return '+20' + digits;
    return '+' + digits;
}

/**
 * Generate WhatsApp link from phone number
 */
function whatsappLink(phone) {
    if (!phone) return '#';
    const normalized = normalizeEgyptianPhone(phone);
    const digits = normalized.replace(/\D/g, '');
    return `https://wa.me/${digits}`;
}

module.exports = { normalizeEgyptianPhone, whatsappLink };
