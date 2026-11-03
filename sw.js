/* Öğretmen Çantası servis çalışanı.
   Her zaman önce internetten günceli alır (ağ öncelikli); internet yoksa son kaydedilen kopyayı açar.
   Supabase gibi başka adreslere giden isteklere dokunmaz. */
const ONBELLEK = 'ogretmen-cantasi-v1';
self.addEventListener('install', () => self.skipWaiting());
self.addEventListener('activate', e => e.waitUntil(
  caches.keys().then(k => Promise.all(k.filter(x => x !== ONBELLEK).map(x => caches.delete(x)))).then(() => self.clients.claim())
));
self.addEventListener('fetch', e => {
  const r = e.request;
  if (r.method !== 'GET' || new URL(r.url).origin !== self.location.origin) return;
  e.respondWith(
    fetch(r).then(yanit => {
      if (yanit.ok) { const kopya = yanit.clone(); caches.open(ONBELLEK).then(c => c.put(r, kopya)); }
      return yanit;
    }).catch(() => caches.match(r).then(m => m || (r.mode === 'navigate' ? caches.match('./') : Response.error())))
  );
});
