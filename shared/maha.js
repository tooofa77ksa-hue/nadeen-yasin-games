(()=>{
const {bus,LS,NAMES,esc,avatar,confetti,QD,$,$$,toast}=window.NYG;
const app=$('#app');
let res=LS.get('results',[]);const seen=new Set(LS.get('seen',[]));
const GN={planet:'',alien:'الهروب من وحش الأخطاء',million:'من سيربح المليون',cw:'المتقاطعة',exam:'اختبار وزاري',comp:'فهم المقروء'};
function add(m){if(m._id){if(seen.has(m._id))return;seen.add(m._id);LS.set('seen',[...seen].slice(-300))}
 if(m.t!=='res')return;res.push(m);res=res.slice(-200);LS.set('results',res)}
const last=p=>res.filter(r=>r.p===p).slice(-1)[0];
function best(p){const a=res.filter(r=>r.p===p);return a.length?a.reduce((s,r)=>s+r.score,0):0}
function render(){
 const n=last('nadeen'),y=last('yasin');const ns=res.filter(r=>r.p==='nadeen'),ys=res.filter(r=>r.p==='yasin');
 const tn=ns.reduce((s,r)=>s+r.score,0),ty=ys.reduce((s,r)=>s+r.score,0);
 const first=tn===ty?null:(tn>ty?'nadeen':'yasin');
 const row=(p)=>{const a=res.filter(r=>r.p===p);const t=a.reduce((s,r)=>s+r.score,0),mx=a.reduce((s,r)=>s+r.max,0),st=a.reduce((s,r)=>s+r.stars,0);return `<tr><td>${avatarMini(p)} <b>${NAMES[p]}</b> ${first===p?'<span class="badge b1">الأولى 🥇</span>':first?'<span class="badge b2">الثاني 🥈</span>':''}</td><td>${a.length}</td><td>${t}${mx?' من '+mx:''}</td><td>${st} ⭐</td></tr>`};
 app.innerHTML=`<div class="top"><div class="who">${avatar(40,'nadeen')}${avatar(40,'yasin')}<div><h3 style="margin:0">لوحة المعلمة مها</h3><div class="muted" style="font-size:.85rem">مركز رؤيا وإبداع</div></div></div><span class="chip"><span class="live ${bus.status==='on'?'':'off'}"></span>${bus.status==='on'?'متصل':'غير متصل'}</span></div>
 <div class="card" style="border:4px solid #ff8a3d;background:#fff6ee"><h3 style="margin:0 0 4px">📄 بطاقة نادين</h3><p class="muted" style="margin:0 0 8px">لغتي والعلوم والإنجليزي وألعاب نادين وياسين في بطاقة واحدة، وكل زر يفتح الموقع.</p><a class="btn" style="background:#ff8a3d;text-decoration:none" href="../docs/nadeen_card_maha.pdf" target="_blank">افتحي البطاقة PDF ▶</a></div>
 <div class="card"><h2>الترتيب الآن</h2><table class="t"><tr><th>الطالب</th><th>الجولات</th><th>مجموع الدرجات</th><th>النجوم</th></tr>${row('nadeen')}${row('yasin')}</table>
 <p class="muted">${first?`${NAMES[first]} في المقدمة بفارق ${Math.abs(tn-ty)} درجة، لكن كلاهما فائز في التعلّم 🌟`:'متعادلان حتى الآن!'}</p></div>
 <div class="card"><h3>آخر النتائج</h3>${res.length?`<table class="t">${res.slice(-12).reverse().map(r=>`<tr><td>${esc(r.name||NAMES[r.p])}</td><td>${esc(r.label)}</td><td>${r.score}/${r.max}</td><td>${'⭐'.repeat(r.stars)||'—'}</td><td class="muted">${new Date(r.at).toLocaleTimeString('ar',{hour:'2-digit',minute:'2-digit'})}</td></tr>`).join('')}</table>`:'<p class="muted">لم تصل نتائج بعد. عندما يلعب نادين وياسين تظهر هنا مباشرة.</p>'}</div>
 <div class="card"><h3>إعادة لعبة أو تحدّي</h3><p class="muted">اختاري الطالب واللعبة؛ تظهر لهم رسالة في صفحتهم.</p>
 <div style="display:flex;gap:8px;flex-wrap:wrap"><select id="to" class="chip" style="font:inherit;color:#111"><option value="both">الاثنان</option><option value="nadeen">نادين</option><option value="yasin">ياسين</option></select>
 <select id="gm" class="chip" style="font:inherit;color:#111">${[['wheel','عجلة التحدّي'],['million','من سيربح المليون'],['alien','الهروب من وحش الأخطاء'],['cw','المتقاطعة'],['exam','اختبار وزاري'],['comp','فهم المقروء'],['planet:antonym','الأضداد'],['planet:synonym',' المرادفات'],['planet:irab',' الإعراب']].map(g=>`<option value="${g[0]}">${g[1]}</option>`).join('')}</select>
 <button class="btn" id="asg">إرسال 📣</button></div></div>
 <div class="card"><h3>الشهادات</h3><p class="muted">شهادة لكل واحد منهما، والاثنان فائزان 🎉</p><button class="btn gold" id="cert">طباعة شهادة نادين وياسين</button> <button class="btn" id="rep">طباعة تقرير الدرجات</button></div>
 <div class="card"><h3>روابط الطالبين</h3><p class="muted">أرسلي لكل طالب رابطه فقط.</p><p>نادين: <span dir="ltr">${BASE}nadeen/</span> <button class="btn cp1" data-u="${BASE}nadeen/">نسخ</button></p><p>ياسين: <span dir="ltr">${BASE}yasin/</span> <button class="btn cp1" data-u="${BASE}yasin/">نسخ</button></p></div>
 <div class="card"><h3>إذا ما وصلت النتائج تلقائيًا</h3><p class="muted">ألصقي رسالة الواتساب هنا (مثل: نتيجة نادين في «...»: ٧ من ١٠).</p><textarea id="paste" rows="3"></textarea><br><br><button class="btn ghost" id="addp">إضافة النتيجة</button></div>
 <details class="card" style="cursor:pointer"><summary><b>📖 دليل الاستخدام للمعلمة مها</b></summary><div style="margin-top:8px">${['افتحي هذه الصفحة وأبقيها مفتوحة أثناء لعب نادين وياسين؛ كلمة «متصل» في الأعلى تعني أن الاستقبال يعمل.','كل جولة ينهيانها تظهر في «آخر النتائج» ويتحدّث «الترتيب» مباشرة.','لإعادة لعبة: اختاري الطالب واللعبة من «إعادة لعبة أو تحدّي» واضغطي إرسال؛ تظهر لهما رسالة في صفحتهما ويبدآن منها.','الشهادات: اضغطي «طباعة شهادة»، وللدرجات اضغطي «طباعة تقرير الدرجات» (ويمكنكِ الحفظ كملف PDF من نافذة الطباعة)، ثم اختاري الطابعة من نافذة الطباعة. تخرج صفحتان، لكل واحد منهما شهادة، وكلاهما فائز.','إذا لم تصل نتيجة تلقائيًا: ألصقي رسالة الواتساب التي يرسلها الطالب في الخانة السفلى واضغطي «إضافة النتيجة».','تُحفظ النتائج على هذا الجهاز؛ وإذا فتحتِ الصفحة على جهاز آخر فتظهر فقط النتائج التي وصلت خلال آخر ٢٤ ساعة.','أرسلي لكل طالب رابطه الخاص فقط، ولا ترسلي رابط صفحتك لأحد.'].map(t=>`<div class="clue"><b>•</b><span>${t}</span></div>`).join('')}</div></details>
 <div class="cert-print">${certHtml('nadeen')}${certHtml('yasin')}</div>${repHtml()}`;
 $('#asg').onclick=async()=>{const to=$('#to').value,g=$('#gm').value,label=$('#gm').selectedOptions[0].textContent;const ok=await bus.send({t:'assign',to,game:g,label});toast(ok?'أُرسلت الرسالة ✓':'تعذّر الإرسال الآن')};
 $('#cert').onclick=()=>doPrint('cert');$('#rep').onclick=()=>doPrint('rep');
 $$('.cp1').forEach(b=>b.onclick=async()=>{try{await navigator.clipboard.writeText(b.dataset.u);toast('نُسخ الرابط ✓')}catch(e){prompt('انسخي الرابط:',b.dataset.u)}});
 $('#addp').onclick=()=>{const t=$('#paste').value;const m=t.match(/نتيجة\s+(\S+)\s+في\s+«(.+?)»:\s*([\d٠-٩]+)\s*من\s*([\d٠-٩]+)/);if(!m)return toast('ما فهمت الرسالة');const d=s=>+s.replace(/[٠-٩]/g,c=>'٠١٢٣٤٥٦٧٨٩'.indexOf(c));const p=m[1].startsWith('نادين')?'nadeen':m[1].startsWith('ياسين')?'yasin':null;if(!p)return toast('الاسم غير معروف');add({t:'res',p,name:NAMES[p],label:m[2],score:d(m[3]),max:d(m[4]),stars:(t.match(/⭐/g)||[]).length,at:Date.now()});render()};
}
const BASE='https://tooofa77ksa-hue.github.io/nadeen-yasin-games/';
function doPrint(mode){document.body.classList.add('pr-'+mode);const done=()=>{document.body.classList.remove('pr-'+mode);window.removeEventListener('afterprint',done)};window.addEventListener('afterprint',done);setTimeout(()=>window.print(),60)}
const GNAME=l=>esc(l||'');
function repHtml(){const IM='../shared/img/';const sum=p=>{const a=res.filter(r=>r.p===p);return {n:a.length,t:a.reduce((s,r)=>s+r.score,0),mx:a.reduce((s,r)=>s+r.max,0),st:a.reduce((s,r)=>s+r.stars,0)}};const n=sum('nadeen'),y=sum('yasin');
 const box=(p,s,c,nm)=>`<div class="box ${c}"><h2>${nm}</h2><div class="big">${s.t}${s.mx?' من '+s.mx:''}</div><div>الجولات: ${s.n} · النجوم: ${s.st} <img class="st" src="${IM}star.webp" alt=""></div></div>`;
 const last=res.slice(-10).reverse();
 return `<div class="rep-print"><div class="rep"><div class="sheet"><h1>تقرير تحدّيات اللغة العربية</h1><div class="sub">مركز رؤيا وإبداع · المعلمة مها · ${new Date().toLocaleDateString('ar-SA')}</div>
 <div class="row2">${box('nadeen',n,'b-n','نادين')}${box('yasin',y,'b-y','ياسين')}</div>
 <table><tr><th>الطالب</th><th>اللعبة</th><th>الدرجة</th><th>النجوم</th></tr>${last.length?last.map(r=>`<tr><td>${esc(r.name||NAMES[r.p])}</td><td>${esc(r.label)}</td><td>${r.score} / ${r.max}</td><td>${Array.from({length:r.stars},()=>`<img class="st" src="${IM}star.webp" alt="">`).join('')||'—'}</td></tr>`).join(''):'<tr><td colspan="4">لا توجد نتائج بعد</td></tr>'}</table>
 <img class="av" src="${IM}nadeen_happy.webp" alt=""></div></div></div>`}
function avatarMini(p){return avatar(22,p)}
function certHtml(p){const f=p==='nadeen';const IM='../shared/img/';return `<div class="cert"><div class="paper"><img class="cs cs1" src="${IM}${p}_happy.webp" alt=""><img class="cs cs2" src="${IM}trophy.webp" alt=""><img class="cs cs3" src="${IM}star.webp" alt=""><img class="cs cs4" src="${IM}medal.webp" alt=""><h1>شهادة تفوّق</h1><p>تتشرّف المعلمة <b>مها</b> بمركز <b>رؤيا وإبداع</b> بمنح</p><div class="nm">${f?'الطالبة نادين':'الطالب ياسين'}</div><p>هذه الشهادة تقديرًا لاجتهاد${f?'ها':'ه'} ومشاركت${f?'ها':'ه'} المتميّزة في تحدّيات اللغة العربية للصف الرابع، ولقب${f?'ها':'ه'}: <b>${f?'بطلة':'بطل'} التحدّي</b></p><div class="sig"><span>التاريخ: ${new Date().toLocaleDateString('ar-SA')}</span><span>المعلمة مها · مركز رؤيا وإبداع</span></div></div></div>`}
render();
bus.listen(m=>{if(m._s){render();return}add(m);render()},'24h');
})();
