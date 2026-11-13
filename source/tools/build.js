/* Сборка: dist/artifact.html (для публикации, без каркаса) и dist/nis-prep.html (автономный файл) */
const fs = require('fs'), path = require('path');
const R = f => fs.readFileSync(path.join(__dirname, '..', 'src', f), 'utf8');
const js = ['core.js', 'bank_math.js', 'bank_qc.js', 'bank_sci.js', 'bank_lang.js', 'bank_short.js', 'lessons.js', 'exam.js', 'daily.js', 'app.js'].map(R).join('\n;\n').replace(/<\/script/gi, '<\\/script');
const head = `<title>NIS Дайындық</title>
<meta name="claude:viewport-fit-sides" content="cover">
<meta name="description" content="NIS-ке түсуге дайындық: математика, сандық сипаттамалар, жаратылыстану, тілдер.">
<link rel="preconnect" href="https://fonts.googleapis.com"><link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
<link rel="stylesheet" href="https://fonts.googleapis.com/css2?family=Nunito:wght@500;600;700;800;900&display=swap">
<style>${R('style.css')}</style>`;
const body = `<div id="app"><p style="padding:24px">Жүктелуде… / Загрузка…</p></div>
<noscript><p style="padding:24px">JavaScript қосыңыз. / Включите JavaScript.</p></noscript>
<script>${js}</script>`;
fs.writeFileSync(path.join(__dirname, '..', 'dist', 'artifact.html'), head + '\n' + body + '\n');
fs.writeFileSync(path.join(__dirname, '..', 'dist', 'nis-prep.html'), `<!doctype html>
<html lang="kk"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width, initial-scale=1, viewport-fit=cover">
${head}</head><body>
${body}
</body></html>
`);
console.log('ok', fs.statSync(path.join(__dirname, '..', 'dist', 'nis-prep.html')).size, 'bytes');

/* ---- PWA-версия для хостинга: dist/site/ ---- */
const crypto = require('crypto');
const site = path.join(__dirname, '..', 'dist', 'site');
const ver = crypto.createHash('sha1').update(head + body).digest('hex').slice(0, 10);
const pwaHead = `<link rel="manifest" href="manifest.webmanifest">
<meta name="theme-color" content="#136a55">
<link rel="icon" href="icon-192.png">
<link rel="apple-touch-icon" href="apple-touch-icon.png">
<meta name="apple-mobile-web-app-capable" content="yes">
<meta name="mobile-web-app-capable" content="yes">
<meta name="apple-mobile-web-app-title" content="NIS Дайындық">
<meta name="apple-mobile-web-app-status-bar-style" content="default">`;
const swReg = `<script>if ('serviceWorker' in navigator && location.protocol !== 'file:') { window.addEventListener('load', function () { navigator.serviceWorker.register('sw.js').catch(function () {}); }); }</script>`;
fs.writeFileSync(path.join(site, 'index.html'), `<!doctype html>
<html lang="kk"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width, initial-scale=1, viewport-fit=cover">
${pwaHead}
${head}</head><body>
${body}
${swReg}
</body></html>
`);
fs.writeFileSync(path.join(site, 'manifest.webmanifest'), JSON.stringify({
  name: 'NIS-ке дайындық', short_name: 'NIS Дайындық', lang: 'kk', start_url: './', scope: './', display: 'standalone',
  background_color: '#f3f5f4', theme_color: '#136a55',
  icons: [{ src: 'icon-192.png', sizes: '192x192', type: 'image/png' }, { src: 'icon-512.png', sizes: '512x512', type: 'image/png' }, { src: 'icon-maskable-512.png', sizes: '512x512', type: 'image/png', purpose: 'maskable' }]
}, null, 2));
fs.writeFileSync(path.join(site, 'sw.js'), `/* Офлайн-режим: приложение кэшируется при первом открытии */
const CACHE = 'nis-prep-${ver}';
const SHELL = ['./', './index.html', './manifest.webmanifest', './icon-192.png', './icon-512.png', './icon-maskable-512.png', './apple-touch-icon.png'];
self.addEventListener('install', e => { e.waitUntil(caches.open(CACHE).then(c => c.addAll(SHELL)).then(() => self.skipWaiting())); });
self.addEventListener('activate', e => { e.waitUntil(caches.keys().then(ks => Promise.all(ks.filter(k => k !== CACHE).map(k => caches.delete(k)))).then(() => self.clients.claim())); });
self.addEventListener('fetch', e => {
  const req = e.request; if (req.method !== 'GET') return;
  const url = new URL(req.url);
  if (url.origin === location.origin) {
    // Сначала сеть (чтобы получать обновления), при отсутствии сети — кэш
    e.respondWith(fetch(req).then(r => { const cp = r.clone(); caches.open(CACHE).then(c => c.put(req, cp)); return r; })
      .catch(() => caches.match(req, { ignoreSearch: true }).then(r => r || caches.match('./index.html'))));
  } else if (/fonts\\.(googleapis|gstatic)\\.com$/.test(url.hostname)) {
    e.respondWith(caches.match(req).then(hit => hit || fetch(req).then(r => { const cp = r.clone(); caches.open(CACHE).then(c => c.put(req, cp)); return r; }).catch(() => hit)));
  }
});
`);
console.log('site ok, version', ver);
