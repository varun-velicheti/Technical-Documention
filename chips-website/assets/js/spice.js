/*=============== SPICE STATION: GRIND, THEN BLOW POWDER OVER THE CHIPS ===============*/
/*
   The video is scrubbed by scroll, in step with the chips: scrolling down plays
   her grinding and then blowing; scrolling back up rewinds it. The masala cloud
   is computed from the same video time, so it bursts, drifts and un-bursts with
   the scroll too. tornado.js routes the chips through the cloud (waypoint),
   swaps them for spiced versions as they pass, and reports how close they are
   (setApproach: 0 = far away, 1 = at the cloud).
*/
(() => {
   const section = document.getElementById('spice')
   const stage = document.getElementById('spice-stage')
   const video = stage && stage.querySelector('video')
   const canvas = document.getElementById('spice-powder')
   if (!section || !video || !canvas) return

   const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches
   const DURATION = 8.0         // seconds of video
   const PUFF_AT = 5.15         // seconds: the moment she blows
   const PUFF_FOR = 2.8         // seconds of powder leaving her palm
   const HAND = { x: .34, y: .44 }   // her palm, as a fraction of the video frame (close-up shot)
   // chips' approach (0..) mapped to video time: she blows just before they reach her hand
   const A_START = .15, A_END = 1.35

   const clamp = (v, a = 0, b = 1) => Math.min(b, Math.max(a, v))

   /*----- Geometry (document coordinates) -----*/
   let box = null                     // refreshed once per frame by the loop below
   const readBox = () => {
      const r = video.getBoundingClientRect()
      box = { x: r.left, y: r.top + window.scrollY, w: r.width, h: r.height }
      return box
   }
   const videoBox = () => box || readBox()
   const hand = () => { const b = videoBox(); return { x: b.x + b.w * HAND.x, y: b.y + b.h * HAND.y } }

   /*----- Powder canvases -----*/
   const ctx = canvas.getContext('2d')
   // Smoke puffs are soft, so they go on a low-resolution canvas the browser scales up
   const smoke = canvas.cloneNode()
   smoke.removeAttribute('id')
   canvas.parentNode.insertBefore(smoke, canvas)
   const sctx = smoke.getContext('2d')
   const SMOKE_RES = .3
   let cw = 0, ch = 0
   const resize = () => {
      cw = canvas.offsetWidth
      ch = canvas.offsetHeight
      canvas.width = cw
      canvas.height = ch
      smoke.width = Math.round(cw * SMOKE_RES)
      smoke.height = Math.round(ch * SMOKE_RES)
      drawnT = -1
   }

   // soft puff sprite for the smoky part of the cloud
   const puff = document.createElement('canvas')
   puff.width = puff.height = 64
   {
      const g = puff.getContext('2d')
      const grd = g.createRadialGradient(32, 32, 0, 32, 32, 32)
      grd.addColorStop(0, 'rgba(224, 92, 40, .4)')
      grd.addColorStop(.5, 'rgba(206, 70, 30, .14)')
      grd.addColorStop(1, 'rgba(206, 70, 30, 0)')
      g.fillStyle = grd
      g.fillRect(0, 0, 64, 64)
   }

   /*----- Powder particles: fixed set, position is a function of video time -----*/
   // (so the same scroll position always shows the same cloud, forwards or backwards)
   let seed = 7
   const rnd = () => { seed = (seed * 16807) % 2147483647; return (seed - 1) / 2147483646 }
   const rand = (a, b) => a + rnd() * (b - a)
   const parts = []
   for (let i = 0; i < 840; i++) parts.push({ kind: 0, te: PUFF_AT + rnd() * PUFF_FOR,
      jx: rand(-18, 18), jy: rand(-18, 18), vx: rand(180, 920), vy: rand(-300, 230),
      life: rand(3, 5.2), size: rand(1.4, 3.6), seed: rnd() * 10,
      col: `hsl(${rand(6, 26) | 0}, ${rand(78, 92) | 0}%, ${rand(36, 54) | 0}%)` })
   for (let i = 0; i < 84; i++) parts.push({ kind: 1, te: PUFF_AT + rnd() * PUFF_FOR,
      jx: rand(-10, 10), jy: rand(-10, 10), vx: rand(150, 760), vy: rand(-230, 160),
      life: rand(3.6, 5.8), size: rand(26, 50), grow: rand(60, 140), seed: rnd() * 10 })

   let drawnT = -1
   const drawPowder = (vt, scale) => {
      ctx.setTransform(1, 0, 0, 1, 0, 0)
      ctx.clearRect(0, 0, cw, ch)
      sctx.setTransform(SMOKE_RES, 0, 0, SMOKE_RES, 0, 0)
      sctx.clearRect(0, 0, cw, ch)
      if (vt < PUFF_AT) return
      const cr = canvas.getBoundingClientRect()
      const h = hand()
      const ox = h.x - cr.left, oy = h.y - (cr.top + window.scrollY)
      const s = scale, ms = Math.max(.7, scale)
      for (const p of parts) {
         const a = vt - p.te                      // this particle's age
         if (a <= 0 || a >= p.life) continue
         const k = p.kind ? .7 : .55               // light drag: the cloud keeps drifting outward
         const travel = (1 - Math.exp(-k * a)) / k
         // swirling breath, like the cloud in the video
         const swirlY = Math.sin(a * 2.2 + p.seed) * 60 * Math.min(a, 1.5)
         const swirlX = Math.cos(a * 1.7 + p.seed) * 18 * Math.min(a, 1.5)
         const lift = p.kind ? -5 * a * a : 14 * a * a  // smoke rises, specks settle
         const x = ox + (p.jx + p.vx * travel + swirlX) * s
         const y = oy + (p.jy + p.vy * travel + swirlY + lift) * s
         const fade = Math.min(1, a / .15) * (1 - Math.pow(a / p.life, 2))
         if (p.kind === 0) {
            ctx.globalAlpha = fade
            ctx.fillStyle = p.col
            const sz = p.size * ms
            ctx.fillRect(x, y, sz, sz)
         } else {
            const sz = (p.size + p.grow * a) * s
            sctx.globalAlpha = fade * .42           // airy, not a dense blob
            sctx.drawImage(puff, x - sz, y - sz, sz * 2, sz * 2)
         }
      }
      ctx.globalAlpha = 1
      sctx.globalAlpha = 1
   }

   // tornado.js reports how close the chips are
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

   video.pause()
   if (reduceMotion) return

   let visible = false
   new IntersectionObserver(entries => { visible = entries[0].isIntersecting }, { rootMargin: '300px 0px' }).observe(section)

   /*----- Scrub: scroll -> video time -----*/
   let vt = 0
   const loop = () => {
      requestAnimationFrame(loop)
      if (!visible) return
      const target = clamp((approach - A_START) / (A_END - A_START)) * (DURATION - .05)
      vt += (target - vt) * .3                   // a touch of easing so scrubbing feels fluid
      if (Math.abs(target - vt) < .002) vt = target
      // seek only when the frame actually changes and the last seek has finished
      if (!video.seeking && Math.abs(video.currentTime - vt) > 1 / 48) {
         try { video.currentTime = vt } catch (e) {}
      }
      const scale = clamp(readBox().w / 920, .45, 1)
      if (Math.abs(vt - drawnT) > .001) { drawPowder(vt, scale); drawnT = vt }
   }
   // make sure the first frame is decoded so it can be shown while paused
   video.addEventListener('loadeddata', () => { try { video.currentTime = .01 } catch (e) {} }, { once: true })
   requestAnimationFrame(loop)
})()
