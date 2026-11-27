// Tiện ích giao diện dùng chung: header, cấu hình, badge tình trạng...
(function () {
  function esc(s) {
    return String(s == null ? '' : s)
      .replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;')
      .replace(/"/g, '&quot;').replace(/'/g, '&#39;');
  }

  function statusClass(tt) {
    var t = String(tt || '').toLowerCase();
    if (t.indexOf('đang sử dụng') !== -1) return 'st-ok';
    if (t.indexOf('thanh lý') !== -1) return 'st-warn';
    if (t.indexOf('hư hỏng') !== -1 || t.indexOf('hỏng') !== -1) return 'st-bad';
    return 'st-gray';
  }

  function statusBadge(tt) {
    if (!tt) return '';
    return '<span class="badge ' + statusClass(tt) + '">' + esc(tt) + '</span>';
  }

  function detailUrl(ma) {
    return 'asset.html?id=' + encodeURIComponent(ma);
  }

  /** Link tuyệt đối tới trang chi tiết — nội dung mã QR trên tem. */
  function absoluteDetailUrl(ma) {
    var u = new URL('asset.html', document.baseURI);
    u.search = '?id=' + encodeURIComponent(ma);
    return u.href;
  }

  var metaCache = null;
  async function loadMeta(force) {
    if (metaCache && !force) return metaCache;
    try {
      var raw = sessionStorage.getItem('ts_meta');
      if (raw && !force) {
        var parsed = JSON.parse(raw);
        if (parsed && Date.now() - parsed._ts < 5 * 60 * 1000) { metaCache = parsed; return parsed; }
      }
    } catch (e) { /* bỏ qua */ }
    var meta = await window.TSApi.apiGet('meta');
    if (meta && meta.ok) {
      meta._ts = Date.now();
      metaCache = meta;
      try { sessionStorage.setItem('ts_meta', JSON.stringify(meta)); } catch (e) { /* bỏ qua */ }
    }
    return meta;
  }

  /** Điền tên đơn vị vào header + hiện cảnh báo nếu chưa cấu hình API. */
  async function renderShell() {
    var warn = document.getElementById('api-warning');
    if (!window.TSApi.hasApi()) {
      if (warn) warn.style.display = 'block';
      return null;
    }
    if (warn) warn.style.display = 'none';
    try {
      var meta = await loadMeta();
      if (meta && meta.ok && meta.config) {
        var unit = meta.config.TenDonVi || '';
        document.querySelectorAll('[data-unit]').forEach(function (el) {
          if (unit && unit.indexOf('[') !== 0) el.textContent = unit;
        });
        document.querySelectorAll('[data-subline]').forEach(function (el) {
          el.textContent = meta.config.DongDauTem || el.textContent;
        });
      }
      return meta;
    } catch (e) {
      if (warn) {
        warn.style.display = 'block';
        warn.innerHTML = 'Không tải được dữ liệu từ Apps Script. Kiểm tra URL trong <a href="settings.html">Cài đặt</a>. (' + esc(e.message) + ')';
      }
      return null;
    }
  }

  function markActiveNav() {
    var page = document.body.getAttribute('data-page') || '';
    document.querySelectorAll('nav.main-nav a').forEach(function (a) {
      if (a.getAttribute('data-nav') === page) a.classList.add('active');
    });
  }

  document.addEventListener('DOMContentLoaded', function () {
    markActiveNav();
    renderShell();
  });

  window.TS = {
    esc: esc,
    statusClass: statusClass,
    statusBadge: statusBadge,
    detailUrl: detailUrl,
    absoluteDetailUrl: absoluteDetailUrl,
    loadMeta: loadMeta,
    renderShell: renderShell
  };
})();
