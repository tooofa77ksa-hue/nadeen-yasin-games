# -*- coding: utf-8 -*-
import json,sys,re
AR=str.maketrans('٠١٢٣٤٥٦٧٨٩','0123456789')
def num(t): return [int(n) for n in re.findall(r'\d+',str(t).translate(AR))]
def norm(s): return re.sub(r'\s+',' ',str(s)).strip()
def check(path,pool_path='/tmp/m4/rep/all_items.json'):
    D=json.load(open(path)); errs=[]; ids=set()
    pool={p['uid']:p for p in json.load(open(pool_path))}
    for i,p in enumerate(D):
        tag=p.get('id',f'#{i}')
        def E(m): errs.append(f'{tag}: {m}')
        if tag in ids: E('id مكرر')
        ids.add(tag)
        if p.get('chapter') not in (4,5): E('chapter')
        if p.get('origin') not in ('book','central'): E('origin')
        t=norm(p.get('text',''))
        for g in p.get('given',[]):
            if norm(g) not in t: E(f'given ليس جزءاً حرفياً من النص: {g}')
        if not p.get('given'): E('given فارغ')
        if norm(p.get('ask','')) not in t or not p.get('ask'): E('ask ليس جزءاً حرفياً من النص')
        if p.get('origin')=='central':
            u=p.get('uid'); 
            if u not in pool: E('uid غير موجود في المصدر')
            elif norm(pool[u]['text'])!=t and norm(pool[u]['text'])[:60]!=t[:60]: E('text ليس نصاً حرفياً من المصدر')
            if not p.get('src'): E('src مفقود')
        if p.get('origin')=='book':
            if not p.get('orig_text'): E('orig_text مفقود')
            elif sorted(num(p['orig_text']))==sorted(num(p['text'])): E('الأرقام لم تتغير عن الأصل')
        if p.get('mode')=='choose':
            o=p.get('options') or []
            if len(o)<2 or not isinstance(p.get('correct_index'),int) or p['correct_index']>=len(o): E('خيارات/إجابة صحيحة')
            if not p.get('why_correct'): E('why_correct')
            wh=p.get('wrong_hints') or {}
            for k in range(len(o)):
                if k!=p.get('correct_index') and not wh.get(str(k)): E(f'wrong_hints للخيار {k}')
            continue
        if p.get('mode')!='op': E('mode'); continue
        steps=p.get('steps') or []
        if not 1<=len(steps)<=2: E('عدد الخطوات'); continue
        prev=None
        for k,s in enumerate(steps):
            op=s.get('op'); 
            if op not in ('+','−','×','÷'): E(f'خطوة {k+1} op'); break
            a=prev if s.get('a')=='prev' else s.get('a'); b=prev if s.get('b')=='prev' else s.get('b')
            if not isinstance(a,(int,float)) or not isinstance(b,(int,float)): E(f'خطوة {k+1} a/b'); break
            r={'+':a+b,'−':a-b,'×':a*b,'÷':(a/b if b else None)}[op]
            if r is None or r!=int(r) or r<0: E(f'خطوة {k+1} نتيجة غير صحيحة/سالبة/غير صحيحة القسمة: {r}'); break
            s['result']=int(r); prev=int(r)
            others=[x for x in ('+','−','×','÷') if x!=op]
            wh=s.get('wrong_hints') or {}
            for x in others:
                if not wh.get(x): E(f'خطوة {k+1} wrong_hints[{x}] مفقود')
            for f in ('write','clue','do'):
                if not s.get(f): E(f'خطوة {k+1} {f} مفقود')
        else:
            if prev!=p.get('answer_num'): E(f'answer_num ({p.get("answer_num")}) لا يساوي حساب الخطوات ({prev})')
            if not p.get('answer_unit') and p.get('answer_unit')!='': E('answer_unit')
    return errs
if __name__=='__main__':
    e=check(sys.argv[1]); print('\n'.join(e) if e else 'OK'); sys.exit(1 if e else 0)
