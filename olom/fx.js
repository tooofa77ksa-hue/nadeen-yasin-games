/* مؤثرات: تصفيق، مفرقعات، أصوات (بلا ملفات صوت، تعمل على iPad بعد أول لمسة) */
(function(){
var AC=null,muted=false;try{muted=localStorage.getItem('fx_muted')==='1'}catch(e){}
function ctx(){if(!AC){try{AC=new (window.AudioContext||window.webkitAudioContext)()}catch(e){}}if(AC&&AC.state==='suspended')AC.resume();return AC}
['click','touchstart','keydown'].forEach(function(ev){window.addEventListener(ev,function(){ctx()},{once:true,passive:true})});
function tone(f,t0,d,type,vol,slide){var c=ctx();if(!c||muted)return;var o=c.createOscillator(),g=c.createGain();o.type=type||'sine';o.frequency.setValueAtTime(f,c.currentTime+t0);if(slide)o.frequency.exponentialRampToValueAtTime(slide,c.currentTime+t0+d);g.gain.setValueAtTime(0.0001,c.currentTime+t0);g.gain.exponentialRampToValueAtTime(vol||0.18,c.currentTime+t0+0.02);g.gain.exponentialRampToValueAtTime(0.0001,c.currentTime+t0+d);o.connect(g);g.connect(c.destination);o.start(c.currentTime+t0);o.stop(c.currentTime+t0+d+0.05)}
function noise(t0,d,vol,fq){var c=ctx();if(!c||muted)return;var n=c.sampleRate*d,b=c.createBuffer(1,n,c.sampleRate),a=b.getChannelData(0);for(var i=0;i<n;i++)a[i]=(Math.random()*2-1)*Math.pow(1-i/n,1.5);var s=c.createBufferSource();s.buffer=b;var f=c.createBiquadFilter();f.type='bandpass';f.frequency.value=fq||1800;f.Q.value=0.7;var g=c.createGain();g.gain.value=vol||0.25;s.connect(f);f.connect(g);g.connect(c.destination);s.start(c.currentTime+t0)}
var FX={
 pop:function(){tone(520,0,0.12,'sine',0.2,980);tone(880,0.08,0.14,'triangle',0.15)},
 ding:function(){[784,988,1175].forEach(function(f,i){tone(f,i*0.08,0.25,'triangle',0.17)})},
 applause:function(sec){sec=sec||1.2;for(var i=0;i<Math.floor(sec*18);i++)noise(i*0.055+Math.random()*0.03,0.07+Math.random()*0.05,0.14+Math.random()*0.12,1200+Math.random()*2600)},
 fanfare:function(){var n=[523,659,784,1047,784,1047,1319];n.forEach(function(f,i){tone(f,i*0.14,0.22,'square',0.12)});tone(1319,n.length*0.14,0.7,'square',0.14);tone(1047,n.length*0.14,0.7,'triangle',0.12)},
 oops:function(){tone(300,0,0.25,'sine',0.14,180)},
 firework:function(){noise(0,0.25,0.3,900);tone(1400,0.02,0.3,'sawtooth',0.05,300)}
};
/* مفرقعات */
var cv=null,cx=null,P=[],run=false;
function setup(){if(cv)return;cv=document.createElement('canvas');cv.style.cssText='position:fixed;inset:0;width:100%;height:100%;pointer-events:none;z-index:9999';document.body.appendChild(cv);cx=cv.getContext('2d');function rs(){cv.width=innerWidth;cv.height=innerHeight}rs();addEventListener('resize',rs)}
var COL=['#f06595','#fab005','#40c057','#4dabf7','#845ef7','#ff922b','#ff6b6b'],EM=['🌸','⭐','✨','💖','🌟','🎉'];
function burst(x,y,n,spread){setup();for(var i=0;i<n;i++){var a=Math.random()*Math.PI*2,v=(Math.random()*0.7+0.3)*(spread||9);P.push({x:x,y:y,vx:Math.cos(a)*v,vy:Math.sin(a)*v-5,g:0.28,r:Math.random()*6+4,c:COL[(Math.random()*COL.length)|0],e:Math.random()<0.28?EM[(Math.random()*EM.length)|0]:null,rot:Math.random()*6,vr:(Math.random()-0.5)*0.4,life:90+Math.random()*50})}if(!run){run=true;requestAnimationFrame(tick)}}
function tick(){cx.clearRect(0,0,cv.width,cv.height);P=P.filter(function(p){return p.life>0&&p.y<cv.height+40});P.forEach(function(p){p.vy+=p.g;p.x+=p.vx;p.y+=p.vy;p.vx*=0.99;p.rot+=p.vr;p.life--;cx.save();cx.translate(p.x,p.y);cx.rotate(p.rot);cx.globalAlpha=Math.min(1,p.life/30);if(p.e){cx.font=(p.r*3+10)+'px serif';cx.fillText(p.e,0,0)}else{cx.fillStyle=p.c;cx.fillRect(-p.r/2,-p.r/2,p.r,p.r*1.6)}cx.restore()});if(P.length)requestAnimationFrame(tick);else{run=false;cx.clearRect(0,0,cv.width,cv.height)}}
FX.confetti=function(level){var w=innerWidth,h=innerHeight;if(level>=3){for(var i=0;i<6;i++)setTimeout(function(){burst(Math.random()*w,h*(0.2+Math.random()*0.3),50,11);FX.firework()},i*260)}else if(level==2){burst(w*0.3,h*0.55,45,10);burst(w*0.7,h*0.55,45,10)}else burst(w/2,h*0.5,32,8)};
FX.correct=function(streak){FX.pop();FX.ding();FX.confetti(streak>=3?2:1);if(streak>=3)FX.applause(0.9)};
FX.win=function(){FX.fanfare();FX.applause(2.2);FX.confetti(3)};
FX.toggle=function(){muted=!muted;try{localStorage.setItem('fx_muted',muted?'1':'0')}catch(e){}return muted};
FX.isMuted=function(){return muted};
window.FX=FX})();
