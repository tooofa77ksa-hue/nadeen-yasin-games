/* دروس نادين بالترتيب: كل درس فيه: شرح الأستاذة، الواقع، ألعابه، الكتابة، الاختبار */
window.LESSONS_N=[
{id:'shadda',t:'الشدة وأنواعها',ico:'🪢'},{id:'tanwin',t:'التنوين',ico:'🥅'},{id:'imla3',t:'التاء المربوطة والمفتوحة',ico:'🎒',lq:'imla3'},{id:'tarqim',t:'علامات الترقيم',ico:'🛑'},
{id:'imla1',t:'همزتا القطع والوصل',ico:'🍞',lq:'imla1'},{id:'imla2',t:'الهمزة المتطرفة',ico:'🏟️',lq:'imla2'},
{id:'nahw1',t:'أنواع الكلمة والجملة',ico:'🏫',lq:'nahw1'},{id:'muth',t:'الجملة المثبتة والمنفية',ico:'🚫'},{id:'adad',t:'المفرد والمثنى والجمع',ico:'⚽'},{id:'nakira',t:'النكرة والمعرفة',ico:'🎯'},
{id:'nahw4',t:'أنواع الفعل',ico:'📣',lq:'nahw4',scene:'nahw4',irab:1},{id:'nahw2',t:'المبتدأ والخبر',ico:'🤗',lq:'nahw2',scene:'nahw2',irab:1},{id:'nahw3',t:'الاسم المجرور بحرف الجر',ico:'🪢',lq:'nahw3',scene:'nahw3',irab:1},
{id:'words',t:'معاني الكلمات وأضدادها',ico:'📘'},{id:'nahw5',t:'الفاعل',ico:'🏃‍♀️',lq:'nahw5',scene:'nahw5',irab:1},{id:'nahw6',t:'المفعول به',ico:'🔶',lq:'nahw6',scene:'nahw6',irab:1},
{id:'irab',t:'الإعراب: وش معناه وكيف أكتبه',ico:'🪪',scene:'what',irab:1},{id:'imla4',t:'الألف المحذوفة',ico:'🍵',lq:'imla4'},{id:'rasm',t:'الخط: الحروف المرتكزة على السطر',ico:'🦶',lq:'rasm'}];
window.lessonsCard=function(){var L=window.LESSONS_N,D={};try{D=JSON.parse(localStorage.getItem('nyg_nadeen_lsdone')||'{}')}catch(e){}
 return '<div class="card" style="background:#fff;border:5px solid #3d7bff"><h2 style="margin:0">📚 دروسي بالترتيب</h2><p class="muted" style="margin:2px 0 8px">كل درس فيه شرح الأستاذة، وربطه بالواقع، وألعابه، والكتابة، والاختبار، كلها في مكان واحد.</p>'+L.map(function(l,i){return '<div style="display:flex;align-items:center;justify-content:space-between;gap:8px;margin:6px 0"><b>'+(D[l.id]?'✅ ':'')+(i+1)+'. '+l.ico+' '+l.t+'</b><button class="btn" data-ls="'+l.id+'">افتحي</button></div>'}).join('')+'</div>'};
