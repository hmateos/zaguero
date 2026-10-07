# Genera app.fragment.html (artefacto) e index.html (standalone)
# a partir de template.html + rutina.data.js + fotos de media/ejercicios (free-exercise-db, dominio público)
import pathlib, json, base64
root=pathlib.Path(__file__).parent
t=(root/'template.html').read_text(encoding='utf-8')
d=(root/'rutina.data.js').read_text(encoding='utf-8')
mp=json.loads((root/'media_map.json').read_text(encoding='utf-8'))
imgs={}
for i in sorted(set(mp.values())):
    fs=[]
    for f in ['0.jpg','1.jpg']:
        p=root/'media'/'ejercicios'/i/f
        if p.exists(): fs.append('data:image/jpeg;base64,'+base64.b64encode(p.read_bytes()).decode())
    if fs: imgs[i]=fs
media='var EXID='+json.dumps({k:v for k,v in mp.items() if v in imgs},ensure_ascii=False)+';\nvar EXIMG='+json.dumps(imgs)+';'
anat=(root/'anatomia.js').read_text(encoding='utf-8') if (root/'anatomia.js').exists() else ''
s=t.replace('/*__DATA__*/',d).replace('/*__MEDIA__*/',media).replace('/*__ANAT__*/',anat)
(root/'app.fragment.html').write_text(s,encoding='utf-8')
head=('<!doctype html>\n<html lang="es">\n<head>\n<meta charset="utf-8">\n'
 '<meta name="viewport" content="width=device-width,initial-scale=1,viewport-fit=cover">\n'
 '<meta name="theme-color" content="#0A0A0B">\n'
 '<meta name="apple-mobile-web-app-capable" content="yes">\n<meta name="mobile-web-app-capable" content="yes">\n'
 '<meta name="apple-mobile-web-app-status-bar-style" content="black-translucent">\n'
 '<meta name="apple-mobile-web-app-title" content="Zaguero">\n'
 '<link rel="manifest" href="manifest.webmanifest">\n<link rel="apple-touch-icon" href="apple-touch-icon.png">\n<link rel="icon" href="icon-192.png">\n'
 '<style>html,body{background:#0A0A0B}body{margin:0}:root{padding-top:env(safe-area-inset-top,0px);padding-bottom:env(safe-area-inset-bottom,0px)}[hidden]{display:none!important}</style>\n</head>\n<body>\n')
sw='<script>if("serviceWorker" in navigator){window.addEventListener("load",function(){navigator.serviceWorker.register("sw.js").catch(function(){})})}</script>\n'
(root/'index.html').write_text(head+s+'\n'+sw+'</body>\n</html>\n',encoding='utf-8')
# carpeta lista para publicar (GitHub Pages)
import shutil
out=root/'docs'; out.mkdir(exist_ok=True)
shutil.copy(root/'index.html',out/'index.html')
for f in (root/'pwa').iterdir():
    if f.name!='icon-1024.png': shutil.copy(f,out/f.name)
(out/'.nojekyll').write_text('')
print('ok', len(imgs),'ejercicios con foto,', round(len(s)/1024/1024,2),'MB')
