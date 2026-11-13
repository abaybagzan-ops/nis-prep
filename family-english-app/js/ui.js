/*
 * Маленькие помощники для интерфейса: создание элементов и окно подтверждения.
 * Пользовательский текст (имя, тема) всегда вставляется как текст, не как HTML.
 */
window.FEA = window.FEA || {};

FEA.ui = (function () {
  function h(tag, attrs) {
    var el = document.createElement(tag);
    attrs = attrs || {};
    Object.keys(attrs).forEach(function (k) {
      var v = attrs[k];
      if (v === null || v === undefined || v === false) return;
      if (k === 'class') el.className = v;
      else if (k.indexOf('on') === 0 && typeof v === 'function') el.addEventListener(k.slice(2), v);
      else if (k === 'value') el.value = v;
      else if (k === 'disabled') el.disabled = !!v;
      else if (k === 'html') el.innerHTML = v; // только для статичных SVG из кода
      else el.setAttribute(k, v === true ? '' : v);
    });
    for (var i = 2; i < arguments.length; i++) append(el, arguments[i]);
    return el;
  }

  function append(el, child) {
    if (child === null || child === undefined || child === false) return;
    if (Array.isArray(child)) { child.forEach(function (c) { append(el, c); }); return; }
    if (typeof child === 'string' || typeof child === 'number') { el.appendChild(document.createTextNode(String(child))); return; }
    el.appendChild(child);
  }

  /* Окно подтверждения. Возвращает Promise<boolean>. */
  function confirmDialog(opts) {
    return new Promise(function (resolve) {
      var prev = document.activeElement;
      function close(result) {
        overlay.remove();
        document.removeEventListener('keydown', onKey);
        if (prev && prev.focus) prev.focus();
        resolve(result);
      }
      function onKey(e) { if (e.key === 'Escape') close(false); }
      var okBtn = h('button', { class: 'btn ' + (opts.danger ? 'btn-danger' : 'btn-primary'), onclick: function () { close(true); } }, opts.ok || 'Иә');
      var overlay = h('div', { class: 'modal-overlay', role: 'dialog', 'aria-modal': 'true', 'aria-labelledby': 'modal-title' },
        h('div', { class: 'modal' },
          h('h2', { id: 'modal-title', class: 'modal-title' }, opts.title),
          opts.text ? h('p', { class: 'muted' }, opts.text) : null,
          h('div', { class: 'modal-actions' },
            h('button', { class: 'btn btn-ghost', onclick: function () { close(false); } }, opts.cancel || 'Бас тарту'),
            okBtn
          )
        )
      );
      overlay.addEventListener('click', function (e) { if (e.target === overlay) close(false); });
      document.addEventListener('keydown', onKey);
      document.body.appendChild(overlay);
      okBtn.focus();
    });
  }

  return { h: h, confirmDialog: confirmDialog };
})();
