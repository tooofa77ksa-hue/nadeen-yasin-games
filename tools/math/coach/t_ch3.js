const {chromium,devices}=require('/opt/node22/lib/node_modules/playwright');
(async()=>{const b=await chromium.launch();
const ctx=await b.newContext({...devices['iPad (gen 7)'],deviceScaleFactor:1});const p=await ctx.newPage();const errs=[];
p.on('pageerror',e=>errs.push(String(e)));
await p.goto('file:///home/user/nadeen-yasin-games/nadeen/masail_ch3.html');await p.waitForTimeout(300);
const ids=await p.evaluate(()=>SETS.map(s=>s.id));
for(const id of ids){let rounds=0;
 for(let r=0;r<6;r++){
  await p.evaluate(i=>startSet(i),id);
  for(let q=0;q<6;q++){
   const n=await p.evaluate(()=>CUR.steps.length);
   for(let s=0;s<n;s++){
    const st=await p.evaluate(()=>({k:CUR.steps[SI].kind,ci:CUR.steps[SI].ci,ans:CUR.steps[SI].ans,nopts:CUR.steps[SI].opts&&CUR.steps[SI].opts.length,opts:CUR.steps[SI].opts}));
    if(st.k==='choice'){ if(new Set(st.opts).size!==st.opts.length)errs.push(id+' dup opts '+JSON.stringify(st.opts)); await p.click(`.opt[data-i="${st.ci}"]`)}
    else{await p.fill('#in',String(st.ans));await p.click('#ck')}
    await p.click('#nx');}
  }
  if(!(await p.evaluate(()=>!!document.querySelector('.fin'))))errs.push(id+' not finished');rounds++}
 console.log(id,'ok rounds',rounds);}
// exam
await p.evaluate(()=>startExam('period'));const n=await p.evaluate(()=>EQ.length);
for(let i=0;i<n;i++){const has=await p.evaluate(()=>{const q=EQ[EI];return q.options&&q.options.length&&q.ci>=0?q.ci:-1});
 if(has>=0)await p.click(`.opt[data-i="${has}"]`);else await p.click('#sh');await p.click('#nx');}
console.log('exam finished',await p.evaluate(()=>!!document.querySelector('.fin')));
await p.evaluate(()=>startSet('bar'));await p.screenshot({path:'/tmp/m4/coach/c3a.png'});
console.log('errors',errs.slice(0,10));await b.close()})().catch(e=>{console.error('FAIL',e.message);process.exit(1)});
