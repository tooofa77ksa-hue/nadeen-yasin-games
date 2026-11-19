const {chromium}=require('/opt/node22/lib/node_modules/playwright');
(async()=>{const b=await chromium.launch();
async function run(vp,n,tag,rounds){const p=await b.newPage({viewport:vp});const e=[];p.on('pageerror',x=>e.push(x.message));p.on('console',m=>{if(m.type()=='error')e.push(m.text())});
await p.goto('file:///home/user/nadeen-yasin-games/olom/index.html');

await p.click('button.chip:has-text("٥"):not(:has-text("ف"))').catch(()=>{});
await p.click('button.main:has-text("هيا نبدأ")');
const types={};let wrongDone=false;
for(let i=0;i<n*rounds+4;i++){
 if(await p.$('.cup'))break;
 await p.waitForSelector('.q',{timeout:5000}).catch(()=>{});
 const hasOpt=await p.$('.opt');const hasReveal=await p.$('button.main:has-text("نكشف")');
 const id=await p.evaluate(()=>cur.id);const q=await p.evaluate(()=>cur);types[q.type]=(types[q.type]||0)+1;
 if(q.type=='mcq'){
  const btns=await p.$$('.opt');
  if(!wrongDone){for(const bt of btns){const o=await bt.getAttribute('data-o');if(!o.trim().startsWith(q.letter+')')){await bt.click();break}}wrongDone=true;await p.waitForSelector('.hint');console.log(tag,'wrong→',(await p.textContent('#fb')).slice(0,140).replace(/\s+/g,' '))}
  for(const bt of await p.$$('.opt:not([disabled])')){const o=await bt.getAttribute('data-o');if(o.trim().startsWith(q.letter+')')){await bt.click();break}}
 }else if(q.type=='tf'){const t=q.ans;await p.click('.opt:has-text("'+t+'")')}
 else{await p.click('button.main:has-text("نكشف")');await p.waitForSelector('.ans');await p.click(i%3==2?'button.no':'button.ok')}
 await p.waitForTimeout(q.type=='self'?1100:(wrongDone&&i==0?4300:1500));
}
await p.waitForSelector('.cup',{timeout:15000}).catch(async()=>{console.log(tag,'STUCK',(await p.textContent('#app')).slice(0,200));process.exit()});
console.log(tag,types,(await p.textContent('h2')),e);await p.screenshot({path:'/tmp/sci/o_'+tag+'.png',fullPage:true});await p.close()}
await run({width:810,height:1080},1,'solo',5);await run({width:1920,height:1080},1,'proj',5);await b.close()})()
