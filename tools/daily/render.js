// node render.js in.html out.pdf
const {chromium}=require(process.env.PW||'/opt/node22/lib/node_modules/playwright');
(async()=>{const b=await chromium.launch();const p=await b.newPage({viewport:{width:794,height:1123}});
await p.goto('file://'+process.argv[2]);await p.waitForTimeout(1500);
await p.pdf({path:process.argv[3],format:'A4',printBackground:true});await b.close()})()
