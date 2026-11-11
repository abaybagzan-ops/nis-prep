/* Ядро: генератор случайных чисел, форматирование, реестр шаблонов заданий */
var NP = (typeof window !== 'undefined' ? window : globalThis).NP = {};
NP.TPL = []; NP.byId = {}; NP.PASS = {};

NP.rng = function (seed) {
  var a = seed >>> 0;
  var f = function () { a |= 0; a = a + 0x6D2B79F5 | 0; var t = Math.imul(a ^ a >>> 15, 1 | a); t = t + Math.imul(t ^ t >>> 7, 61 | t) ^ t; return ((t ^ t >>> 14) >>> 0) / 4294967296; };
  return {
    f: f,
    int: function (lo, hi) { return lo + Math.floor(f() * (hi - lo + 1)); },
    pick: function (arr) { return arr[Math.floor(f() * arr.length)]; },
    shuffle: function (arr) { arr = arr.slice(); for (var i = arr.length - 1; i > 0; i--) { var j = Math.floor(f() * (i + 1)); var t = arr[i]; arr[i] = arr[j]; arr[j] = t; } return arr; }
  };
};

NP.gcd = function (a, b) { a = Math.abs(a); b = Math.abs(b); while (b) { var t = b; b = a % b; a = t; } return a; };
NP.lcm = function (a, b) { return a / NP.gcd(a, b) * b; };

/* Число в формате KZ/RU: десятичная запятая, пробел в тысячах (от 10 000), настоящий минус */
NP.F = function (n, dec) {
  if (typeof n === 'string') return n;
  if (dec === undefined) dec = 3;
  var neg = n < 0; n = Math.abs(n);
  var p = Math.pow(10, dec); n = Math.round(n * p) / p;
  var s = String(n); var parts = s.split('.');
  var ip = parts[0];
  if (ip.length > 4) ip = ip.replace(/\B(?=(\d{3})+(?!\d))/g, ' ');
  return (neg ? '−' : '') + ip + (parts[1] ? ',' + parts[1] : '');
};

/* Дробь в виде HTML: вертикальная запись */
NP.fr = function (n, d, mixed) {
  if (d < 0) { n = -n; d = -d; }
  var g = NP.gcd(n, d); n /= g; d /= g;
  if (d === 1) return NP.F(n);
  var sign = n < 0 ? '−' : ''; n = Math.abs(n);
  if (mixed && n > d) {
    var w = Math.floor(n / d), r = n % d;
    return sign + w + '<span class="fr"><span>' + r + '</span><span>' + d + '</span></span>';
  }
  return sign + '<span class="fr"><span>' + n + '</span><span>' + d + '</span></span>';
};
/* То же простым текстом — для проверки уникальности */
NP.plain = function (html) { return String(html).replace(/<span class="fr"><span>(\d+)<\/span><span>(\d+)<\/span><\/span>/g, ' $1/$2').replace(/<\/?[a-zA-Z!][^>]*>/g, ' ').replace(/\s+/g, ' ').trim(); };

/* Русские формы множественного числа */
NP.pl = function (n, one, few, many) {
  var a = Math.abs(n) % 100, b = a % 10;
  if (a > 10 && a < 20) return many;
  if (b > 1 && b < 5) return few;
  if (b === 1) return one;
  return many;
};

NP.L = function (kk, ru) { return { kk: kk, ru: ru }; };

NP.T = function (def) {
  if (NP.byId[def.id]) throw new Error('Дубль id шаблона: ' + def.id);
  NP.TPL.push(def); NP.byId[def.id] = def;
};

/* Таблица в HTML */
NP.table = function (head, rows) {
  var h = '<div class="tblwrap"><table class="qt"><thead><tr>' + head.map(function (c) { return '<th>' + c + '</th>'; }).join('') + '</tr></thead><tbody>';
  rows.forEach(function (r) { h += '<tr>' + r.map(function (c) { return '<td>' + c + '</td>'; }).join('') + '</tr>'; });
  return h + '</tbody></table></div>';
};

/* Столбчатая диаграмма SVG; цвета берутся из CSS-переменных */
NP.bars = function (labels, values, maxV, step, unit) {
  var W = 360, H = 200, L = 40, B = 34, T = 12, R = 10;
  var cw = (W - L - R) / labels.length;
  var sy = function (v) { return H - B - (H - B - T) * v / maxV; };
  var s = '<svg class="chart" viewBox="0 0 ' + W + ' ' + H + '" role="img">';
  for (var v = 0; v <= maxV; v += step) {
    s += '<line x1="' + L + '" x2="' + (W - R) + '" y1="' + sy(v) + '" y2="' + sy(v) + '" class="grid"/>';
    s += '<text x="' + (L - 6) + '" y="' + (sy(v) + 4) + '" text-anchor="end" class="ax">' + v + '</text>';
  }
  labels.forEach(function (lb, i) {
    var x = L + i * cw + cw * 0.2, w = cw * 0.6;
    s += '<rect x="' + x + '" y="' + sy(values[i]) + '" width="' + w + '" height="' + (H - B - sy(values[i])) + '" class="bar"/>';
    s += '<text x="' + (x + w / 2) + '" y="' + (H - B + 16) + '" text-anchor="middle" class="ax">' + lb + '</text>';
  });
  if (unit) s += '<text x="' + L + '" y="' + (H - 4) + '" class="ax">' + unit + '</text>';
  return s + '</svg>';
};

NP.QCOPT = {
  kk: ['А бағанындағы шама үлкен', 'В бағанындағы шама үлкен', 'Екі шама тең', 'Ақпарат жеткіліксіз'],
  ru: ['Больше значение в колонке А', 'Больше значение в колонке В', 'Значения равны', 'Недостаточно информации']
};
NP.cmp = function (a, b) { return Math.abs(a - b) < 1e-9 ? 2 : (a > b ? 0 : 1); };

/* Сборка экземпляра задания по шаблону и зерну. Детерминирована: (id, seed) → одно и то же задание. */
NP.build = function (id, seed) {
  var tpl = NP.byId[id];
  if (!tpl) return null;
  var last = null;
  for (var k = 0; k < 40; k++) {
    var r = NP.rng((seed + k * 7919) >>> 0);
    var g = tpl.g(r);
    if (!g) continue;
    var inst = NP._assemble(tpl, g, r);
    if (inst && inst.ok) { inst.seed = seed; return inst; }
    last = inst;
  }
  if (last) { last.seed = seed; last.bad = true; }
  return last;
};

NP._assemble = function (tpl, g, r) {
  var inst = { id: tpl.id, s: tpl.s, t: tpl.t, k: tpl.k, d: tpl.d, L: {}, ok: true };
  if (tpl.s === 'qc' && g.A !== undefined) {
    inst.type = 'qc';
    var ans = g.ans !== undefined ? g.ans : NP.cmp(g.va, g.vb);
    inst.ans = ans; inst.va = g.va; inst.vb = g.vb; inst.cases = g.cases;
    ['kk', 'ru'].forEach(function (lg) {
      var pick = function (x) { return x === undefined ? '' : (typeof x === 'object' ? x[lg] : x); };
      var whys = [0, 1, 2, 3].map(function (i) {
        if (i === ans) return '';
        if (g.tl === i && g.tr) return pick(g.tr);
        return lg === 'kk' ? 'Екі бағандағы шаманы толық есептеп, содан кейін салыстырыңыз.' : 'Полностью вычислите значения в обеих колонках и только потом сравнивайте.';
      });
      inst.L[lg] = {
        stem: (g.pre ? '<div class="pre">' + pick(g.pre) + '</div>' : '') + '<div class="qc"><div class="qcc"><div class="qch">' + (lg === 'kk' ? 'А бағаны' : 'Колонка А') + '</div><div class="qcv">' + pick(g.A) + '</div></div><div class="qcc"><div class="qch">' + (lg === 'kk' ? 'В бағаны' : 'Колонка В') + '</div><div class="qcv">' + pick(g.B) + '</div></div></div>',
        opts: NP.QCOPT[lg].slice(), whys: whys, h: pick(g.h),
        e: pick(g.e) + ' ' + (lg === 'kk' ? 'Жауабы: ' : 'Ответ: ') + 'ABCD'[ans] + ' — ' + NP.QCOPT[lg][ans].toLowerCase() + '.'
      };
    });
    return inst;
  }
  inst.type = 'mc';
  var fixed = g.fixed; inst.fixed = fixed || null;
  if (g.pass) inst.pass = g.pass;
  var vals = [g.a].concat(g.w.map(function (x) { return x[0]; }));
  ['kk', 'ru'].forEach(function (lg) {
    var pv = vals.map(function (v) { return NP.plain(v !== null && typeof v === 'object' ? v[lg] : v); });
    for (var i = 0; i < pv.length; i++) { if (!pv[i]) inst.ok = false; for (var j = i + 1; j < pv.length; j++) if (pv[i] === pv[j]) inst.ok = false; }
  });
  if (vals.length !== 4) inst.ok = false;
  var order = g.keepOrder ? [0, 1, 2, 3] : r.shuffle([0, 1, 2, 3]);
  inst.ans = order.indexOf(0);
  ['kk', 'ru'].forEach(function (lg) {
    var pick = function (x) { return x === undefined ? '' : (typeof x === 'object' && x !== null && !Array.isArray(x) ? x[lg] : x); };
    var whyAll = [''].concat(g.w.map(function (x) { return pick(x[1]); }));
    var passHtml = '';
    if (g.pass && NP.PASS[g.pass]) passHtml = '<div class="passage" lang="' + NP.PASS[g.pass].lang + '"><div class="ptitle">' + NP.PASS[g.pass].title + '</div>' + NP.PASS[g.pass].html + '</div>';
    inst.L[lg] = {
      stem: passHtml + '<div class="qtext">' + pick(g.q) + '</div>',
      opts: order.map(function (o) { return pick(vals[o]); }),
      whys: order.map(function (o) { return whyAll[o]; }),
      h: pick(g.h), e: pick(g.e)
    };
  });
  return inst;
};
