/*=============== BOWL: FILLS WITH THE CHIPS THAT LAND IN IT ===============*/
/*
   The bowl is split into a back half, a masked pile layer and a front half.
   tornado.js drops chips into it; this file raises the chip heaps to match
   how many chips have landed (setLevel) and pops the leaf and tomato on top
   when it is full (setFull).
*/
(() => {
   const bowl = document.querySelector('.care__bowl')
   const pile = bowl && bowl.querySelector('.care__pile')
   if (!pile) return

   const IMG = 'assets/img/flavors/'
   const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches
   const PILE_TOP = .7          // the pile layer starts 70% of the bowl's height above it

   const clamp = (v, a = 0, b = 1) => Math.min(b, Math.max(a, v))
   const smooth = (a, b, v) => { const t = clamp((v - a) / (b - a)); return t * t * (3 - 2 * t) }

   /*----- Heaps that rise inside the bowl (back to front) -----*/
   // [flavor, centre x, bottom y (fractions of the bowl), width (fraction of bowl width), aspect, rise start]
   const heaps = [
      ['potato', .5, .5, .52, .76, 0],
      ['banana', .29, .54, .42, .69, .07],
      ['mango', .71, .54, .42, .75, .14],
      ['apple', .37, .62, .4, .71, .21],
      ['okra', .64, .62, .4, .7, .28]
   ].map(([flavor, x, y, w, ar, start]) => {
      const img = new Image()
      img.src = `${IMG}${flavor}-heap-spiced.webp`        // the bowl holds seasoned chips
      img.alt = ''
      img.decoding = 'async'
      img.className = 'care__heap'
      pile.appendChild(img)
      return { el: img, x, y, w, ar, start }
   })

   let W = 0, H = 0, level = 0, target = 0, drawn = -1
   const measure = () => {
      W = bowl.offsetWidth
      H = bowl.offsetHeight
      heaps.forEach(h => h.el.style.width = (h.w * W) + 'px')
      // Chips show above the rim and inside the bowl's oval opening only.
      // A clip-path is much cheaper than a CSS mask while the chips move.
      const pw = pile.offsetWidth, ph = pile.offsetHeight
      const cx = pw / 2, rx = pw * .469, ry = ph * .192, rim = ph * .626
      pile.style.clipPath = `path('M0 0 H${pw} V${rim} H${cx + rx} A${rx} ${ry} 0 0 1 ${cx - rx} ${rim} H0 Z')`
      drawn = -1
   }

   const render = () => {
      for (const h of heaps) {
         const hw = h.w * W, hh = hw * h.ar
         const rise = smooth(h.start, h.start + .55, level)
         const sink = (1 - rise) * .8 * H                 // hidden deep in the bowl until it rises
         h.el.style.transform = `translate(${h.x * W - hw / 2}px, ${(h.y + PILE_TOP) * H - hh + sink}px)`
      }
      drawn = level
   }

   const setFull = on => bowl.classList.toggle('is-full', on)

   window.ChipsBowl = {
      el: bowl,
      pile,
      PILE_TOP,
      size: () => ({ W, H }),
      setLevel: v => { target = clamp(v) },
      setFull,
      reset: () => { target = 0; setFull(false) }
   }

   measure()
   window.addEventListener('resize', () => { measure(); render() })
   window.addEventListener('load', () => { measure(); render() })

   if (reduceMotion) {
      level = target = 1
      render()
      setFull(true)
      return
   }

   const loop = () => {
      level += (target - level) * .14                    // the pile rises quickly with each landing
      if (Math.abs(target - level) < .0005) level = target
      if (Math.abs(level - drawn) > .0003) render()
      requestAnimationFrame(loop)
   }
   render()
   requestAnimationFrame(loop)
})()
