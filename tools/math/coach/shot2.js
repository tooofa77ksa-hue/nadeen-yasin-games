const {chromium,devices}=require('/opt/node22/lib/node_modules/playwright');
(async()=>{const b=await chromium.launch();const ctx=await b.newContext({...devices['iPad (gen 7)'],deviceScaleFactor:1});const p=await ctx.newPage();const errs=[];p.on('pageerror',e=>errs.push(String(e)));
await p.goto('file:///home/user/nadeen-yasin-games/markaz/index.html');
const picks=await p.evaluate(()=>{const all=Object.values(DATA).flat().filter(i=>i.html);return {n:all.length,spin:(all.find(i=>/circle/.test(i.html)&&/polygon/.test(i.html))||{}).id,bar:(all.find(i=>/<rect/.test(i.html)&&!/circle r="1[0-9][0-9]"/.test(i.html))||{}).id,line:(all.find(i=>/polyline/.test(i.html))||{}).id,pie:(all.find(i=>/<path/.test(i.html))||{}).id,table:(all.find(i=>/<table/.test(i.html))||{}).id}});
console.log(picks);
for(const k of ['spin','bar','line','pie','table']){if(!picks[k])continue;await p.evaluate(id=>{MODE='solo';play(id)},picks[k]);await p.waitForTimeout(250);
 // pass task stage
 const had=await p.evaluate(()=>{const m=document.querySelector('.mount');return !!(m&&m.shadowRoot&&m.shadowRoot.querySelector('svg,table'))});
 await p.waitForTimeout(900);await p.screenshot({path:`/tmp/m4/coach/an_${k}.png`,clip:{x:0,y:100,width:810,height:520}});console.log(k,had)}
console.log('errors',errs);await b.close()})()
