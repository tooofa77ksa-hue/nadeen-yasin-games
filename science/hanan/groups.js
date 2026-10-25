/* طالبات الفصل: مَن تجيب؟ وتوزيع الفرق */
(()=>{
const S=window.SCI,{$,$$,ar,shuf,LS}=S;
const DEF={'رابع 1':['ألين بدير','تالا المستادي','ترف السلمي','حور الجغثمي','ردينا الصريمي','رغد الخطابي','رواسن المغربي','روز صيرفي','ريم الخطابي','ريما الشهري','ساره الحربي','سمر العمودي','غزل اليعقوبي','فجر الذبياني','قمر','لانا العميري','لينا الرشيدي','ماريا الشمراني','مريم بادنجكي','وجد خرمي'],
'رابع 2':['أرام عسيري','أسيل وداد','تالا الشمراني','تالا القريقري','تيلا أبو صالح','جميلة السميري','جنى الشريف','حلا الغامدي','دانه اليوبي','روز الحمراني','ريتاج عواجي','ريما بن خميس','شدن الخرماني','شذى يونس','علا زهران','علويه الحداد','غني العوفي','لارين الشمري','لانا آل شبيب','لجين الحانطي','لميس اليوبي','لين بازهير','ماريا الحربي','مريم باشماخ','مشاعل ثابت','ميار الجهني','ندى السهلي','هديل الفارسي','ورد الزهراني']};
let names=LS.get('names',null)||JSON.parse(JSON.stringify(DEF));let cls=LS.get('cls','رابع 1');
const save=()=>LS.set('names',names);
S.routes.groups=()=>{const list=names[cls]||[];
 S.page(`<div class="crumb"><button class="tbtn" onclick="location.hash='home'">↩ الرئيسية</button><span class="pill">👭 طالبات الفصل</span></div>
 <div class="tabs">${Object.keys(names).map(c=>`<button data-c="${c}" class="${c===cls?'on':''}">${c} (${ar(names[c].length)})</button>`).join('')}</div>
 <section class="card center"><h2>🎯 مَن تجيب؟</h2><div class="q-big" id="who" style="font:400 2.6rem Lalezar;min-height:90px">؟</div><button class="btn gold" id="go">▶ اختاري طالبة</button> <label class="muted"><input type="checkbox" id="nr" checked> بدون تكرار</label></section>
 <section class="card"><h3>👭 توزيع الفرق الأربعة</h3><button class="btn" id="dv">🔀 وزّعي عشوائيًّا</button><div id="tm" class="board" style="margin-top:10px"></div></section>
 <section class="card"><h3>✏ أسماء الفصل</h3><div class="need" id="nl">${list.map((n,i)=>`<span>${n} <button data-d="${i}" style="border:0;background:none;cursor:pointer;font-weight:800" aria-label="حذف">×</button></span>`).join('')}</div>
 <div class="ctl"><input id="nn" placeholder="اسم جديد" style="flex:1;font:800 1rem Tajawal;border:3px solid var(--ink);border-radius:12px;padding:6px 10px"><button class="btn" id="na">إضافة</button><button class="btn ghost" id="rs">استرجاع القائمة الأصلية</button></div></section>`);
 $$('[data-c]').forEach(b=>b.onclick=()=>{cls=b.dataset.c;LS.set('cls',cls);S.routes.groups()});
 let used=[];const who=$('#who');
 $('#go').onclick=()=>{let pool=list.filter(n=>!$('#nr').checked||!used.includes(n));if(!pool.length){used=[];pool=list}if(!pool.length)return;const pick=pool[Math.random()*pool.length|0];let k=0;const btn=$('#go');btn.disabled=true;
  const iv=setInterval(()=>{who.textContent=list[Math.random()*list.length|0];if(++k>22){clearInterval(iv);who.textContent=pick;used.push(pick);btn.disabled=false;S.sfx.yes();S.confetti(30)}},70+k*4)};
 $('#dv').onclick=()=>{const sh=shuf(list);const t=[[],[],[],[]];sh.forEach((n,i)=>t[i%4].push(n));$('#tm').innerHTML=t.map((m,i)=>`<div class="bin" style="cursor:default;font:700 1rem Tajawal;text-align:right"><b style="font:400 1.3rem Lalezar">${S.teams.list[i].n}</b><br>${m.join('<br>')}</div>`).join('')};
 $$('[data-d]').forEach(b=>b.onclick=()=>{names[cls].splice(+b.dataset.d,1);save();S.routes.groups()});
 $('#na').onclick=()=>{const v=$('#nn').value.trim();if(v){names[cls].push(v);save();S.routes.groups()}};
 $('#rs').onclick=()=>{if(confirm('استرجاع القائمة الأصلية لهذا الفصل؟')){names[cls]=[...DEF[cls]];save();S.routes.groups()}};
};
})();
