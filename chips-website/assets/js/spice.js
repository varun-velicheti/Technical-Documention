/*=============== SPICE STATION: GRIND, THEN BLOW POWDER OVER THE CHIPS ===============*/
/*
   The video loops the grinding part until the chips from the tornado approach.
   Then it plays the part where she blows, and a cloud of red masala powder
   bursts from her hand across the page. tornado.js routes the chips through
   that cloud (waypoint) and swaps them for spiced versions as they pass.
*/
(() => {
   const section = document.getElementById('spice')
   const stage = document.getElementById('spice-stage')
   const video = stage && stage.querySelector('video')
   const canvas = document.getElementById('spice-powder')
   if (!section || !video || !canvas) return

   const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches
   const GRIND_END = 4.0        // seconds: grinding loop 0 -> 4.0
   const BLOW_FROM = 4.3        // seconds: the close-up where she lifts her palm
   const PUFF_AT = 5.15         // seconds: the moment she blows
   const HAND = { x: .34, y: .44 }   // her palm, as a fraction of the video frame (close-up shot)

   const clamp = (v, a = 0, b = 1) => Math.min(b, Math.max(a, v))
   const rand = (a, b) => a + Math.random() * (b - a)

   /*----- Geometry (document coordinates) -----*/
   const videoBox = () => {
      const r = video.getBoundingClientRect()
      return { x: r.left, y: r.top + window.scrollY, w: r.width, h: r.height }
   }
   const hand = () => { const b = videoBox(); return { x: b.x + b.w * HAND.x, y: b.y + b.h * HAND.y } }

   /*----- Powder particles -----*/
   const ctx = canvas.getContext('2d')
   let cw = 0, ch = 0, dpr = 1
   const resize = () => {
      dpr = Math.min(1.5, window.devicePixelRatio || 1)
      cw = section.offsetWidth
      ch = section.offsetHeight
      canvas.width = Math.round(cw * dpr)
      canvas.height = Math.round(ch * dpr)
   }

   // soft puff sprite for the smoky part of the cloud
   const puff = document.createElement('canvas')
   puff.width = puff.height = 64
   {
      const g = puff.getContext('2d')
      const grd = g.createRadialGradient(32, 32, 0, 32, 32, 32)
      grd.addColorStop(0, 'rgba(224, 92, 40, .55)')
      grd.addColorStop(.5, 'rgba(206, 70, 30, .22)')
      grd.addColorStop(1, 'rgba(206, 70, 30, 0)')
      g.fillStyle = grd
      g.fillRect(0, 0, 64, 64)
   }

   const parts = []
   let emitting = 0              // ms of emission left
   const emit = (dt, scale) => {
      const sr = section.getBoundingClientRect()
      const h = hand()
      const ox = h.x - sr.left, oy = h.y - (sr.top + window.scrollY)
      const specks = Math.round(420 * dt), puffs = Math.max(1, Math.round(32 * dt))
      for (let i = 0; i < specks && parts.length < 1400; i++) {
         parts.push({ kind: 0, x: ox + rand(-6, 6) * scale, y: oy + rand(-6, 6) * scale,
            vx: rand(260, 640) * scale, vy: rand(-90, 40) * scale, life: rand(2.2, 3.8), age: 0,
            size: rand(1.4, 3.6) * Math.max(.7, scale), seed: Math.random() * 10,
            col: `hsl(${rand(6, 26) | 0}, ${rand(78, 92) | 0}%, ${rand(36, 54) | 0}%)` })
      }
      for (let i = 0; i < puffs; i++) {
         parts.push({ kind: 1, x: ox, y: oy, vx: rand(220, 460) * scale, vy: rand(-60, 10) * scale,
            life: rand(2.6, 4.2), age: 0, size: rand(18, 34) * scale, grow: rand(28, 60) * scale, seed: Math.random() * 10 })
      }
   }

   const step = (dt, t, scale) => {
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0)
      ctx.clearRect(0, 0, cw, ch)
      for (let i = parts.length - 1; i >= 0; i--) {
         const p = parts[i]
         p.age += dt
         if (p.age >= p.life) { parts.splice(i, 1); continue }
         const drag = Math.exp(-(p.kind ? 1.1 : .9) * dt)
         p.vx *= drag; p.vy *= drag
         // swirling breath: waves along the flow, like the cloud in the video
         p.vy += Math.sin(p.x * .011 + t * 2.4 + p.seed) * 120 * scale * dt
         p.vx += Math.cos(p.y * .013 + t * 1.7 + p.seed) * 40 * scale * dt
         if (p.kind === 0) p.vy += 28 * scale * dt           // specks slowly settle
         else { p.vy -= 10 * scale * dt; p.size += p.grow * dt }  // smoke rises and spreads
         p.x += p.vx * dt; p.y += p.vy * dt
         const fade = Math.min(1, p.age / .15) * (1 - Math.pow(p.age / p.life, 2))
         if (p.kind === 0) {
            ctx.globalAlpha = fade
            ctx.fillStyle = p.col
            ctx.fillRect(p.x, p.y, p.size, p.size)
         } else {
            ctx.globalAlpha = fade * .8
            ctx.drawImage(puff, p.x - p.size, p.y - p.size, p.size * 2, p.size * 2)
         }
      }
      ctx.globalAlpha = 1
   }

   /*----- Video states: grind (loop) -> blow (once) -----*/
   let state = 'grind', puffed = false, visible = false
   const toGrind = () => {
      state = 'grind'; puffed = false
      try { video.currentTime = 0 } catch (e) {}
      if (visible) video.play().catch(() => {})
   }
   const toBlow = () => {
      state = 'blow'; puffed = false
      try { video.currentTime = BLOW_FROM } catch (e) {}
      video.play().catch(() => {})
   }

   // tornado.js reports how close the chips are (0 = far, 1 = at the cloud)
   let approach = 0
   window.SpiceStation = {
      // where a chip should pass through the cloud (document coordinates)
      waypoint: (jx, jy) => {
         const b = videoBox(), h = hand()
         return { x: h.x + b.w * (.3 + jx * .38), y: h.y + b.h * (-.02 + jy * .34) }
      },
      // scroll position (document y) at which the stage sits in the middle of the screen
      centreScroll: () => { const b = videoBox(); return b.y + b.h / 2 - window.innerHeight / 2 },
      setApproach: v => { approach = v }
   }

   resize()
   window.addEventListener('resize', resize)
   window.addEventListener('load', resize)

   if (reduceMotion) { video.removeAttribute('autoplay'); return }

   new IntersectionObserver(entries => {
      visible = entries[0].isIntersecting
      if (visible) video.play().catch(() => {})
      else video.pause()
   }, { rootMargin: '200px 0px' }).observe(section)

   let last = performance.now()
   const loop = now => {
      const dt = Math.min(50, now - last) / 1000
      last = now
      const t = now / 1000
      const scale = clamp(videoBox().w / 920, .45, 1)

      if (state === 'grind') {
         if (video.currentTime >= GRIND_END) { try { video.currentTime = .05 } catch (e) {} }
         if (approach > .58) toBlow()                       // chips are on their way: blow!
      } else {
         if (!puffed && video.currentTime >= PUFF_AT) { puffed = true; emitting = 2.3 }
         if (approach < .3 && !emitting && !parts.length) toGrind()   // scrolled back up
      }

      if (emitting > 0) { emit(dt, scale); emitting = Math.max(0, emitting - dt) }
      if (parts.length || emitting) step(dt, t, scale)
      else if (canvas._dirty !== false) { ctx.clearRect(0, 0, canvas.width, canvas.height); canvas._dirty = false }
      if (parts.length) canvas._dirty = true
      requestAnimationFrame(loop)
   }
   requestAnimationFrame(loop)
})()
