/* ملعب نادين وياسين — محرّك الألعاب (أرقام الصفحات من الكتاب، والأسئلة من الاختبارات والأوراق) */
(()=>{
const CFG={topic:'nyg-2eb9e87e63b27b4e',base:'https://ntfy.sh/'};
const P=window.PROFILE||'nadeen';
const NAMES={nadeen:'نادين',yasin:'ياسين',maha:'المعلمة مها'};
const $=(s,r=document)=>r.querySelector(s),$$=(s,r=document)=>[...r.querySelectorAll(s)];
const app=$('#app');document.body.classList.add(P);
const LS={get(k,d){try{const v=localStorage.getItem('nyg_'+P+'_'+k);return v?JSON.parse(v):d}catch(e){return d}},set(k,v){try{localStorage.setItem('nyg_'+P+'_'+k,JSON.stringify(v))}catch(e){}}};
const QD=window.QD;
const TASH=/[ً-ٰٟـ]/g;
const nz=s=>s.replace(TASH,'').replace(/[أإآ]/g,'ا').replace(/ى/g,'ي');
const shuf=a=>{a=[...a];for(let i=a.length-1;i>0;i--){const j=Math.random()*(i+1)|0;[a[i],a[j]]=[a[j],a[i]]}return a};
const pick=(a,n)=>shuf(a).slice(0,n);
const esc=s=>String(s).replace(/[&<>]/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;'}[c]));
/* خطاب المذكّر لياسين (خارج نصوص الأسئلة) */
if(P==='yasin'){const MAP=[['أحسنتِ','أحسنتَ'],['بطلة','بطل'],['جرّبي','جرّب'],['حصلتِ','حصلتَ'],['أرسليها','أرسلها'],['العبي','العب'],['أرسلي','أرسل'],['أجيبي','أجب'],['أخطأتِ','أخطأتَ'],['غيّري','غيّر'],['أدِيري','أدِر'],['اقرئي','اقرأ'],['اكتبي','اكتب'],['اختاري','اختر'],['ابدئي','ابدأ'],['اتركي','اترك'],['تحقّقي','تحقّق'],['اللاعبة','اللاعب'],['مرحبًا بكِ','مرحبًا بك'],['افتحي','افتح'],['ألصقي','ألصق'],['قرأتِ','قرأتَ'],['فكّري','فكّر'],['تعلّمتِ','تعلّمتَ'],['تذكّري','تذكّر'],['تأكّدي','تأكّد'],['اضغطي','اضغط'],['استخدمي','استخدم'],['حاولي','حاول'],['ركّزي','ركّز'],['انتبهي','انتبه'],['أكملي','أكمل'],['ارجعي','ارجع'],['تختاري','تختار'],['تتجاوزي','تتجاوز'],['تحصلين','تحصل'],['اربحي','اربح'],['اختبري','اختبر'],['وصلتِ','وصلتَ'],['لكِ','لك'],['أرسليها','أرسلها'],['ألصقي','ألصق']];
 const SKIP='.q,.opt,.pass,.why';
 let busy=false;const fix=root=>{if(busy)return;busy=true;try{const w=document.createTreeWalker(root,NodeFilter.SHOW_TEXT);let n;while(n=w.nextNode()){if(n.parentElement&&n.parentElement.closest(SKIP))continue;let t=n.nodeValue,o=t;for(const [a,b] of MAP)if(t.includes(a))t=t.split(a).join(b);if(t!==o)n.nodeValue=t}}finally{busy=false}};
 new MutationObserver(()=>fix(app)).observe(app,{childList:true,subtree:true});}
/* نجوم الخلفية */

/* الأصوات */
const AU={};['correct','wrong','win','cheer','clap'].forEach(n=>{try{const a=new Audio('../shared/sfx/'+n+'.mp3');a.preload='auto';AU[n]=a}catch(e){}});
let muted=LS.get('mute',false);
function sfx(n){if(muted)return;try{const a=AU[n];if(a){a.currentTime=0;a.play().catch(()=>{})}}catch(e){}}
function toast(t){const d=document.createElement('div');d.className='toast';d.textContent=t;document.body.appendChild(d);setTimeout(()=>d.remove(),2600)}
/* نجوم SVG حقيقية */
const STAR_PATH='M12 1.8l2.9 6.2 6.8.8-5 4.7 1.3 6.7L12 16.8 6 20.2l1.3-6.7-5-4.7 6.8-.8z';
(()=>{const d=document.createElement('div');d.style.cssText='position:absolute;width:0;height:0;overflow:hidden';d.innerHTML='<svg width="0" height="0"><defs><linearGradient id="gStar" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#fff3a6"/><stop offset=".5" stop-color="#ffd54a"/><stop offset="1" stop-color="#ff9f1a"/></linearGradient></defs></svg>';document.body.appendChild(d)})();
const IMG='../shared/img/';
const starSvg=(on=true,w=34,delay=0)=>`<img class="rstar ${on?'':'off'}" src="${IMG}${on?'star':'star_empty'}.webp" width="${w}" height="${w}" alt="" style="animation-delay:${delay}s">`;
const starRow=(n,total=3,w=34)=>`<span class="starrow">${Array.from({length:total},(_,i)=>starSvg(i<n,w,i*.35)).join('')}</span>`;
const RANKS=[[0,'متدرّبة','متدرّب'],[10,'مغامِرة','مغامِر'],[30,'قائدة الفريق','قائد الفريق'],[60,'بطلة المدرسة','بطل المدرسة'],[100,'ملكة النجوم','ملك النجوم']];
const rankOf=n=>{let r=0;RANKS.forEach((x,i)=>{if(n>=x[0])r=i});return r};
const rankName=i=>RANKS[i][P==='yasin'?2:1];
function skyCard(){const n=LS.get('stars',0),r=rankOf(n),nx=RANKS[r+1];const shown=Math.min(n,60);let h='';
 for(let i=0;i<shown;i++)h+=`<img class="s2" src="${IMG}star.webp" alt="" style="animation-delay:${(i%7)*.2}s">`;
 return `<div class="card shelf"><h3>🌟 خزانة نجومي</h3><div class="stars2">${h||'<p class="center muted" style="margin:30px 0">اربحي نجومًا وستمتلئ خزانتك!</p>'}</div>
 <p style="margin:8px 0 0"><b>${n}</b> نجمة · الرتبة: <b>${rankName(r)}</b></p>${nx?`<div class="rankbar"><i style="width:${(n-RANKS[r][0])/(nx[0]-RANKS[r][0])*100}%"></i></div><p class="muted" style="margin:0">تبقّى ${nx[0]-n} نجمة لتصير ${rankName(r+1)}</p>`:'<p class="muted" style="margin:0">وصلتِ إلى أعلى رتبة!</p>'}</div>`}
/* الشخصيات */
function avatar(w=64,who=P,pose='idle'){return `<img class="av" src="${IMG}${who}_${pose}.webp" alt="" style="width:${w}px;height:auto">`}
function alienSvg(w=90,mood='x'){return `<img src="${IMG}${mood==='sad'?'monster_sad':'monster'}.webp" alt="" style="width:${w}px;height:auto;display:block">`}
const AR={nadeen:'2/3',yasin:'2/3',bee:'1/1'};
function spr(frames,w,who,dur=.34){const n=frames.length;return `<span class="sprite n${n}" style="width:${w}px;aspect-ratio:${AR[who]||'2/3'}">${frames.map((f,i)=>`<img src="${IMG}${f}.webp" alt="" style="animation-delay:${(i*dur).toFixed(2)}s;animation-duration:${(n*dur).toFixed(2)}s">`).join('')}</span>`}
const SEQ=(w,a,n)=>Array.from({length:n},(_,i)=>`${w}_${a}${i+1}`);
let mas=null;
function setMas(st){if(P==='maha')return;if(!mas){mas=document.createElement('div');mas.id='mas';document.body.appendChild(mas)}
 if(st==='hide'){mas.className='mas hide';return}
 const cur=mas.dataset.st;if(cur!==st){mas.dataset.st=st;mas.innerHTML=st==='happy'?spr(SEQ(P,'jump',3),112,P,.2):`<img src="${IMG}${P}_${st}.webp" alt="">`}
 mas.className='mas '+st;if(st==='oops'){const im=mas.firstChild;im.style.animation='none';void im.offsetWidth;im.style.animation=''}}
/* الإرسال والاستقبال */
const bus={status:'off',async send(m){m.at=Date.now();try{LS.set('outbox',[...LS.get('outbox',[]).slice(-30),m]);const r=await fetch(CFG.base+CFG.topic,{method:'POST',body:JSON.stringify(m)});return r.ok}catch(e){return false}},
 listen(fn,since){let es;const open=()=>{try{es=new EventSource(CFG.base+CFG.topic+'/sse?since='+(since||'12h'));es.onopen=()=>{bus.status='on';fn({_s:1})};es.onmessage=ev=>{try{const d=JSON.parse(ev.data);if(d.event==='message'){const m=JSON.parse(d.message);m._id=d.id;fn(m)}}catch(e){}};es.onerror=()=>{bus.status='off';fn({_s:1})}}catch(e){}};open();}};
function stars(sc,max){const r=sc/max;return r>=.85?3:r>=.6?2:r>=.3?1:0}
async function finish(game,label,sc,max){setMas('hide');
 const st=stars(sc,max);const hist=LS.get('hist',[]);const rec={t:'res',p:P,name:NAMES[P],game,label,score:sc,max,stars:st};
 hist.push(rec);LS.set('hist',hist.slice(-60));
 const coins=LS.get('coins',0)+sc*2+st*5;LS.set('coins',coins);const before=rankOf(LS.get('stars',0));LS.set('stars',LS.get('stars',0)+st);const after=rankOf(LS.get('stars',0));
 const ok=await bus.send(rec);
 const wa='https://wa.me/?text='+encodeURIComponent(`نتيجة ${NAMES[P]} في «${label}»: ${sc} من ${max} ${'⭐'.repeat(st)}`);
 if(st>=2)sfx('win');else if(st===1)sfx('correct');else sfx('wrong');
 app.innerHTML=`${topbar()}<div class="card center"><div class="hop" style="display:inline-block">${st>=2?spr(SEQ(P,'dance',4),150,P,.25):st===1?spr(SEQ(P,'clap',3),150,P,.3):avatar(130,P,'oops')}</div><h2>${st>=2?'أحسنتِ يا بطلة!':st===1?'محاولة جميلة!':'لا بأس، جرّبي مرة ثانية!'}</h2><div style="margin:6px 0">${starRow(st,3,56)}</div><h3>${label}: ${sc} من ${max}</h3><p class="muted">حصلتِ على ${sc*2+st*5} عملة 🪙${st?` و${st} ${st>2?'نجوم':st===2?'نجمتين':'نجمة'} ✨`:''}</p>${after>before?`<p class="chip" style="display:inline-block;background:var(--gold);color:#3b2400">🎖️ رتبة جديدة: ${rankName(after)}</p>`:''}
 <p class="muted">${ok?'وصلت نتيجتك إلى المعلمة مها ✓':'ما وصلت النتيجة للمعلمة الآن؛ أرسليها بالواتساب أو جرّبي لاحقًا.'}</p>
 <div style="display:flex;gap:10px;justify-content:center;flex-wrap:wrap"><button class="btn" id="again">العبي مرة ثانية</button><button class="btn ghost" id="home">الرئيسية</button><a class="btn ghost" target="_blank" rel="noopener" href="${wa}">أرسلي لمعلمتك بالواتساب</a></div></div>`;
 if(st>=1)confetti(st*30+10);for(let k=0;k<st;k++)setTimeout(()=>sfx('correct'),400+k*350);$('#again').onclick=()=>{if(game==='lesson'){GAMES.lesson.start()}else if(game==='central'){const m=label.match(/\((\d+)\)/);GAMES.central.start(m?+m[1]-1:0)}else GAMES[game]?GAMES[game].start():home()};$('#home').onclick=home}
function confetti(n=40){const c=['#ffd54a','#ff7ac8','#7fe8ff','#9affc9','#c9a7ff'];for(let i=0;i<n;i++){const d=document.createElement('i');d.style.cssText=`position:fixed;top:-10px;left:${Math.random()*100}%;width:9px;height:14px;background:${c[i%5]};z-index:30;border-radius:2px;transition:transform ${1.6+Math.random()*1.4}s ease-in,opacity 2.6s;pointer-events:none`;document.body.appendChild(d);requestAnimationFrame(()=>{d.style.transform=`translate(${(Math.random()-.5)*240}px,${innerHeight+40}px) rotate(${Math.random()*720}deg)`;d.style.opacity='0'});setTimeout(()=>d.remove(),3200)}}
function topbar(){return `<div class="top"><div class="who">${avatar(40)}<div><h3 style="margin:0">${NAMES[P]}</h3><div class="muted" style="font-size:.85rem">مركز رؤيا وإبداع</div></div></div><div class="chips"><span class="chip">${starSvg(true,18)} ${LS.get('stars',0)}</span><span class="chip">🪙 ${LS.get('coins',0)}</span><button class="chip" id="mt" style="font:inherit;color:inherit;cursor:pointer">${muted?'🔇':'🔊'}</button><button class="chip" id="hm" style="font:inherit;color:inherit;cursor:pointer">🏠</button></div></div>`}
function bindTop(){const m=$('#mt');if(m)m.onclick=()=>{muted=!muted;LS.set('mute',muted);m.textContent=muted?'🔇':'🔊'};const h=$('#hm');if(h)h.onclick=home}
/* أسئلة */
const KINDS={antonym:'الأضداد',synonym:'المرادفات',irab:'الإعراب',plural:'الجموع',comp:'فهم المقروء',spelling:'الإملاء',grammar:'القواعد'};
const LKIND={spelling:['imla1','imla2','imla3','imla4'],grammar:['nahw1','nahw4','rasm'],irab:['nahw2','nahw3','nahw5','nahw6'],comprehension:['poem','entry']};
function lessonItems(id){const L=(QD.LQ||[]).find(x=>x.id===id);return L?L.items.map(x=>({...x,kind:'lesson',pg:L.pg?('ص'+L.pg):''})):[]}
function pool(kind){
 const q=QD.Q.filter(x=>x.kind===kind);const e=QD.EX.filter(x=>x.kind===kind);
 const k2=kind==='comp'?'comprehension':kind;const ls=(LKIND[k2]||[]).flatMap(lessonItems);
 return [...q,...e,...ls];
}
function prep(q){let o=q.o.map((t,i)=>({t,i}));const fixed=q.o.length<=2||(q.type==='tf');if(!fixed)o=shuf(o);return {...q,o:o.map(x=>x.t),a:o.findIndex(x=>x.i===q.a)}}
function ask(box,q,done,opts={}){
 const hide=opts.hide||[];
 box.innerHTML=`${q.passage?`<div class="pass">${esc(q.passage)}</div>`:''}<div class="q" style="margin:10px 0">${esc(q.q)}</div><div class="opts">${q.o.map((t,i)=>`<button class="opt ${hide.includes(i)?'dim':''}" data-i="${i}" ${hide.includes(i)?'disabled':''}>${esc(t)}</button>`).join('')}</div><div id="fb"></div>`;
 let locked=false;
 setMas('think');
 $$('.opt',box).forEach(b=>b.onclick=()=>{if(locked)return;locked=true;const i=+b.dataset.i,ok=i===q.a;setMas(ok?'happy':'oops');$$('.opt',box).forEach(x=>{if(+x.dataset.i===q.a)x.classList.add('ok')});if(!ok)b.classList.add('no','shake');
  sfx(ok?'correct':'wrong');
  const src=q.src==='إ'?' · معلومة إضافية':q.pg||q.src_pg||q.p?` · ${q.pg||q.p||('ص'+q.src_pg)}`:'';
  $('#fb',box).innerHTML=`<div class="why">${ok?'✅ أحسنتِ! ':'❌ الإجابة الصحيحة: <b>'+esc(q.o[q.a])+'</b>. '}${q.w?esc(q.w):''}<span class="muted">${src}</span></div>`;
  setTimeout(()=>done(ok),opts.delay||(ok?1100:2600))})}
/* اللعبة العامة: كوكب */
const GAMES={};
function pageHdr(t,sub){return `${topbar()}<div class="center"><h2>${t}</h2>${sub?`<p class="muted">${sub}</p>`:''}</div>`}
GAMES.planet=GAMES.quiz={start(kind){kind=kind||GAMES._kind||'antonym';GAMES._kind=kind;const qs=pick(pool(kind),Math.min(10,pool(kind).length)).map(prep);let i=0,sc=0;
 const step=()=>{if(i>=qs.length)return finish('planet',KINDS[kind]||kind,sc,qs.length);
  app.innerHTML=`${topbar()}<div class="card"><div class="bar"><i style="width:${i/qs.length*100}%"></i></div><p class="muted">سؤال ${i+1} من ${qs.length} · ${KINDS[kind]||''}</p><div id="qb"></div></div>`;bindTop();
  ask($('#qb'),qs[i],ok=>{if(ok){sc++}i++;step()})};step()}};
/* وحش الأخطاء */
GAMES.alien={start(kind){kind=kind||GAMES._akind||'mix';GAMES._akind=kind;
 const src=kind==='mix'?['antonym','synonym','irab','plural','grammar','spelling'].flatMap(k=>pick(pool(k),6)):pool(kind);const qs=pick(src,10).map(prep);let i=0,lives=3,sc=0;
 const step=()=>{if(i>=qs.length||lives<=0){return finish('alien','هروب من وحش الأخطاء',sc,qs.length)}
  const pos=Math.min(70,(3-lives)*28);
  app.innerHTML=`${topbar()}<div class="card"><div class="stage"><div style="position:absolute;right:14px;bottom:4px" id="hero">${spr(SEQ(P,'walk',4),70,P,.24)}</div><div id="alien" style="position:absolute;bottom:4px;left:${16+pos}%">${alienSvg(66+(3-lives)*26,'x')}</div></div><div class="chips" style="margin:8px 0"><span class="chip">${'❤️'.repeat(lives)}${'🖤'.repeat(3-lives)}</span><span class="chip">سؤال ${i+1}/${qs.length}</span></div><p class="muted" style="margin:0">أجيبي صح ليبتعد وحش الأخطاء، وإذا أخطأتِ يقترب!</p><div id="qb"></div></div>`;bindTop();
  ask($('#qb'),qs[i],ok=>{if(ok){sc++;const a=$('#hero');a.classList.add('hop');confetti(8)}else{lives--}i++;step()})};step()}};
/* مليونير */
const PR=['١٠٠','٢٠٠','٣٠٠','٥٠٠','١٠٠٠','٢٠٠٠','٤٠٠٠','٨٠٠٠','١٦٠٠٠','٣٢٠٠٠','٦٤٠٠٠','١٢٥٠٠٠','٢٥٠٠٠٠','٥٠٠٠٠٠','١٠٠٠٠٠٠'];
GAMES.million={start(){const kinds=['antonym','synonym','irab','plural','grammar','spelling'];let all=kinds.flatMap(k=>pick(pool(k),5));all=pick(all,15).map(prep);
 let i=0,lf={half:1,swap:1,hint:1};let spare=pick(kinds.flatMap(k=>pool(k)),20).map(prep);
 const step=(hide)=>{if(i>=15){return finish('million','من سيربح المليون',15,15)}
  app.innerHTML=`${topbar()}<div style="display:flex;gap:12px;align-items:flex-start"><div class="ladder">${PR.map((p,k)=>`<div class="${k===i?'cur':k<i?'done':''}">${p}</div>`).join('')}</div><div style="flex:1"><div class="card"><div class="chips" style="margin-bottom:6px"><button class="chip lf" data-l="half" ${lf.half?'':'disabled'} style="font:inherit;color:inherit;cursor:pointer">٥٠:٥٠</button><button class="chip lf" data-l="swap" ${lf.swap?'':'disabled'} style="font:inherit;color:inherit;cursor:pointer">🔄 غيّري السؤال</button><button class="chip lf" data-l="hint" ${lf.hint?'':'disabled'} style="font:inherit;color:inherit;cursor:pointer">💡 تلميح</button></div><div id="qb"></div></div></div></div>`;bindTop();
  const q=all[i];ask($('#qb'),q,ok=>{if(ok){i++;step()}else{finish('million','من سيربح المليون',i,15)}},{hide:hide||[]});
  $$('.lf').forEach(b=>b.onclick=()=>{const l=b.dataset.l;lf[l]=0;if(l==='half'){const w=shuf(q.o.map((t,k)=>k).filter(k=>k!==q.a)).slice(0,2);step(w)}else if(l==='swap'){all[i]=spare.pop();step()}else{toast('تلميح: الإجابة تبدأ بحرف «'+nz(q.o[q.a]).replace(/^ال/,'').charAt(0)+'»');b.disabled=true}})};step()}};
/* اختبر نفسك على درس */
GAMES.lesson={start(id){id=id||GAMES._lid;GAMES._lid=id;const L=(QD.LQ||[]).find(x=>x.id===id);if(!L)return home();
 const qs=pick(lessonItems(id),Math.min(10,lessonItems(id).length)).map(prep);let i=0,sc=0;
 const step=()=>{if(i>=qs.length)return finish('lesson','درس: '+L.title.replace(/[\u064B-\u0652]/g,''),sc,qs.length);
  app.innerHTML=`${topbar()}<div class="card"><div class="bar"><i style="width:${i/qs.length*100}%"></i></div><p class="muted">${esc(L.title)} · سؤال ${i+1} من ${qs.length}</p><div id="qb"></div></div>`;bindTop();
  ask($('#qb'),qs[i],ok=>{if(ok)sc++;i++;step()})};step()}};
/* العجلة */
const WH=[['antonym','أضداد','#ff7ac8'],['synonym','مرادفات','#8f6bff'],['irab','إعراب','#39b6ff'],['plural','جموع','#27e0c0'],['comp','فهم مقروء','#ffd54a'],['mix','اختبار منوّع','#ff9f43']];
GAMES.wheel={start(){const n=WH.length,ang=360/n;
 let seg='';WH.forEach((w,k)=>{const a0=(k*ang-90)*Math.PI/180,a1=((k+1)*ang-90)*Math.PI/180;const x0=150+140*Math.cos(a0),y0=150+140*Math.sin(a0),x1=150+140*Math.cos(a1),y1=150+140*Math.sin(a1);const m=(k+.5)*ang;seg+=`<path d="M150 150L${x0} ${y0}A140 140 0 0 1 ${x1} ${y1}Z" fill="${w[2]}" stroke="#fff" stroke-width="3"/><text x="150" y="${Math.cos(m*Math.PI/180)<0?262:40}" transform="rotate(${Math.cos(m*Math.PI/180)<0?m+180:m} 150 150)" text-anchor="middle" font-family="Lalezar,Tajawal" font-size="19" fill="#1a1040">${w[1]}</text>`});
 app.innerHTML=`${pageHdr('عجلة التحدّي','أدِيري العجلة، وسيختار لك الحظ تحدّيًا!')}<div class="wheelwrap"><div class="ptr"></div><svg id="wheel" viewBox="0 0 300 300"><circle cx="150" cy="150" r="146" fill="#fff"/>${seg}<circle cx="150" cy="150" r="18" fill="#1a1040" stroke="#ffd54a" stroke-width="4"/></svg></div><div class="center"><button class="btn gold" id="spin" style="font-size:1.3rem;padding:14px 34px">أدِيري! 🚀</button></div>`;bindTop();
 let rot=0;$('#spin').onclick=()=>{const b=$('#spin');b.disabled=true;const k=Math.random()*n|0;const target=360*6+(360-(k+.5)*ang);rot=Math.ceil(rot/360)*360+target;$('#wheel').style.transform=`rotate(${rot}deg)`;
  setTimeout(()=>{const w=WH[k];toast('التحدّي: '+w[1]);setTimeout(()=>{if(w[0]==='comp')GAMES.comp.start();else if(w[0]==='mix')GAMES.alien.start('mix');else GAMES.planet.start(w[0])},1200)},4700)}}};
/* فهم المقروء */
GAMES.comp={start(){const withP=QD.EX.filter(x=>x.passage&&x.kind==='comprehension');const groups={};withP.forEach(x=>{(groups[x.passage]=groups[x.passage]||[]).push(x)});const keys=Object.keys(groups);const key=keys[Math.random()*keys.length|0];const qs=pick(groups[key],Math.min(5,groups[key].length)).map(prep);let i=0,sc=0;
 const step=()=>{if(i>=qs.length)return finish('comp','فهم المقروء',sc,qs.length);
  app.innerHTML=`${topbar()}<div class="card"><div class="bar"><i style="width:${i/qs.length*100}%"></i></div><p class="muted">اقرئي النص جيدًا ثم أجيبي · سؤال ${i+1} من ${qs.length}</p><div id="qb"></div></div>`;bindTop();
  ask($('#qb'),qs[i],ok=>{if(ok)sc++;i++;step()})};step()}};
/* متقاطعة */
function buildCW(words){const W=words.map(w=>({...w,L:nz(w.w).replace(/[^ء-ي]/g,'').replace(/ة/g,'ة')})).filter(w=>w.L.length>=3&&w.L.length<=7&&!nz(w.m).includes(w.L));
 const tries=[];for(let t=0;t<60;t++){const ws=shuf(W).slice(0,9).sort((a,b)=>b.L.length-a.L.length);const g=new Map();const placed=[];const key=(r,c)=>r+','+c;
  const can=(w,r,c,dir)=>{let inter=0;for(let k=0;k<w.L.length;k++){const rr=r+(dir?k:0),cc=c+(dir?0:k),ex=g.get(key(rr,cc));if(ex){if(ex!==w.L[k])return -1;inter++}else{const nb=dir?[[rr,cc-1],[rr,cc+1]]:[[rr-1,cc],[rr+1,cc]];if(nb.some(p=>g.has(key(...p))))return -1}}
   const bf=dir?[r-1,c]:[r,c-1],af=dir?[r+w.L.length,c]:[r,c+w.L.length];if(g.has(key(...bf))||g.has(key(...af)))return -1;return inter};
  const put=(w,r,c,dir)=>{for(let k=0;k<w.L.length;k++)g.set(key(r+(dir?k:0),c+(dir?0:k)),w.L[k]);placed.push({w,r,c,dir})};
  put(ws[0],0,0,0);
  for(const w of ws.slice(1)){let best=null;
   // بسيط: جرّب كل المواضع
   for(let r=-8;r<=8;r++)for(let c=-8;c<=8;c++)for(const dir of [0,1]){const s=can(w,r,c,dir);if(s>=1&&(!best||s>best.s))best={r,c,dir,s}}
   if(best)put(w,best.r,best.c,best.dir)}
  if(placed.length>=5)tries.push(placed)}
 tries.sort((a,b)=>b.length-a.length);return tries[0]||null}
GAMES.cw={start(){const pl=buildCW(QD.WORDS);if(!pl){toast('تعذّر بناء المتقاطعة');return home()}
 let r0=1e9,c0=1e9,r1=-1e9,c1=-1e9;pl.forEach(p=>{r0=Math.min(r0,p.r);c0=Math.min(c0,p.c);r1=Math.max(r1,p.r+(p.dir?p.w.L.length-1:0));c1=Math.max(c1,p.c+(p.dir?0:p.w.L.length-1))});
 const R=r1-r0+1,C=c1-c0+1,cells={};pl.forEach((p,n)=>{for(let k=0;k<p.w.L.length;k++){const r=p.r-r0+(p.dir?k:0),c=p.c-c0+(p.dir?0:k);const key=r+','+c;cells[key]=cells[key]||{ch:p.w.L[k],n:0};if(k===0)cells[key].n=n+1}});
 let grid='';for(let r=0;r<R;r++)for(let c=0;c<C;c++){const ce=cells[r+','+c];grid+=ce?`<div class="c"><input data-k="${r},${c}" maxlength="1" inputmode="text" autocomplete="off">${ce.n?`<span class="n">${ce.n}</span>`:''}</div>`:'<div class="e"></div>'}
 const across=pl.map((p,n)=>({n:n+1,p})).filter(x=>!x.p.dir),down=pl.map((p,n)=>({n:n+1,p})).filter(x=>x.p.dir);
 const clue=x=>`<div class="clue"><b>${x.n}</b><span>${esc(x.p.w.m)} <span class="muted">(${x.p.w.L.length} حروف)</span></span></div>`;
 app.innerHTML=`${pageHdr('الكلمات المتقاطعة','اكتبي الكلمة في الخانات بحسب التلميح. الأفقي يُكتب من اليمين إلى اليسار.')}<div class="card center"><div class="cw" style="--cs:${Math.min(40,Math.floor((Math.min(innerWidth,980)-80)/C))}px;grid-template-columns:repeat(${C},var(--cs));direction:rtl">${grid}</div></div><div class="grid"><div class="card"><h3>أفقي ⬅️</h3>${across.map(clue).join('')||'—'}</div><div class="card"><h3>رأسي ⬇️</h3>${down.map(clue).join('')||'—'}</div></div><div class="center"><button class="btn" id="chk">تحقّقي</button> <button class="btn ghost" id="rv">كشف حرف</button></div>`;bindTop();
 const inputs=$$('.cw input');
 inputs.forEach(inp=>{inp.addEventListener('input',()=>{inp.value=inp.value.slice(-1);inp.className=''})});
 $('#chk').onclick=()=>{let ok=0,tot=0;inputs.forEach(inp=>{const ce=cells[inp.dataset.k];tot++;const v=nz(inp.value);if(v&&v===ce.ch){ok++;inp.className='good'}else if(v){inp.className='bad'}});
  if(ok===tot){finish('cw','المتقاطعة',tot,tot)}else{sfx('wrong');toast(`صحيح ${ok} من ${tot}`)}};
 $('#rv').onclick=()=>{const e=inputs.filter(i=>!i.value);if(!e.length)return;const i=e[Math.random()*e.length|0];i.value=cells[i.dataset.k].ch;i.className='good';LS.set('hints',LS.get('hints',0)+1)}}};
/* اختبار وزاري */
GAMES.exam={start(){const kinds=['grammar','spelling','irab','comp','antonym'];const src=QD.EX.filter(x=>x.type!=='fill');const qs=[];kinds.forEach(k=>qs.push(...pick(src.filter(x=>x.kind===(k==='comp'?'comprehension':k)),2)));const all=pick(qs,10).map(prep);let i=0,sc=0;
 const step=()=>{if(i>=all.length)return finish('exam','اختبار على نمط الاختبارات',sc,all.length);
  app.innerHTML=`${topbar()}<div class="card"><div class="bar"><i style="width:${i/all.length*100}%"></i></div><p class="muted">اختبار · سؤال ${i+1} من ${all.length}</p><div id="qb"></div></div>`;bindTop();
  ask($('#qb'),all[i],ok=>{if(ok)sc++;i++;step()})};step()}};

/* الاختبارات المركزية: ورقة بنمط الاختبار (قطعة + أسئلتها + قواعد وإملاء ومفردات) */
const PT={'E1-003':'رِحْلَةُ عُمَرَ إِلَى الشَّاطِئِ','E1-029':'الْمُحَافَظَةُ عَلَى الْمَاءِ','E1-076':'مَدِينَةُ الطَّائِفِ','E2-006':'الشَّجَرَةُ الْعَجُوزُ','E2-030':'أُسَامَةُ وَالسَّاعَةُ','E2-054':'نُورَةُ وَالْفَرَاشَةُ','E2-077':'أَبْيَاتٌ شِعْرِيَّةٌ'};
function centralPapers(){const ex=QD.EX;const groups=[];const idx={};
 ex.forEach(q=>{if(q.passage){if(idx[q.passage]===undefined){idx[q.passage]=groups.length;groups.push({first:q.id,passage:q.passage,qs:[]})}groups[idx[q.passage]].qs.push(q)}});
 const papers=groups.filter(g=>PT[g.first]).map((g,i)=>({n:i+1,title:PT[g.first],read:g.qs}));
 const lang=ex.filter(q=>!q.passage&&q.type!=='fill');
 const sec=q=>q.kind==='grammar'||q.kind==='irab'?2:q.kind==='spelling'?3:4;
 const by={2:lang.filter(q=>sec(q)===2),3:lang.filter(q=>sec(q)===3),4:lang.filter(q=>sec(q)===4)};
 papers.forEach((p,i)=>{const take=(arr,n)=>Array.from({length:Math.min(n,arr.length)},(_,k)=>arr[(i*n+k)%arr.length]);
  p.s2=take(by[2],6);p.s3=take(by[3],4);p.s4=take(by[4],Math.min(2,by[4].length))});
 return papers}
GAMES.central={start(i){const papers=centralPapers();const p=papers[+i||0];if(!p)return home();
 const SEC=[[1,'أَوَّلًا: الْقِرَاءَةُ وَالْفَهْمُ',p.read],[2,'ثَانِيًا: الْقَوَاعِدُ النَّحْوِيَّةُ وَالْإِعْرَابُ',p.s2],[3,'ثَالِثًا: الظَّاهِرَةُ الْإِمْلَائِيَّةُ',p.s3],[4,'رَابِعًا: الْمُفْرَدَاتُ وَالْأَضْدَادُ',p.s4]].filter(x=>x[2].length);
 const all=[];SEC.forEach(x=>x[2].forEach(q=>all.push({sec:x[1],pr:x[0]===1,q:prep(q)})));
 let k=0,sc=0;const miss=[];
 const step=()=>{if(k>=all.length)return end();const it=all[k],q=it.q;
  app.innerHTML=`${topbar()}<div class="card"><div class="center"><h3 style="margin:0">اختبار مركزي (${p.n}) · لغتي · الصف الرابع</h3><div class="muted">${p.title}</div></div><div class="bar" style="margin:8px 0"><i style="width:${k/all.length*100}%"></i></div>
  <p class="chip" style="display:inline-block">${it.sec}</p><p class="muted" style="margin:4px 0">سؤال ${k+1} من ${all.length}</p>
  ${it.pr?`<div class="pass">${esc(q.passage)}</div>`:''}<div class="q" style="margin:10px 0">${esc(q.q)}</div><div class="opts">${q.o.map((t,j)=>`<button class="opt" data-i="${j}">${esc(t)}</button>`).join('')}</div></div>`;bindTop();
  let lock=false;$$('.opt').forEach(b=>b.onclick=()=>{if(lock)return;lock=true;const j=+b.dataset.i;b.style.borderColor='var(--gold)';b.style.background='#ffd54a33';const ok=j===q.a;if(ok)sc++;else miss.push({q,j});setTimeout(()=>{k++;step()},450)})};
 const end=()=>{const rev=miss.map(m=>`<div class="why" style="margin:8px 0;text-align:right"><b>${esc(m.q.q)}</b><br>اختيارك: ${esc(m.q.o[m.j])}<br>الإجابة الصحيحة: <b>${esc(m.q.o[m.q.a])}</b>${m.q.w?'<br>'+esc(m.q.w):''}</div>`).join('');
  finish('central','اختبار مركزي ('+p.n+')',sc,all.length);
  setTimeout(()=>{const c=$('.card.center');if(c)c.insertAdjacentHTML('beforeend',miss.length?`<h3 style="margin-top:14px">راجعي أخطاءك</h3>${rev}`:'<p class="chip" style="display:inline-block;background:var(--ok);color:#06331f">ممتاز! بلا أخطاء 🎉</p>')},60)};
 step()}};
/* الرئيسية */
const PL=[
 ['wheel','عجلة التحدّي','أدِيري واتركي الحظ يختار','coin'],
 ['million','من سيربح المليون','١٥ سؤالًا ومساعدات','trophy'],
 ['alien','الهروب من وحش الأخطاء','أجيبي صح ليبتعد','monster'],
 ['cw','المتقاطعة','كلمات من الكتاب','pencil'],
 ['exam','اختبار وزاري','١٠ أسئلة بنمط الاختبارات','medal'],
 ['comp','فهم المقروء','نص قصير وأسئلة','magnifier'],
 ['planet:antonym','الأضداد','ضدّ الكلمة','globe'],
 ['planet:synonym','المرادفات','الكلمة وأختها','bulb'],
 ['planet:irab','الإعراب','ما وظيفة الكلمة؟','bag'],
 ['planet:plural','الجموع','مفرد وجمع','apple'],
 ['planet:spelling','الإملاء','كتابة صحيحة','book'],
 ['planet:grammar','القواعد','اسم وفعل وحرف','gem']];
const TIPS=['اقرئي السؤال ببطء مرتين قبل أن تختاري الإجابة.','إذا أخطأتِ فلا بأس؛ اقرئي الشرح الذي يظهر، فهو يعلّمك الصواب.','جرّبي كل الألعاب: الأضداد، والمرادفات، والإعراب، والجموع، والإملاء، والقواعد.','في «من سيربح المليون» ثلاث مساعدات تُستخدم كل واحدة مرة واحدة: ٥٠:٥٠، وتغيير السؤال، والتلميح.','في المتقاطعة يُكتب الأفقي من اليمين إلى اليسار، ويمكنك طلب «كشف حرف» عند الحاجة.','في «الهروب من وحش الأخطاء» لا تتجاوزي ثلاثة أخطاء، وكل إجابة صحيحة تُبعد وحش الأخطاء عنك.','بعد كل جولة تصل نتيجتك إلى المعلمة مها، وتحصلين على نجوم وعملات.','العبي مع صديقك أو صديقتك بالتناوب ثم قارنا النتيجة مع المعلمة مها.'];
/* اختبار المعلمة دلال: المبتدأ والخبر + الاسم المجرور (لنادين فقط) */
function examAudio(){return `<div style="background:#fff;border-radius:16px;padding:8px 12px;margin:8px 0"><b>🎧 اسمعي الشرح (دقيقتان ونصف)</b><audio id="exAu" controls preload="none" style="width:100%;margin-top:4px" src="exam_explain.mp3"></audio><div style="display:flex;gap:6px;justify-content:center;flex-wrap:wrap;margin-top:4px"><button class="btn ghost" data-ea="0">من البداية</button><button class="btn ghost" data-ea="14">📝 المبتدأ والخبر</button><button class="btn ghost" data-ea="100">👀 الاسم المجرور</button></div></div>`}
function bindExAudio(){const a=$('#exAu');$$('[data-ea]').forEach(b=>b.onclick=()=>{if(a){a.currentTime=+b.dataset.ea;a.play().catch(()=>{})}})}
function examBanner(){return `<div class="card" style="background:linear-gradient(135deg,#fff3b0,#ffd0e8);border:6px solid #ff3d8b;box-shadow:0 0 0 6px #ffe27a,0 10px 0 #0002;text-align:center"><div style="font:400 1.9rem/1.3 Lalezar,sans-serif;color:#d6195f">📌 بكرة اختبار!</div><div style="font-weight:800;margin:2px 0 8px">اختبار المعلمة دلال القصير</div><div style="background:#fff;border-radius:16px;padding:8px 12px;margin:6px 0"><b style="color:#d6195f">📝 في الاختبار:</b> درس <b>المبتدأ والخبر</b> (ص٧٧–٨٣)</div><div style="background:#fff;border-radius:16px;padding:8px 12px;margin:6px 0"><b style="color:#2f7bd8">👀 اطّلعي عليه:</b> درس <b>الاسم المجرور بحرف الجر</b> (ص٨٤–٩١)، المعلمة طلبت الاطلاع عليه</div>${examAudio()}<div style="display:flex;flex-wrap:wrap;gap:8px;justify-content:center;margin-top:8px"><button class="btn" id="exR">📖 راجعي الشرح بسرعة</button><button class="btn" id="exD" style="background:#34c25a">✍️ طبّقي بنفسكِ</button><button class="btn gold" id="exT">🎮 تدرّبي</button><button class="btn ghost" id="exX">🏆 اختبار بكرة (١٢ سؤالًا)</button></div><p class="muted" style="margin:6px 0 0">ركّزي وكرّري بهدوء، والتوفيق من الله 💗</p></div>`}
function bindExam(){bindExAudio();const r=$('#exR');if(r)r.onclick=()=>GAMES.examrev.start();const t=$('#exT');if(t)t.onclick=()=>GAMES.examrev.start('practice');const d=$('#exD');if(d)d.onclick=()=>GAMES.examdo.start('menu');const x=$('#exX');if(x)x.onclick=()=>GAMES.examtom.start()}
GAMES.examrev={start(mode){const E=window.EXAM||{};let cur=GAMES._exl||'nahw2';
 const draw=()=>{const L=E[cur];app.innerHTML=`${topbar()}<div class="center"><h2>📖 مراجعة اختبار بكرة</h2></div>${examAudio()}<div style="display:flex;gap:8px;justify-content:center;flex-wrap:wrap;margin:8px 0">${['nahw2','nahw3'].map(k=>`<button class="btn ${k===cur?'gold':'ghost'}" data-k="${k}">${E[k].title} ${k==='nahw2'?'(في الاختبار 📝)':'(اطّلعي 👀)'}</button>`).join('')}</div><div class="card"><b>${E[cur].title}</b> <span class="muted">ص${E[cur].pg}</span><p>${esc(L.intro)}</p></div>${L.learn.map((c,i)=>`<div class="card"><h3 style="margin:0">${i+1}. ${esc(c.h)} <span class="muted" style="font-size:.85rem">${esc(c.p||'')}</span></h3><p>${esc(c.t)}</p>${(c.ex||[]).length?`<div style="display:flex;flex-wrap:wrap;gap:6px">${c.ex.map(e=>`<span class="chip" style="background:#fff;color:#2b1b10">${e}</span>`).join('')}</div>`:''}</div>`).join('')}<div class="center" style="margin:12px 0"><button class="btn gold" id="pr">🎮 تدرّبي على ${esc(E[cur].title)}</button> <button class="btn" id="xt">🏆 اختبار بكرة</button> <button class="btn ghost" id="hh">الرئيسية</button></div>`;
  bindTop();bindExAudio();$$('[data-k]').forEach(b=>b.onclick=()=>{cur=GAMES._exl=b.dataset.k;draw();scrollTo(0,0)});$('#pr').onclick=()=>GAMES.lesson.start(cur);$('#xt').onclick=()=>GAMES.examtom.start();$('#hh').onclick=home};
 if(mode==='practice'){app.innerHTML=`${topbar()}<div class="center"><h2>🎮 تدرّبي</h2></div><div class="card center"><button class="btn gold" id="a">${E.nahw2.title}</button> <button class="btn" id="b">${E.nahw3.title}</button></div>`;bindTop();$('#a').onclick=()=>GAMES.lesson.start('nahw2');$('#b').onclick=()=>GAMES.lesson.start('nahw3')}else draw()}};
GAMES.examdo={start(mode){mode=mode||GAMES._edm||'menu';GAMES._edm=mode;
 const back=`<div class="center" style="margin:12px 0"><button class="btn ghost" id="bk">↩ أنشطة التطبيق</button> <button class="btn ghost" id="hh">الرئيسية</button></div>`;
 const bindBack=()=>{bindTop();const b=$('#bk');if(b)b.onclick=()=>GAMES.examdo.start('menu');const h=$('#hh');if(h)h.onclick=home};
 if(mode==='menu'){app.innerHTML=`${topbar()}<div class="center"><h2>✍️ طبّقي بنفسكِ</h2><p class="muted">الفهم الحقيقي أن تركّبي وتكتبي وتمثّلي بنفسكِ.</p></div><div class="card center" style="display:grid;gap:10px"><button class="btn gold" data-m="build">🧩 ركّبي الجملة (مبتدأ وخبر، جار ومجرور)</button><button class="btn" data-m="mark">🔤 اختاري الحركة الصحيحة (ضمة أم كسرة؟)</button><button class="btn ghost" data-m="write">✏️ اكتبي جملكِ أنتِ</button><button class="btn ghost" data-m="act">🎭 مثّلي مع أمّكِ</button></div>`;bindTop();$$('[data-m]').forEach(b=>b.onclick=()=>GAMES.examdo.start(b.dataset.m));return}
 if(mode==='build'){const SN=[['الشَّمْسُ','مُشْرِقَةٌ'],['الطُّيُورُ','مُغَرِّدَةٌ'],['السَّمَاءُ','صَافِيَةٌ'],['الْأَمْطَارُ','غَزِيرَةٌ'],['السَّحَابُ','قَاتِمٌ'],['الْمُتَنَزَّهُ','جَمِيلٌ'],['الْبَيْتُ','نَظِيفٌ'],['الْمَاءُ','بَارِدٌ'],['أَذْهَبُ','إِلَى','الْمَدْرَسَةِ'],['أَجْلِسُ','عَلَى','الْكُرْسِيِّ'],['أَكْتُبُ','فِي','الدَّفْتَرِ'],['أَشْرَبُ','مِنَ','الْكَأْسِ'],['النَّظَافَةُ','مِنَ','الْإِيمَانِ']];
  const qs=pick(SN,8);let i=0,sc=0;
  const step=()=>{if(i>=qs.length)return finish('examdo','طبّقي بنفسكِ: ركّبي الجملة',sc,qs.length);
   const w=qs[i],pool=shuf(w.map((t,k)=>({t,k}))),ans=[];
   const hint=w.length===2?'جملة اسمية: ابدئي بالاسم (المبتدأ) ثم الخبر.':'ابدئي بالفعل ثم حرف الجر ثم الاسم المجرور.';
   const draw=()=>{app.innerHTML=`${topbar()}<div class="card"><div class="bar"><i style="width:${i/qs.length*100}%"></i></div><p class="muted">جملة ${i+1} من ${qs.length}</p><p>رتّبي الكلمات: <span class="muted">${hint}</span></p><div class="q" style="min-height:60px;border-bottom:3px dashed #ccc">${ans.map((x,j)=>`<span class="opt" style="display:inline-block;width:auto;margin:4px" data-a="${j}">${x.t}</span>`).join('')}</div><div>${pool.map((x,j)=>`<span class="opt" style="display:inline-block;width:auto;margin:4px" data-p="${j}">${x.t}</span>`).join('')}</div><div id="fb"></div></div>`;bindTop();
    $$('[data-a]').forEach(b=>b.onclick=()=>{pool.push(ans.splice(+b.dataset.a,1)[0]);draw()});
    $$('[data-p]').forEach(b=>b.onclick=()=>{sfx('tick');ans.push(pool.splice(+b.dataset.p,1)[0]);draw();if(!pool.length){const ok=ans.every((x,j)=>x.k===j);sfx(ok?'correct':'wrong');if(ok)sfx('clap');$('#fb').innerHTML=`<div class="why">${ok?'✅ أحسنتِ! '+(w.length===2?'المبتدأ: <b>'+w[0]+'</b> والخبر: <b>'+w[1]+'</b>':'حرف الجر: <b>'+w[1]+'</b> والاسم المجرور: <b>'+w[2]+'</b>'):'❌ الصحيح: <b>'+w.join(' ')+'</b>'}</div>`;setTimeout(()=>{if(ok)sc++;i++;step()},ok?1800:2600)}})};
   draw()};step();return}
 if(mode==='mark'){const D=[['الشَّمْسُ','مُشْرِقَة',['ٌ','ً','ٍ'],0,'خبر مرفوع'],['الطُّيُورُ','مُغَرِّدَة',['ٌ','ً','ٍ'],0,'خبر مرفوع'],['الْمَاءُ','بَارِد',['ٌ','ً','ٍ'],0,'خبر مرفوع'],['','الْحَقِيبَة',['ُ','َ','ِ'],0,'مبتدأ مرفوع',' ثَقِيلَةٌ'],['','الْبَيْتُ',['ُ','َ','ِ'],0,'مبتدأ مرفوع',' نَظِيفٌ'],['أَذْهَبُ إِلَى','الْمَدْرَسَة',['ُ','َ','ِ'],2,'اسم مجرور بعد «إِلَى»'],['أَجْلِسُ عَلَى','الْكُرْسِيّ',['ُ','َ','ِ'],2,'اسم مجرور بعد «عَلَى»'],['أَكْتُبُ فِي','الدَّفْتَر',['ُ','َ','ِ'],2,'اسم مجرور بعد «فِي»'],['أَشْرَبُ مِنَ','الْكَأْس',['ُ','َ','ِ'],2,'اسم مجرور بعد «مِنْ»']];
  const nm=['الضَّمَّة','الْفَتْحَة','الْكَسْرَة'];const qs=pick(D,8);let i=0,sc=0;
  const step=()=>{if(i>=qs.length)return finish('examdo','طبّقي بنفسكِ: الحركة الصحيحة',sc,qs.length);
   const d=qs[i],jar=d[3]===2;const sent=jar?`${d[0]} <span class="slot">____</span>`:(d[0]?`${d[0]} ${d[1]}<span class="slot">__</span>`:`<span style="display:inline-block">${d[1]}<span class="slot">__</span>${d[5]}</span>`);
   app.innerHTML=`${topbar()}<div class="card"><div class="bar"><i style="width:${i/qs.length*100}%"></i></div><p class="muted">سؤال ${i+1} من ${qs.length}</p><p>ما الحركة الصحيحة على آخر الكلمة؟ <span class="muted">(${d[4]})</span></p><div class="q" style="font-size:1.6rem">${jar?d[0]+' '+d[1]+'<b>___</b>':d[0]?d[0]+' '+d[1]+'<b>__</b>':d[1]+'<b>__</b>'+d[5]}</div><div class="opts">${nm.map((n,k)=>`<button class="opt" data-k="${k}">${n}</button>`).join('')}</div><div id="fb"></div></div>`;bindTop();
   $$('[data-k]').forEach(b=>b.onclick=()=>{const ok=+b.dataset.k===d[3];$$('.opt').forEach(x=>x.disabled=true);b.classList.add(ok?'ok':'no');sfx(ok?'correct':'wrong');if(ok)sfx('clap');
    $('#fb').innerHTML=`<div class="why">${ok?'✅ أحسنتِ! ':'❌ الصحيح: <b>'+nm[d[3]]+'</b>. '}${jar?'بعد حرف الجر يكون الاسم مجرورًا، وعلامته الكسرة تحت آخره (ص٨٧).':'المبتدأ والخبر مرفوعان، وعلامة رفعهما الضمة (ص٧٨–٧٩).'}</div>`;setTimeout(()=>{if(ok)sc++;i++;step()},ok?1500:2800)})};step();return}
 if(mode==='write'){const T=['اكتبي جملتين اسميتين عن بيتكِ أو مدرستكِ (اسم ثم خبر). مثال: الْبَيْتُ نَظِيفٌ.','اكتبي جملتين فيهما حرف جر واسم مجرور من يومكِ. مثال: أَذْهَبُ إِلَى الْمَدْرَسَةِ.'];
  app.innerHTML=`${topbar()}<div class="center"><h2>✏️ اكتبي جملكِ أنتِ</h2></div>${T.map((t,k)=>`<div class="card"><p>${t}</p><textarea id="t${k}" rows="3" style="width:100%;font:inherit;font-size:1.2rem;border:3px solid #ddd;border-radius:12px;padding:8px" placeholder="اكتبي هنا..."></textarea><div class="why" style="margin-top:6px"><b>راجعي كتابتكِ:</b><br><label><input type="checkbox"> ${k?'وجدتُ حرف الجر':'بدأتُ بالاسم'}</label><br><label><input type="checkbox"> ${k?'وضعتُ الكسرة تحت الاسم بعده':'جاء بعده الخبر ويكمل المعنى'}</label><br><label><input type="checkbox"> ${k?'الاسم بعد حرف الجر اسم فعلًا':'ضممتُ آخر المبتدأ والخبر'}</label></div></div>`).join('')}<div class="card center"><button class="btn gold" id="dn">✅ انتهيتُ</button></div>${back}`;bindBack();$('#dn').onclick=()=>{sfx('cheer');confetti(60);toast('ركّزتِ فوصلتِ، والتوفيق من الله 💗')};return}
 if(mode==='act'){app.innerHTML=`${topbar()}<div class="center"><h2>🎭 مثّلي مع مها ومع ياسين</h2></div><div class="card"><b>اللعبة الأولى: «ابدئي بالاسم» (مع مها)</b><p>مها تقول اسمًا مثل: <b>السماء، الماء، الحقيبة</b>، وأنتِ تكملين بسرعة بخبر مناسب وتصفّقين: «السماء صافية!» ثم تقولان معًا: <b>مبتدأ + خبر، ضمّة + ضمّة</b> (تضمّين يديكِ عند كل ضمّة 🤗).</p></div><div class="card"><b>اللعبة الثانية: «احملي الحبل» (مع ياسين صديقكِ)</b><p>ياسين يقول حرف جر: <b>إلى، على، في، من</b>. وأنتِ تقولين جملة فيها هذا الحرف وتنظرين إلى الأرض عند الكسرة (كأن الجرّة سقطت وانكسرت 🏺): «أذهب <b>إلى</b> المدرسةِ».</p></div><div class="card"><b>اللعبة الثالثة: «أنا المعلمة»</b><p>أنتِ المعلمة، ومها وياسين الطالبان: اكتبي لهما ٣ جمل على ورقة، وهما يحدّدان المبتدأ والخبر والجار والمجرور. إذا أخطآ فاشرحي لهما بلطف.</p></div><div class="card center muted">من يشرح لغيره يفهم أكثر 💡</div>${back}`;bindBack();return}
 }};
GAMES.examtom={start(){const qs=pick(lessonItems('nahw2'),12).map(prep);let i=0,sc=0;
 const step=()=>{if(i>=qs.length)return finish('examtom','اختبار بكرة (المبتدأ والخبر)',sc,qs.length);
  app.innerHTML=`${topbar()}<div class="card"><div class="bar"><i style="width:${i/qs.length*100}%"></i></div><p class="muted">سؤال ${i+1} من ${qs.length} · اختبار بكرة</p><div id="qb"></div></div>`;bindTop();
  ask($('#qb'),qs[i],ok=>{if(ok)sc++;i++;step()})};step()}};
function home(){setMas('hide');
 const hist=LS.get('hist',[]);const asg=LS.get('assign',null);
 app.innerHTML=`${topbar()}${P==='nadeen'&&window.EXAM?examBanner():''}<div class="heroc"><div class="hop avw">${spr([P+'_wave1',P+'_wave2'],150,P)}</div><div class="ht"><h1>أهلًا ${NAMES[P]}!</h1><span class="pill">اختاري لعبة وابدئي</span><span class="pill">كل نتيجة تصل إلى المعلمة مها</span></div><span class="hb">${spr(['bee_fly1','bee_fly2'],130,'bee')}</span></div><div class="card center" style="margin-top:0;display:none"></div>${asg?`<div class="chip" style="display:inline-block;background:var(--gold);color:#3b2400">📣 المعلمة طلبت: ${esc(asg.label)} <button class="btn gold" id="goA" style="min-height:36px;padding:4px 14px;margin-right:8px">ابدئي</button></div>`:''}</div>
 <div class="grid">${PL.map((p,i)=>`<div class="planet f${i%4}" data-g="${p[0]}"><img class="stk" src="${IMG}${p[3]}.webp" alt=""><b>${p[1]}</b><small>${p[2]}</small></div>`).join('')}</div>
 ${hist.length?`<div class="card"><h3>آخر نتائجك</h3>${hist.slice(-4).reverse().map(h=>`<div class="clue"><b>${h.stars?starRow(h.stars,h.stars,16):'—'}</b><span>${esc(h.label)}: ${h.score}/${h.max}</span></div>`).join('')}</div>`:''}
 <div class="card"><h3>📚 اختبري نفسك على درس</h3><p class="muted" style="margin:0 0 8px">أسئلة من كل درس في الكتاب، مع الشرح بعد كل إجابة.</p><div style="display:flex;flex-wrap:wrap;gap:8px">${(QD.LQ||[]).filter(l=>!l.id.startsWith('rc')).map(l=>`<button class="btn ghost lq" data-id="${l.id}">${l.title}</button>`).join('')}</div></div>
 <div class="card"><h3>📝 الاختبارات المركزية</h3><p class="muted" style="margin:0 0 8px">ورقة كاملة بنمط الاختبار: قطعة قراءة، ثم قواعد وإعراب، ثم إملاء ومفردات. تظهر النتيجة والمراجعة في النهاية.</p><div style="display:flex;flex-wrap:wrap;gap:8px">${centralPapers().map((p,i)=>`<button class="btn ghost cp" data-i="${i}">اختبار ${p.n}: ${p.title}</button>`).join('')}</div></div>
 ${skyCard()}
 <details class="card" style="cursor:pointer"><summary><b>💡 نصائح للعب</b></summary><div style="margin-top:8px">${TIPS.map(t=>`<div class="clue"><b>•</b><span>${t}</span></div>`).join('')}</div></details>`;bindTop();if(P==='nadeen')bindExam();
 $$('.planet').forEach(el=>el.onclick=()=>{const [g,k]=el.dataset.g.split(':');GAMES[g].start(k)});
 $$('.cp').forEach(b=>b.onclick=()=>GAMES.central.start(+b.dataset.i));
 $$('.lq').forEach(b=>b.onclick=()=>GAMES.lesson.start(b.dataset.id));
 const a=$('#goA');if(a)a.onclick=()=>{LS.set('assign',null);const [g,k]=asg.game.split(':');GAMES[g].start(k)}}
window.GAMES=GAMES;window.home=home;window.NYG={CFG,bus,LS,NAMES,esc,avatar,alienSvg,confetti,topbar,bindTop,sfx,toast,QD,$,$$};
if(P!=='maha'){home();bus.listen(m=>{if(m.t==='assign'&&(m.to===P||m.to==='both')){LS.set('assign',m);toast('📣 رسالة من المعلمة مها');if($('.grid')&&$('h1'))home()}})}
})();
