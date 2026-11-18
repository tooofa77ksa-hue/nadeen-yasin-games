const {chromium,devices}=require('/opt/node22/lib/node_modules/playwright');
(async()=>{const b=await chromium.launch();const ctx=await b.newContext({...devices['iPad (gen 7)'],deviceScaleFactor:1});const p=await ctx.newPage();const errs=[];p.on('pageerror',e=>errs.push(String(e)));
await p.goto('file:///home/user/nadeen-yasin-games/nadeen/math_keys.html');
for(let i=0;i<4;i++){await p.click('#fc');await p.click('#k1')}
console.log(await p.innerText('#fc'));
await p.screenshot({path:'/tmp/m4/coach/keys.png',fullPage:true});console.log(errs)
await b.close()})()
