const {chromium}=require('/opt/node22/lib/node_modules/playwright');
const http=require('http'),fs=require('fs'),path=require('path');
const root=__dirname,types={'.js':'text/javascript','.html':'text/html'};
const srv=http.createServer((q,s)=>{const f=path.join(root,decodeURIComponent(q.url.split('?')[0]));fs.readFile(f,(e,d)=>{if(e){s.writeHead(404);s.end();return}s.writeHead(200,{'content-type':types[path.extname(f)]||'application/octet-stream'});s.end(d)})}).listen(0,async()=>{
  const b=await chromium.launch({args:['--use-gl=swiftshader','--enable-webgl','--ignore-gpu-blocklist']});
  const p=await b.newPage();p.on('console',m=>console.log('page:',m.text()));p.on('pageerror',e=>console.log('ERR',e.message));
  await p.goto('http://localhost:'+srv.address().port+'/export.html');await p.waitForFunction('window.ready');
  fs.mkdirSync(root+'/models/previews',{recursive:true});
  const names=['mother','son','boy_thobe',...[1,2,3,4,5,6,7].map(i=>'kid'+i),'horse_cart'];const info={};
  for(const n of names){const b64=await p.evaluate(n=>window.exportModel(n),n);fs.writeFileSync(`${root}/models/${n}.glb`,Buffer.from(b64,'base64'));
    const r=await p.evaluate(([b,h])=>window.preview(b,h),[b64,n==='horse_cart']);
    fs.writeFileSync(`${root}/models/previews/${n}.png`,Buffer.from(r.png.split(',')[1],'base64'));info[n]=r.size.map(v=>+v.toFixed(2));if(n==='mother')fs.writeFileSync('/tmp/names.txt',r.names.join(' '));}
  console.log(info);await b.close();srv.close();});
