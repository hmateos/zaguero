// Envía el "toque" de notificación a Zaguero. Lo ejecuta GitHub Actions (ver .github/workflows/notificaciones.yml)
import webpush from 'web-push';
const PUBLIC='BK0t-N9EPxLDnfZGsXJo4osB30qcWKO7HH6iXtRMPpWK5vYmsktoaHjIT7rtN30sMvBsDFxvVdAAd8EH4dtEtUY';
const hour=Number(new Intl.DateTimeFormat('en-GB',{timeZone:'Europe/Madrid',hour:'2-digit',hour12:false}).format(new Date()));
let type=process.env.PUSH_TYPE||'';
if(!type){if(hour===7)type='morning';else if(hour===21)type='evening'}
if(!type){console.log('Fuera de horario en Madrid ('+hour+' h), no se envía nada.');process.exit(0)}
webpush.setVapidDetails('https://hmateos.github.io/zaguero/',PUBLIC,process.env.VAPID_PRIVATE_KEY);
let subs=JSON.parse(process.env.PUSH_SUBSCRIPTION||'[]');if(!Array.isArray(subs))subs=[subs];
for(const s of subs){
  try{const r=await webpush.sendNotification(s,JSON.stringify({type}),{TTL:4*3600,urgency:'normal'});console.log('Enviado',type,r.statusCode)}
  catch(e){console.error('Error',e.statusCode,e.body);process.exitCode=1}
}
