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
if(P==='yasin'){const MAP=[['أحسنتِ','أحسنتَ'],['بطلة','بطل'],['جرّبي','جرّب'],['حصلتِ','حصلتَ'],['أرسليها','أرسلها'],['العبي','العب'],['أرسلي','أرسل'],['أجيبي','أجب'],['أخطأتِ','أخطأتَ'],['غيّري','غيّر'],['أدِيري','أدِر'],['اقرئي','اقرأ'],['اكتبي','اكتب'],['اختاري','اختر'],['ابدئي','ابدأ'],['اتركي','اترك'],['تحقّقي','تحقّق'],['اللاعبة','اللاعب'],['مرحبًا بكِ','مرحبًا بك'],['افتحي','افتح'],['ألصقي','ألصق'],['قرأتِ','قرأتَ'],['فكّري','فكّر'],['تعلّمتِ','تعلّمتَ'],['تذكّري','تذكّر'],['تأكّدي','تأكّد'],['اضغطي','اضغط'],['استخدمي','استخدم'],['حاولي','حاول'],['ركّزي','ركّز'],['انتبهي','انتبه'],['أكملي','أكمل'],['ارجعي','ارجع'],['تختاري','تختار'],['تتجاوزي','تتجاوز'],['تحصلين','تحصل'],['اربحي','اربح'],['وصلتِ','وصلتَ'],['لكِ','لك'],['أرسليها','أرسلها'],['ألصقي','ألصق']];
 const SKIP='.q,.opt,.pass,.why';
 let busy=false;const fix=root=>{if(busy)return;busy=true;try{const w=document.createTreeWalker(root,NodeFilter.SHOW_TEXT);let n;while(n=w.nextNode()){if(n.parentElement&&n.parentElement.closest(SKIP))continue;let t=n.nodeValue,o=t;for(const [a,b] of MAP)if(t.includes(a))t=t.split(a).join(b);if(t!==o)n.nodeValue=t}}finally{busy=false}};
 new MutationObserver(()=>fix(app)).observe(app,{childList:true,subtree:true});}
/* نجوم الخلفية */
(()=>{const sh=document.createElement('div');sh.className='shoot';document.body.prepend(sh);const d=document.createElement('div');d.id='stars';let h='';for(let i=0;i<70;i++)h+=`<i style="top:${Math.random()*100}%;left:${Math.random()*100}%;animation-delay:${Math.random()*3}s;width:${1+Math.random()*3}px;height:${1+Math.random()*3}px"></i>`;d.innerHTML=h;document.body.prepend(d)})();
/* الأصوات */
const AU={};['correct','wrong','win','cheer','clap'].forEach(n=>{try{const a=new Audio('../shared/sfx/'+n+'.mp3');a.preload='auto';AU[n]=a}catch(e){}});
let muted=LS.get('mute',false);
function sfx(n){if(muted)return;try{const a=AU[n];if(a){a.currentTime=0;a.play().catch(()=>{})}}catch(e){}}
function toast(t){const d=document.createElement('div');d.className='toast';d.textContent=t;document.body.appendChild(d);setTimeout(()=>d.remove(),2600)}
/* نجوم SVG حقيقية */
const STAR_PATH='M12 1.8l2.9 6.2 6.8.8-5 4.7 1.3 6.7L12 16.8 6 20.2l1.3-6.7-5-4.7 6.8-.8z';
(()=>{const d=document.createElement('div');d.style.cssText='position:absolute;width:0;height:0;overflow:hidden';d.innerHTML='<svg width="0" height="0"><defs><linearGradient id="gStar" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#fff3a6"/><stop offset=".5" stop-color="#ffd54a"/><stop offset="1" stop-color="#ff9f1a"/></linearGradient></defs></svg>';document.body.appendChild(d)})();
const starSvg=(on=true,w=34,delay=0)=>`<svg class="rstar ${on?'':'off'}" width="${w}" height="${w}" viewBox="0 0 24 24" style="animation-delay:${delay}s"><path d="${STAR_PATH}" fill="${on?'url(#gStar)':'#9aa3d9'}" stroke="${on?'#b86a00':'#6d76b3'}" stroke-width="1" stroke-linejoin="round"/>${on?'<path d="M12 4.2l1.6 3.8" stroke="#fff" stroke-width="1.4" stroke-linecap="round" opacity=".8"/>':''}</svg>`;
const starRow=(n,total=3,w=34)=>`<span class="starrow">${Array.from({length:total},(_,i)=>starSvg(i<n,w,i*.35)).join('')}</span>`;
const RANKS=[[0,'متدرّبة فضاء','متدرّب فضاء'],[10,'رائدة فضاء','رائد فضاء'],[30,'قائدة المركبة','قائد المركبة'],[60,'بطلة المجرّة','بطل المجرّة'],[100,'ملكة النجوم','ملك النجوم']];
const rankOf=n=>{let r=0;RANKS.forEach((x,i)=>{if(n>=x[0])r=i});return r};
const rankName=i=>RANKS[i][P==='yasin'?2:1];
function skyCard(){const n=LS.get('stars',0),r=rankOf(n),nx=RANKS[r+1];const shown=Math.min(n,160);let h='';
 for(let i=0;i<shown;i++){const fx=k=>{const v=Math.sin((i+1)*k)*43758.5453;return v-Math.floor(v)};h+=`<span class="s" style="left:${3+fx(12.9898)*92}%;top:${6+fx(78.233)*82}%;animation-delay:${fx(39.346)*3}s">${starSvg(true,12+Math.round(fx(11.13)*8))}</span>`}
 return `<div class="card"><h3>✨ سماء نجومي</h3><div class="sky">${h||'<p class="center muted" style="margin-top:80px">اربحي نجومًا وستضيء سماؤك!</p>'}</div>
 <p style="margin:8px 0 0"><b>${n}</b> نجمة · الرتبة: <b>${rankName(r)}</b></p>${nx?`<div class="rankbar"><i style="width:${(n-RANKS[r][0])/(nx[0]-RANKS[r][0])*100}%"></i></div><p class="muted" style="margin:0">تبقّى ${nx[0]-n} نجمة لتصير ${rankName(r+1)}</p>`:'<p class="muted" style="margin:0">وصلتِ إلى أعلى رتبة!</p>'}</div>`}
/* الشخصيات */
const SK={nadeen:'#ffcfa3',yasin:'#f0b98a'};
function avatar(w=64,who=P){
 if(who==='yasin')return `<svg width="${w}" height="${w*1.4}" viewBox="0 0 60 84"><rect x="12" y="2" width="36" height="36" rx="8" fill="#e8eef9"/><rect x="16" y="10" width="28" height="22" rx="6" fill="#142a63"/><rect x="20" y="16" width="6" height="8" rx="2" fill="#7fe8ff"/><rect x="34" y="16" width="6" height="8" rx="2" fill="#7fe8ff"/><path d="M25 27q5 4 10 0" stroke="#7fe8ff" stroke-width="2" fill="none"/><rect x="14" y="40" width="32" height="26" rx="6" fill="#2f7bff"/><rect x="24" y="46" width="12" height="10" rx="3" fill="#ffd54a"/><rect x="2" y="42" width="11" height="22" rx="5" fill="#2f7bff"/><rect x="47" y="42" width="11" height="22" rx="5" fill="#2f7bff"/><rect x="15" y="66" width="13" height="16" rx="4" fill="#1a3e9b"/><rect x="32" y="66" width="13" height="16" rx="4" fill="#1a3e9b"/></svg>`;
 return `<svg width="${w}" height="${w*1.4}" viewBox="0 0 60 84"><circle cx="30" cy="4" r="0"/><g fill="#ff7ac8"><circle cx="14" cy="8" r="5"/><circle cx="24" cy="4" r="5"/><circle cx="36" cy="4" r="5"/><circle cx="46" cy="8" r="5"/></g><g fill="#ffd54a"><circle cx="14" cy="8" r="2"/><circle cx="24" cy="4" r="2"/><circle cx="36" cy="4" r="2"/><circle cx="46" cy="8" r="2"/></g><rect x="10" y="10" width="40" height="30" rx="9" fill="#5a2d82"/><rect x="14" y="14" width="32" height="26" rx="8" fill="${SK.nadeen}"/><rect x="21" y="23" width="5" height="6" rx="2" fill="#2a1a3e"/><rect x="34" y="23" width="5" height="6" rx="2" fill="#2a1a3e"/><path d="M25 33q5 4 10 0" stroke="#c4455b" stroke-width="2" fill="none"/><rect x="14" y="42" width="32" height="24" rx="6" fill="#ff7ac8"/><rect x="2" y="44" width="11" height="20" rx="5" fill="#ff7ac8"/><rect x="47" y="44" width="11" height="20" rx="5" fill="#ff7ac8"/><path d="M12 62h36l6 16H6z" fill="#b66bff"/><rect x="16" y="76" width="11" height="7" rx="3" fill="#5a2d82"/><rect x="33" y="76" width="11" height="7" rx="3" fill="#5a2d82"/></svg>`}
function alienSvg(w=90,mood='x'){return `<svg width="${w}" height="${w}" viewBox="0 0 100 100"><path d="M30 30L22 12M70 30l8-18" stroke="#6ee26e" stroke-width="4"/><circle cx="22" cy="12" r="5" fill="#ffd54a"/><circle cx="78" cy="12" r="5" fill="#ffd54a"/><ellipse cx="50" cy="58" rx="36" ry="32" fill="#6ee26e"/><ellipse cx="38" cy="52" rx="10" ry="12" fill="#fff"/><ellipse cx="62" cy="52" rx="10" ry="12" fill="#fff"/><circle cx="40" cy="54" r="5" fill="#222"/><circle cx="64" cy="54" r="5" fill="#222"/>${mood==='sad'?'<path d="M38 80q12-9 24 0" stroke="#256b25" stroke-width="3.5" fill="none"/>':'<path d="M36 76q14 12 28 0" stroke="#256b25" stroke-width="3.5" fill="none"/>'}</svg>`}
/* الإرسال والاستقبال */
const bus={status:'off',async send(m){m.at=Date.now();try{LS.set('outbox',[...LS.get('outbox',[]).slice(-30),m]);const r=await fetch(CFG.base+CFG.topic,{method:'POST',body:JSON.stringify(m)});return r.ok}catch(e){return false}},
 listen(fn,since){let es;const open=()=>{try{es=new EventSource(CFG.base+CFG.topic+'/sse?since='+(since||'12h'));es.onopen=()=>{bus.status='on';fn({_s:1})};es.onmessage=ev=>{try{const d=JSON.parse(ev.data);if(d.event==='message'){const m=JSON.parse(d.message);m._id=d.id;fn(m)}}catch(e){}};es.onerror=()=>{bus.status='off';fn({_s:1})}}catch(e){}};open();}};
function stars(sc,max){const r=sc/max;return r>=.85?3:r>=.6?2:r>=.3?1:0}
async function finish(game,label,sc,max){
 const st=stars(sc,max);const hist=LS.get('hist',[]);const rec={t:'res',p:P,name:NAMES[P],game,label,score:sc,max,stars:st};
 hist.push(rec);LS.set('hist',hist.slice(-60));
 const coins=LS.get('coins',0)+sc*2+st*5;LS.set('coins',coins);const before=rankOf(LS.get('stars',0));LS.set('stars',LS.get('stars',0)+st);const after=rankOf(LS.get('stars',0));
 const ok=await bus.send(rec);
 const wa='https://wa.me/?text='+encodeURIComponent(`نتيجة ${NAMES[P]} في «${label}»: ${sc} من ${max} ${'⭐'.repeat(st)}`);
 sfx(st>=2?'win':'cheer');
 app.innerHTML=`${topbar()}<div class="card center"><div class="hop" style="display:inline-block">${avatar(90)}</div><h2>${st>=2?'أحسنتِ يا بطلة الفضاء!':st===1?'محاولة جميلة!':'لا بأس، جرّبي مرة ثانية!'}</h2><div style="margin:6px 0">${starRow(st,3,56)}</div><h3>${label}: ${sc} من ${max}</h3><p class="muted">حصلتِ على ${sc*2+st*5} عملة 🪙${st?` و${st} ${st>2?'نجوم':st===2?'نجمتين':'نجمة'} ✨`:''}</p>${after>before?`<p class="chip" style="display:inline-block;background:var(--gold);color:#3b2400">🎖️ رتبة جديدة: ${rankName(after)}</p>`:''}
 <p class="muted">${ok?'وصلت نتيجتك إلى المعلمة مها ✓':'ما وصلت النتيجة للمعلمة الآن؛ أرسليها بالواتساب أو جرّبي لاحقًا.'}</p>
 <div style="display:flex;gap:10px;justify-content:center;flex-wrap:wrap"><button class="btn" id="again">العبي مرة ثانية</button><button class="btn ghost" id="home">الرئيسية</button><a class="btn ghost" target="_blank" rel="noopener" href="${wa}">أرسلي لمعلمتك بالواتساب</a></div></div>`;
 confetti(st*30+10);for(let k=0;k<st;k++)setTimeout(()=>sfx('correct'),400+k*350);$('#again').onclick=()=>{GAMES[game]?GAMES[game].start():home()};$('#home').onclick=home}
function confetti(n=40){const c=['#ffd54a','#ff7ac8','#7fe8ff','#9affc9','#c9a7ff'];for(let i=0;i<n;i++){const d=document.createElement('i');d.style.cssText=`position:fixed;top:-10px;left:${Math.random()*100}%;width:9px;height:14px;background:${c[i%5]};z-index:30;border-radius:2px;transition:transform ${1.6+Math.random()*1.4}s ease-in,opacity 2.6s;pointer-events:none`;document.body.appendChild(d);requestAnimationFrame(()=>{d.style.transform=`translate(${(Math.random()-.5)*240}px,${innerHeight+40}px) rotate(${Math.random()*720}deg)`;d.style.opacity='0'});setTimeout(()=>d.remove(),3200)}}
function topbar(){return `<div class="top"><div class="who">${avatar(40)}<div><h3 style="margin:0">${NAMES[P]}</h3><div class="muted" style="font-size:.85rem">مركز رؤيا وإبداع</div></div></div><div class="chips"><span class="chip">${starSvg(true,18)} ${LS.get('stars',0)}</span><span class="chip">🪙 ${LS.get('coins',0)}</span><button class="chip" id="mt" style="font:inherit;color:inherit;cursor:pointer">${muted?'🔇':'🔊'}</button><button class="chip" id="hm" style="font:inherit;color:inherit;cursor:pointer">🏠</button></div></div>`}
function bindTop(){const m=$('#mt');if(m)m.onclick=()=>{muted=!muted;LS.set('mute',muted);m.textContent=muted?'🔇':'🔊'};const h=$('#hm');if(h)h.onclick=home}
/* أسئلة */
const KINDS={antonym:'الأضداد',synonym:'المرادفات',irab:'الإعراب',plural:'الجموع',comp:'فهم المقروء',spelling:'الإملاء',grammar:'القواعد'};
function pool(kind){
 const q=QD.Q.filter(x=>x.kind===kind);const e=QD.EX.filter(x=>x.kind===kind);
 return [...q,...e];
}
function prep(q){let o=q.o.map((t,i)=>({t,i}));const fixed=q.o.length<=2||(q.type==='tf');if(!fixed)o=shuf(o);return {...q,o:o.map(x=>x.t),a:o.findIndex(x=>x.i===q.a)}}
function ask(box,q,done,opts={}){
 const hide=opts.hide||[];
 box.innerHTML=`${q.passage?`<div class="pass">${esc(q.passage)}</div>`:''}<div class="q" style="margin:10px 0">${esc(q.q)}</div><div class="opts">${q.o.map((t,i)=>`<button class="opt ${hide.includes(i)?'dim':''}" data-i="${i}" ${hide.includes(i)?'disabled':''}>${esc(t)}</button>`).join('')}</div><div id="fb"></div>`;
 let locked=false;
 $$('.opt',box).forEach(b=>b.onclick=()=>{if(locked)return;locked=true;const i=+b.dataset.i,ok=i===q.a;$$('.opt',box).forEach(x=>{if(+x.dataset.i===q.a)x.classList.add('ok')});if(!ok)b.classList.add('no','shake');
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
/* الفضائي */
GAMES.alien={start(kind){kind=kind||GAMES._akind||'mix';GAMES._akind=kind;
 const src=kind==='mix'?['antonym','synonym','irab','plural','grammar','spelling'].flatMap(k=>pick(pool(k),6)):pool(kind);const qs=pick(src,10).map(prep);let i=0,lives=3,sc=0;
 const step=()=>{if(i>=qs.length||lives<=0){const w=lives>0;sfx(w?'win':'wrong');return finish('alien','هروب من الفضائي',sc,qs.length)}
  const pos=Math.min(70,(3-lives)*28);
  app.innerHTML=`${topbar()}<div class="card"><div class="stage"><div style="position:absolute;right:10px;bottom:6px" id="hero">${avatar(54)}</div><div id="alien" style="position:absolute;bottom:4px;left:${16+pos}%">${alienSvg(86,lives<3?'x':'x')}</div></div><div class="chips" style="margin:8px 0"><span class="chip">${'❤️'.repeat(lives)}${'🖤'.repeat(3-lives)}</span><span class="chip">سؤال ${i+1}/${qs.length}</span></div><p class="muted" style="margin:0">أجيبي صح ليبتعد الفضائي، وإذا أخطأتِ يقترب!</p><div id="qb"></div></div>`;bindTop();
  ask($('#qb'),qs[i],ok=>{if(ok){sc++;const a=$('#hero');a.classList.add('hop');confetti(8)}else{lives--}i++;step()})};step()}};
/* مليونير */
const PR=['١٠٠','٢٠٠','٣٠٠','٥٠٠','١٠٠٠','٢٠٠٠','٤٠٠٠','٨٠٠٠','١٦٠٠٠','٣٢٠٠٠','٦٤٠٠٠','١٢٥٠٠٠','٢٥٠٠٠٠','٥٠٠٠٠٠','١٠٠٠٠٠٠'];
GAMES.million={start(){const kinds=['antonym','synonym','irab','plural','grammar','spelling'];let all=kinds.flatMap(k=>pick(pool(k),5));all=pick(all,15).map(prep);
 let i=0,lf={half:1,swap:1,hint:1};let spare=pick(kinds.flatMap(k=>pool(k)),20).map(prep);
 const step=(hide)=>{if(i>=15){return finish('million','من سيربح المليون',15,15)}
  app.innerHTML=`${topbar()}<div style="display:flex;gap:12px;align-items:flex-start"><div class="ladder">${PR.map((p,k)=>`<div class="${k===i?'cur':k<i?'done':''}">${p}</div>`).join('')}</div><div style="flex:1"><div class="card"><div class="chips" style="margin-bottom:6px"><button class="chip lf" data-l="half" ${lf.half?'':'disabled'} style="font:inherit;color:inherit;cursor:pointer">٥٠:٥٠</button><button class="chip lf" data-l="swap" ${lf.swap?'':'disabled'} style="font:inherit;color:inherit;cursor:pointer">🔄 غيّري السؤال</button><button class="chip lf" data-l="hint" ${lf.hint?'':'disabled'} style="font:inherit;color:inherit;cursor:pointer">💡 تلميح</button></div><div id="qb"></div></div></div></div>`;bindTop();
  const q=all[i];ask($('#qb'),q,ok=>{if(ok){i++;step()}else{finish('million','من سيربح المليون',i,15)}},{hide:hide||[]});
  $$('.lf').forEach(b=>b.onclick=()=>{const l=b.dataset.l;lf[l]=0;if(l==='half'){const w=shuf(q.o.map((t,k)=>k).filter(k=>k!==q.a)).slice(0,2);step(w)}else if(l==='swap'){all[i]=spare.pop();step()}else{toast('تلميح: الإجابة تبدأ بحرف «'+nz(q.o[q.a]).replace(/^ال/,'').charAt(0)+'»');b.disabled=true}})};step()}};
/* العجلة */
const WH=[['antonym','أضداد','#ff7ac8'],['synonym','مرادفات','#8f6bff'],['irab','إعراب','#39b6ff'],['plural','جموع','#27e0c0'],['comp','فهم مقروء','#ffd54a'],['mix','اختبار منوّع','#ff9f43']];
GAMES.wheel={start(){const n=WH.length,ang=360/n;
 let seg='';WH.forEach((w,k)=>{const a0=(k*ang-90)*Math.PI/180,a1=((k+1)*ang-90)*Math.PI/180;const x0=150+140*Math.cos(a0),y0=150+140*Math.sin(a0),x1=150+140*Math.cos(a1),y1=150+140*Math.sin(a1);const m=(k+.5)*ang;seg+=`<path d="M150 150L${x0} ${y0}A140 140 0 0 1 ${x1} ${y1}Z" fill="${w[2]}" stroke="#fff" stroke-width="3"/><text x="150" y="${Math.cos(m*Math.PI/180)<0?262:40}" transform="rotate(${Math.cos(m*Math.PI/180)<0?m+180:m} 150 150)" text-anchor="middle" font-family="Lalezar,Tajawal" font-size="19" fill="#1a1040">${w[1]}</text>`});
 app.innerHTML=`${pageHdr('عجلة التحدّي','أدِيري العجلة، وسيختار لك الفضاء تحدّيًا!')}<div class="wheelwrap"><div class="ptr"></div><svg id="wheel" viewBox="0 0 300 300"><circle cx="150" cy="150" r="146" fill="#fff"/>${seg}<circle cx="150" cy="150" r="18" fill="#1a1040" stroke="#ffd54a" stroke-width="4"/></svg></div><div class="center"><button class="btn gold" id="spin" style="font-size:1.3rem;padding:14px 34px">أدِيري! 🚀</button></div>`;bindTop();
 let rot=0;$('#spin').onclick=()=>{const b=$('#spin');b.disabled=true;sfx('cheer');const k=Math.random()*n|0;const target=360*6+(360-(k+.5)*ang);rot=Math.ceil(rot/360)*360+target;$('#wheel').style.transform=`rotate(${rot}deg)`;
  setTimeout(()=>{const w=WH[k];toast('التحدّي: '+w[1]);confetti(30);sfx('win');setTimeout(()=>{if(w[0]==='comp')GAMES.comp.start();else if(w[0]==='mix')GAMES.alien.start('mix');else GAMES.planet.start(w[0])},1200)},4700)}}};
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
/* الرئيسية */
const PL=[
 ['wheel','عجلة التحدّي','أدِيري واتركي الفضاء يختار','#ff7ac8'],
 ['million','من سيربح المليون','١٥ سؤالًا ومساعدات','#ffd54a'],
 ['alien','الهروب من الفضائي','أجيبي صح ليبتعد','#6ee26e'],
 ['cw','المتقاطعة','كلمات من الكتاب','#39b6ff'],
 ['exam','اختبار وزاري','١٠ أسئلة بنمط الاختبارات','#ff9f43'],
 ['comp','فهم المقروء','نص قصير وأسئلة','#8f6bff'],
 ['planet:antonym','كوكب الأضداد','ضدّ الكلمة','#27e0c0'],
 ['planet:synonym','كوكب المرادفات','الكلمة وأختها','#c9a7ff'],
 ['planet:irab','كوكب الإعراب','ما وظيفة الكلمة؟','#ff6b81'],
 ['planet:plural','كوكب الجموع','مفرد وجمع','#7fe8ff'],
 ['planet:spelling','كوكب الإملاء','كتابة صحيحة','#9affc9'],
 ['planet:grammar','كوكب القواعد','اسم وفعل وحرف','#ffb347']];
const TIPS=['اقرئي السؤال ببطء مرتين قبل أن تختاري الإجابة.','إذا أخطأتِ فلا بأس؛ اقرئي الشرح الذي يظهر، فهو يعلّمك الصواب.','جرّبي كل الكواكب: الأضداد، والمرادفات، والإعراب، والجموع، والإملاء، والقواعد.','في «من سيربح المليون» ثلاث مساعدات تُستخدم كل واحدة مرة واحدة: ٥٠:٥٠، وتغيير السؤال، والتلميح.','في المتقاطعة يُكتب الأفقي من اليمين إلى اليسار، ويمكنك طلب «كشف حرف» عند الحاجة.','في «الهروب من الفضائي» لا تتجاوزي ثلاثة أخطاء، وكل إجابة صحيحة تُبعد الفضائي عنك.','بعد كل جولة تصل نتيجتك إلى المعلمة مها، وتحصلين على نجوم وعملات.','العبي مع صديقك أو صديقتك بالتناوب ثم قارنا النتيجة مع المعلمة مها.'];
function home(){
 const hist=LS.get('hist',[]);const asg=LS.get('assign',null);
 app.innerHTML=`${topbar()}<div class="card center"><div class="hop" style="display:inline-block">${avatar(84)}</div><h1>أهلًا ${NAMES[P]}!</h1><p class="muted">اختاري كوكبًا وابدئي رحلتك. كل نتيجة تصل إلى المعلمة مها.</p>${asg?`<div class="chip" style="display:inline-block;background:var(--gold);color:#3b2400">📣 المعلمة طلبت: ${esc(asg.label)} <button class="btn gold" id="goA" style="min-height:36px;padding:4px 14px;margin-right:8px">ابدئي</button></div>`:''}</div>
 <div class="grid">${PL.map(p=>`<div class="planet" data-g="${p[0]}"><div class="pl" style="background:radial-gradient(circle at 35% 30%,#fff8,${p[3]})"></div><b>${p[1]}</b><small>${p[2]}</small></div>`).join('')}</div>
 ${hist.length?`<div class="card"><h3>آخر نتائجك</h3>${hist.slice(-4).reverse().map(h=>`<div class="clue"><b>${h.stars?starRow(h.stars,h.stars,16):'—'}</b><span>${esc(h.label)}: ${h.score}/${h.max}</span></div>`).join('')}</div>`:''}
 ${skyCard()}
 <details class="card" style="cursor:pointer"><summary><b>💡 نصائح للعب</b></summary><div style="margin-top:8px">${TIPS.map(t=>`<div class="clue"><b>•</b><span>${t}</span></div>`).join('')}</div></details>`;bindTop();
 $$('.planet').forEach(el=>el.onclick=()=>{const [g,k]=el.dataset.g.split(':');sfx('clap');GAMES[g].start(k)});
 const a=$('#goA');if(a)a.onclick=()=>{LS.set('assign',null);const [g,k]=asg.game.split(':');GAMES[g].start(k)}}
window.GAMES=GAMES;window.home=home;window.NYG={CFG,bus,LS,NAMES,esc,avatar,alienSvg,confetti,topbar,bindTop,sfx,toast,QD,$,$$};
if(P!=='maha'){home();bus.listen(m=>{if(m.t==='assign'&&(m.to===P||m.to==='both')){LS.set('assign',m);toast('📣 رسالة من المعلمة مها');if($('.grid')&&$('h1'))home()}})}
})();
