import json,sys,os
HERE=os.path.dirname(os.path.abspath(__file__))
TEMPLATE=r'''<!doctype html><html lang="ar" dir="rtl"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1,viewport-fit=cover"><meta name="robots" content="noindex"><title>__TITLE__</title>
<link rel="stylesheet" href="https://fonts.googleapis.com/css2?family=Lalezar&family=Noto+Naskh+Arabic:wght@500;700&family=Tajawal:wght@400;500;700;800&display=swap">
<style>
*{box-sizing:border-box;-webkit-tap-highlight-color:transparent}
html,body{margin:0;min-height:100%}
body{font-family:'Tajawal','Geeza Pro','Segoe UI',Tahoma,Arial,sans-serif;font-size:18px;line-height:1.7;color:__INK__;__BODY__}
#app{max-width:820px;margin:0 auto;padding:12px 14px 40px}
h1,h2{font-family:'Lalezar','Tajawal',sans-serif;font-weight:400;margin:.2em 0}
.top{background:__TOPBG__;color:#fff;border-radius:0 0 22px 22px;padding:10px 14px;display:table;width:100%;box-shadow:0 5px 0 __SHADOW__}
.top .t{display:table-cell;vertical-align:middle}.top .m{display:table-cell;vertical-align:middle;text-align:left;width:60px}
.top h1{font-size:1.5rem;margin:0}.top small{opacity:.95;font-weight:700}
.snd{border:0;background:#fff;border-radius:50%;width:44px;height:44px;font-size:1.3rem;cursor:pointer}
.card{background:#fff;border-radius:24px;padding:16px;margin:14px 0;box-shadow:0 7px 0 __SHADOW__;border:4px dashed __DASH__}
.dots{text-align:center;margin:6px 0 2px}.dots i{display:inline-block;width:14px;height:14px;border-radius:50%;background:#e3dccb;margin:0 3px;border:2px solid __INK__}.dots i.on{background:__OK__}.dots i.no{background:__BAD__}.dots i.cur{background:__ACC__}
.q{font-family:'Noto Naskh Arabic','Tajawal',serif;font-weight:700;font-size:1.45rem;line-height:2.1;text-align:center;margin:8px 0 12px}
.pic{display:block;margin:0 auto 6px;width:180px;height:180px;object-fit:contain}
.opts{display:block}
.opt{display:block;width:100%;text-align:right;font-family:'Noto Naskh Arabic','Tajawal',serif;font-weight:700;font-size:1.25rem;line-height:1.8;color:__INK__;background:__OPT__;border:4px solid __INK__;border-radius:18px;padding:10px 16px;margin:10px 0;min-height:58px;cursor:pointer;box-shadow:0 5px 0 __INK__}
.opt:active{transform:translateY(3px);box-shadow:0 2px 0 __INK__}
.opt.ok{background:#bff0cc;border-color:#1f9d4a}.opt.no{background:#ffd0c6;border-color:#e0483a}.opt.dim{opacity:.45}
.fb{margin-top:10px;padding:10px 14px;border-radius:16px;background:#fff6d6;border:3px dashed __INK__;font-weight:700}
.btn{display:inline-block;font:800 1.15rem 'Tajawal',sans-serif;color:#fff;background:__ACC__;border:0;border-radius:99px;padding:12px 28px;min-height:50px;cursor:pointer;box-shadow:0 5px 0 __SHADOW__;margin:6px}
.center{text-align:center}.big{font-family:'Lalezar',sans-serif;font-size:2.6rem;line-height:1.3}
.stars{font-size:2.4rem}
.shake{animation:shk .35s}@keyframes shk{25%{transform:translateX(-8px)}75%{transform:translateX(8px)}}
.pop{animation:pp .35s}@keyframes pp{from{transform:scale(.8);opacity:0}to{transform:none;opacity:1}}
@media (max-width:480px){body{font-size:16px}.q{font-size:1.25rem}.opt{font-size:1.1rem}}
</style></head><body><div id="app"></div><noscript>يلزم تشغيل جافاسكربت لفتح الأسئلة.</noscript>
<script>
var DATA=__DATA__;
var CFG=__CFG__;
(function(){
var app=document.getElementById('app');
function qs(n){var m=location.search.match(new RegExp('[?&]'+n+'=([^&]*)'));return m?decodeURIComponent(m[1]):''}
var g=qs('g');var gm=g.match(/^r([12])-([1-4])$/);
var label=CFG.title;if(gm){label=CFG.classes[gm[1]]+' · '+CFG.groups[+gm[2]-1]}
var muted=false;
function snd(n,v,delay){if(muted)return;setTimeout(function(){try{var a=new Audio(CFG.sfx+n+'.mp3');a.volume=v;var p=a.play();if(p&&p.catch)p.catch(function(){})}catch(e){}},delay||0)}
function shuf(a){a=a.slice();for(var i=a.length-1;i>0;i--){var j=Math.floor(Math.random()*(i+1));var t=a[i];a[i]=a[j];a[j]=t}return a}
function esc(s){return String(s).replace(/&/g,'&amp;').replace(/</g,'&lt;').replace(/>/g,'&gt;')}
function ar(n){return String(n).replace(/\d/g,function(d){return '٠١٢٣٤٥٦٧٨٩'.charAt(+d)})}
var N=10,pool=shuf(DATA),pi=0,qs_=[],i=0,sc=0,mark=[];
function newRound(){qs_=[];while(qs_.length<N){if(pi>=pool.length){pool=shuf(DATA);pi=0}var q=pool[pi++];var opts=[];for(var k=0;k<q.o.length;k++)opts.push({t:q.o[k],k:k});if(!q.fixed)opts=shuf(opts);qs_.push({q:q,o:opts})}i=0;sc=0;mark=[];draw()}
function top(){return '<div class="top"><div class="t"><h1>'+esc(CFG.title)+'</h1><small>'+esc(label)+'</small></div><div class="m"><button class="snd" id="snd" aria-label="الصوت">'+(muted?'🔇':'🔊')+'</button></div></div>'}
function bindTop(){var s=document.getElementById('snd');if(s)s.onclick=function(){muted=!muted;s.innerHTML=muted?'🔇':'🔊'}}
function draw(){
 if(i>=N){return end()}
 var it=qs_[i],q=it.q,dots='';for(var d=0;d<N;d++)dots+='<i class="'+(d<i?(mark[d]?'on':'no'):(d===i?'cur':''))+'"></i>';
 var h=top()+'<div class="card pop"><div class="dots">'+dots+'</div><p class="center" style="margin:0;opacity:.75">السؤال '+ar(i+1)+' من '+ar(N)+'</p>'+(q.img?'<img class="pic" src="'+CFG.img+q.img+'.webp" alt="">':'')+'<div class="q">'+esc(q.q)+'</div><div class="opts">';
 for(var k=0;k<it.o.length;k++)h+='<button class="opt" data-k="'+it.o[k].k+'">'+esc(it.o[k].t)+'</button>';
 h+='</div><div class="fb" id="fb" style="display:none"></div></div>';
 app.innerHTML=h;bindTop();
 var btns=app.getElementsByClassName('opt');var done=false;
 for(var b=0;b<btns.length;b++)(function(btn){btn.onclick=function(){if(done)return;done=true;snd('pop',.4);var ok=(+btn.getAttribute('data-k')===q.a);
  for(var x=0;x<btns.length;x++){var kk=+btns[x].getAttribute('data-k');if(kk===q.a)btns[x].className+=' ok';else if(btns[x]===btn)btns[x].className+=' no shake';else btns[x].className+=' dim'}
  mark[i]=ok;var fb=document.getElementById('fb');fb.style.display='block';
  if(ok){sc++;snd('correct',.6,0);snd('sparkle',.5,60);snd('clap',.5,420);fb.innerHTML='👏 أحسنتِ! '+esc(q.w||'')}
  else{snd('wrong',.5,0);fb.innerHTML='❌ الإجابة الصحيحة: <b>'+esc(q.o[q.a])+'</b>. '+esc(q.w||'')}
  fb.innerHTML+='<div class="center"><button class="btn" id="nx">'+(i+1<N?'السؤال التالي':'النتيجة')+'</button></div>';
  document.getElementById('nx').onclick=function(){i++;draw();window.scrollTo(0,0)}}})(btns[b])}
function end(){
 var st=sc>=9?3:sc>=7?2:sc>=5?1:0;var s='';for(var k=0;k<3;k++)s+=(k<st?'⭐':'☆');
 app.innerHTML=top()+'<div class="card center pop"><div class="big">'+ar(sc)+' من '+ar(N)+'</div><div class="stars">'+s+'</div><p style="font-size:1.3rem;font-weight:800">'+(sc>=9?'ممتاز! ما شاء الله':sc>=7?'أحسنتِ، جيّد جدًّا':sc>=5?'جيّد، نكمل ونتحسّن':'نعيد المحاولة معًا')+'</p><button class="btn" id="ag">لعب جديد</button></div>';
 bindTop();if(st>=1){snd('win',.6,0);snd('clap_long',.5,300)}else snd('wrong',.4,0);
 document.getElementById('ag').onclick=function(){newRound();window.scrollTo(0,0)}}
newRound();
})();
</script></body></html>'''
def build(out,title,data,cfg,theme):
    t=TEMPLATE.replace('__TITLE__',title).replace('__DATA__',json.dumps(data,ensure_ascii=False,separators=(',',':'))).replace('__CFG__',json.dumps(cfg,ensure_ascii=False))
    for k,v in theme.items():t=t.replace('__'+k+'__',v)
    open(out,'w',encoding='utf8').write(t);print(out,len(t)//1024,'KB',len(data),'questions')
if __name__=='__main__':
    dq=json.load(open('/tmp/dq2.json'))
    build(HERE+'/dalala/student/index.html','لوحة الأسئلة · لغتي',dq,
     {'title':'لوحة الأسئلة · لغتي','classes':{'1':'رابع 1','2':'رابع 2'},'groups':['الطموح 🎯','الإبداع 💡','التميّز 🏆','الإنجاز 📚'],'sfx':'../audio/sfx/','img':''},
     {'INK':'#1f2a5c','BODY':'background-color:#c9a368;background-image:repeating-linear-gradient(0deg,#5b3a1233 0 1.5px,transparent 1.5px 5px),repeating-linear-gradient(90deg,#5b3a1233 0 1.5px,transparent 1.5px 5px)','TOPBG':'#2a3c86','SHADOW':'#1b2a63','DASH':'#c9a368','OK':'#34c25a','BAD':'#ff6b4a','ACC':'#4f8fd6','OPT':'#fff6df'})

def science():
    sq=json.load(open('/tmp/sq.json'))
    build(HERE+'/science/student/index.html','لوحة أسئلة العلوم',sq,
     {'title':'لوحة أسئلة العلوم','classes':{'1':'4/1','2':'4/2'},'groups':['المخترعات 🔬','نجمات الفضاء 🚀','العالِمات 🧪','المستكشفات 🌿'],'sfx':'../hanan/sfx/','img':'../hanan/img/'},
     {'INK':'#2b1b10','BODY':'background-color:#ffc72c','TOPBG':'#34c25a','SHADOW':'#00000033','DASH':'#2b1b10','OK':'#34c25a','BAD':'#ff6b4a','ACC':'#3d7bff','OPT':'#ffffff'})
