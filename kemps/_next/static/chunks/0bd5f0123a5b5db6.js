(globalThis.TURBOPACK||(globalThis.TURBOPACK=[])).push(["object"==typeof document?document.currentScript:void 0,52863,e=>{"use strict";var t=e.i(71645),r=e.i(89970),a=e.i(83495);function i(){return(0,t.useEffect)(()=>{if(window.matchMedia("(prefers-reduced-motion: reduce)").matches)return void document.querySelectorAll(".reveal-img").forEach(e=>e.classList.add("is-in"));let e=r.gsap.context(()=>{r.gsap.utils.toArray("[data-lq]").forEach(e=>{let t=e.querySelectorAll(".lq-inner"),a={y:0,yPercent:0,"--mp":"0%",duration:1.6,ease:"expo.out",stagger:.12};"auto"===e.dataset.lq?r.gsap.to(t,{...a,delay:.35}):r.gsap.to(t,{...a,scrollTrigger:{trigger:e,start:"top 85%",once:!0}})}),r.gsap.utils.toArray("[data-fade]").forEach(e=>{e.closest(".hero")?r.gsap.to(e,{opacity:1,y:0,duration:1.4,ease:"power3.out",delay:.6+(Number(e.dataset.fade)||0)}):r.gsap.to(e,{opacity:1,y:0,duration:1.2,ease:"power3.out",delay:Number(e.dataset.fade)||0,scrollTrigger:{trigger:e,start:"top 88%",once:!0}})}),r.gsap.utils.toArray(".reveal-img").forEach(e=>{let t=e.querySelector("img");a.ScrollTrigger.create({trigger:e,start:"top 80%",once:!0,onEnter:()=>e.classList.add("is-in")}),e.style.transition="clip-path 1.6s cubic-bezier(.22,1,.36,1)",t&&r.gsap.fromTo(t,{scale:1.18},{scale:1,ease:"none",scrollTrigger:{trigger:e,start:"top bottom",end:"bottom top",scrub:!0}})}),r.gsap.utils.toArray("[data-parallax]").forEach(e=>{let t=Number(e.dataset.parallax)||10;r.gsap.fromTo(e,{yPercent:-t},{yPercent:t,ease:"none",scrollTrigger:{trigger:e.parentElement,start:"top bottom",end:"bottom top",scrub:!0}})}),r.gsap.utils.toArray("[data-ripple] path").forEach(e=>{let t=e.dataset.a,a=e.dataset.b;r.gsap.fromTo(e,{attr:{d:t}},{attr:{d:a},ease:"none",scrollTrigger:{trigger:e.closest("[data-ripple]"),start:"top bottom",end:"bottom top",scrub:1}})})}),t=()=>a.ScrollTrigger.refresh();return window.addEventListener("load",t),()=>{window.removeEventListener("load",t),e.revert()}},[]),null}r.gsap.registerPlugin(a.ScrollTrigger),e.s(["default",()=>i])},10004,53522,e=>{"use strict";var t=e.i(43476);let r={"p-water-blue":{w:409,h:696,widths:[400,409],color:null},"p-water-pink":{w:411,h:796,widths:[400,411],color:null},"p-eightplus":{w:1426,h:3478,widths:[400,800,900],color:null},"p-club-soda":{w:306,h:716,widths:[306],color:null},"p-jeera-soda":{w:321,h:790,widths:[321],color:null},"p-kokum":{w:469,h:651,widths:[400,469],color:null},"p-lemon":{w:440,h:964,widths:[400,440],color:null},"p-mango":{w:320,h:768,widths:[320],color:null},"p-orange":{w:389,h:1008,widths:[389],color:null},"p-pudina":{w:307,h:755,widths:[307],color:null},"jeera-mockup":{w:948,h:3336,widths:[400,800,948],color:null},"ep-duo":{w:1219,h:1e3,widths:[400,800,1200,1219],color:null},"ep-splash":{w:775,h:1146,widths:[400,775],color:null},"ep-logo":{w:1642,h:291,widths:[400,800,1e3],color:null},"ep-banner":{w:4826,h:2781,widths:[400,800,1200,1600,2400],color:"#c4d1db"},"ph-glass":{w:1731,h:1333,widths:[400,800,1200,1400],color:null},award:{w:3600,h:2400,widths:[400,800,1200,1600,1800],color:"#c78d62"},lake:{w:2752,h:1536,widths:[400,800,1200,1600,2400],color:"#5a7d9e"},river:{w:2752,h:1536,widths:[400,800,1200,1600,2400],color:"#768b9d"},droplet:{w:2752,h:1536,widths:[400,800,1200,1600,2400],color:"#375d7b"},logo:{w:900,h:399},"kemps-bottle":{w:1107,h:1487,widths:[400,800,1107],color:null},"ep-bottle":{w:684,h:2455,widths:[400,684],color:null},"droplet-clean":{w:2752,h:1536,widths:[400,800,1200,1600,2400],color:"#3c5e7d"}};e.s(["IMAGES",0,r],53522);var a=e.i(75093);function i({name:e,alt:i,sizes:o="100vw",priority:s=!1,className:l,imgClassName:n,style:c,...d}){let u=r[e];if(!u)return null;let h=t=>u.widths.map(r=>`${a.BASE}/img/${e}-${r}.${t} ${r}w`).join(", ");return(0,t.jsxs)("picture",{className:l,...d,children:[(0,t.jsx)("source",{type:"image/avif",srcSet:h("avif"),sizes:o}),(0,t.jsx)("img",{src:`${a.BASE}/img/${e}-${u.widths[u.widths.length-1]}.webp`,srcSet:h("webp"),sizes:o,width:u.w,height:u.h,alt:i,loading:s?"eager":"lazy",fetchPriority:s?"high":void 0,decoding:s?"sync":"async",className:n,style:{...c,backgroundColor:u.color}})]})}e.s(["default",()=>i],10004)},88525,e=>{"use strict";var t=e.i(43476),r=e.i(71645),a=e.i(10004),i=e.i(53522),o=e.i(75093);function s({alt:e="",sizes:s="100vw",className:l=""}){let n=(0,r.useRef)(null),c=(0,r.useRef)(null);return(0,r.useEffect)(()=>{if(window.matchMedia("(prefers-reduced-motion: reduce)").matches)return;let e=c.current,t=e.getContext("webgl",{premultipliedAlpha:!0,alpha:!0});if(!t)return;let r=i.IMAGES["droplet-clean"],a=r.w/r.h,s=`
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
      }`,l=(e,r)=>{let a=t.createShader(e);return(t.shaderSource(a,r),t.compileShader(a),t.getShaderParameter(a,t.COMPILE_STATUS))?a:(console.warn(t.getShaderInfoLog(a)),null)},d=l(t.VERTEX_SHADER,"attribute vec2 a; varying vec2 vUv; void main(){ vUv = a * 0.5 + 0.5; vUv.y = 1.0 - vUv.y; gl_Position = vec4(a, 0.0, 1.0); }"),u=l(t.FRAGMENT_SHADER,s);if(!d||!u)return;let h=t.createProgram();t.attachShader(h,d),t.attachShader(h,u),t.linkProgram(h),t.useProgram(h);let p=t.createBuffer();t.bindBuffer(t.ARRAY_BUFFER,p),t.bufferData(t.ARRAY_BUFFER,new Float32Array([-1,-1,1,-1,-1,1,-1,1,1,-1,1,1]),t.STATIC_DRAW);let m=t.getAttribLocation(h,"a");t.enableVertexAttribArray(m),t.vertexAttribPointer(m,2,t.FLOAT,!1,0,0);let f={res:t.getUniformLocation(h,"uRes"),asp:t.getUniformLocation(h,"uImgAspect"),time:t.getUniformLocation(h,"uTime"),mouse:t.getUniformLocation(h,"uMouse"),mouseT:t.getUniformLocation(h,"uMouseT"),plate:t.getUniformLocation(h,"uPlate"),orig:t.getUniformLocation(h,"uOrig")};t.uniform1f(f.asp,a),t.uniform2f(f.mouse,-5,-5),t.uniform1f(f.mouseT,-100),t.uniform1i(f.plate,0),t.uniform1i(f.orig,1);let v=r.widths.find(e=>e>=Math.min(1600,1.5*n.current.clientWidth))||r.widths[r.widths.length-1],g=0,w=!1,x=0,b=performance.now(),y=()=>(performance.now()-b)/1e3,T=(e,r)=>{let a=t.createTexture(),i=new Image;return i.onload=()=>{t.activeTexture(t.TEXTURE0+e),t.bindTexture(t.TEXTURE_2D,a),t.texImage2D(t.TEXTURE_2D,0,t.RGBA,t.RGBA,t.UNSIGNED_BYTE,i),t.texParameteri(t.TEXTURE_2D,t.TEXTURE_MIN_FILTER,t.LINEAR),t.texParameteri(t.TEXTURE_2D,t.TEXTURE_MAG_FILTER,t.LINEAR),t.texParameteri(t.TEXTURE_2D,t.TEXTURE_WRAP_S,t.CLAMP_TO_EDGE),t.texParameteri(t.TEXTURE_2D,t.TEXTURE_WRAP_T,t.CLAMP_TO_EDGE),2==++g&&(E(),n.current?.classList.add("is-live"),S())},i.src=(0,o.asset)(`/img/${r}-${v}.webp`),a},A=T(0,"droplet-clean"),R=T(1,"droplet"),E=()=>{let r=e.getBoundingClientRect(),a=Math.min(window.devicePixelRatio||1,1.5);e.width=Math.max(1,Math.round(r.width*a)),e.height=Math.max(1,Math.round(r.height*a)),t.viewport(0,0,e.width,e.height),t.uniform2f(f.res,e.width,e.height)},M=()=>{x=0,g<2||!w||document.hidden||(t.uniform1f(f.time,y()),t.drawArrays(t.TRIANGLES,0,6),x=requestAnimationFrame(M))},S=()=>{x||(x=requestAnimationFrame(M))},P=new IntersectionObserver(([e])=>{(w=e.isIntersecting)&&S()},{rootMargin:"100px"});P.observe(n.current);let _=new ResizeObserver(()=>2===g&&E());_.observe(e);let U=n.current.closest("section")||n.current,C=0,k=r=>{let i=y();if(i-C<.35)return;let o=e.getBoundingClientRect(),s=(r.clientX-o.left)/o.width,l=(r.clientY-o.top)/o.height;if(s<0||s>1||l<0||l>1)return;let n=o.width/o.height,c=1,d=1;n>a?d=a/n:c=n/a,t.uniform2f(f.mouse,(s-.5)*c+.5,(l-.5)*d+.5),t.uniform1f(f.mouseT,i),C=i};U.addEventListener("pointermove",k);let j=()=>S();return document.addEventListener("visibilitychange",j),()=>{cancelAnimationFrame(x),P.disconnect(),_.disconnect(),U.removeEventListener("pointermove",k),document.removeEventListener("visibilitychange",j),t.deleteTexture(A),t.deleteTexture(R),t.deleteBuffer(p),t.deleteProgram(h)}},[]),(0,t.jsxs)("div",{ref:n,className:`liquid liquid--cover ${l}`,children:[(0,t.jsx)(a.default,{name:"droplet",alt:e,sizes:s,style:{backgroundColor:"transparent"}}),(0,t.jsx)("canvas",{ref:c,"aria-hidden":"true"})]})}e.s(["default",()=>s])},82243,e=>{"use strict";var t=e.i(43476),r=e.i(71645),a=e.i(10004),i=e.i(53522),o=e.i(75093);function s({fallback:s="ep-splash",alt:l,sizes:n="40vw",className:c=""}){let d=(0,r.useRef)(null),u=(0,r.useRef)(null);return(0,r.useEffect)(()=>{if(window.matchMedia("(prefers-reduced-motion: reduce)").matches)return;let t=document.createElement("canvas");if(!t.getContext("webgl2")&&!t.getContext("webgl"))return;let r=()=>{},a=!1;return e.A(21442).then(e=>{a||(r=function(e,t,r){let a=new e.WebGLRenderer({antialias:!0,alpha:!0,powerPreference:"high-performance"});a.setPixelRatio(Math.min(window.devicePixelRatio||1,1.75)),a.outputColorSpace=e.SRGBColorSpace,r.appendChild(a.domElement);let s=new e.Scene,l=new e.PerspectiveCamera(28,1,.1,100);l.position.set(0,.25,10),l.lookAt(0,0,0);let n=i.IMAGES["ep-bottle"],c=4.2*(n.w/n.h),d=new e.TextureLoader().load((0,o.asset)(`/img/ep-bottle-${n.widths[n.widths.length-1]}.webp`),()=>{t.classList.add("is-live")});d.colorSpace=e.SRGBColorSpace,d.anisotropy=8;let u=new e.MeshBasicMaterial({map:d,transparent:!0,alphaTest:.35,depthWrite:!0}),h=new e.Mesh(new e.PlaneGeometry(c,4.2),u),p=new e.Group;p.add(h),s.add(p);let m=new e.Mesh(new e.PlaneGeometry(4*c,5.460000000000001),new e.ShaderMaterial({transparent:!0,depthWrite:!1,vertexShader:"varying vec2 vUv; void main(){ vUv = uv; gl_Position = projectionMatrix * modelViewMatrix * vec4(position,1.0); }",fragmentShader:"varying vec2 vUv; void main(){ vec2 d = (vUv - 0.5) * vec2(1.6, 1.0); float a = smoothstep(0.5, 0.0, length(d)) * 0.35; gl_FragColor = vec4(0.45, 0.72, 1.0, a); }"}));m.position.z=-1.2,s.add(m);let f={uTime:{value:0}};function v({turns:t,radius:r,rise:a,y0:i,thickness:o,tint:s,alpha:l,phase:n,squash:c}){let d=[];for(let o=0;o<=220;o++){let s=o/220,l=n+s*Math.PI*2*t,u=r*(.85+.25*Math.sin(s*Math.PI));d.push(new e.Vector3(Math.cos(l)*u,i+s*a+.08*Math.sin(s*Math.PI*3),Math.sin(l)*u*c))}let u=new e.CatmullRomCurve3(d),h=new e.TubeGeometry(u,420,o,20,!1),p=h.attributes.position.count,m=new Float32Array(3*p),v=new Float32Array(p);for(let e=0;e<=420;e++){let t=u.getPointAt(e/420);for(let r=0;r<=20;r++){let a=21*e+r;m.set([t.x,t.y,t.z],3*a),v[a]=e/420}}return h.setAttribute("aCenter",new e.BufferAttribute(m,3)),h.setAttribute("aU",new e.BufferAttribute(v,1)),{mesh:new e.Mesh(h,new e.ShaderMaterial({transparent:!0,depthWrite:!1,side:e.DoubleSide,uniforms:{...f,uTint:{value:new e.Color(s)},uAlpha:{value:l}},vertexShader:`
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
      }`})),curve:u}}let g=new e.Group,w=v({turns:1.35,radius:.95*c,rise:2.1,y0:-1.764,thickness:.26,tint:6269183,alpha:.26,phase:0,squash:.55}),x=v({turns:1.8,radius:1.15*c,rise:2.604,y0:-1.26,thickness:.09,tint:9423103,alpha:.18,phase:2.2,squash:.5}),b=v({turns:1.1,radius:.8*c,rise:.756,y0:-2.1,thickness:.18,tint:5217525,alpha:.28,phase:4.1,squash:.55});g.add(w.mesh,x.mesh,b.mesh),s.add(g);let y=new e.BufferGeometry,T=new Float32Array(360);for(let e=0;e<90;e++)T.set([Math.random(),Math.random(),Math.random(),Math.random()],4*e);y.setAttribute("position",new e.BufferAttribute(new Float32Array(270),3)),y.setAttribute("aSeed",new e.BufferAttribute(T,4));let A=new e.ShaderMaterial({transparent:!0,depthWrite:!1,uniforms:{...f,uR:{value:1.05*c},uY0:{value:-1.8900000000000001},uRise:{value:2.52},uScale:{value:1}},vertexShader:`
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
      }`}),R=new e.Points(y,A);R.frustumCulled=!1,g.add(R);let E=()=>{let e=t.clientWidth,r=t.clientHeight;if(!e||!r)return;a.setSize(e,r,!1),l.aspect=e/r;let i=2*Math.atan(Math.tan(28*Math.PI/360)),o=4.9559999999999995/2/Math.tan(i/2),s=3.4*c/2/Math.tan(i/2)/l.aspect;l.position.z=Math.max(o,s),l.updateProjectionMatrix(),A.uniforms.uScale.value=r/600},M=new ResizeObserver(E);M.observe(t),E();let S=!1,P=0,_=new IntersectionObserver(([e])=>{(S=e.isIntersecting)&&!P&&(P=requestAnimationFrame(C))},{rootMargin:"120px"});_.observe(t);let U=new e.Clock;function C(){if(P=0,!S||document.hidden)return;let e=U.getElapsedTime();f.uTime.value=e,g.rotation.y=-(.9*e),g.position.y=.05*Math.sin(.8*e),p.position.y=.08*Math.sin(.8*e+.6),p.rotation.z=.02*Math.sin(.5*e),a.render(s,l),P=requestAnimationFrame(C)}let k=()=>{document.hidden||!S||P||(P=requestAnimationFrame(C))};return document.addEventListener("visibilitychange",k),()=>{cancelAnimationFrame(P),_.disconnect(),M.disconnect(),document.removeEventListener("visibilitychange",k),s.traverse(e=>{e.geometry&&e.geometry.dispose(),e.material&&e.material.dispose()}),d.dispose(),a.dispose(),a.domElement.remove()}}(e,d.current,u.current))}),()=>{a=!0,r()}},[]),(0,t.jsxs)("div",{ref:d,className:`swirl ${c}`,children:[(0,t.jsx)("div",{className:"swirl__fallback",children:(0,t.jsx)(a.default,{name:s,alt:l,sizes:n,style:{backgroundColor:"transparent"}})}),(0,t.jsx)("div",{ref:u,className:"swirl__stage","aria-hidden":"true"})]})}e.s(["default",()=>s])},37506,e=>{"use strict";var t=e.i(43476),r=e.i(71645);function a(){let e=(0,r.useRef)(null),[a,i]=(0,r.useState)(!1);(0,r.useEffect)(()=>{let t=new IntersectionObserver(([e])=>e.isIntersecting&&i(!0),{threshold:.4});return t.observe(e.current),()=>t.disconnect()},[]);let o=e=>`${e/14*100}%`;return(0,t.jsxs)("div",{ref:e,children:[(0,t.jsxs)("div",{className:"phscale",role:"img","aria-label":"pH scale from 0 (acidic) to 14 (alkaline). Typical drinking water is around pH 7; Eight Plus is above pH 8.",children:[(0,t.jsxs)("div",{className:"phscale__marker phscale__marker--muted",style:{left:o(7*!!a)},children:[(0,t.jsx)("b",{children:"Typical water · pH 7"}),(0,t.jsx)("i",{})]}),(0,t.jsxs)("div",{className:"phscale__marker",style:{left:o(8.4*!!a),top:-96},children:[(0,t.jsx)("b",{children:"Eight Plus · pH 8+"}),(0,t.jsx)("i",{style:{height:72}})]}),(0,t.jsx)("div",{className:"phscale__bar"}),(0,t.jsx)("div",{className:"phscale__ticks","aria-hidden":"true",children:Array.from({length:15},(e,r)=>(0,t.jsx)("span",{children:r},r))})]}),(0,t.jsxs)("div",{className:"phlegend",children:[(0,t.jsxs)("div",{children:[(0,t.jsx)("b",{children:"Acidic"}),(0,t.jsx)("span",{children:"pH 0.0 – 6.9"})]}),(0,t.jsxs)("div",{children:[(0,t.jsx)("b",{children:"Neutral"}),(0,t.jsx)("span",{children:"pH 7.0"})]}),(0,t.jsxs)("div",{children:[(0,t.jsx)("b",{children:"Alkaline"}),(0,t.jsx)("span",{children:"pH 7.1 – 14.0"})]})]})]})}e.s(["default",()=>a])},21442,e=>{e.v(t=>Promise.all(["static/chunks/b4a4bf05965e2557.js"].map(t=>e.l(t))).then(()=>t(32009)))}]);