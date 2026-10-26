/* أصوات الحيوانات: استمعي ثم العبي «مَن صاحب الصوت؟» */
(()=>{
const S=window.SCI,{$,$$}=S;
const A=[['lion','🦁','الأسد'],['cat','🐱','القطة'],['cow','🐄','البقرة'],['sheep','🐑','الخروف'],['horse','🐴','الحصان'],['wolf','🐺','الذئب'],['owl','🦉','البومة'],['sparrow','🐦','العصفور'],['dove','🕊️','الحمامة'],['hen','🐔','الدجاجة'],['frog','🐸','الضفدع'],['elephant','🐘','الفيل'],['dolphin','🐬','الدلفين'],['whale','🐋','الحوت']];
let cur=null;const play=k=>{try{if(cur)cur.pause();cur=new Audio('sfx/an_'+k+'.mp3');cur.volume=.9;const p=cur.play();if(p&&p.catch)p.catch(()=>{})}catch(e){}};
const fx=n=>{try{const a=new Audio('sfx/'+n+'.mp3');a.volume=.6;a.play().catch(()=>{})}catch(e){}};
S.routes.sounds=()=>{let mode='listen',sc=0,n=0,ans=null,done=false;
 const draw=()=>{
  if(mode==='listen'){S.page(`<div class="crumb"><button class="tbtn" onclick="location.hash='home'">↩ الرئيسية</button><span class="pill">🔊 أصوات الحيوانات</span></div>
  <div class="ctl"><button class="btn gold" data-mode="quiz">🎮 العبي: مَن صاحب الصوت؟</button></div>
  <div class="chg">${A.map(a=>`<button class="chc" data-p="${a[0]}" style="background:#fff7e0"><span style="font-size:2.6rem">${a[1]}</span><span><b>${a[2]}</b><small>🔊 اضغطي لتسمعي</small></span></button>`).join('')}</div>`);
   $$('[data-p]').forEach(b=>b.onclick=()=>play(b.dataset.p));$('[data-mode]').onclick=()=>{mode='quiz';sc=0;n=0;next()}}
  else{const t=ans;const opts=t.o;
   S.page(`<div class="crumb"><button class="tbtn" id="bk">↩ الأصوات</button><span class="pill">النقاط: ${sc} / ${n}</span></div>
   <section class="card center"><h2>مَن صاحب هذا الصوت؟</h2><button class="btn gold" id="rp" style="font-size:1.6rem">🔊 اسمعي الصوت</button>
   <div style="display:grid;grid-template-columns:1fr 1fr;gap:10px;margin:14px 0">${opts.map(o=>`<button class="btn ghost" data-o="${o}" style="font-size:1.4rem"><span style="font-size:2rem">${A[o][1]}</span> ${A[o][2]}</button>`).join('')}</div>
   ${done?'<button class="btn" id="nx">السؤال التالي ←</button>':''}</section>`);
   $('#bk').onclick=()=>{mode='listen';draw()};$('#rp').onclick=()=>play(A[t.k][0]);
   $$('[data-o]').forEach(b=>b.onclick=()=>{if(done)return;done=true;n++;const ok=+b.dataset.o===t.k;if(ok){sc++;fx('correct');setTimeout(()=>fx('clap'),350)}else fx('wrong');draw();$$('[data-o]').forEach(x=>{if(+x.dataset.o===t.k)x.style.background='#34c25a';else if(x===b&&!ok)x.style.background='#ff7a6a'})
    ;const nx=$('#nx');if(nx)nx.onclick=next})}};
 const next=()=>{done=false;const k=Math.floor(Math.random()*A.length);const o=[k];while(o.length<4){const r=Math.floor(Math.random()*A.length);if(o.indexOf(r)<0)o.push(r)}o.sort(()=>Math.random()-.5);ans={k,o};draw();play(A[k][0])};
 draw()};
})();
