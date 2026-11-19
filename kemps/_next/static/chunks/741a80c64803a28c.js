(globalThis.TURBOPACK||(globalThis.TURBOPACK=[])).push(["object"==typeof document?document.currentScript:void 0,52863,e=>{"use strict";var t=e.i(71645),r=e.i(89970),a=e.i(83495);function i(){return(0,t.useEffect)(()=>{if(window.matchMedia("(prefers-reduced-motion: reduce)").matches)return void document.querySelectorAll(".reveal-img").forEach(e=>e.classList.add("is-in"));let e=r.gsap.context(()=>{r.gsap.utils.toArray("[data-lq]").forEach(e=>{let t=e.querySelectorAll(".lq-inner"),a={y:0,yPercent:0,"--mp":"0%",duration:1.6,ease:"expo.out",stagger:.12};"auto"===e.dataset.lq?r.gsap.to(t,{...a,delay:.35}):r.gsap.to(t,{...a,scrollTrigger:{trigger:e,start:"top 85%",once:!0}})}),r.gsap.utils.toArray("[data-fade]").forEach(e=>{e.closest(".hero")?r.gsap.to(e,{opacity:1,y:0,duration:1.4,ease:"power3.out",delay:.6+(Number(e.dataset.fade)||0)}):r.gsap.to(e,{opacity:1,y:0,duration:1.2,ease:"power3.out",delay:Number(e.dataset.fade)||0,scrollTrigger:{trigger:e,start:"top 88%",once:!0}})}),r.gsap.utils.toArray(".reveal-img").forEach(e=>{let t=e.querySelector("img");a.ScrollTrigger.create({trigger:e,start:"top 80%",once:!0,onEnter:()=>e.classList.add("is-in")}),e.style.transition="clip-path 1.6s cubic-bezier(.22,1,.36,1)",t&&r.gsap.fromTo(t,{scale:1.18},{scale:1,ease:"none",scrollTrigger:{trigger:e,start:"top bottom",end:"bottom top",scrub:!0}})}),r.gsap.utils.toArray("[data-parallax]").forEach(e=>{let t=Number(e.dataset.parallax)||10;r.gsap.fromTo(e,{yPercent:-t},{yPercent:t,ease:"none",scrollTrigger:{trigger:e.parentElement,start:"top bottom",end:"bottom top",scrub:!0}})}),r.gsap.utils.toArray("[data-ripple] path").forEach(e=>{let t=e.dataset.a,a=e.dataset.b;r.gsap.fromTo(e,{attr:{d:t}},{attr:{d:a},ease:"none",scrollTrigger:{trigger:e.closest("[data-ripple]"),start:"top bottom",end:"bottom top",scrub:1}})})}),t=()=>a.ScrollTrigger.refresh();return window.addEventListener("load",t),()=>{window.removeEventListener("load",t),e.revert()}},[]),null}r.gsap.registerPlugin(a.ScrollTrigger),e.s(["default",()=>i])},10004,53522,e=>{"use strict";var t=e.i(43476);let r={"p-water-blue":{w:409,h:696,widths:[400,409],color:null},"p-water-pink":{w:411,h:796,widths:[400,411],color:null},"p-eightplus":{w:1426,h:3478,widths:[400,800,900],color:null},"p-club-soda":{w:306,h:716,widths:[306],color:null},"p-jeera-soda":{w:321,h:790,widths:[321],color:null},"p-kokum":{w:469,h:651,widths:[400,469],color:null},"p-lemon":{w:440,h:964,widths:[400,440],color:null},"p-mango":{w:320,h:768,widths:[320],color:null},"p-orange":{w:389,h:1008,widths:[389],color:null},"p-pudina":{w:307,h:755,widths:[307],color:null},"jeera-mockup":{w:948,h:3336,widths:[400,800,948],color:null},"ep-duo":{w:1219,h:1e3,widths:[400,800,1200,1219],color:null},"ep-splash":{w:775,h:1146,widths:[400,775],color:null},"ep-logo":{w:1642,h:291,widths:[400,800,1e3],color:null},"ep-banner":{w:4826,h:2781,widths:[400,800,1200,1600,2400],color:"#c4d1db"},"ph-glass":{w:1731,h:1333,widths:[400,800,1200,1400],color:null},award:{w:3600,h:2400,widths:[400,800,1200,1600,1800],color:"#c78d62"},lake:{w:2752,h:1536,widths:[400,800,1200,1600,2400],color:"#5a7d9e"},river:{w:2752,h:1536,widths:[400,800,1200,1600,2400],color:"#768b9d"},droplet:{w:2752,h:1536,widths:[400,800,1200,1600,2400],color:"#375d7b"},logo:{w:900,h:399},"kemps-bottle":{w:1107,h:1487,widths:[400,800,1107],color:null},"ep-bottle":{w:684,h:2455,widths:[400,684],color:null},"droplet-clean":{w:2752,h:1536,widths:[400,800,1200,1600,2400],color:"#3c5e7d"}};e.s(["IMAGES",0,r],53522);var a=e.i(75093);function i({name:e,alt:i,sizes:o="100vw",priority:n=!1,className:s,imgClassName:l,style:c,...u}){let d=r[e];if(!d)return null;let m=t=>d.widths.map(r=>`${a.BASE}/img/${e}-${r}.${t} ${r}w`).join(", ");return(0,t.jsxs)("picture",{className:s,...u,children:[(0,t.jsx)("source",{type:"image/avif",srcSet:m("avif"),sizes:o}),(0,t.jsx)("img",{src:`${a.BASE}/img/${e}-${d.widths[d.widths.length-1]}.webp`,srcSet:m("webp"),sizes:o,width:d.w,height:d.h,alt:i,loading:n?"eager":"lazy",fetchPriority:n?"high":void 0,decoding:n?"sync":"async",className:l,style:{...c,backgroundColor:d.color}})]})}e.s(["default",()=>i],10004)},88525,e=>{"use strict";var t=e.i(43476),r=e.i(71645),a=e.i(10004),i=e.i(53522),o=e.i(75093);function n({alt:e="",sizes:n="100vw",className:s=""}){let l=(0,r.useRef)(null),c=(0,r.useRef)(null);return(0,r.useEffect)(()=>{if(window.matchMedia("(prefers-reduced-motion: reduce)").matches)return;let e=c.current,t=e.getContext("webgl",{premultipliedAlpha:!0,alpha:!0});if(!t)return;let r=i.IMAGES["droplet-clean"],a=r.w/r.h,n=`
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
      }`,s=(e,r)=>{let a=t.createShader(e);return(t.shaderSource(a,r),t.compileShader(a),t.getShaderParameter(a,t.COMPILE_STATUS))?a:(console.warn(t.getShaderInfoLog(a)),null)},u=s(t.VERTEX_SHADER,"attribute vec2 a; varying vec2 vUv; void main(){ vUv = a * 0.5 + 0.5; vUv.y = 1.0 - vUv.y; gl_Position = vec4(a, 0.0, 1.0); }"),d=s(t.FRAGMENT_SHADER,n);if(!u||!d)return;let m=t.createProgram();t.attachShader(m,u),t.attachShader(m,d),t.linkProgram(m),t.useProgram(m);let p=t.createBuffer();t.bindBuffer(t.ARRAY_BUFFER,p),t.bufferData(t.ARRAY_BUFFER,new Float32Array([-1,-1,1,-1,-1,1,-1,1,1,-1,1,1]),t.STATIC_DRAW);let f=t.getAttribLocation(m,"a");t.enableVertexAttribArray(f),t.vertexAttribPointer(f,2,t.FLOAT,!1,0,0);let h={res:t.getUniformLocation(m,"uRes"),asp:t.getUniformLocation(m,"uImgAspect"),time:t.getUniformLocation(m,"uTime"),mouse:t.getUniformLocation(m,"uMouse"),mouseT:t.getUniformLocation(m,"uMouseT"),plate:t.getUniformLocation(m,"uPlate"),orig:t.getUniformLocation(m,"uOrig")};t.uniform1f(h.asp,a),t.uniform2f(h.mouse,-5,-5),t.uniform1f(h.mouseT,-100),t.uniform1i(h.plate,0),t.uniform1i(h.orig,1);let g=r.widths.find(e=>e>=Math.min(1600,1.5*l.current.clientWidth))||r.widths[r.widths.length-1],v=0,w=!1,x=0,T=performance.now(),b=()=>(performance.now()-T)/1e3,y=(e,r)=>{let a=t.createTexture(),i=new Image;return i.onload=()=>{t.activeTexture(t.TEXTURE0+e),t.bindTexture(t.TEXTURE_2D,a),t.texImage2D(t.TEXTURE_2D,0,t.RGBA,t.RGBA,t.UNSIGNED_BYTE,i),t.texParameteri(t.TEXTURE_2D,t.TEXTURE_MIN_FILTER,t.LINEAR),t.texParameteri(t.TEXTURE_2D,t.TEXTURE_MAG_FILTER,t.LINEAR),t.texParameteri(t.TEXTURE_2D,t.TEXTURE_WRAP_S,t.CLAMP_TO_EDGE),t.texParameteri(t.TEXTURE_2D,t.TEXTURE_WRAP_T,t.CLAMP_TO_EDGE),2==++v&&(E(),l.current?.classList.add("is-live"),P())},i.src=(0,o.asset)(`/img/${r}-${g}.webp`),a},A=y(0,"droplet-clean"),R=y(1,"droplet"),E=()=>{let r=e.getBoundingClientRect(),a=Math.min(window.devicePixelRatio||1,1.5);e.width=Math.max(1,Math.round(r.width*a)),e.height=Math.max(1,Math.round(r.height*a)),t.viewport(0,0,e.width,e.height),t.uniform2f(h.res,e.width,e.height)},M=()=>{x=0,v<2||!w||document.hidden||(t.uniform1f(h.time,b()),t.drawArrays(t.TRIANGLES,0,6),x=requestAnimationFrame(M))},P=()=>{x||(x=requestAnimationFrame(M))},U=new IntersectionObserver(([e])=>{(w=e.isIntersecting)&&P()},{rootMargin:"100px"});U.observe(l.current);let S=new ResizeObserver(()=>2===v&&E());S.observe(e);let _=l.current.closest("section")||l.current,L=0,C=r=>{let i=b();if(i-L<.35)return;let o=e.getBoundingClientRect(),n=(r.clientX-o.left)/o.width,s=(r.clientY-o.top)/o.height;if(n<0||n>1||s<0||s>1)return;let l=o.width/o.height,c=1,u=1;l>a?u=a/l:c=l/a,t.uniform2f(h.mouse,(n-.5)*c+.5,(s-.5)*u+.5),t.uniform1f(h.mouseT,i),L=i};_.addEventListener("pointermove",C);let I=()=>P();return document.addEventListener("visibilitychange",I),()=>{cancelAnimationFrame(x),U.disconnect(),S.disconnect(),_.removeEventListener("pointermove",C),document.removeEventListener("visibilitychange",I),t.deleteTexture(A),t.deleteTexture(R),t.deleteBuffer(p),t.deleteProgram(m)}},[]),(0,t.jsxs)("div",{ref:l,className:`liquid liquid--cover ${s}`,children:[(0,t.jsx)(a.default,{name:"droplet",alt:e,sizes:n,style:{backgroundColor:"transparent"}}),(0,t.jsx)("canvas",{ref:c,"aria-hidden":"true"})]})}e.s(["default",()=>n])},82243,e=>{"use strict";var t=e.i(43476),r=e.i(71645),a=e.i(10004),i=e.i(53522),o=e.i(75093);function n({fallback:n="ep-splash",alt:s,sizes:l="40vw",className:c=""}){let u=(0,r.useRef)(null),d=(0,r.useRef)(null);return(0,r.useEffect)(()=>{if(window.matchMedia("(prefers-reduced-motion: reduce)").matches)return;let t=document.createElement("canvas");if(!t.getContext("webgl2")&&!t.getContext("webgl"))return;let r=()=>{},a=!1;return e.A(21442).then(e=>{a||(r=function(e,t,r){let a=new e.WebGLRenderer({antialias:!0,alpha:!0,powerPreference:"high-performance"});a.setPixelRatio(Math.min(window.devicePixelRatio||1,1.75)),a.outputColorSpace=e.SRGBColorSpace,r.appendChild(a.domElement);let n=new e.Scene,s=new e.PerspectiveCamera(28,1,.1,100);s.position.set(0,.25,10),s.lookAt(0,0,0);let l=i.IMAGES["ep-bottle"],c=4.2*(l.w/l.h),u=new e.TextureLoader().load((0,o.asset)(`/img/ep-bottle-${l.widths[l.widths.length-1]}.webp`),()=>{t.classList.add("is-live")});u.colorSpace=e.SRGBColorSpace,u.anisotropy=8;let d=new e.MeshBasicMaterial({map:u,transparent:!0,alphaTest:.35,depthWrite:!0}),m=new e.Mesh(new e.PlaneGeometry(c,4.2),d),p=new e.Group;p.add(m),n.add(p);let f=new e.Mesh(new e.PlaneGeometry(4*c,5.460000000000001),new e.ShaderMaterial({transparent:!0,depthWrite:!1,vertexShader:"varying vec2 vUv; void main(){ vUv = uv; gl_Position = projectionMatrix * modelViewMatrix * vec4(position,1.0); }",fragmentShader:"varying vec2 vUv; void main(){ vec2 d = (vUv - 0.5) * vec2(1.6, 1.0); float a = smoothstep(0.5, 0.0, length(d)) * 0.35; gl_FragColor = vec4(0.45, 0.72, 1.0, a); }"}));f.position.z=-1.2,n.add(f);let h={uTime:{value:0}};function g({turns:t,radius:r,rise:a,y0:i,thickness:o,tint:n,alpha:s,phase:l,squash:c}){let u=[];for(let o=0;o<=220;o++){let n=o/220,s=l+n*Math.PI*2*t,d=r*(.85+.25*Math.sin(n*Math.PI));u.push(new e.Vector3(Math.cos(s)*d,i+n*a+.08*Math.sin(n*Math.PI*3),Math.sin(s)*d*c))}let d=new e.CatmullRomCurve3(u),m=new e.TubeGeometry(d,420,o,20,!1),p=m.attributes.position.count,f=new Float32Array(3*p),g=new Float32Array(p);for(let e=0;e<=420;e++){let t=d.getPointAt(e/420);for(let r=0;r<=20;r++){let a=21*e+r;f.set([t.x,t.y,t.z],3*a),g[a]=e/420}}return m.setAttribute("aCenter",new e.BufferAttribute(f,3)),m.setAttribute("aU",new e.BufferAttribute(g,1)),{mesh:new e.Mesh(m,new e.ShaderMaterial({transparent:!0,depthWrite:!1,side:e.DoubleSide,uniforms:{...h,uTint:{value:new e.Color(n)},uAlpha:{value:s}},vertexShader:`
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
      }`})),curve:d}}let v=new e.Group,w=g({turns:1.35,radius:.95*c,rise:2.1,y0:-1.764,thickness:.26,tint:6269183,alpha:.26,phase:0,squash:.55}),x=g({turns:1.8,radius:1.15*c,rise:2.604,y0:-1.26,thickness:.09,tint:9423103,alpha:.18,phase:2.2,squash:.5}),T=g({turns:1.1,radius:.8*c,rise:.756,y0:-2.1,thickness:.18,tint:5217525,alpha:.28,phase:4.1,squash:.55});v.add(w.mesh,x.mesh,T.mesh),n.add(v);let b=new e.BufferGeometry,y=new Float32Array(360);for(let e=0;e<90;e++)y.set([Math.random(),Math.random(),Math.random(),Math.random()],4*e);b.setAttribute("position",new e.BufferAttribute(new Float32Array(270),3)),b.setAttribute("aSeed",new e.BufferAttribute(y,4));let A=new e.ShaderMaterial({transparent:!0,depthWrite:!1,uniforms:{...h,uR:{value:1.05*c},uY0:{value:-1.8900000000000001},uRise:{value:2.52},uScale:{value:1}},vertexShader:`
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
      }`}),R=new e.Points(b,A);R.frustumCulled=!1,v.add(R);let E=()=>{let e=t.clientWidth,r=t.clientHeight;if(!e||!r)return;a.setSize(e,r,!1),s.aspect=e/r;let i=2*Math.atan(Math.tan(28*Math.PI/360)),o=4.9559999999999995/2/Math.tan(i/2),n=3.4*c/2/Math.tan(i/2)/s.aspect;s.position.z=Math.max(o,n),s.updateProjectionMatrix(),A.uniforms.uScale.value=r/600},M=new ResizeObserver(E);M.observe(t),E();let P=!1,U=0,S=new IntersectionObserver(([e])=>{(P=e.isIntersecting)&&!U&&(U=requestAnimationFrame(L))},{rootMargin:"120px"});S.observe(t);let _=new e.Clock;function L(){if(U=0,!P||document.hidden)return;let e=_.getElapsedTime();h.uTime.value=e,v.rotation.y=-(.9*e),v.position.y=.05*Math.sin(.8*e),p.position.y=.08*Math.sin(.8*e+.6),p.rotation.z=.02*Math.sin(.5*e),a.render(n,s),U=requestAnimationFrame(L)}let C=()=>{document.hidden||!P||U||(U=requestAnimationFrame(L))};return document.addEventListener("visibilitychange",C),()=>{cancelAnimationFrame(U),S.disconnect(),M.disconnect(),document.removeEventListener("visibilitychange",C),n.traverse(e=>{e.geometry&&e.geometry.dispose(),e.material&&e.material.dispose()}),u.dispose(),a.dispose(),a.domElement.remove()}}(e,u.current,d.current))}),()=>{a=!0,r()}},[]),(0,t.jsxs)("div",{ref:u,className:`swirl ${c}`,children:[(0,t.jsx)("div",{className:"swirl__fallback",children:(0,t.jsx)(a.default,{name:n,alt:s,sizes:l,style:{backgroundColor:"transparent"}})}),(0,t.jsx)("div",{ref:d,className:"swirl__stage","aria-hidden":"true"})]})}e.s(["default",()=>n])},18283,e=>{"use strict";var t=e.i(43476),r=e.i(22016),a=e.i(10004),i=e.i(3546),o=e.i(17176);function n({p:e,sizesAttr:n="(max-width: 900px) 74vw, 300px"}){let s=`Hello Kemp's, I'd like to enquire about ${e.name} (${e.sizes.join(" / ")}).`;return(0,t.jsxs)("article",{className:"prod","aria-labelledby":`pr-${e.slug}`,children:[(0,t.jsx)("div",{className:"prod__img",style:{"--tint":e.tint},children:(0,t.jsx)(a.default,{name:e.image,alt:`${e.name} bottles in ${e.sizes.join(", ")}`,sizes:n,style:{backgroundColor:"transparent"}})}),(0,t.jsxs)("div",{className:"prod__body",children:[(0,t.jsx)("h3",{id:`pr-${e.slug}`,children:e.name}),(0,t.jsx)("p",{children:e.line}),(0,t.jsx)("div",{className:"sizes","aria-label":"Available sizes",children:e.sizes.map(e=>(0,t.jsx)("span",{children:e},e))}),e.href?(0,t.jsxs)(r.default,{className:"btn btn--ghost btn--sm",href:e.href,children:["Discover ",e.name]}):(0,t.jsxs)("a",{className:"btn btn--ghost btn--sm",href:(0,i.waLink)(s),target:"_blank",rel:"noopener noreferrer",children:[(0,t.jsx)(o.WhatsApp,{width:16,height:16})," Enquire"]})]})]})}e.s(["default",()=>n])},28391,e=>{"use strict";var t=e.i(43476),r=e.i(71645),a=e.i(89970),i=e.i(83495),o=e.i(10004),n=e.i(53522),s=e.i(75093);let l=[.35,.15,.705,1.03];function c({name:e,alt:a,sizes:i="100vw",fit:l="cover",mode:c="ripple",center:u=[.5,.6],drop:d=null,protect:m=[.36,.08,.64,.98],angle:p=0,strength:f=1,className:h="",imgStyle:g}){let v=(0,r.useRef)(null),w=(0,r.useRef)(null);return(0,r.useEffect)(()=>{if(window.matchMedia("(prefers-reduced-motion: reduce)").matches)return;let t=w.current,r=t.getContext("webgl",{premultipliedAlpha:!0,alpha:!0,antialias:!1});if(!r)return;let a=n.IMAGES[e],i=a.w/a.h,o=`
      precision highp float;
      varying vec2 vUv;
      uniform sampler2D uTex;
      uniform vec2 uRes; uniform float uImgAspect; uniform float uTime; uniform float uFit; uniform float uMode;
      uniform vec2 uCenter; uniform vec3 uDrop; uniform vec4 uProtect; uniform float uStrength; uniform float uAngle;
      uniform vec2 uMouse; uniform float uMouseT;

      vec2 fitUv(vec2 uv){
        float ca = uRes.x / uRes.y;
        vec2 s = vec2(1.0);
        if (uFit < 0.5) { if (ca > uImgAspect) s.y = uImgAspect / ca; else s.x = ca / uImgAspect; }
        else { if (ca > uImgAspect) s.x = ca / uImgAspect; else s.y = uImgAspect / ca; }
        return (uv - 0.5) * s + 0.5;
      }

      void main(){
        vec2 p = fitUv(vUv);
        vec2 asp = vec2(uImgAspect, 1.0);
        float sheen = 0.0;

        if (uMode < 0.5) {
          // ── ripple: waves from the crown, stronger on the water surface
          vec2 d = (p - uCenter) * asp;
          float r = length(d);
          float surface = smoothstep(uCenter.y - 0.32, uCenter.y + 0.02, p.y);
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
          sheen += flow * 0.18 * pow(max(0.0, sin(p.x * 140.0 + uTime * 3.0) * sin(p.y * 120.0 - uTime * 2.4)), 24.0);
        }

        if (p.x < 0.0 || p.x > 1.0 || p.y < 0.0 || p.y > 1.0) { gl_FragColor = vec4(0.0); return; }
        vec4 c = texture2D(uTex, p);
        c.rgb += sheen * c.a;
        gl_FragColor = c;
      }`,h=(e,t)=>{let a=r.createShader(e);return(r.shaderSource(a,t),r.compileShader(a),r.getShaderParameter(a,r.COMPILE_STATUS))?a:(console.warn(r.getShaderInfoLog(a)),null)},g=h(r.VERTEX_SHADER,"attribute vec2 a; varying vec2 vUv; void main(){ vUv = a * 0.5 + 0.5; vUv.y = 1.0 - vUv.y; gl_Position = vec4(a, 0.0, 1.0); }"),x=h(r.FRAGMENT_SHADER,o);if(!g||!x)return;let T=r.createProgram();r.attachShader(T,g),r.attachShader(T,x),r.linkProgram(T),r.useProgram(T);let b=r.createBuffer();r.bindBuffer(r.ARRAY_BUFFER,b),r.bufferData(r.ARRAY_BUFFER,new Float32Array([-1,-1,1,-1,-1,1,-1,1,1,-1,1,1]),r.STATIC_DRAW);let y=r.getAttribLocation(T,"a");r.enableVertexAttribArray(y),r.vertexAttribPointer(y,2,r.FLOAT,!1,0,0);let A={res:r.getUniformLocation(T,"uRes"),asp:r.getUniformLocation(T,"uImgAspect"),time:r.getUniformLocation(T,"uTime"),fit:r.getUniformLocation(T,"uFit"),mode:r.getUniformLocation(T,"uMode"),center:r.getUniformLocation(T,"uCenter"),drop:r.getUniformLocation(T,"uDrop"),protect:r.getUniformLocation(T,"uProtect"),strength:r.getUniformLocation(T,"uStrength"),mouse:r.getUniformLocation(T,"uMouse"),mouseT:r.getUniformLocation(T,"uMouseT"),angle:r.getUniformLocation(T,"uAngle")};r.uniform1f(A.asp,i),r.uniform1f(A.fit,+("cover"!==l)),r.uniform1f(A.mode,+("ripple"!==c)),r.uniform2f(A.center,u[0],u[1]),r.uniform3f(A.drop,...d||[0,0,0]),r.uniform4f(A.protect,...m),r.uniform1f(A.strength,f),r.uniform1f(A.angle,p),r.uniform2f(A.mouse,-5,-5),r.uniform1f(A.mouseT,-100);let R=r.createTexture(),E=!1,M=!1,P=0,U=performance.now(),S=()=>(performance.now()-U)/1e3,_=()=>{let e=t.getBoundingClientRect(),a=Math.min(window.devicePixelRatio||1,1.5);t.width=Math.max(1,Math.round(e.width*a)),t.height=Math.max(1,Math.round(e.height*a)),r.viewport(0,0,t.width,t.height),r.uniform2f(A.res,t.width,t.height)},L=()=>{P=0,E&&M&&!document.hidden&&(r.uniform1f(A.time,S()),r.clearColor(0,0,0,0),r.clear(r.COLOR_BUFFER_BIT),r.drawArrays(r.TRIANGLES,0,6),P=requestAnimationFrame(L))},C=()=>{P||(P=requestAnimationFrame(L))},I=new Image;I.decoding="async";let z=a.widths.find(e=>e>=Math.min(1600,1.5*v.current.clientWidth))||a.widths[a.widths.length-1];I.onload=()=>{r.bindTexture(r.TEXTURE_2D,R),r.pixelStorei(r.UNPACK_PREMULTIPLY_ALPHA_WEBGL,!0),r.texImage2D(r.TEXTURE_2D,0,r.RGBA,r.RGBA,r.UNSIGNED_BYTE,I),r.texParameteri(r.TEXTURE_2D,r.TEXTURE_MIN_FILTER,r.LINEAR),r.texParameteri(r.TEXTURE_2D,r.TEXTURE_MAG_FILTER,r.LINEAR),r.texParameteri(r.TEXTURE_2D,r.TEXTURE_WRAP_S,r.CLAMP_TO_EDGE),r.texParameteri(r.TEXTURE_2D,r.TEXTURE_WRAP_T,r.CLAMP_TO_EDGE),E=!0,_(),v.current?.classList.add("is-live"),C()},I.src=(0,s.asset)(`/img/${e}-${z}.webp`);let N=new IntersectionObserver(([e])=>{(M=e.isIntersecting)&&C()},{rootMargin:"100px"});N.observe(v.current);let j=new ResizeObserver(()=>E&&_());j.observe(t);let k=v.current.closest("section")||v.current,D=0,F=e=>{if("ripple"!==c)return;let a=S();if(a-D<.35)return;let o=t.getBoundingClientRect(),n=(e.clientX-o.left)/o.width,s=(e.clientY-o.top)/o.height;if(n<0||n>1||s<0||s>1)return;let u=o.width/o.height,d=1,m=1;"cover"===l&&(u>i?m=i/u:d=u/i),r.uniform2f(A.mouse,(n-.5)*d+.5,(s-.5)*m+.5),r.uniform1f(A.mouseT,a),D=a};return k.addEventListener("pointermove",F),()=>{cancelAnimationFrame(P),N.disconnect(),j.disconnect(),k.removeEventListener("pointermove",F),r.deleteTexture(R),r.deleteBuffer(b),r.deleteProgram(T)}},[e,l,c,f]),(0,t.jsxs)("div",{ref:v,className:`liquid liquid--${l} ${h}`,children:[(0,t.jsx)(o.default,{name:e,alt:a,sizes:i,style:{backgroundColor:"transparent",...g}}),(0,t.jsx)("canvas",{ref:w,"aria-hidden":"true"})]})}function u({variant:e="hero",className:i="",sizes:o="40vw"}){let n=(0,r.useRef)(null),s=(0,r.useRef)(null);return(0,r.useEffect)(()=>{if(window.matchMedia("(prefers-reduced-motion: reduce)").matches)return;let t=n.current,r=s.current;if("hero"===e){let e=a.gsap.fromTo(t,{rotate:0,yPercent:0},{rotate:10,yPercent:-12,ease:"none",scrollTrigger:{trigger:t.closest("section"),start:"top top",end:"bottom top",scrub:1}});return()=>e.scrollTrigger?.kill()}let i=t.closest("section")||t,o=0,l=0,c=0,u=0,d=0,m=()=>{o+=(c-o)*.08,l+=(u-l)*.08,r.style.transform=`perspective(1100px) rotateX(${o.toFixed(2)}deg) rotateY(${l.toFixed(2)}deg)`,d=Math.abs(c-o)+Math.abs(u-l)>.01?requestAnimationFrame(m):0},p=e=>{let r=t.getBoundingClientRect(),a=(e.clientX-(r.left+r.width/2))/(r.width/2),i=(e.clientY-(r.top+r.height/2))/(r.height/2);u=16*Math.max(-1,Math.min(1,a)),c=-10*Math.max(-1,Math.min(1,i)),d||(d=requestAnimationFrame(m))},f=()=>{c=0,u=0,d||(d=requestAnimationFrame(m))};i.addEventListener("pointermove",p),i.addEventListener("pointerleave",f);let h=a.gsap.fromTo(t,{rotate:-6},{rotate:6,ease:"none",scrollTrigger:{trigger:i,start:"top bottom",end:"bottom top",scrub:1}});return()=>{i.removeEventListener("pointermove",p),i.removeEventListener("pointerleave",f),cancelAnimationFrame(d),h.scrollTrigger?.kill()}},[e]),(0,t.jsx)("div",{ref:n,className:`fbottle fbottle--${e} ${i}`,children:(0,t.jsx)("div",{ref:s,className:"fbottle__card",children:(0,t.jsx)(c,{className:"liquid--float",name:"kemps-bottle",mode:"splash",fit:"contain",protect:l,angle:.28,strength:1.2,alt:"Kemp's packaged drinking water 1 litre bottle with a pink cap and label, surrounded by a splash of water",sizes:o})})})}a.gsap.registerPlugin(i.ScrollTrigger),e.s(["default",()=>u],28391)},24884,e=>{"use strict";var t=e.i(43476),r=e.i(71645),a=e.i(22016),i=e.i(89970),o=e.i(83495),n=e.i(12656),s=e.i(18283);function l({as:e="h2",lines:r,className:a="h2",id:i,auto:o}){return(0,t.jsx)(e,{className:a,id:i,"data-lq":o?"auto":"",children:r.map((e,r)=>(0,t.jsx)("span",{className:"lq-line",children:(0,t.jsx)("span",{className:"lq-inner",children:e})},r))})}var c=e.i(17176);function u(){let e=(0,r.useRef)(null),o=(0,r.useRef)(null),u=(0,r.useRef)(null);return(0,r.useEffect)(()=>{if(window.matchMedia("(prefers-reduced-motion: reduce)").matches)return;let t=i.gsap.matchMedia();return t.add("(min-width: 901px)",()=>{let t=o.current,r=()=>Math.max(0,t.scrollWidth-window.innerWidth),a=i.gsap.to(t,{x:()=>-r(),ease:"none",scrollTrigger:{trigger:e.current,start:"top top",end:()=>`+=${r()}`,pin:!0,scrub:1,invalidateOnRefresh:!0,anticipatePin:1,onUpdate:e=>{u.current&&(u.current.style.transform=`scaleX(${e.progress})`)}}});return()=>a.scrollTrigger?.kill()}),()=>t.revert()},[]),(0,t.jsx)("section",{className:"collection",id:"range","aria-labelledby":"range-title",children:(0,t.jsxs)("div",{className:"collection__pin",ref:e,children:[(0,t.jsxs)("div",{className:"collection__track",ref:o,children:[(0,t.jsxs)("div",{className:"pcard pcard--intro",children:[(0,t.jsx)("span",{className:"eyebrow",children:"The range"}),(0,t.jsx)("div",{style:{height:24}}),(0,t.jsx)(l,{id:"range-title",lines:["Ten ways",(0,t.jsx)("em",{children:"to refresh."},"e")]}),(0,t.jsx)("p",{className:"lede",style:{marginTop:24},children:"Water in every size you need, alkaline Eight Plus, and sodas with a distinctly Indian character."}),(0,t.jsxs)(a.default,{href:"/products/",className:"btn btn--ghost",style:{alignSelf:"start",marginTop:8},children:["View all products ",(0,t.jsx)(c.Arrow,{})]})]}),n.PRODUCTS.map(e=>(0,t.jsx)(s.default,{p:e},e.slug))]}),(0,t.jsx)("div",{className:"collection__progress","aria-hidden":"true",children:(0,t.jsx)("i",{ref:u})})]})})}i.gsap.registerPlugin(o.ScrollTrigger),e.s(["default",()=>u],24884)},21442,e=>{e.v(t=>Promise.all(["static/chunks/b4a4bf05965e2557.js"].map(t=>e.l(t))).then(()=>t(32009)))}]);