/* علوم · المعلمة حنان العمري — النواة: التوجيه، الفرق، الدروس، الاختبارات */
(()=>{
const SCI=window.SCI={routes:{}};
const $=(s,r=document)=>r.querySelector(s),$$=(s,r=document)=>[...r.querySelectorAll(s)];
const ar=n=>String(n).replace(/\d/g,d=>'٠١٢٣٤٥٦٧٨٩'[d]);
const shuf=a=>{a=[...a];for(let i=a.length-1;i>0;i--){const j=Math.random()*(i+1)|0;[a[i],a[j]]=[a[j],a[i]]}return a};
const app=$('#app');
const LS={get(k,d){try{const v=localStorage.getItem('sciH_'+k);return v?JSON.parse(v):d}catch(e){return d}},set(k,v){try{localStorage.setItem('sciH_'+k,JSON.stringify(v))}catch(e){}}};
const CH=Object.values(window.CHAPTERS).sort((a,b)=>a.id.localeCompare(b.id));
const IMG=n=>n?`<img class="stk" src="img/${n}.webp" alt="" loading="lazy">`:'';
const src=n=>n?`img/${n}.webp`:'';
Object.assign(SCI,{$,$$,ar,shuf,app,LS,CH,IMG,src});

/* ---------- الصوت: التصفيق بعد الصحيح فقط ---------- */
let muted=LS.get('muted',false);
const play=(n,v=.6,fb)=>{if(muted)return;try{const a=new Audio('sfx/'+n+'.mp3');a.volume=v;const p=a.play();if(p&&p.catch)p.catch(()=>fb&&fb())}catch(e){}};
SCI.sfx={yes(){play('correct',.55);play('sparkle',.5);setTimeout(()=>play('clap',.45),380)},no(){play('wrong',.5)},win(){play('fanfare',.7);play('win',.5);setTimeout(()=>play('clap_long',.5),500)},tick(){play('tick',.5)},pop(){play('pop',.5)},whoosh(){play('whoosh',.35)},star(){play('star',.6)}};
SCI.confetti=(n=60)=>{let c=$('#conf');if(!c){c=document.createElement('canvas');c.id='conf';c.style.cssText='position:fixed;inset:0;pointer-events:none;z-index:80;width:100%;height:100%';document.body.appendChild(c)}
 const x=c.getContext('2d');c.width=innerWidth;c.height=innerHeight;const cols=['#ffc72c','#3d7bff','#34c25a','#ff5a9d','#ff8a1f'];
 const ps=Array.from({length:n},()=>({x:Math.random()*c.width,y:-10,vx:Math.random()*2-1,vy:2+Math.random()*3,s:6+Math.random()*7,c:cols[Math.random()*5|0],r:Math.random()*6}));let f=0;
 (function st(){x.clearRect(0,0,c.width,c.height);ps.forEach(p=>{p.x+=p.vx;p.y+=p.vy;p.r+=.1;x.fillStyle=p.c;x.save();x.translate(p.x,p.y);x.rotate(p.r);x.fillRect(-p.s/2,-p.s/2,p.s,p.s*.6);x.restore()});if(++f<120)requestAnimationFrame(st);else x.clearRect(0,0,c.width,c.height)})()};

/* ---------- الفرق ---------- */
const COLS=['#ff8a1f','#3d7bff','#34c25a','#ff5a9d'];
let teams=LS.get('teams2',null)||['المخترعات 🔬','نجمات الفضاء 🚀','العالِمات 🧪','المستكشفات 🌿'].map(n=>({n,s:0}));
let turn=0;
SCI.teams={get list(){return teams},get turn(){return turn},
 award(p){teams[turn].s+=p;LS.set('teams2',teams);SCI.refreshTeams()},
 next(){turn=(turn+1)%teams.length;SCI.refreshTeams()}};
SCI.teamsBar=()=>`<div class="teamsbar" id="tb">${teams.map((t,i)=>`<span class="tm ${i===turn?'cur':''}"><i style="background:${COLS[i]}"></i>${t.n}<b>${ar(t.s)}</b></span>`).join('')}</div>`;
SCI.refreshTeams=()=>{const b=$('#tb');if(b)b.outerHTML=SCI.teamsBar()};
function teamsPanel(){let p=$('.panel');if(p){p.remove();return}
 p=document.createElement('div');p.className='panel';
 p.innerHTML=`<h3>🏆 الفرق والنقاط</h3>${teams.map((t,i)=>`<div class="r"><i style="width:22px;height:22px;border-radius:50%;background:${COLS[i]}"></i><input data-i="${i}" value="${t.n}" aria-label="اسم الفريق"><button class="s" data-m="${i}">−</button><b style="font:400 1.4rem Lalezar;min-width:34px;text-align:center">${ar(t.s)}</b><button class="s" data-p="${i}">+</button><button class="s" data-t="${i}" title="الدور">▶</button></div>`).join('')}
 <div class="r"><button class="btn ghost" id="tz">تصفير النقاط</button><button class="btn" id="tx">إغلاق</button></div>`;
 document.body.appendChild(p);
 $$('input',p).forEach(e=>e.oninput=()=>{teams[+e.dataset.i].n=e.value;LS.set('teams2',teams);SCI.refreshTeams()});
 const rr=()=>{p.remove();teamsPanel()};
 $$('[data-m]',p).forEach(b=>b.onclick=()=>{teams[+b.dataset.m].s--;LS.set('teams2',teams);SCI.refreshTeams();rr()});
 $$('[data-p]',p).forEach(b=>b.onclick=()=>{teams[+b.dataset.p].s++;LS.set('teams2',teams);SCI.refreshTeams();rr()});
 $$('[data-t]',p).forEach(b=>b.onclick=()=>{turn=+b.dataset.t;SCI.refreshTeams();rr()});
 $('#tz',p).onclick=()=>{teams.forEach(t=>t.s=0);LS.set('teams2',teams);SCI.refreshTeams();rr()};
 $('#tx',p).onclick=()=>p.remove()}

/* ---------- القراءة بصوت عالٍ (اختياري) ---------- */
SCI.speak=t=>{try{const u=new SpeechSynthesisUtterance(t.replace(/<[^>]+>/g,''));u.lang='ar-SA';u.rate=.85;speechSynthesis.cancel();speechSynthesis.speak(u)}catch(e){}};
SCI.stopSpeak=()=>{try{speechSynthesis.cancel()}catch(e){}};

/* ---------- الإطار العام ---------- */
const KID=window.SCI_KID;const topbar=()=>`<div class="top"><div class="logo"><img src="img/microscope.webp" alt=""><div><b>${KID?'مختبر العلوم':'مادة العلوم'}</b><div class="muted" style="font-size:.85rem;line-height:1.2">${KID?'الصف الرابع':'المعلمة حنان العمري'}</div></div></div><div class="chips"><button class="tbtn" id="bHome">${KID?'⬅ ملعبي':'🏠 الرئيسية'}</button>${KID?'':'<button class="tbtn" id="bTeams">🏆 الفرق</button>'}<button class="tbtn" id="bSnd">${muted?'🔇':'🔊'}</button></div></div>`;
SCI.page=(html,{teamsOn=false}={})=>{SCI.stopSpeak&&SCI.stopSpeak();const p=$('.panel');if(p)p.remove();app.innerHTML=topbar()+(teamsOn?SCI.teamsBar():'')+html;
 $('#bHome').onclick=()=>{if(KID)location.href='../'+KID+'/index.html';else location.hash='home'};if($('#bTeams'))$('#bTeams').onclick=teamsPanel;$('#bSnd').onclick=()=>{muted=!muted;LS.set('muted',muted);$('#bSnd').textContent=muted?'🔇':'🔊'};SCI.sfx.whoosh();scrollTo(0,0)};
const pgSpan=p=>p?`<span class="pg">ص${ar(p).replace(/^ص/,'')}</span>`:'';
SCI.pgSpan=pgSpan;

/* ---------- الصفحة الرئيسية ---------- */
SCI.routes.home=()=>{
 const units=[];CH.forEach(c=>{let u=units.find(x=>x.u===c.unit);if(!u){u={u:c.unit,cs:[]};units.push(u)}u.cs.push(c)});
 const big=[['مختبر المجسّمات','🔬 خلية تُفكَّك وتُركَّب، ومجهر','microscope','#ff8a1f','lab'],['ألعاب الفصل','فرق ونقاط وتصفيق','trophy_x','#3d7bff','games'],['اختبارات الفصول','نماذج الكتاب كاملة','test_tubes','#34c25a','tests'],['الدروس والأنشطة','كل فصول الكتاب','food_pyramid','#c9ee2b','#units'],['طالبات الصف الرابع','مَن تجيب؟ و4/1 و4/2','heart','#ff5a9d','groups'],['مرجعيات الكتاب','المقدمة وأجهزة الجسم والمصطلحات','test_tubes','#ffc72c','ref']];
 SCI.page(`<section class="hero2"><div class="ht"><h1>مادة العلوم</h1><span class="tn" style="font-size:1.15rem">الصف الرابع الابتدائي · الفصل الدراسي الأول</span><br><span class="tn">معلمة المادة: حنان العمري</span></div><div class="hi"><img src="img/microscope.webp" alt=""><img src="img/frog.webp" alt=""></div></section>
 <div class="big4">${big.map(b=>`<button class="bigc" style="background:${b[3]}" data-go="${b[4]}"><img src="img/${b[2]==='trophy_x'?'balanced_food':b[2]}.webp" alt=""><b>${b[0]}</b><small>${b[1]}</small></button>`).join('')}</div>
 <section class="units" id="units">${units.map(u=>`<h2>${u.u}</h2><div class="chg">${u.cs.map((c,i)=>`<button class="chc" style="background:${c.color}" data-go="${c.id}"><img src="img/${c.icon}.webp" alt=""><span><small>${c.n} · ص${ar(c.pg)}</small><b>${c.title}</b></span></button>`).join('')}</div>`).join('')}</section>
 <details class="card" id="guide"><summary><b>📖 دليل المعلمة: ما هذا الموقع وكيف أستخدمه؟</b></summary><div style="margin-top:8px;line-height:2.1">
<p><b>ما هذا الموقع؟</b> موقع لمادة العلوم للصف الرابع الابتدائي (الفصل الدراسي الأول)، مأخوذ كله من كتاب العلوم، وعلى كل معلومة رقم صفحتها من الكتاب. تفتحينه على السبورة الذكية أو الآيباد، وتستخدمينه مع الطالبات في الحصة.</p>
<p><b>١) الدروس والأنشطة:</b> اختاري الفصل ثم الدرس. في كل درس تبويبات: انظري، استكشفي، المطوية، من الكتاب (الأنشطة والجداول والأسئلة المفتوحة)، أسئلة، ألعاب، ملخص. ويمكنكِ الضغط على 🔊 لسماع الكلمة ومعناها.</p>
<p><b>٢) مختبر المجسّمات:</b> مجسّمات حقيقية تدار بالإصبع: الخلية الحيوانية والنباتية، الضفدع، الفراشة، القلب، المجهر. وفيه «الخلية التعليمية» تفكّكينها بالمنزلق وتركّبينها، و«المجهر» يكبّر البصل والدم والبكتيريا، و«مستويات التنظيم» من الخلية إلى الجهاز.</p>
<p><b>٣) ألعاب الفصل:</b> فرق بأسماء علمية (المخترعات، نجمات الفضاء، العالِمات، المستكشفات). اضغطي «🏆 الفرق» لتغيير الأسماء والنقاط. الإجابة الصحيحة تعطي نقطة للفريق صاحب الدور، ويتبعها صوت نجاح ثم تصفيق. الخطأ يُظهر الإجابة الصحيحة بلا تصفيق.</p>
<p><b>٤) طالبات الفصل (4/1 و4/2):</b> «مَن تجيب؟» تختار طالبة وسؤالًا من الكتاب، وتوزيع الطالبات على الفرق الأربعة عشوائيًّا. ويمكنكِ إضافة أي اسم أو حذفه، وتُحفظ الأسماء على هذا الجهاز.</p>
<p><b>٥) اختبارات الفصول:</b> نماذج الكتاب بعد كل فصل، تُحَلّ كاملة ثم تُصحَّح.</p>
<p><b>٦) مرجعيات الكتاب:</b> مقدمة الكتاب (الطريقة العلمية، المهارات، السلامة) وملحقه (أجهزة الجسم، الغذاء، البيانات، المصطلحات).</p>
<p class="muted" style="font-size:.85rem"><b>مصادر المجسّمات:</b> المجسّمات الستة منشورة بترخيص Creative Commons (CC BY) على موقع Sketchfab، وأصحابها: montanna (الخلية الحيوانية)، CVallance (الخلية النباتية)، grodan (الضفدع)، LasquetiSpice (الفراشة)، neshallads (القلب)، Eugen Vahrushin (المجهر).</p>
</div></details>`);
 $$('[data-go]').forEach(b=>b.onclick=()=>{const g=b.dataset.go;if(g==='#units')$('#units').scrollIntoView({behavior:'smooth'});else location.hash=g})};

/* ---------- صفحة الفصل ---------- */
const KIND={lesson:'درس',skill:'مهارة',reading:'قراءة علمية',review:'مراجعة واختبار'};
SCI.routes.chapter=cid=>{const c=window.CHAPTERS[cid];if(!c){location.hash='home';return}
 SCI.page(`<div class="crumb"><button class="tbtn" onclick="location.hash='home'">↩ الرئيسية</button><span class="pill">${c.unit}</span></div>
 <section class="card" style="border-top:10px solid ${c.color}"><h2>${c.n}: ${c.title} ${pgSpan(c.pg)}</h2>
 ${c.idea?`<p class="big-t" style="margin:0">❓ الفكرة العامة: ${c.idea}</p>`:''}
 ${(c.verses||[]).map(v=>`<p class="center" style="font:500 1.5rem/2.4 'Noto Naskh Arabic',serif;background:#fff6d6;border-radius:14px;padding:8px">﴿${v.t}﴾<br><small>${v.ref} · ص${ar(v.pg)}</small></p>`).join('')}</section>
 <h3>🔑 مفردات الفصل <small class="muted">اضغطي البطاقة لتري المعنى</small></h3><div class="wordg">${(c.vocab||[]).map((v,i)=>`<div class="wc" data-i="${i}" role="button" tabindex="0"><button class="sp" data-s="${i}" aria-label="استماع">🔊</button>${v.img?`<img src="${src(v.img)}" alt="" style="width:70px;height:70px;object-fit:contain">`:''}<b>${v.w}</b><div class="d" hidden>${v.d}</div></div>`).join('')}</div>
 <h3 style="margin-top:16px">📚 أجزاء الفصل</h3><div class="chg">${c.parts.map(p=>`<button class="chc" style="background:${p.color||c.color}" data-go="${c.id}/${p.id}"><img src="img/${p.icon}.webp" alt=""><span><small>${KIND[p.kind]||p.kind} · ص${ar(p.pg)}</small><b>${p.title}</b></span></button>`).join('')}</div>
 <div class="center"><button class="btn gold" data-go="games/${c.id}">🎮 ألعاب هذا الفصل</button> <button class="btn" data-go="t/${c.id}">📝 اختبار الفصل</button></div>`);
 $$('.wc').forEach(w=>{const f=()=>{const d=$('.d',w);d.hidden=!d.hidden;w.classList.toggle('flip',!d.hidden)};w.onclick=e=>{if(e.target.closest('.sp'))return;f()};w.onkeydown=e=>{if(e.key==='Enter'||e.key===' '){e.preventDefault();f()}}});
 $$('.sp').forEach(b=>b.onclick=()=>{const v=c.vocab[+b.dataset.s];SCI.speak(v.w+'. '+v.d)});
 $$('[data-go]').forEach(b=>b.onclick=()=>{location.hash=b.dataset.go})};

/* ---------- صفحة جزء (درس/مهارة/قراءة/مراجعة) ---------- */
let tab={};
const exploreHTML=e=>!e?'':`<section class="card"><h3>🔬 ${e.t||'أستكشف'} ${pgSpan(e.pg)}</h3>${e.img?`<img class="bigimg" src="${src(e.img)}" alt="">`:''}${e.goal?`<p class="big-t"><b>الهدف:</b> ${e.goal}</p>`:''}${(e.need||[]).length?`<p><b>أحتاج:</b></p><div class="need">${e.need.map(n=>`<span>${n}</span>`).join('')}</div>`:''}<ol class="steps">${(e.steps||[]).map(s=>`<li>${s}</li>`).join('')}</ol>${(e.result||[]).length?`<div class="why">${e.result.map(r=>`<p style="margin:4px 0;font:500 1.15rem/2 'Noto Naskh Arabic',serif">${r}</p>`).join('')}</div>`:''}</section>`;
const foldHTML=f=>!f?'':`<section class="card"><h3>📑 ${f.title} ${pgSpan(f.pg)}</h3>${f.rows.map((r,i)=>`<div class="acc ${i===0?'open':''}"><button>${r.icon?`<img src="${src(r.icon)}" alt="">`:''}${r.tab} <span class="pg">${r.pg||''}</span></button><div class="bd">${r.pts.map(p=>`<div class="pt">${p.img?`<img src="${src(p.img)}" alt="">`:''}<div><h4>${p.t} ${p.pg?pgSpan(p.pg):''}</h4><p>${p.x||''}</p>${p.list?`<ul class="sub">${p.list.map(l=>`<li>${l[0]?`<img src="${src(l[0])}" alt="" style="width:46px;height:46px;object-fit:contain;vertical-align:middle;margin-inline-end:6px">`:''}<b>${l[1]}</b>: ${l[2]||''}</li>`).join('')}</ul>`:''}</div></div>`).join('')}</div></div>`).join('')}</section>`;
const wordsHTML=(ws,id)=>!ws||!ws.length?'':`<section class="card"><h3>🔑 كلمات الدرس <small class="muted">اضغطي لترى المعنى</small></h3><div class="wordg">${ws.map((w,i)=>`<div class="wc" data-i="${i}" role="button" tabindex="0"><button class="sp" data-s="${i}">🔊</button><b>${w[0]}</b><small>${pgSpan(w[2])}</small><div class="d" hidden>${w[1]}</div></div>`).join('')}</div></section>`;
const AN=s=>+String(s||'').replace(/[٠-٩]/g,d=>'٠١٢٣٤٥٦٧٨٩'.indexOf(d)).replace(/[^0-9]/g,'')||0;
const NI=()=>Object.values(window.NEEDIMG||{}).flat().filter(x=>x&&typeof x==='object'&&x.id);
const figsFor=pgr=>{const m=String(pgr||'').match(/[٠-٩0-9]+/g)||[];if(!m.length)return[];const lo=AN(m[0]),hi=AN(m[m.length-1]);return NI().filter(x=>{const p=AN(x.pg);return p>=lo&&p<=hi})};
const figHTML=l=>l.length?`<section class="card"><h3>🖼 أشكال الكتاب بالصلصال</h3><div class="wordg">${l.map(x=>`<div class="wc" style="cursor:default;align-items:center;text-align:center"><img src="img/${x.id}.webp" alt="" style="width:100%;max-height:200px;object-fit:contain" loading="lazy"><small>${x.pg?pgSpan(x.pg):''}</small></div>`).join('')}</div></section>`:'';
const KB={discuss:'💬 للنقاش',activity:'🧪 نشاط',table:'📊 جدول',write:'✍ كتابة علمية',math:'➗ علوم ورياضيات',fact:'💡 حقيقة',skill:'🎯 مهارة',vocab:'🔑 مفردة'};
const bookHTML=b=>!b||!b.length?'':b.map((x,i)=>`<section class="card"><h3>${KB[x.k]||'📌'} ${x.t||''} ${x.pg?pgSpan(x.pg):''}</h3>${x.img?`<img class="bigimg" style="max-height:240px" src="${src(x.img)}" alt="">`:''}${x.x?`<p class="big-t">${x.x}</p>`:''}${(x.need||[]).length?`<div class="need">${x.need.map(n=>`<span>${n}</span>`).join('')}</div>`:''}${(x.steps||[]).length?`<ol class="steps">${x.steps.map(t=>`<li>${t}</li>`).join('')}</ol>`:''}${x.rows?`<div style="overflow:auto"><table class="bt"><thead><tr>${(x.head||[]).map(h=>`<th>${h}</th>`).join('')}</tr></thead><tbody>${x.rows.map(r=>`<tr>${r.map(c=>`<td>${c}</td>`).join('')}</tr>`).join('')}</tbody></table></div>`:''}${(x.list||[]).length?`<ul class="sub">${x.list.map(l=>`<li>${l[0]?`<img src="${src(l[0])}" alt="" style="width:56px;height:56px;object-fit:contain;vertical-align:middle;margin-inline-end:8px">`:''}<b>${l[1]}</b>${l[2]?': '+l[2]:''}</li>`).join('')}</ul>`:''}${x.a?`<div class="center"><button class="btn gold bk" data-a="${i}">👁 الإجابة</button></div><div class="why" id="ba${i}" hidden>${x.a}</div>`:''}</section>`).join('');
SCI.figsFor=figsFor;SCI.figHTML=figHTML;SCI.bookHTML=bookHTML;
const readingHTML=p=>`<section class="card">${p.img?`<img class="bigimg" src="${src(p.img)}" alt="">`:''}${p.paras.map(t=>`<p class="big-t">${t}</p>`).join('')}${p.write?`<div class="why"><b>✍ اكتبي:</b> ${typeof p.write==='string'?p.write:(p.write.q||JSON.stringify(p.write))}</div>`:''}</section>`;
const sumHTML=s=>!s||!s.length?'':`<section class="card"><h3>📝 ملخص</h3><ul>${s.map(t=>`<li class="big-t">${t}</li>`).join('')}</ul></section>`;
SCI.routes.part=(cid,pid)=>{const c=window.CHAPTERS[cid],p=c&&c.parts.find(x=>x.id===pid);if(!p){location.hash='home';return}
 const T=[];
 if(p.kind==='lesson'){T.push(['look','👀 انظري'],['explore','🔬 استكشفي']);if(p.fold)T.push(['fold','📑 المطوية']);if((p.book||[]).length||figsFor(p.pg).length)T.push(['book','📌 من الكتاب']);T.push(['qs','❓ أسئلة']);if((p.games||[]).length)T.push(['games','🎮 ألعاب']);T.push(['sum','📝 ملخص'])}
 else if(p.kind==='skill'){T.push(['intro','📖 المهارة']);if(p.explore)T.push(['explore','🔬 جرّبي']);if((p.book||[]).length||figsFor(p.pg).length)T.push(['book','📌 من الكتاب']);if((p.games||[]).length)T.push(['games','🎮 ألعاب'])}
 else if(p.kind==='reading'){T.push(['read','📖 اقرئي']);if((p.book||[]).length||figsFor(p.pg).length)T.push(['book','📌 من الكتاب']);if((p.qs||[]).length)T.push(['qs','❓ أسئلة'])}
 else {T.push(['sum','📝 الملخص'],['test','📝 النموذج']);if((p.book||[]).length||figsFor(p.pg).length)T.push(['book','📌 من الكتاب'])}
 const k=cid+'/'+pid;if(!tab[k]||!T.some(t=>t[0]===tab[k]))tab[k]=T[0][0];
 const idx=c.parts.indexOf(p),nx=c.parts[idx+1],pv=c.parts[idx-1];
 SCI.page(`<div class="crumb"><button class="tbtn" data-go="${cid}">↩ ${c.title}</button><span class="pill">${KIND[p.kind]} · ${p.n}</span></div>
 <h2>${p.title} ${pgSpan(p.pg)}</h2>${p.q?`<p class="big-t" style="margin:0">❓ ${p.q}</p>`:''}
 <div class="tabs">${T.map(t=>`<button data-t="${t[0]}" class="${tab[k]===t[0]?'on':''}">${t[1]}</button>`).join('')}</div><div id="tp"></div>
 <div class="center" style="margin:14px 0">${pv?`<button class="btn ghost" data-go="${cid}/${pv.id}">→ ${pv.title}</button> `:''}${nx?`<button class="btn" data-go="${cid}/${nx.id}">${nx.title} ←</button>`:''}</div>`,{teamsOn:T.some(t=>t[0]==='games'||t[0]==='qs')});
 const draw=()=>{const tp=$('#tp');const t=tab[k];tp.innerHTML='';
  if(t==='look'){tp.innerHTML=(p.look?`<section class="card">${p.look.img?`<img class="bigimg" src="${src(p.look.img)}" alt="">`:''}<p class="big-t">${p.look.x||''} ${pgSpan(p.look.pg)}</p></section>`:'')+wordsHTML(p.words)}
  else if(t==='explore'){tp.innerHTML=exploreHTML(p.explore);if(p.sim&&SCI.sim)SCI.sim(tp,p.sim)}
  else if(t==='fold')tp.innerHTML=foldHTML(p.fold);
  else if(t==='intro'){tp.innerHTML=`<section class="card"><p class="big-t">${p.intro||''}</p></section>`+(p.extra||[]).map(x=>`<section class="card"><h3>${x.t} ${pgSpan(x.pg)}</h3><p class="big-t">${x.x}</p>${x.list?`<ul class="sub">${x.list.map(l=>`<li>${l[0]?`<img src="${src(l[0])}" alt="" style="width:70px;height:70px;object-fit:contain;vertical-align:middle;margin-inline-end:8px">`:''}<b>${l[1]}</b>: ${l[2]||''}</li>`).join('')}</ul>`:''}</section>`).join('')}
  else if(t==='read')tp.innerHTML=readingHTML(p);
  else if(t==='sum')tp.innerHTML=sumHTML(p.summary);
  else if(t==='book'){tp.innerHTML=figHTML(figsFor(p.pg))+bookHTML(p.book);$$('.bk',tp).forEach(b=>b.onclick=()=>{const e=$('#ba'+b.dataset.a,tp);e.hidden=!e.hidden})}
  else if(t==='qs'){SCI.quiz(tp,p.qs.map(q=>({q:q.q,o:q.o,a:q.a,w:q.w,p:q.p})),{title:p.title})}
  else if(t==='games'){SCI.gamesList(tp,p.games)}
  else if(t==='test'){SCI.testPaper(tp,p)}
  $$('.acc>button',tp).forEach(b=>b.onclick=()=>b.parentElement.classList.toggle('open'));
  $$('.wc',tp).forEach(w=>{const f=()=>{const d=$('.d',w);d.hidden=!d.hidden;w.classList.toggle('flip',!d.hidden)};w.onclick=e=>{if(e.target.closest('.sp'))return;f()}});
  $$('.sp',tp).forEach(b=>b.onclick=()=>{const w=(p.words||[])[+b.dataset.s];if(w)SCI.speak(w[0]+'. '+w[1])});
  $$('[data-go]',tp).forEach(b=>b.onclick=()=>{location.hash=b.dataset.go})};
 $$('.tabs button').forEach(b=>b.onclick=()=>{tab[k]=b.dataset.t;$$('.tabs button').forEach(x=>x.classList.toggle('on',x===b));draw()});
 $$('[data-go]',app).forEach(b=>{if(!b.closest('#tp'))b.onclick=()=>{location.hash=b.dataset.go}});
 draw()};

/* ---------- التوجيه ---------- */
function route(){const h=(location.hash||(window.SCI_KID?'#lab':'#home')).slice(1).split('/');if(window.SCI_KID&&h[0]==='home')h[0]='lab';const R=SCI.routes;
 try{
  if(h[0]==='home'||h[0]==='')R.home();
  else if(h[0]==='lab')R.lab&&R.lab(h.slice(1).join('/'));
  else if(h[0]==='games')R.games&&R.games(h[1]);
  else if(h[0]==='g')R.game&&R.game(h[1],h[2]);
  else if(h[0]==='tests')R.tests&&R.tests();
  else if(h[0]==='groups')R.groups&&R.groups();else if(h[0]==='ref')R.ref&&R.ref(h[1]);
  else if(h[0]==='t')R.test&&R.test(h[1]);
  else if(/^c\d$/.test(h[0]))h[1]?R.part(h[0],h[1]):R.chapter(h[0]);
  else R.home();
 }catch(e){console.error(e);app.innerHTML='<div class="card center"><h3>حدث خطأ</h3><button class="btn" onclick="location.hash=\'home\'">الرئيسية</button></div>'}}
SCI.start=()=>{addEventListener('hashchange',route);route()};
})();
