/* بوصلة نادين: مهمة أدائية تفاعلية — الاجتماعيات رابع، الدرس العاشر «الموقع» (ص٦٩–٧١) */
(function(){
const {app,P,LS,bus,NAMES,avatar,confetti,topbar,bindTop,sfx,stars,starRow,setMas,$,$$}=window.NYG,GAMES=window.GAMES,home=window.home;
const DN=['الشمال','الشمال الشرقي','الشرق','الجنوب الشرقي','الجنوب','الجنوب الغربي','الغرب','الشمال الغربي'];
const nm=a=>DN[(((Math.round(a/45))%8)+8)%8];
const MAIN=['الشمال','الشرق','الجنوب','الغرب'],SUB=['الشمال الشرقي','الجنوب الشرقي','الجنوب الغربي','الشمال الغربي'];
const POS={'الشمال':[230,60],'الشمال الشرقي':[360,100],'الشرق':[400,230],'الجنوب الشرقي':[360,360],'الجنوب':[230,400],'الجنوب الغربي':[100,360],'الغرب':[60,230],'الشمال الغربي':[100,100]};
const COL={'الشمال':'#3d7bff','الشرق':'#ff8a3d','الجنوب':'#34c25a','الغرب':'#b04dff','الشمال الشرقي':'#18a8c9','الجنوب الشرقي':'#e0a100','الجنوب الغربي':'#d4577a','الشمال الغربي':'#7a63e0'};
const S={st:0,pts:0,max:0,log:[]};
const sh=a=>{a=a.slice();for(let i=a.length-1;i>0;i--){const j=Math.floor(Math.random()*(i+1));[a[i],a[j]]=[a[j],a[i]]}return a};
const STG=[['تعلّمي','📖'],['ركّبي','🧩'],['الخريطة','🗺️'],['أنشطة الكتاب','🏆']];
function css(){if(document.getElementById('cmpcss'))return;const s=document.createElement('style');s.id='cmpcss';s.textContent=`
.cmp-dots{display:flex;gap:6px;justify-content:center;margin:6px 0;flex-wrap:wrap}.cmp-dot{padding:4px 12px;border-radius:999px;background:#eee;font-weight:800;font-size:.85rem}.cmp-dot.on{background:#1aa6b7;color:#fff}.cmp-dot.ok{background:#34c25a;color:#fff}
.cmp-chip{border:3px solid #1aa6b7;background:#fff;border-radius:14px;padding:8px 12px;font:inherit;font-weight:800;font-size:1rem;cursor:pointer;margin:3px}.cmp-chip.sel{background:#1aa6b7;color:#fff}.cmp-chip.done{opacity:.35;pointer-events:none}.cmp-chip.bad{background:#ffd6d6;border-color:#e05555}.cmp-chip.good{background:#d9f7d9;border-color:#34c25a}
.cmp-box{background:#fff;border:4px solid #1aa6b7;border-radius:18px;padding:8px;margin:8px 0}.cmp-say{background:#fff8e6;border:3px dashed #b8895a;border-radius:14px;padding:8px 12px;margin:8px 0;font-weight:800}
.cmp-grid3{display:grid;grid-template-columns:repeat(3,1fr);gap:6px;direction:ltr;max-width:340px;margin:8px auto}.cmp-grid3 button{padding:10px 2px;font-size:.85rem;margin:0}
.cmp-shake{animation:cmpsh .35s}@keyframes cmpsh{25%{transform:translateX(-6px)}75%{transform:translateX(6px)}}
.cmp-pulse{animation:cmppl 1s infinite}@keyframes cmppl{50%{opacity:.35}}
.cmp-sheet{background:#fff;border:5px solid #1aa6b7;border-radius:20px;padding:14px;margin:8px 0}.cmp-sheet li{margin:4px 0;font-weight:700}
@media print{body *{visibility:hidden}.cmp-sheet,.cmp-sheet *{visibility:visible}.cmp-sheet{position:absolute;inset:0;border:none}.cmp-np{display:none!important}}`;document.head.appendChild(s)}
function head(){return `${topbar()}<div class="card center" style="background:linear-gradient(135deg,#e6f7ff,#fff8e6);border:5px solid #1aa6b7;padding:8px"><h2 style="margin:0">🧭 بوصلة نادين</h2><div class="muted" style="font-size:.85rem">الاجتماعيات · درس «الموقع» · كتابك ص٦٩–٧١</div><div class="cmp-dots">${STG.map((s,i)=>`<span class="cmp-dot ${i===S.st?'on':i<S.st?'ok':''}">${s[1]} ${s[0]}</span>`).join('')}</div></div>`}
function point(ok,first){S.max++;if(ok&&first)S.pts++;}
function good(){sfx('correct')}function bad(el){sfx('wrong');if(el){el.classList.remove('cmp-shake');void el.offsetWidth;el.classList.add('cmp-shake')}}
function next(){S.st++;stage()}
/* ---------- بناء وردة البوصلة ---------- */
function roseSvg(opts){opts=opts||{};const c=230;let s=`<svg id="cmpsvg" viewBox="-30 -30 520 520" style="width:100%;max-width:420px;display:block;margin:auto;direction:ltr"><circle cx="${c}" cy="${c}" r="160" fill="#f4fbff" stroke="#1aa6b7" stroke-width="5"/>`;
 s+=`<g id="cmprose">`;
 for(let i=0;i<8;i++){const a=i*45,L=i%2?92:150,w=i%2?9:15;const r=Math.PI*a/180,ex=c+L*Math.sin(r),ey=c-L*Math.cos(r),px=Math.cos(r)*w,py=Math.sin(r)*w;s+=`<polygon points="${c+px},${c+py} ${ex},${ey} ${c-px},${c-py}" fill="${i%2?'#9bd5dc':(i%4?'#34c25a':'#1aa6b7')}" opacity=".85"/>`}
 s+=`<circle cx="${c}" cy="${c}" r="12" fill="#fff" stroke="#1aa6b7" stroke-width="4"/>`;
 if(opts.sun)s+=`<g transform="translate(${c+195},${c})"><circle r="26" fill="#ffd54a"/>${[0,45,90,135,180,225,270,315].map(a=>`<line x1="0" y1="-32" x2="0" y2="-44" stroke="#ffb300" stroke-width="5" stroke-linecap="round" transform="rotate(${a})"/>`).join('')}</g>`;
 if(opts.labels)for(let i=0;i<8;i++){const a=i*45,r=Math.PI*a/180,R=i%2?118:182,x=c+R*Math.sin(r),y=c-R*Math.cos(r);s+=`<g class="cmplab" data-x="${x}" data-y="${y}" transform="translate(${x},${y})"><rect x="-${i%2?44:34}" y="-15" width="${i%2?88:68}" height="30" rx="14" fill="#fff" stroke="${COL[DN[i]]}" stroke-width="3"/><text text-anchor="middle" y="6" font-size="${i%2?15:19}" font-weight="800" fill="${COL[DN[i]]}">${DN[i]}</text></g>`}
 s+=`</g>`;return s}
/* ---------- المرحلة ١: أنا البوصلة ---------- */
function st1(){S.theta=90;S.shown=90;S.quiz=0;
 app.innerHTML=`${head()}<div class="card"><h3 style="margin:0 0 4px">1️⃣ أنا البوصلة 🌅 <small class="muted">(ص٧٠)</small></h3>
 <div class="cmp-say">حينما تكون <b>الشمس أمامي</b> في الصباح يكون <b>الغرب خلفي</b>، و<b>الشمال عن يساري</b>، و<b>الجنوب عن يميني</b>. <small class="muted">(الجهات الأصلية: الشرق، الغرب، الشمال، الجنوب)</small></div>
 <div style="position:relative;max-width:420px;margin:auto;direction:ltr">${roseSvg({sun:1,labels:1})}</svg>
 <div style="position:absolute;left:50%;top:50%;transform:translate(-50%,-50%);width:64px;text-align:center">${avatar(64,'nadeen','idle')}</div>
 <div style="position:absolute;left:50%;top:1%;transform:translateX(-50%);background:#ff8a3d;color:#fff;border-radius:12px;padding:2px 10px;font-weight:800;font-size:.8rem">⬆ أمامي</div></div>
 <div id="cmpchips" style="display:grid;grid-template-columns:repeat(2,1fr);gap:6px;margin:8px 0"></div>
 <div style="text-align:center"><button class="btn ghost cmp-chip" id="rl">↺ دوري يسارًا</button><button class="btn ghost cmp-chip" id="rr">↻ دوري يمينًا</button><button class="btn cmp-chip" id="rs" style="background:#ffd54a;border-color:#e0a100">🌅 وجهي للشمس</button></div>
 <p class="muted center" style="margin:4px 0">دوري بنفسك وشوفي كيف تتغيّر الجهات حولك، والشمس دائمًا في الشرق.</p>
 <div id="cmpq"></div></div>`;
 css();rot(90,true);chips();
 $('#rl').onclick=()=>turn(-90);$('#rr').onclick=()=>turn(90);$('#rs').onclick=()=>turnTo(90);
 quiz()}
let anim=0;
function rot(a,now){S.shown=a;const g=$('#cmprose');if(!g)return;g.setAttribute('transform',`rotate(${-a} 230 230)`);$$('.cmplab').forEach(l=>{const x=+l.dataset.x,y=+l.dataset.y;l.setAttribute('transform',`translate(${x},${y}) rotate(${a})`)})}
function turnTo(t){let d=((t-S.theta)%360+540)%360-180;S.theta+=d;go()}
function turn(d){S.theta+=d;go()}
function go(){const from=S.shown,to=S.theta,t0=performance.now(),id=++anim;sfx('correct');const f=n=>{if(id!==anim)return;const p=Math.min((n-t0)/700,1),e=1-Math.pow(1-p,3);rot(from+(to-from)*e);if(p<1)requestAnimationFrame(f);else chips()};requestAnimationFrame(f)}
function chips(){const t=S.theta,el=$('#cmpchips');if(!el)return;const c=(l,a,col)=>`<div class="cmp-box" style="margin:0;border-color:${col};text-align:center"><small class="muted">${l}</small><div style="font-weight:800;color:${col};font-size:1.05rem">${nm(a)}</div></div>`;
 el.innerHTML=c('⬆ أمامي',t,'#ff8a3d')+c('⬇ خلفي',t+180,'#b04dff')+c('➡ يميني',t+90,'#34c25a')+c('⬅ يساري',t-90,'#3d7bff')}
const Q1=[['الشرق أمامي، فما الذي <b>خلفي</b>؟',['الغرب','الجنوب','الشمال'],'الغرب','الشرق أمامي فالغرب خلفي.'],['الشرق أمامي، فالشمال عن...؟',['يميني','يساري','خلفي'],'يساري','الشمال عن يساري.'],['الشرق أمامي، فالجنوب عن...؟',['يميني','يساري','أمامي'],'يميني','الجنوب عن يميني.']];
function quiz(){const el=$('#cmpq');if(!el)return;if(S.quiz>=Q1.length){el.innerHTML=`<div class="center"><h3 style="margin:6px 0">ما شاء الله! فهمتِ القاعدة 🌟</h3><button class="btn" id="nx">التالي: ركّبي البوصلة ▶</button></div>`;$('#nx').onclick=next;return}
 const q=Q1[S.quiz];let first=true;el.innerHTML=`<div class="cmp-box"><b>سؤال ${S.quiz+1} من ${Q1.length}:</b> ${q[0]}<div>${sh(q[1]).map(o=>`<button class="cmp-chip">${o}</button>`).join('')}</div></div>`;
 $$('#cmpq .cmp-chip').forEach(b=>b.onclick=()=>{if(b.textContent===q[2]){b.classList.add('good');good();point(1,first);setTimeout(()=>{S.quiz++;quiz()},700)}else{first=false;b.classList.add('bad');bad(b)}})}
/* ---------- المرحلة ٢: ركّبي البوصلة ---------- */
function bookSvg(){const c=230;return `<svg id="cmpsvg" viewBox="-30 -30 520 520" style="width:100%;max-width:420px;display:block;margin:auto;direction:ltr"><circle cx="${c}" cy="${c}" r="24" fill="#fff" stroke="#222" stroke-width="3"/>${[[230,206,230,110],[254,230,350,230],[206,230,110,230],[230,254,230,350]].map(l=>`<line x1="${l[0]}" y1="${l[1]}" x2="${l[2]}" y2="${l[3]}" stroke="#222" stroke-width="3" stroke-dasharray="3 6"/>`).join('')}`}
function st2(){S.ph=0;S.placed={'الشمال':1};S.sel=null;S.tries={};
 app.innerHTML=`${head()}<div class="card"><h3 style="margin:0 0 4px">2️⃣ ركّبي البوصلة بنفسك 🧩 <small class="muted">(ص٧٠ · تقويم الوحدة الثالثة ص٨٦)</small></h3>
 <div class="cmp-say" id="cmpmsg"></div><div id="cmpmap" style="max-width:420px;margin:auto"></div>
 <div id="cmpbank" class="center"></div><div id="cmpnx" class="center"></div></div>`;css();draw2()}
function draw2(){const main=S.ph===0,names=main?MAIN.filter(n=>n!=='الشمال'):SUB;const msg=$('#cmpmsg');
 if(!$('#cmpmsg').dataset.set||true)msg.innerHTML=main?'<b>يحدّد الطلبة الجهات الأصلية:</b> الشمال مكتوب لك. اضغطي على اسم الجهة ثم على مكانها. <b>الشمس تشرق من الشرق ☀️</b>':'<b>الجهات الفرعية:</b> لتحديد الجهات الفرعية نبدأ بجهتَي الشمال والجنوب، فيكون لدينا: الشمال الشرقي، الجنوب الشرقي، الشمال الغربي، الجنوب الغربي.';
 $('#cmpmap').innerHTML=(main?bookSvg():roseSvg({sun:1}))+'<g id="slots"></g></svg>';
 const sl=$('#slots');const all=MAIN.concat(S.ph?SUB:[]);
 sl.innerHTML=all.map(n=>{const [x,y]=POS[n],p=S.placed[n],w=n.length>8?96:70;return `<g class="slot" data-n="${n}" style="cursor:pointer"><rect x="${x-w/2}" y="${y-19}" width="${w}" height="38" rx="${main?19:14}" fill="${p?(main&&n==='الشمال'?'#fff':COL[n]):'#fff'}" stroke="${main?'#222':COL[n]}" stroke-width="${main?3:4}" ${p?'':'stroke-dasharray="7 5"'}/><text x="${x}" y="${y+7}" text-anchor="middle" font-size="${n.length>8?15:19}" font-weight="800" fill="${p?(main&&n==='الشمال'?'#222':'#fff'):'#bbb'}">${p?n:'.....'}</text></g>`}).join('');
 const bank=$('#cmpbank');bank.innerHTML=sh(names).map(n=>`<button class="cmp-chip ${S.placed[n]?'done':''}" data-n="${n}">${n}</button>`).join('');
 $$('#cmpbank .cmp-chip').forEach(b=>b.onclick=()=>{S.sel=b.dataset.n;$$('#cmpbank .cmp-chip').forEach(x=>x.classList.toggle('sel',x===b))});
 $$('.slot').forEach(g=>g.onclick=()=>{const n=g.dataset.n;if(S.placed[n])return;if(!S.sel){$('#cmpmsg').innerHTML='اختاري اسم الجهة من الأزرار أولًا 👇';return}
  S.tries=S.tries||{};if(S.sel===n){S.placed[n]=1;point(1,!S.tries[n]);S.sel=null;good();draw2();chk()}else{S.tries[n]=1;S.tries[S.sel]=1;bad(g);$('#cmpmsg').innerHTML=hint(S.sel)}});
}
function hint(s){return ({'الشمال':'الشمال فوق ⬆ مثل رأس السهم.','الجنوب':'الجنوب تحت ⬇ عكس الشمال.','الشرق':'الشرق جهة الشمس ☀️ (الجهة اليمنى).','الغرب':'الغرب عكس الشرق (الجهة اليسرى).','الشمال الشرقي':'بين الشمال والشرق: فوق ويمين.','الجنوب الشرقي':'بين الجنوب والشرق: تحت ويمين.','الجنوب الغربي':'بين الجنوب والغرب: تحت ويسار.','الشمال الغربي':'بين الشمال والغرب: فوق ويسار.'})[s]+' جرّبي مكانًا آخر.'}
function chk(){const names=S.ph?SUB:MAIN;if(names.every(n=>S.placed[n])){sfx('win');confetti(30);if(!S.ph){$('#cmpnx').innerHTML=`<h3 style="margin:6px 0">أحسنتِ! حدّدتِ الجهات الأصلية 🌟</h3><button class="btn" id="n2">الجهات الفرعية ▶</button>`;$('#n2').onclick=()=>{S.ph=1;S.sel=null;$('#cmpnx').innerHTML='';draw2()}}else{$('#cmpnx').innerHTML=`<h3 style="margin:6px 0">بوصلتك كاملة! ركّزتِ فوصلتِ 🧭</h3><button class="btn" id="n2">التالي: خريطة المملكة ▶</button>`;$('#n2').onclick=next}}}
/* ---------- المرحلة ٣: خريطة المملكة ---------- */
const KQ=[['الرياض','المدينة المنورة','الغرب'],['الدمام','أبها','الجنوب الغربي'],['نجران','مكة المكرمة','الشمال الغربي',1],['جدة','أبها','الجنوب الشرقي'],['مكة المكرمة','المدينة المنورة','الشمال'],['جدة','مكة المكرمة','الشرق',1],['القصيم','الدمام','الشرق'],['جدة','القصيم','الشمال الشرقي'],['المدينة المنورة','مكة المكرمة','الجنوب']];
function st3(){S.qi=0;S.qs=sh(KQ).slice(0,8);q3()}
function mapSvg(a,b,qibla){const K=window.KSA,C=K.cities;let s=`<svg viewBox="0 0 ${K.W} ${K.H}" style="width:100%;display:block;border-radius:14px;background:#cfeefa"><path d="${K.d}" fill="#f6e3b0" stroke="#b8895a" stroke-width="3" stroke-linejoin="round"/>
 <text x="150" y="430" font-size="42" fill="#4aa3c7" font-weight="800" transform="rotate(-35 150 430)">البحر الأحمر</text><text x="800" y="450" font-size="42" fill="#4aa3c7" font-weight="800" transform="rotate(30 800 450)">الخليج العربي</text>
 <g transform="translate(90,95)"><circle r="46" fill="#fff" stroke="#1aa6b7" stroke-width="4"/><polygon points="0,-38 9,0 -9,0" fill="#1aa6b7"/><polygon points="0,38 9,0 -9,0" fill="#bbb"/><text y="-52" text-anchor="middle" font-size="30" font-weight="800" fill="#1aa6b7">شمال</text></g>`;
 for(const n in C){const [x,y]=C[n],on=n===a||n===b;if(n==='مكة المكرمة'){const hl=on;s+=`<g transform="translate(${x},${y})" ${hl?'class="cmp-pulse"':''}><rect x="-22" y="-22" width="44" height="44" fill="#222" stroke="${n===b?'#ff8a3d':n===a?'#34c25a':'#e0a100'}" stroke-width="6"/><rect x="-22" y="-9" width="44" height="9" fill="#e0a100"/></g><text x="${x+34}" y="${y+48}" font-size="${hl?44:36}" font-weight="800" fill="#222" stroke="#f6e3b0" stroke-width="6" paint-order="stroke">مكة 🕋</text>`;continue}
  const off=n==='جدة'?[-26,-4,'end']:[0,-24,'middle'];
  s+=`<circle cx="${x}" cy="${y}" r="${on?18:10}" fill="${n===a?'#34c25a':n===b?'#ff8a3d':'#777'}" stroke="#fff" stroke-width="4" ${on?'class="cmp-pulse"':''}/><text x="${x+off[0]}" y="${y+off[1]}" text-anchor="${off[2]}" font-size="${on?44:34}" font-weight="800" fill="#222" stroke="#f6e3b0" stroke-width="7" paint-order="stroke">${n}</text>`}
 if(a&&b){const p=C[a],q=C[b];s+=`<line x1="${p[0]}" y1="${p[1]}" x2="${q[0]}" y2="${q[1]}" stroke="#d33" stroke-width="4" stroke-dasharray="10 8"/>`}
 return s+'</svg>'}
function q3(){if(S.qi>=S.qs.length){S.st=3;S.pre=1;return stage()}
 const [a,b,ans,qb]=S.qs[S.qi];let first=true;
 const qtxt=qb?`أنتِ في <b>${a}</b> وتريدين الصلاة. في أي جهة <b>القبلة</b>؟ — ص٧٠: «يساعدني تحديد الجهات على معرفة اتجاه القبلة، وهي الكعبة المشرفة في مكة المكرمة؛ لأداء الصلاة» 🕋`:`في أي جهة تقع <b>${b}</b> بالنسبة إلى <b>${a}</b>؟`;
 app.innerHTML=`${head()}<div class="card"><h3 style="margin:0 0 4px">3️⃣ تدريب على خريطة المملكة العربية السعودية 🗺️ <small class="muted">سؤال ${S.qi+1} من ${S.qs.length}</small></h3>
 <div class="cmp-say">${qtxt}</div><div class="muted" style="font-size:.82rem;margin:4px 0">📖 ص٦٩: «يقع وطني المملكة العربية السعودية في أقصى الجنوب الغربي من قارة آسيا، ويربط بين قارات إفريقيا وأوروبا وآسيا.»</div>${mapSvg(a,b)}<div style="font-size:.85rem" class="muted center">🟢 المكان الذي تقفين فيه · 🟠 المكان الذي تبحثين عنه</div>
 <div class="cmp-grid3" id="cmpa"></div><div id="cmpfb" class="center"></div></div>`;css();
 const cells=['الشمال الغربي','الشمال','الشمال الشرقي','الغرب','🧭','الشرق','الجنوب الغربي','الجنوب','الجنوب الشرقي'];
 $('#cmpa').innerHTML=cells.map(c=>c==='🧭'?`<div class="center" style="font-size:2rem">🧭</div>`:`<button class="cmp-chip" data-a="${c}">${c}</button>`).join('');
 $$('#cmpa .cmp-chip').forEach(b=>b.onclick=()=>{const v=b.dataset.a;if(v===ans){b.classList.add('good');good();point(1,first);$$('#cmpa .cmp-chip').forEach(x=>x.style.pointerEvents='none');$('#cmpfb').innerHTML=`<div class="cmp-say" style="border-color:#34c25a">✅ أحسنتِ! ${qb?'القبلة':b2(a,b)} في <b>${ans}</b>${qb?' من '+a:''}.</div><button class="btn" id="nq">التالي ▶</button>`;$('#nq').onclick=()=>{S.qi++;q3()}}else{first=false;b.classList.add('bad');bad(b);$('#cmpfb').innerHTML=`<div class="cmp-say">💡 انظري: هل ${qb?'مكة':b} فوق ${a} أم تحتها؟ على اليمين أم اليسار؟ (الشمال فوق، والشرق يمين)</div>`}})}
function b2(a,b){return `${b} تقع`}
/* ---------- المرحلة ٤: أنشطة الكتاب (نشاط ١ ص٦٩، نشاط ٢ ص٧١) ---------- */
function st4(){S.p4=S.pre?0:S.p4||0;S.pre=0;if(S.p4===0)return a1();if(S.p4===1)return st4a();if(S.p4===2)return st4b();return done()}
function a1(){app.innerHTML=`${head()}<div class="card"><h3 style="margin:0 0 4px">4️⃣ أنشطة الكتاب 🏆 <small class="muted">نشاط ١ · ص٦٩</small></h3>
 <div class="cmp-say"><b>يكتب الطلبة مثالًا واحدًا للأجهزة الحديثة المستعملة في تحديد الموقع.</b></div>
 <p class="muted" style="margin:2px 0">تلميح: انظري إلى الصورة في صفحة ٦٩: ماذا يمسك الشخص في يده ويرى فيه الخريطة؟</p>
 <input id="a1" type="text" placeholder="اكتبي هنا ..." style="width:100%;box-sizing:border-box;font:inherit;font-size:1.1rem;padding:10px;border:3px dotted #888;border-radius:12px;margin:6px 0"><div class="center"><button class="btn" id="a1ok">تحقق ✔</button></div><div id="cmpfb"></div></div>`;css();
 $('#a1ok').onclick=()=>{const v=$('#a1').value.trim();if(v.length<2){bad($('#a1'));$('#cmpfb').innerHTML='<div class="cmp-say">اكتبي كلمة أو كلمتين أولًا ✍️</div>';return}good();point(1,true);$('#a1ok').style.display='none';$('#cmpfb').innerHTML=`<div class="cmp-say" style="border-color:#34c25a">✅ أحسنتِ! كتبتِ: «${esc(v)}». ومن الأمثلة: الهاتف الجوال (الذي في الصورة)، وجهاز تحديد المواقع.</div><button class="btn" id="nq">التالي ▶</button>`;$('#nq').onclick=()=>{S.p4=1;st4()}}}
function esc(t){return String(t).replace(/[&<>"]/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;'}[c]))}
function st4a(){S.ai=0;S.q4=[['👦','أحمد','تركتُ الشمس في الصباح ورائي، واتجهتُ إلى مدرستي.','غرب','الشمس تشرق من الشرق وهي وراءه، فوجهه إلى الغرب.'],['👧','نورة','اتجهتُ يسارًا؛ لأركب السيارة، والشمس أمامي صباحًا.','شمال','الشمس في الشرق وهي أمامها، فالشمال عن يسارها.']];qa()}
function qa(){if(S.ai>=S.q4.length){S.p4=2;return st4()}const [em,who,txt,ans,ex]=S.q4[S.ai];let first=true,sel=null;
 app.innerHTML=`${head()}<div class="card"><h3 style="margin:0 0 4px">4️⃣ أنشطة الكتاب 🏆 <small class="muted">نشاط ٢ (أ) · ص٧١</small></h3>
 <div class="muted" style="font-size:.85rem">يقرأ الطلبة ما يقوله أحمد، وتقوله نورة، ثم يحدّدون اتجاهيهما:</div>
 <div class="cmp-say"><div style="font-size:2.4rem">${em}</div><b>${who}:</b> «${txt}»</div><p style="margin:4px 0"><b>اتجاه${who==='نورة'?'ها':'ه'} هو:</b></p>
 <div style="display:grid;grid-template-columns:1fr 1fr;gap:6px;max-width:320px">${['شمال','جنوب','شرق','غرب'].map(o=>`<label class="cmp-chip" style="display:flex;align-items:center;gap:8px;cursor:pointer;margin:0"><input type="radio" name="r" value="${o}" style="width:22px;height:22px">${o}</label>`).join('')}</div>
 <div class="center" style="margin-top:8px"><button class="btn" id="ck">تحقق ✔</button></div><div id="cmpfb"></div></div>`;css();
 $('#ck').onclick=()=>{const r=document.querySelector('input[name=r]:checked');if(!r){$('#cmpfb').innerHTML='<div class="cmp-say">اختاري إجابة أولًا ○</div>';return}
  if(r.value===ans){good();point(1,first);$('#ck').style.display='none';$$('input[name=r]').forEach(x=>x.disabled=true);$('#cmpfb').innerHTML=`<div class="cmp-say" style="border-color:#34c25a">✅ ${ex}</div><button class="btn" id="nq">التالي ▶</button>`;$('#nq').onclick=()=>{S.ai++;qa()}}else{first=false;bad($('#ck'));$('#cmpfb').innerHTML='<div class="cmp-say">💡 تذكّري: الشمس صباحًا في الشرق. إذا كانت أمامك فالغرب خلفك والشمال عن يسارك. جرّبي مرة ثانية.</div>'}}}
function st4b(){S.bi=0;S.bq=[['أ','البنك','🏦','هـ','٦'],['ب','الفندق','🏨','ج','٣'],['ج','مواقف السيارات','🅿️','ب','١'],['د','المستشفى','🏥','ج','٥']];S.bdone=[];qb2()}
const AD={'٠':0,'١':1,'٢':2,'٣':3,'٤':4,'٥':5,'٦':6,'0':0,'1':1,'2':2,'3':3,'4':4,'5':5,'6':6};
function qb2(){if(S.bi>=S.bq.length){S.p4=3;return st4()}const [lt,nmq,ic,row,col]=S.bq[S.bi];let first=true,val='';const rows=['أ','ب','ج','د','هـ'],ar=['١','٢','٣','٤','٥','٦'];
 const cw=70,ch=58,X0=10,Y0=40;let sv=`<svg viewBox="0 0 480 340" style="width:100%;max-width:480px;display:block;margin:auto;direction:ltr;background:#f2f2f2;border-radius:12px">`;
 sv+=`<rect x="${X0+cw*1}" y="${Y0}" width="${cw*5}" height="${ch}" fill="#666"/><rect x="${X0+cw*4}" y="${Y0}" width="${cw}" height="${ch*3}" fill="#666"/><rect x="${X0}" y="${Y0+ch*3}" width="${cw*6}" height="${ch}" fill="#666"/>`;
 for(let c=0;c<6;c++)sv+=`<text x="${X0+c*cw+cw/2}" y="28" text-anchor="middle" font-size="22" font-weight="800">${ar[5-c]}</text>`;
 for(let r=0;r<5;r++)sv+=`<text x="${X0+cw*6+14}" y="${Y0+r*ch+ch/2+8}" font-size="22" font-weight="800">${rows[r]}</text>`;
 const B={'ج٥':'🏥','ج٣':'🏨','ب١':'🅿️','هـ٦':'🏦'},BN={'ج٥':'مستشفى','ج٣':'فندق','ب١':'مواقف','هـ٦':'بنك'};
 for(let r=0;r<5;r++)for(let c=0;c<6;c++){const key=rows[r]+ar[5-c];sv+=`<rect x="${X0+c*cw}" y="${Y0+r*ch}" width="${cw}" height="${ch}" fill="none" stroke="#999" stroke-width="1.5"/>${B[key]?`<text x="${X0+c*cw+cw/2}" y="${Y0+r*ch+ch/2+4}" text-anchor="middle" font-size="28">${B[key]}</text><text x="${X0+c*cw+cw/2}" y="${Y0+r*ch+ch-6}" text-anchor="middle" font-size="12" font-weight="800" fill="#fff" stroke="#444" stroke-width="3" paint-order="stroke">${BN[key]}</text>`:''}`}
 sv+='</svg>';
 const keys=rows.concat(ar);
 app.innerHTML=`${head()}<div class="card"><h3 style="margin:0 0 4px">4️⃣ أنشطة الكتاب 🏆 <small class="muted">نشاط ٢ (ب) · ص٧١ · ${S.bi+1} من ${S.bq.length}</small></h3>
 <div class="cmp-say"><b>يحدّد الطلبة المواقع الآتية:</b> (الحرف للصف الأفقي، والرقم للعمود)</div>${sv}
 <div style="margin:8px 0"><b>${lt}- ${nmq} ${ic}</b> <span id="bv" style="display:inline-block;min-width:90px;border-bottom:3px dotted #666;text-align:center;font-weight:800;font-size:1.3rem;margin-right:8px">&nbsp;</span></div>
 <div class="center">${keys.map(k=>`<button class="cmp-chip kp" data-k="${k}" style="min-width:44px">${k}</button>`).join('')}<button class="cmp-chip kc" style="background:#ffd6d6">⌫</button></div>
 <div class="center" style="margin-top:6px"><button class="btn" id="ck">تحقق ✔</button></div><div id="cmpfb"></div></div>`;css();
 let L='',Dg='';const up=()=>{val=L+Dg;$('#bv').textContent=val||'\u00a0'};$$('.kp').forEach(b=>b.onclick=()=>{const k=b.dataset.k;if(rows.indexOf(k)>=0)L=k;else Dg=k;up()});
 $('.kc').onclick=()=>{val='';$('#bv').textContent=' '};
 $('#ck').onclick=()=>{if(val===row+col){good();point(1,first);S.bdone.push(row+col);$('#ck').style.display='none';$$('.kp,.kc').forEach(x=>x.style.pointerEvents='none');$('#cmpfb').innerHTML=`<div class="cmp-say" style="border-color:#34c25a">✅ ${nmq}: <b>${val}</b></div><button class="btn" id="nq">التالي ▶</button>`;$('#nq').onclick=()=>{S.bi++;qb2()}}else{first=false;bad($('#ck'));$('#cmpfb').innerHTML='<div class="cmp-say">💡 ابحثي عن الرمز: الحرف من الجانب والرقم من الأعلى، ثم اكتبيهما معًا (مثل: ج٣). جرّبي مرة ثانية.</div>'}}}
/* ---------- ورقة التسليم ---------- */
async function done(){setMas('hide');const st=stars(S.pts,S.max),rec={t:'res',p:P,name:NAMES[P],game:'compass',label:'بوصلة نادين (الاجتماعيات)',score:S.pts,max:S.max,stars:st};
 const hist=LS.get('hist',[]);hist.push(rec);LS.set('hist',hist.slice(-60));LS.set('stars',LS.get('stars',0)+st);LS.set('cmpdone',(LS.get('cmpdone',0))+1);bus.send(rec);
 sfx('win');confetti(60);const d=new Date().toLocaleDateString('ar-SA');
 app.innerHTML=`${topbar()}<div class="cmp-sheet"><div class="center"><h2 style="margin:0;color:#1aa6b7">🧭 بوصلة نادين</h2><div class="muted">مهمة أدائية · الاجتماعيات · الصف الرابع / ٢</div></div>
 <div class="cmp-say"><div>الطالبة: <b>نادين الشمراني</b></div><div>المعلمة: <b>منيرة القحطاني</b></div><div>الدرس: العاشر «الموقع» (ص٦٩–٧١)</div><div>التاريخ: ${d}</div></div>
 <ul><li>✅ عرفتُ أن الشمس تشرق من الشرق، فالغرب خلفي والشمال عن يساري والجنوب عن يميني.</li><li>✅ ركّبتُ البوصلة: الجهات الأصلية الأربع والفرعية الأربع.</li><li>✅ حدّدتُ اتجاه المدن على خريطة المملكة، واتجاه القبلة نحو مكة المكرمة.</li><li>✅ أنجزتُ نشاط ١ (ص٦٩) ونشاط ٢ (ص٧١): اتجاه أحمد ونورة، وأماكن البنك والفندق والمواقف والمستشفى.</li></ul>
 <div class="center" style="font-size:1.6rem">${starRow(st,3,34)}</div><div class="center"><b>نتيجتي: ${S.pts} من ${S.max}</b></div><div class="center muted" style="margin-top:6px">ركّزتُ فوصلتُ، والحمد لله ثم توفيقه 💗</div></div>
 <div class="cmp-np center" style="margin:10px 0"><button class="btn" id="pr">🖨️ اطبعي أو احفظي PDF</button> <button class="btn ghost" id="ag">العبي مرة ثانية</button> <button class="btn ghost" id="hh">الرئيسية</button><p class="muted">أو صوّري الشاشة وأرسليها للأبلة 📸</p></div>`;
 $('#pr').onclick=()=>window.print();$('#ag').onclick=()=>GAMES.compass.start();$('#hh').onclick=home;bindTop()}
function stage(){window.scrollTo(0,0);[st1,st2,st3,st4][S.st]()}
window.GAMES.compass={start(){css();S.st=0;S.pts=0;S.max=0;S.pre=0;S.p4=0;S.placed={};S.tries={};stage();bindTop()}};
if(window.AUTOSTART_COMPASS||/[?&]go=compass/.test(location.search))setTimeout(()=>GAMES.compass.start(),80);
})();
