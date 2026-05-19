// PO 학습 시스템 Service Worker
// v5.64.6 (2026-05-22): 개념 정리 과학 U4 5장 추가 (하루 동안 태양·별 위치 변화·지구의 자전·낮과 밤·지구의 공전·계절별 별자리) + index.html CONCEPT_UNIT_TITLE 'science::U4': '지구의 운동' 추가
// 이전 v5.64.5 (2026-05-20): 개념 정리 과학 U3 7장 추가 (세포·뿌리·줄기·잎 광합성·잎 증산 작용·꽃·식물 기관 연결성) + U2 라벨 정합화('물체의 운동'). U2 카드 #5(속력과 안전)는 사용자 결정으로 제외.
// 이전 v5.64.4 (2026-05-18): 개념 정리 과학 U2 4장 추가 (운동의 정의·운동의 표현·빠르기 비교·속력)
// 이전 v5.64.3 (2026-05-17): science.json sourceUnit 정합화 (37장) — U3·U4 단원 카드 0장 누수 해결, U2 부당 disabled 8장 복구, sci_u5 5장 disabled 통일
// 이전 v5.64.2 (2026-05-17): 개념정리 "관련 문제 풀어보기" 단원 내 미니 세션 (relatedCardIds 기반) 수정
// 이전 v5.64.1 (2026-05-17): index.html 중복 tail 정정
// 이전 v5.64 (2026-05-17): 개념 정리 v1 (과학 U1 5장) 추가
// 이전 v5.63 (2026-05-15): 성장 기록 Google Sheets 내려받기 반영
const CACHE_NAME = 'po-learning-v5646';
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
