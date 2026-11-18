const {chromium,devices}=require('/opt/node22/lib/node_modules/playwright');
(async()=>{const b=await chromium.launch();const ctx=await b.newContext({...devices['iPad (gen 7)'],deviceScaleFactor:1});const p=await ctx.newPage();const errs=[];p.on('pageerror',e=>errs.push(String(e)));
await p.goto('file:///home/user/nadeen-yasin-games/markaz/index.html');
const ids=await p.evaluate(()=>Object.entries(DATA).flatMap(([c,a])=>a.map(i=>i.id)));
let n=0,taskless=0;
for(const id of ids){await p.evaluate(i=>play(i),id);n++;
 // stage task
 if(await p.$('.stage')){const t=await p.evaluate(()=>task(CUR));
  const txt=await p.evaluate(()=>document.querySelector('.stage').textContent);
  if(txt.includes('المرحلة ١')){const opts=await p.evaluate(()=>[...document.querySelectorAll('.opt')].map(x=>x.textContent.replace(/‎/g,'')));
   const want=t.replace(/‎/g,'');const k=opts.findIndex(o=>o===want);if(k<0){errs.push('no task opt '+id);continue}
   // wrong first
   const w=opts.findIndex((o,j)=>j!==k);await p.click(`.opt[data-k="${w}"]`);
   await p.click(`.opt[data-k="${k}"]`);await p.click('#go');}}
 const it=await p.evaluate(()=>({k:CUR.kind,a:CUR.ans}));
 if(it.k==='mcq'){await p.click(`.opt[data-k="${it.a}"]`)}
 else if(it.k==='tf'){await p.click(`.opt[data-k="${it.a?1:0}"]`)}
 else if(it.k==='num'){await p.fill('#in',String(it.a));await p.click('#ck')}
 else{await p.click('#sh');for(let s=0;s<30;s++){if(await p.$('#mr'))await p.click('#mr');else break}await p.click('#y');continue}
 await p.click('#nx');}
console.log('levels',n);
// wrong answers path (hints) on one mcq
await p.evaluate(()=>{MODE='solo';const i=Object.values(DATA).flat().find(x=>x.kind==='mcq');play(i.id)});
// contest
await p.evaluate(()=>home());await p.evaluate(()=>contestSetup());await p.fill('#p1','سارة');await p.fill('#p2','هدى');await p.evaluate(()=>contestStart(0));
for(let q=0;q<10;q++){const it=await p.evaluate(()=>({k:CUR.kind,a:CUR.ans}));
 if(q%3===1){ // wrong twice
  if(it.k==='mcq'){const w=await p.evaluate(()=>CUR.ans===0?1:0);await p.click(`.opt[data-k="${w}"]`);await p.click(`.opt[data-k="${w}"]`).catch(()=>{});}
  else if(it.k==='tf'){const w=it.a?0:1;await p.click(`.opt[data-k="${w}"]`)}
  else{await p.fill('#in','99999');await p.click('#ck');await p.fill('#in','88888');await p.click('#ck')}
  if(!(await p.$('#cn'))){ // second wrong
   if(it.k==='mcq'){const opts=await p.evaluate(()=>CUR.o.length);for(let k=0;k<opts&&!(await p.$('#cn'));k++){if(k!==it.a)await p.click(`.opt[data-k="${k}"]`).catch(()=>{})}}
   else if(it.k==='tf'){await p.click(`.opt[data-k="${it.a?0:1}"]`).catch(()=>{})}}
 }else{
  if(it.k==='mcq')await p.click(`.opt[data-k="${it.a}"]`);else if(it.k==='tf')await p.click(`.opt[data-k="${it.a?1:0}"]`);else{await p.fill('#in',String(it.a));await p.click('#ck')}}
 await p.waitForSelector('#cn',{timeout:3000});await p.click('#cn');}
console.log('cup:',await p.evaluate(()=>document.querySelector('.cup')?document.querySelector('h2').textContent:'none'));
await p.screenshot({path:'/tmp/m4/coach/games_cup.png'});
await p.evaluate(()=>home());await p.evaluate(()=>chapter(3));await p.screenshot({path:'/tmp/m4/coach/games_ch.png'});
console.log('errors',errs.slice(0,8));await b.close()})().catch(e=>{console.error('FAIL',e.message);process.exit(1)})
