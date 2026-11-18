from PIL import Image
P='/tmp/sci/pages/sh/p-%02d.png'
def c(p,box,n):
    Image.open(P%p).crop(box).save('/tmp/sci/figs/sharqia-%s.png'%n)
c(4,(60,1000,480,1300),'desert')
c(5,(680,1060,990,1310),'cell')
c(6,(70,200,530,380),'seastar')
c(6,(300,590,840,810),'foodchain')
c(14,(300,590,840,810),'foodchain-ans')
c(6,(80,1070,280,1300),'sunflower')
c(8,(70,390,370,600),'pyramid')
c(9,(80,820,660,1190),'chart')
