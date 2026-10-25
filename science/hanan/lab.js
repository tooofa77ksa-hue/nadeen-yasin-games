/* مختبر المجسّمات: خلية ثلاثية الأبعاد (تفكيك وتركيب)، مستويات التنظيم */
(()=>{
const S=window.SCI,{$,$$,ar,shuf,src}=S;
const PARTS={
 wall:['جدارُ الخليّة','تركيبٌ صلبٌ يدعمُ ويحمي الخليّةَ النباتيّة.','ص٣٠'],
 memb:['غشاءُ الخليّة','غطاءٌ رقيقٌ جدًّا يحيطُ بالخليّة، وفي الخليّةِ النباتيّةِ يكونُ داخلَ الجدار.','ص٣١'],
 cyto:['السيتوبلازم','مادّةٌ شبهُ سائلةٍ معظمُها ماء، وتحتوي بعضَ المواد الكيميائيّةِ المهمّة.','ص٣١'],
 nuc:['النواة','تركيبٌ يتحكّمُ في جميعِ أنشطةِ الخليّة.','ص٣٠'],
 chrom:['الكروموسوم','تركيبٌ داخلَ النواةِ يحملُ الصفاتِ الوراثيّةَ للمخلوقِ الحيّ.','ص٣٠'],
 mito:['الميتوكندريا','يُحرقُ فيها الغذاءُ ليزوّدَ الخليّةَ بالطاقةِ اللازمة.','ص٣٠'],
 chlo:['البلاستيداتُ الخضراء','مصانعُ الغذاءِ في الخليّة، وفيها الكلوروفيل.','ص٣٠'],
 vac:['الفجوةُ العصاريّة','تخزّنُ الماءَ والغذاءَ والفضلات. في الخليّةِ النباتيّةِ فجوةٌ أو فجوتانِ كبيرتان، وفي الحيوانيّةِ فجواتٌ كثيرةٌ صغيرة.','ص٣١']};
let stop=null;
const roundedBox=(w,h,d,r,bev)=>{const s=new THREE.Shape();const x=-w/2,y=-h/2;s.moveTo(x+r,y);s.lineTo(x+w-r,y);s.quadraticCurveTo(x+w,y,x+w,y+r);s.lineTo(x+w,y+h-r);s.quadraticCurveTo(x+w,y+h,x+w-r,y+h);s.lineTo(x+r,y+h);s.quadraticCurveTo(x,y+h,x,y+h-r);s.lineTo(x,y+r);s.quadraticCurveTo(x,y,x+r,y);
 const g=new THREE.ExtrudeGeometry(s,{depth:d,bevelEnabled:true,bevelSize:bev,bevelThickness:bev,bevelSegments:4,curveSegments:10});g.translate(0,0,-d/2);return g};
const M=(c,o={})=>new THREE.MeshStandardMaterial({color:c,roughness:.82,metalness:0,...o});
const GL=(c,op)=>M(c,{transparent:true,opacity:op,side:THREE.DoubleSide,depthWrite:false,roughness:.5});
function build(type){const root=new THREE.Group();const parts=[];
 const add=(id,obj,home,shell,op)=>{const g=new THREE.Group();g.add(obj);if(!shell){const outs=[];obj.traverse(o=>{if(o.isMesh&&!(o.material&&o.material.transparent))outs.push(o)});outs.forEach(o=>{const ol=new THREE.Mesh(o.geometry,new THREE.MeshBasicMaterial({color:0x2b1b10,side:THREE.BackSide}));ol.scale.setScalar(1.07);ol.userData.outline=true;o.add(ol)})}g.position.copy(home);root.add(g);g.traverse(o=>{o.userData.part=id});parts.push({id,g,home:home.clone(),shell:!!shell,op,mats:[],anchor:null});g.traverse(o=>{if(o.material&&!o.userData.outline)parts[parts.length-1].mats.push(o.material)});return g};
 const V=(x,y,z)=>new THREE.Vector3(x,y,z);
 const ell=(sx,sy,sz,c,r=1)=>{const m=new THREE.Mesh(new THREE.SphereGeometry(r,32,24),M(c));m.scale.set(sx,sy,sz);return m};
 const nucleus=()=>ell(1,1,1,0x8a6bff,.75);
 const chrom=()=>{const g=new THREE.Group();[[-.2,.1,.1,.4],[.15,-.1,.2,-.3],[.05,.25,-.1,.9]].forEach(a=>{const m=ell(.1,.34,.1,0xff3d9a);m.position.set(a[0],a[1],a[2]);m.rotation.z=a[3];g.add(m)});return g};
 const mito=()=>{const g=new THREE.Group();const o=ell(1,.55,.5,0xff9d3d,.55);g.add(o);const i=ell(.8,.3,.3,0xd9661a,.5);g.add(i);return g};
 if(type==='animal'){
  const memb=new THREE.Mesh(new THREE.SphereGeometry(2.4,48,32),GL(0xff7fae,.17));memb.scale.set(1.2,.95,1);add('memb',memb,V(0,0,0),1,.17);
  const cy=new THREE.Mesh(new THREE.SphereGeometry(2.25,48,32),GL(0xffd3e5,.14));cy.scale.set(1.2,.95,1);add('cyto',cy,V(0,0,0),1,.14);
  const A=(id,x,y,z)=>{parts.find(p=>p.id===id).anchor=V(x,y,z)};A('memb',2.9,1.7,.6);A('cyto',-2.5,-1.5,.8);
  add('nuc',nucleus(),V(-.4,.2,0));add('chrom',chrom(),V(-.4,.2,0));
  [[1.4,.9,.4],[-1.5,-1.0,.5],[1.0,-1.1,-.5]].forEach((p,i)=>add('mito',mito(),V(...p)));
  [[1.6,-.2,.3],[-1.6,.9,.1],[.1,1.3,.2],[-.3,-1.2,.3]].forEach(p=>add('vac',ell(1,1,1,0x8fd6ff,.32),V(...p)));
 }else{
  add('wall',new THREE.Mesh(roundedBox(5.6,3.8,3,.5,.22),GL(0x4fbf3f,.22)),V(0,0,0),1,.22);
  add('memb',new THREE.Mesh(roundedBox(5.15,3.4,2.6,.45,.15),GL(0xff7fae,.15)),V(0,0,0),1,.15);
  add('cyto',new THREE.Mesh(roundedBox(4.9,3.2,2.35,.4,.1),GL(0xfff0a0,.14)),V(0,0,0),1,.14);
  const A=(id,x,y,z)=>{parts.find(p=>p.id===id).anchor=V(x,y,z)};A('wall',-3.0,1.8,1.5);A('memb',2.9,1.6,1.3);A('cyto',2.3,-1.7,1.2);
  add('nuc',nucleus(),V(-1.3,.9,0));add('chrom',chrom(),V(-1.3,.9,0));
  const v=ell(1.45,1,.8,0x6fcfff,1);v.material=GL(0x6fcfff,.72);add('vac',v,V(.9,-.15,0));
  [[-1.8,-.9,.7],[.4,1.2,.5],[1.9,1.0,-.2],[2.0,-1.0,.5]].forEach(p=>{const c=ell(1,.55,.45,0x34a853,.45);c.rotation.z=.4;add('chlo',c,V(...p))});
  [[-.5,-1.2,.4],[1.9,.2,.8]].forEach(p=>add('mito',mito(),V(...p)));
 }
 return {root,parts}}

/* ---------- صفحة المختبر ---------- */
S.routes.lab=arg=>{if(stop){stop();stop=null}
 const [a,mode]=(arg||'').split('~');
 if(a==='cell')return cellPage(mode==='assemble');
 if(a==='scope')return S.scopePage&&S.scopePage();
 if(a==='levels')return levelsPage();
 S.page(`<h2>🔬 مختبر المجسّمات</h2><p class="muted">مجسّمات تدور بالإصبع وتُكبَّر، والمحتوى من كتاب العلوم.</p>
 <div class="big4"><button class="bigc" style="background:#ff8a1f" data-l="cell"><img src="img/plant_cell.webp" alt=""><b>الخليّة 3D</b><small>فكّكي واستكشفي وركّبي</small></button>
 <button class="bigc" style="background:#3d7bff" data-l="scope"><img src="img/microscope.webp" alt=""><b>المجهر</b><small>كبّري ما تريدين</small></button>
 <button class="bigc" style="background:#34c25a" data-l="levels"><img src="img/heart.webp" alt=""><b>مستويات التنظيم</b><small>من الخليّة إلى الجهاز</small></button>
 <button class="bigc" style="background:#ff5a9d" data-l="cell~assemble"><img src="img/animal_cell.webp" alt=""><b>لعبة ركّبي الخليّة</b><small>بالفرق والنقاط</small></button></div>`);
 $$('[data-l]').forEach(b=>b.onclick=()=>{location.hash='lab/'+b.dataset.l})};

function cellPage(assemble){
 let type='plant';
 S.page(`<div class="crumb"><button class="tbtn" onclick="location.hash='lab'">↩ المختبر</button><span class="pill">${assemble?'🧫 ركّبي الخليّة':'🔬 الخليّة 3D'}</span></div>${assemble?S.teamsBar():''}
 <div class="ctl"><button class="btn ${'gold'}" id="ty">🌿 نباتيّة</button><button class="btn ghost" id="ty2">🐾 حيوانيّة</button><label><input type="checkbox" id="lb" checked> الأسماء</label><label><input type="checkbox" id="ar" checked> دوران تلقائي</label>${assemble?`<button class="btn" id="gm">▶ ابدئي اللعبة</button>`:''}</div>
 <div class="stage" id="stg"><canvas id="cv"></canvas><div id="lbls"></div></div>
 <div class="ctl"><label>🔧 الخليّة: مركّبة ← مفكّكة</label><input type="range" id="ex" min="0" max="100" value="0"><span id="exv" class="pill">مركّبة</span></div>
 <div class="info" id="inf"><h3>اضغطي على أي جزء</h3><p>أدِيري المجسّم بإصبعكِ، وكبّري بحركة الإصبعين، ثم اضغطي على الجزء لتعرفي وظيفته.</p></div>`);
 const cv=$('#cv'),stg=$('#stg');
 const ren=new THREE.WebGLRenderer({canvas:cv,antialias:true,alpha:true});ren.setPixelRatio(Math.min(devicePixelRatio,2));
 const scene=new THREE.Scene();const cam=new THREE.PerspectiveCamera(38,1,.1,100);cam.position.set(0,0,11);
 scene.add(new THREE.HemisphereLight(0xffffff,0xb0c4ff,.78));const dl=new THREE.DirectionalLight(0xffffff,1.05);dl.position.set(4,6,8);scene.add(dl);
 let model=null,sel=null,t=0,tt=0,auto=true,game=null;
 const labels=$('#lbls');
 const mk=()=>{if(model)scene.remove(model.root);model=build(type);model.root.rotation.set(.25,-.5,0);scene.add(model.root);
  labels.innerHTML='';model.parts.forEach(p=>{p.lb=document.createElement('div');p.lb.className='lbl';p.lb.textContent=PARTS[p.id][0];labels.appendChild(p.lb)});sel=null;
  const exv=+$('#ex').value/100;t=tt=exv;};
 const resize=()=>{const w=stg.clientWidth,h=stg.clientHeight;ren.setSize(w,h,false);cam.aspect=w/h;cam.updateProjectionMatrix()};
 resize();addEventListener('resize',resize);mk();
 const info=id=>{const d=PARTS[id];$('#inf').innerHTML=`<h3>${d[0]} <span class="pg">${d[2]}</span></h3><p>${d[1]}</p>`};
 const hi=id=>{model.parts.forEach(p=>p.mats.forEach(m=>{if(m.emissive)m.emissive.setHex(p.id===id?0x553300:0x000000)}))};
 /* تفاعل */
 const ptrs=new Map();let moved=0,pinch=0;
 stg.addEventListener('pointerdown',e=>{stg.setPointerCapture(e.pointerId);ptrs.set(e.pointerId,{x:e.clientX,y:e.clientY});moved=0;auto=false});
 stg.addEventListener('pointermove',e=>{const p=ptrs.get(e.pointerId);if(!p)return;const dx=e.clientX-p.x,dy=e.clientY-p.y;p.x=e.clientX;p.y=e.clientY;
  if(ptrs.size===2){const [a,b]=[...ptrs.values()];const d=Math.hypot(a.x-b.x,a.y-b.y);if(pinch)cam.position.z=Math.min(18,Math.max(5,cam.position.z-(d-pinch)*.03));pinch=d}
  else{moved+=Math.abs(dx)+Math.abs(dy);model.root.rotation.y+=dx*.01;model.root.rotation.x=Math.max(-1.2,Math.min(1.2,model.root.rotation.x+dy*.01))}});
 const pick=e=>{const r=cv.getBoundingClientRect();const m=new THREE.Vector2(((e.clientX-r.left)/r.width)*2-1,-((e.clientY-r.top)/r.height)*2+1);const rc=new THREE.Raycaster();rc.setFromCamera(m,cam);
  const hits=rc.intersectObjects(model.root.children,true).filter(h=>h.object.userData.part);if(!hits.length)return null;
  const solid=hits.find(h=>!['wall','memb','cyto'].includes(h.object.userData.part));return (solid||hits[0]).object.userData.part};
 const up=e=>{ptrs.delete(e.pointerId);if(ptrs.size<2)pinch=0;if(moved<6){const id=pick(e);if(id)choose(id)}};
 stg.addEventListener('pointerup',up);stg.addEventListener('pointercancel',e=>{ptrs.delete(e.pointerId)});
 stg.addEventListener('wheel',e=>{e.preventDefault();cam.position.z=Math.min(18,Math.max(5,cam.position.z+e.deltaY*.01))},{passive:false});
 const choose=id=>{
  if(game){if(game.locked)return;const want=game.list[game.i];const ok=id===want;game.locked=true;
   if(ok){S.teams.award(1);S.sfx.yes();hi(id);info(id);game.sc++}else{S.sfx.no();$('#inf').innerHTML=`<h3>❌ ليس هذا الجزء</h3><p>الصحيح: <b>${PARTS[want][0]}</b>. ${PARTS[want][1]}</p>`;hi(want)}
   setTimeout(()=>{game.i++;game.locked=false;S.teams.next();gnext()},ok?1500:2600);return}
  sel=id;hi(id);info(id)};
 const gnext=()=>{if(!$('#inf'))return;hi(null);if(game.i>=game.list.length){const sc=game.sc,n=game.list.length;game=null;tt=0;$('#ex').value=0;$('#exv').textContent='مركّبة';S.sfx.win();S.confetti(80);$('#inf').innerHTML=`<h3>🎉 تركّبت الخليّة!</h3><p>أصبتم ${ar(sc)} من ${ar(n)}. الفريق الفائز في اللوحة أعلاه.</p>`;$('#gm').disabled=false;return}
  const id=game.list[game.i];$('#inf').innerHTML=`<h3>أين: ${PARTS[id][0]}؟</h3><p>الدور على: <b>${S.teams.list[S.teams.turn].n}</b>. اضغطي على الجزء الصحيح في المجسّم.</p>`;S.refreshTeams()};
 const startGame=()=>{const ids=[...new Set(model.parts.filter(p=>!p.shell).map(p=>p.id))];game={list:shuf(ids),i:0,sc:0,locked:false};tt=1;$('#ex').value=100;$('#exv').textContent='مفكّكة';$('#lb').checked=false;$('#gm').disabled=true;gnext()};
 if(assemble)$('#gm').onclick=startGame;
 const setT=()=>{$('#exv').textContent=tt<.05?'مركّبة':tt>.95?'مفكّكة':'تفكيك '+ar(Math.round(tt*100))+'٪'};
 $('#ex').oninput=e=>{tt=+e.target.value/100;setT()};
 $('#lb').onchange=()=>{};$('#ar').onchange=e=>{auto=e.target.checked};
 $('#ty').onclick=()=>{type='plant';$('#ty').className='btn gold';$('#ty2').className='btn ghost';mk();$('#inf').innerHTML='<h3>الخليّة النباتيّة</h3><p>فيها جدارٌ خلويّ وبلاستيداتٌ خضراء وفجوةٌ كبيرة. ص٣٠–٣١</p>'};
 $('#ty2').onclick=()=>{type='animal';$('#ty2').className='btn gold';$('#ty').className='btn ghost';mk();$('#inf').innerHTML='<h3>الخليّة الحيوانيّة</h3><p>ليس لها جدارٌ ولا بلاستيدات، وفيها فجواتٌ صغيرةٌ كثيرة. ص٣٠–٣١</p>'};
 /* حلقة الرسم */
 let raf,run=true;const v=new THREE.Vector3();
 const loop=()=>{if(!run)return;raf=requestAnimationFrame(loop);t+=(tt-t)*.12;
  if(auto&&!game)model.root.rotation.y+=.004;
  model.parts.forEach(p=>{if(p.shell){const s=1+.22*t;p.g.scale.setScalar(s);p.mats.forEach(m=>{m.opacity=p.op*(1-.65*t)})}else{p.g.position.copy(p.home).multiplyScalar(1+1.1*t);if(p.id==='chrom')p.g.position.y-=1.6*t}});
  ren.render(scene,cam);
  const showL=$('#lb')&&$('#lb').checked;const w=stg.clientWidth,h=stg.clientHeight;const seen=new Set();
  model.parts.forEach(p=>{if(!p.lb)return;const on=showL&&(t>.35||sel===p.id||(p.shell&&t<.2))&&!seen.has(p.id);
   if(!on||(p.shell&&!p.anchor)){p.lb.style.display='none';return}seen.add(p.id);
   if(p.shell){v.copy(p.anchor).multiplyScalar(1+.22*t);model.root.localToWorld(v)}else p.g.getWorldPosition(v);
   v.project(cam);p.lb.style.display='block';p.lb.style.left=((v.x+1)/2*w)+'px';p.lb.style.top=((1-v.y)/2*h)+'px';p.lb.style.background=sel===p.id?'#ffe08a':'#fff'});};
 loop();
 stop=()=>{run=false;cancelAnimationFrame(raf);removeEventListener('resize',resize);ren.dispose()};
 if(assemble)setTimeout(()=>{$('#inf').innerHTML='<h3>لعبة ركّبي الخليّة</h3><p>اضغطي «ابدئي اللعبة»: تتفكّك الخليّة، وكل فريق يضغط على الجزء المطلوب بدوره.</p>'},0);
}

/* ---------- مستويات التنظيم ---------- */
function levelsPage(){
 const L=[['circulatory','الجهاز الحيوي','أعضاءٌ تعملُ وتتآزرُ معًا لتقومَ بوظائفَ محدّدة، مثل الجهازِ الدورانيّ الذي ينقلُ الدمَ إلى جميعِ أجزاءِ الجسم.','ص٣٣'],['heart','العضو','يتكوّنُ من أنسجةٍ مختلفةٍ ويقومُ بوظيفةٍ محدّدة، مثل القلبِ الذي يضخُّ الدم.','ص٣٣'],['muscle_tissue','النسيج','مجموعةٌ منَ الخلايا المتماثلةِ تجتمعُ وتتعاونُ لتؤدّيَ وظيفةً محدّدة، مثل النسيجِ العضليّ.','ص٣٣'],['blood_cell','الخليّة','أصغرُ وحدةٍ في بناءِ المخلوقاتِ الحيّة.','ص٢٨']];
 S.page(`<div class="crumb"><button class="tbtn" onclick="location.hash='lab'">↩ المختبر</button><span class="pill">🔍 مستويات التنظيم</span></div><h2>من الجهاز إلى الخليّة</h2>
 <div class="ctl"><label>🔍 قرّبي</label><input type="range" id="lv" min="0" max="300" value="0"></div>
 <div class="stage" style="height:min(56vh,440px);display:flex;align-items:center;justify-content:center" id="lst"><img id="li" src="img/circulatory.webp" alt="" style="height:80%;object-fit:contain;transition:transform .3s,opacity .3s"></div>
 <div class="info" id="lt"></div>`);
 const upd=()=>{const v=+$('#lv').value;const k=Math.min(3,Math.round(v/100));const f=(v-k*100)/100;const l=L[k];$('#li').src='img/'+l[0]+'.webp';$('#li').style.transform=`scale(${1+Math.abs(f)*.6})`;$('#lt').innerHTML=`<h3>${l[1]} <span class="pg">${l[3]}</span></h3><p>${l[2]}</p><p class="muted">الترتيب: الخليّة ← النسيج ← العضو ← الجهاز الحيوي.</p>`};
 $('#lv').oninput=upd;upd()}
})();
