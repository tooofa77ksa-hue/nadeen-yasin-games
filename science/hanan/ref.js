/* مرجعيات الكتاب: المقدمة (الطريقة العلمية، المهارات، السلامة) وأجهزة الجسم والغذاء والبيانات والمصطلحات */
(()=>{
const S=window.SCI,{$,$$,ar}=S;
const all=()=>[...(window.REF_INTRO||[]),...(window.REF_STU||[])];
S.routes.ref=id=>{const A=all();const sec=A.find(x=>x.id===id);
 if(!sec){S.page(`<div class="crumb"><button class="tbtn" onclick="location.hash='home'">↩ الرئيسية</button></div><h2>📖 مرجعيات الكتاب</h2><p class="muted">كل ما في مقدمة الكتاب وملحقه، بأرقام الصفحات.</p>
  ${A.length?`<div class="chg">${A.map(x=>`<button class="chc" style="background:#3d7bff" data-go="ref/${x.id}"><img src="img/${x.img||'microscope'}.webp" alt=""><span><small>ص${ar(x.pg||'')}</small><b>${x.t}</b></span></button>`).join('')}</div>`:'<div class="card center"><p>جارٍ تجهيز هذه الأقسام.</p></div>'}`);
  $$('[data-go]').forEach(b=>b.onclick=()=>{location.hash=b.dataset.go});return}
 S.page(`<div class="crumb"><button class="tbtn" onclick="location.hash='ref'">↩ المرجعيات</button><span class="pill">ص${sec.pg||''}</span></div><h2>${sec.t}</h2>${S.figHTML(S.figsFor(sec.pg))}${S.bookHTML(sec.blocks)}`);
 $$('.bk').forEach(b=>b.onclick=()=>{const e=$('#ba'+b.dataset.a);e.hidden=!e.hidden})};
})();
