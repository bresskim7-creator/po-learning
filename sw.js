// PO 학습 시스템 Service Worker
// v5.66.0 (2026-05-25): 말하기 개편 Phase 2a — 자율학습 판정 루프 (T1·T3·T2·T6·T5·T11·T9·T12·T13a). 3-state scheduler 전이 (learning↔auto_stable↔maintenance) + qualifying attempt (KST 00:00 day-key, sameDayDuplicate·scaffold·preReveal·modelReplayGt2·bonusPractice disqualify) + 비대칭 reset (probe miss vs self 다르게) + probe 출현 (mastery_gate + delayed_review, risk_gate Phase 2b 활성화) + phonetic_text_choice 3지선다 UI Step 6 (1.5s/2.5s pause) + scheduler-aware queue builder (learning · maintenance due · auto_stable excluded · bonus practice 4분리, bonus는 transition evidence 미반영) + writer payload 흐름 (schedulerStateBefore/After 실값, summary qualifyingAttempts·probesShown·probesCorrect 실값) + progress drift detection (cover_read_events 최신 20개 scan, console.warn 1회). spec v1.2 §2.2·§2.3·§2.4·§3.3·§3.5·§3.6·§3.7·§4.2·§11-3 정합. Phase 2b (calibration risk telemetry) · Phase 2c (Sheets upload) · Phase 3 (부모 audit UI) 제외.
// 이전 v5.65.3 (2026-05-23): Step 5 사용자 행동 안내 보강 + 버튼 문구 문법 정합화. selfPlayedOnce=true 메시지에 "아래 버튼을 누르면 다음 단어로 가" 추가 (사용자 "왜 안 넘어가지?" 신호 부재 보강). 버튼 라벨 "같게/다르게" → "같았어 ▶/달랐어 ▶" (질문 과거형 "같았어?" ↔ 응답 부사형 불일치 정정 + 화살표로 진행 신호). data 값 'same'/'different' 와 attempt event selfCompareRating 계약 불변 (closure memo §2-1). UI 라벨 ↔ 데이터 계약 분리.
// 이전 v5.65.2 (2026-05-23): cover_read UI 클릭 4건으로 감소 — Step 3→4(모범 TTS 종료) + Step 4→5(자기 녹음 재생 종료) 자동 전환 (PAUSE_AFTER_TTS_MS=1500 / PAUSE_AFTER_SELF_PLAY_MS=1500). Step 5에 🔊 모범 다시 듣기 버튼 추가 (modelReplayCount 누적·비교 능력 보존). 자기 녹음 onerror/play-reject 시 selfPlayFailed=true → Step 5에서 같게 disabled 유지 + 🎤 다시 녹음 버튼 노출. self-playback guardrail (§3.4 의식적 자기 청취) 유지. 자동 자기 재생 추가 안 함. attempt event schema 불변.
// 이전 v5.65.1 (2026-05-23): cover_read 활성 시 초기 파일럿 — Block 1 legacy quiz·Block 2 LR 모두 0장 기본 숨김 (config.json speakingPractice.coverReadLegacyQuizCardsPerSession=0 + coverReadLRCardsPerSession=0 신규 키). Block 2 LR cap 분기는 zero-safe typeof===number + 0~2 clamp + fallback 1. cover_read 비활성 시 기존 LR 3장 유지.
// 이전 v5.65.0 (2026-05-22 v7): 말하기 개편 Phase 1 — cover_read 첫 production loop + self-playback guardrail + RA 슬롯 교대 + legacy quiz count cap + IndexedDB v2 local write-path. Phase 2/3 (probe·scheduler·calibration risk·Sheets summary·부모 audit) 제외. closure memo §4 완료 기준 8건 + task spec 추가 검증 4건 충족.
// 이전 v5.64.7 (2026-05-22 v5): isChildVisibleCard()에 error_found 차단 line 추가 (Codex 2026-05-22 자문 §11-7 권고 + 사용자 결정). parentOnly와 의미 분리 주석 명시. 농짱짱 카드(crd_2026W14_sth_phon_06)는 disabled:true로 이미 차단되어 있었으나, error_found 자체가 노출 경로에 들어가는 정책 안전망 보강.
// 이전 v5.64.6 (2026-05-22): 개념 정리 과학 U4 5장 추가 (하루 동안 태양·별 위치 변화·지구의 자전·낮과 밤·지구의 공전·계절별 별자리) + index.html CONCEPT_UNIT_TITLE 'science::U4': '지구의 운동' 추가
// 이전 v5.64.5 (2026-05-20): 개념 정리 과학 U3 7장 추가 (세포·뿌리·줄기·잎 광합성·잎 증산 작용·꽃·식물 기관 연결성) + U2 라벨 정합화('물체의 운동'). U2 카드 #5(속력과 안전)는 사용자 결정으로 제외.
// 이전 v5.64.4 (2026-05-18): 개념 정리 과학 U2 4장 추가 (운동의 정의·운동의 표현·빠르기 비교·속력)
// 이전 v5.64.3 (2026-05-17): science.json sourceUnit 정합화 (37장) — U3·U4 단원 카드 0장 누수 해결, U2 부당 disabled 8장 복구, sci_u5 5장 disabled 통일
// 이전 v5.64.2 (2026-05-17): 개념정리 "관련 문제 풀어보기" 단원 내 미니 세션 (relatedCardIds 기반) 수정
// 이전 v5.64.1 (2026-05-17): index.html 중복 tail 정정
// 이전 v5.64 (2026-05-17): 개념 정리 v1 (과학 U1 5장) 추가
// 이전 v5.63 (2026-05-15): 성장 기록 Google Sheets 내려받기 반영
const CACHE_NAME = 'po-learning-v5660';
const PRECACHE = [
  './',
  './index.html',
  './growth.js',
  './config.json',
  './english.json',
  './comprehension.json',
  './phrase-pool.json',
  './speech-therapy.json',
  './social-studies.json',
  './science.json',
  './weekly-anchor.json',
  './concept-cards.json',
  './concept-images/science/U1/cncpt_sci_u1_001.webp',
  './concept-images/science/U1/cncpt_sci_u1_002.webp',
  './concept-images/science/U1/cncpt_sci_u1_003.webp',
  './concept-images/science/U1/cncpt_sci_u1_004.webp',
  './concept-images/science/U1/cncpt_sci_u1_005.webp',
  './concept-images/science/U2/cncpt_sci_u2_001.webp',
  './concept-images/science/U2/cncpt_sci_u2_002.webp',
  './concept-images/science/U2/cncpt_sci_u2_003.webp',
  './concept-images/science/U2/cncpt_sci_u2_004.webp',
  './concept-images/science/U3/cncpt_sci_u3_001.webp',
  './concept-images/science/U3/cncpt_sci_u3_002.webp',
  './concept-images/science/U3/cncpt_sci_u3_003.webp',
  './concept-images/science/U3/cncpt_sci_u3_004.webp',
  './concept-images/science/U3/cncpt_sci_u3_005.webp',
  './concept-images/science/U3/cncpt_sci_u3_006.webp',
  './concept-images/science/U3/cncpt_sci_u3_007.webp',
  './concept-images/science/U4/cncpt_sci_u4_001.webp',
  './concept-images/science/U4/cncpt_sci_u4_002.webp',
  './concept-images/science/U4/cncpt_sci_u4_003.webp',
  './concept-images/science/U4/cncpt_sci_u4_004.webp',
  './concept-images/science/U4/cncpt_sci_u4_005.webp',
];

self.addEventListener('install', event => {
  event.waitUntil(
    caches.open(CACHE_NAME).then(cache => cache.addAll(PRECACHE))
  );
  self.skipWaiting();
});

self.addEventListener('activate', event => {
  event.waitUntil(
    caches.keys().then(keys =>
      Promise.all(keys.filter(k => k !== CACHE_NAME).map(k => caches.delete(k)))
    )
  );
  self.clients.claim();
});

self.addEventListener('fetch', event => {
  const req = event.request;
  const url = new URL(req.url);

  // POST 등 비GET은 캐싱하지 않고 네트워크 직행
  if (req.method !== 'GET') {
    event.respondWith(fetch(req));
    return;
  }

  // cross-origin 또는 /api/ 는 캐시하지 않음
  if (url.origin !== self.location.origin || url.pathname.startsWith('/api/')) {
    event.respondWith(fetch(req));
    return;
  }

  const isNavigation = req.mode === 'navigate' || req.destination === 'document';

  // same-origin GET 정적 자산: network-first + cache fallback
  event.respondWith(
    fetch(req).then(response => {
      if (response && response.ok) {
        const clone = response.clone();
        caches.open(CACHE_NAME).then(cache => cache.put(req, clone));
      }
      return response;
    }).catch(() => caches.match(req).then(cached => {
      if (cached) return cached;
      if (isNavigation) return caches.match('./index.html');
      return new Response('', { status: 504, statusText: 'Offline and not cached' });
    }))
  );
});
