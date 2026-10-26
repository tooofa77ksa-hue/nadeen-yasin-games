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
select,input.nm{font:700 1.1rem 'Tajawal',sans-serif;border:3px solid __INK__;border-radius:14px;padding:10px 12px;width:100%;margin:6px 0;background:#fff;color:__INK__}
.sent{font-size:.9rem;opacity:.8}
@media (max-width:480px){body{font-size:16px}.q{font-size:1.25rem}.opt{font-size:1.1rem}}
</style></head><body><div id="app"></div><noscript>يلزم تشغيل جافاسكربت لفتح الأسئلة.</noscript>
<script>
var DATA=__DATA__;
var CFG=__CFG__;
var ROSTER=__ROSTER__;
(function(){
var app=document.getElementById('app');
function qs(n){var m=location.search.match(new RegExp('[?&]'+n+'=([^&]*)'));return m?decodeURIComponent(m[1]):''}
var g=qs('g');var gm=g.match(/^r([12])-([1-4])$/);var IND=(qs('i')==='1')||!gm;
var label=CFG.title;if(gm){label=CFG.classes[gm[1]]+' · '+CFG.groups[+gm[2]-1]}
var muted=false,NAME='',RID=rid(),LOAD=(new Date()).getTime();
var N=10,pool=shuf(DATA),pi=0,Q=[],i=0,sc=0,mark=[],mode='free',TID='',lastTid='';
function rid(){return Math.random().toString(36).slice(2,10)}
function snd(n,v,delay){if(muted)return;setTimeout(function(){try{var a=new Audio(CFG.sfx+n+'.mp3');a.volume=v;var p=a.play();if(p&&p.catch)p.catch(function(){})}catch(e){}},delay||0)}
function shuf(a){a=a.slice();for(var k=a.length-1;k>0;k--){var j=Math.floor(Math.random()*(k+1));var t=a[k];a[k]=a[j];a[j]=t}return a}
function esc(s){return String(s).replace(/&/g,'&amp;').replace(/</g,'&lt;').replace(/>/g,'&gt;')}
function ar(n){return String(n).replace(/\d/g,function(d){return '٠١٢٣٤٥٦٧٨٩'.charAt(+d)})}
function post(o,cb){try{var x=new XMLHttpRequest();x.open('POST','https://ntfy.sh/'+CFG.topic,true);x.onreadystatechange=function(){if(x.readyState===4&&cb)cb(x.status>=200&&x.status<300)};x.send(JSON.stringify(o))}catch(e){if(cb)cb(false)}}
function base(){return {s:CFG.subj,c:gm?gm[1]:'0',g:gm?+gm[2]:0,name:NAME,at:(new Date()).getTime()}}
function sendP(f,cb){var o=base();o.t='p';o.rid=RID;o.n=i;o.sc=sc;o.f=f?1:0;post(o,cb)}
function sendA(tid,qi,ok){var o=base();o.t='a';o.tid=tid;o.qi=qi;o.ok=ok?1:0;post(o)}
function top(){return '<div class="top"><div class="t"><h1>'+esc(CFG.title)+'</h1><small>'+esc(label)+'</small></div><div class="m"><button class="snd" id="snd" aria-label="الصوت">'+(muted?'🔇':'🔊')+'</button></div></div>'}
function bindTop(){var s=document.getElementById('snd');if(s)s.onclick=function(){muted=!muted;s.innerHTML=muted?'🔇':'🔊'}}
function mk(q){var opts=[];for(var k=0;k<q.o.length;k++)opts.push({t:q.o[k],k:k});if(!q.fixed)opts=shuf(opts);return {q:q,o:opts}}
function newRound(){RID=rid();Q=[];while(Q.length<N){if(pi>=pool.length){pool=shuf(DATA);pi=0}Q.push(mk(pool[pi++]))}i=0;sc=0;mark=[];mode='free';draw()}
/* شاشة الانتظار (مجموعة) */
function waiting(msg){mode='wait';app.innerHTML=top()+'<div class="card center pop"><div class="big" style="font-size:2rem">'+(msg||'بانتظار سؤال المعلمة…')+'</div><p style="font-size:1.1rem">سيظهر السؤال هنا تلقائيًّا حين ترسله المعلمة. ابقي في هذه الصفحة.</p><div class="stars">⏳</div><button class="btn" id="fr">لعب حرٌّ (١٠ أسئلة)</button></div>';bindTop();document.getElementById('fr').onclick=function(){newRound()}}
function start(){
 if(!IND){waiting();listen();return}
 var cl=gm?gm[1]:'1';var list=ROSTER[cl]||[];var h=top()+'<div class="card center pop"><h2 style="font-size:1.8rem">مرحبًا! من أنتِ؟</h2><p>اختاري اسمكِ لتظهر نتيجتكِ على الشاشة.</p><select id="sel"><option value="">— اختاري اسمكِ —</option>';
 for(var k=0;k<list.length;k++)h+='<option>'+esc(list[k])+'</option>';
 h+='<option value="__o">اسم آخر…</option></select><input class="nm" id="oth" placeholder="اكتبي اسمكِ" style="display:none"><button class="btn" id="go">ابدأي المسابقة</button></div>';
 app.innerHTML=h;bindTop();var sel=document.getElementById('sel'),oth=document.getElementById('oth');sel.onchange=function(){oth.style.display=sel.value==='__o'?'block':'none'};
 document.getElementById('go').onclick=function(){var v=sel.value==='__o'?oth.value.replace(/^\s+|\s+$/g,''):sel.value;if(!v){sel.style.borderColor='#e0483a';return}NAME=v;newRound()}}
/* عرض سؤال */
function draw(){
 if(i>=Q.length){return end()}
 var it=Q[i],q=it.q,dots='';for(var d=0;d<Q.length;d++)dots+='<i class="'+(d<i?(mark[d]?'on':'no'):(d===i?'cur':''))+'"></i>';
 var h=top()+'<div class="card pop">'+(mode==='teacher'?'<p class="center" style="margin:0"><span class="badge" style="background:#ffe08a;border-radius:99px;padding:2px 14px;font-weight:800">سؤال من المعلمة</span></p>':'')+'<div class="dots">'+dots+'</div><p class="center" style="margin:0;opacity:.75">السؤال '+ar(i+1)+' من '+ar(Q.length)+'</p>'+(q.img?'<img class="pic" src="'+CFG.img+q.img+'.webp" alt="">':'')+'<div class="q">'+esc(q.q)+'</div><div class="opts">';
 for(var k=0;k<it.o.length;k++)h+='<button class="opt" data-k="'+it.o[k].k+'">'+esc(it.o[k].t)+'</button>';
 h+='</div><div class="fb" id="fb" style="display:none"></div></div>';
 app.innerHTML=h;bindTop();
 var btns=app.getElementsByClassName('opt');var done=false;
 for(var b=0;b<btns.length;b++)(function(btn){btn.onclick=function(){if(done)return;done=true;snd('pop',.4);var ok=(+btn.getAttribute('data-k')===q.a);
  for(var x=0;x<btns.length;x++){var kk=+btns[x].getAttribute('data-k');if(kk===q.a)btns[x].className+=' ok';else if(btns[x]===btn)btns[x].className+=' no shake';else btns[x].className+=' dim'}
  mark[i]=ok;if(ok)sc++;var fb=document.getElementById('fb');fb.style.display='block';
  if(mode==='teacher')sendA(TID,i,ok);
  if(ok){snd('correct',.6,0);snd('sparkle',.5,60);snd('clap',.5,420);fb.innerHTML='👏 أحسنتم! '+esc(q.w||'')}
  else{snd('wrong',.5,0);fb.innerHTML='❌ الإجابة الصحيحة: <b>'+esc(q.o[q.a])+'</b>. '+esc(q.w||'')}
  var last=(i+1>=Q.length);
  fb.innerHTML+='<div class="center"><button class="btn" id="nx">'+(last?(mode==='teacher'?'بانتظار المعلمة':'النتيجة'):'السؤال التالي')+'</button></div>';
  document.getElementById('nx').onclick=function(){i++;if(mode==='free'&&i===5)sendP(false);draw();window.scrollTo(0,0)}}})(btns[b])}
function end(){
 if(mode==='teacher'){waiting('أحسنتم! بانتظار السؤال التالي');return}
 var st=sc>=9?3:sc>=7?2:sc>=5?1:0;var s='';for(var k=0;k<3;k++)s+=(k<st?'⭐':'☆');
 app.innerHTML=top()+'<div class="card center pop"><div class="big">'+ar(sc)+' من '+ar(Q.length)+'</div><div class="stars">'+s+'</div><p style="font-size:1.3rem;font-weight:800">'+(sc>=9?'ممتاز! ما شاء الله':sc>=7?'أحسنتم، جيّد جدًّا':sc>=5?'جيّد، نكمل ونتحسّن':'نعيد المحاولة معًا')+'</p><p class="sent" id="sent">جارٍ إرسال النتيجة…</p><button class="btn" id="ag">لعب جديد</button>'+(IND?'':'<button class="btn" id="bk" style="background:#ff8a1f">انتظار أسئلة المعلمة</button>')+'</div>';
 bindTop();if(st>=1){snd('win',.6,0);snd('clap_long',.5,300)}else snd('wrong',.4,0);
 sendP(true,function(ok){var e=document.getElementById('sent');if(e)e.innerHTML=ok?'✓ أُرسلت النتيجة إلى شاشة المعلمة':'⚠ لم تصل النتيجة، تأكدي من الإنترنت'});
 document.getElementById('ag').onclick=function(){newRound();window.scrollTo(0,0)};
 var bk=document.getElementById('bk');if(bk)bk.onclick=function(){waiting()}}
/* استقبال أسئلة المعلمة */
function onMsg(m){if(!m||m.t!=='q'||!m.qs||!m.id)return;if(m.id===lastTid)return;if(m.at<LOAD-90000)return;if(m.c&&m.c!=='0'&&gm&&m.c!==gm[1])return;
 lastTid=m.id;TID=m.id;mode='teacher';Q=[];for(var k=0;k<m.qs.length;k++){var q=DATA[m.qs[k]];if(q)Q.push(mk(q))}if(!Q.length)return;i=0;sc=0;mark=[];snd('whoosh',.4);draw();window.scrollTo(0,0)}
function listen(){var url='https://ntfy.sh/'+CFG.topic+'/sse?since=2m';
 if(window.EventSource){try{var es=new EventSource(url);es.onmessage=function(ev){try{var d=JSON.parse(ev.data);if(d.event==='message')onMsg(JSON.parse(d.message))}catch(e){}};return}catch(e){}}
 var since=Math.floor(LOAD/1000)-120;function poll(){try{var x=new XMLHttpRequest();x.open('GET','https://ntfy.sh/'+CFG.topic+'/json?poll=1&since='+since,true);x.onreadystatechange=function(){if(x.readyState===4&&x.status===200){var ls=x.responseText.split('\n');for(var k=0;k<ls.length;k++){if(!ls[k])continue;try{var d=JSON.parse(ls[k]);if(d.time>since)since=d.time;if(d.event==='message')onMsg(JSON.parse(d.message))}catch(e){}}}};x.send()}catch(e){}}
 setInterval(poll,4000);poll()}
start();
})();
</script></body></html>'''
ROSTER={'1':['ألين بدير','تالا المستادي','ترف السلمي','حور الجغثمي','ردينا الصريمي','رغد الخطابي','رواسن المغربي','روز صيرفي','ريم الخطابي','ريما الشهري','ساره الحربي','سمر العمودي','غزل اليعقوبي','فجر الذبياني','قمر','لانا العميري','لينا الرشيدي','ماريا الشمراني','مريم بادنجكي','وجد خرمي'],'2':['أرام عسيري','أسيل وداد','تالا الشمراني','تالا القريقري','تيلا أبو صالح','جميلة السميري','جنى الشريف','حلا الغامدي','دانه اليوبي','روز الحمراني','ريتاج عواجي','ريما بن خميس','شدن الخرماني','شذى يونس','علا زهران','علويه الحداد','غني العوفي','لارين الشمري','لانا آل شبيب','لجين الحانطي','لميس اليوبي','لين بازهير','ماريا الحربي','مريم باشماخ','مشاعل ثابت','ميار الجهني','ندى السهلي','هديل الفارسي','ورد الزهراني']}
TOPICS={'lugha':'nygs-lugha-9f3a2c71d8b4e605','sci':'nygs-science-4be7d0a3c915f862'}
def build(out,title,data,cfg,theme):
    t=TEMPLATE.replace('__ROSTER__',json.dumps(ROSTER,ensure_ascii=False)).replace('__TITLE__',title).replace('__DATA__',json.dumps(data,ensure_ascii=False,separators=(',',':'))).replace('__CFG__',json.dumps(cfg,ensure_ascii=False))
    for k,v in theme.items():t=t.replace('__'+k+'__',v)
    open(out,'w',encoding='utf8').write(t);print(out,len(t)//1024,'KB',len(data),'questions')
if __name__=='__main__':
    dq=json.load(open('/tmp/dq2.json'))
    build(HERE+'/dalala/student/index.html','لوحة الأسئلة · لغتي',dq,
     {'title':'لوحة الأسئلة · لغتي','classes':{'1':'رابع 1','2':'رابع 2'},'groups':['الطموح 🎯','الإبداع 💡','التميّز 🏆','الإنجاز 📚'],'sfx':'../audio/sfx/','img':'','topic':TOPICS['lugha'],'subj':'lugha'},
     {'INK':'#1f2a5c','BODY':'background-color:#c9a368;background-image:repeating-linear-gradient(0deg,#5b3a1233 0 1.5px,transparent 1.5px 5px),repeating-linear-gradient(90deg,#5b3a1233 0 1.5px,transparent 1.5px 5px)','TOPBG':'#2a3c86','SHADOW':'#1b2a63','DASH':'#c9a368','OK':'#34c25a','BAD':'#ff6b4a','ACC':'#4f8fd6','OPT':'#fff6df'})

def science():
    sq=json.load(open('/tmp/sq.json'))
    build(HERE+'/science/student/index.html','لوحة أسئلة العلوم',sq,
     {'title':'لوحة أسئلة العلوم','classes':{'1':'4/1','2':'4/2'},'groups':['المخترعات 🔬','نجمات الفضاء 🚀','العالِمات 🧪','المستكشفات 🌿'],'sfx':'../hanan/sfx/','img':'../hanan/img/','topic':TOPICS['sci'],'subj':'sci'},
     {'INK':'#2b1b10','BODY':'background-color:#ffc72c','TOPBG':'#34c25a','SHADOW':'#00000033','DASH':'#2b1b10','OK':'#34c25a','BAD':'#ff6b4a','ACC':'#3d7bff','OPT':'#ffffff'})
