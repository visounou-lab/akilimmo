#!/usr/bin/env python3
"""Générateur d'affiches « AKI CONSEILLE » — série sécurité / prévention AKIL IMMO.

Pour chaque conseil, sort 2 formats prêts à publier dans public/brand/ads/ :
  - <slug>-1x1.png   (1080x1080)  → feed Facebook / Instagram
  - <slug>-9x16.png  (1080x1920)  → story / statut WhatsApp

AJOUTER UN CONSEIL : ajoutez une entrée dans la liste CONSEILS ci-dessous puis
lancez `python3 brand-kit/gen_aki_poster.py`. Rien d'autre à toucher.

Dépendances : Pillow + cairosvg  (pip install Pillow cairosvg).
Polices fournies dans brand-kit/fonts (Playfair Display + Inter, licence SIL OFL).
"""
import cairosvg, io, os, math
from PIL import Image, ImageDraw, ImageFont, ImageFilter

HERE = os.path.dirname(os.path.abspath(__file__))
REPO = os.path.dirname(HERE)
FONTS = os.path.join(HERE, "fonts")
OUT   = os.path.join(REPO, "public", "brand", "ads")

GOLD=(200,146,42); GOLDHI=(227,183,91); INK=(28,25,23); IVORY=(253,252,248); FOREST=(27,77,62)
GOLDX="#C8922A"; GOLDHIX="#E3B75B"
MARK=("M48 8 L87 85 L71.5 85 L48 26 L24.5 85 L9 85 Z M22.68 53 L73.32 53 L73.32 63 L22.68 63 Z "
      "M40.25 85 L40.25 56 A7.75 7.75 0 0 1 55.75 56 L55.75 85 Z")

def PF(w,s): return ImageFont.truetype(os.path.join(FONTS,f"playfair{w}.ttf"),s)
def IN(s):   return ImageFont.truetype(os.path.join(FONTS,"inter400.ttf"),s)

AKI=Image.open(os.path.join(REPO,"public","brand","aki","aki-cutout.png")).convert("RGBA")
AKI=AKI.crop(AKI.split()[3].getbbox())  # recadrer sur le contenu

def mark_img(size,grad=True):
    fill="url(#g)" if grad else GOLDX
    defs=(f'<defs><linearGradient id="g" x1="0" y1="0" x2="0.35" y2="1"><stop offset="0" stop-color="{GOLDHIX}"/><stop offset="1" stop-color="{GOLDX}"/></linearGradient></defs>') if grad else ''
    svg=f'<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 96 96">{defs}<path d="{MARK}" fill="{fill}" fill-rule="evenodd"/></svg>'
    return Image.open(io.BytesIO(cairosvg.svg2png(bytestring=svg.encode(),output_width=size,output_height=size))).convert("RGBA")

def tw(d,t,f,tr): return sum(d.textlength(c,font=f) for c in t)+tr*(max(len(t),1)-1)
def spaced(d,t,f,fill,tr,x,y):
    for c in t: d.text((x,y),c,font=f,fill=fill); x+=d.textlength(c,font=f)+tr
    return x
def wrap(d,text,font,maxw,tr=0):
    words=text.split(); lines=[]; cur=""
    for w in words:
        t=(cur+" "+w).strip()
        if tw(d,t,font,tr)<=maxw or not cur: cur=t
        else: lines.append(cur); cur=w
    lines.append(cur); return lines
def wrap_center(d,text,font,fill,cx,y,tr,gap,maxw):
    for ln in wrap(d,text,font,maxw,tr):
        lw=tw(d,ln,font,tr); spaced(d,ln,font,fill,tr,int(cx-lw/2),y)
        asc,desc=font.getmetrics(); y+=asc+desc+gap
    return y

def forest_bg(w,h,deep=False):
    top=(20,54,44) if deep else (24,64,52); bot=(12,33,27)
    base=Image.new("RGB",(w,h)); px=base.load(); cx,cy=w*0.62,h*0.38
    for y in range(h):
        ty=y/h; r=int(top[0]+(bot[0]-top[0])*ty); g=int(top[1]+(bot[1]-top[1])*ty); b=int(top[2]+(bot[2]-top[2])*ty)
        for x in range(0,w,3):
            dd=math.hypot((x-cx)/w,(y-cy)/h); glow=max(0.0,1-dd*2.0)*0.09
            rr=min(255,int(r+(GOLD[0]-r)*glow)); gg=min(255,int(g+(GOLD[1]-g)*glow)); bb=min(255,int(b+(GOLD[2]-b)*glow))
            for xx in range(x,min(x+3,w)): px[xx,y]=(rr,gg,bb)
    img=base.convert("RGBA")
    wm=mark_img(int(h*0.7),grad=False); a=wm.split()[3].point(lambda v:int(v*0.045)); wm.putalpha(a)
    img.alpha_composite(wm,(int(w*0.58),int(h*0.20)))
    return img

def frame(d,w,h):
    m=int(w*0.028); d.rectangle([m,m,w-m,h-m],outline=GOLD+(190,),width=max(2,int(w*0.0022)))

def place_aki(img,target_h,cx,cy_bottom):
    s=target_h/AKI.size[1]; aki=AKI.resize((int(AKI.size[0]*s),int(AKI.size[1]*s)),Image.LANCZOS)
    w,h=img.size
    sh=Image.new("RGBA",(w,h),(0,0,0,0)); ds=ImageDraw.Draw(sh)
    ew=int(aki.size[0]*0.66); eh=int(aki.size[1]*0.06)
    ds.ellipse([cx-ew//2,cy_bottom-eh//2,cx+ew//2,cy_bottom+eh//2],fill=(0,0,0,110))
    sh=sh.filter(ImageFilter.GaussianBlur(16)); img.alpha_composite(sh)
    x0=cx-aki.size[0]//2; y0=cy_bottom-aki.size[1]
    img.alpha_composite(aki,(x0,y0))
    return (x0,y0,x0+aki.size[0],y0+aki.size[1])  # bbox où AKI est placé

def pill(d,cx,y,label,scale=1.0):
    f=IN(int(25*scale)); tr=int(4*scale); lw=tw(d,label,f,tr)
    ph=int(52*scale); pw=lw+int(60*scale); x0=int(cx-pw/2)
    d.rounded_rectangle([x0,y,x0+pw,y+ph],radius=ph//2,fill=GOLD)
    spaced(d,label,f,INK,tr,int(cx-lw/2),y+int((ph-f.getmetrics()[0]-f.getmetrics()[1])/2)+int(2*scale))
    return y+ph

def logo_lockup(img,cx,y,mark_h):
    d=ImageDraw.Draw(img); fs=int(mark_h*0.62); ak=PF(800,fs); im=PF(700,fs); tr=int(fs*0.05); wg=int(fs*0.30)
    aw=tw(d,"AKIL",ak,tr); iw=tw(d,"IMMO",im,tr); gap=int(mark_h*0.40)
    total=mark_h+gap+aw+wg+iw; x0=int(cx-total/2)
    img.alpha_composite(mark_img(mark_h),(x0,y))
    tx=x0+mark_h+gap; asc,desc=ak.getmetrics(); ty=y+int((mark_h-(asc+desc))/2)
    x=spaced(d,"AKIL",ak,IVORY,tr,tx,ty); x+=wg; spaced(d,"IMMO",im,GOLD,tr,x,ty)

def measure_card(img,x0,x1,tip,sign,scale):
    d=ImageDraw.Draw(img); f=IN(int(31*scale))
    lines=wrap(d,tip,f,x1-x0-int(34*scale)*2); asc,desc=f.getmetrics()
    lh=asc+desc+int(9*scale); sf=IN(int(24*scale)); sh=sf.getmetrics()[0]+sf.getmetrics()[1]
    h=int(34*scale)+int(26*scale)+len(lines)*lh+int(6*scale)+sh+int(34*scale)
    return h,lines,f,lh,sf

def tip_card(img,x0,y0,x1,tip,sign,scale=1.0,tail_to=None):
    d=ImageDraw.Draw(img); pad=int(34*scale)
    h,lines,f,lh,sf=measure_card(img,x0,x1,tip,sign,scale); y1=y0+h
    # tail (petit bec sur le bord gauche, pointant vers AKI, dans l'espace libre)
    if tail_to:
        tyc=int((y0+y1)/2)
        d.polygon([(x0,tyc-int(26*scale)),(x0,tyc+int(26*scale)),tail_to],fill=IVORY)
    d.rounded_rectangle([x0,y0,x1,y1],radius=int(26*scale),fill=IVORY,outline=GOLD,width=max(2,int(3*scale)))
    d.text((x0+pad,y0+int(6*scale)),"“",font=PF(800,int(70*scale)),fill=GOLD)
    ty=y0+pad+int(26*scale)
    for ln in lines: spaced(d,ln,f,INK,0,x0+pad,ty); ty+=lh
    ty+=int(6*scale); d.text((x0+pad,ty),sign,font=sf,fill=(150,110,40))
    return y1

def contact_band(img,zone,h_frac=0.10):
    w,H=img.size; h=int(H*h_frac); y=H-h
    band=Image.new("RGBA",(w,h),(10,28,23,240)); img.alpha_composite(band,(0,y))
    d=ImageDraw.Draw(img); d.line([0,y,w,y],fill=GOLD+(140,),width=2)
    f=IN(int(h*0.26)); fz=IN(int(h*0.185)); cyc=y+h//2
    line="www.akilimmo.com"; lw=tw(d,line,f,0)
    spaced(d,line,f,IVORY,0,int(w/2-lw/2),cyc-int(h*0.31))
    zw=tw(d,zone,fz,2); spaced(d,zone,fz,GOLD,2,int(w/2-zw/2),cyc+int(h*0.05))

# ---------------- 1:1 FEED ----------------
def poster_square(c,out):
    w=hh=1080; img=forest_bg(w,hh); d=ImageDraw.Draw(img); frame(d,w,hh)
    logo_lockup(img,w//2,int(hh*0.055),46); d=ImageDraw.Draw(img)
    yp=pill(d,w//2,int(hh*0.135),c["badge"])
    wrap_center(d,c["title"],PF(700,60),IVORY,w//2,yp+int(hh*0.03),0,4,int(w*0.82))
    # AKI bas-gauche — sa tablette (bord droit) reste dégagée
    bb=place_aki(img,int(hh*0.50),int(w*0.25),int(hh*0.895))
    aki_right=bb[2]
    # carte à droite : démarre APRÈS le bord droit d'AKI (tablette visible)
    card_x0=max(int(w*0.545),aki_right+int(w*0.03))
    tail=(aki_right-int(w*0.01),int(hh*0.585))  # bec dans l'espace libre, au-dessus de la tablette
    tip_card(img,card_x0,int(hh*0.485),int(w*0.94),c["tip"],c["sign"],scale=0.90,tail_to=tail)
    contact_band(img,c["zone"])
    img.convert("RGB").save(out,quality=92); print("  1x1 ->",os.path.relpath(out,REPO))

# ---------------- 9:16 STORY ----------------
def poster_story(c,out):
    w,hh=1080,1920; img=forest_bg(w,hh,deep=True); d=ImageDraw.Draw(img); frame(d,w,hh)
    logo_lockup(img,w//2,int(hh*0.05),52); d=ImageDraw.Draw(img)
    yp=pill(d,w//2,int(hh*0.105),c["badge"],scale=1.05)
    y=wrap_center(d,c["title"],PF(700,82),IVORY,w//2,yp+int(hh*0.025),0,8,int(w*0.84))
    tip_card(img,int(w*0.09),y+int(hh*0.02),int(w*0.91),c["tip"],c["sign"],scale=1.15)
    place_aki(img,int(hh*0.34),w//2,int(hh*0.885))
    contact_band(img,c["zone"],h_frac=0.075)
    img.convert("RGB").save(out,quality=92); print("  9x16 ->",os.path.relpath(out,REPO))

# ============================================================================
#  CONSEILS À PRODUIRE  (ajoutez une entrée ici pour un nouvel article)
# ============================================================================
CONSEILS=[
    {
        "slug":  "aki-conseil-arnaque",
        "badge": "AKI CONSEILLE  ·  SÉCURITÉ",
        "title": "Louer à distance sans se faire arnaquer",
        "tip":   "Ne versez jamais un loyer ou une caution avant d'avoir visité — sur place ou en visio en direct.",
        "sign":  "— AKI veille sur vous.",
        "zone":  "BÉNIN · CÔTE D'IVOIRE",
    },
]

if __name__=="__main__":
    os.makedirs(OUT,exist_ok=True)
    for c in CONSEILS:
        print(c["slug"])
        poster_square(c, os.path.join(OUT,f'{c["slug"]}-1x1.png'))
        poster_story (c, os.path.join(OUT,f'{c["slug"]}-9x16.png'))
    print("OK —",len(CONSEILS),"conseil(s)")
