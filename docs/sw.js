// Zaguero: caché para que funcione sin conexión en el gimnasio
const CACHE='zaguero-v1';
const FILES=['./','./index.html','./manifest.webmanifest','./icon-192.png','./icon-512.png','./apple-touch-icon.png'];
self.addEventListener('install',e=>{e.waitUntil(caches.open(CACHE).then(c=>c.addAll(FILES)));self.skipWaiting()});
self.addEventListener('activate',e=>{e.waitUntil(caches.keys().then(ks=>Promise.all(ks.filter(k=>k!==CACHE).map(k=>caches.delete(k)))));self.clients.claim()});
self.addEventListener('fetch',e=>{
  const req=e.request;
  if(req.method!=='GET')return;
  // la app: red primero (para recibir actualizaciones), caché si no hay conexión
  if(req.mode==='navigate'){e.respondWith(fetch(req).then(r=>{const cp=r.clone();caches.open(CACHE).then(c=>c.put('./index.html',cp));return r}).catch(()=>caches.match('./index.html')));return}
  // resto (fuentes, iconos): caché primero
  e.respondWith(caches.match(req).then(m=>m||fetch(req).then(r=>{if(r.ok&&(req.url.startsWith(self.location.origin)||req.url.includes('fonts.g'))){const cp=r.clone();caches.open(CACHE).then(c=>c.put(req,cp))}return r})));
});
