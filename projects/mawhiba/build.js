#!/usr/bin/env node
// يبني نسخة «تدريب موهبة» المشفّرة. صفحات الكتاب تُقرأ من مجلد صور webp (لا تُحفظ في المستودع).
// الاستعمال:  MAWHIBA_PASS='كلمة السر' node build.js <مجلد الصفحات> <مجلد الإخراج>
// لا تضع كلمة السر في أي ملف ولا في المحادثة.
const fs=require('fs'),path=require('path'),c=require('crypto');
const IT=200000,pw=process.env.MAWHIBA_PASS,[src,out]=process.argv.slice(2);
if(!pw||pw.length<6){console.error('ضع كلمة السر (٦ أحرف فأكثر) في MAWHIBA_PASS');process.exit(1)}
fs.mkdirSync(out+'/data',{recursive:true});
const salt=c.randomBytes(16);fs.writeFileSync(out+'/data/salt.bin',salt);
const key=c.pbkdf2Sync(pw,salt,IT,32,'sha256');
const enc=b=>{const iv=c.randomBytes(12),k=c.createCipheriv('aes-256-gcm',key,iv),e=Buffer.concat([k.update(b),k.final()]);return Buffer.concat([iv,e,k.getAuthTag()])};
const R=(a,b)=>Array.from({length:b-a+1},(_,i)=>a+i);
const T=[['الاختبار ١',R(31,35),R(36,37),30,30],['الاختبار ٢',R(38,41),R(42,43),38,38],['الاختبار ٣',R(44,45),[46],null,null],['الاختبار ٤',R(47,49),R(50,51),32,32],['الاختبار ٥',R(52,60),[61],null,null],
['الاختبار ٦',R(63,65),R(66,68),20,25],['الاختبار ٧',R(69,71),R(72,74),20,25],['الاختبار ٨',R(75,77),R(78,80),20,25],['الاختبار ٩',R(81,83),R(84,86),20,25],['الاختبار ١٠',R(87,89),R(90,92),20,25],
['الاختبار ١١',R(94,97),R(98,101),20,25],['الاختبار ١٢',R(102,105),R(106,109),20,25],['الاختبار ١٣',R(110,113),R(114,116),20,25],['الاختبار ١٤',R(120,124),R(125,126),20,25],['الاختبار ١٥',R(127,130),R(131,132),20,25]];
const man={intro:{name:'المقدمة وإرشادات الإجابة',pages:R(1,20)},types:{name:'أنواع الأسئلة وفنيات الإجابة',pages:R(21,29)},tests:T.map((t,i)=>({id:i+1,name:t[0],test:t[1],ans:t[2],n:t[3],min:t[4]}))};
fs.writeFileSync(out+'/data/manifest.bin',enc(Buffer.from(JSON.stringify(man))));
let n=0;for(const f of fs.readdirSync(src).filter(f=>/^p\d+\.webp$/.test(f)).sort()){fs.writeFileSync(out+'/data/'+f.replace('.webp','.bin'),enc(fs.readFileSync(path.join(src,f))));n++}
fs.copyFileSync(path.join(__dirname,'index.src.html'),out+'/index.html');
console.log('تم:',n,'صفحة مشفّرة');
