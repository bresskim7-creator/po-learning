// PO 학습 시스템 Service Worker
// v5.64 (2026-05-17): 개념 정리 v1 (과학 U1 5장) 추가 — 인포그래픽 PRECACHE
// 이전 v5.63 (2026-05-15): 성장 기록 Google Sheets 내려받기 반영
const CACHE_NAME = 'po-learning-v5640';
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
