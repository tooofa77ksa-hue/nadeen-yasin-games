const {chromium}=require('/opt/node22/lib/node_modules/playwright');
(async()=>{const b=await chromium.launch();const names=process.argv.slice(2);
for(const n of names){const p=await b.newPage();await p.goto('file:///tmp/m4/out/'+n+'.html');await p.waitForTimeout(900);
await p.pdf({path:'/tmp/m4/out/'+n+'.pdf',format:'A4',printBackground:true,displayHeaderFooter:true,headerTemplate:'<span></span>',footerTemplate:'<div style="font-size:9px;width:100%;text-align:center;font-family:sans-serif"><span class="pageNumber"></span> / <span class="totalPages"></span></div>',margin:{top:'11mm',bottom:'13mm',left:'11mm',right:'11mm'}});await p.close();}
await b.close()})()
