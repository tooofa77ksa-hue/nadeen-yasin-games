/* يبني بنك أسئلة العلوم لموقعَي نادين وياسين من بيانات الفصول (كتاب العلوم) */
const fs=require('fs'),path=require('path');global.window={};
const D=path.join(__dirname,'../hanan/data/');
['c1','c2','c3','c4','c5'].forEach(c=>require(D+c+'.js'));
const C=Object.values(window.CHAPTERS).sort((a,b)=>a.id.localeCompare(b.id));
let seed=7;const rnd=()=>{seed=(seed*16807)%2147483647;return(seed-1)/2147483646};
const shuf=a=>{a=[...a];for(let i=a.length-1;i>0;i--){const j=rnd()*(i+1)|0;[a[i],a[j]]=[a[j],a[i]]}return a};
const pg=p=>p?'ص'+String(p).replace(/^ص/,''):'';
const plain=s=>String(s).replace(/<[^>]+>/g,'');
const mc=(kind,q,right,wrongs,w,p,extra={})=>{const ws=[...new Set(wrongs.filter(x=>x&&x!==right))];if(ws.length<1)return null;const o=shuf([right,...shuf(ws).slice(0,3)]);return {kind,q,o,a:o.indexOf(right),w:w||'',pg:p?pg(p):'',...extra}};
const Q=[],EX=[],WORDS=[],LQ=[],PAPERS=[];
const termsOf=c=>{const m=new Map();(c.vocab||[]).forEach(v=>m.set(v.w,{w:v.w,d:v.d,p:v.pg||c.vpg||'',img:v.img}));c.parts.forEach(p=>(p.words||[]).forEach(w=>{if(!m.has(w[0]))m.set(w[0],{w:w[0],d:w[1],p:w[2]})}));return [...m.values()]};
function partItems(c,p,terms){const it=[];
 (p.qs||[]).forEach(q=>{if(q.o&&q.o.length>=2&&q.a>=0)it.push({kind:'facts',q:plain(q.q),o:q.o,a:q.a,w:q.w||'',pg:pg(q.p||p.pg)})});
 (p.games||[]).forEach(g=>{
  if(g.type==='sort'){const bins=g.bins.map(b=>b[1]);g.items.forEach(x=>{const bi=g.bins.findIndex(b=>b[0]===x[2]);if(bi<0)return;const o=bins.slice();it.push({kind:'classify',q:`${g.t} «${x[1]}»`,o,a:bi,w:`«${x[1]}» ← ${bins[bi]}`,pg:pg(p.pg),fixed:o.length<=2,img:x[0]||undefined})})}
  if(g.type==='order'){const L=g.items.map(x=>x[1]);for(let i=0;i<L.length-1;i++){const others=L.filter((x,k)=>k!==i+1&&k!==i);const m=mc('order',`${g.t}: ما الذي يأتي بعد «${L[i]}»؟`,L[i+1],others,`الترتيب: ${L.join(' ← ')}`,p.pg);if(m)it.push(m)}}});
 if(p.tf)p.tf.items.forEach(x=>it.push({kind:'tf',type:'tf',q:plain(x[0]),o:['صحيحة','خاطئة'],a:x[1]?0:1,w:x[2]||'',pg:pg(p.tf.pg)}));
 if(p.fill){const bank=p.fill.bank;p.fill.items.forEach(x=>{const right=bank[x[1]];const m=mc('fill',plain(x[0]).replace(/_+/g,'……'),right,bank,`الكلمة الصحيحة: ${right}`,p.fill.pg);if(m)it.push(m)})}
 return it}
C.forEach(c=>{const terms=termsOf(c);
 terms.forEach(t=>{const wd=terms.filter(x=>x.w!==t.w).map(x=>x.d);const m1=mc('vocab',`ما معنى «${t.w}»؟`,t.d,wd,`${t.w}: ${t.d}`,t.p,t.img?{img:t.img}:{});if(m1)Q.push(m1);
  const wt=terms.filter(x=>x.w!==t.w).map(x=>x.w);const m2=mc('vocab',`أيُّ كلمةٍ معناها: «${t.d}»؟`,t.w,wt,`${t.w}: ${t.d}`,t.p);if(m2)Q.push(m2);
  WORDS.push({w:t.w,m:t.d,p:pg(t.p)})});
 const paperSecs=[[],[],[]];
 c.parts.forEach(p=>{const items=partItems(c,p,terms);
  items.forEach(x=>{if(x.kind==='facts'||x.kind==='classify'||x.kind==='order'||x.kind==='tf'||x.kind==='fill')Q.push({...x,src:'ك'})});
  if(items.length)LQ.push({id:c.id+'_'+p.id,cid:c.id,title:p.title,pg:String(p.pg||'').replace(/^ص/,''),items});
  if(p.kind==='review'){
   if(p.fill)p.fill.items.forEach(x=>{const right=p.fill.bank[x[1]];const m=mc('fill',plain(x[0]).replace(/_+/g,'……'),right,p.fill.bank,`الكلمة الصحيحة: ${right}`,p.fill.pg);if(m){paperSecs[0].push(m);EX.push({...m,id:c.id+'-f'+paperSecs[0].length})}});
   if(p.tf)p.tf.items.forEach(x=>{const m={kind:'tf',type:'tf',q:plain(x[0]),o:['صحيحة','خاطئة'],a:x[1]?0:1,w:x[2]||'',pg:pg(p.tf.pg)};paperSecs[1].push(m);EX.push({...m,id:c.id+'-t'+paperSecs[1].length})});
   (p.qs||[]).forEach((q,i)=>{if(q.o&&q.o.length>=2&&q.a>=0){const m={kind:'exam',q:plain(q.q),o:q.o,a:q.a,w:q.w||'',pg:pg(q.p||p.pg)};paperSecs[2].push(m);EX.push({...m,id:c.id+'-q'+(i+1)})}})}});
 PAPERS.push({n:PAPERS.length+1,cid:c.id,title:c.title,pg:c.pg,secs:[['أَوَّلًا: أَكْمِلْ بِالْكَلِمَةِ الصَّحِيحَةِ',paperSecs[0]],['ثَانِيًا: صَحِيحَةٌ أَمْ خَاطِئَةٌ؟',paperSecs[1]],['ثَالِثًا: اخْتَرِ الْإِجَابَةَ الصَّحِيحَةَ',paperSecs[2]]].filter(s=>s[1].length)})});
const out={Q,EX,WORDS,LQ,PAPERS};
fs.writeFileSync(path.join(__dirname,'../shared/q.js'),'window.QD='+JSON.stringify(out)+';');
const cnt={};Q.forEach(q=>cnt[q.kind]=(cnt[q.kind]||0)+1);
console.log('Q',Q.length,cnt,'EX',EX.length,'WORDS',WORDS.length,'LQ',LQ.length,'PAPERS',PAPERS.map(p=>p.secs.map(s=>s[1].length).join('/')).join(' | '));
