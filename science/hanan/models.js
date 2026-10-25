/* المجسّمات الأصلية من Sketchfab (رخصة CC BY): تُعرض كما هي بلا أي تغيير، وتُدار بالإصبع */
(()=>{
const S=window.SCI,{$,$$}=S;
const M=[['animal_cell','🐾 الخلية الحيوانية','animal_cell','ص٣٠–٣١'],['plant_cell','🌿 الخلية النباتية','plant_cell','ص٣٠–٣١'],['frog','🐸 الضفدع','frog','ص٦٦–٦٧'],['butterfly','🦋 الفراشة','butterfly','ص٥٧'],['heart','❤️ القلب','heart','ص٣٣'],['microscope','🔬 المجهر','microscope','ص٣٤']];
let DATA=null;
const load=()=>DATA?Promise.resolve(DATA):fetch('data/models.json').then(r=>r.json()).then(d=>DATA=d);
S.routes.models=id=>{id=id||'animal_cell';
 load().then(D=>{const m=D[id],cur=M.find(x=>x[0]===id);
  S.page(`<div class="crumb"><button class="tbtn" onclick="location.hash='lab'">↩ المختبر</button><span class="pill">🧊 المجسّمات الأصلية</span></div>
  <div class="tabs">${M.map(x=>`<button data-m="${x[0]}" class="${x[0]===id?'on':''}">${x[1]}</button>`).join('')}</div>
  <div class="stage" style="height:min(70vh,600px)"><iframe id="sf" title="${cur[1]}" style="width:100%;height:100%;border:0" allow="autoplay; fullscreen; xr-spatial-tracking" allowfullscreen src="${m.embed}?autostart=1&preload=1&ui_theme=light&ui_infos=0&ui_watermark=0&ui_hint=2&dnt=1"></iframe></div>
  <div class="info"><h3>${cur[1]} <span class="pg">${cur[3]}</span></h3><p>أدِيري المجسّمَ بإصبعٍ واحد، وكبّري بإصبعين. المجسّم كما هو بلا تغيير.${id==='frog'?' <button class="btn gold" id="fs">🔊 صوتُ الضفدع</button>':''}</p>
  <p class="muted" style="font-size:.85rem">المجسّم: «${m.name}» — صاحبه: ${m.by} — الرخصة: ${m.lic} (CC BY) — <a href="${m.url}" target="_blank" rel="noopener">المصدر على Sketchfab</a></p></div>`);
  $$('[data-m]').forEach(b=>b.onclick=()=>{location.hash='lab/models~'+b.dataset.m});
  const fs=$('#fs');if(fs)fs.onclick=()=>{try{const a=new Audio('sfx/frog.mp3');a.volume=.8;a.play()}catch(e){}}})
 .catch(()=>S.page('<div class="card center"><h3>تعذّر تحميل المجسّمات</h3><p>تحتاج هذه الصفحة إلى الإنترنت.</p></div>'))};
})();
