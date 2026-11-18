const {chromium,devices}=require('/opt/node22/lib/node_modules/playwright');
(async()=>{const b=await chromium.launch();
for(const ch of ['4','5','3w']){
 const ctx=await b.newContext({...devices['iPad (gen 7)'],deviceScaleFactor:1});const p=await ctx.newPage();const errs=[];
 p.on('pageerror',e=>errs.push(String(e)));
 await p.goto('file:///home/user/nadeen-yasin-games/nadeen/masail_ch'+ch+'.html');await p.waitForTimeout(400);
 if(ch==='5')await p.screenshot({path:'/tmp/m4/coach/m5.png'});
 const sets=await p.evaluate(()=>[...document.querySelectorAll('.opt[data-s]')].map(b=>[b.dataset.s,b.innerText.replace(/\s+/g,' ')]));
 let total=0;
 for(const [id,label] of sets){
  await p.click(`.opt[data-s="${id}"]`);const n=await p.evaluate(()=>DECK.length);
  for(let k=0;k<n;k++){
   await p.click('#nx');await p.click('#nx');
   for(const i of await p.evaluate(()=>[...GS]))await p.click(`.tk[data-i="${i}"]`);await p.click('#ck');
   for(const i of await p.evaluate(()=>[...AS]))await p.click(`.tk[data-i="${i}"]`);await p.click('#ck');
   if(await p.evaluate(()=>P.mode)==='choose'){await p.click(`.opt[data-i="${await p.evaluate(()=>P.correct_index)}"]`)}
   else{const st=await p.evaluate(()=>P.steps.map(s=>[s.op,s.result]));
    for(let j=0;j<st.length;j++){await p.click(`.op[data-o="${st[j][0]}"]`);await p.click('#nx');await p.fill('#in',String(st[j][1]));await p.click('#ck');if(j<st.length-1)await p.click('#nx')}}
   await p.click('#nx');}
  const fin=await p.evaluate(()=>!!document.querySelector('.fin'));total+=n;
  console.log(ch,id,label.slice(0,60),'n',n,'finished',fin);
  await p.click('#mn');}
 console.log('ch',ch,'errors',errs);await ctx.close();}
await b.close()})().catch(e=>{console.error('FAIL',e.message);process.exit(1)});
