#!/usr/bin/env python3
"""Couvertures de blog 16:9 (1200x675) AVEC la mascotte AKI — articles prévention.

Réutilise les helpers de gen_aki_poster.py (même dossier). Ajouter une entrée
dans COVERS puis : python3 brand-kit/gen_blog_cover.py
"""
import os, sys
sys.path.insert(0, os.path.dirname(os.path.abspath(__file__)))
import gen_aki_poster as G
from PIL import Image, ImageDraw

REPO = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
OUT  = os.path.join(REPO, "public", "brand", "blog")

def cover_aki(out, title, deep=True):
    S=2; W,H=1200*S,675*S
    img=G.forest_bg(W,H,deep=deep); d=ImageDraw.Draw(img); G.frame(d,W,H)
    G.place_aki(img,int(H*0.86),int(W*0.78),int(H*0.965))   # AKI à droite, ancré bas
    d=ImageDraw.Draw(img); padx=int(70*S)
    d.line([padx,int(150*S),padx+int(64*S),int(150*S)],fill=G.GOLD,width=int(3*S))
    tf=G.PF(700,int(70*S)); lines=G.wrap(d,title,tf,int(W*0.56))
    asc,desc=tf.getmetrics(); lh=asc+int(8*S); ty=int(H*0.5-(len(lines)*lh)/2)
    for ln in lines:
        G.spaced(d,ln,tf,G.IVORY,0,padx,ty); ty+=lh
    ms=int(52*S); by=H-int(95*S); img.alpha_composite(G.mark_img(ms),(padx,by))
    lf=G.PF(800,int(30*S)); lf2=G.PF(700,int(30*S))
    lx=padx+ms+int(16*S); a2,d2=lf.getmetrics(); lyy=by+int((ms-(a2+d2))/2)
    x=G.spaced(d,"AKIL",lf,G.IVORY,int(2*S),lx,lyy); x+=int(10*S); G.spaced(d,"IMMO",lf2,G.GOLD,int(2*S),x,lyy)
    img=img.resize((1200,675),Image.LANCZOS); img.convert("RGB").save(out,quality=90)
    print("  ->",os.path.relpath(out,REPO))

# slug de fichier -> titre à graver
COVERS = {
    "cover-securite-aki.jpg": "Louer à distance sans se faire arnaquer",
}

if __name__=="__main__":
    os.makedirs(OUT,exist_ok=True)
    for fn,title in COVERS.items():
        cover_aki(os.path.join(OUT,fn), title)
    print("OK —",len(COVERS),"couverture(s)")
