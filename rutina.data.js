var PHASES=[
  {n:'Acumulación',rpe:'7',reps:'5',pct:'75-80 %',txt:'Mucho volumen con técnica limpia. Deja 3 repeticiones en reserva.'},
  {n:'Intensificación',rpe:'8',reps:'4',pct:'80-85 %',txt:'Más peso y menos repeticiones en la fuerza principal. Deja 2 en reserva.'},
  {n:'Pico',rpe:'8,5-9',reps:'3',pct:'85-88 %',txt:'La semana más pesada del bloque. Series principales a 1 repetición del fallo.'},
  {n:'Descarga',rpe:'6',reps:'5',pct:'65-70 %',txt:'Una serie menos en cada ejercicio y cargas bajas. Asimilas el bloque y llegas fresco al siguiente.'}
];

var BLOCKS={
  A:{n:'Activar',d:'Movilidad, isométricos y series de aproximación. Preparas tendones y articulaciones.'},
  E:{n:'Explotar',d:'Saltos y lanzamientos con intención máxima, cuando el sistema nervioso está fresco.'},
  F:{n:'Fuerza',d:'Cargas altas en series cortas, en pareja con un salto o lanzamiento (contraste).'},
  C:{n:'Construir',d:'Hipertrofia de 8 a 15 repeticiones para ganar masa y presencia, con variantes atléticas de pie, a una pierna y con landmine.'},
  B:{n:'Blindar',d:'Dosis semanales de nórdico, Copenhagen, tobillo, trapecio y hombro para prevenir lesiones.'},
  K:{n:'Core',d:'Tronco que no se dobla ni rota: transmite la fuerza de las piernas al choque, al salto y al golpeo.'},
  R:{n:'Cardio',d:'Solo el día después del partido: rodaje suave si jugaste, intervalos si jugaste poco.'}
};
var BORDER=['A','E','F','C','B','K','R'];

/* Mismo esquema en las tres sesiones. Cada hueco rota entre 3 variantes cada semana. */
var GYM={
  md1:{id:'md1',dayIdx:0,md:'MD+1',name:'Torso · Fuerza',when:'Día después del partido',
    sub:'Torso pesado mientras las piernas se recuperan del partido.',
    warm:['5 min de bici o remo suave para soltar el partido','Movilidad torácica: 8 rotaciones por lado en cuadrupedia','Separaciones con banda: 2 × 15','Flexiones lentas con pausa abajo: 1 × 8','2 series de aproximación en el press'],
    slots:[
      {b:'E',s:'Lanzamiento',f:'Despejes, saques largos y giros para tapar un pase. La potencia nace en la cadera.',sets:3,reps:'4 / lado',rest:60,v:[
        {n:'Lanzamiento rotacional de balón medicinal',c:'3-4 kg contra la pared. Gira desde la cadera, como en un despeje largo. Velocidad máxima y nada de fatiga.'},
        {n:'Pase de pecho con balón medicinal en zancada',r:'5',c:'Paso adelante y lanza explosivo. Recoge y repite sin prisa.'},
        {n:'Slam de balón medicinal',r:'5',c:'Estírate arriba y lanza con todo el cuerpo contra el suelo.'}]},
      {b:'F',s:'Fuerza principal',f:'Fuerza de empuje para ganar el cuerpo a cuerpo y mantener la posición en los balones parados.',main:true,sets:4,rest:20,restTo:'contraste',v:[
        {n:'Press banca con barra',c:'Escápulas atrás y abajo, pies clavados. Baja controlado y sube a la máxima velocidad.'},
        {n:'Press banca con pausa de 2 s',c:'Pausa con la barra en el pecho sin rebotar. Usa un 10 % menos que en el press normal.'},
        {n:'Press inclinado con barra a 30°',c:'La barra toca la parte alta del pecho. Codos a unos 45° del torso.'}]},
      {b:'F',s:'Contraste',f:'Convierte la fuerza del press en velocidad: brazos rápidos para protegerte y separar al rival.',pair:true,sets:4,reps:'4',rest:150,v:[
        {n:'Flexión pliométrica',c:'En los 15-20 s después de la serie pesada. Despega las manos del suelo en cada repetición.'},
        {n:'Lanzamiento de balón medicinal al techo tumbado',r:'5',c:'Tumbado en el suelo, lanza vertical desde el pecho y atrapa.'},
        {n:'Flexión con palmada',c:'Solo si mantienes el cuerpo rígido. Si no, flexión pliométrica.'}]},
      {b:'F',s:'Tirón pesado',f:'Espalda fuerte para aguantar empujones, agarrar y proteger la columna en los choques.',sets:4,reps:'4-6',rest:150,v:[
        {n:'Dominadas lastradas',c:'Pecho a la barra sin balanceo. Añade lastre cuando saques 6 limpias.'},
        {n:'Dominadas supinas lastradas',c:'Agarre con las palmas hacia ti. Extensión completa abajo.'},
        {n:'Remo Pendlay',c:'Torso paralelo al suelo. La barra vuelve al suelo en cada repetición.'}]},
      {b:'C',s:'Pecho',f:'Masa en el tren superior: más presencia y más difícil de mover en los duelos.',sets:3,reps:'8-10',rest:90,v:[
        {n:'Press inclinado con mancuernas',c:'Banco a 30°. Baja en 3 s y estira el pecho abajo.'},
        {n:'Fondos lastrados',c:'Torso algo inclinado hacia delante. Baja hasta que el hombro quede a la altura del codo.'},
        {n:'Press landmine de pie a una mano',r:'10 / lado',c:'Empuja en diagonal con la cadera quieta. Trabaja pecho, hombro y core a la vez.'}]},
      {b:'C',s:'Espalda',f:'Equilibra todo el empuje y protege el hombro en caídas y choques.',sets:3,reps:'10-12',rest:75,v:[
        {n:'Remo Meadows con landmine',r:'10 / lado',c:'Barra en esquina, agarre del extremo, de pie y en bisagra. Tira del codo hacia arriba y atrás sin girar el tronco.'},
        {n:'Remo con pecho apoyado',c:'Sin impulso. Pausa de 1 s con las escápulas juntas.'},
        {n:'Remo con mancuerna a una mano en zancada',r:'10 / lado',c:'De pie en zancada, mano libre en la rodilla delantera. Tira hacia la cadera sin rotar: espalda y antirrotación a la vez.'}]},
      {b:'C',s:'Hombro',f:'Hombros anchos y sanos: presencia física y protección cuando caes.',sets:3,reps:'12-15',rest:60,v:[
        {n:'Elevación lateral sentado con mancuernas',c:'Sentado en el banco, espalda recta. Sin impulso de piernas, todo el trabajo lo hace el hombro. El hombro ancho da presencia en el campo.'},
        {n:'Elevación lateral con mancuernas',c:'Sube a la altura del hombro con el codo algo flexionado.'},
        {n:'Pájaros con pecho apoyado en banco inclinado',c:'Pecho sobre el banco, abre los brazos hacia los lados con los codos algo flexionados. Deltoides posterior y salud del hombro.'}]},
      {b:'C',s:'Brazos · estiramiento',f:'Tamaño de brazo y codos sanos. Aquí manda la estética, no la transferencia directa.',sets:2,reps:'10-12',rest:60,v:[
        {n:'Curl inclinado con mancuernas + extensión de tríceps sobre la cabeza',c:'Superserie con el brazo estirado: curl en banco a 45° y extensión con una mancuerna por detrás de la cabeza. Trabajan la cabeza larga de bíceps y tríceps. Descansa después de los dos.'},
        {n:'Curl predicador con barra Z + fondos en banco',c:'Superserie: baja el curl hasta estirar del todo. Fondos con los pies en otro banco y un disco en el regazo si te sobran repeticiones.'},
        {n:'Curl Zottman + extensión de tríceps tumbado con mancuernas',c:'Superserie: el Zottman sube en supino y baja en prono, así trabajas también el antebrazo. Extensión con los codos fijos apuntando al techo.'}]},
      {b:'B',s:'Aductor',f:'La ingle es de las lesiones más comunes del fútbol y el central la carga en cada cambio de dirección.',sets:2,reps:'6-8 / lado',rest:60,v:[
        {n:'Copenhagen corto',c:'Rodilla apoyada en el banco. Sube la cadera y baja en 3 s. Si el domingo acabaste muy cargado, haz una sola serie.'},
        {n:'Copenhagen largo',c:'Tobillo apoyado en el banco: palanca larga y más exigente. Solo si el corto ya es cómodo.'},
        {n:'Aductor en máquina sentado',r:'12',c:'Cierra con control y aguanta 1 s. Alternativa si notas la ingle sensible.'}]},
      {b:'K',s:'Antiextensión',f:'Abdomen que no cede en los choques y en el salto: protege la zona lumbar.',sets:3,reps:'8-10',rest:45,v:[
        {n:'Rueda abdominal',c:'Pelvis en retroversión y glúteo apretado. Llega solo hasta donde no se hunda la zona lumbar.'},
        {n:'Plancha con arrastre de mancuerna',r:'10',c:'Cadera quieta mientras pasas la mancuerna de un lado a otro por debajo del cuerpo.'},
        {n:'Dead bug con carga',r:'10',c:'Zona lumbar pegada al suelo. Brazo y pierna contrarios bajan lentos.'}]},
      {b:'K',s:'Lateral',f:'Aguantar el contacto lateral sin perder el equilibrio, como al cerrar al delantero contra la banda.',sets:2,reps:'20 m / lado',rest:40,v:[
        {n:'Paseo de maleta a una mano',c:'Mancuerna pesada en una mano y camina sin inclinarte hacia ningún lado. Hombros nivelados.'},
        {n:'Plancha lateral con elevación de cadera',r:'10 / lado',c:'Cuerpo en línea. Sube y baja la cadera sin rotar.'},
        {n:'Elevación lateral de tronco en banco romano',r:'12 / lado',c:'De lado en el banco de hiperextensiones. Baja controlado y sube sin girar.'}]},
      {b:'R',s:'Cardio',f:'Si jugaste, ayuda a soltar las piernas. Si jugaste poco, recupera el estímulo de carrera que te faltó.',sets:1,reps:'15-20 min',rest:0,v:[
        {n:'Bici estática',c:'Si jugaste más de 45 min: ritmo suave, puedes hablar sin esfuerzo. Si jugaste menos: 6 × 30 s fuerte con 90 s suave entre medias.'},
        {n:'Elíptica',c:'Si jugaste más de 45 min: ritmo suave y constante. Si jugaste menos: 6 × 30 s fuerte con 90 s suave entre medias.'},
        {n:'Cinta: caminata en pendiente',c:'Inclinación del 8-12 % a paso rápido, sin impacto. Si jugaste poco, cambia a 6 × 30 s de carrera rápida con 90 s andando.'}]}
    ]},
  md4:{id:'md4',dayIdx:2,md:'MD-4',name:'Pierna · Potencia',when:'Cuatro días antes del partido',
    sub:'El único día de pierna y el más pesado de la semana. Lo ideal es dejarlo 3 o 4 días antes del partido.',
    warm:['5 min de bici','Movilidad de tobillo contra la pared y 90/90 de cadera','Si esta semana no has esprintado al máximo con el equipo: 3 sprints de 20-30 m al 90-95 % con recuperación completa','Sentadilla española isométrica: 2 × 30 s (cuádriceps y tendón rotuliano)','Puente de glúteo y pasos laterales con minibanda: 2 × 10','Pogos: 2 × 10 botes cortos y rígidos','2-3 series de aproximación en el ejercicio principal'],
    slots:[
      {b:'E',s:'Salto',f:'Remates y despejes de cabeza, y la primera zancada de una salida.',sets:4,reps:'3',rest:75,v:[
        {n:'Salto con barra hexagonal ligera',c:'20-30 % de tu peso muerto. Salta lo más alto posible, aterriza suave y recoloca antes de repetir.'},
        {n:'Salto al cajón con contramovimiento',c:'Cajón alto pero alcanzable. Baja del cajón andando, no saltando.'},
        {n:'Saltos horizontales encadenados',r:'3 saltos',c:'Tres saltos seguidos hacia delante y estabiliza 2 s al final. Combinar vertical y horizontal mejora más el salto.'}]},
      {b:'F',s:'Fuerza principal',f:'La base de todo: sprint, salto, frenada y choque salen de unas piernas fuertes.',main:true,sets:4,rest:20,restTo:'contraste',v:[
        {n:'Sentadilla trasera',c:'Por debajo del paralelo si la técnica aguanta. Sube con toda la velocidad que puedas.'},
        {n:'Sentadilla frontal',c:'Codos altos y torso vertical. Más cuádriceps y menos carga en la espalda.'},
        {n:'Peso muerto con barra hexagonal',c:'Empuja el suelo. Espalda neutra; cadera y hombros suben a la vez.'}]},
      {b:'F',s:'Contraste',f:'Usa la fuerza recién activada en un salto rápido, como en un duelo aéreo.',pair:true,sets:4,reps:'3',rest:180,v:[
        {n:'Salto vertical máximo',c:'En los 15-20 s tras la serie pesada. Cada salto al máximo y aterrizaje con la rodilla alineada.'},
        {n:'Saltos de vallas',r:'4',c:'Vallas bajas o medias. Contacto corto con el suelo, como si quemara.'},
        {n:'Salto lateral de patinador',r:'3 / lado',c:'Salta de lado y clava la caída 2 s. Trabaja la frenada y el cambio de dirección.'}]},
      {b:'F',s:'Bisagra',f:'Glúteo e isquio: aceleración y protección del isquio en el sprint.',sets:3,reps:'5-6',rest:120,v:[
        {n:'Peso muerto rumano',c:'Cadera atrás y barra pegada a las piernas. Baja hasta notar el isquio largo y tenso.'},
        {n:'Hip thrust con barra',r:'6-8',c:'Pausa de 1 s arriba apretando glúteo. Muy ligado a la aceleración.'},
        {n:'Peso muerto rumano a una pierna con landmine',r:'6 / lado',c:'Agarra el extremo de la barra con la mano contraria a la pierna de apoyo. La landmine da estabilidad para cargar más el isquio.'}]},
      {b:'C',s:'Una pierna',f:'En el campo casi todo pasa sobre una pierna. Además corrige diferencias entre una pierna y otra.',sets:3,reps:'6-8 / pierna',rest:75,v:[
        {n:'Sentadilla búlgara',c:'Mismas repeticiones con cada pierna, empezando por la más débil. Torso algo inclinado y rodilla en la línea del pie.'},
        {n:'Step-up alto con mancuernas',c:'Sube sin impulsarte con la pierna de abajo. Baja en 2-3 s.'},
        {n:'Zancada lateral con landmine',c:'Barra en esquina sujeta al pecho. Paso lateral largo y baja sobre esa pierna con la otra estirada. Es el plano lateral de cerrar a un extremo.'}]},
      {b:'C',s:'Cuádriceps',f:'Frenadas y cambios de dirección: un cuádriceps fuerte protege la rodilla.',sets:3,reps:'10-12',rest:60,v:[
        {n:'Extensión de cuádriceps a una pierna',c:'Baja en 3 s y aprieta 1 s arriba. Cada pierna por separado para que ninguna se quede atrás.'},
        {n:'Sentadilla sissy en máquina o con apoyo',c:'Rodillas adelante y cadera extendida. Empieza con rango corto.'},
        {n:'Prensa a una pierna',c:'Pie centrado. Baja hasta 90° de rodilla con control.'}]},
      {b:'B',s:'Isquio',f:'La lesión muscular más frecuente del fútbol. El nórdico la reduce en torno a la mitad.',sets:3,reps:'4-6',rest:90,v:[
        {n:'Curl nórdico',c:'Baja en 4-5 s hasta donde controles y ayúdate con las manos para subir. El nórdico no rota: está todas las semanas porque es el ejercicio con más evidencia contra la lesión de isquio.'},
        {n:'Curl nórdico asistido con goma',r:'6-8',c:'Goma anclada arriba para descargar. Permite más rango y más repeticiones con el mismo trabajo excéntrico.'},
        {n:'Curl nórdico + puente isométrico con talón elevado',r:'4 + 30 s',c:'Primero los nórdicos. Después, talón en el banco y rodilla casi estirada, aguanta 30 s por pierna. Excéntrico e isquio en posición larga, como en el sprint.'}]},
      {b:'B',s:'Tobillo',f:'Sóleo y tibial absorben cada frenada y cada aterrizaje.',sets:3,reps:'10',rest:45,v:[
        {n:'Elevación de talones sentado pesada',c:'Sóleo: absorbe las frenadas. Termina cada serie con 10 elevaciones de puntas para el tibial.'},
        {n:'Elevación de talones a una pierna con mancuerna',c:'Rango completo y pausa arriba. Termina con 10 elevaciones de puntas.'},
        {n:'Elevación de talones en prensa',r:'12',c:'Pausa de 1 s abajo estirando. Termina con 10 elevaciones de puntas.'}]},
      {b:'K',s:'Antirrotación',f:'Tronco estable mientras las piernas frenan y cambian de dirección.',sets:2,reps:'10 / lado',rest:40,v:[
        {n:'Pallof press con goma',c:'Goma anclada a un poste a la altura del pecho. Estira los brazos y aguanta 2 s sin dejar que te gire.'},
        {n:'Bird dog con pausa',r:'8 / lado',c:'A cuatro patas, estira brazo y pierna contrarios y aguanta 3 s. Espalda plana como una mesa.'},
        {n:'Plancha con toque de hombro',r:'20',c:'Pies separados. Toca el hombro contrario sin que la cadera se mueva.'}]},
      {b:'K',s:'Flexor de cadera',f:'Flexores de cadera fuertes para la zancada del sprint y el golpeo largo.',sets:2,reps:'10',rest:40,v:[
        {n:'Elevación de rodillas colgado',c:'Sube las rodillas al pecho sin balanceo y baja en 2 s.'},
        {n:'Hollow body',r:'30 s',c:'Tumbado, zona lumbar pegada al suelo, brazos y piernas estirados y despegados. Aguanta.'},
        {n:'Marcha con minibanda en los pies',r:'10 / pierna',c:'De pie o tumbado, sube una rodilla contra la goma y aguanta 1 s arriba.'}]}
    ]},
  md3:{id:'md3',dayIdx:3,md:'MD-3',name:'Torso · Volumen',when:'Jueves · 17:45, antes del entreno de 19:30',
    sub:'Hipertrofia de torso, cuello y core, sin carga en piernas.',
    warm:['5 min de remo suave','Dislocaciones con banda y rotación externa: 2 × 12','Retracciones escapulares colgado de la barra: 1 × 10','2 series de aproximación en el press militar'],
    slots:[
      {b:'E',s:'Lanzamiento',f:'Saques de banda, choques de hombro y potencia del tronco.',sets:3,reps:'5',rest:60,v:[
        {n:'Lanzamiento de balón medicinal sobre la cabeza',c:'Como un saque de banda potente, contra la pared. Abdomen firme.'},
        {n:'Push press con landmine a una mano',r:'5 / lado',c:'De pie, barra en esquina a la altura del hombro. Flexiona un poco las piernas y empuja explosivo de abajo arriba. Potencia de piernas a brazo.'},
        {n:'Slam de balón con giro',r:'4 / lado',c:'Lanza al suelo junto a un pie y alterna lados.'}]},
      {b:'F',s:'Fuerza principal',f:'Fuerza por encima de la cabeza para ganar la posición en el salto y bloquear con los brazos.',main:true,sets:4,rest:150,v:[
        {n:'Press militar de pie con barra',c:'Glúteo y abdomen apretados. Mete la cabeza bajo la barra al final.'},
        {n:'Press de hombro con mancuernas sentado',c:'Respaldo casi vertical. Baja hasta la altura de la oreja.'},
        {n:'Push press',c:'Impulso corto de piernas y empuje. Si tienes las piernas cargadas, haz press militar estricto.'}]},
      {b:'F',s:'Tirón pesado',f:'Espalda densa para aguantar empujones sin perder la posición.',sets:4,reps:'5-6',rest:120,v:[
        {n:'Remo Pendlay',c:'Explosivo hacia el abdomen. La barra vuelve al suelo en cada repetición.'},
        {n:'Remo con pecho apoyado pesado',c:'Sin despegar el pecho del banco. Cargas altas y control.'},
        {n:'Dominadas lastradas agarre neutro',c:'Extensión completa abajo. Pecho a la barra.'}]},
      {b:'C',s:'Pecho',f:'Masa de pecho y hombro para el cuerpo a cuerpo.',sets:3,reps:'10',rest:75,v:[
        {n:'Press inclinado con mancuernas',c:'Ritmo de 3 s abajo y 1 s arriba.'},
        {n:'Press landmine de pie con giro de cadera',r:'8 / lado',c:'Pie trasero gira, cadera rota y el brazo extiende. Es el gesto de ganar el sitio con el hombro.'},
        {n:'Flexiones con disco a la espalda',r:'10-15',c:'Cuerpo rígido como una tabla y pecho al suelo. Pecho, hombro y core sin banco.'}]},
      {b:'C',s:'Dorsal',f:'Espalda ancha y fuerte. Tirar de tu propio peso mejora la relación entre fuerza y peso.',sets:3,reps:'10-12',rest:75,v:[
        {n:'Dominadas con agarre ancho',r:'8-10',c:'Pecho a la barra y baja hasta estirar del todo. Si no llegas a 8, usa una goma.'},
        {n:'Remo Kroc con mancuerna',r:'10 / lado',c:'Mancuerna pesada, mano libre apoyada. Tira hacia la cadera con algo de impulso controlado.'},
        {n:'Remo T con landmine',r:'10',c:'De pie sobre la barra, agarre en V. Tira hacia el pecho manteniendo la espalda neutra.'}]},
      {b:'C',s:'Brazos',f:'Tamaño de brazo. Aquí manda la estética.',sets:3,reps:'10-12',rest:60,v:[
        {n:'Fondos en paralelas + curl con barra Z',c:'Superserie: un ejercicio tras otro y descansa después. Aquí van las cargas más pesadas de brazo de la semana.'},
        {n:'Press francés + curl martillo',c:'Superserie: sin descanso entre los dos.'},
        {n:'Press de banca agarre cerrado + curl araña',c:'Superserie: manos a la anchura de los hombros en el press. Curl araña con el pecho apoyado en un banco inclinado.'}]},
      {b:'B',s:'Trapecio y agarre',f:'Trapecio grande y manos fuertes: más presencia y más firmeza para aguantar el cuerpo a cuerpo.',sets:3,reps:'10-12',rest:60,v:[
        {n:'Encogimientos con barra',c:'Sube los hombros hacia las orejas y aguanta 1 s arriba. Sin rodar los hombros.'},
        {n:'Paseo del granjero pesado',r:'30 m',c:'Mancuernas pesadas, pecho alto, hombros abajo y pasos cortos y firmes.'},
        {n:'Encogimientos con mancuernas + rotación externa con goma',r:'12 + 12',c:'Superserie: primero el trapecio y después los rotadores del hombro, que lo protegen de tanto press.'}]},
      {b:'K',s:'Rotación',f:'Despejes, golpeos largos y giros para encarar: rotación potente y controlada desde la cadera.',sets:3,reps:'10',rest:45,v:[
        {n:'Rotación con landmine',r:'8 / lado',c:'Barra en esquina, brazos casi estirados. Lleva la barra de cadera a cadera girando desde las caderas y los pies, sin arquear la espalda.'},
        {n:'Rueda abdominal',r:'8',c:'Pelvis en retroversión. No hundas la zona lumbar.'},
        {n:'Pallof press con goma y paso lateral',r:'10 / lado',c:'Goma anclada a un poste. Brazos estirados y resiste el giro mientras das un paso. Es aguantar una carga hombro con hombro.'}]},
      {b:'K',s:'Lateral',f:'Aguantar el contacto lateral sin perder el equilibrio, como al cerrar al delantero contra la banda.',sets:2,reps:'10 / lado',rest:40,v:[
        {n:'Plancha lateral con elevación de cadera',c:'Cuerpo en línea. Sube y baja la cadera sin rotar.'},
        {n:'Paseo de maleta a una mano',r:'20 m / lado',c:'Mancuerna pesada en una mano y camina sin inclinarte hacia ningún lado. Hombros nivelados.'},
        {n:'Elevación lateral de tronco en banco romano',r:'12 / lado',c:'De lado en el banco de hiperextensiones. Baja controlado y sube sin girar.'}]}
    ]},
  md5:{id:'md5',dayIdx:1,md:'MD-5',name:'Explosivo · Core',when:'Martes · 17:45, antes del entreno de 19:30',
    sub:'Torso explosivo y core, sin pierna y sin cargas pesadas: llegas fresco al entreno.',
    warm:['5 min de bici suave','Dislocaciones con banda: 2 × 12','Rotación torácica en cuadrupedia: 8 por lado','Lanzamientos suaves contra la pared: 2 × 5'],
    slots:[
      {b:'E',s:'Lanzamiento',f:'Saques largos y pases de pecho: la fuerza sale del tronco y pasa al brazo.',sets:3,reps:'4',rest:60,v:[
        {n:'Lanzamiento de balón medicinal de pecho',c:'Desde rodillas o de pie. Empuja explosivo contra la pared y recoge sin prisa.'},
        {n:'Lanzamiento de balón medicinal sobre la cabeza',r:'4',c:'Como un saque de banda. Abdomen firme y empuje desde las piernas.'},
        {n:'Slam de balón medicinal',r:'5',c:'Estírate arriba y lanza al suelo con todo el cuerpo.'}]},
      {b:'K',s:'Core',f:'Un tronco firme para no perder el equilibrio en el choque y para pasar la fuerza de las piernas.',sets:3,reps:'10',rest:45,v:[
        {n:'Pallof press con goma y paso lateral',r:'10 / lado',c:'Goma anclada a un poste. Brazos estirados y resiste el giro mientras das un paso.'},
        {n:'Rueda abdominal',r:'8',c:'Pelvis en retroversión. No hundas la zona lumbar.'},
        {n:'Plancha lateral con elevación de cadera',r:'10 / lado',c:'Cuerpo en línea. Sube y baja la cadera sin rotar.'}]},
      {b:'C',s:'Hombro y brazos',f:'Hombro sano y brazos para el cuerpo a cuerpo y para el remate.',sets:2,reps:'12',rest:45,v:[
        {n:'Elevación lateral tumbado',r:'12',c:'Tumbado de lado con mancuerna ligera. Sube hasta la altura del hombro sin encoger el cuello.'},
        {n:'Curl martillo',r:'12',c:'Mancuernas con palmas enfrentadas. Baja despacio.'},
        {n:'Press francés con mancuerna',r:'12',c:'Codos fijos. Baja la mancuerna hacia la frente.'}]}
    ]}
};

var WEEK=[
  {t:'gym',g:'md1',md:'MD+1'},
  {t:'field',md:'MD+2',n:'Entreno 19:30'},
  {t:'gym',g:'md4',md:'MD-4'},
  {t:'gym',g:'md3',md:'MD-3'},
  {t:'field',md:'MD-2',n:'Entreno 19:30'},
  {t:'off',md:'MD-1',n:'Movilidad o descanso'},
  {t:'match',md:'MD',n:'Partido'}
];

var REFS=[
  ['Silva y col., Sports Medicine – Open (2015)','https://link.springer.com/article/10.1186/s40798-015-0006-z','Una sesión semanal de fuerza mantiene las ganancias en temporada y dos las mejoran. La fuerza con cargas altas rinde más en sprint y cambio de dirección que la hipertrofia clásica.'],
  ['Harøy y col., British Journal of Sports Medicine (2019)','https://bjsm.bmj.com/content/53/3/150.abstract','Con el Copenhagen una vez por semana en temporada, la probabilidad de problemas de ingle bajó un 41 %.'],
  ['Dosis mínima del curl nórdico en fútbol','https://lida.sport-iat.de/ta/Record/4056186?lng=en','Volúmenes bajos, desde 2 × 3 a la semana, parecen suficientes. La dosis mínima exacta sigue sin estar clara.'],
  ['Barça Innovation Hub','https://barcainnovationhub.fcbarcelona.com/blog/physical-training-in-football-industry-practices-and-key-exercises/','MD-4 como día de fuerza, todo el espectro fuerza-velocidad y trabajo excéntrico de isquio y aductor como base de la prevención.'],
  ['Nick Grantham en FourFourTwo','https://www.fourfourtwo.com/performance/training/how-design-a-premier-league-gym-programme','Sentadilla, salto, bisagra y hip thrust como estructura de pierna, y series de 3-6 repeticiones en temporada.'],
  ['De Hoyo y col., sobrecarga excéntrica en juveniles de élite','https://idus.us.es/bitstream/handle/11441/60786/Effects_of_a_10-Week_In-Season_Eccentric-Overload_Training_Program_on_Muscle-Injury.pdf;sequence=1&isAllowed=y','Sentadilla y curl en máquina inercial una o dos veces por semana: mejor salto y sprint, y lesiones menos graves.'],
  ['Timmins y Bahr, Aspetar Sports Medicine Journal','https://journal.aspetar.com/en/journals/volume-15-targeted-topic-sports-medicine-in-football-fifa-world-cup-2026/preventing-the-1-football-injury','La lesión previa de isquio es el factor de riesgo más fuerte. El nórdico es el ejercicio con más evidencia y la exposición progresiva al sprint protege el músculo.'],
  ['Recomendaciones de isquio en fútbol de élite','https://lida.sport-iat.de/ta/Record/4065558','Isquio fuerte en todo el rango de fuerza y velocidad, y exposición a velocidad casi máxima una o dos veces por semana.'],
  ['Weldon y col., Biology of Sport (2021)','https://www.termedia.pl/Contemporary-practices-of-strength-and-conditioning-coaches-in-professional-soccer,78,41880,0,1.html','Encuesta a 52 preparadores de fútbol profesional: la sentadilla es el ejercicio más importante para el 52 % y casi todos usan trabajo excéntrico.'],
  ['Sabag y col., torso tras el partido','https://researchonline.ljmu.ac.uk/id/eprint/14559/','Entrenar torso el día después del partido es compatible con la recuperación si no es excesivo, aunque no la acelera.'],
  ['Mielgo-Ayuso y col., Nutrients (2019)','https://mdpi.com/2072-6643/11/4/757','En futbolistas, la creatina mejora el rendimiento anaeróbico. No mejora el aeróbico.'],
  ['ISSN, posicionamiento sobre proteína (2017)','https://link.springer.com/article/10.1186/s12970-017-0177-8','1,4-2,0 g/kg al día repartidos cada 3-4 horas, 20-40 g por toma y 30-40 g de caseína antes de dormir.'],
];

