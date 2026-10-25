/* المجهر: عيّنات تُكبَّر بالقوّة الصغرى والكبرى، مع ضبط الوضوح */
(()=>{
const S=window.SCI,{$,$$,ar}=S;
const rnd=(seed=1)=>()=>{seed=(seed*16807)%2147483647;return(seed-1)/2147483646};
const SP=[
 {id:'onion',n:'بشرةُ ساقِ البصل',t:'ص٢٧',tx:'تتركّبُ بشرةُ البصلِ من خلايا متراصّةٍ، لكلٍّ منها جدارٌ ونواة.'},
 {id:'leaf',n:'بشرةُ ورقةِ نبات',t:'ص٢٧',tx:'خلايا الورقةِ فيها بلاستيداتٌ خضراءُ تصنعُ الغذاء.'},
 {id:'blood',n:'خلايا الدم',t:'ص٣٢',tx:'خلايا الدمِ الحمراءِ تنقلُ الأكسجين ومواد أخرى.'},
 {id:'bact',n:'البكتيريا',t:'ص٣٤',tx:'تكشفُ المجاهرُ المخلوقاتِ الصغيرةَ كالبكتيريا والفيروسات، وهي لا تُرى بالعينِ المجرّدة.'},
 {id:'pond',n:'ماءُ البركة (طلائعيّات)',t:'ص٤٥',tx:'الطحالبُ والبراميسيوم من الطلائعيّات، وبعضُها وحيدُ الخليّة.'}];
function draw(ctx,w,h,id,zoom,ox,oy,blur){
 ctx.save();ctx.clearRect(0,0,w,h);ctx.fillStyle=id==='bact'||id==='pond'?'#dff3ee':'#fdf3e8';ctx.fillRect(0,0,w,h);
 ctx.filter=blur>0?`blur(${blur}px)`:'none';ctx.translate(w/2+ox,h/2+oy);ctx.scale(zoom,zoom);
 const R=rnd(id.length*37+11);
 if(id==='onion'){const cw=64,ch=34;for(let r=-14;r<=14;r++)for(let c=-14;c<=14;c++){const x=c*cw+(r%2?cw/2:0),y=r*ch;ctx.fillStyle='#fff0d4';ctx.strokeStyle='#c98a4b';ctx.lineWidth=3;ctx.beginPath();ctx.roundRect(x-cw/2+3,y-ch/2+3,cw-6,ch-6,6);ctx.fill();ctx.stroke();ctx.fillStyle='#b4761c';ctx.beginPath();ctx.arc(x+(R()-.5)*14,y+(R()-.5)*6,5,0,7);ctx.fill()}}
 else if(id==='leaf'){for(let r=-10;r<=10;r++)for(let c=-10;c<=10;c++){const x=c*80+(r%2?40:0)+(R()-.5)*8,y=r*70+(R()-.5)*8;ctx.fillStyle='#d9f2c2';ctx.strokeStyle='#4f9a3c';ctx.lineWidth=3.5;ctx.beginPath();ctx.ellipse(x,y,38,32,0,0,7);ctx.fill();ctx.stroke();ctx.fillStyle='#2f9e44';for(let k=0;k<7;k++){ctx.beginPath();ctx.ellipse(x+(R()-.5)*50,y+(R()-.5)*42,6,4,R()*3,0,7);ctx.fill()}ctx.fillStyle='#7a5cff';ctx.beginPath();ctx.arc(x+(R()-.5)*14,y+(R()-.5)*10,5,0,7);ctx.fill()}}
 else if(id==='blood'){ctx.fillStyle='#ffe3d9';ctx.fillRect(-1200,-1200,2400,2400);for(let k=0;k<260;k++){const x=(R()-.5)*1400,y=(R()-.5)*1100,r=24+R()*6;const g=ctx.createRadialGradient(x,y,r*.2,x,y,r);g.addColorStop(0,'#e87d6d');g.addColorStop(.45,'#cf2f2f');g.addColorStop(1,'#a81f2a');ctx.fillStyle=g;ctx.beginPath();ctx.arc(x,y,r,0,7);ctx.fill()}
  for(let k=0;k<9;k++){const x=(R()-.5)*1100,y=(R()-.5)*800;ctx.fillStyle='#e7dcff';ctx.strokeStyle='#8b6fd6';ctx.lineWidth=3;ctx.beginPath();ctx.arc(x,y,44,0,7);ctx.fill();ctx.stroke();ctx.fillStyle='#6a4bb8';ctx.beginPath();ctx.ellipse(x,y,22,18,.4,0,7);ctx.fill()}}
 else if(id==='bact'){for(let k=0;k<140;k++){const x=(R()-.5)*1300,y=(R()-.5)*1000,t=R();ctx.fillStyle='#4a9d6b';ctx.strokeStyle='#2c6e49';ctx.lineWidth=3;ctx.beginPath();
   if(t<.45){ctx.save();ctx.translate(x,y);ctx.rotate(R()*3);ctx.roundRect(-26,-9,52,18,9);ctx.restore();ctx.fill();ctx.stroke()}else if(t<.8){ctx.arc(x,y,13,0,7);ctx.fill();ctx.stroke()}else{ctx.lineWidth=7;ctx.strokeStyle='#4a9d6b';ctx.save();ctx.translate(x,y);ctx.rotate(R()*3);ctx.moveTo(-34,0);for(let q=-34;q<=34;q+=6)ctx.lineTo(q,Math.sin(q*.35)*9);ctx.restore();ctx.stroke()}}}
 else{for(let k=0;k<26;k++){const x=(R()-.5)*1200,y=(R()-.5)*900;ctx.save();ctx.translate(x,y);ctx.rotate(R()*3);if(k%3===0){ctx.fillStyle='#cfeeb0';ctx.strokeStyle='#4f9a3c';ctx.lineWidth=3;ctx.beginPath();ctx.ellipse(0,0,60,22,0,0,7);ctx.fill();ctx.stroke();ctx.fillStyle='#8b6fd6';ctx.beginPath();ctx.arc(10,0,8,0,7);ctx.fill()}else if(k%3===1){ctx.strokeStyle='#4f9a3c';ctx.fillStyle='#e1f7c8';ctx.lineWidth=3;for(let q=0;q<5;q++){ctx.beginPath();ctx.ellipse(q*34-68,0,17,13,0,0,7);ctx.fill();ctx.stroke()}}else{ctx.fillStyle='#d9ecff';ctx.strokeStyle='#4b86b4';ctx.lineWidth=3;ctx.beginPath();ctx.ellipse(0,0,36,14,0,0,7);ctx.fill();ctx.stroke();ctx.strokeStyle='#4b86b4';ctx.lineWidth=2;for(let q=-30;q<=30;q+=7){ctx.beginPath();ctx.moveTo(q,-14);ctx.lineTo(q,-21);ctx.moveTo(q,14);ctx.lineTo(q,21);ctx.stroke()}ctx.fillStyle='#4b86b4';ctx.beginPath();ctx.arc(-6,0,6,0,7);ctx.fill()}ctx.restore()}}
 ctx.restore()}
S.scopePage=()=>{let id='onion',power=0,ox=0,oy=0,focus=1;
 S.page(`<div class="crumb"><button class="tbtn" onclick="location.hash='lab'">↩ المختبر</button><span class="pill">🔬 المجهر</span></div>
 <div class="ctl"><b>الشريحة:</b>${SP.map(s=>`<button class="btn ghost" data-sp="${s.id}" style="padding:6px 14px;min-height:42px">${s.n}</button>`).join('')}</div>
 <div class="stage" style="display:grid;place-items:center;background:#2b1b10;height:min(64vh,560px)"><div style="position:relative;width:min(92%,520px);aspect-ratio:1"><canvas id="sc" width="520" height="520" style="border-radius:50%;border:12px solid #6a4a26;box-shadow:0 0 0 6px #ffc72c,inset 0 0 30px #0006;cursor:grab;touch-action:none;width:100%;height:100%"></canvas><span class="pill" id="sp" style="position:absolute;right:0;top:0">القوة الصغرى</span></div></div>
 <div class="ctl"><button class="btn" id="p1">القوة الصغرى</button><button class="btn gold" id="p2">القوة الكبرى</button><label>🎯 الضبط الدقيق (الوضوح)</label><input type="range" id="fc" min="0" max="100" value="100"></div>
 <div class="info" id="in"></div><p class="muted">اسحبي الشريحة بإصبعكِ لتحريكها. إذا كانت الصورة مشوّشةً حرّكي الضبط الدقيق حتى تصفو.</p>`);
 const cv=$('#sc'),ctx=cv.getContext('2d');
 const render=()=>{const z=power?3.2:1;const blur=(1-focus)*(power?9:4);draw(ctx,cv.width,cv.height,id,z*.9,ox,oy,blur)};
 const info=()=>{const s=SP.find(x=>x.id===id);$('#in').innerHTML=`<h3>${s.n} <span class="pg">${s.t}</span></h3><p>${s.tx}</p>`;$$('[data-sp]').forEach(b=>b.className='btn '+(b.dataset.sp===id?'gold':'ghost'))};
 $$('[data-sp]').forEach(b=>b.onclick=()=>{id=b.dataset.sp;ox=oy=0;info();render()});
 $('#p1').onclick=()=>{power=0;$('#sp').textContent='القوة الصغرى';$('#p1').className='btn gold';$('#p2').className='btn';render()};
 $('#p2').onclick=()=>{power=1;$('#sp').textContent='القوة الكبرى';$('#p2').className='btn gold';$('#p1').className='btn';render()};
 $('#p1').className='btn gold';$('#p2').className='btn';
 $('#fc').oninput=e=>{focus=+e.target.value/100;render()};
 let drag=null;cv.onpointerdown=e=>{cv.setPointerCapture(e.pointerId);drag={x:e.clientX,y:e.clientY};cv.style.cursor='grabbing'};
 cv.onpointermove=e=>{if(!drag)return;const k=cv.width/cv.clientWidth;ox+=(e.clientX-drag.x)*k;oy+=(e.clientY-drag.y)*k;drag={x:e.clientX,y:e.clientY};render()};
 cv.onpointerup=cv.onpointercancel=()=>{drag=null;cv.style.cursor='grab'};
 info();render()};
})();
