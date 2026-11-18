const {chromium,devices}=require('/opt/node22/lib/node_modules/playwright');
(async()=>{const b=await chromium.launch();
for(const dev of [{...devices['iPad (gen 7)']},{viewport:{width:1920,height:1080}}]){
const ctx=await b.newContext({...dev,deviceScaleFactor:1});const p=await ctx.newPage();const errs=[];p.on('pageerror',e=>errs.push(String(e)));
await p.goto('file:///home/user/nadeen-yasin-games/mahma/index.html');
await p.fill('#p0','سارة');await p.fill('#p1','هدى');await p.fill('#p2','نورة');await p.click('#go');
const total=await p.evaluate(()=>G.total);
for(let t=0;t<total;t++){
 // stage1: wrong then right
 const P=await p.evaluate(()=>G.P);
 let opts=await p.evaluate(()=>[...document.querySelectorAll('.opt')].map(x=>x.textContent.replace(/‎/g,'')));
 const want=P.ask.replace(/‎/g,'');const ri=opts.indexOf(want);const wi=opts.findIndex((o,i)=>i!==ri);
 if(ri<0){errs.push('no ask opt '+P.id);break}
 await p.click(`.opt[data-k="${wi}"]`);await p.click(`.opt[data-k="${ri}"]`);await p.click('#nx');
 // stage2 givens
 const need=await p.evaluate(()=>{const P=G.P;const toks=[];let pos=0;P.text.split(/(\s+)/).forEach(s=>{if(s.trim())toks.push({s:pos,e:pos+s.length});pos+=s.length});const sp=[];for(const g of P.given){const n=P.text.indexOf(g);if(n>=0)sp.push([n,n+g.length])}return toks.map((k,i)=>sp.some(([a,b])=>k.s<b&&k.e>a)?i:-1).filter(i=>i>=0)});
 await p.click('#ck');for(const i of need)await p.click(`.tk[data-i="${i}"]`);await p.click('#ck');await p.click('#nx');
 for(let k=0;k<P.steps.length;k++){
  const s=P.steps[k];const bad=['+','−','×','÷'].find(x=>x!==s.op);
  await p.click(`.opt[data-o="${bad}"]`);const fb=await p.innerText('#fb');if(!fb.includes('💡'))errs.push('no hint '+P.id);
  await p.click(`.opt[data-o="${s.op}"]`);await p.click('#nx');
  await p.fill('#in','1');await p.click('#ck');await p.fill('#in',String(s.result));await p.click('#ck');await p.click('#nx');}
 // finishTurn -> next
 await p.click('#nx');
}
const cup=await p.evaluate(()=>document.querySelector('.cup')?document.querySelector('h2').textContent:'none');
console.log(dev.viewport?'projector':'ipad','cup:',cup,'total',total,'errors',errs.slice(0,5));
if(dev.viewport)await p.screenshot({path:'/tmp/m4/coach/mahma_end.png'});
await ctx.close();}
await b.close()})().catch(e=>{console.error('FAIL',e.message);process.exit(1)})
