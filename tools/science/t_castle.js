const {chromium}=require('/opt/node22/lib/node_modules/playwright');
(async()=>{const b=await chromium.launch();const p=await b.newPage({viewport:{width:810,height:1300}});const e=[];p.on('pageerror',x=>e.push(x.message));
await p.goto('file:///home/user/nadeen-yasin-games/olom/index.html');
await p.click('button:has-text("قلعة الذاكرة")');await p.waitForSelector('.opt');console.log('lessons',(await p.$$('.opt')).length);
await p.click('.opt >> nth=0');
for(let i=0;i<20;i++){const b1=await p.$('button.main:has-text("تخيّلناها")');if(!b1)break;await b1.click();await p.waitForTimeout(80)}
await p.screenshot({path:'/tmp/sci/c1.png'});
for(let i=0;i<20;i++){if(!await p.$('button.main:has-text("نكشف")'))break;await p.click('button.main:has-text("نكشف")');await p.click('button.ok');await p.waitForTimeout(80)}
console.log((await p.textContent('h2')),e);await p.screenshot({path:'/tmp/sci/c2.png'});await b.close()})()
