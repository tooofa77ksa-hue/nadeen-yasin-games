import subprocess,sys,os
from concurrent.futures import ThreadPoolExecutor
S='/home/user/-Repository-name/.claude/skills/tawlidsuwar/scripts/gen.py'
CH="Single character on a plain transparent background, full body visible including shoes, no other people, no props except those mentioned, cap has NO writing on it. Same character design as in the reference image. "
J={
'stand_past':CH+"The boy with the RED cap (red shirt, blue dungarees, brown boots), standing neutral and smiling, arms relaxed, front 3/4 view.",
'stand_present':CH+"The boy with the BLUE cap (blue shirt, jeans, backpack), standing neutral and smiling, arms relaxed, front 3/4 view.",
'stand_amr':CH+"The boy with the GREEN cap (green hoodie, grey pants, backpack), standing neutral and smiling, arms relaxed, front 3/4 view.",
'stand_maful':CH+"The girl with long brown hair and an orange dress (no cap), standing neutral, front 3/4 view, calm gentle expression.",
'stand_harf':CH+"The boy with the PURPLE cap (purple jacket, jeans, backpack), standing neutral and smiling, arms relaxed, front 3/4 view.",
'stand_majrur':CH+"The boy with the WHITE cap and white shirt, dark trousers, standing neutral and smiling, front 3/4 view.",
'carry_present':CH+"The boy with the BLUE cap (blue shirt, jeans, backpack) walking forward carrying a stack of wooden planks on his shoulder with both hands, effortful happy face, side-ish 3/4 view, mid-stride.",
'relax_amr':CH+"The boy with the GREEN cap (green hoodie) sitting comfortably on a small armchair with hands behind his head, legs stretched, happy relaxed face. Include the small armchair.",
'sad_maful':CH+"The girl with long brown hair and orange dress sitting on the ground hugging her knees resting her chin in her hand, sad lonely face, full body.",
'pull_harf':CH+"The boy with the PURPLE cap (purple jacket) pulling a thick brown rope with both hands leaning back, strong happy effort, the rope extends to the right side and ends in a loop at the edge of the image.",
'hand_wave_past':CH+"The boy with the RED cap (red shirt, blue dungarees) waving one hand happily and holding a trowel in the other, front view.",
'walk_present':CH+"The boy with the BLUE cap (blue shirt, jeans, backpack) walking tired and a bit lost with drooping shoulders, side view, mid-stride, no props.",
'bg_desert':"Wide landscape background only, NO people: a Saudi desert path with sandy dunes, a wooden direction signpost with blank arrows, a few distant rocks and palm tree, warm sunny sky with soft clouds. Space on the lower half for characters to stand.",
'bg_site_empty':"Wide landscape background only, NO people: a construction site in the desert, only a brick foundation line and a pile of red bricks, a wooden ladder and wooden fence posts, sandy ground, warm sky.",
'bg_site_wall':"Wide landscape background only, NO people: same desert construction site but with a tall red brick wall built about three quarters finished, scaffolding poles, a pile of bricks, sandy ground, warm sky.",
'bg_house':"Wide landscape background only, NO people: a finished cozy sand-colored house in the desert village with a wooden sign above the door left BLANK, glowing windows with lamps, plants in pots, a wooden bench in front, warm sky.",
'bg_inside':"Wide landscape background only, NO people: cozy living room interior of a small house with a brown sofa, a standing lamp, wooden floor, window showing desert, warm light, empty floor space.",
'bg_tent':"Wide landscape background only, NO people: a desert camp with a beige tent whose door flap is wide open and a small wooden sign (blank) next to it, sand dunes, warm evening sky."
}
only=sys.argv[1:] or list(J)
def run(k):
    r=subprocess.run(['/tmp/venv/bin/python',S,'-o',f'{k}.png','-s','style.txt','-r','../full.jpg']+(['-t'] if not k.startswith('bg_') else [])+['-a','wide' if k.startswith('bg_') else 'square',J[k]],capture_output=True,text=True)
    print(k,r.returncode,r.stderr[-200:],flush=True)
with ThreadPoolExecutor(3) as ex:list(ex.map(run,only))
print('ALLDONE',flush=True)
