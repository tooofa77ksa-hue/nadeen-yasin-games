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
 RUN=null;var tp=todayPlan(),un=unresolvedList(),k=dateKey(),dn=ST.done[k]||{};
 var title=tp.p?'اليوم: جدول '+tp.p.t.join(' و '):'أيام المراجعة';
 var steps='';
 var n=1;
 if(un.length){steps+='<li class="'+(dn.warn?'done':'')+'"><b class="n">'+n+'</b><div>تنبيهات من أخطاء الأيام الماضية<small>'+un.length+' عملية نراجعها بطريقة سهلة</small></div></li>';n++}
 if(tp.p){steps+='<li class="'+(dn.learn?'done':'')+'"><b class="n">'+n+'</b><div>نبني جدول '+tp.p.t.join(' و ')+' بأنفسنا<small>نعرف حيلته ونتعلّم نتأكد من الجواب</small></div></li>';n++;
  steps+='<li class="'+(dn.quiz?'done':'')+'"><b class="n">'+n+'</b><div>نتدرّب ونتأكد بالجمع<small>عشر عمليات لكل جدول، بلا وقت</small></div></li>'}
 else steps+='<li><b class="n">1</b><div>مراجعة الأخطاء حتى تنتهي كلها<small>ونختبر أصعب العمليات</small></div></li>';
 app.innerHTML='<div class="head"><div class="dayhead">'+(tp.p?'<div class="bigd">'+tp.p.t.map(dig).join('<span class="em" style="align-self:center">+</span>')+'</div>':pic('trophy','🏆'))+'</div><h1>'+title+'</h1><div class="sub">'+(tp.p&&tp.i<5?DAYN[tp.i]+' · اليوم '+(tp.i+1)+' من 5':'')+'</div></div>'+
 '<div class="yarn paper" style="padding:.7rem 1rem"><h2 style="margin:0">مهمة اليوم</h2><ol class="steps">'+steps+'</ol><div class="row"><button class="btn big" id="go">ابدئي مهمة اليوم ←</button></div></div>'+
 '<div class="grid2"><div class="yarn paper mini" id="m1">'+'<h3>📌 طريقتي في الاختبار</h3><p>اضربي ثم تأكدي بالجمع: ثلاث خطوات تكفي</p></div>'+
 '<div class="yarn paper mini" id="m2"><h3>🗺️ خريطة إتقاني</h3><p>أين أخطأتُ وأين أتقنتُ</p></div>'+
 '<div class="yarn paper mini" id="m3"><h3>👩‍👧 للأم</h3><p>التقدّم واختيار اليوم</p></div></div>';
 $('#go').onclick=startToday;$('#m1').onclick=method;$('#m2').onclick=mapScreen;$('#m3').onclick=parent;
}
/* خطوات الجلسة */
function startToday(){
 var tp=todayPlan(),seq=[],un=unresolvedList().slice(0,10);
 if(un.length){seq.push({k:'warn',list:un});seq.push({k:'quiz',name:'مراجعة الأخطاء',items:un.map(function(x){return{a:x.a,b:x.b,rv:1}}),mark:'warn'})}
 if(tp.p){tp.p.t.forEach(function(t,ix){seq.push({k:'lesson',t:t});var it=[];for(var b=1;b<=10;b++)it.push({a:t,b:b});seq.push({k:'quiz',name:'جدول '+t,items:shuf(it),mark:(ix===tp.p.t.length-1?'quiz':null),lm:ix===0?'learn':null})})}
 else{ // أيام المراجعة: أصعب العمليات
  var hard=[];for(var a=6;a<=9;a++)for(var b=6;b<=9;b++)hard.push({a:a,b:b});seq.push({k:'quiz',name:'أصعب العمليات',items:shuf(hard).slice(0,10),mark:'quiz'})}
 RUN={seq:seq,i:0};step();
}
function bar(){var s=RUN.seq;return '<div class="bar">'+s.map(function(x,i){return '<i class="'+(i<RUN.i?'d':i===RUN.i?'on':'')+'"></i>'}).join('')+'</div>'}
function step(){
 if(RUN.i>=RUN.seq.length)return summary();
 var s=RUN.seq[RUN.i];
 if(s.k==='warn')warn(s);else if(s.k==='lesson')lesson(s);else quiz(s);
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
 '<div class="yarn paper" style="padding:.7rem 1rem;margin-top:.6rem"><h2 style="margin:0">🎬 طريقة الأصابع للجداول الصعبة (6 إلى 9)</h2><p style="font-weight:700;margin:.2rem 0">نسأل كل عدد: كم ينقصه ليصير 10؟ نثني هذا العدد من الأصابع. <b>القائمة</b> = العشرات، و<b>المثنية × المثنية</b> = الآحاد.</p><video class="fv" controls playsinline preload="metadata" poster="media/fingers.jpg" src="media/fingers.mp4"></video><p style="font-size:.8rem;font-weight:700;color:#6b2a45;margin:.2rem 0">المقطع لصاحبته (علامتها المائية ظاهرة في أسفله). نستعمله للتعلّم فقط.</p></div>'+
 '<div class="yarn paper" style="padding:.7rem 1rem;margin-top:.6rem"><h2 style="margin:0">قاعدة «قرار واحد»</h2><ol class="steps"><li><b class="n">1</b><div>أضرب بطريقتي<small>طريقة واحدة لكل عملية، لا أبدّلها</small></div></li><li><b class="n">2</b><div>أتأكد بالجمع <u>مرة واحدة</u><small>أجمع العدد بعدد المرات</small></div></li><li><b class="n">3</b><div>إن تطابق: أكتب وأمشي<small>لا أعيد الحساب ولا أشك</small></div></li><li><b class="n">4</b><div>إن اختلف: أعيد طريقتي مرة واحدة<small>ثم أنظر الخطوات</small></div></li></ol></div>'+
 '<div class="yarn paper" style="padding:.7rem 1rem;margin-top:.6rem"><h2 style="margin:0">حيلة كل جدول</h2><div class="tk">'+[2,3,4,5,6,7,8,9].map(function(a){var t=trickFor(a,3);return '<div class="trick"><b>×'+a+':</b> '+(a===2?'نضاعف.':a===3?'×2 ثم نضيف مرة.':a===4?'نضاعف مرتين.':a===5?'×10 ثم النصف.':a===6?'×5 ثم نضيف مرة.':a===7?'×5 ثم ×2 ونجمع.':a===8?'نضاعف ثلاث مرات.':'×10 ثم نطرح مرة.')+'</div>'}).join('')+'</div><div class="msg good">💡 وإن نسيتِ: <b>بدّلي المكان</b> (6 × 7 = 7 × 6) أو <b>تأكدي بالقسمة</b>.</div><div class="row"><button class="btn" id="pr">🖨️ اطبعي الورقة</button></div></div>';
 $('#bk').onclick=home;$('#pr').onclick=printCard;
}
function printCard(){
 var pc=$('#printcard');
 pc.innerHTML='<h1>طريقتي في الاختبار — جدول الضرب</h1><div class="pb"><b>1)</b> أقرأ العملية &nbsp; <b>2)</b> أضرب بالحيلة &nbsp; <b>3)</b> أتأكد بالجمع (أجمع العدد نفسه بعدد المرات) &nbsp; <b>4)</b> أكتب الجواب إذا تطابق، وإذا اختلف أعيد الحيلة.</div><table><tr><th>الجدول</th><th>الحيلة</th><th>للتأكد بالجمع</th></tr>'+
 [[2,'نضاعف','مثال: 2×7 = 7 + 7'],[3,'×2 ثم نضيف مرة','3×6: 6+6 ثم +6'],[4,'نضاعف مرتين','4×7: 7+7 ثم نضاعف'],[5,'×10 ثم النصف','نواتجه تنتهي بـ 5 أو 0'],[6,'×5 ثم نضيف مرة','6×7: 5×7 ثم +7'],[7,'×5 ثم ×2 ونجمع','7×6: 5×6 + 2×6'],[8,'نضاعف ثلاث مرات','8×7: 7→14→28→56'],[9,'×10 ثم نطرح مرة','مجموع أرقام الناتج = 9']].map(function(r){return '<tr><td><b>×'+r[0]+'</b></td><td>'+r[1]+'</td><td>'+r[2]+'</td></tr>'}).join('')+'</table><div class="pb">إذا نسيتُ: أبدّل مكان العددين (6×7 = 7×6)، أو أتأكد بالقسمة.</div><div class="pf">إعداد: عواطف الجهني · جهد شخصي لوجه الله · اللهم تقبّله منا واجعله نافعاً · للطلبات (واتساب): 966580908077</div>';
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
 var un=unresolvedList(),tp=todayPlan();
 app.innerHTML='<button class="back" id="bk">→ الرئيسية</button><div class="head"><h1>للأم</h1><div class="sub">متابعة هادئة، بلا ضغط على نادين</div></div>'+
 '<div class="yarn paper" style="padding:.7rem 1rem"><h2 style="margin:0">خطة الأسبوع</h2><p style="font-weight:700">الأحد: جدول 3 · الاثنين: 4 · الثلاثاء: 6 · الأربعاء: 7 · الخميس: 8 و9. كل يوم يبدأ بتنبيهات أخطاء الأيام الماضية (إن وُجدت)، وبعدها الجدول الجديد. ما لم تخطئ فيه نادين لا يُعاد.</p>'+
 '<h2 style="margin:.4rem 0 0">أخطاء لم تُحسم بعد</h2>'+(un.length?'<p style="font-weight:700">'+un.map(function(x){return eq(x.a,x.b)+' ('+x.w+' مرة)'}).join(' ، ')+'</p>':'<p style="font-weight:700">لا شيء حالياً.</p>')+
 '<h2 style="margin:.4rem 0 0">اختيار اليوم</h2><div class="chips">'+[0,1,2,3,4].map(function(i){return '<button class="chip'+(tp.i===i?' on':'')+'" data-i="'+i+'">'+DAYN[i]+' ('+(PLAN[i].t.join('+'))+')</button>'}).join('')+'<button class="chip'+(tp.i>=5?' on':'')+'" data-i="5">أيام المراجعة</button><button class="chip" data-i="a">حسب التاريخ</button></div>'+
 '<div class="row"><button class="btn sm" id="rs">مسح تقدّم نادين</button></div></div>';
 $('#bk').onclick=home;
 document.querySelectorAll('.chip').forEach(function(c){c.onclick=function(){var v=c.dataset.i;ST.ov=v==='a'?null:+v;save();parent()}});
 $('#rs').onclick=function(){if(confirm('نمسح كل تقدّم نادين في جدول الضرب؟')){ST={f:{},done:{},ov:null};save();parent()}};
}
home();
window.__Z=function(){return{ST:ST,RUN:RUN}};
})();
