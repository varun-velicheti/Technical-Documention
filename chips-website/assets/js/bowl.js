/*=============== BOWL: FILLS UP WITH CHIPS AFTER THE PACKS ===============*/
/*
   As the Care section scrolls into view, heaps of vacuum chips rise inside the
   black bowl, single chips rain down onto the pile, and a leaf and tomato pop on top.
   Scrolling back up empties it again.
*/
(() => {
   const bowl = document.querySelector('.care__bowl')
   const pile = bowl && bowl.querySelector('.care__pile')
   if (!pile) return

   const IMG = 'assets/img/flavors/'
   const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches
   const PILE_TOP = .7          // the pile layer starts 70% of the bowl's height above it
   const RIM_Y = .3645          // rim centre, as a fraction of the bowl's height

   const clamp = (v, a = 0, b = 1) => Math.min(b, Math.max(a, v))
   const lerp = (a, b, t) => a + (b - a) * t
   const smooth = (a, b, v) => { const t = clamp((v - a) / (b - a)); return t * t * (3 - 2 * t) }

   const add = (src, cls) => {
      const img = new Image()
      img.src = src
      img.alt = ''
      img.decoding = 'async'
      if (cls) img.className = cls
      pile.appendChild(img)
      return img
   }

   /*----- Heaps that rise inside the bowl (back to front) -----*/
   // [flavor, centre x, bottom y (fractions of the bowl), width (fraction of bowl width), aspect, rise start]
   const heaps = [
      ['potato', .5, .5, .52, .76, 0],
      ['banana', .29, .54, .42, .69, .07],
      ['mango', .71, .54, .42, .75, .14],
      ['apple', .37, .62, .4, .71, .21],
      ['okra', .64, .62, .4, .7, .28]
   ].map(([flavor, x, y, w, ar, start]) => ({ el: add(`${IMG}${flavor}-heap.webp`), x, y, w, ar, start }))

   /*----- Single chips that rain onto the pile -----*/
   const FLAVORS = ['banana', 'okra', 'apple', 'potato', 'mango']
   const drops = Array.from({ length: 14 }, (_, i) => {
      const x = .24 + ((i * 5) % 14) / 13 * .52
      return {
         el: add(`${IMG}${FLAVORS[i % 5]}-chip-${i % 3 === 1 ? 2 : 1}.webp`),
         x,
         y: .04 + 2.4 * Math.pow(x - .5, 2) + ((i * 7) % 5) * .012,   // follows the mound's curve
         w: .12 + (i % 3) * .015,
         start: .42 + i * .036,
         drift: ((i * 13) % 7 - 3) * .03,
         rest: ((i * 47) % 70) - 35,
         spin: (i % 2 ? 1 : -1) * (540 + (i % 4) * 120)
      }
   })

   const decos = [...bowl.querySelectorAll('.care__deco')].map((el, i) => ({ el, start: .9 + i * .03 }))

   /*----- Layout & rendering -----*/
   let W = 0, H = 0
   const measure = () => {
      W = bowl.offsetWidth
      H = bowl.offsetHeight
      heaps.forEach(h => h.el.style.width = (h.w * W) + 'px')
      drops.forEach(d => d.el.style.width = (d.w * W) + 'px')
      last = -1
   }

   // pile-layer coordinates: y = 0 is PILE_TOP bowl-heights above the bowl
   const py = yFrac => (yFrac + PILE_TOP) * H

   const render = f => {
      for (const h of heaps) {
         const hw = h.w * W, hh = hw * h.ar
         const rise = smooth(h.start, h.start + .5, f)
         const sink = (1 - rise) * .8 * H                      // deep inside (hidden) until it rises
         h.el.style.transform = `translate(${h.x * W - hw / 2}px, ${py(h.y) - hh + sink}px)`
      }
      for (const d of drops) {
         const u = clamp((f - d.start) / .1)
         const dw = d.w * W
         if (u <= 0) { d.el.style.opacity = 0; continue }
         const g = u * u                                       // falls like gravity
         const x = (d.x + d.drift * (1 - u)) * W - dw / 2
         const y = lerp(0, py(d.y) - dw * .4, g)
         const rot = d.rest + d.spin * (1 - u)
         d.el.style.opacity = smooth(0, .2, u)             // fades in as it starts to fall
         d.el.style.transform = `translate(${x}px, ${y}px) rotate(${rot}deg)`
      }
      for (const d of decos) {
         const p = smooth(d.start, d.start + .08, f)
         const pop = p < 1 ? p * (1 + .35 * Math.sin(Math.PI * p)) : 1
         d.el.style.transform = `scale(${pop.toFixed(3)})`
      }
   }

   /*----- Progress: fills as the bowl scrolls up the screen -----*/
   let f = 0, last = -1
   const progress = () => {
      const r = bowl.getBoundingClientRect()
      const vh = window.innerHeight
      return clamp((vh * .92 - r.top) / (vh * .92 - vh * .2))
   }

   measure()
   window.addEventListener('resize', measure)
   window.addEventListener('load', measure)

   if (reduceMotion) { render(1); return }

   const loop = () => {
      const target = progress()
      f += (target - f) * .08
      if (Math.abs(target - f) < .0005) f = target
      if (Math.abs(f - last) > .0002) { render(f); last = f }
      requestAnimationFrame(loop)
   }
   render(0)
   requestAnimationFrame(loop)
})()
