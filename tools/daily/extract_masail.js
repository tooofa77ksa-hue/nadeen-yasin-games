const fs=require('fs');
function grab(h,name){const re=new RegExp('const '+name+'=\\[');const i=h.search(re);if(i<0)return null;let j=i+('const '+name+'=').length,d=0,k=j,inS=null;
 for(;k<h.length;k++){const c=h[k];if(inS){if(c==='\\\\'){k++;continue}if(c===inS)inS=null;continue}if(c==='"'||c==="'"||c==='`'){inS=c;continue}if(c==='[')d++;else if(c===']'){d--;if(d===0){k++;break}}}
 return (new Function('return '+h.slice(j,k)))()}
const out={};
for(const f of ['masail_ch3w','masail_ch4','masail_ch5']){const h=fs.readFileSync(f+'.html','utf8');out[f]=grab(h,'ALLP');}
for(const f of ['masail_ch3','masail_ch4_exam']){const h=fs.readFileSync(f+'.html','utf8');out[f]=grab(h,'EXAMS');}
fs.writeFileSync('/tmp/masail.json',JSON.stringify(out));
for(const k in out){const a=out[k];console.log(k,a&&a.length,JSON.stringify(a&&a[0]).slice(0,500))}
