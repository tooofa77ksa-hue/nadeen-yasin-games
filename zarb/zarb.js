/* مراجعة جدول الضرب — نادين وحدها. تخزين منفصل: zarb2_ */
(function(){
'use strict';
var $=function(s){return document.querySelector(s)},app=$('#app');
var IMG='../timss/img/';
function pic(n,e,c){return '<img class="'+(c||'')+'" src="'+IMG+n+'.webp" alt="" onerror="this.outerHTML=\'<span class=&quot;em&quot;>'+e+'</span>\'">'}
function dig(n){return String(n).split('').map(function(d){return pic('d'+d,d)}).join('')}
function eq(a,b){return '<bdi class="eq">'+a+' × '+b+'</bdi>'}
function rnd(n){return Math.floor(Math.random()*n)}
function shuf(a){a=a.slice();for(var i=a.length-1;i>0;i--){var j=rnd(i+1),t=a[i];a[i]=a[j];a[j]=t}return a}
/* ---------- الحالة ---------- */
var KEY='zarb2_state';
function load(){try{return JSON.parse(localStorage.getItem(KEY))||{f:{},done:{},ov:null}}catch(e){return{f:{},done:{},ov:null}}}
var ST=load();function save(){try{localStorage.setItem(KEY,JSON.stringify(ST))}catch(e){}}
function fk(a,b){return a+'x'+b}
function F(a,b){var k=fk(a,b);return ST.f[k]||(ST.f[k]={w:0,ok:0,clr:0,seen:0})}
function unres(f){return f.w>0&&f.clr<2}
function status(a,b){var f=ST.f[fk(a,b)];if(!f||!f.seen)return'';if(f.w===0)return'ok';if(f.clr>=2)return'mas';if(f.clr===1)return'fix';return'bad'}
function unresolvedList(){var o=[];Object.keys(ST.f).forEach(function(k){var f=ST.f[k];if(unres(f)){var p=k.split('x');o.push({a:+p[0],b:+p[1],w:f.w,clr:f.clr})}});o.sort(function(x,y){return y.w-x.w||x.a-y.a});return o}
/* ---------- الخطة: خمسة أيام (الأحد–الخميس) ---------- */
var PLAN=[{t:[3]},{t:[4]},{t:[6]},{t:[7]},{t:[8,9]}];
var START=new Date(2026,10,22);
function dayIdx(){if(ST.ov!==null&&ST.ov!==undefined)return ST.ov;var d=new Date();d=new Date(d.getFullYear(),d.getMonth(),d.getDate());var i=Math.round((d-START)/864e5);return Math.max(0,i)}
function dateKey(){var d=new Date();return d.getFullYear()+'-'+(d.getMonth()+1)+'-'+d.getDate()}
var DAYN=['الأحد','الاثنين','الثلاثاء','الأربعاء','الخميس'];
/* ---------- الحيل: لا تُظهر الجواب النهائي أبداً ---------- */
function trickFor(a,b){
 // نستعمل حيلة العامل الأسهل: 1، 10، 2، 5 ثم رقم الجدول
 var x=a,y=b;
 if([1,10,2,5].indexOf(b)>=0&&[1,10,2,5].indexOf(a)<0){x=b;y=a}
 else if([1,10,2,5].indexOf(a)>=0){x=a;y=b}
 else if([1,10,2,5].indexOf(b)>=0){x=b;y=a}
 // x = العامل الذي له حيلة، y = الآخر
 switch(x){
  case 1:return{n:'×1',s:['أي عدد × 1 يبقى كما هو.']};
  case 10:return{n:'×10',s:['نضع صفراً على يمين '+y+'.']};
  case 2:return{n:'×2',s:['نضاعف: '+y+' + '+y+' = ؟']};
  case 5:return{n:'×5',s:['نضرب في 10 أولاً: '+y+' × 10 = '+(y*10),'ثم نأخذ <b>النصف</b>: نصف '+(y*10)+' = ؟']};
  case 3:return{n:'×3',s:[y+' × 2 = '+(y*2)+' (ضاعفنا)','ثم نضيف '+y+' مرة أخرى: '+(y*2)+' + '+y+' = ؟']};
  case 4:return{n:'×4',s:['نضاعف مرتين.','المرة الأولى: '+y+' × 2 = '+(y*2),'المرة الثانية: '+(y*2)+' × 2 = ؟']};
  case 6:return{n:'×6',s:['نضرب في 5 ثم نضيف مرة: 6 = 5 + 1','5 × '+y+' = '+(5*y),'ثم نضيف '+y+': '+(5*y)+' + '+y+' = ؟']};
  case 7:return{n:'×7',s:['7 = 5 + 2','5 × '+y+' = '+(5*y)+'  و  2 × '+y+' = '+(2*y),'نجمع: '+(5*y)+' + '+(2*y)+' = ؟']};
  case 8:return{n:'×8',s:['نضاعف ثلاث مرات.','المرة الأولى: '+y+' × 2 = '+(y*2),'الثانية: '+(y*2)+' × 2 = '+(y*4),'الثالثة: '+(y*4)+' × 2 = ؟']};
  case 9:return{n:'×9',s:['9 = 10 − 1','10 × '+y+' = '+(10*y),'ثم نطرح '+y+': '+(10*y)+' − '+y+' = ؟']};
 }
 return{n:'',s:['نجمع '+a+' عدداً من المرات: '+b+' مرات.']};
}
function fm(s){return s.replace(/(\d[\d\s+×−=؟]*)/g,function(m){return '<bdi class="eq">'+m.trim()+'</bdi> '})}
function trickHTML(a,b){var t=trickFor(a,b);return '<div class="trick"><b>الحيلة ('+t.n+'):</b>'+t.s.map(function(s){return '<span class="zl">• '+fm(s)+'</span>'}).join('')+'</div>'}
function exampleHTML(t){var r=trickFor(t,3);return '<div class="trick"><b>مثال: <bdi class="eq">'+t+' × 3</bdi></b>'+r.s.map(function(s){return '<span class="zl">• '+fm(s.replace(/؟/g,String(t*3)))+'</span>'}).join('')+'</div>'}
var PAT={2:'كل نواتج ×2 أعداد زوجية، وتنتهي بـ 2 و4 و6 و8 و0.',3:'مجموع أرقام الناتج يكون 3 أو 6 أو 9 دائماً (مثل 12 ← 1+2=3).',4:'نواتج ×4 تنتهي بـ 4 و8 و2 و6 و0، وتتكرر.',5:'نواتج ×5 تنتهي بـ 5 أو 0 فقط.',6:'نواتج ×6 كلها زوجية وتنتهي بـ 6 و2 و8 و4 و0.',7:'بعد ×5 نضيف ×2: 7 = 5 + 2.',8:'نواتج ×8 تنتهي بـ 8 و6 و4 و2 و0 (تنزل من اثنين إلى اثنين).',9:'مجموع أرقام الناتج يكون 9 دائماً (مثل 18 ← 1+8=9). وخانة العشرات تزيد واحداً.'};
/* ---------- الشاشات ---------- */
var snd=$('#snd');if(window.FX&&FX.isMuted&&FX.isMuted())snd.textContent='🔇';
snd.onclick=function(){var m=FX.toggle();snd.textContent=m?'🔇':'🔊'};
var RUN=null; // جلسة جارية
function todayPlan(){var i=dayIdx();return{i:i,p:i<PLAN.length?PLAN[i]:null}}
function home(){
 RUN=null;AFTER=null;var un=unresolvedList(),k=dateKey(),dn=ST.done[k]||{};
 var rt=(ST.rit&&ST.rit[k])||{five:0,fing:0};
 var steps='<li><b class="n">1</b><div>نراجع طريقة الأصابع<small>مثال واحد بالمقطع</small></div></li>'+
  (un.length?'<li><b class="n">2</b><div>تنبيهات: '+un.length+' عملية أخطأنا فيها<small>نتذكّر حيلتها</small></div></li>':'')+
  '<li><b class="n">'+(un.length?3:2)+'</b><div>جداول 1 إلى 4 مع الأبلة<small>عمليات عشوائية سريعة</small></div></li>'+
  '<li><b class="n">'+(un.length?4:3)+'</b><div>جدول 5: نكتبه ونحفظه<small>بالنمط، من اليمين</small></div></li>'+
  '<li><b class="n">'+(un.length?5:4)+'</b><div>الأصابع من 7 إلى 10<small>عمليات عشوائية</small></div></li>';
 app.innerHTML='<div class="head"><div class="dayhead">'+pic('trophy','🏆')+'</div><h1>مراجعة جدول الضرب</h1><div class="sub">جولة قصيرة بين الرياضيات والعلوم، بلا وقت وبلا ضغط</div></div>'+
 '<div class="yarn paper" style="padding:.7rem 1rem"><h2 style="margin:0">جولة اليوم</h2><ol class="steps">'+steps+'</ol><div class="row"><button class="btn big" id="go">ابدئي الجولة ←</button></div></div>'+
 '<div class="msg good" style="text-align:center">✍️ أول ما تستلمين ورقة الاختبار: اكتبي جدول 5. ثم الأصابع للضرب من 7 إلى 10.</div><div class="tiles"><div class="yarn paper tile" id="m0"><div class="ic">🎒</div><h2>طرق الاختبار</h2><p>جدول 5 · الأصابع · الجمع للتأكد · مراجعة 1–4</p></div><div class="yarn paper tile" id="m2"><div class="ic">🗺️</div><h2>خريطة إتقاني</h2><p>أين أخطأتُ وأين أتقنتُ</p></div><div class="yarn paper tile" id="m3"><div class="ic">👩‍👧</div><h2>للأم</h2><p>الأخطاء ومسح التقدّم</p></div></div>';
 $('#go').onclick=startToday;$('#m0').onclick=ritual;$('#m2').onclick=mapScreen;$('#m3').onclick=parent;
}
/* خطوات الجلسة */
var AFTER=null,FC=0;
function leave(){if(AFTER){var f=AFTER;AFTER=null;f()}else ritual()}
function startToday(){
 var seq=[{k:'recap'}],un=unresolvedList().slice(0,10);
 if(un.length)seq.push({k:'warn',list:un});
 seq.push({k:'r14'},{k:'five'},{k:'fing'});
 RUN={seq:seq,i:0};step();
}
function bar(){var s=RUN.seq;return '<div class="bar">'+s.map(function(x,i){return '<i class="'+(i<RUN.i?'d':i===RUN.i?'on':'')+'"></i>'}).join('')+'</div>'}
function step(){
 if(RUN.i>=RUN.seq.length)return summary();
 var s=RUN.seq[RUN.i];
 if(s.k==='recap')recap();else if(s.k==='warn')warn(s);else if(s.k==='r14'){AFTER=nextStep;review14()}else if(s.k==='five'){AFTER=nextStep;five()}else if(s.k==='fing'){AFTER=nextStep;FC=0;fingers()}else nextStep();
}
function nextStep(){RUN.i++;step()}
function markDone(w){if(!w)return;var k=dateKey();ST.done[k]=ST.done[k]||{};ST.done[k][w]=1;save()}
/* تنبيهات */
function warn(s){
 app.innerHTML='<button class="back" id="bk">→ الرئيسية</button>'+bar()+'<div class="head"><h1>تنبيهات من الأيام الماضية</h1><div class="sub">هذه العمليات تلخبطنا. نتذكّر حيلتها ثم نحلّها بأنفسنا</div></div>'+
 '<div class="tk">'+s.list.map(function(x){return '<div class="yarn paper" style="padding:.5rem .8rem"><div style="font-size:1.6rem;font-weight:800;color:#a01848">'+eq(x.a,x.b)+' = ؟</div>'+trickHTML(x.a,x.b)+'</div>'}).join('')+'</div>'+
 '<div class="row"><button class="btn big" id="nx">فهمتُ، نجرّب ←</button></div>';
 $('#bk').onclick=home;$('#nx').onclick=nextStep;
}
/* بناء الجدول */
function lesson(s){
 var t=s.t,tr=trickFor(t,3),seq=[];for(var b=1;b<=10;b++)seq.push(t*b);
 app.innerHTML='<button class="back" id="bk">→ الرئيسية</button>'+bar()+'<div class="head"><h1>نبني جدول '+t+'</h1><div class="sub">نضغط ونقفز بـ +'+t+' فيظهر الجدول أمامنا</div></div>'+
 '<div class="cols"><div class="yarn paper" style="padding:.6rem .9rem"><h2 style="margin:0">قفزات الـ '+t+'</h2><div class="lad" id="ld"></div><div class="row"><button class="btn big hop" id="hp">+'+t+'</button><button class="btn sm p2" id="rs">من البداية</button></div><div class="prog" style="color:#6b2a45;-webkit-text-stroke:0;text-shadow:none" id="lc">القفزة 0 من 10</div></div>'+
 '<div class="yarn paper" style="padding:.6rem .9rem"><h2 style="margin:0">الحيلة</h2>'+exampleHTML(t)+(PAT[t]?'<div class="pat">✨ نمط جميل: '+PAT[t]+'</div>':'')+'<div class="msg soft">💡 في الاختبار: نضرب بالحيلة، ثم نتأكد بالجمع: نجمع '+t+' عدداً من المرات.</div></div></div>'+
 '<div class="row"><button class="btn big" id="nx">أنا جاهزة للتدريب ←</button></div>';
 var c=0;function draw(){$('#ld').innerHTML=seq.slice(0,c).map(function(v,i){return '<span class="'+(i===c-1?'last':'')+'">'+v+'</span>'}).join('');$('#lc').textContent='القفزة '+c+' من 10'}
 $('#hp').onclick=function(){if(c<10){c++;draw();if(window.FX&&FX.pop)FX.pop()}if(c===10){markDone('learn');if(window.FX&&FX.ding)FX.ding()}};
 $('#rs').onclick=function(){c=0;draw()};$('#bk').onclick=home;$('#nx').onclick=nextStep;draw();
}
/* الاختبار القصير: إجابة ← تأكد بالجمع ← حيلة عند الاختلاف */
function quiz(s){
 var Q={items:s.items.slice(),idx:0,stars:0,wrong:0,again:[]};RUN.q=Q;
 function ask(){
  if(Q.idx>=Q.items.length){ // إعادة الأخطاء مرة بعد قليل
   if(Q.again.length){Q.items=Q.items.concat(Q.again.splice(0));}
   if(Q.idx>=Q.items.length){markDone(s.mark);return qsum()}
  }
  var it=Q.items[Q.idx];it.try=0;var typed='';
  app.innerHTML='<button class="back" id="bk">→ الرئيسية</button>'+bar()+'<div class="prog">'+s.name+' · السؤال '+(Math.min(Q.idx+1,Q.items.length))+' من '+Q.items.length+'</div>'+
  '<div class="yarn paper qbox"><div class="big">'+eq(it.a,it.b)+' = <span class="ans" id="an"></span></div><div id="area"></div></div>';
  $('#bk').onclick=home;enter();
  function enter(){
   typed='';var area=$('#area');
   area.innerHTML='<div class="msg soft" style="margin-top:.2rem">✏️ نفكّر بالحيلة ونكتب جوابنا، ثم نتأكد بالجمع.</div><div class="pad">'+[1,2,3,4,5,6,7,8,9].map(function(n){return '<button data-d="'+n+'">'+n+'</button>'}).join('')+'<button class="bk" data-d="b">⌫</button><button data-d="0">0</button><button class="ok" data-d="ok">✓</button></div>';
   $('#an').textContent='';
   area.querySelectorAll('button').forEach(function(b){b.onclick=function(){var d=b.dataset.d;if(d==='b')typed=typed.slice(0,-1);else if(d==='ok'){if(typed==='')return;verify(+typed);return}else if(typed.length<3)typed+=d;$('#an').textContent=typed}});
  }
  function verify(ans){
   var area=$('#area'),sum=0,c=0,lad=[];$('#an').textContent=ans;
   area.innerHTML='<div class="msg good" style="margin-top:.2rem">🔍 نتأكد: نجمع '+it.a+' ('+it.b+' مرات) ونرى هل نصل إلى جوابنا.</div><div class="lad" id="lv"></div><div class="row"><button class="btn big hop" id="hv">+'+it.a+'</button></div><div class="prog" style="color:#6b2a45;-webkit-text-stroke:0;text-shadow:none" id="cv">0 من '+it.b+'</div><div id="res"></div>';
   $('#hv').onclick=function(){if(c>=it.b)return;c++;sum+=it.a;lad.push(sum);$('#lv').innerHTML=lad.map(function(v,i){return '<span class="'+(i===c-1?'last':'')+'">'+v+'</span>'}).join('');$('#cv').textContent=c+' من '+it.b;if(window.FX&&FX.pop)FX.pop();if(c===it.b){$('#hv').disabled=true;$('#hv').style.opacity=.4;judge()}};
   function judge(){
    var res=$('#res'),f=F(it.a,it.b);f.seen++;
    if(sum===ans){
     if(it.try===0){
      f.ok++;if(f.w>0){f.clr++}
      Q.stars++;res.innerHTML='<div class="msg good">⭐ تطابق الجمع مع جوابنا! ركّزتِ فوصلتِ. '+(f.w>0&&f.clr>=2?'<br>🌟 هذه العملية صارت من إتقانكِ.':'')+'</div><div class="row"><button class="btn big" id="nq">التالي ←</button></div>';
      if(window.FX)FX.correct(1);save();$('#nq').onclick=function(){Q.idx++;ask()};
     }else{
      res.innerHTML='<div class="msg good">✅ أحسنتِ! بنيتِ الجواب بالجمع بنفسكِ. نعود لها لاحقاً لنتأكد أنها ثبتت.</div><div class="row"><button class="btn big" id="nq">التالي ←</button></div>';save();$('#nq').onclick=function(){Q.idx++;ask()}}
    }else{
     it.try++;Q.wrong++;if(it.try===1){f.w++;f.clr=0;if(!it.queued){it.queued=1;Q.again.push({a:it.a,b:it.b,rv:it.rv,queued:1})}}save();
     res.innerHTML='<div class="msg soft">🤔 جمعنا فوصلنا إلى <b>'+sum+'</b>، لكن جوابنا كان <b>'+ans+'</b>. أيهما نصدّق؟ الجمع بنيناه بأيدينا خطوة خطوة. لنراجع بالحيلة.</div>'+trickHTML(it.a,it.b)+'<div class="msg good">✏️ نكتب الآن الجواب الصحيح بأنفسنا بعد الحيلة:</div><div class="pad">'+[1,2,3,4,5,6,7,8,9].map(function(n){return '<button data-d="'+n+'">'+n+'</button>'}).join('')+'<button class="bk" data-d="b">⌫</button><button data-d="0">0</button><button class="ok" data-d="ok">✓</button></div><div id="fx"></div>';
     var t2='';res.querySelectorAll('.pad button').forEach(function(b){b.onclick=function(){var d=b.dataset.d;if(d==='b')t2=t2.slice(0,-1);else if(d==='ok'){if(+t2===it.a*it.b){$('#an').textContent=t2;$('#fx').innerHTML='<div class="msg good">👏 صحيح! سنراجع هذه العملية غداً مرة ثانية لنتأكد أنها ثبتت.</div><div class="row"><button class="btn big" id="nq">التالي ←</button></div>';$('#nq').onclick=function(){Q.idx++;ask()}}else{$('#fx').innerHTML='<div class="msg soft">ليس بعد. نعيد الحيلة خطوة خطوة 🌷</div>';t2='';$('#an').textContent=''}return}else if(t2.length<3)t2+=d;$('#an').textContent=t2}});
    }
   }
  }
 }
 function qsum(){
  var s2=RUN.seq[RUN.i];
  app.innerHTML='<div class="head">'+pic('star','⭐','logo')+'<h1>أنهيتِ «'+s2.name+'»</h1><div class="sub">⭐ '+Q.stars+' صحيحة من أول مرة · 🧶 '+Q.wrong+' احتاجت حيلة</div></div><div class="yarn paper" style="padding:.7rem 1rem"><p style="font-weight:800;font-size:1.1rem;margin:.2rem">'+(Q.wrong?'العمليات التي احتاجت حيلة تُحفظ لنراجعها غداً بطريقة سهلة. وما أخطأتِ فيه لا نعيده.':'ما شاء الله! ما أخطأتِ في شيء. لا مراجعة لهذا الجزء.')+'</p><div class="row"><button class="btn big" id="nx">التالي ←</button></div></div>';
  if(window.FX&&Q.wrong===0)FX.bravo&&FX.bravo();$('#nx').onclick=nextStep;
 }
 ask();
}
function summary(){
 var un=unresolvedList();markDone('quiz');
 app.innerHTML='<div class="head">'+pic('trophy','🏆','logo')+'<h1>أنهيتِ مهمة اليوم</h1><div class="sub">ركّزتِ فوصلتِ بتوفيق الله 🌷</div></div>'+
 '<div class="yarn paper" style="padding:.7rem 1rem"><h2 style="margin:0">ماذا نراجع غداً؟</h2>'+(un.length?'<p style="font-weight:700">'+un.map(function(x){return eq(x.a,x.b)}).join(' ، ')+'</p><p style="font-weight:700">تظهر غداً في «تنبيهات» مع حيلتها، ونراجعها حتى تنتهي كلها.</p>':'<p style="font-weight:800">لا شيء! كل ما حللتِه كان صحيحاً أو أتقنتِه.</p>')+'<div class="row"><button class="btn" id="hm">الرئيسية</button><button class="btn p2" id="mp">خريطة إتقاني</button></div></div>';
 if(window.FX)FX.win&&FX.win();$('#hm').onclick=home;$('#mp').onclick=mapScreen;
}
/* طريقتي في الاختبار + ورقة الحيل للطباعة */
function method(){
 app.innerHTML='<button class="back" id="bk">→ الرئيسية</button><div class="head"><h1>طريقتي في الاختبار</h1><div class="sub">أربع خطوات سهلة: اضربي ثم تأكدي</div></div>'+
 '<div class="yarn paper" style="padding:.7rem 1rem"><ol class="steps"><li><b class="n">1</b><div>أقرأ العملية: <bdi class="eq">7 × 6</bdi><small>ماذا يطلب مني السؤال؟</small></div></li><li><b class="n">2</b><div>أضرب بالحيلة<small>مثل: ×5 ثم أضيف مرة، أو أضاعف، أو ×10 ثم أطرح</small></div></li><li><b class="n">3</b><div>أتأكد بالجمع<small>أجمع العدد نفسه بعدد المرات: 6 + 6 + 6 + 6 + 6 + 6 + 6</small></div></li><li><b class="n">4</b><div>أكتب الجواب فقط إذا تطابق<small>وإذا اختلف أعيد الحيلة ولا أخاف</small></div></li></ol></div>'+
 '<div class="yarn paper" style="padding:.7rem 1rem;margin-top:.6rem"><h2 style="margin:0">🎬 طريقة الأصابع للجداول الصعبة (6 إلى 9)</h2><p style="font-weight:700;margin:.2rem 0">كل إيد بتشيل رقم وعينها على عشرة: العدد باقي له كام عن عشرة؟ نرفع الصوابع دي (<b>صاحية</b>). الصاحية <b>بتضرب بعض</b> = الآحاد، والصوابع <b>النايمة</b> نعدّها = العشرات.</p><video class="fv" controls playsinline preload="metadata" poster="media/fingers.jpg" src="media/fingers.mp4"></video><p style="font-size:.8rem;font-weight:700;color:#6b2a45;margin:.2rem 0">المقطع لصاحبته (علامتها المائية ظاهرة في أسفله). نستعمله للتعلّم فقط.</p></div>'+
 '<div class="yarn paper" style="padding:.7rem 1rem;margin-top:.6rem"><h2 style="margin:0">قاعدة «قرار واحد»</h2><ol class="steps"><li><b class="n">1</b><div>أضرب بطريقتي<small>طريقة واحدة لكل عملية، لا أبدّلها</small></div></li><li><b class="n">2</b><div>أتأكد بالجمع <u>مرة واحدة</u><small>أجمع العدد بعدد المرات</small></div></li><li><b class="n">3</b><div>إن تطابق: أكتب وأمشي<small>لا أعيد الحساب ولا أشك</small></div></li><li><b class="n">4</b><div>إن اختلف: أعيد طريقتي مرة واحدة<small>ثم أنظر الخطوات</small></div></li></ol></div>'+
 '<div class="yarn paper" style="padding:.7rem 1rem;margin-top:.6rem"><h2 style="margin:0">حيلة كل جدول</h2><div class="tk">'+[2,3,4,5,6,7,8,9].map(function(a){var t=trickFor(a,3);return '<div class="trick"><b>×'+a+':</b> '+(a===2?'نضاعف.':a===3?'×2 ثم نضيف مرة.':a===4?'نضاعف مرتين.':a===5?'×10 ثم النصف.':a===6?'×5 ثم نضيف مرة.':a===7?'×5 ثم ×2 ونجمع.':a===8?'نضاعف ثلاث مرات.':'×10 ثم نطرح مرة.')+'</div>'}).join('')+'</div><div class="msg good">💡 وإن نسيتِ: <b>بدّلي المكان</b> (6 × 7 = 7 × 6) أو <b>تأكدي بالقسمة</b>.</div><div class="row"><button class="btn" id="pr">🖨️ اطبعي الورقة</button></div></div>';
 $('#bk').onclick=home;$('#pr').onclick=printCard;
}
function printCard(){
 var pc=$('#printcard');
 pc.innerHTML='<h1>طريقتي في الاختبار — جدول الضرب</h1><div class="pb"><b>أول ما أستلم ورقة الاختبار:</b> أطلب ورقة جانبية أو أكتب في خلف الورقة (أسأل المعلمة قبل الاختبار)، وأكتب جدول 5.</div><div class="pb"><b>جدول 5 (من اليمين):</b> خانة 1: 5 0 5 0 5 0 5 0 5 0 ← ثم خانة 10: 0 1 1 2 2 3 3 4 4 5.</div><div class="pb"><b>الأصابع للضرب من 7 إلى 10:</b> كل يد تمسك رقماً. كم باقي لهذا الرقم ليصير 10؟ أرفع هذا العدد: هذه الأصابع <b>الواقفة</b>، والباقية <b>النائمة</b>. الواقفة أضربها ببعضها ← خانة 1. النائمة أعدّها وكل واحدة 10 ← خانة 10. مثال 8 × 6: الواقفة 2 × 4 = 8 ← خانة 1، والنائمة 3 و1 ← 4 ← خانة 10 ← الناتج 48.</div><div class="pb"><b>شوفي المقطع، مهم.</b> وأراجع الطريقة كل يوم.</div><div class="pf">إعداد: عواطف الجهني · جهد شخصي لوجه الله · اللهم تقبّله منا واجعله نافعاً · للطلبات (واتساب): 966580908077</div>';
 window.print();
}
/* خريطة الإتقان */
function mapScreen(){
 var h='<table class="map"><tr><th></th>'+[1,2,3,4,5,6,7,8,9,10].map(function(b){return '<th>'+b+'</th>'}).join('')+'</tr>';
 for(var a=2;a<=9;a++){h+='<tr><th>×'+a+'</th>';for(var b=1;b<=10;b++)h+='<td class="'+status(a,b)+'"></td>';h+='</tr>'}h+='</table>';
 app.innerHTML='<button class="back" id="bk">→ الرئيسية</button><div class="head"><h1>خريطة إتقاني</h1><div class="sub">كل مربع عملية: الصف هو الجدول، والعمود هو العدد الآخر</div></div><div class="yarn paper" style="padding:.7rem 1rem">'+h+'<div class="leg2"><span><b style="background:#ddd"></b>لم أجرّبها</span><span><b style="background:#8fd17a"></b>صحيحة من أول مرة</span><span><b style="background:#e8586f"></b>تحتاج مراجعة</span><span><b style="background:#f2b44d"></b>قريبة من الإتقان</span><span><b style="background:#3f7a25"></b>أتقنتُها</span></div></div>';
 $('#bk').onclick=home;
}
/* للأم */
function parent(){
 var un=unresolvedList();
 app.innerHTML='<button class="back" id="bk">→ الرئيسية</button><div class="head"><h1>للأم</h1><div class="sub">متابعة هادئة، بلا ضغط على نادين</div></div>'+
 '<div class="yarn paper" style="padding:.7rem 1rem"><h2 style="margin:0">الجولة اليومية</h2><p style="font-weight:700">كل يوم الجولة نفسها: مراجعة الأصابع، جداول 1 إلى 4 مع الأبلة، جدول 5 بالنمط، والأصابع من 7 إلى 10. بلا جدول أسبوعي. والجمع للتأكد احتياط فقط.</p>'+
 '<h2 style="margin:.4rem 0 0">أخطاء لم تُحسم بعد</h2>'+(un.length?'<p style="font-weight:700">'+un.map(function(x){return eq(x.a,x.b)+' ('+x.w+' مرة)'}).join(' ، ')+'</p>':'<p style="font-weight:700">لا شيء حالياً.</p>')+
 '<div class="row"><button class="btn sm" id="rs">مسح تقدّم نادين</button></div></div>';
 $('#bk').onclick=home;
 $('#rs').onclick=function(){if(confirm('نمسح كل تقدّم نادين في جدول الضرب؟')){ST={f:{},done:{},ov:null};save();parent()}};
}
/* ===== صفحات الطرق: جدول 5 · الأصابع · الجمع للتأكد · مراجعة 1–4 ===== */
function rit(){var k=dateKey();ST.rit=ST.rit||{};ST.rit[k]=ST.rit[k]||{five:0,fing:0};return ST.rit[k]}
function vid(src,poster,credit){return '<div class="vbox"><div class="vt">🎬 شوفي المقطع، مهم</div><video class="fv" controls playsinline preload="metadata" poster="'+poster+'" src="'+src+'"></video><div class="vc">'+credit+'</div></div>'}
var CR='المقطع لصاحبه (بلهجته). نستعمله للتعلّم فقط.';
function tools(){ritual()}
function ritual(){
 var r=rit();
 app.innerHTML='<div class="head"><h1>طرق نادين في الاختبار</h1><div class="sub">كل طريقة في صفحة، لا تختلط ببعضها</div></div>'+
 '<div class="msg good" style="text-align:center">✍️ أول ما تستلمين ورقة الاختبار: اكتبي جدول 5 في ورقة جانبية أو خلف الورقة (اسألي المعلمة قبل الاختبار).</div>'+
 '<div class="tiles"><div class="yarn paper tile" id="t5"><div class="ic">✍️</div><h2>جدول 5</h2><p>أكتبه في أول الاختبار</p><small>اليوم: '+r.five+' من 3 مرات</small></div>'+
 '<div class="yarn paper tile" id="tf"><div class="ic">🖐️</div><h2>الأصابع</h2><p>للضرب من 7 إلى 10</p><small>اليوم: '+r.fing+' من 5 أزواج</small></div>'+
 '<div class="yarn paper tile" id="ta"><div class="ic">➕</div><h2>الجمع للتأكد</h2><p>احتياط إذا شككتِ</p><small>صفحة مستقلة</small></div>'+
 '<div class="yarn paper tile" id="tr"><div class="ic">🔁</div><h2>مراجعة 1 إلى 4</h2><p>سهلة وسريعة، في اليوم نفسه</p><small>مع المعلمة</small></div></div>';
 $('#t5').onclick=five;$('#tf').onclick=fingers;$('#ta').onclick=addPage;$('#tr').onclick=review14;
}
/* جدول 5 */
function five(){
 var lvl=0;
 function draw(){
  var rows='';for(var n=1;n<=10;n++)rows+='<div class="fr"><bdi class="eq">5 × '+n+' =</bdi><input class="ti" inputmode="numeric" maxlength="1" data-r="'+n+'" data-p="u" aria-label="خانة 1"><input class="ti" inputmode="numeric" maxlength="1" data-r="'+n+'" data-p="t" aria-label="خانة 10"></div>';
  var steps='<ol class="steps"><li><b class="n">1</b><div>نكتب العمليات من 5×1 إلى 5×10<small>تحت بعضها</small></div></li><li><b class="n">2</b><div>نبدأ من اليمين: خانة 1<small>نكتب 5 ثم 0 ثم 5 ثم 0 … إلى آخر سطر</small></div></li><li><b class="n">3</b><div>ثم خانة 10 (على اليسار)<small>نبدأ بـ 0، وبعده كل رقم مرتين: 0 1 1 2 2 3 3 4 4 5</small></div></li><li><b class="n">4</b><div>نقرأ الناتج كأي رقم<small>مثال 5×4: خانة 10 فيها 2، وخانة 1 فيها 0 ← 20</small></div></li></ol>';
  app.innerHTML='<button class="back" id="bk">→ الرجوع</button><div class="head"><h1>جدول 5</h1><div class="sub">أول ما نستلم ورقة الاختبار نكتبه</div></div>'+
  '<div class="vb"><div class="yarn paper" style="padding:.7rem 1rem"><h2 style="margin:0">الطريقة</h2>'+steps+'</div>'+vid('media/five1.mp4','media/five1.jpg',CR)+'</div>'+
  '<div class="yarn paper" style="padding:.7rem 1rem;margin-top:.6rem"><h2 style="margin:0">أتدرّب</h2>'+(lvl===0?'<div class="pat">خانة 1 (يميناً): <bdi class="eq">5 0 5 0 5 0 5 0 5 0</bdi><br>خانة 10 (يسارها): <bdi class="eq">0 1 1 2 2 3 3 4 4 5</bdi></div>':'<div class="msg soft">✏️ الآن من الذاكرة بلا نمط. نبدأ بخانة 1 (اليمنى) ثم خانة 10.</div>')+'<div class="frs">'+rows+'</div><div id="fm"></div><div class="row"><button class="btn big" id="ck">تأكدي ✓</button></div><div class="row"><a class="btn sm" href="../docs/math/zarb_five.pdf" target="_blank" rel="noopener" style="text-decoration:none">🖨️ ورقة جدول 5 للطباعة</a></div></div>';
  $('#bk').onclick=ritual;
  var ins=document.querySelectorAll('.ti');ins.forEach(function(i,ix){i.oninput=function(){i.value=i.value.replace(/\D/g,'').slice(0,1);if(i.value&&ins[ix+1])ins[ix+1].focus()}});if(ins[0])ins[0].focus();
  $('#ck').onclick=function(){
   var bad=0;for(var n=1;n<=10;n++){var t=document.querySelector('.ti[data-r="'+n+'"][data-p="t"]'),u=document.querySelector('.ti[data-r="'+n+'"][data-p="u"]');
    var tv=t.value===''?-1:+t.value,uv=u.value===''?-1:+u.value,tr=Math.floor(5*n/10),ur=(5*n)%10;
    var ok=tv===tr&&uv===ur;t.style.borderColor=u.style.borderColor=ok?'#3f7a25':'#c0392b';t.style.background=u.style.background=ok?'#ebfbee':'#fff0f0';if(!ok)bad++}
   var fm=$('#fm');
   if(!bad){var r=rit();r.five++;save();fm.innerHTML='<div class="msg good">⭐ جدول 5 كامل! '+(lvl===0?'الآن نجرّب من الذاكرة بلا نمط.':'ركّزتِ فوصلتِ بتوفيق الله.')+'</div>';if(window.FX)FX.correct(2);
    var go=document.createElement('div');go.className='row';go.innerHTML='<button class="btn big" id="nx2">'+(lvl===0?'من الذاكرة ←':'رجوع ←')+'</button>';fm.appendChild(go);$('#nx2').onclick=function(){if(lvl===0){lvl=1;draw()}else leave()}}
   else fm.innerHTML='<div class="msg soft">🧶 '+bad+' خانات تحتاج مراجعة (الحمراء). نتذكّر: خانة 1 تتناوب 5 ثم 0، وخانة 10 تزيد كل عددين. نعدّلها ونتأكد ثانية.</div>';
  };
 }
 draw();
}
/* الأصابع (من 7 إلى 10) */
var HIMG='media/hands6/';
function handImg(side,k){return '<img class="hi" src="'+HIMG+'h'+k+'.webp" alt="">'}
function fingers(){
 var pairs=[];for(var a=7;a<=10;a++)for(var b=a;b<=10;b++)pairs.push([a,b]);var Pq=shuf(pairs),pi=0;
 function round(){
  if(pi>=Pq.length){pi=0;Pq=shuf(pairs)}
  var pr=Pq[pi++];if(rnd(2))pr=[pr[1],pr[0]];var A=pr[0],B=pr[1],L=0,R=0;
  function render(first){
   var steps='<ol class="steps"><li><b class="n">1</b><div>كل يد تمسك رقماً<small>مثلاً 8 × 6: اليد الأولى 8، والثانية 6</small></div></li><li><b class="n">2</b><div>كم باقي لهذا الرقم ليصير 10؟<small>8 باقي له 2، و6 باقي له 4. نرفع هذا العدد من الأصابع: هذه الأصابع <b>الواقفة</b></small></div></li><li><b class="n">3</b><div>الواقفة نضربها ببعضها<small>2 × 4 = 8 ← نكتبها في خانة 1 (يميناً)</small></div></li><li><b class="n">4</b><div>النائمة نعدّها، وكل واحدة تساوي 10<small>3 + 1 = 4 ← نكتب 4 في خانة 10 (يعني 40). الناتج 48</small></div></li></ol>';
   var cl=L,cr=R,cA=10-A,cB=10-B;
   app.innerHTML='<button class="back" id="bk">→ الرجوع</button><div class="head"><h1>الأصابع: <bdi class="eq">'+A+' × '+B+'</bdi></h1><div class="sub">للضرب من 7 إلى 10</div></div>'+
   '<div class="vb"><div class="yarn paper" style="padding:.7rem 1rem"><h2 style="margin:0">الطريقة</h2>'+steps+'<div class="row"><a class="btn sm" href="../docs/math/zarb_fingers_7_10.pdf" target="_blank" rel="noopener" style="text-decoration:none">🖨️ ورقة الأصابع للطباعة</a></div></div>'+vid('media/fingers.mp4','media/fingers.jpg','المقطع لصاحبته (علامتها المائية ظاهرة). نستعمله للتعلّم فقط.')+'</div>'+
   '<div class="yarn paper" style="padding:.7rem 1rem;margin-top:.6rem"><h2 style="margin:0">أتدرّب على <bdi class="eq">'+A+' × '+B+'</bdi></h2><div class="hands" style="direction:rtl"><div class="hw"><div class="hl">اليد الأولى: <b>'+A+'</b></div><div class="hb" id="hL">'+handImg('L',L)+'</div><div class="hc"><button class="btn sm" data-h="L" data-d="-1">−</button><b>واقفة: '+L+' · نائمة: '+(5-L)+'</b><button class="btn sm" data-h="L" data-d="1">+</button></div></div><div class="hw"><div class="hl">اليد الثانية: <b>'+B+'</b></div><div class="hb" id="hR">'+handImg('R',R)+'</div><div class="hc"><button class="btn sm" data-h="R" data-d="-1">−</button><b>واقفة: '+R+' · نائمة: '+(5-R)+'</b><button class="btn sm" data-h="R" data-d="1">+</button></div></div></div>'+
   '<div class="msg soft">اليد الأولى: '+A+' باقي له كم ليصير 10؟ ارفعي هذا العدد من الأصابع.<br>اليد الثانية: '+B+' باقي له كم ليصير 10؟ ارفعيه أيضاً.</div><div id="s2"></div></div>';
   $('#bk').onclick=ritual;
   document.querySelectorAll('.hc button').forEach(function(x){x.onclick=function(){var d=+x.dataset.d;if(x.dataset.h==='L')L=Math.max(0,Math.min(5,L+d));else R=Math.max(0,Math.min(5,R+d));render()}});
   document.querySelectorAll('.hb').forEach(function(x){x.onclick=function(){if(x.id==='hL')L=L>=5?0:L+1;else R=R>=5?0:R+1;render()}});
   if(L===cA&&R===cB){
    var nA=5-cA,nB=5-cB,pr2=cA*cB,sl=nA+nB;
    $('#s2').innerHTML='<div class="msg good">✅ أحسنتِ! الأصابع الواقفة: '+cA+' و'+cB+'. والنائمة: '+nA+' و'+nB+'.</div><div class="qa"><label>الواقفة نضربها ببعضها: <bdi class="eq">'+cA+' × '+cB+'</bdi> = <input class="ti w2" id="pu" inputmode="numeric" maxlength="3"> <small>(نكتبه في خانة 1)</small></label><label>النائمة نعدّها في اليدين: <input class="ti w2" id="sl" inputmode="numeric" maxlength="3"> <small>(نكتبه في خانة 10)</small></label><label>الناتج: <bdi class="eq">'+A+' × '+B+'</bdi> = <input class="ti w2" id="fi" inputmode="numeric" maxlength="3"></label></div><div id="s3"></div><div class="row"><button class="btn big" id="ck2">تأكدي ✓</button></div>';
    $('#ck2').onclick=function(){var p=+$('#pu').value,sv=+$('#sl').value,f=+$('#fi').value,m=$('#s3');
     if(p===pr2&&sv===sl&&f===A*B){var r=rit();r.fing++;save();m.innerHTML='<div class="msg good">⭐ صحيح! ركّزتِ فوصلتِ.</div><div class="row"><button class="btn big" id="nx3">عملية جديدة ←</button></div>';if(window.FX)FX.correct(2);FC++;$('#nx3').onclick=function(){if(AFTER&&FC>=5)leave();else round()}}
     else m.innerHTML='<div class="msg soft">🧶 قريبة! نراجع بهدوء: الواقفة نضربها ببعضها ونكتب الناتج في خانة 1، والنائمة نعدّها ونكتب العدد في خانة 10.</div>'}
   }else if(L>0||R>0){
    var bad=(L!==cA?'اليد الأولى: '+A+' باقي له كم ليصير 10؟ عدّي من '+A+' حتى 10.':'')+(R!==cB?(L!==cA?'<br>':'')+'اليد الثانية: '+B+' باقي له كم ليصير 10؟ عدّي من '+B+' حتى 10.':'');
    $('#s2').innerHTML='<div class="msg soft">'+bad+'</div>'}
  }
  render();
 }
 round();
}
/* الجمع للتأكد: احتياط فقط */
function colAdd(x,y){ // يشرح جمع عددين من اليمين
 var xs=String(x).split('').reverse(),ys=String(y).split('').reverse(),carry=0,out=[],lines=[];
 for(var i=0;i<Math.max(xs.length,ys.length);i++){var p=(+xs[i]||0),q=(+ys[i]||0),t=p+q+carry;lines.push((i===0?'خانة 1':'خانة 10')+' (من اليمين): '+p+' + '+q+(carry?' + '+carry+' (محمول)':'')+' = '+t);out.push(t%10);carry=t>=10?1:0}
 if(carry)out.push(1);return{lines:lines,res:x+y}}
function addPage(){
 var ops=[[6,7],[7,6],[6,8],[7,8],[8,7],[7,9],[8,9],[9,6],[9,9]],cur=ops[0];
 function draw(){
  var a=cur[0],b=cur[1],chips=ops.map(function(o,i){return '<button class="chip'+(o===cur?' on':'')+'" data-i="'+i+'"><bdi class="eq">'+o[0]+' × '+o[1]+'</bdi></button>'}).join('');
  // رسم: b مجموعات، في كل مجموعة a نقطة
  var svg='<svg viewBox="0 0 '+(b*72)+' 96" class="dots" direction="ltr">';for(var g=0;g<b;g++){svg+='<rect x="'+(g*72+4)+'" y="4" width="64" height="88" rx="12" fill="#fff" stroke="#a01848" stroke-width="3"/>';for(var d=0;d<a;d++){var cx=g*72+20+(d%3)*16,cy=22+Math.floor(d/3)*16;svg+='<circle cx="'+cx+'" cy="'+cy+'" r="6" fill="#a01848"/>'}svg+='<text x="'+(g*72+36)+'" y="90" text-anchor="middle" font-size="14" fill="#2e0716" font-weight="800">'+a+'</text>'}svg+='</svg>';
  // جمع اثنين اثنين
  var groups=[];for(var i=0;i<b;i++)groups.push(a);var steps=[],cur2=[];
  var prs=[];for(i=0;i+1<groups.length;i+=2)prs.push(groups[i]+groups[i+1]);if(groups.length%2)prs.push(groups[groups.length-1]);
  var html='<ol class="steps"><li><b class="n">1</b><div>نرسم '+b+' مجموعات، في كل مجموعة '+a+'<small>الرسم في الأعلى</small></div></li>';
  html+='<li><b class="n">2</b><div>نجمع المجموعات اثنتين اثنتين<small>'+prs.map(function(v,j){var left=(j*2+1<groups.length)?'<bdi class="eq">'+a+' + '+a+' = '+v+'</bdi>':a+' (تبقّت وحدها)';return left}).join(' ، ')+'</small></div></li>';
  var run=prs[0],k=3;
  for(var j=1;j<prs.length;j++){var c=colAdd(run,prs[j]);html+='<li><b class="n">'+k+'</b><div>نجمع <bdi class="eq">'+run+' + '+prs[j]+'</bdi><small>نبدأ من اليمين:<br>'+c.lines.map(function(l){return fm(l)}).join('<br>')+'<br>الناتج: <b>'+c.res+'</b></small></div></li>';run=c.res;k++}
  html+='</ol><div class="row"><a class="btn sm" href="../docs/math/zarb_add.pdf" target="_blank" rel="noopener" style="text-decoration:none">🖨️ ورقة الجمع للتأكد للطباعة</a></div><div class="msg good">الناتج النهائي: <bdi class="eq">'+a+' × '+b+' = '+(a*b)+'</bdi>. هل يطابق جوابكِ؟ إن تطابقا اكتبي وامشي ولا تعيدي الحساب.</div>';
  app.innerHTML='<button class="back" id="bk">→ الرجوع</button><div class="head"><h1>الجمع للتأكد</h1><div class="sub">احتياط فقط: نستعمله مرة واحدة إذا شككنا. دائماً نبدأ من اليمين</div></div>'+
  '<div class="yarn paper" style="padding:.7rem 1rem"><div class="chips" style="margin-bottom:.4rem">'+chips+'</div><div class="dotsw" style="direction:ltr;overflow-x:auto">'+svg+'</div>'+html+'</div>';
  $('#bk').onclick=ritual;document.querySelectorAll('.chip').forEach(function(c){c.onclick=function(){cur=ops[+c.dataset.i];draw()}});
 }
 draw();
}
/* مراجعة جداول 1–4: سهلة وسريعة */
function review14(){
 var items=[];for(var a=1;a<=4;a++)for(var b=1;b<=10;b++)items.push([a,b]);var un14=unresolvedList().filter(function(x){return x.a<=4}).slice(0,5).map(function(x){return[x.a,x.b]});items=un14.concat(shuf(items).filter(function(p){return !un14.some(function(q){return q[0]===p[0]&&q[1]===p[1]})})).slice(0,10);var i=0,typed='';
 function ask(){
  if(i>=items.length){app.innerHTML='<div class="head">'+pic('star','⭐','logo')+'<h1>أنهيتِ المراجعة</h1><div class="sub">ما شاء الله، ركّزتِ فوصلتِ 🌷</div></div><div class="row"><button class="btn big" id="bk2">رجوع</button></div>';$('#bk2').onclick=leave;if(window.FX&&FX.win)FX.win();return}
  var it=items[i];typed='';
  app.innerHTML='<button class="back" id="bk">→ الرجوع</button><div class="head"><h1>مراجعة جداول 1 إلى 4</h1><div class="sub">سهلة وسريعة، وبلا وقت. السؤال '+(i+1)+' من 10</div></div><div class="yarn paper qbox"><div class="big"><bdi class="eq">'+it[0]+' × '+it[1]+'</bdi> = <span class="ans" id="an"></span></div><div id="area"></div></div>';
  $('#bk').onclick=ritual;pad();
  function pad(){$('#area').innerHTML='<div class="pad">'+[1,2,3,4,5,6,7,8,9].map(function(n){return '<button data-d="'+n+'">'+n+'</button>'}).join('')+'<button class="bk" data-d="b">⌫</button><button data-d="0">0</button><button class="ok" data-d="ok">✓</button></div>';
   $('#area').querySelectorAll('button').forEach(function(b){b.onclick=function(){var d=b.dataset.d;if(d==='b')typed=typed.slice(0,-1);else if(d==='ok'){if(typed==='')return;check(+typed);return}else if(typed.length<3)typed+=d;$('#an').textContent=typed}})}
  function check(v){var f=F(it[0],it[1]);f.seen++;
   if(v===it[0]*it[1]){if(!it.w){f.ok++;if(f.w>0)f.clr++}save();$('#area').innerHTML='<div class="msg good">⭐ صحيح!</div><div class="row"><button class="btn big" id="nq">التالي ←</button></div>';if(window.FX)FX.correct(1);$('#nq').onclick=function(){i++;ask()}}
   else{if(!it.w){it.w=1;f.w++;f.clr=0}save();typed='';$('#an').textContent='';$('#area').innerHTML='<div class="msg soft">🧶 نراجع الحيلة ثم نكتب الجواب بأنفسنا:</div>'+trickHTML(it[0],it[1])+'<div class="pad"></div>';pad()}}
 }
 ask();
}
/* مراجعة الأصابع اليومية: أول خطوة في المهمة */
function recap(){
 app.innerHTML='<button class="back" id="bk">→ الرئيسية</button>'+bar()+'<div class="head"><h1>نراجع طريقة الأصابع</h1><div class="sub">دقيقتان كل يوم قبل أي شيء</div></div>'+
 '<div class="vb"><div class="yarn paper" style="padding:.7rem 1rem"><h2 style="margin:0">يا نادين، مثال <bdi class="eq">8 × 6</bdi></h2><div class="hands" style="direction:ltr;margin:.3rem 0"><div class="hw"><div class="hb">'+handImg('L',4)+'</div><div class="hl">6 ← باقي له 4</div></div><div class="hw"><div class="hb">'+handImg('R',2)+'</div><div class="hl">8 ← باقي له 2</div></div></div><ol class="steps"><li><b class="n">1</b><div>8 باقي له 2 ليصير 10، و6 باقي له 4<small>نرفع 2 في يد و4 في اليد الأخرى</small></div></li><li><b class="n">2</b><div>الواقفة نضربها: 2 × 4 = 8<small>نكتب 8 في خانة 1 (يميناً)</small></div></li><li><b class="n">3</b><div>النائمة: 3 + 1 = 4، وكل واحدة 10<small>نكتب 4 في خانة 10 (يعني 40)</small></div></li><li><b class="n">4</b><div>الناتج: 48 ✓</div></li></ol><div class="msg good">💡 في الاختبار: شككتِ أو لم تشكّي، طبّقي هذه الطريقة على الضرب من 7 إلى 10، واكتبي جدول 5 أول ما تستلمين الورقة.</div><div class="row"><button class="btn big" id="nx">راجعتها، نكمل ←</button></div></div>'+vid('media/fingers.mp4','media/fingers.jpg','المقطع لصاحبته (علامتها المائية ظاهرة).')+'</div>';
 $('#bk').onclick=home;$('#nx').onclick=nextStep;
}

home();
window.__P=printCard;window.__Z=function(){return{ST:ST,RUN:RUN}};
})();
