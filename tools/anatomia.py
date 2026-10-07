# Convierte las láminas anatómicas en formas SVG por músculo -> anatomia.js (ANAT.front / ANAT.back)
import cv2, numpy as np, json, pathlib
root=pathlib.Path(__file__).resolve().parent.parent

def path_of(mask,scale,eps,minarea):
    cs,_=cv2.findContours(mask,cv2.RETR_EXTERNAL,cv2.CHAIN_APPROX_NONE)
    out=[]
    for c in cs:
        if cv2.contourArea(c)<minarea: continue
        a=cv2.approxPolyDP(c,eps,True).reshape(-1,2)/scale
        out.append('M'+'L'.join(f'{x:.1f} {y:.1f}' for x,y in a)+'Z')
    return ''.join(out)

def silhouette(gray,thr,dil,scale):
    edge=(gray<thr).astype(np.uint8)
    edge=cv2.dilate(edge,np.ones((dil,dil),np.uint8))
    ff=(1-edge).astype(np.uint8);h,w=ff.shape
    cv2.floodFill(ff,np.zeros((h+2,w+2),np.uint8),(0,0),2)
    body=(ff!=2).astype(np.uint8)*255
    body=cv2.morphologyEx(body,cv2.MORPH_CLOSE,np.ones((5,5),np.uint8))
    ys,xs=np.where(body>0)
    vb=[round(xs.min()/scale-4),round(ys.min()/scale-4),round((xs.max()-xs.min())/scale+8),round((ys.max()-ys.min())/scale+8)]
    return path_of(body,scale,1.0*scale/4,2000*(scale/4)**2),vb

# ---- frente: lámina gris oscuro sobre blanco (326 px), se escala x4 para suavizar ----
def front():
    im=cv2.imread(str(root/'media'/'anatomia-frente.jpg'),cv2.IMREAD_GRAYSCALE); S=4
    big=cv2.resize(im,None,fx=S,fy=S,interpolation=cv2.INTER_CUBIC)
    n,lab,st,cen=cv2.connectedComponentsWithStats((im<110).astype(np.uint8),8)
    MAP={'cuello':[12,13,18,19],'trapecio':[16,17],'hombros':[20,21,24,25],'pecho':[22,23],'biceps':[26,27],'triceps':[30,31],
     'antebrazo':[35,40,41,45,47,51,53],'oblicuos':[28,29,36,39,42,43,46,48,54],'abdomen':[32,33,37,38,49,50,55,56],
     'cuadriceps':[58,59,60,61,67,68,74,75,104,105],'aductores':[69,70,76,77],'gemelos':[111,112,114,116,117,118,119,120,121,122]}
    dark=(big<110)
    labbig=cv2.resize(lab.astype(np.float32),None,fx=S,fy=S,interpolation=cv2.INTER_NEAREST).astype(np.int32)
    res={}
    for mid,ids in MAP.items():
        m=(np.isin(labbig,ids)&dark).astype(np.uint8)*255
        m=cv2.morphologyEx(m,cv2.MORPH_OPEN,np.ones((3,3),np.uint8))
        res[mid]=path_of(m,S,1.2,40)
    sil,vb=silhouette(big,215,5,S)
    return {'vb':vb,'sil':sil,'m':res}

# ---- espalda: lámina azul sobre blanco (915 px), generada por Hugo ----
def back():
    im=cv2.imread(str(root/'media'/'anatomia-espalda.png')); S=1
    gray=cv2.cvtColor(im,cv2.COLOR_BGR2GRAY)
    b,r=im[:,:,0].astype(int),im[:,:,2].astype(int)
    mus=((gray<200)&(b-r>20)).astype(np.uint8)
    mus=cv2.morphologyEx(mus,cv2.MORPH_OPEN,np.ones((5,5),np.uint8))
    n,lab,st,cen=cv2.connectedComponentsWithStats(mus,8)
    MAP={'cuello':[3,4],'trapecio':[1,2],'hombros':[5,6],'dorsal':[7,8,9,10,11,12,17,18],'triceps':[13,14,15,16],
     'antebrazo':[21,22,23,24,25,26,29,30,35,36],'lumbar':[19,20],'oblicuos':[27,28,31,32,33,34],'gluteos':[37,38,39,40],
     'cuadriceps':[41,42],'isquios':[44,45,46,47,48,49,50,51],'gemelos':[52,53,54,55,56,57,58,59]}
    res={}
    for mid,ids in MAP.items():
        m=np.isin(lab,ids).astype(np.uint8)*255
        res[mid]=path_of(m,S,1.6,120)
    sil,vb=silhouette(gray,225,3,S)
    return {'vb':vb,'sil':sil,'m':res}

A={'front':front(),'back':back()}
js='var ANAT='+json.dumps(A)+';'
(root/'anatomia.js').write_text(js,encoding='utf-8')
print('ok',len(js)//1024,'KB',A['front']['vb'],A['back']['vb'])
