(globalThis.TURBOPACK||(globalThis.TURBOPACK=[])).push(["object"==typeof document?document.currentScript:void 0,52863,e=>{"use strict";var t=e.i(71645),r=e.i(89970),o=e.i(83495);function i(){return(0,t.useEffect)(()=>{if(window.matchMedia("(prefers-reduced-motion: reduce)").matches)return void document.querySelectorAll(".reveal-img").forEach(e=>e.classList.add("is-in"));let e=r.gsap.context(()=>{r.gsap.utils.toArray("[data-lq]").forEach(e=>{let t=e.querySelectorAll(".lq-inner"),o={y:0,yPercent:0,"--mp":"0%",duration:1.6,ease:"expo.out",stagger:.12};"auto"===e.dataset.lq?r.gsap.to(t,{...o,delay:.35}):r.gsap.to(t,{...o,scrollTrigger:{trigger:e,start:"top 85%",once:!0}})}),r.gsap.utils.toArray("[data-fade]").forEach(e=>{e.closest(".hero")?r.gsap.to(e,{opacity:1,y:0,duration:1.4,ease:"power3.out",delay:.6+(Number(e.dataset.fade)||0)}):r.gsap.to(e,{opacity:1,y:0,duration:1.2,ease:"power3.out",delay:Number(e.dataset.fade)||0,scrollTrigger:{trigger:e,start:"top 88%",once:!0}})}),r.gsap.utils.toArray(".reveal-img").forEach(e=>{let t=e.querySelector("img");o.ScrollTrigger.create({trigger:e,start:"top 80%",once:!0,onEnter:()=>e.classList.add("is-in")}),e.style.transition="clip-path 1.6s cubic-bezier(.22,1,.36,1)",t&&r.gsap.fromTo(t,{scale:1.18},{scale:1,ease:"none",scrollTrigger:{trigger:e,start:"top bottom",end:"bottom top",scrub:!0}})}),r.gsap.utils.toArray("[data-parallax]").forEach(e=>{let t=Number(e.dataset.parallax)||10;r.gsap.fromTo(e,{yPercent:-t},{yPercent:t,ease:"none",scrollTrigger:{trigger:e.parentElement,start:"top bottom",end:"bottom top",scrub:!0}})}),r.gsap.utils.toArray("[data-ripple] path").forEach(e=>{let t=e.dataset.a,o=e.dataset.b;r.gsap.fromTo(e,{attr:{d:t}},{attr:{d:o},ease:"none",scrollTrigger:{trigger:e.closest("[data-ripple]"),start:"top bottom",end:"bottom top",scrub:1}})})}),t=()=>o.ScrollTrigger.refresh();return window.addEventListener("load",t),()=>{window.removeEventListener("load",t),e.revert()}},[]),null}r.gsap.registerPlugin(o.ScrollTrigger),e.s(["default",()=>i])},10004,53522,e=>{"use strict";var t=e.i(43476);let r={"p-water-blue":{w:409,h:696,widths:[400,409],color:null},"p-water-pink":{w:411,h:796,widths:[400,411],color:null},"p-eightplus":{w:1426,h:3478,widths:[400,800,900],color:null},"p-club-soda":{w:306,h:716,widths:[306],color:null},"p-jeera-soda":{w:321,h:790,widths:[321],color:null},"p-kokum":{w:469,h:651,widths:[400,469],color:null},"p-lemon":{w:440,h:964,widths:[400,440],color:null},"p-mango":{w:320,h:768,widths:[320],color:null},"p-orange":{w:389,h:1008,widths:[389],color:null},"p-pudina":{w:307,h:755,widths:[307],color:null},"jeera-mockup":{w:948,h:3336,widths:[400,800,948],color:null},"ep-duo":{w:1219,h:1e3,widths:[400,800,1200,1219],color:null},"ep-splash":{w:775,h:1146,widths:[400,775],color:null},"ep-logo":{w:1642,h:291,widths:[400,800,1e3],color:null},"ep-banner":{w:4826,h:2781,widths:[400,800,1200,1600,2400],color:"#c4d1db"},"ph-glass":{w:1731,h:1333,widths:[400,800,1200,1400],color:null},award:{w:3600,h:2400,widths:[400,800,1200,1600,1800],color:"#c78d62"},lake:{w:2752,h:1536,widths:[400,800,1200,1600,2400],color:"#5a7d9e"},river:{w:2752,h:1536,widths:[400,800,1200,1600,2400],color:"#768b9d"},droplet:{w:2752,h:1536,widths:[400,800,1200,1600,2400],color:"#375d7b"},logo:{w:900,h:399},"kemps-bottle":{w:1107,h:1487,widths:[400,800,1107],color:null}};e.s(["IMAGES",0,r],53522);var o=e.i(75093);function i({name:e,alt:i,sizes:a="100vw",priority:s=!1,className:l,imgClassName:n,style:c,...u}){let d=r[e];if(!d)return null;let p=t=>d.widths.map(r=>`${o.BASE}/img/${e}-${r}.${t} ${r}w`).join(", ");return(0,t.jsxs)("picture",{className:l,...u,children:[(0,t.jsx)("source",{type:"image/avif",srcSet:p("avif"),sizes:a}),(0,t.jsx)("img",{src:`${o.BASE}/img/${e}-${d.widths[d.widths.length-1]}.webp`,srcSet:p("webp"),sizes:a,width:d.w,height:d.h,alt:i,loading:s?"eager":"lazy",fetchPriority:s?"high":void 0,decoding:s?"sync":"async",className:n,style:{...c,backgroundColor:d.color}})]})}e.s(["default",()=>i],10004)},41502,e=>{"use strict";var t=e.i(43476),r=e.i(71645),o=e.i(10004),i=e.i(53522),a=e.i(75093);function s({name:e,alt:s,sizes:l="100vw",fit:n="cover",mode:c="ripple",center:u=[.5,.6],drop:d=null,protect:p=[.36,.08,.64,.98],angle:h=0,strength:m=1,className:f="",imgStyle:g}){let w=(0,r.useRef)(null),v=(0,r.useRef)(null);return(0,r.useEffect)(()=>{if(window.matchMedia("(prefers-reduced-motion: reduce)").matches)return;let t=v.current,r=t.getContext("webgl",{premultipliedAlpha:!0,alpha:!0,antialias:!1});if(!r)return;let o=i.IMAGES[e],s=o.w/o.h,l=`
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
      }`,f=(e,t)=>{let o=r.createShader(e);return(r.shaderSource(o,t),r.compileShader(o),r.getShaderParameter(o,r.COMPILE_STATUS))?o:(console.warn(r.getShaderInfoLog(o)),null)},g=f(r.VERTEX_SHADER,"attribute vec2 a; varying vec2 vUv; void main(){ vUv = a * 0.5 + 0.5; vUv.y = 1.0 - vUv.y; gl_Position = vec4(a, 0.0, 1.0); }"),T=f(r.FRAGMENT_SHADER,l);if(!g||!T)return;let x=r.createProgram();r.attachShader(x,g),r.attachShader(x,T),r.linkProgram(x),r.useProgram(x);let b=r.createBuffer();r.bindBuffer(r.ARRAY_BUFFER,b),r.bufferData(r.ARRAY_BUFFER,new Float32Array([-1,-1,1,-1,-1,1,-1,1,1,-1,1,1]),r.STATIC_DRAW);let E=r.getAttribLocation(x,"a");r.enableVertexAttribArray(E),r.vertexAttribPointer(E,2,r.FLOAT,!1,0,0);let y={res:r.getUniformLocation(x,"uRes"),asp:r.getUniformLocation(x,"uImgAspect"),time:r.getUniformLocation(x,"uTime"),fit:r.getUniformLocation(x,"uFit"),mode:r.getUniformLocation(x,"uMode"),center:r.getUniformLocation(x,"uCenter"),drop:r.getUniformLocation(x,"uDrop"),protect:r.getUniformLocation(x,"uProtect"),strength:r.getUniformLocation(x,"uStrength"),mouse:r.getUniformLocation(x,"uMouse"),mouseT:r.getUniformLocation(x,"uMouseT"),angle:r.getUniformLocation(x,"uAngle")};r.uniform1f(y.asp,s),r.uniform1f(y.fit,+("cover"!==n)),r.uniform1f(y.mode,+("ripple"!==c)),r.uniform2f(y.center,u[0],u[1]),r.uniform3f(y.drop,...d||[0,0,0]),r.uniform4f(y.protect,...p),r.uniform1f(y.strength,m),r.uniform1f(y.angle,h),r.uniform2f(y.mouse,-5,-5),r.uniform1f(y.mouseT,-100);let A=r.createTexture(),R=!1,_=!1,P=0,L=performance.now(),U=()=>(performance.now()-L)/1e3,S=()=>{let e=t.getBoundingClientRect(),o=Math.min(window.devicePixelRatio||1,1.5);t.width=Math.max(1,Math.round(e.width*o)),t.height=Math.max(1,Math.round(e.height*o)),r.viewport(0,0,t.width,t.height),r.uniform2f(y.res,t.width,t.height)},j=()=>{P=0,R&&_&&!document.hidden&&(r.uniform1f(y.time,U()),r.clearColor(0,0,0,0),r.clear(r.COLOR_BUFFER_BIT),r.drawArrays(r.TRIANGLES,0,6),P=requestAnimationFrame(j))},I=()=>{P||(P=requestAnimationFrame(j))},M=new Image;M.decoding="async";let D=o.widths.find(e=>e>=Math.min(1600,1.5*w.current.clientWidth))||o.widths[o.widths.length-1];M.onload=()=>{r.bindTexture(r.TEXTURE_2D,A),r.pixelStorei(r.UNPACK_PREMULTIPLY_ALPHA_WEBGL,!0),r.texImage2D(r.TEXTURE_2D,0,r.RGBA,r.RGBA,r.UNSIGNED_BYTE,M),r.texParameteri(r.TEXTURE_2D,r.TEXTURE_MIN_FILTER,r.LINEAR),r.texParameteri(r.TEXTURE_2D,r.TEXTURE_MAG_FILTER,r.LINEAR),r.texParameteri(r.TEXTURE_2D,r.TEXTURE_WRAP_S,r.CLAMP_TO_EDGE),r.texParameteri(r.TEXTURE_2D,r.TEXTURE_WRAP_T,r.CLAMP_TO_EDGE),R=!0,S(),w.current?.classList.add("is-live"),I()},M.src=(0,a.asset)(`/img/${e}-${D}.webp`);let C=new IntersectionObserver(([e])=>{(_=e.isIntersecting)&&I()},{rootMargin:"100px"});C.observe(w.current);let N=new ResizeObserver(()=>R&&S());N.observe(t);let k=w.current.closest("section")||w.current,B=0,F=e=>{if("ripple"!==c)return;let o=U();if(o-B<.35)return;let i=t.getBoundingClientRect(),a=(e.clientX-i.left)/i.width,l=(e.clientY-i.top)/i.height;if(a<0||a>1||l<0||l>1)return;let u=i.width/i.height,d=1,p=1;"cover"===n&&(u>s?p=s/u:d=u/s),r.uniform2f(y.mouse,(a-.5)*d+.5,(l-.5)*p+.5),r.uniform1f(y.mouseT,o),B=o};return k.addEventListener("pointermove",F),()=>{cancelAnimationFrame(P),C.disconnect(),N.disconnect(),k.removeEventListener("pointermove",F),r.deleteTexture(A),r.deleteBuffer(b),r.deleteProgram(x)}},[e,n,c,m]),(0,t.jsxs)("div",{ref:w,className:`liquid liquid--${n} ${f}`,children:[(0,t.jsx)(o.default,{name:e,alt:s,sizes:l,style:{backgroundColor:"transparent",...g}}),(0,t.jsx)("canvas",{ref:v,"aria-hidden":"true"})]})}e.s(["DROPLET",0,{center:[.5,.62],drop:[.5,.28,.06]},"KEMPS_BOTTLE",0,{protect:[.35,.15,.705,1.03],angle:.28},"SPLASH_BOTTLE",0,[.36,.02,.745,.99],"default",()=>s])},37506,e=>{"use strict";var t=e.i(43476),r=e.i(71645);function o(){let e=(0,r.useRef)(null),[o,i]=(0,r.useState)(!1);(0,r.useEffect)(()=>{let t=new IntersectionObserver(([e])=>e.isIntersecting&&i(!0),{threshold:.4});return t.observe(e.current),()=>t.disconnect()},[]);let a=e=>`${e/14*100}%`;return(0,t.jsxs)("div",{ref:e,children:[(0,t.jsxs)("div",{className:"phscale",role:"img","aria-label":"pH scale from 0 (acidic) to 14 (alkaline). Typical drinking water is around pH 7; Eight Plus is above pH 8.",children:[(0,t.jsxs)("div",{className:"phscale__marker phscale__marker--muted",style:{left:a(7*!!o)},children:[(0,t.jsx)("b",{children:"Typical water · pH 7"}),(0,t.jsx)("i",{})]}),(0,t.jsxs)("div",{className:"phscale__marker",style:{left:a(8.4*!!o),top:-96},children:[(0,t.jsx)("b",{children:"Eight Plus · pH 8+"}),(0,t.jsx)("i",{style:{height:72}})]}),(0,t.jsx)("div",{className:"phscale__bar"}),(0,t.jsx)("div",{className:"phscale__ticks","aria-hidden":"true",children:Array.from({length:15},(e,r)=>(0,t.jsx)("span",{children:r},r))})]}),(0,t.jsxs)("div",{className:"phlegend",children:[(0,t.jsxs)("div",{children:[(0,t.jsx)("b",{children:"Acidic"}),(0,t.jsx)("span",{children:"pH 0.0 – 6.9"})]}),(0,t.jsxs)("div",{children:[(0,t.jsx)("b",{children:"Neutral"}),(0,t.jsx)("span",{children:"pH 7.0"})]}),(0,t.jsxs)("div",{children:[(0,t.jsx)("b",{children:"Alkaline"}),(0,t.jsx)("span",{children:"pH 7.1 – 14.0"})]})]})]})}e.s(["default",()=>o])}]);