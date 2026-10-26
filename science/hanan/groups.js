/* طالبات الفصل: مَن تجيب؟ وتوزيع الفرق */
(()=>{
const S=window.SCI,{$,$$,ar,shuf,LS}=S;
const DEF={'رابع 1':['ألين بدير','تالا المستادي','ترف السلمي','حور الجغثمي','ردينا الصريمي','رغد الخطابي','رواسن المغربي','روز صيرفي','ريم الخطابي','ريما الشهري','ساره الحربي','سمر العمودي','غزل اليعقوبي','فجر الذبياني','قمر','لانا العميري','لينا الرشيدي','ماريا الشمراني','مريم بادنجكي','وجد خرمي'],
'رابع 2':['أرام عسيري','أسيل وداد','تالا الشمراني','تالا القريقري','تيلا أبو صالح','جميلة السميري','جنى الشريف','حلا الغامدي','دانه اليوبي','روز الحمراني','ريتاج عواجي','ريما بن خميس','شدن الخرماني','شذى يونس','علا زهران','علويه الحداد','غني العوفي','لارين الشمري','لانا آل شبيب','لجين الحانطي','لميس اليوبي','لين بازهير','ماريا الحربي','مريم باشماخ','مشاعل ثابت','ميار الجهني','ندى السهلي','هديل الفارسي','ورد الزهراني']};
let names=LS.get('names',null)||JSON.parse(JSON.stringify(DEF));let cls=LS.get('cls','رابع 1');const LBL={'رابع 1':'4/1','رابع 2':'4/2'};
const save=()=>LS.set('names',names);
const SU='https://tooofa77ksa-hue.github.io/nadeen-yasin-games/science/student/';
S.routes.groups=()=>{const list=names[cls]||[];
 S.page(`<div class="crumb"><button class="tbtn" onclick="location.hash='home'">↩ الرئيسية</button><span class="pill">👭 طالبات الصف الرابع</span></div>
 <div class="tabs">${Object.keys(names).map(c=>`<button data-c="${c}" class="${c===cls?'on':''}">الفصل ${LBL[c]||c} (${names[c].length})</button>`).join('')}</div>
 ${S.teamsBar()}
 <section class="card center"><h2>🎯 مَن تجيب؟</h2><p class="muted" style="margin:0">تُختار طالبة، ويظهر لها سؤال من الكتاب. الصحيحة بنقطة وتصفيق لفريقها.</p><div class="q-big" id="who" style="font:400 2.6rem Lalezar;min-height:90px">؟</div><button class="btn gold" id="go">▶ اختاري طالبة</button> <label class="muted"><input type="checkbox" id="nr" checked> بدون تكرار</label><div id="qa"></div></section>
 <section class="card"><h3>🔗 روابط الطالبات (لوحة الأسئلة فقط)</h3><p class="muted"><b>الروابط موجودة تحت هنا:</b> اضغطي زر «نسخ» بجانب كل مجموعة وأرسلي رابطها (واتساب أو غيره)، وتفتحه المجموعة على جهازها (آيباد أو جوال). أرسلي لكل مجموعة رابطها. يفتح لها الأسئلة بأربع إجابات فقط، بدون أي تحكم في الموقع أو الأسماء، وتظهر نتيجتها في «لوحة المسابقة» على شاشتكِ مع الفائزة والكأس. رابط المجموعة لا يطلب أسماء: تلعب المجموعة كلها معًا. ومن لوحة المسابقة تختارين نوع الأسئلة وترسلينها فتظهر عند المجموعات في الحال. وللإجابة الفردية افتحي لوحة المسابقة واضغطي «اختاري طالبة»: تدور الأسماء ثم تقف عند اسمٍ وتظهر له أسئلة. <a href="../board/index.html">افتحي لوحة المسابقة</a></p>${['1','2'].map(c=>['المخترعات 🔬','نجمات الفضاء 🚀','العالِمات 🧪','المستكشفات 🌿'].map((g,i)=>`<p style="margin:6px 0"><b>الصف 4/${c} · ${g}</b><br><small dir="ltr" style="word-break:break-all">${SU}?g=r${c}-${i+1}</small> <button class="btn ghost cpl" data-u="${SU}?g=r${c}-${i+1}" style="min-height:34px;padding:2px 12px">نسخ</button></p>`).join('')).join('')}</section>
 <section class="card"><h3>👭 توزيع الطالبات على الفرق الأربعة</h3><button class="btn" id="dv">🔀 وزّعي عشوائيًّا</button><div id="tm" class="board" style="margin-top:10px"></div></section>
 <section class="card"><h3>✏ أسماء الفصل ${LBL[cls]||cls}</h3><div class="need" id="nl">${list.map((n,i)=>`<span>${n} <button data-d="${i}" style="border:0;background:none;cursor:pointer;font-weight:800" aria-label="حذف">×</button></span>`).join('')}</div>
 <div class="ctl"><input id="nn" placeholder="اسم جديد" style="flex:1;font:800 1rem Tajawal;border:3px solid var(--ink);border-radius:12px;padding:6px 10px"><button class="btn" id="na">إضافة</button><button class="btn ghost" id="rs">استرجاع القائمة الأصلية</button></div></section>`);
 $$('.cpl').forEach(b=>b.onclick=()=>{const u=b.dataset.u;try{navigator.clipboard.writeText(u).then(()=>{b.textContent='✓ نُسخ'},()=>{prompt('انسخي الرابط:',u)})}catch(e){prompt('انسخي الرابط:',u)}});
 $$('[data-c]').forEach(b=>b.onclick=()=>{cls=b.dataset.c;LS.set('cls',cls);S.routes.groups()});
 let used=[];const who=$('#who');
 const Q=(window.QD&&window.QD.Q||[]).filter(q=>q.kind==='facts'||q.kind==='tf'||q.kind==='vocab'||q.kind==='classify');
 const ask=name=>{const q=Q[Math.random()*Q.length|0];if(!q){return}let o=q.o.map((t,k)=>({t,k}));if(q.o.length>2&&q.kind!=='tf')o=shuf(o);
  $('#qa').innerHTML=`<div class="itemc" style="max-width:640px;text-align:right"><p class="muted" style="margin:0">سؤال لـ ${name} · الدور على ${S.teams.list[S.teams.turn].n}</p><div class="q-big" style="margin:4px 0">${q.q}</div><div class="opts">${o.map(x=>`<button class="opt" data-k="${x.k}">${x.t}</button>`).join('')}</div><div class="fb"></div></div>`;
  let done=false;$$('#qa .opt').forEach(b=>b.onclick=()=>{if(done)return;done=true;S.sfx.pop();const ok=+b.dataset.k===q.a;$$('#qa .opt').forEach(x=>{if(+x.dataset.k===q.a)x.classList.add('ok');else if(x===b)x.classList.add('no');else x.classList.add('dim')});
   if(ok){S.teams.award(1);S.sfx.yes();S.confetti(40)}else S.sfx.no();
   $('#qa .fb').innerHTML=`<div class="why">${ok?'👏 أحسنتِ! نقطة لفريقكِ. ':'❌ الإجابة الصحيحة: <b>'+q.o[q.a]+'</b>. '}${q.w||''}</div>`;S.teams.next()})};
 $('#go').onclick=()=>{let pool=list.filter(n=>!$('#nr').checked||!used.includes(n));if(!pool.length){used=[];pool=list}if(!pool.length)return;const pick=pool[Math.random()*pool.length|0];let k=0;const btn=$('#go');btn.disabled=true;$('#qa').innerHTML='';
  const iv=setInterval(()=>{who.textContent=list[Math.random()*list.length|0];S.sfx.tick();if(++k>22){clearInterval(iv);who.textContent=pick;used.push(pick);btn.disabled=false;S.sfx.star();S.confetti(30);ask(pick)}},70+k*4)};
 $('#dv').onclick=()=>{const sh=shuf(list);const t=[[],[],[],[]];sh.forEach((n,i)=>t[i%4].push(n));$('#tm').innerHTML=t.map((m,i)=>`<div class="bin" style="cursor:default;font:700 1rem Tajawal;text-align:right"><b style="font:400 1.3rem Lalezar">${S.teams.list[i].n}</b><br>${m.join('<br>')}</div>`).join('')};
 $$('[data-d]').forEach(b=>b.onclick=()=>{names[cls].splice(+b.dataset.d,1);save();S.routes.groups()});
 $('#na').onclick=()=>{const v=$('#nn').value.trim();if(v){names[cls].push(v);save();S.routes.groups()}};
 $('#rs').onclick=()=>{if(confirm('استرجاع القائمة الأصلية لهذا الفصل؟')){names[cls]=[...DEF[cls]];save();S.routes.groups()}};
};
})();
