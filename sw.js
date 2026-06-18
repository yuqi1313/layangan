const CACHE = 'layangan-v1';
const ASSETS = [
  '/layangan/',
  '/layangan/index.html'
];

// === KEEP ALIVE — cegah Supabase free tier freeze ===
const SB_URL = 'https://xjqkaykrlqtvrbjxgzxm.supabase.co';
const SB_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InhqcWtheWtybHF0dnJianhnenhtIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzYzNzg3OTUsImV4cCI6MjA5MTk1NDc5NX0.poSeoWokR5BW7Y_0gmUYEahZ3Cs4Kri_-J5WP1vrT4I';

function ping() {
  fetch(SB_URL + '/rest/v1/layangans?select=id&limit=1', {
    headers: { apikey: SB_KEY, Authorization: 'Bearer ' + SB_KEY }
  }).catch(() => {});
}

self.addEventListener('install', e => {
  e.waitUntil(caches.open(CACHE).then(c => c.addAll(ASSETS)));
  self.skipWaiting();
});

self.addEventListener('activate', e => {
  e.waitUntil(caches.keys().then(keys =>
    Promise.all(keys.filter(k => k !== CACHE).map(k => caches.delete(k)))
  ));
  self.clients.claim();
  // Ping tiap 6 jam selama SW aktif (bantu cegah freeze)
  ping();
  setInterval(ping, 6 * 60 * 60 * 1000);
});

// Periodic Background Sync (untuk PWA terinstall di Android)
self.addEventListener('periodicsync', e => {
  if (e.tag === 'keep-alive-supabase') {
    e.waitUntil(ping());
  }
});

self.addEventListener('fetch', e => {
  if (e.request.url.includes('supabase.co')) return;
  e.respondWith(
    fetch(e.request).catch(() => caches.match(e.request))
  );
});
