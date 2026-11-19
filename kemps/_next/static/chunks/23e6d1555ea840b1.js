(globalThis.TURBOPACK||(globalThis.TURBOPACK=[])).push(["object"==typeof document?document.currentScript:void 0,52863,e=>{"use strict";var t=e.i(71645),r=e.i(89970),o=e.i(83495);function a(){return(0,t.useEffect)(()=>{if(window.matchMedia("(prefers-reduced-motion: reduce)").matches)return void document.querySelectorAll(".reveal-img").forEach(e=>e.classList.add("is-in"));let e=r.gsap.context(()=>{r.gsap.utils.toArray("[data-lq]").forEach(e=>{let t=e.querySelectorAll(".lq-inner"),o={y:0,yPercent:0,"--mp":"0%",duration:1.6,ease:"expo.out",stagger:.12};"auto"===e.dataset.lq?r.gsap.to(t,{...o,delay:.35}):r.gsap.to(t,{...o,scrollTrigger:{trigger:e,start:"top 85%",once:!0}})}),r.gsap.utils.toArray("[data-fade]").forEach(e=>{e.closest(".hero")?r.gsap.to(e,{opacity:1,y:0,duration:1.4,ease:"power3.out",delay:.6+(Number(e.dataset.fade)||0)}):r.gsap.to(e,{opacity:1,y:0,duration:1.2,ease:"power3.out",delay:Number(e.dataset.fade)||0,scrollTrigger:{trigger:e,start:"top 88%",once:!0}})}),r.gsap.utils.toArray(".reveal-img").forEach(e=>{let t=e.querySelector("img");o.ScrollTrigger.create({trigger:e,start:"top 80%",once:!0,onEnter:()=>e.classList.add("is-in")}),e.style.transition="clip-path 1.6s cubic-bezier(.22,1,.36,1)",t&&r.gsap.fromTo(t,{scale:1.18},{scale:1,ease:"none",scrollTrigger:{trigger:e,start:"top bottom",end:"bottom top",scrub:!0}})}),r.gsap.utils.toArray("[data-parallax]").forEach(e=>{let t=Number(e.dataset.parallax)||10;r.gsap.fromTo(e,{yPercent:-t},{yPercent:t,ease:"none",scrollTrigger:{trigger:e.parentElement,start:"top bottom",end:"bottom top",scrub:!0}})}),r.gsap.utils.toArray("[data-ripple] path").forEach(e=>{let t=e.dataset.a,o=e.dataset.b;r.gsap.fromTo(e,{attr:{d:t}},{attr:{d:o},ease:"none",scrollTrigger:{trigger:e.closest("[data-ripple]"),start:"top bottom",end:"bottom top",scrub:1}})})}),t=()=>o.ScrollTrigger.refresh();return window.addEventListener("load",t),()=>{window.removeEventListener("load",t),e.revert()}},[]),null}r.gsap.registerPlugin(o.ScrollTrigger),e.s(["default",()=>a])},10004,53522,e=>{"use strict";var t=e.i(43476);let r={"p-water-blue":{w:409,h:696,widths:[400,409],color:null},"p-water-pink":{w:411,h:796,widths:[400,411],color:null},"p-eightplus":{w:1426,h:3478,widths:[400,800,900],color:null},"p-club-soda":{w:306,h:716,widths:[306],color:null},"p-jeera-soda":{w:321,h:790,widths:[321],color:null},"p-kokum":{w:469,h:651,widths:[400,469],color:null},"p-lemon":{w:440,h:964,widths:[400,440],color:null},"p-mango":{w:320,h:768,widths:[320],color:null},"p-orange":{w:389,h:1008,widths:[389],color:null},"p-pudina":{w:307,h:755,widths:[307],color:null},"jeera-mockup":{w:948,h:3336,widths:[400,800,948],color:null},"ep-duo":{w:1219,h:1e3,widths:[400,800,1200,1219],color:null},"ep-splash":{w:775,h:1146,widths:[400,775],color:null},"ep-logo":{w:1642,h:291,widths:[400,800,1e3],color:null},"ep-banner":{w:4826,h:2781,widths:[400,800,1200,1600,2400],color:"#c4d1db"},"ph-glass":{w:1731,h:1333,widths:[400,800,1200,1400],color:null},award:{w:3600,h:2400,widths:[400,800,1200,1600,1800],color:"#c78d62"},lake:{w:2752,h:1536,widths:[400,800,1200,1600,2400],color:"#5a7d9e"},river:{w:2752,h:1536,widths:[400,800,1200,1600,2400],color:"#768b9d"},droplet:{w:2752,h:1536,widths:[400,800,1200,1600,2400],color:"#375d7b"},logo:{w:900,h:399},"kemps-bottle":{w:1107,h:1487,widths:[400,800,1107],color:null},"ep-bottle":{w:684,h:2455,widths:[400,684],color:null},"droplet-clean":{w:2752,h:1536,widths:[400,800,1200,1600,2400],color:"#3c5e7d"},"hero-kemps":{w:2752,h:1536,widths:[400,800,1200,1600,2400],color:"#7893b7"},"ep-real":{w:1792,h:2400,widths:[400,800,1200,1600,1792],color:"#213c5a"}};e.s(["IMAGES",0,r],53522);var o=e.i(75093);function a({name:e,alt:a,sizes:i="100vw",priority:s=!1,className:n,imgClassName:l,style:c,...u}){let p=r[e];if(!p)return null;let d=t=>p.widths.map(r=>`${o.BASE}/img/${e}-${r}.${t} ${r}w`).join(", ");return(0,t.jsxs)("picture",{className:n,...u,children:[(0,t.jsx)("source",{type:"image/avif",srcSet:d("avif"),sizes:i}),(0,t.jsx)("img",{src:`${o.BASE}/img/${e}-${p.widths[p.widths.length-1]}.webp`,srcSet:d("webp"),sizes:i,width:p.w,height:p.h,alt:a,loading:s?"eager":"lazy",fetchPriority:s?"high":void 0,decoding:s?"sync":"async",className:l,style:{...c,backgroundColor:p.color}})]})}e.s(["default",()=>a],10004)},88525,e=>{"use strict";var t=e.i(43476),r=e.i(71645),o=e.i(10004),a=e.i(53522),i=e.i(75093);function s({alt:e="",sizes:s="100vw",className:n=""}){let l=(0,r.useRef)(null),c=(0,r.useRef)(null);return(0,r.useEffect)(()=>{if(window.matchMedia("(prefers-reduced-motion: reduce)").matches)return;let e=c.current,t=e.getContext("webgl",{premultipliedAlpha:!0,alpha:!0});if(!t)return;let r=a.IMAGES["droplet-clean"],o=r.w/r.h,s=`
      precision highp float;
      varying vec2 vUv;
      uniform sampler2D uPlate; uniform sampler2D uOrig;
      uniform vec2 uRes; uniform float uImgAspect; uniform float uTime;
      uniform vec2 uMouse; uniform float uMouseT;
      const vec3 DROP = vec3(0.5, 0.28, 0.062);
      const vec2 CROWN = vec2(0.5, 0.6);
      const float PERIOD = 3.40;
      const float FALL = 1.05;

      float hash(float n){ return fract(sin(n) * 43758.5453); }

      void main(){
        float ca = uRes.x / uRes.y;
        vec2 s = vec2(1.0);
        if (ca > uImgAspect) s.y = uImgAspect / ca; else s.x = ca / uImgAspect;
        vec2 p = (vUv - 0.5) * s + 0.5;
        vec2 asp = vec2(uImgAspect, 1.0);

        float t = mod(uTime, PERIOD);
        float age = t - FALL;                  // time since impact (negative while falling)
        float hit = step(0.0, age);

        // ── water surface response ───────────────────────────────
        vec2 q = p;
        vec2 dc = (p - CROWN) * asp;
        float rc = length(dc);
        float surface = smoothstep(CROWN.y - 0.3, CROWN.y + 0.02, p.y);
        // idle swell
        q += normalize(dc + 1e-5) / asp * sin(rc * 40.0 - uTime * 1.8) * exp(-rc * 1.8) * 0.0025 * surface;
        if (hit > 0.5) {
          // crown surges up and outward, then relaxes
          float surge = sin(min(age * 5.0, 3.14159)) * exp(-age * 1.6);
          float crown = exp(-pow(rc / 0.34, 2.0));
          q.y += 0.07 * surge * crown;
          q.x -= (p.x - CROWN.x) * 0.16 * surge * crown;
          // shock rings racing outward
          float front = age * 0.55;
          float ring = sin((rc - front) * 70.0) * exp(-abs(rc - front) * 14.0) * exp(-age * 0.9);
          float ring2 = sin((rc - front * 0.6) * 90.0) * exp(-abs(rc - front * 0.6) * 18.0) * exp(-age * 1.2);
          q += normalize(dc + 1e-5) / asp * (ring * 0.012 + ring2 * 0.007) * surface;
        }
        // pointer ripple
        float ma = uTime - uMouseT;
        vec2 dm = (p - uMouse) * asp; float rm = length(dm);
        q += normalize(dm + 1e-5) / asp * sin(rm * 70.0 - ma * 7.0) * exp(-rm * 5.0) * exp(-ma * 1.1) * smoothstep(0.0, 0.15, ma) * 0.012;

        vec4 col = texture2D(uPlate, clamp(q, 0.001, 0.999));
        // impact flash on the crown
        if (hit > 0.5) col.rgb += vec3(0.6, 0.8, 1.0) * exp(-age * 5.0) * exp(-pow(rc / 0.25, 2.0)) * 0.25;

        // ── spray droplets ───────────────────────────────────────
        if (hit > 0.5 && age < 2.2) {
          for (int i = 0; i < 26; i++) {
            float fi = float(i);
            float th = (hash(fi * 3.1) - 0.5) * 2.6;                  // launch angle around vertical
            float sp = 0.45 + hash(fi * 7.7) * 0.55;                  // launch speed
            float rad = 0.004 + hash(fi * 1.9) * 0.011;               // drop size
            vec2 p0 = CROWN + vec2(sin(th) * 0.16 / uImgAspect, -0.07 - hash(fi) * 0.04);
            vec2 v = vec2(sin(th) * sp * 0.55 / uImgAspect, -cos(th * 0.6) * sp);
            float tt = age * (0.9 + hash(fi * 5.3) * 0.3);
            vec2 pos = p0 + v * tt + vec2(0.0, 1.35) * tt * tt;      // gravity pulls back down
            float alive = step(pos.y, CROWN.y + 0.05) * (1.0 - smoothstep(1.6, 2.2, age));
            vec2 d = (p - pos) * asp;
            float r = length(d);
            if (r < rad && alive > 0.5) {
              vec2 n = d / rad;
              float z = sqrt(max(0.0, 1.0 - dot(n, n)));
              vec3 refr = texture2D(uPlate, clamp(p - n / asp * rad * 2.5, 0.001, 0.999)).rgb;
              float hi = pow(max(0.0, dot(normalize(vec3(n, z)), normalize(vec3(-0.4, -0.6, 0.7)))), 18.0);
              float rimv = smoothstep(0.55, 1.0, length(n));
              vec3 dropCol = refr * 1.1 + vec3(0.8, 0.9, 1.0) * (rimv * 0.5 + hi);
              col.rgb = mix(col.rgb, dropCol, smoothstep(1.0, 0.85, length(n)));
            }
          }
        }

        // ── the falling drop ─────────────────────────────────────
        float k = clamp(t / FALL, 0.0, 1.0);
        float fade = smoothstep(0.0, 0.12, t) * (1.0 - hit);
        if (fade > 0.0) {
          float y = mix(-0.12, CROWN.y - 0.1, k * k);               // accelerating fall
          float stretch = 1.0 + 0.35 * k * k;                         // elongates as it speeds up
          vec2 dp = (p - vec2(DROP.x, y)) * asp;
          dp.y /= stretch;
          float r = length(dp);
          if (r < DROP.z) {
            vec2 src = vec2(DROP.x, DROP.y) + dp / asp;
            vec4 dropCol = texture2D(uOrig, src);
            float m = smoothstep(DROP.z, DROP.z * 0.88, r) * fade;
            col.rgb = mix(col.rgb, dropCol.rgb, m);
          }
          // faint motion trail above the drop
          float trail = exp(-pow((p.x - DROP.x) * uImgAspect / (DROP.z * 0.5), 2.0)) * smoothstep(y - 0.02, y - 0.25 * k, p.y) * step(p.y, y) * k * 0.08 * fade;
          col.rgb += vec3(0.7, 0.85, 1.0) * trail;
        }
        gl_FragColor = col;
      }`,n=(e,r)=>{let o=t.createShader(e);return(t.shaderSource(o,r),t.compileShader(o),t.getShaderParameter(o,t.COMPILE_STATUS))?o:(console.warn(t.getShaderInfoLog(o)),null)},u=n(t.VERTEX_SHADER,"attribute vec2 a; varying vec2 vUv; void main(){ vUv = a * 0.5 + 0.5; vUv.y = 1.0 - vUv.y; gl_Position = vec4(a, 0.0, 1.0); }"),p=n(t.FRAGMENT_SHADER,s);if(!u||!p)return;let d=t.createProgram();t.attachShader(d,u),t.attachShader(d,p),t.linkProgram(d),t.useProgram(d);let m=t.createBuffer();t.bindBuffer(t.ARRAY_BUFFER,m),t.bufferData(t.ARRAY_BUFFER,new Float32Array([-1,-1,1,-1,-1,1,-1,1,1,-1,1,1]),t.STATIC_DRAW);let f=t.getAttribLocation(d,"a");t.enableVertexAttribArray(f),t.vertexAttribPointer(f,2,t.FLOAT,!1,0,0);let h={res:t.getUniformLocation(d,"uRes"),asp:t.getUniformLocation(d,"uImgAspect"),time:t.getUniformLocation(d,"uTime"),mouse:t.getUniformLocation(d,"uMouse"),mouseT:t.getUniformLocation(d,"uMouseT"),plate:t.getUniformLocation(d,"uPlate"),orig:t.getUniformLocation(d,"uOrig")};t.uniform1f(h.asp,o),t.uniform2f(h.mouse,-5,-5),t.uniform1f(h.mouseT,-100),t.uniform1i(h.plate,0),t.uniform1i(h.orig,1);let g=r.widths.find(e=>e>=Math.min(1600,1.5*l.current.clientWidth))||r.widths[r.widths.length-1],v=0,w=!1,x=0,T=performance.now(),y=()=>(performance.now()-T)/1e3,b=(e,r)=>{let o=t.createTexture(),a=new Image;return a.onload=()=>{t.activeTexture(t.TEXTURE0+e),t.bindTexture(t.TEXTURE_2D,o),t.texImage2D(t.TEXTURE_2D,0,t.RGBA,t.RGBA,t.UNSIGNED_BYTE,a),t.texParameteri(t.TEXTURE_2D,t.TEXTURE_MIN_FILTER,t.LINEAR),t.texParameteri(t.TEXTURE_2D,t.TEXTURE_MAG_FILTER,t.LINEAR),t.texParameteri(t.TEXTURE_2D,t.TEXTURE_WRAP_S,t.CLAMP_TO_EDGE),t.texParameteri(t.TEXTURE_2D,t.TEXTURE_WRAP_T,t.CLAMP_TO_EDGE),2==++v&&(A(),l.current?.classList.add("is-live"),U())},a.src=(0,i.asset)(`/img/${r}-${g}.webp`),o},E=b(0,"droplet-clean"),R=b(1,"droplet"),A=()=>{let r=e.getBoundingClientRect(),o=Math.min(window.devicePixelRatio||1,1.5);e.width=Math.max(1,Math.round(r.width*o)),e.height=Math.max(1,Math.round(r.height*o)),t.viewport(0,0,e.width,e.height),t.uniform2f(h.res,e.width,e.height)},P=()=>{x=0,v<2||!w||document.hidden||(t.uniform1f(h.time,y()),t.drawArrays(t.TRIANGLES,0,6),x=requestAnimationFrame(P))},U=()=>{x||(x=requestAnimationFrame(P))},L=new IntersectionObserver(([e])=>{(w=e.isIntersecting)&&U()},{rootMargin:"100px"});L.observe(l.current);let _=new ResizeObserver(()=>2===v&&A());_.observe(e);let S=l.current.closest("section")||l.current,I=0,D=r=>{let a=y();if(a-I<.35)return;let i=e.getBoundingClientRect(),s=(r.clientX-i.left)/i.width,n=(r.clientY-i.top)/i.height;if(s<0||s>1||n<0||n>1)return;let l=i.width/i.height,c=1,u=1;l>o?u=o/l:c=l/o,t.uniform2f(h.mouse,(s-.5)*c+.5,(n-.5)*u+.5),t.uniform1f(h.mouseT,a),I=a};S.addEventListener("pointermove",D);let M=()=>U();return document.addEventListener("visibilitychange",M),()=>{cancelAnimationFrame(x),L.disconnect(),_.disconnect(),S.removeEventListener("pointermove",D),document.removeEventListener("visibilitychange",M),t.deleteTexture(E),t.deleteTexture(R),t.deleteBuffer(m),t.deleteProgram(d)}},[]),(0,t.jsxs)("div",{ref:l,className:`liquid liquid--cover ${n}`,children:[(0,t.jsx)(o.default,{name:"droplet",alt:e,sizes:s,style:{backgroundColor:"transparent"}}),(0,t.jsx)("canvas",{ref:c,"aria-hidden":"true"})]})}e.s(["default",()=>s])},41502,e=>{"use strict";var t=e.i(43476),r=e.i(71645),o=e.i(10004),a=e.i(53522),i=e.i(75093);function s({name:e,alt:s,sizes:n="100vw",fit:l="cover",mode:c="ripple",center:u=[.5,.6],drop:p=null,protect:d=[.36,.08,.64,.98],angle:m=0,strength:f=1,focus:h=[.5,.5],focusMobile:g,rippleProtect:v=!1,priority:w=!1,className:x="",imgStyle:T}){let y=(0,r.useRef)(null),b=(0,r.useRef)(null);return(0,r.useEffect)(()=>{if(window.matchMedia("(prefers-reduced-motion: reduce)").matches)return;let t=g&&window.matchMedia("(max-width: 720px)").matches?g:h,r=b.current,o=r.getContext("webgl",{premultipliedAlpha:!0,alpha:!0,antialias:!1});if(!o)return;let s=a.IMAGES[e],n=s.w/s.h,w=`
      precision highp float;
      varying vec2 vUv;
      uniform sampler2D uTex;
      uniform vec2 uRes; uniform float uImgAspect; uniform float uTime; uniform float uFit; uniform float uMode;
      uniform vec2 uCenter; uniform vec3 uDrop; uniform vec4 uProtect; uniform float uStrength; uniform float uAngle; uniform vec2 uFocus; uniform float uRippleProtect;
      uniform vec2 uMouse; uniform float uMouseT;

      vec2 fitUv(vec2 uv){
        float ca = uRes.x / uRes.y;
        vec2 s = vec2(1.0);
        if (uFit < 0.5) { if (ca > uImgAspect) s.y = uImgAspect / ca; else s.x = ca / uImgAspect; }
        else { if (ca > uImgAspect) s.x = ca / uImgAspect; else s.y = uImgAspect / ca; }
        return uv * s + (1.0 - s) * uFocus;
      }

      float protectMask(vec2 p, vec2 asp){
        vec2 pc = (uProtect.xy + uProtect.zw) * 0.5;
        vec2 d = (p - pc) * asp;
        float ca = cos(uAngle), sa = sin(uAngle);
        vec2 b = vec2(ca * d.x - sa * d.y, sa * d.x + ca * d.y) / asp + pc;
        vec2 q = smoothstep(uProtect.xy - 0.02, uProtect.xy + 0.02, b) * (1.0 - smoothstep(uProtect.zw - 0.02, uProtect.zw + 0.02, b));
        return q.x * q.y;
      }

      void main(){
        vec2 p = fitUv(vUv);
        vec2 asp = vec2(uImgAspect, 1.0);
        float sheen = 0.0;
        float sparkle = 0.0;

        if (uMode < 0.5) {
          // ── ripple: waves from the crown, stronger on the water surface
          vec2 d = (p - uCenter) * asp;
          float r = length(d);
          float surface = smoothstep(uCenter.y - 0.32, uCenter.y + 0.02, p.y) * (1.0 - protectMask(p, asp) * step(0.0001, uProtect.z - uProtect.x) * uRippleProtect);
          float w = sin(r * 46.0 - uTime * 2.0) * exp(-r * 1.6);
          w += 0.5 * sin(r * 90.0 - uTime * 3.1) * exp(-r * 3.0);
          p += normalize(d + 1e-5) / asp * w * 0.0045 * surface * uStrength;
          // pointer ripple
          float age = uTime - uMouseT;
          vec2 dm = (p - uMouse) * asp;
          float rm = length(dm);
          float w2 = sin(rm * 70.0 - age * 7.0) * exp(-rm * 5.0) * exp(-age * 1.1) * smoothstep(0.0, 0.15, age);
          p += normalize(dm + 1e-5) / asp * w2 * 0.012;
          // bobbing drop
          if (uDrop.z > 0.0) {
            float dd = length((p - uDrop.xy) * asp);
            float k = 1.0 - smoothstep(uDrop.z * 0.9, uDrop.z * 2.2, dd);
            p.y += sin(uTime * 1.3) * 0.014 * k;
          }
        } else {
          // ── splash: flowing water outside the protected bottle area
          // move into the bottle's upright frame (handles tilted bottles)
          vec2 pc = (uProtect.xy + uProtect.zw) * 0.5;
          vec2 dd0 = (p - pc) * asp;
          float ca = cos(uAngle), sa = sin(uAngle);
          vec2 b = vec2(ca * dd0.x - sa * dd0.y, sa * dd0.x + ca * dd0.y) / asp + pc;
          vec2 q = smoothstep(uProtect.xy - 0.02, uProtect.xy + 0.02, b) * (1.0 - smoothstep(uProtect.zw - 0.02, uProtect.zw + 0.02, b));
          float inside = q.x * q.y;
          float flow = 1.0 - inside;
          vec2 o = vec2(
            sin(p.y * 26.0 + uTime * 1.6) + 0.6 * sin(p.y * 61.0 - uTime * 2.3 + p.x * 9.0),
            cos(p.x * 24.0 + uTime * 1.3) + 0.6 * cos(p.x * 57.0 + uTime * 2.0 + p.y * 7.0)
          );
          p += o * 0.0032 * flow * uStrength;
          // light sheen sweeping across the bottle every few seconds
          float x = (b.x - uProtect.x) / (uProtect.z - uProtect.x) + (b.y - 0.5) * 0.35;
          float pos = fract(uTime * 0.11) * 2.6 - 0.8;
          sheen = smoothstep(0.16, 0.0, abs(x - pos)) * inside * 0.32;
          // sparkle on splash highlights
          sparkle = flow * 0.22 * pow(max(0.0, sin(p.x * 140.0 + uTime * 3.0) * sin(p.y * 120.0 - uTime * 2.4)), 24.0);
        }

        if (p.x < 0.0 || p.x > 1.0 || p.y < 0.0 || p.y > 1.0) { gl_FragColor = vec4(0.0); return; }
        vec4 c = texture2D(uTex, p);
        float lum = dot(c.rgb, vec3(0.299, 0.587, 0.114));
        // sheen only on the bottle, sparkle only on bright water highlights (never on dark backdrops)
        c.rgb += (sheen * smoothstep(0.15, 0.5, lum) + sparkle * smoothstep(0.55, 0.9, lum)) * c.a;
        gl_FragColor = c;
      }`,x=(e,t)=>{let r=o.createShader(e);return(o.shaderSource(r,t),o.compileShader(r),o.getShaderParameter(r,o.COMPILE_STATUS))?r:(console.warn(o.getShaderInfoLog(r)),null)},T=x(o.VERTEX_SHADER,"attribute vec2 a; varying vec2 vUv; void main(){ vUv = a * 0.5 + 0.5; vUv.y = 1.0 - vUv.y; gl_Position = vec4(a, 0.0, 1.0); }"),E=x(o.FRAGMENT_SHADER,w);if(!T||!E)return;let R=o.createProgram();o.attachShader(R,T),o.attachShader(R,E),o.linkProgram(R),o.useProgram(R);let A=o.createBuffer();o.bindBuffer(o.ARRAY_BUFFER,A),o.bufferData(o.ARRAY_BUFFER,new Float32Array([-1,-1,1,-1,-1,1,-1,1,1,-1,1,1]),o.STATIC_DRAW);let P=o.getAttribLocation(R,"a");o.enableVertexAttribArray(P),o.vertexAttribPointer(P,2,o.FLOAT,!1,0,0);let U={res:o.getUniformLocation(R,"uRes"),asp:o.getUniformLocation(R,"uImgAspect"),time:o.getUniformLocation(R,"uTime"),fit:o.getUniformLocation(R,"uFit"),mode:o.getUniformLocation(R,"uMode"),center:o.getUniformLocation(R,"uCenter"),drop:o.getUniformLocation(R,"uDrop"),protect:o.getUniformLocation(R,"uProtect"),strength:o.getUniformLocation(R,"uStrength"),mouse:o.getUniformLocation(R,"uMouse"),mouseT:o.getUniformLocation(R,"uMouseT"),angle:o.getUniformLocation(R,"uAngle"),focus:o.getUniformLocation(R,"uFocus"),rp:o.getUniformLocation(R,"uRippleProtect")};o.uniform1f(U.asp,n),o.uniform1f(U.fit,+("cover"!==l)),o.uniform1f(U.mode,+("ripple"!==c)),o.uniform2f(U.center,u[0],u[1]),o.uniform3f(U.drop,...p||[0,0,0]),o.uniform4f(U.protect,...d),o.uniform1f(U.strength,f),o.uniform1f(U.angle,m),o.uniform2f(U.focus,t[0],t[1]),o.uniform1f(U.rp,+!!v),o.uniform2f(U.mouse,-5,-5),o.uniform1f(U.mouseT,-100);let L=o.createTexture(),_=!1,S=!1,I=0,D=performance.now(),M=()=>(performance.now()-D)/1e3,C=()=>{let e=r.getBoundingClientRect(),t=Math.min(window.devicePixelRatio||1,1.5);r.width=Math.max(1,Math.round(e.width*t)),r.height=Math.max(1,Math.round(e.height*t)),o.viewport(0,0,r.width,r.height),o.uniform2f(U.res,r.width,r.height)},N=()=>{I=0,_&&S&&!document.hidden&&(o.uniform1f(U.time,M()),o.clearColor(0,0,0,0),o.clear(o.COLOR_BUFFER_BIT),o.drawArrays(o.TRIANGLES,0,6),I=requestAnimationFrame(N))},k=()=>{I||(I=requestAnimationFrame(N))},j=new Image;j.decoding="async";let F=s.widths.find(e=>e>=Math.min(1600,1.5*y.current.clientWidth))||s.widths[s.widths.length-1];j.onload=()=>{o.bindTexture(o.TEXTURE_2D,L),o.pixelStorei(o.UNPACK_PREMULTIPLY_ALPHA_WEBGL,!0),o.texImage2D(o.TEXTURE_2D,0,o.RGBA,o.RGBA,o.UNSIGNED_BYTE,j),o.texParameteri(o.TEXTURE_2D,o.TEXTURE_MIN_FILTER,o.LINEAR),o.texParameteri(o.TEXTURE_2D,o.TEXTURE_MAG_FILTER,o.LINEAR),o.texParameteri(o.TEXTURE_2D,o.TEXTURE_WRAP_S,o.CLAMP_TO_EDGE),o.texParameteri(o.TEXTURE_2D,o.TEXTURE_WRAP_T,o.CLAMP_TO_EDGE),_=!0,C(),y.current?.classList.add("is-live"),k()},j.src=(0,i.asset)(`/img/${e}-${F}.webp`);let O=new IntersectionObserver(([e])=>{(S=e.isIntersecting)&&k()},{rootMargin:"100px"});O.observe(y.current);let $=new ResizeObserver(()=>_&&C());$.observe(r);let z=y.current.closest("section")||y.current,q=0,B=e=>{if("ripple"!==c)return;let a=M();if(a-q<.35)return;let i=r.getBoundingClientRect(),s=(e.clientX-i.left)/i.width,u=(e.clientY-i.top)/i.height;if(s<0||s>1||u<0||u>1)return;let p=i.width/i.height,d=1,m=1;"cover"===l&&(p>n?m=n/p:d=p/n),o.uniform2f(U.mouse,s*d+(1-d)*t[0],u*m+(1-m)*t[1]),o.uniform1f(U.mouseT,a),q=a};return z.addEventListener("pointermove",B),()=>{cancelAnimationFrame(I),O.disconnect(),$.disconnect(),z.removeEventListener("pointermove",B),o.deleteTexture(L),o.deleteBuffer(A),o.deleteProgram(R)}},[e,l,c,f]),(0,t.jsxs)("div",{ref:y,className:`liquid liquid--${l} ${x}`,children:[(0,t.jsx)(o.default,{name:e,alt:s,sizes:n,priority:w,style:{backgroundColor:"transparent",objectPosition:`${100*h[0]}% ${100*h[1]}%`,...T}}),(0,t.jsx)("canvas",{ref:b,"aria-hidden":"true"})]})}e.s(["default",()=>s])},86694,e=>{"use strict";var t=e.i(43476),r=e.i(71645),o=e.i(12656),a=e.i(3546),i=e.i(17176);let s=["General enquiry","Product & pricing","Bulk / event order","Become a distributor","Retail partnership","Eight Plus","Feedback"];function n(){let[e,n]=(0,r.useState)({name:"",phone:"",email:"",city:"",topic:"",message:""}),[l,c]=(0,r.useState)({}),[u,p]=(0,r.useState)(""),d=e=>t=>{n(r=>({...r,[e]:t.target.value})),c(t=>({...t,[e]:void 0}))},m=()=>{let t,r,o={};return e.name.trim().length<2&&(o.name="Please enter your name."),t=e.phone,/^[+]?[0-9\s-]{10,16}$/.test(t.trim())||(o.phone="Enter a valid phone number."),e.email&&(r=e.email,!/^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(r.trim()))&&(o.email="Enter a valid email address."),e.topic||(o.topic="Please choose a topic."),e.message.trim().length<5&&(o.message="Please add a short message."),c(o),Object.keys(o).length&&document.getElementById(`cf-${Object.keys(o)[0]}`)?.focus(),0===Object.keys(o).length},f=()=>`${e.topic}

Name: ${e.name}
Phone: ${e.phone}${e.email?`
Email: ${e.email}`:""}${e.city?`
City: ${e.city}`:""}

${e.message}`,h=({k:r,label:o,type:a="text",ac:i,full:s,optional:n})=>(0,t.jsxs)("div",{className:`field${s?" field--full":""}`,children:[(0,t.jsxs)("label",{htmlFor:`cf-${r}`,children:[o,n&&(0,t.jsx)("span",{style:{textTransform:"none",letterSpacing:0},children:" (optional)"})]}),(0,t.jsx)("input",{id:`cf-${r}`,className:"input",type:a,autoComplete:i,value:e[r],onChange:d(r),"aria-invalid":l[r]?"true":void 0,"aria-describedby":l[r]?`cf-${r}-e`:void 0}),l[r]&&(0,t.jsx)("span",{className:"err",id:`cf-${r}-e`,children:l[r]})]});return(0,t.jsxs)("form",{className:"form",onSubmit:e=>{e.preventDefault(),m()&&(window.open((0,a.waLink)(`Hello Kemp's — ${f()}`),"_blank","noopener"),p("WhatsApp has opened with your message — just press send."))},noValidate:!0,children:[h({k:"name",label:"Full name",ac:"name"}),h({k:"phone",label:"Phone",type:"tel",ac:"tel"}),h({k:"email",label:"Email",type:"email",ac:"email",optional:!0}),h({k:"city",label:"City / town",ac:"address-level2",optional:!0}),(0,t.jsxs)("div",{className:"field field--full",children:[(0,t.jsx)("label",{htmlFor:"cf-topic",children:"Topic"}),(0,t.jsxs)("select",{id:"cf-topic",className:"select",value:e.topic,onChange:d("topic"),"aria-invalid":l.topic?"true":void 0,children:[(0,t.jsx)("option",{value:"",children:"Select…"}),s.map(e=>(0,t.jsx)("option",{children:e},e))]}),l.topic&&(0,t.jsx)("span",{className:"err",children:l.topic})]}),(0,t.jsxs)("div",{className:"field field--full",children:[(0,t.jsx)("label",{htmlFor:"cf-message",children:"Message"}),(0,t.jsx)("textarea",{id:"cf-message",className:"textarea",value:e.message,onChange:d("message"),"aria-invalid":l.message?"true":void 0,placeholder:"Products, quantities, delivery location…"}),l.message&&(0,t.jsx)("span",{className:"err",children:l.message})]}),(0,t.jsxs)("div",{className:"form__foot",children:[(0,t.jsx)("p",{className:"form-status","data-state":u?"ok":"idle",role:"status","aria-live":"polite",style:{margin:0,maxWidth:"40ch"},children:u}),(0,t.jsxs)("div",{style:{display:"flex",gap:10,flexWrap:"wrap"},children:[(0,t.jsx)("button",{type:"button",className:"btn btn--ghost",onClick:()=>{m()&&(window.location.href=`mailto:${o.BRAND.email}?subject=${encodeURIComponent(`Website enquiry: ${e.topic}`)}&body=${encodeURIComponent(f())}`,p("Your email app has opened with your message — just press send."))},children:"Send by email"}),(0,t.jsxs)("button",{className:"btn",children:[(0,t.jsx)(i.WhatsApp,{width:16,height:16})," Send on WhatsApp ",(0,t.jsx)(i.Arrow,{})]})]})]})]})}e.s(["default",()=>n])}]);