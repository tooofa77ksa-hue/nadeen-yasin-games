(function(){
'use strict';
var $=function(s){return document.querySelector(s)};
var app=$('#app');
var WA='https://wa.me/966580908077';
var TEAMS=[{n:'فريق الورد',s:'rose',e:'🌹',c:'#e8798f'},{n:'فريق النجوم',s:'star',e:'⭐',c:'#d99a1f'},{n:'فريق الغيوم',s:'cloud',e:'☁️',c:'#4f9fd6'},{n:'فريق الفراشات',s:'butterfly',e:'🦋',c:'#8b66c9'}];
var PLAQ=['pink','green','purple','orange'],LET=[['L_alif','أ'],['L_baa','ب'],['L_jeem','ج'],['L_dal','د']];
function pic(n,e,cls){return '<img class="'+(cls||'')+'" src="img/'+n+'.webp" alt="" onerror="this.outerHTML=\'<span class=&quot;em&quot;>'+e+'</span>\'">'}
function num(n){return String(n)}
function rng(seed){var a=seed>>>0;return function(){a|=0;a=a+0x6D2B79F5|0;var t=Math.imul(a^a>>>15,1|a);t=t+Math.imul(t^t>>>7,61|t)^t;return((t^t>>>14)>>>0)/4294967296}}
function shuffle(arr,r){var a=arr.slice();for(var i=a.length-1;i>0;i--){var j=Math.floor(r()*(i+1));var t=a[i];a[i]=a[j];a[j]=t}return a}
function daySeed(){var d=new Date();return d.getFullYear()*1000+Math.floor((d-new Date(d.getFullYear(),0,0))/864e5)}
function weekSeed(){return Math.floor(daySeed()/7)}
var SUBJ=[{k:'sci',n:'علوم',ic:'ic_sci',e:'🔬',txt:'ألغاز من أسئلة TIMSS'},{k:'math',n:'رياضيات',ic:'ic_math',e:'➕',txt:'أسئلة TIMSS رياضيات',wait:'أسئلة TIMSS للرياضيات لم تصلنا بعد. نضيفها بنفس اللعبة فور وصول ملفها 🌷'}];
var SUB='sci',LES='';function QALL(){return window.TIMSS[SUB]||[]}function Q(){var L=QALL();return LES?L.filter(function(q){return q.lesson===LES}):L}
function lessons(){var m={};QALL().forEach(function(q){m[q.lesson]=(m[q.lesson]||0)+1});return Object.keys(m).sort(function(x,y){return m[y]-m[x]}).map(function(k){return[k,m[k]]})}
function chipsHTML(){var h='<div class="chips"><button class="chip'+(LES?'':' on')+'" data-l="">كل الدروس ('+QALL().length+')</button>';lessons().forEach(function(p){h+='<button class="chip'+(LES===p[0]?' on':'')+'" data-l="'+p[0].replace(/"/g,'')+'">'+p[0]+' ('+p[1]+')</button>'});return h+'</div>'}
function wireChips(cb){document.querySelectorAll('.chip').forEach(function(b){b.onclick=function(){LES=b.dataset.l;cb()}})}
var S={}; // الحالة الحالية
/* ---------- صوت ---------- */
var fsb=$('#fs'),de=document.documentElement;if(fsb&&(de.requestFullscreen||de.webkitRequestFullscreen)){fsb.style.display='block';fsb.onclick=function(){var d=document;if(d.fullscreenElement||d.webkitFullscreenElement){(d.exitFullscreen||d.webkitExitFullscreen).call(d)}else{(de.requestFullscreen||de.webkitRequestFullscreen).call(de)}}}
var snd=$('#snd');if(window.FX&&FX.isMuted&&FX.isMuted())snd.textContent='🔇';
snd.onclick=function(){var m=FX.toggle();snd.textContent=m?'🔇':'🔊'};
/* ---------- الشاشة الرئيسية ---------- */
function tabsHTML(){return '<div class="tabs">'+SUBJ.map(function(s){var rdy=Q&&window.TIMSS[s.k].length;return '<button class="tab'+(s.k===SUB?' on':'')+'" data-k="'+s.k+'">'+pic(s.ic,s.e)+'<span>'+s.n+'</span>'+(rdy?'':'<small>قريباً</small>')+'</button>'}).join('')+'</div>'}
function wireTabs(){document.querySelectorAll('.tab').forEach(function(b){b.onclick=function(){SUB=b.dataset.k;LES='';if(window.FX)FX.pop();home()}})}
function home(){
 S={};var sj=SUBJ.filter(function(s){return s.k===SUB})[0],ready=Q().length>0;
 app.innerHTML='<div class="head">'+pic('trophy','🏆','logo')+'<h1>رحلة الكنز</h1><div class="sub">ألغاز بالكروشيه — بلا درجات وبلا وقت</div></div>'+tabsHTML()+
 (ready?'':'<div class="note">'+sj.wait+'</div>')+
 '<div class="games'+(ready?'':' off')+'">'+
 '<div class="g yarn paper" id="g1"><div class="ic">'+pic('chest','🧰')+pic('scroll','🗺️')+'</div><h2>🗺️ لعبة 1: رحلة الكنز</h2><div class="what"><b>تلعبين وحدكِ.</b> أمامكِ خريطة فيها محطات. تحلّين لغز كل محطة فتقفز الفراشة للمحطة التالية حتى تصلي إلى الكأس 🏆.</div><span class="tag">لاعبة واحدة · جهاز واحد</span><div class="row"><button class="btn">ابدئي الرحلة ←</button></div></div>'+
 '<div class="g yarn paper" id="g2" style="animation-delay:.1s"><div class="ic">'+pic('rose','🌹')+pic('star','⭐')+pic('cloud','☁️')+pic('butterfly','🦋')+'</div><h2>🏆 لعبة 2: سباق الفرق</h2><div class="what"><b>للصف مع المعلمة.</b> من 2 إلى 4 فرق، <b>لكل فريق آيباد</b>. تفتح المعلمة لوحة وتعطي كوداً، وتدخل كل مجموعة الكود وتحلّ نفس الألغاز، وترى الجميع الفراشات تتقدم على الخريطة.</div><span class="tag">2–4 فرق · أجهزة مختلفة · كود</span><div class="row"><button class="btn p2">ابدئي السباق ←</button></div></div>'+
 '</div>'+
 '<div class="note">🌷 هذه اللعبة تدريب على <b>طريقة أسئلة</b> اختبارات TIMSS، فلا درجات ولا ترتيب بين الطالبات. الخطأ عندنا «غرزة تحتاج إعادة» نكمّلها ونمشي. <button class="btn sm" id="gh2">📖 دليل الاستخدام</button></div>';
 wireTabs();var g2=$('#gh2');if(g2)g2.onclick=guide;if(ready){$('#g1').onclick=function(){solo()};$('#g2').onclick=function(){teamHome()}}
}
/* ---------- لعبة فردية ---------- */
function solo(){
 app.innerHTML='<button class="back" id="bk">→ رجوع</button><div class="head"><h1>رحلة الكنز · '+SUBJ.filter(function(s){return s.k===SUB})[0].n+'</h1><div class="sub">اختاري التحدي</div></div>'+
 '<div class="how yarn paper"><h3>ما الدرس؟</h3>'+chipsHTML()+'</div><div class="how yarn paper"><h3>كيف نلعب؟</h3><ol><li>نقرأ السؤال بهدوء.</li><li>نختار الإجابة التي نظنها صحيحة.</li><li>إن كانت صحيحة: تقفز الفراشة للمحطة التالية ⭐.</li><li>وإن لم تكن: «غرزة تحتاج إعادة»، نفكر ونجرّب مرة ثانية.</li></ol></div><div class="games"><div class="g yarn paper" id="d"><div class="ic">'+pic('star','⭐')+'</div><h2>تحدي اليوم</h2><div class="what">5 محطات جديدة كل يوم. نحو 5 دقائق من اللعب الهادئ.</div></div>'+
 '<div class="g yarn paper" id="w"><div class="ic">'+pic('chest','🧰')+'</div><h2>تحدي الأسبوع</h2><div class="what">الخريطة كاملة: 8 محطات للوصول إلى الكنز.</div></div></div>';
 wireChips(solo);$('#bk').onclick=home;$('#d').onclick=function(){startSolo(5,daySeed())};$('#w').onclick=function(){startSolo(8,weekSeed())};
}
function pick(n,seed){var r=rng(seed);var L=Q();var all=L.map(function(q,i){return i});return shuffle(all,r).slice(0,Math.min(n,all.length)).map(function(i){return L[i]})}
function startSolo(n,seed){S={mode:'solo',qs:pick(n,seed),n:n,pos:0,stars:0,seed:seed,tries:0,retry:[]};S.n=S.qs.length;playScreen()}
/* ---------- الخريطة ---------- */
function coords(n){var a=[];for(var k=0;k<n;k++){var t=n>1?k/(n-1):0;var y=88-t*66;var x=50+32*Math.sin(k*1.55+.3);a.push([x,y])}return a}
function mapHTML(n,teams){
 var cs=coords(n),pts='M'+cs.map(function(c){return c[0]+' '+(c[1]*1.233)}).join(' L')+' L50 '+(8*1.233);
 var h='<div class="mapwrap" id="map"><svg viewBox="0 0 100 123.3" preserveAspectRatio="none"><path d="'+pts+'" fill="none" stroke="#fff3ea" stroke-width="2.4" stroke-linecap="round" stroke-dasharray="1 4.2" opacity=".95"/><path d="'+pts+'" fill="none" stroke="#c0486a" stroke-width="1" stroke-linecap="round" stroke-dasharray="1 4.2" opacity=".6"/></svg>';
 h+='<div class="trophy" style="left:50%;top:8%">'+pic('trophy','🏆')+'</div>';
 cs.forEach(function(c,k){h+='<div class="st" id="st'+k+'" style="left:'+c[0]+'%;top:'+c[1]+'%">'+pic('stone','⭕','stone')+'<div class="n">'+pic('d'+(k+1),String(k+1))+'</div></div>'});
 teams.forEach(function(t,i){var p=posXY(n,t.pos,i,teams.length);h+='<div class="av" id="av'+i+'" style="left:'+p[0]+'%;top:'+p[1]+'%">'+pic(t.s,t.e)+'</div>'});
 return h+'</div>';
}
function posXY(n,pos,i,m){var cs=coords(n);var o=m>1?(i-(m-1)/2)*7:0;if(pos<=0)return[50+o-0,95];if(pos>=n+1||pos>n)return[50+o,17];var c=cs[pos-1];return[c[0]+o,c[1]]}
function moveAv(i,n,pos,m){var el=$('#av'+i);if(!el)return;var p=posXY(n,pos,i,m);el.classList.remove('hop');void el.offsetWidth;el.classList.add('hop');el.style.left=p[0]+'%';el.style.top=p[1]+'%'}
/* ---------- شاشة اللعب ---------- */
function playScreen(){
 var me=S.team!=null?TEAMS[S.team]:{s:'butterfly',e:'🦋'};
 app.innerHTML='<div class="pl"><div class="side"><button class="back" id="bk">→ خروج</button><div class="prog" id="pg"></div>'+mapHTML(S.n,[{s:me.s,e:me.e,pos:S.pos}])+'</div><div class="main"><div id="qa"></div></div></div>';
 $('#bk').onclick=function(){if(S.peer){try{S.peer.destroy()}catch(e){}}home()};
 updProg();nextQ();
}
function updProg(){var el=$('#pg');if(!el)return;el.innerHTML='المحطة <b>'+num(Math.min(S.pos+1,S.n))+'</b> من <b>'+num(S.n)+'</b> · نجوم الصوف ⭐ '+num(S.stars)}
function nextQ(){
 var qa=$('#qa');
 if(S.pos>=S.n){return finish()}
 var q=S.qs[S.pos];S.cur=q;S.tries=0;
 var meta='<div class="qmeta">محطة '+num(S.pos+1)+' · '+q.lesson+' · حقيبة TIMSS ص'+num(q.pg)+'</div>';
 var h='<div class="qcard yarn paper">'+meta+'<div class="qtext">'+q.q+'</div>'+(q.fig?'<img class="qfig" src="'+q.fig+'" alt="صورة السؤال">':'');
 if(q.wr){h+='<div class="wr"><textarea id="wa" placeholder="اكتبي إجابتكِ هنا (أو في دفترك)"></textarea><div class="row"><button class="btn" id="rv">اكشفي الإجابة</button></div></div>'}
 else{h+='<div class="opts">';var r=rng((S.seed||1)*7+S.pos*13+(S.team||0));S.order=shuffle([0,1,2,3],r);
  S.order.forEach(function(oi,k){h+='<button class="opt" data-o="'+oi+'" style="--c:'+['#c24a6c','#5c9a3c','#7b5ab0','#d98a3d'][k]+';--pl:url(img/plaque_'+PLAQ[k]+'.webp);--tl:url(img/tile_'+PLAQ[k]+'.webp)"><span class="lt">'+pic(LET[k][0],LET[k][1])+'</span><span>'+q.o[oi]+'</span></button>'});h+='</div>'}
 h+='<div class="fb" id="fb"></div></div>';
 qa.innerHTML=h;
 if(q.wr){$('#rv').onclick=function(){$('#rv').style.display='none';var fb=$('#fb');fb.className='fb show soft';fb.innerHTML='<h3>الإجابة: '+q.ans+'</h3>'+q.why+'<div class="row"><button class="btn g2" id="yes">كتبتُها صح 🧶</button><button class="btn o2" id="no">سأعيدها لاحقاً</button></div>';$('#yes').onclick=function(){solved(true)};$('#no').onclick=function(){solved(false)}}}
 else qa.querySelectorAll('.opt').forEach(function(b){b.onclick=function(){choose(b,+b.dataset.o)}});
 setTimeout(function(){var qc=$('#qa'),m=document.querySelector('.pl .main');if(m&&m.scrollTop)m.scrollTop=0;if(window.innerWidth<window.innerHeight*1.2&&qc&&qc.scrollIntoView&&S.pos>0)qc.scrollIntoView({behavior:'smooth',block:'start'})},60);
}
function choose(btn,oi){
 var q=S.cur,fb=$('#fb');
 if(oi===q.a){
  document.querySelectorAll('.opt').forEach(function(b){b.disabled=true;if(+b.dataset.o!==q.a)b.classList.add('dim')});btn.classList.add('ok');
  var first=S.tries===0;fb.className='fb show good';
  fb.innerHTML='<h3>'+pic('star','⭐')+(first?'نجمة صوف لكِ!':'أحسنتِ! أكملتِ الغرزة')+'</h3><b>لماذا؟</b> '+q.why+'<div class="row"><button class="btn" id="go">المحطة التالية ←</button></div>';
  if(window.FX)FX.correct(first?2:1);
  $('#go').onclick=function(){solved(first)};
 }else{
  S.tries++;btn.classList.add('dim');btn.disabled=true;
  fb.className='fb show soft';fb.innerHTML='<h3>'+pic('scroll','🧶')+'غرزة تحتاج إعادة</h3>🤔 <b>اسألي نفسك:</b> '+q.ask+'<br><small>جرّبي مرة ثانية بهدوء، ما في وقت 🌷</small>';
 }
}
function solved(first){
 if(first)S.stars++;
 S.pos++;updProg();moveAv(0,S.n,S.pos,1);
 if(S.mode==='team')sendPos();
 setTimeout(nextQ,950);
}
function finish(){
 if(window.FX)FX.win();
 var qa=$('#qa');updProg();
 qa.innerHTML='<div class="qcard yarn paper win">'+pic('trophy','🏆')+'<h2>وصلتِ إلى الكأس!</h2><div>ركّزتِ فوصلتِ بتوفيق الله 🌷<br>نجوم الصوف: '+pic('star','⭐')+' <b>'+num(S.stars)+'</b> من '+num(S.n)+'</div><div class="row"><button class="btn" id="again">لعبة جديدة</button><button class="btn p2" id="hm">الرئيسية</button></div></div>';
 $('#again').onclick=function(){if(S.mode==='team'){teamPlayWait()}else solo()};$('#hm').onclick=function(){if(S.peer){try{S.peer.destroy()}catch(e){}}home()};
}
/* ---------- سباق الفرق ---------- */
function teamHome(){
 app.innerHTML='<button class="back" id="bk">→ رجوع</button><div class="head"><h1>سباق الفرق</h1><div class="sub">كل فريق على آيباد، والمعلمة تفتح اللوحة</div></div>'+
 '<div class="games"><div class="g yarn paper" id="t"><div class="ic">'+pic('scroll','📋')+'</div><h2>أنا المعلمة: افتحي اللوحة</h2><div class="what">تظهر خريطة كبيرة وكود من 4 أرقام. تعرضينها على الشاشة، وتعطين الكود للفرق.</div></div>'+
 '<div class="g yarn paper" id="j"><div class="ic">'+pic('butterfly','🦋')+'</div><h2>نحن فريق: ندخل بالكود</h2><div class="what">أدخلي الكود الذي تعرضه المعلمة، وستأخذ مجموعتكِ اسماً (الورد، النجوم، الغيوم، الفراشات).</div></div></div>'+
 '<div class="note">💡 الأجهزة تتواصل مباشرة عبر الإنترنت، فتحتاج كلها إلى اتصال.</div>';
 $('#bk').onclick=home;$('#t').onclick=hostStart;$('#j').onclick=joinScreen;
}
function loadPeer(cb,err){if(window.Peer)return cb();var s=document.createElement('script');s.src='https://unpkg.com/peerjs@1.5.4/dist/peerjs.min.js';s.onload=cb;s.onerror=function(){err('تعذّر الاتصال بخدمة الربط. تأكدي من الإنترنت ثم أعيدي.')};document.head.appendChild(s)}
function newCode(){return String(Math.floor(1000+Math.random()*9000))}
/* المعلمة */
function hostStart(){
 app.innerHTML='<div class="note">جارٍ تجهيز الغرفة… 🧶</div>';
 loadPeer(function(){
  var code=newCode();var peer=new Peer('ntimss'+code);
  var H={code:code,peer:peer,teams:[],conns:[],started:false,n:8,seed:weekSeed(),subj:SUB,lesson:''};S={mode:'host',H:H,peer:peer};
  peer.on('error',function(e){if(e.type==='unavailable-id'){try{peer.destroy()}catch(x){};hostStart()}else{app.innerHTML='<div class="note">تعذّر فتح الغرفة ('+e.type+'). تأكدي من الإنترنت ثم <button class="btn sm" id="rt">أعيدي</button></div>';$('#rt').onclick=hostStart}});
  peer.on('open',function(){hostScreen()});
  peer.on('connection',function(c){c.on('data',function(m){hostMsg(c,m)});c.on('close',function(){})});
 },function(m){app.innerHTML='<div class="note">'+m+' <button class="btn sm" id="rt">أعيدي</button></div>';$('#rt').onclick=hostStart});
}
function hostBroadcast(extra){var H=S.H;var st={t:'state',subj:H.subj,lesson:H.lesson,started:H.started,n:H.n,seed:H.seed,teams:H.teams.map(function(t){return{idx:t.idx,pos:t.pos,stars:t.stars}}),winner:H.winner};if(extra)for(var k in extra)st[k]=extra[k];H.conns.forEach(function(c){try{c.send(st)}catch(e){}})}
function hostMsg(c,m){
 var H=S.H;if(!m)return;
 if(m.t==='join'){
  var ex=H.conns.indexOf(c);
  if(ex<0){if(H.teams.length>=4){c.send({t:'full'});return}var idx=H.teams.length;H.teams.push({idx:idx,pos:0,stars:0});H.conns.push(c);c.send({t:'assigned',idx:idx});if(window.FX)FX.pop()}
  hostBroadcast();hostRefresh();
 }else if(m.t==='pos'){
  var t=H.teams[m.idx];if(!t)return;t.pos=m.pos;t.stars=m.stars;
  if(m.pos>=H.n&&H.winner==null){H.winner=m.idx;if(window.FX)FX.win()}
  hostBroadcast();hostRefresh();
 }
}
function hostScreen(){
 var H=S.H;
 app.innerHTML='<div class="hostgrid"><div class="side"><div id="hm"></div></div><div class="main"><div class="head"><h1>لوحة المعلمة</h1></div><div class="note" style="text-align:center">أعطي الفرق هذا الكود وليدخلوا من «نحن فريق»:</div><div class="code">'+H.code+'</div>'+
 '<div class="how yarn paper"><h3>ما الدرس؟</h3>'+chipsHTML()+'</div><div class="row"><button class="btn g2" id="s8">ابدئي: 8 محطات</button><button class="btn o2" id="s5">ابدئي: 5 محطات (سريع)</button></div><div class="prog" id="hp"></div><div class="teams" id="tl"></div>'+
 '<div class="row"><button class="btn p2 sm" id="nw">سباق جديد (نفس الفرق)</button><button class="btn sm" id="hx">إنهاء الغرفة</button></div><div class="how yarn paper"><h3>كيف يجري السباق؟</h3><ol><li>تعرضين هذه الشاشة، وتعطين الكود للفرق.</li><li>كل فريق على آيباد: «نحن فريق» ← يكتب الكود.</li><li>تضغطين «ابدئي»: يحلّ الجميع نفس الألغاز.</li><li>تتقدم الفراشات على الخريطة حتى الكأس 🏆.</li></ol></div></div></div>';
 wireChips(function(){H.lesson=LES;hostScreen()});$('#s8').onclick=function(){hostGo(8)};$('#s5').onclick=function(){hostGo(5)};
 $('#nw').onclick=function(){H.teams.forEach(function(t){t.pos=0;t.stars=0});H.winner=null;H.started=false;H.seed=Math.floor(Math.random()*1e6);hostBroadcast();hostRefresh()};
 $('#hx').onclick=function(){try{S.peer.destroy()}catch(e){}home()};
 hostRefresh();
}
function hostGo(n){var H=S.H;n=Math.min(n,Q().length);if(!H.teams.length){$('#hp').textContent='ننتظر أول فريق يدخل بالكود… 🧶';return}H.n=n;H.started=true;H.winner=null;H.teams.forEach(function(t){t.pos=0;t.stars=0});hostBroadcast();hostRefresh()}
function hostRefresh(){
 var H=S.H;if(!H||!$('#tl'))return;
 $('#hp').textContent=H.started?(H.winner!=null?'🏆 وصل '+TEAMS[H.winner].n+' إلى الكأس! والبقية يكملون بهدوء':'السباق جارٍ… '+H.n+' محطات'):(H.teams.length?'دخل '+H.teams.length+' من الفرق. اضغطي ابدئي':'ننتظر دخول الفرق… 🧶');
 var mh=$('#hm');var ts=H.teams.map(function(t){return{s:TEAMS[t.idx].s,e:TEAMS[t.idx].e,pos:t.pos}});
 if(!mh.firstChild||mh.dataset.n!=String(H.n)){mh.dataset.n=H.n;mh.innerHTML=mapHTML(H.n,ts)}
 else ts.forEach(function(t,i){if(!$('#av'+i)){mh.innerHTML=mapHTML(H.n,ts)}else moveAv(i,H.n,t.pos,ts.length)});
 $('#tl').innerHTML=H.teams.map(function(t){var T=TEAMS[t.idx];return '<div class="tm yarn" style="--c:'+T.c+'">'+pic(T.s,T.e)+'<div class="nm">'+T.n+'</div><div class="ss">المحطة '+num(Math.min(t.pos,H.n))+' من '+num(H.n)+' · ⭐ '+num(t.stars)+'</div></div>'}).join('');
}
/* الفريق */
function joinScreen(){
 app.innerHTML='<button class="back" id="bk">→ رجوع</button><div class="head"><h1>ندخل بالكود</h1></div><input class="codein" id="ci" inputmode="numeric" maxlength="4" placeholder="0000"><div class="row"><button class="btn" id="jn">دخول</button></div><div class="prog" id="jm"></div>';
 $('#bk').onclick=teamHome;
 $('#jn').onclick=function(){var code=$('#ci').value.trim();if(code.length!==4){$('#jm').textContent='اكتبي الكود المكوّن من 4 أرقام';return}$('#jm').textContent='نتصل… 🧶';
  loadPeer(function(){var peer=new Peer();S={mode:'team',peer:peer,code:code};
   peer.on('error',function(e){$('#jm').textContent=e.type==='peer-unavailable'?'ما لقينا هذه الغرفة. تأكدي من الكود 🌷':'تعذّر الاتصال ('+e.type+')'});
   peer.on('open',function(){var c=peer.connect('ntimss'+code,{reliable:true});S.conn=c;
    var to=setTimeout(function(){if(S.team==null)$('#jm').textContent='لم نصل للغرفة. تأكدي من الكود ثم أعيدي.'},9000);
    c.on('open',function(){c.send({t:'join'})});
    c.on('data',function(m){teamMsg(m,to)});
    c.on('close',function(){if(S.mode==='team'&&$('#pg'))$('#pg').textContent='انقطع الاتصال بالمعلمة 🌷'})})},
  function(m){$('#jm').textContent=m})}
}
function teamMsg(m,to){
 if(m.t==='assigned'){clearTimeout(to);S.team=m.idx;teamPlayWait()}
 else if(m.t==='full'){$('#jm').textContent='الغرفة ممتلئة (4 فرق) 🌷'}
 else if(m.t==='state'){
  S.known=m;
  if(m.started&&(!S.running||S.runSeed!==m.seed||S.runN!==m.n)){S.running=1;S.runSeed=m.seed;S.runN=m.n;if(m.subj)SUB=m.subj;LES=m.lesson||'';S.qs=pick(m.n,m.seed);S.n=S.qs.length;S.pos=0;S.stars=0;S.seed=m.seed;playScreen();sendPos()}
  if(!m.started&&S.running){S.running=0;S.runSeed=null;teamPlayWait()}
  if(m.winner!=null&&S.running&&m.winner!==S.team&&!S.sawWin){S.sawWin=1;var pg=$('#pg');if(pg)pg.innerHTML='🎉 مبروك '+TEAMS[m.winner].n+'! نكمل بهدوء حتى نصل جميعاً 🌷';if(window.FX)FX.hearts()}
  if(m.winner==null)S.sawWin=0;
 }
}
function teamPlayWait(){var T=TEAMS[S.team];S.running=0;
 app.innerHTML='<div class="head">'+pic(T.s,T.e,'logo')+'<h1>'+T.n+'</h1><div class="sub">أهلاً بكِ! ننتظر أن تبدأ المعلمة السباق 🧶</div></div><div class="note">اسم مجموعتكِ: <b>'+T.n+'</b>. حين تضغط المعلمة «ابدئي» تبدأ الألغاز تلقائياً.</div>'}
function sendPos(){if(S.conn&&S.conn.open)try{S.conn.send({t:'pos',idx:S.team,pos:S.pos,stars:S.stars})}catch(e){}}

/* ---------- دليل الاستخدام ---------- */
function guide(){
 app.innerHTML='<div class="gd"><button class="back" id="bk">→ رجوع</button><div class="head">'+pic('scroll','📖','logo')+'<h1>دليل الاستخدام</h1><div class="sub">كل ما تحتاجينه لتبدئي وتفهمي اللعب</div></div>'+
 '<div class="sec yarn paper"><h2>'+pic('trophy','🏆')+'ما هذا الموقع؟</h2><ul><li>ألغاز علوم بأسلوب أسئلة <b>TIMSS</b> الدولية، لطالبات وطلاب الصف الرابع.</li><li><b>بلا درجات وبلا وقت</b>: هدفنا أن نفهم ونتعلّم، لا أن نتسابق مع الساعة.</li><li>الأسئلة من حقيبة TIMSS التدريبية (وزارة التعليم)، بصورها كما هي.</li></ul></div>'+
 '<div class="sec yarn paper"><h2>'+pic('chest','🗺️')+'اللعبة 1: رحلة الكنز (لاعبة واحدة)</h2><ol><li>نختار المادة من الأزرار في أعلى الصفحة (علوم الآن).</li><li>نضغط «رحلة الكنز» ثم نختار <b>تحدي اليوم</b> (5 محطات) أو <b>تحدي الأسبوع</b> (8 محطات)، ونقدر نختار درساً معيّناً.</li><li>نقرأ السؤال بهدوء وننظر إلى الصورة، ثم نضغط الإجابة التي نظنها صحيحة.</li><li>إن كانت صحيحة: تظهر <b>نجمة صوف</b> وشرح قصير، وتقفز الفراشة للمحطة التالية.</li><li>وإن لم تكن: تظهر «غرزة تحتاج إعادة» وسؤال يساعدنا على التفكير، ونجرّب مرة ثانية.</li><li>عند الوصول إلى الكأس 🏆 تنتهي الرحلة، ونقدر نبدأ رحلة جديدة.</li></ol></div>'+
 '<div class="sec yarn paper"><h2>'+pic('rose','🌹')+'اللعبة 2: سباق الفرق (للصف مع المعلمة)</h2><p><b>تحتاج:</b> جهازاً للمعلمة (أو شاشة عرض) وآيباداً لكل فريق، وكلها متصلة بالإنترنت.</p><ol><li><b>المعلمة:</b> «سباق الفرق» ← «أنا المعلمة: افتحي اللوحة». يظهر كود من 4 أرقام وخريطة كبيرة.</li><li><b>كل فريق:</b> «سباق الفرق» ← «نحن فريق» ← يكتب الكود. يأخذ اسماً: الورد، النجوم، الغيوم، أو الفراشات.</li><li><b>المعلمة:</b> تختار الدرس ثم تضغط «ابدئي: 8 محطات» (أو 5 للسريع).</li><li>يحلّ كل فريق نفس الألغاز على جهازه، وتتقدم فراشته على الخريطة الكبيرة.</li><li>عند وصول فريق إلى الكأس يُهنَّأ، ويكمل الباقون بهدوء حتى يصلوا جميعاً. لا ترتيب لأسماء الطالبات.</li><li>«سباق جديد» يعيد اللعب بنفس الفرق.</li></ol></div>'+
 '<div class="sec yarn paper"><h2>'+pic('star','⭐')+'ماذا تعني الرموز؟</h2><div class="leg"><div>'+pic('star','⭐')+'<span>نجمة صوف: إجابة صحيحة من أول مرة</span></div><div>'+pic('scroll','🧶')+'<span>غرزة تحتاج إعادة: نفكّر ونجرّب ثانية</span></div><div>'+pic('butterfly','🦋')+'<span>الفراشة: تبيّن أين وصلنا على الخريطة</span></div><div>'+pic('stone','⭕','')+'<span>الحجر المرقّم: محطة فيها لغز</span></div><div>'+pic('trophy','🏆')+'<span>الكأس: نهاية الرحلة</span></div><div>'+pic('chest','🧰')+'<span>الكنز: مكافأة من وصل</span></div></div></div>'+
 '<div class="sec yarn paper"><h2>💡 نصائح</h2><ul><li>زر <b>⛶</b> في أعلى الصفحة يملأ الشاشة (الآيباد والكمبيوتر). في الآيفون: «مشاركة ← إضافة إلى الشاشة الرئيسية».</li><li>زر <b>🔊</b> يكتم الصوت أو يفتحه.</li><li>الأفضل أن تُعرض لوحة المعلمة على <b>شاشة عرض أفقية</b>.</li><li>إن حدث خلل في السباق: «إنهاء الغرفة» ثم نفتح غرفة جديدة بكود جديد.</li></ul></div>'+
 '<div class="sec yarn paper"><h2>❓ أسئلة شائعة</h2><details><summary>لماذا الرياضيات مكتوب عليها «قريباً»؟</summary><p>لأن أسئلتها لم تُضف بعد. اللعبة جاهزة وتنتظر الأسئلة.</p></details><details><summary>هل في درجات أو ترتيب؟</summary><p>لا. عندنا نجوم صوف للتشجيع فقط، وفي السباق نحتفل بوصول الفرق دون ترتيب أسماء الطالبات.</p></details><details><summary>من أين الأسئلة؟</summary><p>من «الحقيبة التدريبية للاختبارات الدولية TIMSS للصف الرابع علوم» الصادرة عن وزارة التعليم. اخترنا أسئلة الصف الرابع من نوع الاختيار من متعدد.</p></details><details><summary>السباق لا يتصل. ماذا أفعل؟</summary><p>تأكدي أن كل الأجهزة على الإنترنت وأن الكود مكتوب صحيحاً (4 أرقام). إن استمر الخلل فالرحلة الفردية تعمل دائماً.</p></details></div>'+
 '<div class="row"><button class="btn big" id="gh">ابدئي اللعب ←</button></div></div>';
 $('#bk').onclick=home;$('#gh').onclick=home;if(location.hash!=='#guide')try{history.replaceState(null,'','#guide')}catch(e){}
}

var gl=document.getElementById('gl');if(gl)gl.onclick=function(e){e.preventDefault();if(S.peer&&S.mode!=='solo'){}guide()};
if(location.hash==='#guide')guide();else home();
window.__S=function(){return S};
})();
