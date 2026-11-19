(globalThis.TURBOPACK||(globalThis.TURBOPACK=[])).push(["object"==typeof document?document.currentScript:void 0,52863,e=>{"use strict";var t=e.i(71645),a=e.i(89970),r=e.i(83495);function i(){return(0,t.useEffect)(()=>{if(window.matchMedia("(prefers-reduced-motion: reduce)").matches)return void document.querySelectorAll(".reveal-img").forEach(e=>e.classList.add("is-in"));let e=a.gsap.context(()=>{a.gsap.utils.toArray("[data-lq]").forEach(e=>{let t=e.querySelectorAll(".lq-inner"),r={y:0,yPercent:0,"--mp":"0%",duration:1.6,ease:"expo.out",stagger:.12};"auto"===e.dataset.lq?a.gsap.to(t,{...r,delay:.35}):a.gsap.to(t,{...r,scrollTrigger:{trigger:e,start:"top 85%",once:!0}})}),a.gsap.utils.toArray("[data-fade]").forEach(e=>{e.closest(".hero")?a.gsap.to(e,{opacity:1,y:0,duration:1.4,ease:"power3.out",delay:.6+(Number(e.dataset.fade)||0)}):a.gsap.to(e,{opacity:1,y:0,duration:1.2,ease:"power3.out",delay:Number(e.dataset.fade)||0,scrollTrigger:{trigger:e,start:"top 88%",once:!0}})}),a.gsap.utils.toArray(".reveal-img").forEach(e=>{let t=e.querySelector("img");r.ScrollTrigger.create({trigger:e,start:"top 80%",once:!0,onEnter:()=>e.classList.add("is-in")}),e.style.transition="clip-path 1.6s cubic-bezier(.22,1,.36,1)",t&&a.gsap.fromTo(t,{scale:1.18},{scale:1,ease:"none",scrollTrigger:{trigger:e,start:"top bottom",end:"bottom top",scrub:!0}})}),a.gsap.utils.toArray("[data-parallax]").forEach(e=>{let t=Number(e.dataset.parallax)||10;a.gsap.fromTo(e,{yPercent:-t},{yPercent:t,ease:"none",scrollTrigger:{trigger:e.parentElement,start:"top bottom",end:"bottom top",scrub:!0}})}),a.gsap.utils.toArray("[data-ripple] path").forEach(e=>{let t=e.dataset.a,r=e.dataset.b;a.gsap.fromTo(e,{attr:{d:t}},{attr:{d:r},ease:"none",scrollTrigger:{trigger:e.closest("[data-ripple]"),start:"top bottom",end:"bottom top",scrub:1}})})}),t=()=>r.ScrollTrigger.refresh();return window.addEventListener("load",t),()=>{window.removeEventListener("load",t),e.revert()}},[]),null}a.gsap.registerPlugin(r.ScrollTrigger),e.s(["default",()=>i])},10004,53522,e=>{"use strict";var t=e.i(43476);let a={"p-water-blue":{w:409,h:696,widths:[400,409],color:null},"p-water-pink":{w:411,h:796,widths:[400,411],color:null},"p-eightplus":{w:1426,h:3478,widths:[400,800,900],color:null},"p-club-soda":{w:306,h:716,widths:[306],color:null},"p-jeera-soda":{w:321,h:790,widths:[321],color:null},"p-kokum":{w:469,h:651,widths:[400,469],color:null},"p-lemon":{w:440,h:964,widths:[400,440],color:null},"p-mango":{w:320,h:768,widths:[320],color:null},"p-orange":{w:389,h:1008,widths:[389],color:null},"p-pudina":{w:307,h:755,widths:[307],color:null},"jeera-mockup":{w:948,h:3336,widths:[400,800,948],color:null},"ep-duo":{w:1219,h:1e3,widths:[400,800,1200,1219],color:null},"ep-splash":{w:775,h:1146,widths:[400,775],color:null},"ep-logo":{w:1642,h:291,widths:[400,800,1e3],color:null},"ep-banner":{w:4826,h:2781,widths:[400,800,1200,1600,2400],color:"#c4d1db"},"ph-glass":{w:1731,h:1333,widths:[400,800,1200,1400],color:null},award:{w:3600,h:2400,widths:[400,800,1200,1600,1800],color:"#c78d62"},lake:{w:2752,h:1536,widths:[400,800,1200,1600,2400],color:"#5a7d9e"},river:{w:2752,h:1536,widths:[400,800,1200,1600,2400],color:"#768b9d"},droplet:{w:2752,h:1536,widths:[400,800,1200,1600,2400],color:"#375d7b"},logo:{w:900,h:399},"kemps-bottle":{w:1107,h:1487,widths:[400,800,1107],color:null},"ep-bottle":{w:684,h:2455,widths:[400,684],color:null},"droplet-clean":{w:2752,h:1536,widths:[400,800,1200,1600,2400],color:"#3c5e7d"},"hero-kemps":{w:2752,h:1536,widths:[400,800,1200,1600,2400],color:"#7893b7"}};e.s(["IMAGES",0,a],53522);var r=e.i(75093);function i({name:e,alt:i,sizes:o="100vw",priority:s=!1,className:l,imgClassName:n,style:c,...d}){let u=a[e];if(!u)return null;let m=t=>u.widths.map(a=>`${r.BASE}/img/${e}-${a}.${t} ${a}w`).join(", ");return(0,t.jsxs)("picture",{className:l,...d,children:[(0,t.jsx)("source",{type:"image/avif",srcSet:m("avif"),sizes:o}),(0,t.jsx)("img",{src:`${r.BASE}/img/${e}-${u.widths[u.widths.length-1]}.webp`,srcSet:m("webp"),sizes:o,width:u.w,height:u.h,alt:i,loading:s?"eager":"lazy",fetchPriority:s?"high":void 0,decoding:s?"sync":"async",className:n,style:{...c,backgroundColor:u.color}})]})}e.s(["default",()=>i],10004)},88525,e=>{"use strict";var t=e.i(43476),a=e.i(71645),r=e.i(10004),i=e.i(53522),o=e.i(75093);function s({alt:e="",sizes:s="100vw",className:l=""}){let n=(0,a.useRef)(null),c=(0,a.useRef)(null);return(0,a.useEffect)(()=>{if(window.matchMedia("(prefers-reduced-motion: reduce)").matches)return;let e=c.current,t=e.getContext("webgl",{premultipliedAlpha:!0,alpha:!0});if(!t)return;let a=i.IMAGES["droplet-clean"],r=a.w/a.h,s=`
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
      }`,l=(e,a)=>{let r=t.createShader(e);return(t.shaderSource(r,a),t.compileShader(r),t.getShaderParameter(r,t.COMPILE_STATUS))?r:(console.warn(t.getShaderInfoLog(r)),null)},d=l(t.VERTEX_SHADER,"attribute vec2 a; varying vec2 vUv; void main(){ vUv = a * 0.5 + 0.5; vUv.y = 1.0 - vUv.y; gl_Position = vec4(a, 0.0, 1.0); }"),u=l(t.FRAGMENT_SHADER,s);if(!d||!u)return;let m=t.createProgram();t.attachShader(m,d),t.attachShader(m,u),t.linkProgram(m),t.useProgram(m);let p=t.createBuffer();t.bindBuffer(t.ARRAY_BUFFER,p),t.bufferData(t.ARRAY_BUFFER,new Float32Array([-1,-1,1,-1,-1,1,-1,1,1,-1,1,1]),t.STATIC_DRAW);let h=t.getAttribLocation(m,"a");t.enableVertexAttribArray(h),t.vertexAttribPointer(h,2,t.FLOAT,!1,0,0);let f={res:t.getUniformLocation(m,"uRes"),asp:t.getUniformLocation(m,"uImgAspect"),time:t.getUniformLocation(m,"uTime"),mouse:t.getUniformLocation(m,"uMouse"),mouseT:t.getUniformLocation(m,"uMouseT"),plate:t.getUniformLocation(m,"uPlate"),orig:t.getUniformLocation(m,"uOrig")};t.uniform1f(f.asp,r),t.uniform2f(f.mouse,-5,-5),t.uniform1f(f.mouseT,-100),t.uniform1i(f.plate,0),t.uniform1i(f.orig,1);let v=a.widths.find(e=>e>=Math.min(1600,1.5*n.current.clientWidth))||a.widths[a.widths.length-1],g=0,w=!1,y=0,b=performance.now(),x=()=>(performance.now()-b)/1e3,A=(e,a)=>{let r=t.createTexture(),i=new Image;return i.onload=()=>{t.activeTexture(t.TEXTURE0+e),t.bindTexture(t.TEXTURE_2D,r),t.texImage2D(t.TEXTURE_2D,0,t.RGBA,t.RGBA,t.UNSIGNED_BYTE,i),t.texParameteri(t.TEXTURE_2D,t.TEXTURE_MIN_FILTER,t.LINEAR),t.texParameteri(t.TEXTURE_2D,t.TEXTURE_MAG_FILTER,t.LINEAR),t.texParameteri(t.TEXTURE_2D,t.TEXTURE_WRAP_S,t.CLAMP_TO_EDGE),t.texParameteri(t.TEXTURE_2D,t.TEXTURE_WRAP_T,t.CLAMP_TO_EDGE),2==++g&&(E(),n.current?.classList.add("is-live"),P())},i.src=(0,o.asset)(`/img/${a}-${v}.webp`),r},T=A(0,"droplet-clean"),R=A(1,"droplet"),E=()=>{let a=e.getBoundingClientRect(),r=Math.min(window.devicePixelRatio||1,1.5);e.width=Math.max(1,Math.round(a.width*r)),e.height=Math.max(1,Math.round(a.height*r)),t.viewport(0,0,e.width,e.height),t.uniform2f(f.res,e.width,e.height)},S=()=>{y=0,g<2||!w||document.hidden||(t.uniform1f(f.time,x()),t.drawArrays(t.TRIANGLES,0,6),y=requestAnimationFrame(S))},P=()=>{y||(y=requestAnimationFrame(S))},M=new IntersectionObserver(([e])=>{(w=e.isIntersecting)&&P()},{rootMargin:"100px"});M.observe(n.current);let C=new ResizeObserver(()=>2===g&&E());C.observe(e);let k=n.current.closest("section")||n.current,U=0,j=a=>{let i=x();if(i-U<.35)return;let o=e.getBoundingClientRect(),s=(a.clientX-o.left)/o.width,l=(a.clientY-o.top)/o.height;if(s<0||s>1||l<0||l>1)return;let n=o.width/o.height,c=1,d=1;n>r?d=r/n:c=n/r,t.uniform2f(f.mouse,(s-.5)*c+.5,(l-.5)*d+.5),t.uniform1f(f.mouseT,i),U=i};k.addEventListener("pointermove",j);let N=()=>P();return document.addEventListener("visibilitychange",N),()=>{cancelAnimationFrame(y),M.disconnect(),C.disconnect(),k.removeEventListener("pointermove",j),document.removeEventListener("visibilitychange",N),t.deleteTexture(T),t.deleteTexture(R),t.deleteBuffer(p),t.deleteProgram(m)}},[]),(0,t.jsxs)("div",{ref:n,className:`liquid liquid--cover ${l}`,children:[(0,t.jsx)(r.default,{name:"droplet",alt:e,sizes:s,style:{backgroundColor:"transparent"}}),(0,t.jsx)("canvas",{ref:c,"aria-hidden":"true"})]})}e.s(["default",()=>s])},82243,e=>{"use strict";var t=e.i(43476),a=e.i(71645),r=e.i(10004),i=e.i(53522),o=e.i(75093);function s({fallback:s="ep-splash",alt:l,sizes:n="40vw",className:c=""}){let d=(0,a.useRef)(null),u=(0,a.useRef)(null);return(0,a.useEffect)(()=>{if(window.matchMedia("(prefers-reduced-motion: reduce)").matches)return;let t=document.createElement("canvas");if(!t.getContext("webgl2")&&!t.getContext("webgl"))return;let a=()=>{},r=!1;return e.A(21442).then(e=>{r||(a=function(e,t,a){let r=new e.WebGLRenderer({antialias:!0,alpha:!0,powerPreference:"high-performance"});r.setPixelRatio(Math.min(window.devicePixelRatio||1,1.75)),r.outputColorSpace=e.SRGBColorSpace,a.appendChild(r.domElement);let s=new e.Scene,l=new e.PerspectiveCamera(28,1,.1,100);l.position.set(0,.25,10),l.lookAt(0,0,0);let n=i.IMAGES["ep-bottle"],c=4.2*(n.w/n.h),d=new e.TextureLoader().load((0,o.asset)(`/img/ep-bottle-${n.widths[n.widths.length-1]}.webp`),()=>{t.classList.add("is-live")});d.colorSpace=e.SRGBColorSpace,d.anisotropy=8;let u=new e.MeshBasicMaterial({map:d,transparent:!0,alphaTest:.35,depthWrite:!0}),m=new e.Mesh(new e.PlaneGeometry(c,4.2),u),p=new e.Group;p.add(m),s.add(p);let h=new e.Mesh(new e.PlaneGeometry(4*c,5.460000000000001),new e.ShaderMaterial({transparent:!0,depthWrite:!1,vertexShader:"varying vec2 vUv; void main(){ vUv = uv; gl_Position = projectionMatrix * modelViewMatrix * vec4(position,1.0); }",fragmentShader:"varying vec2 vUv; void main(){ vec2 d = (vUv - 0.5) * vec2(1.6, 1.0); float a = smoothstep(0.5, 0.0, length(d)) * 0.35; gl_FragColor = vec4(0.45, 0.72, 1.0, a); }"}));h.position.z=-1.2,s.add(h);let f={uTime:{value:0}};function v({turns:t,radius:a,rise:r,y0:i,thickness:o,tint:s,alpha:l,phase:n,squash:c}){let d=[];for(let o=0;o<=220;o++){let s=o/220,l=n+s*Math.PI*2*t,u=a*(.85+.25*Math.sin(s*Math.PI));d.push(new e.Vector3(Math.cos(l)*u,i+s*r+.08*Math.sin(s*Math.PI*3),Math.sin(l)*u*c))}let u=new e.CatmullRomCurve3(d),m=new e.TubeGeometry(u,420,o,20,!1),p=m.attributes.position.count,h=new Float32Array(3*p),v=new Float32Array(p);for(let e=0;e<=420;e++){let t=u.getPointAt(e/420);for(let a=0;a<=20;a++){let r=21*e+a;h.set([t.x,t.y,t.z],3*r),v[r]=e/420}}return m.setAttribute("aCenter",new e.BufferAttribute(h,3)),m.setAttribute("aU",new e.BufferAttribute(v,1)),{mesh:new e.Mesh(m,new e.ShaderMaterial({transparent:!0,depthWrite:!1,side:e.DoubleSide,uniforms:{...f,uTint:{value:new e.Color(s)},uAlpha:{value:l}},vertexShader:`
      uniform float uTime; attribute vec3 aCenter; attribute float aU;
      varying vec3 vN; varying vec3 vV; varying float vU; varying vec3 vOff;
      void main(){
        vec3 off = position - aCenter;
        // thick in the middle, tapering to fine tips; a travelling bulge makes the water pulse along the swirl
        float profile = pow(sin(3.14159 * aU), 0.8);
        float pulse = 1.0 + 0.35 * sin(aU * 28.0 - uTime * 5.0) + 0.12 * sin(aU * 71.0 + uTime * 3.0);
        vec3 p = aCenter + off * profile * pulse;
        p.y += sin(aU * 20.0 + uTime * 2.2) * 0.05;
        vOff = normalize(off);
        vU = aU;
        vec4 mv = modelViewMatrix * vec4(p, 1.0);
        vN = normalize(normalMatrix * normalize(off));
        vV = normalize(-mv.xyz);
        gl_Position = projectionMatrix * mv;
      }`,fragmentShader:`
      uniform float uTime; uniform vec3 uTint; uniform float uAlpha;
      varying vec3 vN; varying vec3 vV; varying float vU; varying vec3 vOff;
      void main(){
        float f = pow(1.0 - abs(dot(normalize(vN), normalize(vV))), 2.2);
        // flowing caustic streaks running along the ribbon
        float s1 = smoothstep(0.88, 1.0, sin(vU * 90.0 - uTime * 9.0 + vOff.y * 4.0));
        float s2 = smoothstep(0.93, 1.0, sin(vU * 160.0 - uTime * 13.0 + vOff.x * 6.0));
        // specular glint from a key light
        vec3 L = normalize(vec3(-0.4, 0.7, 0.6));
        vec3 H = normalize(L + normalize(vV));
        float spec = pow(max(dot(normalize(vN), H), 0.0), 60.0);
        float tip = smoothstep(0.0, 0.08, vU) * smoothstep(1.0, 0.92, vU);
        vec3 col = uTint * 0.55 + vec3(0.85, 0.95, 1.0) * (f * 0.9 + s1 * 0.5 + s2 * 0.4) + vec3(1.0) * spec * 1.2;
        float a = (uAlpha + f * 0.6 + s1 * 0.25 + spec) * tip;
        gl_FragColor = vec4(col, clamp(a, 0.0, 0.95));
      }`})),curve:u}}let g=new e.Group,w=v({turns:1.35,radius:.95*c,rise:2.1,y0:-1.764,thickness:.26,tint:6269183,alpha:.26,phase:0,squash:.55}),y=v({turns:1.8,radius:1.15*c,rise:2.604,y0:-1.26,thickness:.09,tint:9423103,alpha:.18,phase:2.2,squash:.5}),b=v({turns:1.1,radius:.8*c,rise:.756,y0:-2.1,thickness:.18,tint:5217525,alpha:.28,phase:4.1,squash:.55});g.add(w.mesh,y.mesh,b.mesh),s.add(g);let x=new e.BufferGeometry,A=new Float32Array(360);for(let e=0;e<90;e++)A.set([Math.random(),Math.random(),Math.random(),Math.random()],4*e);x.setAttribute("position",new e.BufferAttribute(new Float32Array(270),3)),x.setAttribute("aSeed",new e.BufferAttribute(A,4));let T=new e.ShaderMaterial({transparent:!0,depthWrite:!1,uniforms:{...f,uR:{value:1.05*c},uY0:{value:-1.8900000000000001},uRise:{value:2.52},uScale:{value:1}},vertexShader:`
      uniform float uTime; uniform float uR; uniform float uY0; uniform float uRise; uniform float uScale;
      attribute vec4 aSeed; varying float vA;
      void main(){
        float life = 1.6 + aSeed.w * 1.4;
        float t = mod(uTime + aSeed.x * 10.0, life);
        float k = t / life;
        float ang = aSeed.y * 6.2831 + uTime * 1.6;           // ride the swirl…
        float r = uR * (0.9 + k * (0.6 + aSeed.z * 0.9));     // …then fly outward
        vec3 p = vec3(cos(ang) * r, uY0 + aSeed.z * uRise + k * 0.6 - k * k * 1.6, sin(ang) * r * 0.55);
        vA = smoothstep(0.0, 0.1, k) * (1.0 - smoothstep(0.7, 1.0, k));
        vec4 mv = modelViewMatrix * vec4(p, 1.0);
        gl_PointSize = (4.0 + aSeed.w * aSeed.w * 14.0) * uScale / -mv.z * 10.0;
        gl_Position = projectionMatrix * mv;
      }`,fragmentShader:`
      varying float vA;
      void main(){
        vec2 d = gl_PointCoord - 0.5; float r = length(d);
        if (r > 0.5) discard;
        float rim = (smoothstep(0.5, 0.38, r) - smoothstep(0.38, 0.22, r) * 0.7) * 0.6;
        float hi = smoothstep(0.14, 0.0, length(d - vec2(-0.14, -0.16)));
        vec3 col = vec3(0.75, 0.88, 1.0) * (0.35 + rim) + hi;
        gl_FragColor = vec4(col, (0.18 + rim * 0.5 + hi * 0.9) * vA * 0.85);
      }`}),R=new e.Points(x,T);R.frustumCulled=!1,g.add(R);let E=()=>{let e=t.clientWidth,a=t.clientHeight;if(!e||!a)return;r.setSize(e,a,!1),l.aspect=e/a;let i=2*Math.atan(Math.tan(28*Math.PI/360)),o=4.9559999999999995/2/Math.tan(i/2),s=3.4*c/2/Math.tan(i/2)/l.aspect;l.position.z=Math.max(o,s),l.updateProjectionMatrix(),T.uniforms.uScale.value=a/600},S=new ResizeObserver(E);S.observe(t),E();let P=!1,M=0,C=new IntersectionObserver(([e])=>{(P=e.isIntersecting)&&!M&&(M=requestAnimationFrame(U))},{rootMargin:"120px"});C.observe(t);let k=new e.Clock;function U(){if(M=0,!P||document.hidden)return;let e=k.getElapsedTime();f.uTime.value=e,g.rotation.y=-(.9*e),g.position.y=.05*Math.sin(.8*e),p.position.y=.08*Math.sin(.8*e+.6),p.rotation.z=.02*Math.sin(.5*e),r.render(s,l),M=requestAnimationFrame(U)}let j=()=>{document.hidden||!P||M||(M=requestAnimationFrame(U))};return document.addEventListener("visibilitychange",j),()=>{cancelAnimationFrame(M),C.disconnect(),S.disconnect(),document.removeEventListener("visibilitychange",j),s.traverse(e=>{e.geometry&&e.geometry.dispose(),e.material&&e.material.dispose()}),d.dispose(),r.dispose(),r.domElement.remove()}}(e,d.current,u.current))}),()=>{r=!0,a()}},[]),(0,t.jsxs)("div",{ref:d,className:`swirl ${c}`,children:[(0,t.jsx)("div",{className:"swirl__fallback",children:(0,t.jsx)(r.default,{name:s,alt:l,sizes:n,style:{backgroundColor:"transparent"}})}),(0,t.jsx)("div",{ref:u,className:"swirl__stage","aria-hidden":"true"})]})}e.s(["default",()=>s])},86694,e=>{"use strict";var t=e.i(43476),a=e.i(71645),r=e.i(12656),i=e.i(3546),o=e.i(17176);let s=["General enquiry","Product & pricing","Bulk / event order","Become a distributor","Retail partnership","Eight Plus","Feedback"];function l(){let[e,l]=(0,a.useState)({name:"",phone:"",email:"",city:"",topic:"",message:""}),[n,c]=(0,a.useState)({}),[d,u]=(0,a.useState)(""),m=e=>t=>{l(a=>({...a,[e]:t.target.value})),c(t=>({...t,[e]:void 0}))},p=()=>{let t,a,r={};return e.name.trim().length<2&&(r.name="Please enter your name."),t=e.phone,/^[+]?[0-9\s-]{10,16}$/.test(t.trim())||(r.phone="Enter a valid phone number."),e.email&&(a=e.email,!/^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(a.trim()))&&(r.email="Enter a valid email address."),e.topic||(r.topic="Please choose a topic."),e.message.trim().length<5&&(r.message="Please add a short message."),c(r),Object.keys(r).length&&document.getElementById(`cf-${Object.keys(r)[0]}`)?.focus(),0===Object.keys(r).length},h=()=>`${e.topic}

Name: ${e.name}
Phone: ${e.phone}${e.email?`
Email: ${e.email}`:""}${e.city?`
City: ${e.city}`:""}

${e.message}`,f=({k:a,label:r,type:i="text",ac:o,full:s,optional:l})=>(0,t.jsxs)("div",{className:`field${s?" field--full":""}`,children:[(0,t.jsxs)("label",{htmlFor:`cf-${a}`,children:[r,l&&(0,t.jsx)("span",{style:{textTransform:"none",letterSpacing:0},children:" (optional)"})]}),(0,t.jsx)("input",{id:`cf-${a}`,className:"input",type:i,autoComplete:o,value:e[a],onChange:m(a),"aria-invalid":n[a]?"true":void 0,"aria-describedby":n[a]?`cf-${a}-e`:void 0}),n[a]&&(0,t.jsx)("span",{className:"err",id:`cf-${a}-e`,children:n[a]})]});return(0,t.jsxs)("form",{className:"form",onSubmit:e=>{e.preventDefault(),p()&&(window.open((0,i.waLink)(`Hello Kemp's — ${h()}`),"_blank","noopener"),u("WhatsApp has opened with your message — just press send."))},noValidate:!0,children:[f({k:"name",label:"Full name",ac:"name"}),f({k:"phone",label:"Phone",type:"tel",ac:"tel"}),f({k:"email",label:"Email",type:"email",ac:"email",optional:!0}),f({k:"city",label:"City / town",ac:"address-level2",optional:!0}),(0,t.jsxs)("div",{className:"field field--full",children:[(0,t.jsx)("label",{htmlFor:"cf-topic",children:"Topic"}),(0,t.jsxs)("select",{id:"cf-topic",className:"select",value:e.topic,onChange:m("topic"),"aria-invalid":n.topic?"true":void 0,children:[(0,t.jsx)("option",{value:"",children:"Select…"}),s.map(e=>(0,t.jsx)("option",{children:e},e))]}),n.topic&&(0,t.jsx)("span",{className:"err",children:n.topic})]}),(0,t.jsxs)("div",{className:"field field--full",children:[(0,t.jsx)("label",{htmlFor:"cf-message",children:"Message"}),(0,t.jsx)("textarea",{id:"cf-message",className:"textarea",value:e.message,onChange:m("message"),"aria-invalid":n.message?"true":void 0,placeholder:"Products, quantities, delivery location…"}),n.message&&(0,t.jsx)("span",{className:"err",children:n.message})]}),(0,t.jsxs)("div",{className:"form__foot",children:[(0,t.jsx)("p",{className:"form-status","data-state":d?"ok":"idle",role:"status","aria-live":"polite",style:{margin:0,maxWidth:"40ch"},children:d}),(0,t.jsxs)("div",{style:{display:"flex",gap:10,flexWrap:"wrap"},children:[(0,t.jsx)("button",{type:"button",className:"btn btn--ghost",onClick:()=>{p()&&(window.location.href=`mailto:${r.BRAND.email}?subject=${encodeURIComponent(`Website enquiry: ${e.topic}`)}&body=${encodeURIComponent(h())}`,u("Your email app has opened with your message — just press send."))},children:"Send by email"}),(0,t.jsxs)("button",{className:"btn",children:[(0,t.jsx)(o.WhatsApp,{width:16,height:16})," Send on WhatsApp ",(0,t.jsx)(o.Arrow,{})]})]})]})]})}e.s(["default",()=>l])},21442,e=>{e.v(t=>Promise.all(["static/chunks/b4a4bf05965e2557.js"].map(t=>e.l(t))).then(()=>t(32009)))}]);