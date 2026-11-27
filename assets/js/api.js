// Lớp gọi API Apps Script dùng chung cho mọi trang.
(function () {
  function apiUrl() {
    var u = '';
    try { u = localStorage.getItem('ts_api_url') || ''; } catch (e) { /* bỏ qua */ }
    if (!u && window.APP_CONFIG) u = window.APP_CONFIG.API_URL || '';
    return String(u).trim();
  }

  function hasApi() {
    return apiUrl().indexOf('script.google.com') !== -1;
  }

  function setApiUrl(u) {
    try {
      if (u) localStorage.setItem('ts_api_url', String(u).trim());
      else localStorage.removeItem('ts_api_url');
    } catch (e) { /* bỏ qua */ }
  }

  async function request(url, options) {
    var res;
    try {
      res = await fetch(url, options);
    } catch (e) {
      throw new Error('Không kết nối được tới máy chủ dữ liệu. Kiểm tra mạng và thử lại.');
    }
    var text = await res.text();
    var data;
    try {
      data = JSON.parse(text);
    } catch (e) {
      throw new Error('Máy chủ dữ liệu trả về dữ liệu không hợp lệ. Kiểm tra lại URL Apps Script trong trang Cài đặt (phải là URL Web App /exec và đã deploy dạng Anyone).');
    }
    return data;
  }

  async function apiGet(action, params) {
    if (!hasApi()) throw new Error('Chưa cấu hình URL Apps Script. Vào trang Cài đặt để nhập URL Web App.');
    var qs = new URLSearchParams();
    qs.set('action', action);
    if (params) Object.keys(params).forEach(function (k) {
      if (params[k] !== undefined && params[k] !== null && params[k] !== '') qs.set(k, params[k]);
    });
    return request(apiUrl() + '?' + qs.toString(), { method: 'GET' });
  }

  async function apiPost(action, body) {
    if (!hasApi()) throw new Error('Chưa cấu hình URL Apps Script. Vào trang Cài đặt để nhập URL Web App.');
    var payload = Object.assign({ action: action }, body || {});
    // text/plain để tránh CORS preflight với Apps Script
    return request(apiUrl(), {
      method: 'POST',
      headers: { 'Content-Type': 'text/plain;charset=utf-8' },
      body: JSON.stringify(payload)
    });
  }

  window.TSApi = { apiUrl: apiUrl, hasApi: hasApi, setApiUrl: setApiUrl, apiGet: apiGet, apiPost: apiPost };
})();
