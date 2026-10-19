/* دوال مشتركة */
const $ = s => document.querySelector(s);
const esc = s => String(s == null ? '' : s).replace(/[&<>"']/g, c => ({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
function normalize(s) {
  return s.trim().toLowerCase().replace(/[\u064B-\u0652\u0640]/g, '')
    .replace(/[أإآ]/g, 'ا').replace(/ة/g, 'ه').replace(/ى/g, 'ي').replace(/\s+/g, '');
}
const getL = k => { try { return localStorage.getItem(k); } catch (e) { return null; } };
const setL = (k, v) => { try { localStorage.setItem(k, v); } catch (e) {} };