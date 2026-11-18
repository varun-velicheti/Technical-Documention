/*=============== TORNADO: PRODUCE IN, VACUUM CHIPS OUT ===============*/
/*
   1. Whole fruits & vegetables fly in from both sides and spiral into the tornado.
   2. Vacuum chips swirl around the lower funnel.
   3. On scroll, every chip flies out and lands in its own flavor pack
      in the Favorites section (scrolling back up reverses it).
*/
(() => {
   const stage = document.getElementById('home-stage')
   const packsWrap = document.getElementById('packs')
   if (!stage || !packsWrap) return

   const FLAVORS = ['banana', 'okra', 'apple', 'potato', 'mango']
   const IMG = 'assets/img/flavors/'
   const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches

   /*----- Layer that spans the whole document -----*/
   const fx = document.createElement('div')
   fx.className = 'fx'
   fx.setAttribute('aria-hidden', 'true')
   document.body.appendChild(fx)

   const packs = {}
   packsWrap.querySelectorAll('.favorite__pack').forEach(el => packs[el.dataset.flavor] = el)

   const make = (src, h) => {
      const img = new Image()
      img.src = src
      img.alt = ''
      img.decoding = 'async'
      img.className = 'fx__item'
      img.dataset.h = h
      fx.appendChild(img)
      return img
   }

   /*----- Helpers -----*/
   const clamp = (v, a = 0, b = 1) => Math.min(b, Math.max(a, v))
   const lerp = (a, b, t) => a + (b - a) * t
   const bez = (a, c, b, t) => {
      const u = 1 - t
      return { x: u * u * a.x + 2 * u * t * c.x + t * t * b.x,
               y: u * u * a.y + 2 * u * t * c.y + t * t * b.y }
   }
   const easeInOut = t => t < .5 ? 4 * t * t * t : 1 - Math.pow(-2 * t + 2, 3) / 2
   const smooth = (a, b, v) => { const t = clamp((v - a) / (b - a)); return t * t * (3 - 2 * t) }
   const place = (el, x, y, rot, sx, sy, op, z) => {
      el.style.transform = `translate3d(${x}px, ${y}px, 0) translate(-50%, -50%) rotate(${rot}deg) scale(${sx}, ${sy})`
      el.style.opacity = op
      if (z !== undefined && el._z !== z) { el.style.zIndex = z; el._z = z }
   }

   /*----- Geometry -----*/
   let vw = 0, vh = 0, k = 1
   const tor = { x: 0, top: 0, w: 0, h: 0 }

   // Funnel half-width (fraction of tornado width) at a given height fraction
   const FUNNEL = [[0, .12], [.08, .26], [.14, .39], [.2, .41], [.3, .33], [.4, .21], [.5, .13], [.6, .08], [.7, .045], [.8, .023], [.87, .01], [1, .01]]
   const halfW = f => {
      for (let i = 1; i < FUNNEL.length; i++) {
         if (f <= FUNNEL[i][0]) {
            const [f0, w0] = FUNNEL[i - 1], [f1, w1] = FUNNEL[i]
            return tor.w * lerp(w0, w1, (f - f0) / (f1 - f0))
         }
      }
      return tor.w * .02
   }
   const centerX = () => tor.x

   const measure = () => {
      vw = document.documentElement.clientWidth
      vh = window.innerHeight
      k = clamp(vw / 1300, .55, 1)
      fx.style.height = '0px'
      fx.style.height = document.documentElement.scrollHeight + 'px'
      fx.querySelectorAll('.fx__item').forEach(el => el.style.height = (el.dataset.h * k) + 'px')
   }
   const measureTornado = sy => {
      const r = stage.getBoundingClientRect()
      tor.x = r.left + r.width / 2
      tor.top = r.top + sy
      tor.w = r.width
      tor.h = r.height
   }

   /*----- Produce (whole + cut) -----*/
   const produceSrc = FLAVORS.flatMap(f => [`${IMG}${f}-whole.webp`, `${IMG}${f}-cut.webp`])
   const produce = Array.from({ length: 14 }, (_, i) => ({
      el: make(produceSrc[i % produceSrc.length], i % 2 ? 80 : 92),
      active: false
   }))
   let spawnIndex = 0, lastSpawn = 0, side = 1

   const spawn = now => {
      const p = produce.find(p => !p.active)
      if (!p) return
      p.el.src = produceSrc[spawnIndex++ % produceSrc.length]
      p.active = true
      p.t0 = now
      p.dur = 2300 + Math.random() * 700
      p.side = side = -side
      p.y0 = tor.top + tor.h * (.02 + Math.random() * .5)
      p.rot0 = Math.random() * 360
      p.spin = (Math.random() < .5 ? -1 : 1) * (200 + Math.random() * 260)
      p.lift = 40 + Math.random() * 90
   }

   const updateProduce = now => {
      const A = { x: centerX(.22), y: tor.top + tor.h * .22 }
      const R0 = halfW(.22) * 1.02
      for (const p of produce) {
         if (!p.active) continue
         const t = (now - p.t0) / p.dur
         if (t >= 1) { p.active = false; p.el.style.opacity = 0; continue }
         const rot = p.rot0 + p.spin * t
         const split = .52
         if (t < split) {
            const u = t / split
            const uu = u * u * .45 + u * .55            // speeds up as it gets pulled in
            const P0 = { x: p.side < 0 ? -60 * k : vw + 60 * k, y: p.y0 }
            const E = { x: A.x + p.side * R0, y: A.y }
            const C = { x: (P0.x + E.x) / 2, y: Math.min(P0.y, E.y) - p.lift * k }
            const pos = bez(P0, C, E, uu)
            place(p.el, pos.x, pos.y, rot, 1, 1, clamp(t / .05), 6)
         } else {
            const u = (t - split) / (1 - split)
            const ang = (p.side < 0 ? Math.PI : 0) + u * Math.PI * 3.2
            const r = R0 * Math.pow(1 - u, 1.25)
            const depth = Math.sin(ang)
            const s = (1 - .82 * u) * (.86 + .14 * depth)
            place(p.el,
               A.x + Math.cos(ang) * r,
               A.y + depth * r * .28 - u * 14 * k,
               rot * 1.6, s, s,
               u > .72 ? (1 - u) / .28 : 1,
               depth > 0 ? 6 : 4)
         }
      }
   }

   /*----- Vacuum chips (3 per flavor) -----*/
   const chips = Array.from({ length: 15 }, (_, i) => {
      const flavor = FLAVORS[i % 5]
      const row = Math.floor(i / 5)
      return {
         flavor,
         el: make(`${IMG}${flavor}-chip-${row === 1 ? 2 : 1}.webp`, 62 - row * 4),
         f: .4 + ((i * 7) % 15) / 15 * .4,
         ang0: i * 2.39,
         speed: 2 + (i % 3) * .35,
         flip: 1.3 + (i % 4) * .4,
         delay: (i % 5) * .055 + row * .05,
         jx: ((i * 37) % 11) / 10 - .5,
         jy: ((i * 53) % 7) / 6 - .5
      }
   })

   let sp = 0                    // smoothed scroll progress
   let started = null

   const updateChips = (now, sy) => {
      // Scroll progress: 0 at the top, 1 when the packs reach the middle of the screen
      const pr = packsWrap.getBoundingClientRect()
      const end = Math.max(200, pr.top + sy + pr.height * .5 - vh * .55)
      const p = clamp(sy / end)
      sp += (p - sp) * .14
      if (Math.abs(p - sp) < .0005) sp = p

      const sec = now / 1000
      const tip = { x: centerX(1), y: tor.top + tor.h * .86 }
      const landed = {}

      for (const [i, c] of chips.entries()) {
         // Orbit around the lower funnel
         const ang = c.ang0 + c.speed * sec
         const r = halfW(c.f) * 1.25 + 26 * k
         const depth = Math.sin(ang)
         const O = {
            x: centerX(c.f) + Math.cos(ang) * r,
            y: tor.top + tor.h * c.f + depth * r * .26 + Math.sin(sec * 2 + i) * 4
         }
         const flipX = .45 + .55 * Math.abs(Math.cos(sec * c.flip + i))
         const rot = (ang * 57.3 + i * 40) % 360

         // Chips come out of the tornado tip after the produce starts going in
         const born = smooth(0, 1, (now - started - 1500 - i * 110) / 700)
         const base = { x: lerp(tip.x, O.x, born), y: lerp(tip.y, O.y, born) }

         // Fly to the pack
         const q = clamp((sp - c.delay) / .62)
         const e = easeInOut(q)
         const pack = packs[c.flavor]
         let x = base.x, y = base.y, s = born * (.9 + .1 * depth), op = born, z = depth > 0 ? 6 : 4

         if (q > 0 && pack) {
            const r2 = pack.getBoundingClientRect()
            const img = pack.querySelector('img').getBoundingClientRect()
            const T = { x: img.left + img.width * (.5 + c.jx * .3), y: img.top + sy + img.height * (.58 + c.jy * .15) }
            const dir = base.x < tor.x ? -1 : 1
            const C = { x: base.x + (T.x - base.x) * .3 + dir * 110 * k, y: Math.min(base.y, T.y) - 150 * k }
            const pos = bez(base, C, T, e)
            x = pos.x; y = pos.y
            s = lerp(s, .62, e)
            op = born * (e < .86 ? 1 : (1 - e) / .14)
            z = 6
            landed[c.flavor] = (landed[c.flavor] || 0) + smooth(.78, 1, e) / 3
         }
         place(c.el, x, y, rot * (1 - e * .7), s * flipX, s, op, z)
      }

      // Each pack bounces as its chips drop in
      for (const f of FLAVORS) {
         const L = landed[f] || 0
         const pop = 1 + .09 * Math.sin(Math.PI * L)
         if (packs[f]) packs[f].style.scale = pop.toFixed(4)
      }
   }

   /*----- Reduced motion: a still composition -----*/
   if (reduceMotion) {
      const video = document.querySelector('.home__tornado-video')
      if (video) { video.removeAttribute('autoplay'); video.pause() }
      measure()
      measureTornado(window.scrollY)
      chips.slice(0, 8).forEach((c, i) => {
         const ang = i * .8
         const r = halfW(c.f) * 1.2 + 14 * k
         place(c.el, centerX(c.f) + Math.cos(ang) * r, tor.top + tor.h * c.f + Math.sin(ang) * r * .26, i * 45, 1, 1, 1, 6)
      })
      return
   }

   /*----- Loop -----*/
   const loop = now => {
      if (started === null) started = now
      const sy = window.scrollY
      measureTornado(sy)

      const heroVisible = sy < tor.top + tor.h + 100
      if (heroVisible && now - started > 500 && now - lastSpawn > 330) {
         spawn(now)
         lastSpawn = now
      }
      updateProduce(now)
      updateChips(now, sy)
      requestAnimationFrame(loop)
   }

   measure()
   window.addEventListener('resize', measure)
   window.addEventListener('load', measure)
   if ('ResizeObserver' in window) new ResizeObserver(measure).observe(document.querySelector('.main'))
   requestAnimationFrame(loop)
})()
