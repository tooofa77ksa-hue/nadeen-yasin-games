/* ألعاب الفصل: أسئلة، تصنيف، ترتيب، قطار التصنيف، مَن أنا؟، صح أم خطأ، الاختبارات */
(()=>{
const S=window.SCI,{$,$$,ar,shuf,CH,src,pgSpan}=S;
const img=(n,w)=>n?`<img src="${src(n)}" alt="" ${w?`style="width:${w}px;height:${w}px;object-fit:contain"`:''}>`:'';
const turnTag=()=>{const t=S.teams.list[S.teams.turn];return `<p class="center" style="margin:4px 0"><span class="pill">الدور على: ${t.n}</span></p>`};
const award=(p=1)=>S.teams.award(p);
const next=()=>S.teams.next();

/* ---------- أسئلة اختيار من متعدد (فرق) ---------- */
S.quiz=(box,items,{title='',teamsOn=true,onEnd}={})=>{items=items.filter(q=>q.o&&q.o.length>=2);if(!items.length){box.innerHTML='<p class="lead">لا أسئلة هنا.</p>';return}
 let i=0,sc=0;
 const draw=()=>{if(i>=items.length){const pc=sc/items.length;box.innerHTML=`<div class="card center"><div class="res">${ar(sc)} من ${ar(items.length)}</div><p class="big-t">${pc>=.9?'ممتاز! 👏':pc>=.6?'جيّد جدًّا':'نراجع الدرس ونعيد'}</p><button class="btn gold" id="qa">إعادة الأسئلة</button></div>`;if(pc>=.6){S.sfx.win();S.confetti(70)}$('#qa',box).onclick=()=>{i=0;sc=0;draw()};onEnd&&onEnd(sc);return}
  const q=items[i];
  box.innerHTML=`<div class="card"><div class="bar" style="margin-bottom:8px"><i style="width:${i/items.length*100}%"></i></div>${teamsOn?turnTag():''}<p class="muted center" style="margin:0">سؤال ${ar(i+1)} من ${ar(items.length)} ${q.p?pgSpan(q.p):''}</p><div class="q-big">${q.q}</div>
  <div class="opts">${q.o.map((o,k)=>`<button class="opt" data-k="${k}">${o}</button>`).join('')}</div><div class="fb"></div></div>`;
  let done=false;$$('.opt',box).forEach(b=>b.onclick=()=>{if(done)return;done=true;const k=+b.dataset.k,ok=k===q.a;
   $$('.opt',box).forEach((x,j)=>{if(j===q.a)x.classList.add('ok');else if(x===b)x.classList.add('no');else x.classList.add('dim')});
   if(ok){sc++;award(1);S.sfx.yes()}else S.sfx.no();
   $('.fb',box).innerHTML=`<div class="why">${ok?'👏 أحسنتم! ':'❌ الإجابة الصحيحة: <b>'+q.o[q.a]+'</b>. '}${q.w||''}</div><div class="center" style="margin-top:10px"><button class="btn" id="nx">${i+1<items.length?'السؤال التالي':'النتيجة'}</button></div>`;
   $('#nx',box).onclick=()=>{i++;next();draw()}})};
 draw()};

/* ---------- لعبة تصنيف (فرق) ---------- */
S.sortGame=(box,g)=>{const items=shuf(g.items);let i=0,sc=0;
 const draw=()=>{if(i>=items.length){box.innerHTML=`<div class="card center"><h3>${g.t}</h3><div class="res">${ar(sc)} من ${ar(items.length)}</div><button class="btn gold" id="ag">لعب مرة أخرى</button></div>`;if(sc>=items.length*.7){S.sfx.win();S.confetti(60)}$('#ag',box).onclick=()=>S.sortGame(box,g);return}
  const it=items[i];
  box.innerHTML=`<div class="card"><h3 class="center" style="margin:0">${g.t}</h3>${g.hint?`<p class="muted center" style="margin:0">${g.hint}</p>`:''}${turnTag()}
  <div class="itemc">${it[0]?`<img src="${src(it[0])}" alt="">`:''}<b>${it[1]}</b></div>
  <div class="board">${g.bins.map(b=>`<button class="bin" data-k="${b[0]}">${b[1]}</button>`).join('')}</div><div class="fb"></div></div>`;
  let done=false;$$('.bin',box).forEach(b=>b.onclick=()=>{if(done)return;done=true;const ok=b.dataset.k===it[2];
   $$('.bin',box).forEach(x=>{if(x.dataset.k===it[2])x.classList.add('ok');else if(x===b)x.classList.add('no')});
   if(ok){sc++;award(1);S.sfx.yes()}else S.sfx.no();
   $('.fb',box).innerHTML=`<div class="center" style="margin-top:8px"><button class="btn" id="nx">${i+1<items.length?'التالي':'النتيجة'}</button></div>`;
   $('#nx',box).onclick=()=>{i++;next();draw()}})};
 draw()};

/* ---------- لعبة ترتيب ---------- */
S.orderGame=(box,g)=>{const right=g.items;let pool=shuf(right.map((x,k)=>({x,k})));if(right.length>1&&pool.every((p,j)=>p.k===j))pool=pool.reverse();
 let step=0,miss=0;
 const draw=()=>{box.innerHTML=`<div class="card"><h3 class="center" style="margin:0">${g.t}</h3>${g.hint?`<p class="muted center" style="margin:0">${g.hint}</p>`:''}${turnTag()}
 <div class="board" id="ob">${pool.map(p=>`<button class="bin ${p.done?'ok':''}" data-k="${p.k}" ${p.done?'disabled':''} style="min-height:130px">${p.x[0]?`<img src="${src(p.x[0])}" alt="" style="width:80px;height:80px;object-fit:contain;display:block;margin:0 auto 4px">`:''}${p.x[1]}${p.done?`<div style="font:800 1.2rem Tajawal">${ar(p.pos)}</div>`:''}</button>`).join('')}</div><p class="center muted">اضغطي حسب الترتيب الصحيح: الأول ثم الذي يليه…</p><div class="fb"></div></div>`;
  $$('#ob .bin',box).forEach(b=>b.onclick=()=>{const k=+b.dataset.k;
   if(k===step){const p=pool.find(p=>p.k===k);p.done=true;p.pos=step+1;step++;S.sfx.tick();
    if(step===right.length){const pts=Math.max(1,3-miss);award(pts);S.sfx.yes();S.confetti(50);draw();$('.fb',box).innerHTML=`<div class="why">👏 ترتيب صحيح! ${miss?'أخطاء: '+ar(miss):'بلا أخطاء'} · النقاط: ${ar(pts)}</div><div class="center" style="margin-top:8px"><button class="btn gold" id="ag">إعادة</button></div>`;$('#ag',box).onclick=()=>S.orderGame(box,g);next();return}
    draw()}
   else{miss++;S.sfx.no();b.classList.add('shake');setTimeout(()=>b.classList.remove('shake'),400)}})};
 draw()};

/* ---------- قائمة ألعاب الدرس ---------- */
S.gamesList=(box,games)=>{box.innerHTML=`<div class="card"><h3>🎮 اختاري لعبة</h3><div class="board">${games.map((g,i)=>`<button class="bin" data-i="${i}">${g.type==='order'?'🔢':'🧺'} ${g.t}</button>`).join('')}</div></div><div id="gb"></div>`;
 $$('.bin',box).forEach(b=>b.onclick=()=>{const g=games[+b.dataset.i];const gb=$('#gb',box);(g.type==='order'?S.orderGame:S.sortGame)(gb,g);gb.scrollIntoView({behavior:'smooth'})})};

/* ---------- ورقة اختبار كاملة (تُحَلّ ثم تُصحَّح) ---------- */
S.testPaper=(box,p)=>{const fill=p.fill,tf=p.tf,qs=p.qs||[];
 const all=[];
 if(fill)fill.items.forEach(it=>all.push({t:'fill',q:it[0],a:it[1],bank:fill.bank,p:fill.pg}));
 if(tf)tf.items.forEach(it=>all.push({t:'tf',q:it[0],a:it[1]?0:1,o:['صحيحة','خاطئة'],w:it[2],p:tf.pg}));
 qs.forEach(q=>all.push({t:'mc',q:q.q,o:q.o,a:q.a,w:q.w,p:q.p}));
 const sec={fill:'أكملي بالكلمة المناسبة',tf:'صحيحة أم خاطئة؟',mc:'اختاري الإجابة الصحيحة'};let last='';
 box.innerHTML=`<section class="card"><h3>${p.n||''} · ${p.title} ${pgSpan(p.pg)}</h3><p class="muted">حلّي كل الأسئلة ثم اضغطي «تصحيح».</p></section>`+all.map((it,x)=>{let h='';if(it.t!==last){last=it.t;h=`<h3 style="margin-top:16px">${sec[it.t]}</h3>`;if(it.t==='fill')h+=`<div class="why">${it.bank.map(b=>`<span class="pill">${b}</span>`).join('')}</div>`}
  return h+`<section class="card" data-x="${x}"><div class="q-big" style="text-align:right;font-size:1.3rem">${ar(x+1)}. ${it.q} ${it.p?pgSpan(it.p):''}</div>${it.t==='fill'?`<select class="fillsel"><option value="-1">— اختاري —</option>${it.bank.map((b,j)=>`<option value="${j}">${b}</option>`).join('')}</select>`:`<div class="opts">${it.o.map((o,j)=>`<button class="opt" data-j="${j}">${o}</button>`).join('')}</div>`}<div class="fb"></div></section>`}).join('')+
  `<div class="center" style="margin:16px 0"><button class="btn gold" id="tg">✅ تصحيح الورقة</button></div><div id="tres"></div>`;
 let done=false;$$('.card[data-x]',box).forEach(c=>{$$('.opt',c).forEach(b=>b.onclick=()=>{if(done)return;$$('.opt',c).forEach(o=>{o.style.outline=o===b?'4px solid #3d7bff':''});c.dataset.pick=b.dataset.j})});
 $('#tg',box).onclick=()=>{if(done)return;const un=$$('.card[data-x]',box).filter(c=>{const it=all[+c.dataset.x];return it.t==='fill'?$('.fillsel',c).value==='-1':c.dataset.pick===undefined}).length;
  if(un&&!confirm('بقيت '+ar(un)+' أسئلة بلا إجابة. هل نصحّح؟'))return;done=true;let sc=0;
  $$('.card[data-x]',box).forEach(c=>{const it=all[+c.dataset.x];let ok=false,shown;
   if(it.t==='fill'){const v=+$('.fillsel',c).value;ok=v===it.a;shown=it.bank[it.a];$('.fillsel',c).disabled=true}
   else{const v=c.dataset.pick===undefined?-1:+c.dataset.pick;ok=v===it.a;shown=it.o[it.a];$$('.opt',c).forEach((o,j)=>{o.disabled=true;o.style.outline='';if(j===it.a)o.classList.add('ok');else if(j===v)o.classList.add('no')})}
   if(ok)sc++;$('.fb',c).innerHTML=ok?'<div class="why">👏 صحيح</div>':`<div class="why">❌ الإجابة الصحيحة: <b>${shown}</b>${it.w?'. '+it.w:''}</div>`});
  const pc=sc/all.length;$('#tres',box).innerHTML=`<section class="card center"><div class="res">${ar(sc)} من ${ar(all.length)}</div><p class="big-t">${pc>=.9?'ممتاز! 👏':pc>=.7?'جيّد جدًّا':'نراجع الأخطاء الظاهرة بالأحمر'}</p><button class="btn gold" id="ta">حلّ الورقة من جديد</button></section>`;
  if(pc>=.9){S.sfx.win();S.confetti(80)}else S.sfx.tick();$('#ta',box).onclick=()=>S.testPaper(box,p);$('#tres',box).scrollIntoView({behavior:'smooth'})}};

/* ---------- صفحة الاختبارات ---------- */
const rvParts=c=>c.parts.filter(p=>p.kind==='review');
S.routes.tests=()=>{S.page(`<div class="crumb"><button class="tbtn" onclick="location.hash='home'">↩ الرئيسية</button></div><section class="card"><h2>📝 اختبارات الفصول</h2><p class="big-t">نماذج الاختبار التي في الكتاب بعد كل فصل. تُحَلّ كاملة ثم تُصحَّح.</p></section>
 <div class="chg">${CH.map(c=>rvParts(c).map(p=>`<button class="chc" style="background:${c.color}" data-go="t/${c.id}"><img src="img/${p.icon}.webp" alt=""><span><small>${c.n} · ص${ar(p.pg)}</small><b>${c.title}</b></span></button>`).join('')).join('')}</div>`);
 $$('[data-go]').forEach(b=>b.onclick=()=>{location.hash=b.dataset.go})};
S.routes.test=cid=>{const c=window.CHAPTERS[cid];if(!c){location.hash='tests';return}const p=rvParts(c)[0];
 S.page(`<div class="crumb"><button class="tbtn" onclick="location.hash='tests'">↩ الاختبارات</button><span class="pill">${c.title}</span></div><div id="tp"></div>`);S.testPaper($('#tp'),p)};

/* ---------- ألعاب الفصل: القائمة ---------- */
const allSorts=cid=>{const o=[];CH.forEach(c=>{if(cid&&c.id!==cid)return;c.parts.forEach(p=>(p.games||[]).forEach(g=>{if(g.type==='sort'||g.type==='order')o.push({c,p,g})}))});return o};
S.routes.games=cid=>{const c=cid&&window.CHAPTERS[cid];
 const cards=[['🚂','قطار التصنيف','مخلوقات تمرّ والفرق تصنّف','train','#ff8a1f','frog'],['❓','مَن أنا؟','تلميحات تتكشّف تدريجيًّا','who','#3d7bff','microscope'],['🔢','رتّبي','سلاسل ومستويات وخطوات','order','#34c25a','giraffes'],['✔️','صحيحة أم خاطئة؟','عبارات الكتاب بعد الفصول','tf','#c9ee2b','heart'],['🧫','ركّبي الخلية','مجسّم الخلية ثلاثي الأبعاد','assemble','#ff5a9d','plant_cell'],['🔬','المجهر','كبّري البصل والدم والبكتيريا','scope','#ffc72c','microscope']];
 S.page(`<div class="crumb"><button class="tbtn" onclick="location.hash='home'">↩ الرئيسية</button>${c?`<span class="pill">${c.title}</span>`:''}</div><h2>🎮 ألعاب الفصل</h2><p class="muted">أربعة فرق: الصحيح بنقطة وتصفيق، والخطأ يُظهر الإجابة.</p>${S.teamsBar()}
 <div class="big4">${cards.map(k=>`<button class="bigc" style="background:${k[4]}" data-g="${k[3]}"><img src="img/${k[5]}.webp" alt=""><b>${k[0]} ${k[1]}</b><small>${k[2]}</small></button>`).join('')}</div>`);
 $$('[data-g]').forEach(b=>b.onclick=()=>{const g=b.dataset.g;if(g==='assemble')location.hash='lab/cell~assemble';else if(g==='scope')location.hash='lab/scope';else location.hash='g/'+g+(cid?'/'+cid:'')})};

S.routes.game=(kind,cid)=>{
 const back=()=>{location.hash='games'+(cid?'/'+cid:'')};
 const head=t=>`<div class="crumb"><button class="tbtn" id="bk">↩ الألعاب</button><span class="pill">${t}</span></div>${S.teamsBar()}`;
 if(kind==='train'||kind==='order'){const want=kind==='train'?'sort':'order';const list=allSorts(cid).filter(x=>x.g.type===want);
  S.page(head(kind==='train'?'🚂 قطار التصنيف':'🔢 رتّبي')+`<div class="card" id="sel"><h3>اختاري ${kind==='train'?'المحطة':'اللعبة'}</h3><div class="board">${list.map((x,i)=>`<button class="bin" data-i="${i}" style="font-size:1.1rem">${x.g.t}<br><small style="font:700 .8rem Tajawal">${x.c.title}</small></button>`).join('')}</div></div><div id="gb"></div>`);
  $('#bk').onclick=back;
  $$('.bin').forEach(b=>b.onclick=()=>{const x=list[+b.dataset.i];const gb=$('#gb');$('#sel').style.display='none';gb.insertAdjacentHTML('beforebegin','<div class="center" id="again"><button class="btn ghost">🔄 اختيار لعبة أخرى</button></div>');$('#again button').onclick=()=>{$('#sel').style.display='';$('#again').remove();gb.innerHTML=''};if(kind==='train')S.trainGame(gb,x.g);else S.orderGame(gb,x.g);scrollTo(0,0)})}
 else if(kind==='who'){S.page(head('❓ مَن أنا؟'),{});S.whoGame($('#app').appendChild(Object.assign(document.createElement('div'),{id:'gb'})),cid);$('#bk').onclick=back}
 else if(kind==='tf'){S.page(head('✔️ صحيحة أم خاطئة؟'));const pool=[];CH.forEach(c=>{if(cid&&c.id!==cid)return;rvParts(c).forEach(p=>p.tf&&p.tf.items.forEach(it=>pool.push({q:it[0],o:['صحيحة','خاطئة'],a:it[1]?0:1,w:it[2],p:p.tf.pg})))});
  const gb=document.createElement('div');gb.id='gb';app.appendChild(gb);S.quiz(gb,shuf(pool).slice(0,12),{});$('#bk').onclick=back}
 else back()};
const app=S.app;

/* ---------- قطار التصنيف ---------- */
S.trainGame=(box,g)=>{const items=shuf(g.items);let i=0,sc=0,tm=null;
 const draw=()=>{if(i>=items.length){box.innerHTML=`<div class="card center"><h3>${g.t}</h3><div class="res">${ar(sc)} من ${ar(items.length)}</div><button class="btn gold" id="ag">رحلة جديدة</button></div>`;if(sc>=items.length*.7){S.sfx.win();S.confetti(60)}$('#ag',box).onclick=()=>S.trainGame(box,g);return}
  const it=items[i];const dur=Math.max(9,16-i*.5);
  box.innerHTML=`<div class="card"><h3 class="center" style="margin:0">🚂 ${g.t}</h3>${g.hint?`<p class="muted center" style="margin:0">${g.hint}</p>`:''}${turnTag()}
  <div class="rails"><div class="wagon" style="animation:wag ${dur}s linear forwards">${it[0]?`<img src="${src(it[0])}" alt="">`:''}<b>${it[1]}</b></div></div>
  <div class="board">${g.bins.map(b=>`<button class="bin" data-k="${b[0]}">${b[1]}</button>`).join('')}</div><div class="fb"></div></div>`;
  let done=false;const fin=(k,timeout)=>{if(done)return;done=true;const wg=$('.wagon',box);if(wg)wg.style.animationPlayState='paused';
   const ok=!timeout&&k===it[2];$$('.bin',box).forEach(x=>{if(x.dataset.k===it[2])x.classList.add('ok');else if(!timeout&&x.dataset.k===k)x.classList.add('no')});
   if(ok){sc++;award(1);S.sfx.yes()}else S.sfx.no();
   $('.fb',box).innerHTML=`<div class="why">${ok?'👏 أحسنتم!':timeout?'⏰ فات القطار! الصحيح بالأخضر.':'❌ الصحيح بالأخضر.'}</div><div class="center" style="margin-top:8px"><button class="btn" id="nx">${i+1<items.length?'العربة التالية':'النتيجة'}</button></div>`;
   $('#nx',box).onclick=()=>{i++;next();draw()}};
  $$('.bin',box).forEach(b=>b.onclick=()=>fin(b.dataset.k,false));
  const wg=$('.wagon',box);wg.addEventListener('animationend',()=>{if(box.isConnected)fin(null,true)})};
 draw()};

/* ---------- مَن أنا؟ ---------- */
S.whoGame=(box,cid)=>{const pool=[];CH.forEach(c=>{if(cid&&c.id!==cid)return;(c.vocab||[]).forEach(v=>{if(v.img&&v.d)pool.push({...v,c})})});
 if(pool.length<4){box.innerHTML='<p>لا بطاقات كافية.</p>';return}
 const deck=shuf(pool);let i=0,sc=0;
 const draw=()=>{if(i>=deck.length||i>=10){box.innerHTML=`<div class="card center"><div class="res">${ar(sc)} نقطة</div><button class="btn gold" id="ag">لعب مرة أخرى</button></div>`;S.sfx.win();S.confetti(60);$('#ag',box).onclick=()=>S.whoGame(box,cid);return}
  const it=deck[i];let stage=0;const opts=shuf([it,...shuf(pool.filter(x=>x.w!==it.w)).slice(0,3)]);
  const render=()=>{box.innerHTML=`<div class="card">${turnTag()}<p class="muted center" style="margin:0">بطاقة ${ar(i+1)}</p><div class="q-big">أنا… ${it.d}</div>
  ${stage>=1?`<div class="itemc"><img class="hintimg ${stage>=2?'r2':'r1'}" src="${src(it.img)}" alt=""></div>`:''}
  ${stage>=2?`<p class="center muted">تلميح أخير: من ${it.c.n} · ص${ar(it.c.pg)}</p>`:''}
  <div class="center" style="margin:8px 0">${stage<2?`<button class="btn ghost" id="hn">💡 تلميح (−١ نقطة)</button>`:''}</div>
  <div class="board">${opts.map(o=>`<button class="bin" data-w="${o.w}" style="font-size:1.2rem">${o.w}</button>`).join('')}</div><div class="fb"></div></div>`;
   const hn=$('#hn',box);if(hn)hn.onclick=()=>{stage++;render()};
   let done=false;$$('.bin',box).forEach(b=>b.onclick=()=>{if(done)return;done=true;const ok=b.dataset.w===it.w;$$('.bin',box).forEach(x=>{if(x.dataset.w===it.w)x.classList.add('ok');else if(x===b)x.classList.add('no')});
    const pts=ok?3-stage:0;if(ok){sc+=pts;award(pts);S.sfx.yes()}else S.sfx.no();
    $('.fb',box).innerHTML=`<div class="why">${ok?'👏 أحسنتم! +'+ar(pts)+' نقاط':'❌ أنا: <b>'+it.w+'</b>'}</div><div class="center" style="margin-top:8px"><button class="btn" id="nx">التالي</button></div>`;
    $('#nx',box).onclick=()=>{i++;next();draw()}})};
  render()};
 draw()};
})();
