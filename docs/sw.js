// Zaguero · service worker: funciona sin conexión y escribe las notificaciones con tus datos
const CACHE='zaguero-v3';
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
const SHORT={md1:'torso pesado',md4:'pierna',md3:'torso y brazos'};
const pick=(arr,date,salt)=>arr[(Math.floor(date/864e5)+(salt||0))%arr.length];
const POOL={
  md1:[['Hoy se carga arriba 💪','Ayer partido, hoy press pesado. Las piernas descansan, el pecho trabaja.'],['Día de press 🏋️','Barra cargada y cabeza fría. Hoy se gana fuerza para el cuerpo a cuerpo.'],['Hoy se construye la armadura','Pecho, espalda y hombros. Lo que te hace imposible de mover en el área.']],
  md4:[['Hoy, piernas de central 🦵','Saltos, sentadilla pesada y nórdico. Aquí se ganan los duelos aéreos.'],['Día de pierna. Sin excusas','La sesión más importante de la semana. Potencia para el primer paso y el salto.'],['Hoy se fabrica el salto ⚡','Sentadilla y contraste. Cada serie, un centímetro más arriba en el próximo córner.']],
  md3:[['Hoy toca bombear 🔥','Torso y brazos con volumen. Presencia que se ve desde la grada.'],['Hombros y brazos, hoy','Sesión de volumen por la mañana. Esta tarde, al campo con el equipo.'],['Hoy se gana tamaño','Series de 8 a 15, buen bombeo y a por el entreno de la tarde.']]
};
function phaseTag(S,date){const ph=phase(S,date);if(!ph.started)return '';return ['',' Esta semana se suben los kilos.',' Semana de pico: hoy van los pesos más altos del bloque.',' Semana suave: recargas para el siguiente bloque.'][ph.pi]}
function streak(S,date){
  let n=0,mon=addDays(mondayOf(date),-7);
  for(let k=0;k<52;k++){const p=planFor(S,mon),ids=Object.keys(p.gym).filter(id=>on(p.gym[id]));if(!ids.length||!ids.every(id=>done(S,id,mon)))break;n++;mon=addDays(mon,-7)}
  return n;
}
function dayLine(S,date){
  const I=info(S,date);
  if(I.g){const m=pick(POOL[I.g],date);return{t:m[0],b:m[1]+phaseTag(S,date)}}
  if(I.match)return pick([{t:'Día de partido 🔥',b:'Hoy nadie te gana un balón por arriba. Come 3-4 horas antes y a mandar en tu área.'},{t:'Hoy se compite',b:'Agua desde por la mañana, buen calentamiento y a dejar la portería a cero.'},{t:'Partido. Tu área, tus reglas',b:'Todo lo del gimnasio sale hoy al campo. A disfrutarlo.'}],date);
  if(I.md==='MD-1')return pick([{t:'Mañana se compite',b:'Hoy toca cargar pilas: descanso o 10 minutos de activación, y cena con hidratos.'},{t:'Víspera de partido',b:'Piernas frescas, cabeza tranquila. Cena bien y a dormir pronto.'}],date);
  if(I.field)return pick([{t:'Hoy toca balón ⚽',b:'Entreno con el equipo. Sin gimnasio hoy: llega hidratado y con algo de comida.'},{t:'Tarde de entreno',b:'Hoy el gimnasio es el campo. Esprinta al máximo alguna vez: tu isquio lo agradece.'}],date);
  return pick([{t:'Día libre. Hoy creces 🌱',b:'El músculo se construye descansando. Proteína, movilidad y 8 horas de sueño.'},{t:'Hoy toca recuperar',b:'15 minutos de movilidad y buena comida. Mañana más.'}],date);
}
function morning(S){
  const t=today(),L=dayLine(S,t);
  if(isMeasure(S,t))return{title:'Día de medidas 📏',body:'Antes de desayunar: báscula y cinta. Vamos a ver cuánto has crecido. Después, '+L.t.replace(/ [^\wáéíóúñ.]+$/u,'').toLowerCase()+'.'};
  if(isTest(S,t))return{title:'Hoy se mide la potencia ⚡',body:'Salto y sprint después de calentar, antes de la sesión. A batir tu marca.'};
  return{title:L.t,body:L.b};
}
function evening(S){
  const t=today(),I=info(S,t),tm=addDays(t,1),J=info(S,tm);
  if(I.d===6){
    const ids=Object.keys(I.p.gym).filter(k=>on(I.p.gym[k])),dn=ids.filter(id=>done(S,id,I.mon)).length,st=streak(S,addDays(I.mon,7));
    let title,body;
    if(ids.length&&dn>=ids.length){title='Semana perfecta: '+dn+'/'+ids.length+' 🔥';body=(st>1?'Llevas '+st+' semanas seguidas completas. ':'')+'El lunes arranca otra. A por ella.'}
    else if(dn>0){title='Semana cerrada: '+dn+'/'+ids.length;body='Bien sumado. La próxima, a por todas.'}
    else{title='Nueva semana, nueva oportunidad';body='El lunes se empieza de cero. Tú decides cómo acaba.'}
    if(isMeasure(S,tm))body+=' Mañana medidas: no desayunes antes de medirte.';
    return{title,body};
  }
  if(I.g&&!done(S,I.g,I.mon))return pick([{title:'¿Hecha la de hoy? ✅',body:'Márcala en Zaguero y suma a tu racha.'},{title:'Que no se quede sin apuntar',body:'Registra la sesión de hoy: cada serie cuenta para tu progreso.'}],t);
  let title,body;
  if(J.g){title='Mañana toca '+SHORT[J.g];body=pick(['Mochila preparada y 8 horas de sueño. Mañana se rinde.','Cena bien y a dormir pronto. Mañana se suma.'],t)}
  else if(J.match){title='Mañana hay partido 🔥';body='Hidrátate, cena con hidratos y a dormir pronto.'}
  else if(J.field){title='Mañana, balón';body='Recupera bien esta noche. Mañana toca campo.'}
  else{title='Mañana descanso';body='Te lo has ganado. Recupera y vuelve con más.'}
  if(isMeasure(S,tm)){title='Mañana, día de medidas 📏';body='No desayunes antes de medirte. Báscula y cinta en ayunas.'}
  if(isTest(S,tm)){title='Mañana se mide la potencia ⚡';body='Duerme bien: salto y sprint antes de la sesión.'}
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
