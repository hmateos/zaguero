// Zaguero · service worker: funciona sin conexión y escribe las notificaciones con tus datos
const CACHE='zaguero-v4';
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
const SHORT={md1:'torso 💪',md4:'pierna 🦵',md3:'torso y brazos 🔥'};
const pick=(arr,date,salt)=>arr[(Math.floor(date/864e5)+(salt||0))%arr.length];
const POOL={
  md1:[['Día de press 💪','A por los kilos.'],['Hoy se carga arriba 🏋️','Pecho, espalda y hombros.'],['Torso pesado 🧱','Imposible de mover.']],
  md4:[['Piernas de central 🦵','Hoy se gana el salto.'],['Día de pierna ⚡','Sin excusas.'],['Hoy se fabrica el salto 🚀','Cada serie cuenta.']],
  md3:[['Hoy toca bombear 🔥','Torso y brazos.'],['Hombros y brazos 💥','Gym ahora, campo luego.'],['Hoy se gana tamaño 📈','Series de bombeo.']]
};
function phaseTag(S,date){const ph=phase(S,date);if(!ph.started)return '';return ['',' Suben los kilos 📈',' Semana de pico 🔝',' Semana suave 🔋'][ph.pi]}
function streak(S,date){
  let n=0,mon=addDays(mondayOf(date),-7);
  for(let k=0;k<52;k++){const p=planFor(S,mon),ids=Object.keys(p.gym).filter(id=>on(p.gym[id]));if(!ids.length||!ids.every(id=>done(S,id,mon)))break;n++;mon=addDays(mon,-7)}
  return n;
}
function dayLine(S,date){
  const I=info(S,date);
  if(I.g){const m=pick(POOL[I.g],date);return{t:m[0],b:m[1]+phaseTag(S,date)}}
  if(I.match)return pick([{t:'Día de partido 🔥',b:'Tu área, tus reglas.'},{t:'Hoy se compite ⚔️',b:'Portería a cero.'},{t:'Matchday 🏟️',b:'A mandar por arriba.'}],date);
  if(I.md==='MD-1')return pick([{t:'Mañana se compite 🔋',b:'Hoy, cargar pilas.'},{t:'Víspera de partido 🌙',b:'Piernas frescas, cena con hidratos.'}],date);
  if(I.field)return pick([{t:'Hoy toca balón ⚽',b:'Sin gym. Al campo.'},{t:'Tarde de entreno ⚽',b:'Esprinta a tope una vez.'}],date);
  return pick([{t:'Día libre 🌱',b:'Hoy creces descansando.'},{t:'Recuperación 🧘',b:'Movilidad y buena comida.'}],date);
}
function morning(S){
  const t=today(),L=dayLine(S,t);
  if(isMeasure(S,t))return{title:'Día de medidas 📏',body:'En ayunas: báscula y cinta.'};
  if(isTest(S,t))return{title:'Test de potencia ⚡',body:'Salto y sprint. A batir tu marca.'};
  return{title:L.t,body:L.b};
}
function evening(S){
  const t=today(),I=info(S,t),tm=addDays(t,1),J=info(S,tm);
  if(I.d===6){
    const ids=Object.keys(I.p.gym).filter(k=>on(I.p.gym[k])),dn=ids.filter(id=>done(S,id,I.mon)).length,st=streak(S,addDays(I.mon,7));
    let title,body;
    if(ids.length&&dn>=ids.length){title='Semana perfecta '+dn+'/'+ids.length+' 🔥';body=st>1?'Racha de '+st+' semanas 🏆':'A por la siguiente.'}
    else if(dn>0){title='Semana cerrada '+dn+'/'+ids.length+' ✅';body='La próxima, a por todas.'}
    else{title='Nueva semana 🔄';body='El lunes, de cero.'}
    if(isMeasure(S,tm))body='Mañana medidas en ayunas 📏';
    return{title,body};
  }
  if(I.g&&!done(S,I.g,I.mon))return pick([{title:'¿Hecha la de hoy? ✅',body:'Márcala y suma racha.'},{title:'Apunta la sesión 📝',body:'Cada serie cuenta.'}],t);
  let title,body;
  if(J.g){title='Mañana: '+SHORT[J.g];body=pick(['A dormir pronto 😴','Mochila lista 🎒'],t)}
  else if(J.match){title='Mañana partido 🔥';body='Hidratos y a dormir 😴'}
  else if(J.field){title='Mañana, balón ⚽';body='Recupera bien.'}
  else{title='Mañana descanso 🌱';body='Te lo has ganado.'}
  if(isMeasure(S,tm)){title='Mañana, medidas 📏';body='No desayunes antes.'}
  if(isTest(S,tm)){title='Mañana, test ⚡';body='Duerme bien.'}
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
