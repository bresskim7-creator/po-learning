// ===================================================================
// [v5.60] PO 성장 기록 모듈 (키·몸무게)
// - 입력: 누구나 (안전장치 3단: 절대범위 / 변동경고 / 저장전 컨펌)
// - 수정·삭제: 부모 PIN (index.html의 openPinDialog 콜백 경유)
// - 저장: localStorage(po_v5_growth_records) + Google Sheets sync
//   (펜딩 큐 po_v5_growth_pending)
// - getSettings()는 index.html 측 함수에 의존
// ===================================================================

var GROWTH_KEY = 'po_v5_growth_records';
var GROWTH_PENDING_KEY = 'po_v5_growth_pending';
var GROWTH_LIMITS = {
  heightMin: 100, heightMax: 200,
  weightMin: 15,  weightMax: 150,
  warnDeltaHeightCm: 3,
  warnDeltaWeightKg: 3,
  warnWindowDays: 30
};

var growthModalCtx = { mode: 'add', recordId: null };

// --- 저장소 ---
function loadGrowthRecords() {
  try {
    var arr = JSON.parse(localStorage.getItem(GROWTH_KEY) || '[]');
    if (!Array.isArray(arr)) return [];
    return arr;
  } catch(e) { return []; }
}

function saveGrowthRecords(arr) {
  localStorage.setItem(GROWTH_KEY, JSON.stringify(arr));
}

function loadGrowthPending() {
  try {
    var arr = JSON.parse(localStorage.getItem(GROWTH_PENDING_KEY) || '[]');
    if (!Array.isArray(arr)) return [];
    return arr;
  } catch(e) { return []; }
}

function saveGrowthPending(arr) {
  localStorage.setItem(GROWTH_PENDING_KEY, JSON.stringify(arr));
}

// --- 정렬 / 조회 ---
function getGrowthSortedAsc() {
  return loadGrowthRecords().slice().sort(function(a, b) {
    return (a.date || '').localeCompare(b.date || '');
  });
}

function getGrowthSortedDesc() {
  return loadGrowthRecords().slice().sort(function(a, b) {
    return (b.date || '').localeCompare(a.date || '');
  });
}

function findGrowthById(id) {
  var all = loadGrowthRecords();
  for (var i = 0; i < all.length; i++) {
    if (all[i].id === id) return all[i];
  }
  return null;
}

// --- 진입 ---
function openGrowthPage() {
  renderGrowthPage();
  showPage('page-growth');
}

function updateGrowthTileSub() {
  var sub = document.getElementById('tile-growth-sub');
  if (!sub) return;
  var all = getGrowthSortedDesc();
  if (all.length === 0) {
    sub.textContent = '기록을 시작해보자';
  } else {
    var latest = all[0];
    sub.textContent = '최근: ' + formatGrowthDate(latest.date) + ' · ' +
      formatGrowthNumber(latest.heightCm) + 'cm · ' + formatGrowthNumber(latest.weightKg) + 'kg';
  }
}

// --- 렌더링 ---
function renderGrowthPage() {
  renderGrowthSummary();
  renderGrowthChart('growth-chart-height', 'heightCm');
  renderGrowthChart('growth-chart-weight', 'weightKg');
  renderGrowthList();
}

function renderGrowthSummary() {
  var el = document.getElementById('growth-summary');
  if (!el) return;
  var asc = getGrowthSortedAsc();
  if (asc.length === 0) {
    el.innerHTML = '<div class="gs-empty">아직 기록이 없어요. 우상단 "+ 새 기록"으로 시작해보자.</div>';
    return;
  }
  var latest = asc[asc.length - 1];
  var prev = asc.length >= 2 ? asc[asc.length - 2] : null;
  function deltaHtml(curr, prevVal, unit) {
    if (prevVal == null) return '';
    var d = curr - prevVal;
    if (Math.abs(d) < 0.05) return '<div class="gs-delta">+0' + unit + '</div>';
    var sign = d > 0 ? '+' : '';
    var cls = d >= 0 ? '' : ' neg';
    return '<div class="gs-delta' + cls + '">' + sign + d.toFixed(1) + unit + '</div>';
  }
  el.innerHTML =
    '<div class="gs-item">' +
      '<div class="gs-label">측정일</div>' +
      '<div class="gs-value" style="font-size:16px;">' + formatGrowthDate(latest.date) + '</div>' +
    '</div>' +
    '<div class="gs-item">' +
      '<div class="gs-label">키</div>' +
      '<div class="gs-value">' + formatGrowthNumber(latest.heightCm) + ' <span style="font-size:14px;color:#888;">cm</span></div>' +
      deltaHtml(latest.heightCm, prev && prev.heightCm, 'cm') +
    '</div>' +
    '<div class="gs-item">' +
      '<div class="gs-label">몸무게</div>' +
      '<div class="gs-value">' + formatGrowthNumber(latest.weightKg) + ' <span style="font-size:14px;color:#888;">kg</span></div>' +
      deltaHtml(latest.weightKg, prev && prev.weightKg, 'kg') +
    '</div>';
}

function renderGrowthChart(svgId, field) {
  var svg = document.getElementById(svgId);
  if (!svg) return;
  while (svg.firstChild) svg.removeChild(svg.firstChild);
  var asc = getGrowthSortedAsc();
  var W = 400, H = 140;
  var pad = { left: 36, right: 12, top: 14, bottom: 22 };
  var innerW = W - pad.left - pad.right;
  var innerH = H - pad.top - pad.bottom;
  var NS = 'http://www.w3.org/2000/svg';

  if (asc.length === 0) {
    var t = document.createElementNS(NS, 'text');
    t.setAttribute('x', W / 2); t.setAttribute('y', H / 2);
    t.setAttribute('text-anchor', 'middle'); t.setAttribute('fill', '#bbb');
    t.setAttribute('font-size', '12'); t.textContent = '기록 없음';
    svg.appendChild(t); return;
  }

  var values = asc.map(function(r) { return r[field]; });
  var dates = asc.map(function(r) { return r.date; });
  var minV = Math.min.apply(null, values);
  var maxV = Math.max.apply(null, values);
  if (minV === maxV) { minV -= 1; maxV += 1; }
  var range = maxV - minV;
  var padR = range * 0.15;
  minV -= padR; maxV += padR;

  var firstT = Date.parse(dates[0]);
  var lastT = Date.parse(dates[dates.length - 1]);
  var span = Math.max(1, lastT - firstT);

  function xOf(i) {
    if (asc.length === 1) return pad.left + innerW / 2;
    var ti = Date.parse(dates[i]);
    return pad.left + ((ti - firstT) / span) * innerW;
  }
  function yOf(v) {
    return pad.top + (1 - (v - minV) / (maxV - minV)) * innerH;
  }

  var ticks = [minV, (minV + maxV) / 2, maxV];
  ticks.forEach(function(tv) {
    var y = yOf(tv);
    var line = document.createElementNS(NS, 'line');
    line.setAttribute('x1', pad.left); line.setAttribute('x2', W - pad.right);
    line.setAttribute('y1', y); line.setAttribute('y2', y);
    line.setAttribute('stroke', '#EEE'); line.setAttribute('stroke-width', '1');
    svg.appendChild(line);
    var lbl = document.createElementNS(NS, 'text');
    lbl.setAttribute('x', pad.left - 4); lbl.setAttribute('y', y + 3);
    lbl.setAttribute('text-anchor', 'end'); lbl.setAttribute('fill', '#aaa');
    lbl.setAttribute('font-size', '10'); lbl.textContent = tv.toFixed(1);
    svg.appendChild(lbl);
  });

  function shortDate(d) {
    var p = (d || '').split('-');
    if (p.length !== 3) return d || '';
    return p[1] + '/' + p[2];
  }
  var lblL = document.createElementNS(NS, 'text');
  lblL.setAttribute('x', pad.left); lblL.setAttribute('y', H - 6);
  lblL.setAttribute('fill', '#999'); lblL.setAttribute('font-size', '10');
  lblL.textContent = shortDate(dates[0]); svg.appendChild(lblL);
  if (dates.length > 1) {
    var lblR = document.createElementNS(NS, 'text');
    lblR.setAttribute('x', W - pad.right); lblR.setAttribute('y', H - 6);
    lblR.setAttribute('text-anchor', 'end'); lblR.setAttribute('fill', '#999');
    lblR.setAttribute('font-size', '10');
    lblR.textContent = shortDate(dates[dates.length - 1]); svg.appendChild(lblR);
  }

  if (asc.length >= 2) {
    var d2 = '';
    for (var i = 0; i < asc.length; i++) {
      d2 += (i === 0 ? 'M' : 'L') + xOf(i).toFixed(1) + ',' + yOf(values[i]).toFixed(1) + ' ';
    }
    var path = document.createElementNS(NS, 'path');
    path.setAttribute('d', d2.trim()); path.setAttribute('fill', 'none');
    path.setAttribute('stroke', '#4A90D9'); path.setAttribute('stroke-width', '2');
    path.setAttribute('stroke-linecap', 'round'); path.setAttribute('stroke-linejoin', 'round');
    svg.appendChild(path);
  }

  for (var j = 0; j < asc.length; j++) {
    var c = document.createElementNS(NS, 'circle');
    c.setAttribute('cx', xOf(j)); c.setAttribute('cy', yOf(values[j]));
    c.setAttribute('r', '3'); c.setAttribute('fill', '#4A90D9');
    svg.appendChild(c);
  }
}

function renderGrowthList() {
  var ul = document.getElementById('growth-list');
  if (!ul) return;
  var desc = getGrowthSortedDesc();
  if (desc.length === 0) {
    ul.innerHTML = '<li class="growth-list-empty">기록이 없습니다.</li>';
    return;
  }
  ul.innerHTML = '';
  desc.forEach(function(rec) {
    var li = document.createElement('li');
    li.className = 'growth-list-item';
    var unsynced = rec.syncedAt ? '' : '<span class="growth-sync-badge" title="아직 시트에 업로드되지 않음">⏳</span>';
    li.innerHTML =
      '<span class="gli-date">' + formatGrowthDate(rec.date) + unsynced + '</span>' +
      '<span class="gli-values">' + formatGrowthNumber(rec.heightCm) + ' cm · ' + formatGrowthNumber(rec.weightKg) + ' kg</span>' +
      '<button type="button" class="gli-edit" data-id="' + escapeGrowthAttr(rec.id) + '">수정</button>' +
      '<button type="button" class="gli-del" data-id="' + escapeGrowthAttr(rec.id) + '">삭제</button>';
    ul.appendChild(li);
  });
  Array.prototype.forEach.call(ul.querySelectorAll('.gli-edit'), function(btn) {
    btn.addEventListener('click', function() {
      var id = btn.getAttribute('data-id');
      openPinDialog(function() { openGrowthInputModal('edit', id); });
    });
  });
  Array.prototype.forEach.call(ul.querySelectorAll('.gli-del'), function(btn) {
    btn.addEventListener('click', function() {
      var id = btn.getAttribute('data-id');
      openPinDialog(function() { openGrowthInputModal('delete', id); });
    });
  });
}

// --- 모달 ---
function openGrowthInputModal(mode, recordId) {
  growthModalCtx = { mode: mode || 'add', recordId: recordId || null };
  var titleEl = document.getElementById('growth-modal-title');
  var bodyEl = document.getElementById('growth-modal-body');
  var btnsEl = document.getElementById('growth-modal-buttons');

  if (mode === 'delete') {
    var rec = findGrowthById(recordId);
    if (!rec) { alert('기록을 찾을 수 없습니다.'); return; }
    titleEl.textContent = '기록 삭제';
    bodyEl.innerHTML =
      '<div class="gm-readonly">' +
        '<div>' + formatGrowthDate(rec.date) + '</div>' +
        '<div>' + formatGrowthNumber(rec.heightCm) + ' cm · ' + formatGrowthNumber(rec.weightKg) + ' kg</div>' +
      '</div>' +
      '<div class="gm-msg" id="growth-modal-msg">정말 삭제할까요? 되돌릴 수 없습니다.</div>';
    btnsEl.innerHTML =
      '<button type="button" class="gm-btn gm-cancel" onclick="closeGrowthModal()">취소</button>' +
      '<button type="button" class="gm-btn gm-danger" onclick="confirmGrowthDelete()">삭제</button>';
  } else {
    titleEl.textContent = (mode === 'edit') ? '기록 수정' : '새 기록';
    bodyEl.innerHTML =
      '<label for="growth-input-date">날짜</label>' +
      '<input type="date" id="growth-input-date">' +
      '<label for="growth-input-height">키 (cm)</label>' +
      '<input type="number" id="growth-input-height" inputmode="decimal" step="0.1" min="50" max="220" placeholder="예: 142.3">' +
      '<label for="growth-input-weight">몸무게 (kg)</label>' +
      '<input type="number" id="growth-input-weight" inputmode="decimal" step="0.1" min="10" max="200" placeholder="예: 35.2">' +
      '<div class="gm-msg" id="growth-modal-msg"></div>';
    btnsEl.innerHTML =
      '<button type="button" class="gm-btn gm-cancel" onclick="closeGrowthModal()">취소</button>' +
      '<button type="button" class="gm-btn gm-confirm" onclick="submitGrowthForm()">저장</button>';

    var dateEl = document.getElementById('growth-input-date');
    var hEl = document.getElementById('growth-input-height');
    var wEl = document.getElementById('growth-input-weight');
    if (mode === 'edit') {
      var rec2 = findGrowthById(recordId);
      if (!rec2) { alert('기록을 찾을 수 없습니다.'); return; }
      dateEl.value = rec2.date;
      hEl.value = rec2.heightCm;
      wEl.value = rec2.weightKg;
    } else {
      dateEl.value = todayIsoLocalGrowth();
      hEl.value = '';
      wEl.value = '';
    }
  }

  document.getElementById('growth-modal-overlay').classList.add('active');
}

function closeGrowthModal() {
  document.getElementById('growth-modal-overlay').classList.remove('active');
  growthModalCtx = { mode: 'add', recordId: null };
}

// --- 검증 ---
function validateGrowthValues(date, h, w) {
  if (!date || !/^\d{4}-\d{2}-\d{2}$/.test(date)) return '날짜를 입력해주세요.';
  if (!isFinite(h) || !isFinite(w)) return '키와 몸무게를 숫자로 입력해주세요.';
  if (h < GROWTH_LIMITS.heightMin || h > GROWTH_LIMITS.heightMax) {
    return '키는 ' + GROWTH_LIMITS.heightMin + '~' + GROWTH_LIMITS.heightMax + 'cm 범위로 입력해주세요.';
  }
  if (w < GROWTH_LIMITS.weightMin || w > GROWTH_LIMITS.weightMax) {
    return '몸무게는 ' + GROWTH_LIMITS.weightMin + '~' + GROWTH_LIMITS.weightMax + 'kg 범위로 입력해주세요.';
  }
  return null;
}

function checkGrowthChangeWarning(date, h, w, excludeId) {
  var asc = getGrowthSortedAsc().filter(function(r) {
    if (excludeId && r.id === excludeId) return false;
    return (r.date || '') < date;
  });
  if (asc.length === 0) return null;
  var prev = asc[asc.length - 1];
  var msDay = 86400000;
  var dayDiff = Math.round((Date.parse(date) - Date.parse(prev.date)) / msDay);
  if (dayDiff > GROWTH_LIMITS.warnWindowDays) return null;
  var dh = Math.abs(h - prev.heightCm);
  var dw = Math.abs(w - prev.weightKg);
  if (dh < GROWTH_LIMITS.warnDeltaHeightCm && dw < GROWTH_LIMITS.warnDeltaWeightKg) return null;
  return {
    prev: prev,
    dayDiff: dayDiff,
    dh: h - prev.heightCm,
    dw: w - prev.weightKg
  };
}

// --- 저장 처리 ---
function submitGrowthForm() {
  var msgEl = document.getElementById('growth-modal-msg');
  var dateEl = document.getElementById('growth-input-date');
  var hEl = document.getElementById('growth-input-height');
  var wEl = document.getElementById('growth-input-weight');
  if (msgEl) msgEl.textContent = '';

  var date = (dateEl.value || '').trim();
  var h = parseFloat(hEl.value);
  var w = parseFloat(wEl.value);
  var err = validateGrowthValues(date, h, w);
  if (err) { if (msgEl) msgEl.textContent = err; return; }

  var all = loadGrowthRecords();
  var dupeId = null;
  for (var i = 0; i < all.length; i++) {
    if (all[i].date === date) { dupeId = all[i].id; break; }
  }
  if (growthModalCtx.mode === 'add' && dupeId) {
    if (msgEl) msgEl.textContent = '이 날짜에 이미 기록이 있어요. 부모 PIN으로 수정해야 해요.';
    return;
  }
  if (growthModalCtx.mode === 'edit' && dupeId && dupeId !== growthModalCtx.recordId) {
    if (msgEl) msgEl.textContent = '같은 날짜에 다른 기록이 이미 있어요.';
    return;
  }

  var warn = checkGrowthChangeWarning(date, h, w, growthModalCtx.mode === 'edit' ? growthModalCtx.recordId : null);
  if (warn) {
    var dhTxt = (warn.dh >= 0 ? '+' : '') + warn.dh.toFixed(1) + 'cm';
    var dwTxt = (warn.dw >= 0 ? '+' : '') + warn.dw.toFixed(1) + 'kg';
    var ok = confirm(
      warn.dayDiff + '일 전(' + formatGrowthDate(warn.prev.date) + ') 대비\n' +
      '키 ' + dhTxt + ' / 몸무게 ' + dwTxt + '\n' +
      '변동이 큰 것 같아요. 정말 맞으면 확인을 눌러주세요.'
    );
    if (!ok) return;
  }

  var confirmMsg = '아래 값으로 저장할게요.\n\n' +
    '날짜: ' + formatGrowthDate(date) + '\n' +
    '키: ' + formatGrowthNumber(h) + ' cm\n' +
    '몸무게: ' + formatGrowthNumber(w) + ' kg';
  if (!confirm(confirmMsg)) return;

  if (growthModalCtx.mode === 'edit') {
    applyGrowthUpdate(growthModalCtx.recordId, date, h, w);
  } else {
    applyGrowthInsert(date, h, w);
  }
  closeGrowthModal();
  renderGrowthPage();
  updateGrowthTileSub();
}

function applyGrowthInsert(date, h, w) {
  var id = 'gr_' + date.replace(/-/g, '') + '_' + Math.random().toString(36).slice(2, 8);
  var nowIso = new Date().toISOString();
  var rec = {
    id: id,
    date: date,
    heightCm: Math.round(h * 10) / 10,
    weightKg: Math.round(w * 10) / 10,
    createdAt: nowIso,
    createdBy: 'child',
    syncedAt: null
  };
  var all = loadGrowthRecords();
  all.push(rec);
  saveGrowthRecords(all);
  enqueueGrowthSync({ action: 'insert', record: rec });
}

function applyGrowthUpdate(id, date, h, w) {
  var all = loadGrowthRecords();
  for (var i = 0; i < all.length; i++) {
    if (all[i].id === id) {
      all[i].date = date;
      all[i].heightCm = Math.round(h * 10) / 10;
      all[i].weightKg = Math.round(w * 10) / 10;
      all[i].updatedAt = new Date().toISOString();
      all[i].syncedAt = null;
      saveGrowthRecords(all);
      enqueueGrowthSync({ action: 'update', record: all[i] });
      return;
    }
  }
}

function confirmGrowthDelete() {
  var id = growthModalCtx.recordId;
  if (!id) { closeGrowthModal(); return; }
  var rec = findGrowthById(id);
  var all = loadGrowthRecords().filter(function(r) { return r.id !== id; });
  saveGrowthRecords(all);
  enqueueGrowthSync({ action: 'delete', record: {
    id: id,
    date: rec ? rec.date : '',
    heightCm: rec ? rec.heightCm : 0,
    weightKg: rec ? rec.weightKg : 0,
    createdBy: rec ? rec.createdBy : ''
  }});
  closeGrowthModal();
  renderGrowthPage();
  updateGrowthTileSub();
}

// --- 동기화 (Google Sheets) ---
function enqueueGrowthSync(item) {
  var pending = loadGrowthPending();
  pending.push({ ts: Date.now(), action: item.action, record: item.record });
  saveGrowthPending(pending);
  retryPendingGrowth();
}

async function retryPendingGrowth() {
  var pending = loadGrowthPending();
  if (pending.length === 0) return;
  if (typeof getSettings !== 'function') return;
  var s = getSettings();
  if (!s || !s.sheetsUrl) return;
  var stillPending = [];
  for (var i = 0; i < pending.length; i++) {
    var item = pending[i];
    try {
      var resp = await fetch(s.sheetsUrl, {
        method: 'POST',
        headers: { 'Content-Type': 'text/plain' },
        body: JSON.stringify({ type: 'growth', action: item.action, record: item.record })
      });
      if (resp.ok) {
        if (item.action !== 'delete') {
          var all = loadGrowthRecords();
          for (var j = 0; j < all.length; j++) {
            if (all[j].id === item.record.id) {
              all[j].syncedAt = new Date().toISOString();
              break;
            }
          }
          saveGrowthRecords(all);
        }
      } else {
        stillPending.push(item);
      }
    } catch(e) {
      stillPending.push(item);
    }
  }
  saveGrowthPending(stillPending);
  var pg = document.getElementById('page-growth');
  if (pg && pg.classList.contains('active')) {
    renderGrowthList();
  }
}

// --- 유틸 ---
function todayIsoLocalGrowth() {
  var d = new Date();
  var y = d.getFullYear();
  var m = String(d.getMonth() + 1).padStart(2, '0');
  var day = String(d.getDate()).padStart(2, '0');
  return y + '-' + m + '-' + day;
}

function formatGrowthDate(iso) {
  if (!iso) return '';
  var p = iso.split('-');
  if (p.length !== 3) return iso;
  return p[0] + '. ' + p[1] + '. ' + p[2];
}

function formatGrowthNumber(v) {
  if (v == null || !isFinite(v)) return '-';
  return (Math.round(v * 10) / 10).toFixed(1);
}

function escapeGrowthAttr(s) {
  return String(s).replace(/[&<>"']/g, function(c) {
    return { '&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;' }[c];
  });
}
