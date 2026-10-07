// Zaguero · service worker: funciona sin conexión y escribe las notificaciones con tus datos
const CACHE='zaguero-v2';
const FILES=['./','./index.html','./manifest.webmanifest','./icon-192.png','./icon-512.png','./apple-touch-icon.png'];
self.addEventListener('install',e=>{e.waitUntil(caches.open(CACHE).then(c=>c.addAll(FILES)));self.skipWaiting()});
self.addEventListener('activate',e=>{e.waitUntil(caches.keys().then(ks=>Promise.all(ks.filter(k=>k!==CACHE).map(k=>caches.delete(k)))).then(()=>self.clients.claim()))});
self.addEventListener('fetch',e=>{
  const req=e.request;if(req.method!=='GET')return;
  if(req.mode==='navigate'){e.respondWith(fetch(req).then(r=>{const cp=r.clone();caches.open(CACHE).then(c=>c.put('./index.html',cp));return r}).catch(()=>caches.match('./index.html')));return}
  e.respondWith(caches.match(req).then(m=>m||fetch(req).then(r=>{if(r.ok&&(req.url.startsWith(self.location.origin)||req.url.includes('fonts.g'))){const cp=r.clone();caches.open(CACHE).then(c=>c.put(req,cp))}return r})));
});

/* ---------- notificaciones ---------- */
const NAMES={md1:'Torso · Fuerza',md4:'Pierna · Potencia',md3:'Torso · Volumen'};
const PH=[['Acumulación','5 reps al 75-80 %'],['Intensificación','4 reps al 80-85 %'],['Pico','3 reps al 85-88 %'],['Descarga','cargas bajas y una serie menos']];
const D3=['lun','mar','mié','jue','vie','sáb','dom'];
const DEF={gym:{md1:0,md4:2,md3:3},field:[1,3,4],match:6};
const pad=n=>String(n).padStart(2,'0');
const iso=d=>d.getFullYear()+'-'+pad(d.getMonth()+1)+'-'+pad(d.getDate());
const parseISO=s=>{const p=String(s).split('-').map(Number);return new Date(p[0],p[1]-1,p[2])};
const dow=d=>(d.getDay()+6)%7;
const addDays=(d,n)=>{const x=new Date(d.getFullYear(),d.getMonth(),d.getDate());x.setDate(x.getDate()+n);return x};
const mondayOf=d=>addDays(d,-dow(d));
const on=v=>v!==null&&v!==undefined;
const today=()=>{const n=new Date();return new Date(n.getFullYear(),n.getMonth(),n.getDate())};
function getState(){return new Promise(res=>{try{const r=indexedDB.open('zaguero-sw',1);r.onupgradeneeded=()=>r.result.createObjectStore('kv');
  r.onsuccess=()=>{try{const q=r.result.transaction('kv','readonly').objectStore('kv').get('state');q.onsuccess=()=>{try{res(q.result?JSON.parse(q.result):null)}catch(e){res(null)}};q.onerror=()=>res(null)}catch(e){res(null)}};r.onerror=()=>res(null)}catch(e){res(null)}})}
function planFor(S,mon){return (S.weeks&&S.weeks[iso(mon)])||S.plan||DEF}
function mdLabel(day,match){if(!on(day)||!on(match))return '';if(day===match)return 'MD';const a=(day-match+7)%7,b=(match-day+7)%7;return a<=2?'MD+'+a:'MD-'+b}
function info(S,date){const mon=mondayOf(date),p=planFor(S,mon),d=dow(date);let g=null;for(const id in p.gym){if(p.gym[id]===d)g=id}
  return{g,mon,d,p,field:(p.field||[]).includes(d),match:p.match===d,md:mdLabel(d,p.match)}}
function phase(S,date){const st=mondayOf(parseISO(S.start||'2026-10-12'));const ws=Math.max(0,Math.max(0,Math.round((mondayOf(date)-st)/(7*864e5)))+(S.offset||0));return{pi:ws%4,block:Math.floor(ws/4)+1,started:date>=st}}
function daysFromStart(S,date){return Math.round((date-mondayOf(parseISO(S.start||'2026-10-12')))/864e5)}
const isMeasure=(S,d)=>{const x=daysFromStart(S,d);return x>=0&&x%28===0};
const isTest=(S,d)=>{const x=daysFromStart(S,d);return x>=23&&(x-23)%28===0};
function done(S,id,mon){const l=S.logs&&S.logs[iso(mon)+'|'+id];if(!l)return false;if(l.done)return true;const ex=l.ex||{};for(const i in ex){const e=ex[i];if(e&&e.sets&&e.sets.some(x=>x&&x.ok))return true}return false}
function dayLine(S,date){
  const I=info(S,date),ph=phase(S,date);
  if(I.g)return{t:'Hoy: '+NAMES[I.g]+(I.md?' · '+I.md:''),b:(ph.started?'Semana '+(ph.pi+1)+', '+PH[ph.pi][0]+'. Fuerza principal: '+PH[ph.pi][1]+'. ':'')+(I.field?'Gimnasio por la mañana y entreno de equipo por la tarde. ':'')+'Rellena el semáforo antes de empezar.'};
  if(I.match)return{t:'Día de partido',b:'Come 3-4 horas antes, bebe agua desde por la mañana y calienta bien. A por ello.'};
  if(I.field)return{t:'Hoy entreno con el equipo',b:'Sin gimnasio. Llega hidratado y come algo 2-3 horas antes.'};
  if(I.md==='MD-1')return{t:'Mañana hay partido',b:'Activación suave o descanso. Cena con hidratos y a dormir pronto.'};
  return{t:'Día de recuperación',b:'15 minutos de movilidad, proteína en cada comida y 8 horas de sueño.'};
}
function morning(S){
  const t=today(),L=dayLine(S,t),extra=[];let title=L.t;
  if(isMeasure(S,t)){extra.push('Antes de desayunar toca medirse: peso y perímetros, siempre igual.');title='Hoy: medidas del mes'}
  if(isTest(S,t)){extra.push('Test de potencia (salto vertical, horizontal y sprint de 20 m) después del calentamiento y antes de la sesión.');if(title===L.t)title='Hoy: test de potencia'}
  return{title,body:(title!==L.t?L.t.replace('Hoy: ','')+'. ':'')+extra.concat([L.b]).join(' ')};
}
function evening(S){
  const t=today(),I=info(S,t),tm=addDays(t,1),J=info(S,tm);
  if(I.d===6){
    const ids=Object.keys(I.p.gym).filter(k=>on(I.p.gym[k])),dn=ids.filter(id=>done(S,id,I.mon)).length;
    const np=planFor(S,addDays(I.mon,7)),next=Object.keys(np.gym).filter(k=>on(np.gym[k])).sort((a,b)=>np.gym[a]-np.gym[b]).map(id=>D3[np.gym[id]]+' '+NAMES[id].split(' · ')[0].toLowerCase()+(id==='md4'?'':' ('+NAMES[id].split(' · ')[1].toLowerCase()+')'));
    return{title:'Resumen de la semana: '+dn+'/'+ids.length+' sesiones',body:(dn>=ids.length&&ids.length?'Semana completa. ':'')+'La próxima: '+(next.join(', ')||'sin gimnasio')+'.'+(isMeasure(S,tm)?' Mañana medidas en ayunas: no desayunes antes de medirte.':'')};
  }
  if(I.g&&!done(S,I.g,I.mon))return{title:'¿Registraste '+NAMES[I.g]+'?',body:'Márcala en la app para que cuente en tu progreso. Si hoy no pudiste, muévela en "Editar días".'};
  let title,body;
  if(J.g){title='Mañana: '+NAMES[J.g]+(J.md?' · '+J.md:'');body=(J.field?'Gimnasio por la mañana. ':'')+'Deja preparada la mochila y duerme 8 horas.'}
  else if(J.match){title='Mañana hay partido';body='Cena con hidratos, hidrátate y a dormir pronto.'}
  else if(J.field){title='Mañana entreno con el equipo';body='Sin gimnasio. Recupera bien esta noche.'}
  else {title='Mañana descanso';body='Aprovecha para recuperar: movilidad suave y buena comida.'}
  if(isMeasure(S,tm))body='Mañana medidas en ayunas: no desayunes antes de medirte. '+body;
  if(isTest(S,tm))body='Mañana test de potencia. '+body;
  return{title,body};
}
self.addEventListener('push',e=>{
  let type='morning';try{type=(e.data&&e.data.json().type)||type}catch(err){}
  e.waitUntil(getState().then(S=>{
    let n;
    if(!S)n={title:'Zaguero',body:'Abre la app para ver lo que toca hoy.'};
    else if(type==='test')n={title:'Zaguero conectado',body:'Las notificaciones funcionan. Mañana a las 7:30 recibirás la primera.'};
    else n=type==='evening'?evening(S):morning(S);
    return self.registration.showNotification(n.title,{body:n.body,icon:'icon-192.png',badge:'icon-192.png',tag:'zaguero-'+type,data:{url:'./'}});
  }));
});
self.addEventListener('notificationclick',e=>{
  e.notification.close();
  e.waitUntil(self.clients.matchAll({type:'window',includeUncontrolled:true}).then(cs=>{for(const c of cs){if('focus' in c)return c.focus()}return self.clients.openWindow('./')}));
});
