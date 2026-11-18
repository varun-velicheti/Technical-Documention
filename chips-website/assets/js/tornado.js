/*=============== TORNADO: PRODUCE IN, VACUUM CHIPS OUT ===============*/
/*
   1. Calm:   the tornado turns slowly; fruits, vegetables and loose chips float around it.
   2. Surge:  it suddenly speeds up and grows, the ground shakes,
              and everything floating is sucked inside.
   3. Strong: produce keeps flying in from both sides, vacuum chips swirl out of the funnel.
   4. Scroll: every chip flies out and lands in its own flavor pack in the Favorites
              section (scrolling back up reverses it).
*/
(() => {
   const stage = document.getElementById('home-stage')
   const tornadoEl = document.getElementById('tornado')
   const packsWrap = document.getElementById('packs')
   if (!stage || !tornadoEl || !packsWrap) return

   const video = tornadoEl.querySelector('video')
   // (the header's contents shake, not the header itself, so the mobile menu stays hidden)
   const shakeTargets = ['.nav__logo', '.nav__menu', '.nav__toggle', '.home__data', '.home__meat']
      .map(sel => document.querySelector(sel)).filter(Boolean)
   const glow = stage.querySelector('.home__glow')
   const FLAVORS = ['banana', 'okra', 'apple', 'potato', 'mango']
   const IMG = 'assets/img/flavors/'
   const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches

   /*----- Timeline (ms after the page starts animating) -----*/
   const CALM_UNTIL = 3600      // slow, small tornado
   const SURGE_MS = 450         // sudden ramp to full power

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
   const easeIn = t => t * t * t
   const smooth = (a, b, v) => { const t = clamp((v - a) / (b - a)); return t * t * (3 - 2 * t) }
   let shakeX = 0, shakeY = 0       // screen-shake offset applied to everything in the hero
   const place = (el, x, y, rot, sx, sy, op, z) => {
      el.style.transform = `translate3d(${x + shakeX}px, ${y + shakeY}px, 0) translate(-50%, -50%) rotate(${rot}deg) scale(${sx}, ${sy})`
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
      return tor.w * .01
   }

   const measure = () => {
      vw = document.documentElement.clientWidth
      vh = window.innerHeight
      k = clamp(vw / 1300, .55, 1)
      fx.style.height = '0px'
      fx.style.height = document.documentElement.scrollHeight + 'px'
      fx.querySelectorAll('.fx__item').forEach(el => el.style.height = (el.dataset.h * k) + 'px')
      fx.querySelectorAll('.fx__debris').forEach(el => {
         const s = el.dataset.s * k
         el.style.width = el.style.height = s + 'px'
      })
   }

   // The stage keeps its layout size; the tornado's visual size grows with power
   const GROW_ORIGIN = .42            // matches transform-origin in the CSS
   let power = 0, visualScale = .8
   const measureTornado = sy => {
      const r = stage.getBoundingClientRect()
      tor.x = r.left + r.width / 2
      tor.w = r.width * visualScale
      tor.h = r.height * visualScale
      tor.top = r.top + sy + r.height * GROW_ORIGIN * (1 - visualScale)
   }

   /*----- Power curve: calm -> sudden surge -> strong -----*/
   const powerAt = t => {
      if (t < CALM_UNTIL) return 0
      const s = (t - CALM_UNTIL) / SURGE_MS
      if (s < 1) return (Math.pow(2, 9 * s) - 1) / 511          // explodes at the end
      return 1 + .12 * Math.exp(-(s - 1) * 2.5) * Math.cos((s - 1) * 7)  // small overshoot, settles
   }

   let lastRate = 0
   const applyPower = (t, p) => {
      visualScale = lerp(.8, 1.36, clamp(p, 0, 1.12))
      tornadoEl.style.scale = visualScale.toFixed(4)
      tornadoEl.style.setProperty('--power', clamp(p, 0, 1.2).toFixed(3))
      if (glow) glow.style.opacity = lerp(.45, 1, clamp(p)).toFixed(3)

      // Screen shake: a low rumble while the surge builds, then a heavy jolt that settles
      const build = clamp((t - CALM_UNTIL) / SURGE_MS)
      const s = (t - CALM_UNTIL - SURGE_MS) / 1000
      let amp = 0
      if (t > CALM_UNTIL && s < 0) amp = 5 * build * build
      else if (s >= 0 && s < 2) amp = 20 * Math.exp(-s * 1.9)
      amp *= k
      shakeX = amp ? amp * (Math.sin(t * .083) + Math.sin(t * .131 + 1.3) * .6) / 1.6 : 0
      shakeY = amp ? amp * (Math.sin(t * .097 + 2.1) + Math.sin(t * .149) * .6) / 1.6 : 0
      const off = amp ? `${shakeX.toFixed(2)}px ${shakeY.toFixed(2)}px` : ''
      tornadoEl.style.translate = off
      for (const el of shakeTargets) el.style.translate = off

      if (video) {
         const rate = lerp(.35, 1.9, clamp(p, 0, 1.1))
         if (Math.abs(rate - lastRate) > .03) {
            try { video.playbackRate = rate } catch (e) {}
            lastRate = rate
         }
      }
   }

   /*----- Floaters: produce + loose chips drifting before the surge -----*/
   const HOMES = [
      // [flavor, kind, x offset (tornado widths), y (fraction of tornado height)]
      ['banana', 'whole', -1.05, .18], ['apple', 'whole', 1.0, .16],
      ['mango', 'whole', -.85, .55], ['okra', 'whole', .9, .5],
      ['potato', 'whole', -1.15, .82], ['banana', 'cut', 1.12, .8],
      ['apple', 'cut', -.55, .02], ['mango', 'cut', .6, .0],
      ['okra', 'cut', -.5, .95], ['potato', 'cut', .55, .97],
      ['banana', 'chip-1', -.7, .34], ['mango', 'chip-1', .74, .34],
      ['apple', 'chip-1', -.95, .66], ['okra', 'chip-2', .98, .66],
      ['potato', 'chip-1', -.32, .72], ['apple', 'chip-2', .36, .76]
   ]
   const floaters = HOMES.map(([flavor, kind, ox, oy], i) => {
      const isChip = kind.startsWith('chip')
      return {
         el: make(`${IMG}${flavor}-${kind}.webp`, isChip ? 52 : (kind === 'cut' ? 78 : 88)),
         ox, oy, phase: i * 1.7, rot0: (i * 47) % 360, spin: (i % 2 ? 1 : -1) * (14 + i * 3),
         dist: Math.hypot(ox, (oy - .3) * 1.5), pulled: null
      }
   })

   // Entry order: alternate left / right so they stream in from both sides
   const lefts = floaters.filter(f => f.ox < 0), rights = floaters.filter(f => f.ox >= 0)
   const order = []
   for (let i = 0; i < Math.max(lefts.length, rights.length); i++) {
      if (lefts[i]) order.push(lefts[i])
      if (rights[i]) order.push(rights[i])
   }
   // Each piece arrives exactly when the surge grabs it, so it never stops moving
   const PULL_AT = CALM_UNTIL + SURGE_MS * .45
   order.forEach((f, i) => {
      f.enterAt = 150 + i * 115                 // ms after start
      f.delay = i * 18                          // pull order follows arrival order
      f.enterDur = PULL_AT + f.delay - f.enterAt
      f.side = f.ox < 0 ? -1 : 1
      f.lift = 50 + (i % 4) * 30
   })

   const updateFloaters = (t, sec) => {
      const A = { x: tor.x, y: tor.top + tor.h * .24 }
      for (const f of floaters) {
         if (f.done) continue
         // Target spot near the tornado; the weak tornado keeps drawing it closer
         const lean = .15
         const hx = clamp(tor.x + f.ox * tor.w * (1 - lean), 34 * k, vw - 34 * k)
         const hy = tor.top + f.oy * tor.h
         const home = {
            x: hx + Math.sin(sec * .7 + f.phase) * 10 * k,
            y: hy + Math.sin(sec * 1.1 + f.phase) * 12 * k
         }
         // Fly in from the screen edge on its side
         const v = clamp((t - f.enterAt) / f.enterDur)
         const ev = v * v * .35 + v * .65          // picks up speed as the tornado draws it in
         const P0 = { x: f.side < 0 ? -90 * k : vw + 90 * k, y: hy + (f.oy < .5 ? -40 : 40) * k }
         const C = { x: (P0.x + home.x) / 2, y: Math.min(P0.y, home.y) - f.lift * k }
         const calm = v < 1 ? bez(P0, C, home, ev) : home
         const rot = f.rot0 + f.spin * sec + (1 - ev) * 220 * f.side
         const u = clamp((t - PULL_AT - f.delay) / 950)
         if (u <= 0) {
            place(f.el, calm.x, calm.y, rot, 1, 1, v > 0 ? 1 : 0, 6)
            continue
         }
         if (!f.pulled) {
            const dx = calm.x - A.x
            f.pulled = { r0: Math.abs(dx), ang0: dx < 0 ? Math.PI : 0, dy0: calm.y - A.y, rot }
         }
         if (u >= 1) { f.done = true; f.el.style.opacity = 0; continue }
         const e = easeIn(u)
         const P = f.pulled
         const ang = P.ang0 + e * Math.PI * 2.6
         const r = P.r0 * Math.pow(1 - e, 1.1)
         const depth = Math.sin(ang)
         const s = (1 - .85 * e) * (.88 + .12 * depth)
         place(f.el,
            A.x + Math.cos(ang) * r,
            A.y + P.dy0 * Math.pow(1 - e, 2) + depth * r * .25,
            P.rot + e * 900, s, s,
            u > .8 ? (1 - u) / .2 : 1,
            depth > 0 ? 6 : 4)
      }
   }

   /*----- Continuous produce from both sides (after the surge) -----*/
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
      p.dur = 1900 + Math.random() * 500
      p.side = side = -side
      p.y0 = tor.top + tor.h * (.02 + Math.random() * .5)
      p.rot0 = Math.random() * 360
      p.spin = (Math.random() < .5 ? -1 : 1) * (260 + Math.random() * 300)
      p.lift = 40 + Math.random() * 90
   }

   const updateProduce = now => {
      const A = { x: tor.x, y: tor.top + tor.h * .22 }
      const R0 = halfW(.22) * 1.02
      for (const p of produce) {
         if (!p.active) continue
         const t = (now - p.t0) / p.dur
         if (t >= 1) { p.active = false; p.el.style.opacity = 0; continue }
         const rot = p.rot0 + p.spin * t
         const split = .5
         if (t < split) {
            const u = t / split
            const uu = u * u * .55 + u * .45            // speeds up as it gets pulled in
            const P0 = { x: p.side < 0 ? -60 * k : vw + 60 * k, y: p.y0 }
            const E = { x: A.x + p.side * R0, y: A.y }
            const C = { x: (P0.x + E.x) / 2, y: Math.min(P0.y, E.y) - p.lift * k }
            const pos = bez(P0, C, E, uu)
            place(p.el, pos.x, pos.y, rot, 1, 1, clamp(t / .05), 6)
         } else {
            const u = (t - split) / (1 - split)
            const ang = (p.side < 0 ? Math.PI : 0) + u * Math.PI * 3.4
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

   /*----- Debris whipping around the funnel -----*/
   const debris = Array.from({ length: 26 }, (_, i) => {
      const el = document.createElement('span')
      el.className = 'fx__debris' + (i % 3 === 0 ? ' fx__debris--light' : '')
      el.dataset.s = 3 + (i % 4) * 1.6
      fx.appendChild(el)
      return { el, f: .08 + ((i * 11) % 26) / 26 * .82, ang: i * 2.1, speed: 3.2 + (i % 5) * .6, out: 1.1 + (i % 4) * .18 }
   })

   const updateDebris = (dt, p) => {
      const on = clamp(p)
      for (const d of debris) {
         d.ang += d.speed * dt * lerp(.2, 1.35, on)
         const r = halfW(d.f) * d.out + 10 * k
         const depth = Math.sin(d.ang)
         place(d.el, tor.x + Math.cos(d.ang) * r, tor.top + tor.h * d.f + depth * r * .22,
               0, 1, 1, on * (.55 + .45 * depth) * .9, depth > 0 ? 6 : 4)
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
         ang: i * 2.39,
         speed: 2 + (i % 3) * .35,
         flip: 1.3 + (i % 4) * .4,
         delay: (i % 5) * .055 + row * .05,
         jx: ((i * 37) % 11) / 10 - .5,
         jy: ((i * 53) % 7) / 6 - .5
      }
   })

   let sp = 0                    // smoothed scroll progress

   const updateChips = (t, sec, dt, sy, p) => {
      // Scroll progress: 0 at the top, 1 when the packs reach the middle of the screen
      const pr = packsWrap.getBoundingClientRect()
      const end = Math.max(200, pr.top + sy + pr.height * .5 - vh * .55)
      const target = clamp(sy / end)
      sp += (target - sp) * .14
      if (Math.abs(target - sp) < .0005) sp = target

      const tip = { x: tor.x, y: tor.top + tor.h * .86 }
      const landed = {}
      const spinBoost = lerp(.4, 1.25, clamp(p))
      const bornFrom = CALM_UNTIL + SURGE_MS + 500

      for (const [i, c] of chips.entries()) {
         // Orbit around the lower funnel
         c.ang += c.speed * dt * spinBoost
         const r = halfW(c.f) * 1.25 + 26 * k
         const depth = Math.sin(c.ang)
         const O = {
            x: tor.x + Math.cos(c.ang) * r,
            y: tor.top + tor.h * c.f + depth * r * .26 + Math.sin(sec * 2 + i) * 4
         }
         const flipX = .45 + .55 * Math.abs(Math.cos(sec * c.flip * spinBoost + i))
         const rot = (c.ang * 57.3 + i * 40) % 360

         // Chips come out of the tornado tip after the surge
         const born = smooth(0, 1, (t - bornFrom - i * 90) / 650)
         const base = { x: lerp(tip.x, O.x, born), y: lerp(tip.y, O.y, born) }

         // Fly to the pack
         const q = clamp((sp - c.delay) / .62)
         const e = easeInOut(q)
         const pack = packs[c.flavor]
         let x = base.x, y = base.y, s = born * (.9 + .1 * depth), op = born, z = depth > 0 ? 6 : 4

         if (q > 0 && pack && born > 0) {
            const img = pack.querySelector('img').getBoundingClientRect()
            const T = { x: img.left + img.width * (.5 + c.jx * .3), y: img.top + sy + img.height * (.58 + c.jy * .15) }
            const dir = base.x < tor.x ? -1 : 1
            const C = { x: base.x + (T.x - base.x) * .3 + dir * 110 * k, y: Math.min(base.y, T.y) - 150 * k }
            const pos = bez(base, C, T, e)
            x = pos.x; y = pos.y
            s = lerp(s, 1.4, e)            // chips grow as they come in to land
            op = born * (e < .9 ? 1 : (1 - e) / .1)
            z = 6
            landed[c.flavor] = (landed[c.flavor] || 0) + smooth(.78, 1, e) / 3
         }
         place(c.el, x, y, rot * (1 - e * .7), s * flipX, s, op, z)
      }

      // Each pack bounces as its chips drop in
      for (const f of FLAVORS) {
         const L = landed[f] || 0
         if (packs[f]) packs[f].style.scale = (1 + .09 * Math.sin(Math.PI * L)).toFixed(4)
      }
   }

   /*----- Reduced motion: a still composition at full power -----*/
   if (reduceMotion) {
      if (video) { video.removeAttribute('autoplay'); video.pause() }
      measure()
      visualScale = 1
      tornadoEl.style.setProperty('--power', 1)
      measureTornado(window.scrollY)
      chips.slice(0, 8).forEach((c, i) => {
         const ang = i * .8
         const r = halfW(c.f) * 1.25 + 26 * k
         place(c.el, tor.x + Math.cos(ang) * r, tor.top + tor.h * c.f + Math.sin(ang) * r * .26, i * 45, 1, 1, 1, 6)
      })
      return
   }

   /*----- Loop -----*/
   let started = null, last = performance.now()
   const loop = now => {
      // The sequence starts once the tornado is on screen (on phones it sits below the fold)
      if (started === null) {
         const r = stage.getBoundingClientRect()
         if (r.top < vh * .7 && r.bottom > 0) started = now
      }
      const t = started === null ? 0 : now - started
      const dt = Math.min(50, now - last) / 1000
      last = now
      const sec = now / 1000
      const sy = window.scrollY

      power = powerAt(t)
      applyPower(t, power)
      measureTornado(sy)

      const heroVisible = sy < tor.top + tor.h + 100
      if (heroVisible && t > CALM_UNTIL + SURGE_MS + 300 && now - lastSpawn > 300) {
         spawn(now)
         lastSpawn = now
      }
      updateFloaters(t, sec)
      updateProduce(now)
      updateDebris(dt, power)
      updateChips(t, sec, dt, sy, power)
      requestAnimationFrame(loop)
   }

   if (video) video.playbackRate = .35
   measure()
   window.addEventListener('resize', measure)
   window.addEventListener('load', measure)
   if ('ResizeObserver' in window) new ResizeObserver(measure).observe(document.querySelector('.main'))
   requestAnimationFrame(loop)
})()
