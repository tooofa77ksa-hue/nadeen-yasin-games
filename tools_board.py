import json,os
import tools_student as S
HERE=os.path.dirname(os.path.abspath(__file__))
T=r'''<!doctype html><html lang="ar" dir="rtl"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1,viewport-fit=cover"><meta name="robots" content="noindex"><title>__TITLE__</title>
<link rel="stylesheet" href="https://fonts.googleapis.com/css2?family=Lalezar&family=Noto+Naskh+Arabic:wght@500;700&family=Tajawal:wght@400;500;700;800&display=swap">
<style>
*{box-sizing:border-box}html,body{margin:0;min-height:100%}
body{font:700 18px/1.6 'Tajawal',sans-serif;color:__INK__;__BODY__}
#app{max-width:1200px;margin:0 auto;padding:12px 16px 50px}
h1,h2,h3{font-family:'Lalezar','Tajawal',sans-serif;font-weight:400;margin:.2em 0}
.top{background:__TOPBG__;color:#fff;border-radius:0 0 24px 24px;padding:10px 18px;display:flex;align-items:center;gap:14px;flex-wrap:wrap;box-shadow:0 6px 0 __SHADOW__}
.top h1{font-size:2rem;margin:0;flex:1}
.tag{background:#fff;color:__INK__;border-radius:99px;padding:3px 14px;font-weight:800}
.st{display:inline-block;width:12px;height:12px;border-radius:50%;background:#e0483a;margin-inline-end:6px}.st.on{background:#34c25a}
.btn{font:800 1rem 'Tajawal',sans-serif;border:0;border-radius:99px;padding:8px 18px;cursor:pointer;background:__ACC__;color:#fff;box-shadow:0 4px 0 __SHADOW__;margin:4px}
.btn.g{background:#fff;color:__INK__}.btn.gold{background:#ffb02e;color:#2b1b10}
.tabs{display:flex;gap:8px;flex-wrap:wrap;margin:14px 0}.tabs button{font:800 1.1rem 'Tajawal';border:3px solid __INK__;border-radius:99px;background:#fff;color:__INK__;padding:4px 18px;cursor:pointer;box-shadow:0 4px 0 __INK__}.tabs button.on{background:__ACC__;color:#fff}
.grid{display:grid;grid-template-columns:repeat(auto-fit,minmax(250px,1fr));gap:16px;margin:10px 0}
.gc{position:relative;background:#fff;border-radius:22px;padding:16px 16px 14px;box-shadow:0 8px 0 __SHADOW__;border:4px solid __INK__;text-align:center;transition:transform .4s}
.gc.lead{transform:scale(1.04);border-color:#ffb02e;box-shadow:0 0 0 6px #ffe08a,0 8px 0 __SHADOW__}
.gc h3{font-size:1.7rem}.gc .pts{font:400 3.2rem/1.1 'Lalezar';color:__ACC__}
.gc .meta{opacity:.8;font-size:.95rem}
.bar{height:16px;border-radius:99px;background:#eee;border:3px solid __INK__;overflow:hidden;margin-top:8px}.bar i{display:block;height:100%;background:__ACC__;transition:width .8s}
.cup{width:76px;height:76px;object-fit:contain;position:absolute;top:-34px;right:50%;margin-right:-38px;filter:drop-shadow(0 5px 3px #0004);animation:bob 2.6s ease-in-out infinite}
@keyframes bob{50%{transform:translateY(-8px) rotate(3deg)}}
.rank{position:absolute;top:8px;left:12px;font:400 1.6rem 'Lalezar'}
.win{background:#fff6d6;border:5px solid #ffb02e;border-radius:26px;text-align:center;padding:18px;margin:14px 0;box-shadow:0 8px 0 __SHADOW__}
.win img{width:170px;height:170px;object-fit:contain;animation:bob 2.2s ease-in-out infinite;filter:drop-shadow(0 8px 4px #0004)}
.win h2{font-size:2.8rem;margin:0}
.card{background:#fff;border-radius:20px;padding:12px 16px;margin:12px 0;box-shadow:0 6px 0 __SHADOW__;border:3px dashed __INK__}
table{width:100%;border-collapse:collapse}td,th{padding:6px 10px;text-align:right;border-bottom:2px dashed #0002}th{font-family:'Lalezar';font-weight:400;font-size:1.2rem}
.muted{opacity:.7;font-size:.9rem}
@media (max-width:640px){.top h1{font-size:1.4rem}.gc .pts{font-size:2.6rem}}
</style></head><body><div id="app"></div>
<script>
var CFG=__CFG__;
var QD=__DATA__;
var ROSTER=__ROSTER__;
(function(){
var app=document.getElementById('app');
var KEY='board_'+CFG.subj;
function ls(k,d){try{var v=localStorage.getItem(KEY+k);return v===null?d:JSON.parse(v)}catch(e){return d}}
function ss(k,v){try{localStorage.setItem(KEY+k,JSON.stringify(v))}catch(e){}}
var start=ls('start',0);if(!start){start=(new Date()).getTime()-3600000;ss('start',start)}
var ended=ls('ended',false);var cls=ls('cls','all');var mode=ls('mode','g');
var IND=ls('ind',[]),NAMES=ls('names',null)||ROSTER,USED={},wCls='1',wName='',wQ=-1,wDone=false,R={},connected=false,lastMsg=0,sound=true;
function ar(n){return String(n).replace(/\d/g,function(d){return '٠١٢٣٤٥٦٧٨٩'.charAt(+d)})}
function esc(s){return String(s).replace(/&/g,'&amp;').replace(/</g,'&lt;')}
function snd(n,v){if(!sound)return;try{var a=new Audio(CFG.sfx+n+'.mp3');a.volume=v||.6;var p=a.play();if(p&&p.catch)p.catch(function(){})}catch(e){}}
function confetti(n){var c=document.getElementById('cf');if(!c){c=document.createElement('canvas');c.id='cf';c.style.cssText='position:fixed;inset:0;pointer-events:none;z-index:50;width:100%;height:100%';document.body.appendChild(c)}var x=c.getContext('2d');c.width=innerWidth;c.height=innerHeight;var cols=['#ffc72c','#3d7bff','#34c25a','#ff5a9d','#ff8a1f'],ps=[];for(var i=0;i<n;i++)ps.push({x:Math.random()*c.width,y:-10,vx:Math.random()*2-1,vy:2+Math.random()*4,s:7+Math.random()*8,c:cols[i%5],r:Math.random()*6});var f=0;(function st(){x.clearRect(0,0,c.width,c.height);for(var k=0;k<ps.length;k++){var p=ps[k];p.x+=p.vx;p.y+=p.vy;p.r+=.1;x.fillStyle=p.c;x.save();x.translate(p.x,p.y);x.rotate(p.r);x.fillRect(-p.s/2,-p.s/2,p.s,p.s*.6);x.restore()}if(++f<160)requestAnimationFrame(st);else x.clearRect(0,0,c.width,c.height)})()}
function ingest(m){if(!m||m.at<start)return false;if(m.t==='a'){if(!m.tid)return false;var k='a|'+m.tid+'|'+m.qi+'|'+m.c+'|'+m.g;if(R[k])return false;R[k]=m;lastMsg=(new Date()).getTime();return true}
 if(m.t!=='p'||!m.rid)return false;var o=R[m.rid];if(o&&(o.f>m.f||(o.f===m.f&&o.n>m.n)))return false;R[m.rid]=m;lastMsg=(new Date()).getTime();return true}
function agg(){var G={},P={};for(var ii=0;ii<IND.length;ii++){var e=IND[ii];if(e.at<start)continue;if(cls!=='all'&&e.c!==cls)continue;var pk0=e.c+'|'+e.n;var p0=P[pk0]||(P[pk0]={name:e.n,c:e.c,g:0,pts:0,ans:0,ind:1});p0.pts+=e.ok?1:0;p0.ans+=1}
for(var id in R){var m=R[id];if(cls!=='all'&&m.c!==cls)continue;if(!m.g)continue;var gk=m.c+'-'+m.g;var g=G[gk]||(G[gk]={c:m.c,g:m.g,pts:0,ans:0,names:{},rounds:0});var pts=m.t==='a'?(m.ok?1:0):m.sc,an=m.t==='a'?1:m.n;g.pts+=pts;g.ans+=an;g.rounds++;if(m.name){g.names[m.name]=1;var pk=m.c+'|'+m.name;var p=P[pk]||(P[pk]={name:m.name,c:m.c,g:m.g,pts:0,ans:0});p.pts+=pts;p.ans+=an}}
 return {G:G,P:P}}
function groupList(){var A=agg().G,L=[];var cl=cls==='all'?['1','2']:[cls];for(var a=0;a<cl.length;a++)for(var k=1;k<=4;k++){var g=A[cl[a]+'-'+k]||{c:cl[a],g:k,pts:0,ans:0,names:{},rounds:0};g.n=0;for(var nm in g.names)g.n++;L.push(g)}
 L.sort(function(x,y){return y.pts-x.pts||(y.ans?y.pts/y.ans:0)-(x.ans?x.pts/x.ans:0)});return L}
function activeG(){var n=0,A=agg().G;for(var k in A)if(A[k].ans>0)n++;return n}
var SENT={},CUR=null,REVEAL=false;
function labels(){var L={},o=[];for(var i=0;i<QD.length;i++){var l=QD[i].l||'';(L[l]=L[l]||[]).push(i)}for(var k in L)o.push({l:k,idx:L[k]});o.sort(function(a,b){return b.idx.length-a.idx.length});return o}
function pickIdx(lbl,n){var all=[];if(lbl==='__all'){for(var i=0;i<QD.length;i++)all.push(i)}else{var ls=labels();for(var j=0;j<ls.length;j++)if(ls[j].l===lbl)all=ls[j].idx.slice()}var fresh=[],used=[];for(var k=0;k<all.length;k++)(SENT[all[k]]?used:fresh).push(all[k]);var pool=fresh.length>=n?fresh:fresh.concat(used);pool.sort(function(){return Math.random()-.5});return pool.slice(0,n)}
function sendQ(n){var sel=document.getElementById('lbl');var idx=pickIdx(sel.value,n);if(!idx.length)return;var id='q'+(new Date()).getTime().toString(36);for(var i=0;i<idx.length;i++)SENT[idx[i]]=1;CUR={id:id,qs:idx,label:sel.options[sel.selectedIndex].text};REVEAL=false;var x=new XMLHttpRequest();x.open('POST','https://ntfy.sh/'+CFG.topic,true);x.send(JSON.stringify({t:'q',s:CFG.subj,c:cls==='all'?'0':cls,id:id,qs:idx,label:CUR.label,at:(new Date()).getTime()}));snd('whoosh',.5);render()}
function groupList2(){var o=[],cl=cls==='all'?['1','2']:[cls];for(var a=0;a<cl.length;a++)for(var k=1;k<=4;k++)o.push({c:cl[a],g:k});return o}
function panel(){var ls=labels(),h='<div class="card"><h3>🎯 إرسال الأسئلة للمجموعات</h3><p class="muted" style="margin:0">اختاري نوع الأسئلة ثم أرسليها؛ تظهر في أجهزة المجموعات في الحال، بنفس الترتيب.</p><select id="lbl" style="font:700 1.1rem Tajawal;border:3px solid '+CFG.ink+';border-radius:12px;padding:6px 10px;width:100%;margin:8px 0"><option value="__all">كل الأسئلة ('+ar(QD.length)+')</option>';for(var i=0;i<ls.length;i++)h+='<option value="'+esc(ls[i].l)+'">'+esc(ls[i].l)+' ('+ar(ls[i].idx.length)+')</option>';h+='</select><button class="btn" id="q1">سؤال واحد</button><button class="btn" id="q10">جولة ١٠ أسئلة</button>';
 if(CUR){var A=[];for(var k in R){var m=R[k];if(m.t==='a'&&m.tid===CUR.id&&(cls==='all'||m.c===cls))A.push(m)}var gs=groupList2();h+='<div class="win" style="text-align:right"><b>آخر إرسال:</b> '+esc(CUR.label)+' · '+ar(CUR.qs.length)+' سؤال';if(CUR.qs.length===1){var q=QD[CUR.qs[0]];h+='<div style="font-size:1.5rem;margin:8px 0;font-family:Noto Naskh Arabic,serif">'+esc(q.q)+'</div><div>';for(var o=0;o<q.o.length;o++)h+='<span class="tag" style="display:inline-block;margin:3px;'+(REVEAL&&o===q.a?'background:#bff0cc;border:3px solid #1f9d4a':'')+'">'+esc(q.o[o])+'</span>';h+='</div>'}
 h+='<div style="margin-top:8px">';for(var z=0;z<gs.length;z++){var gg=gs[z],cnt=0,okc=0;for(var y=0;y<A.length;y++)if(A[y].c===gg.c&&+A[y].g===gg.g){cnt++;if(A[y].ok)okc++}h+='<span class="tag" style="display:inline-block;margin:3px">'+CFG.groups[gg.g-1]+' ('+CFG.cl[gg.c]+'): '+(cnt?(CUR.qs.length>1?ar(okc)+' / '+ar(cnt):(REVEAL?(okc?'✅':'❌'):'أجابت')):'…')+'</span>'}h+='</div>';if(CUR.qs.length===1)h+='<button class="btn gold" id="rv">'+(REVEAL?'إخفاء':'كشف الإجابة')+'</button>';h+='</div>'}
 return h+'</div>'}
function bind2(){var a=document.getElementById('q1'),b=document.getElementById('q10'),r=document.getElementById('rv');if(a)a.onclick=function(){sendQ(1)};if(b)b.onclick=function(){sendQ(10)};if(r)r.onclick=function(){REVEAL=!REVEAL;if(REVEAL)snd('sparkle',.5);render()}}
function whoPanel(){var list=NAMES[wCls]||[],h='<div class="card"><h3>🎯 مَن تجيب؟ (إجابة فردية)</h3><p class="muted" style="margin:0">تُختار طالبة من شاشتكِ، ويظهر لها سؤال تجيبه شفهيًّا، ثم تضغطين صحيحة أو خاطئة.</p><div class="tabs" style="margin:8px 0"><button data-w="1" class="'+(wCls==='1'?'on':'')+'">الصف '+CFG.cl['1']+'</button><button data-w="2" class="'+(wCls==='2'?'on':'')+'">الصف '+CFG.cl['2']+'</button></div>';
 h+='<div class="win" style="margin:6px 0;padding:10px"><div id="wn" style="font:400 3rem/1.3 Lalezar;min-height:70px">'+(wName?esc(wName):'؟')+'</div>';
 if(wName&&wQ>=0){var q=QD[wQ];h+='<div style="font-size:1.5rem;font-family:Noto Naskh Arabic,serif;margin:6px 0">'+esc(q.q)+'</div><div>';for(var o=0;o<q.o.length;o++)h+='<span class="tag" style="display:inline-block;margin:3px;'+(wDone&&o===q.a?'background:#bff0cc;border:3px solid #1f9d4a':'')+'">'+esc(q.o[o])+'</span>';h+='</div>';if(!wDone)h+='<button class="btn" id="wok" style="background:#1f9d4a">✅ أجابت صح</button><button class="btn" id="wno" style="background:#e0483a">❌ أخطأت</button>';else h+='<div class="muted">سُجّلت النقطة ✓</div>'}
 h+='</div><button class="btn gold" id="wgo">▶ اختاري طالبة</button> <label class="muted"><input type="checkbox" id="wnr" checked> بدون تكرار</label>';
 h+='<details style="margin-top:8px"><summary>✏ أسماء الصف '+CFG.cl[wCls]+' ('+ar(list.length)+')</summary><div style="margin:6px 0">';for(var i=0;i<list.length;i++)h+='<span class="tag" style="display:inline-block;margin:2px">'+esc(list[i])+' <a href="#" data-d="'+i+'" style="text-decoration:none;color:#e0483a">×</a></span>';h+='</div><input id="wnn" placeholder="اسم جديد" style="font:700 1rem Tajawal;border:3px solid '+CFG.ink+';border-radius:10px;padding:5px 10px"> <button class="btn g" id="wadd">إضافة</button></details></div>';return h}
function whoBind(){var t=app.querySelectorAll('[data-w]');for(var i=0;i<t.length;i++)(function(b){b.onclick=function(){wCls=b.getAttribute('data-w');wName='';wQ=-1;render()}})(t[i]);
 var go=document.getElementById('wgo');if(go)go.onclick=function(){var list=NAMES[wCls]||[];if(!list.length)return;var key=wCls;var pool=[];var nr=document.getElementById('wnr').checked;for(var i=0;i<list.length;i++)if(!nr||!USED[key+'|'+list[i]])pool.push(list[i]);if(!pool.length){USED={};pool=list.slice()}var win=pool[Math.floor(Math.random()*pool.length)];var el=document.getElementById('wn'),n=0,steps=24;wName='';wQ=-1;wDone=false;go.disabled=true;
  (function st(){n++;el.textContent=n>=steps?win:list[Math.floor(Math.random()*list.length)];snd('tick',.35);if(n>=steps){wName=win;USED[key+'|'+win]=1;var sel=document.getElementById('lbl');var ix=pickIdx(sel?sel.value:'__all',1);wQ=ix.length?ix[0]:-1;if(wQ>=0)SENT[wQ]=1;snd('star',.6);setTimeout(render,500)}else setTimeout(st,40+Math.pow(n/steps,3)*420)})()};
 var ok=document.getElementById('wok'),no=document.getElementById('wno');
 var mark=function(v){IND.push({n:wName,c:wCls,ok:v?1:0,at:(new Date()).getTime()});ss('ind',IND);wDone=true;if(v){snd('correct',.6);snd('sparkle',.5);setTimeout(function(){snd('clap',.5)},400);confetti(60)}else snd('wrong',.5);render()};
 if(ok)ok.onclick=function(){mark(true)};if(no)no.onclick=function(){mark(false)};
 var ad=document.getElementById('wadd');if(ad)ad.onclick=function(){var v=document.getElementById('wnn').value.replace(/^\s+|\s+$/g,'');if(v){NAMES[wCls].push(v);ss('names',NAMES);render()}};
 var ds=app.querySelectorAll('[data-d]');for(var k=0;k<ds.length;k++)(function(a){a.onclick=function(e){e.preventDefault();NAMES[wCls].splice(+a.getAttribute('data-d'),1);ss('names',NAMES);render()}})(ds[k])}
function render(){
 var L=groupList(),max=1;for(var i=0;i<L.length;i++)if(L[i].pts>max)max=L[i].pts;
 var P=agg().P,PL=[];for(var k in P)PL.push(P[k]);PL.sort(function(a,b){return b.pts-a.pts||a.ans-b.ans});
 var any=L.length&&L[0].pts>0;var h='<div class="top"><h1>'+CFG.title+'</h1><span class="tag"><i class="st'+(connected?' on':'')+'"></i>'+(connected?'متصل':'غير متصل')+'</span><span class="tag">مجموعات نشطة: '+ar(activeG())+'</span><button class="btn g" id="snd">'+(sound?'🔊':'🔇')+'</button></div>';
 h+=panel();h+=whoPanel();h+='<div class="tabs">';var cs=[['all','الصفان'],['1','الصف '+CFG.cl['1']],['2','الصف '+CFG.cl['2']]];for(var c=0;c<3;c++)h+='<button data-c="'+cs[c][0]+'" class="'+(cls===cs[c][0]?'on':'')+'">'+cs[c][1]+'</button>';
 h+='<span style="flex:1"></span><button data-m="g" class="'+(mode==='g'?'on':'')+'">🏆 المجموعات</button><button data-m="p" class="'+(mode==='p'?'on':'')+'">⭐ الأفراد</button></div>';
 if(ended&&any){var w=L[0],tie=L.length>1&&L[1].pts===w.pts;h+='<div class="win pop"><img src="'+CFG.cup+'" alt=""><h2>'+(tie?'تعادل!':'المجموعة الفائزة')+'</h2><h2 style="color:'+CFG.acc+'">'+CFG.groups[w.g-1]+(cls==='all'?' · الصف '+CFG.cl[w.c]:'')+'</h2><div class="muted" style="font-size:1.2rem">'+ar(w.pts)+' نقطة</div>'+(PL.length?'<h3 style="margin-top:10px">⭐ نجمة المسابقة: '+esc(PL[0].name)+' ('+ar(PL[0].pts)+')</h3>':'')+'</div>'}
 if(mode==='g'){h+='<div class="grid">';for(var i=0;i<L.length;i++){var g=L[i];var lead=(i===0&&g.pts>0);h+='<div class="gc'+(lead?' lead':'')+'">'+(lead?'<img class="cup" src="'+CFG.cup+'" alt="">':'')+'<span class="rank">'+ar(i+1)+'</span><h3>'+CFG.groups[g.g-1]+'</h3><div class="meta">الصف '+CFG.cl[g.c]+' · '+ar(g.n)+' لاعبة</div><div class="pts">'+ar(g.pts)+'</div><div class="meta">إجابة صحيحة من '+ar(g.ans)+'</div><div class="bar"><i style="width:'+Math.round(g.pts/max*100)+'%"></i></div></div>'}h+='</div>'}
 else{h+='<div class="card"><h2>⭐ المتصدرات</h2><table><tr><th>#</th><th>الاسم</th><th>المجموعة</th><th>النقاط</th></tr>';for(var j=0;j<Math.min(PL.length,12);j++){var p=PL[j];h+='<tr><td>'+(j===0?'🏆':ar(j+1))+'</td><td>'+esc(p.name)+'</td><td>'+CFG.groups[p.g-1]+' ('+CFG.cl[p.c]+')</td><td><b>'+ar(p.pts)+'</b> / '+ar(p.ans)+'</td></tr>'}if(!PL.length)h+='<tr><td colspan="4" class="muted">لم تبدأ أي لاعبة بعد…</td></tr>';h+='</table></div>'}
 h+='<div class="center" style="text-align:center;margin-top:16px"><button class="btn gold" id="end">'+(ended?'✅ استمرار المسابقة':'🏆 إنهاء المسابقة وإعلان الفائزة')+'</button><button class="btn g" id="newc">🔄 مسابقة جديدة</button><button class="btn g" id="tst">🧪 تجربة الاتصال</button></div>';
 h+='<div class="card muted">كيف تعمل اللوحة: كل مجموعة تفتح رابطها وتجاوب ٢٠ سؤالاً، وتظهر نقاطها هنا تلقائيًّا. النقاط = عدد الإجابات الصحيحة. لا ترسلي رابط هذه اللوحة للطالبات.</div>';
 app.innerHTML=h;bind();bind2();whoBind()}
function bind(){var q=function(s){return app.querySelectorAll(s)};
 var tb=q('.tabs button');for(var i=0;i<tb.length;i++)(function(b){b.onclick=function(){if(b.getAttribute('data-c')){cls=b.getAttribute('data-c');ss('cls',cls)}else{mode=b.getAttribute('data-m');ss('mode',mode)}render()}})(tb[i]);
 document.getElementById('snd').onclick=function(){sound=!sound;render()};
 document.getElementById('end').onclick=function(){ended=!ended;ss('ended',ended);if(ended){snd('fanfare',.7);snd('win',.5);snd('clap_long',.5);confetti(160)}render()};
 document.getElementById('newc').onclick=function(){if(confirm('بدء مسابقة جديدة ومسح النتائج الحالية؟')){start=(new Date()).getTime();ss('start',start);ended=false;ss('ended',false);R={};render()}};
 document.getElementById('tst').onclick=function(){var x=new XMLHttpRequest();x.open('POST','https://ntfy.sh/'+CFG.topic,true);x.send(JSON.stringify({t:'p',s:CFG.subj,c:'1',g:1+Math.floor(Math.random()*4),name:'لاعبة تجريبية',rid:'t'+Math.random().toString(36).slice(2,7),n:10,sc:5+Math.floor(Math.random()*5),f:1,at:(new Date()).getTime()}))}}
var es;function connect(){try{es=new EventSource('https://ntfy.sh/'+CFG.topic+'/sse?since=12h');es.onopen=function(){connected=true;render()};es.onerror=function(){connected=false;render()};
 es.onmessage=function(ev){try{var d=JSON.parse(ev.data);if(d.event!=='message')return;var m=JSON.parse(d.message);if(ingest(m)){snd('pop',.4);render()}}catch(e){}}}catch(e){connected=false}}
render();connect();
})();
</script></body></html>'''
def build(out,title,cfg,theme,data):
    t=T.replace('__ROSTER__',json.dumps(S.ROSTER,ensure_ascii=False)).replace('__DATA__',json.dumps(data,ensure_ascii=False,separators=(',',':'))).replace('__TITLE__',title).replace('__CFG__',json.dumps(cfg,ensure_ascii=False))
    for k,v in theme.items():t=t.replace('__'+k+'__',v)
    os.makedirs(os.path.dirname(out),exist_ok=True);open(out,'w',encoding='utf8').write(t);print(out,len(t)//1024,'KB')
import tools_student as S
build(HERE+'/dalala/board/index.html','لوحة المسابقة · لغتي',{'title':'🏆 مسابقة لغتي','subj':'lugha','topic':S.TOPICS['lugha'],'cl':{'1':'4/1','2':'4/2'},'groups':['الطموح 🎯','الإبداع 💡','التميّز 🏆','الإنجاز 📚'],'sfx':'../audio/sfx/','cup':'../assets/trophy.webp','acc':'#2a3c86','ink':'#1f2a5c'},
 {'INK':'#1f2a5c','BODY':'background-color:#c9a368;background-image:repeating-linear-gradient(0deg,#5b3a1233 0 1.5px,transparent 1.5px 5px),repeating-linear-gradient(90deg,#5b3a1233 0 1.5px,transparent 1.5px 5px)','TOPBG':'#2a3c86','SHADOW':'#1b2a63','ACC':'#4f8fd6'},json.load(open('/tmp/dq2.json')))
build(HERE+'/science/board/index.html','لوحة المسابقة · العلوم',{'title':'🏆 مسابقة العلوم','subj':'sci','topic':S.TOPICS['sci'],'cl':{'1':'4/1','2':'4/2'},'groups':['المخترعات 🔬','نجمات الفضاء 🚀','العالِمات 🧪','المستكشفات 🌿'],'sfx':'../hanan/sfx/','cup':'../../shared/img/trophy.webp','acc':'#2f8f3f','ink':'#2b1b10'},
 {'INK':'#2b1b10','BODY':'background-color:#ffc72c','TOPBG':'#34c25a','SHADOW':'#00000033','ACC':'#3d7bff'},json.load(open('/tmp/sq.json')))
