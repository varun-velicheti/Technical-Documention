(globalThis.TURBOPACK||(globalThis.TURBOPACK=[])).push(["object"==typeof document?document.currentScript:void 0,52863,e=>{"use strict";var t=e.i(71645),r=e.i(89970),o=e.i(83495);function i(){return(0,t.useEffect)(()=>{if(window.matchMedia("(prefers-reduced-motion: reduce)").matches)return void document.querySelectorAll(".reveal-img").forEach(e=>e.classList.add("is-in"));let e=r.gsap.context(()=>{r.gsap.utils.toArray("[data-lq]").forEach(e=>{let t=e.querySelectorAll(".lq-inner"),o={y:0,yPercent:0,"--mp":"0%",duration:1.6,ease:"expo.out",stagger:.12};"auto"===e.dataset.lq?r.gsap.to(t,{...o,delay:.35}):r.gsap.to(t,{...o,scrollTrigger:{trigger:e,start:"top 85%",once:!0}})}),r.gsap.utils.toArray("[data-fade]").forEach(e=>{e.closest(".hero")?r.gsap.to(e,{opacity:1,y:0,duration:1.4,ease:"power3.out",delay:.6+(Number(e.dataset.fade)||0)}):r.gsap.to(e,{opacity:1,y:0,duration:1.2,ease:"power3.out",delay:Number(e.dataset.fade)||0,scrollTrigger:{trigger:e,start:"top 88%",once:!0}})}),r.gsap.utils.toArray(".reveal-img").forEach(e=>{let t=e.querySelector("img");o.ScrollTrigger.create({trigger:e,start:"top 80%",once:!0,onEnter:()=>e.classList.add("is-in")}),e.style.transition="clip-path 1.6s cubic-bezier(.22,1,.36,1)",t&&r.gsap.fromTo(t,{scale:1.18},{scale:1,ease:"none",scrollTrigger:{trigger:e,start:"top bottom",end:"bottom top",scrub:!0}})}),r.gsap.utils.toArray("[data-parallax]").forEach(e=>{let t=Number(e.dataset.parallax)||10;r.gsap.fromTo(e,{yPercent:-t},{yPercent:t,ease:"none",scrollTrigger:{trigger:e.parentElement,start:"top bottom",end:"bottom top",scrub:!0}})}),r.gsap.utils.toArray("[data-ripple] path").forEach(e=>{let t=e.dataset.a,o=e.dataset.b;r.gsap.fromTo(e,{attr:{d:t}},{attr:{d:o},ease:"none",scrollTrigger:{trigger:e.closest("[data-ripple]"),start:"top bottom",end:"bottom top",scrub:1}})})}),t=()=>o.ScrollTrigger.refresh();return window.addEventListener("load",t),()=>{window.removeEventListener("load",t),e.revert()}},[]),null}r.gsap.registerPlugin(o.ScrollTrigger),e.s(["default",()=>i])},10004,53522,e=>{"use strict";var t=e.i(43476);let r={"p-water-blue":{w:409,h:696,widths:[400,409],color:null},"p-water-pink":{w:411,h:796,widths:[400,411],color:null},"p-eightplus":{w:1426,h:3478,widths:[400,800,900],color:null},"p-club-soda":{w:306,h:716,widths:[306],color:null},"p-jeera-soda":{w:321,h:790,widths:[321],color:null},"p-kokum":{w:469,h:651,widths:[400,469],color:null},"p-lemon":{w:440,h:964,widths:[400,440],color:null},"p-mango":{w:320,h:768,widths:[320],color:null},"p-orange":{w:389,h:1008,widths:[389],color:null},"p-pudina":{w:307,h:755,widths:[307],color:null},"jeera-mockup":{w:948,h:3336,widths:[400,800,948],color:null},"ep-duo":{w:1219,h:1e3,widths:[400,800,1200,1219],color:null},"ep-splash":{w:775,h:1146,widths:[400,775],color:null},"ep-logo":{w:1642,h:291,widths:[400,800,1e3],color:null},"ep-banner":{w:4826,h:2781,widths:[400,800,1200,1600,2400],color:"#c4d1db"},"ph-glass":{w:1731,h:1333,widths:[400,800,1200,1400],color:null},award:{w:3600,h:2400,widths:[400,800,1200,1600,1800],color:"#c78d62"},lake:{w:2752,h:1536,widths:[400,800,1200,1600,2400],color:"#5a7d9e"},river:{w:2752,h:1536,widths:[400,800,1200,1600,2400],color:"#768b9d"},droplet:{w:2752,h:1536,widths:[400,800,1200,1600,2400],color:"#375d7b"},logo:{w:900,h:399}};e.s(["IMAGES",0,r],53522);var o=e.i(75093);function i({name:e,alt:i,sizes:a="100vw",priority:s=!1,className:n,imgClassName:l,style:c,...u}){let d=r[e];if(!d)return null;let p=t=>d.widths.map(r=>`${o.BASE}/img/${e}-${r}.${t} ${r}w`).join(", ");return(0,t.jsxs)("picture",{className:n,...u,children:[(0,t.jsx)("source",{type:"image/avif",srcSet:p("avif"),sizes:a}),(0,t.jsx)("img",{src:`${o.BASE}/img/${e}-${d.widths[d.widths.length-1]}.webp`,srcSet:p("webp"),sizes:a,width:d.w,height:d.h,alt:i,loading:s?"eager":"lazy",fetchPriority:s?"high":void 0,decoding:s?"sync":"async",className:l,style:{...c,backgroundColor:d.color}})]})}e.s(["default",()=>i],10004)},41502,e=>{"use strict";var t=e.i(43476),r=e.i(71645),o=e.i(10004),i=e.i(53522),a=e.i(75093);function s({name:e,alt:s,sizes:n="100vw",fit:l="cover",mode:c="ripple",center:u=[.5,.6],drop:d=null,protect:p=[.36,.08,.64,.98],strength:h=1,className:m="",imgStyle:f}){let g=(0,r.useRef)(null),w=(0,r.useRef)(null);return(0,r.useEffect)(()=>{if(window.matchMedia("(prefers-reduced-motion: reduce)").matches)return;let t=w.current,r=t.getContext("webgl",{premultipliedAlpha:!0,alpha:!0,antialias:!1});if(!r)return;let o=i.IMAGES[e],s=o.w/o.h,n=`
      precision highp float;
      varying vec2 vUv;
      uniform sampler2D uTex;
      uniform vec2 uRes; uniform float uImgAspect; uniform float uTime; uniform float uFit; uniform float uMode;
      uniform vec2 uCenter; uniform vec3 uDrop; uniform vec4 uProtect; uniform float uStrength;
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
          vec2 q = smoothstep(uProtect.xy - 0.03, uProtect.xy + 0.03, p) * (1.0 - smoothstep(uProtect.zw - 0.03, uProtect.zw + 0.03, p));
          float inside = q.x * q.y;
          float flow = 1.0 - inside;
          vec2 o = vec2(
            sin(p.y * 26.0 + uTime * 1.6) + 0.6 * sin(p.y * 61.0 - uTime * 2.3 + p.x * 9.0),
            cos(p.x * 24.0 + uTime * 1.3) + 0.6 * cos(p.x * 57.0 + uTime * 2.0 + p.y * 7.0)
          );
          p += o * 0.0032 * flow * uStrength;
          // light sheen sweeping across the bottle every few seconds
          float x = (p.x - uProtect.x) / (uProtect.z - uProtect.x) + (p.y - 0.5) * 0.35;
          float pos = fract(uTime * 0.11) * 2.6 - 0.8;
          sheen = smoothstep(0.16, 0.0, abs(x - pos)) * inside * 0.32;
          // sparkle on splash highlights
          sheen += flow * 0.18 * pow(max(0.0, sin(p.x * 140.0 + uTime * 3.0) * sin(p.y * 120.0 - uTime * 2.4)), 24.0);
        }

        if (p.x < 0.0 || p.x > 1.0 || p.y < 0.0 || p.y > 1.0) { gl_FragColor = vec4(0.0); return; }
        vec4 c = texture2D(uTex, p);
        c.rgb += sheen * c.a;
        gl_FragColor = c;
      }`,m=(e,t)=>{let o=r.createShader(e);return(r.shaderSource(o,t),r.compileShader(o),r.getShaderParameter(o,r.COMPILE_STATUS))?o:(console.warn(r.getShaderInfoLog(o)),null)},f=m(r.VERTEX_SHADER,"attribute vec2 a; varying vec2 vUv; void main(){ vUv = a * 0.5 + 0.5; vUv.y = 1.0 - vUv.y; gl_Position = vec4(a, 0.0, 1.0); }"),v=m(r.FRAGMENT_SHADER,n);if(!f||!v)return;let T=r.createProgram();r.attachShader(T,f),r.attachShader(T,v),r.linkProgram(T),r.useProgram(T);let x=r.createBuffer();r.bindBuffer(r.ARRAY_BUFFER,x),r.bufferData(r.ARRAY_BUFFER,new Float32Array([-1,-1,1,-1,-1,1,-1,1,1,-1,1,1]),r.STATIC_DRAW);let E=r.getAttribLocation(T,"a");r.enableVertexAttribArray(E),r.vertexAttribPointer(E,2,r.FLOAT,!1,0,0);let y={res:r.getUniformLocation(T,"uRes"),asp:r.getUniformLocation(T,"uImgAspect"),time:r.getUniformLocation(T,"uTime"),fit:r.getUniformLocation(T,"uFit"),mode:r.getUniformLocation(T,"uMode"),center:r.getUniformLocation(T,"uCenter"),drop:r.getUniformLocation(T,"uDrop"),protect:r.getUniformLocation(T,"uProtect"),strength:r.getUniformLocation(T,"uStrength"),mouse:r.getUniformLocation(T,"uMouse"),mouseT:r.getUniformLocation(T,"uMouseT")};r.uniform1f(y.asp,s),r.uniform1f(y.fit,+("cover"!==l)),r.uniform1f(y.mode,+("ripple"!==c)),r.uniform2f(y.center,u[0],u[1]),r.uniform3f(y.drop,...d||[0,0,0]),r.uniform4f(y.protect,...p),r.uniform1f(y.strength,h),r.uniform2f(y.mouse,-5,-5),r.uniform1f(y.mouseT,-100);let A=r.createTexture(),b=!1,R=!1,_=0,P=performance.now(),U=()=>(performance.now()-P)/1e3,L=()=>{let e=t.getBoundingClientRect(),o=Math.min(window.devicePixelRatio||1,1.5);t.width=Math.max(1,Math.round(e.width*o)),t.height=Math.max(1,Math.round(e.height*o)),r.viewport(0,0,t.width,t.height),r.uniform2f(y.res,t.width,t.height)},S=()=>{_=0,b&&R&&!document.hidden&&(r.uniform1f(y.time,U()),r.clearColor(0,0,0,0),r.clear(r.COLOR_BUFFER_BIT),r.drawArrays(r.TRIANGLES,0,6),_=requestAnimationFrame(S))},j=()=>{_||(_=requestAnimationFrame(S))},I=new Image;I.decoding="async";let M=o.widths.find(e=>e>=Math.min(1600,1.5*g.current.clientWidth))||o.widths[o.widths.length-1];I.onload=()=>{r.bindTexture(r.TEXTURE_2D,A),r.pixelStorei(r.UNPACK_PREMULTIPLY_ALPHA_WEBGL,!0),r.texImage2D(r.TEXTURE_2D,0,r.RGBA,r.RGBA,r.UNSIGNED_BYTE,I),r.texParameteri(r.TEXTURE_2D,r.TEXTURE_MIN_FILTER,r.LINEAR),r.texParameteri(r.TEXTURE_2D,r.TEXTURE_MAG_FILTER,r.LINEAR),r.texParameteri(r.TEXTURE_2D,r.TEXTURE_WRAP_S,r.CLAMP_TO_EDGE),r.texParameteri(r.TEXTURE_2D,r.TEXTURE_WRAP_T,r.CLAMP_TO_EDGE),b=!0,L(),g.current?.classList.add("is-live"),j()},I.src=(0,a.asset)(`/img/${e}-${M}.webp`);let D=new IntersectionObserver(([e])=>{(R=e.isIntersecting)&&j()},{rootMargin:"100px"});D.observe(g.current);let C=new ResizeObserver(()=>b&&L());C.observe(t);let N=g.current.closest("section")||g.current,F=0,k=e=>{if("ripple"!==c)return;let o=U();if(o-F<.35)return;let i=t.getBoundingClientRect(),a=(e.clientX-i.left)/i.width,n=(e.clientY-i.top)/i.height;if(a<0||a>1||n<0||n>1)return;let u=i.width/i.height,d=1,p=1;"cover"===l&&(u>s?p=s/u:d=u/s),r.uniform2f(y.mouse,(a-.5)*d+.5,(n-.5)*p+.5),r.uniform1f(y.mouseT,o),F=o};return N.addEventListener("pointermove",k),()=>{cancelAnimationFrame(_),D.disconnect(),C.disconnect(),N.removeEventListener("pointermove",k),r.deleteTexture(A),r.deleteBuffer(x),r.deleteProgram(T)}},[e,l,c,h]),(0,t.jsxs)("div",{ref:g,className:`liquid liquid--${l} ${m}`,children:[(0,t.jsx)(o.default,{name:e,alt:s,sizes:n,style:{backgroundColor:"transparent",...f}}),(0,t.jsx)("canvas",{ref:w,"aria-hidden":"true"})]})}e.s(["DROPLET",0,{center:[.5,.62],drop:[.5,.28,.06]},"SPLASH_BOTTLE",0,[.36,.02,.745,.99],"default",()=>s])},37506,e=>{"use strict";var t=e.i(43476),r=e.i(71645);function o(){let e=(0,r.useRef)(null),[o,i]=(0,r.useState)(!1);(0,r.useEffect)(()=>{let t=new IntersectionObserver(([e])=>e.isIntersecting&&i(!0),{threshold:.4});return t.observe(e.current),()=>t.disconnect()},[]);let a=e=>`${e/14*100}%`;return(0,t.jsxs)("div",{ref:e,children:[(0,t.jsxs)("div",{className:"phscale",role:"img","aria-label":"pH scale from 0 (acidic) to 14 (alkaline). Typical drinking water is around pH 7; Eight Plus is above pH 8.",children:[(0,t.jsxs)("div",{className:"phscale__marker phscale__marker--muted",style:{left:a(7*!!o)},children:[(0,t.jsx)("b",{children:"Typical water · pH 7"}),(0,t.jsx)("i",{})]}),(0,t.jsxs)("div",{className:"phscale__marker",style:{left:a(8.4*!!o),top:-96},children:[(0,t.jsx)("b",{children:"Eight Plus · pH 8+"}),(0,t.jsx)("i",{style:{height:72}})]}),(0,t.jsx)("div",{className:"phscale__bar"}),(0,t.jsx)("div",{className:"phscale__ticks","aria-hidden":"true",children:Array.from({length:15},(e,r)=>(0,t.jsx)("span",{children:r},r))})]}),(0,t.jsxs)("div",{className:"phlegend",children:[(0,t.jsxs)("div",{children:[(0,t.jsx)("b",{children:"Acidic"}),(0,t.jsx)("span",{children:"pH 0.0 – 6.9"})]}),(0,t.jsxs)("div",{children:[(0,t.jsx)("b",{children:"Neutral"}),(0,t.jsx)("span",{children:"pH 7.0"})]}),(0,t.jsxs)("div",{children:[(0,t.jsx)("b",{children:"Alkaline"}),(0,t.jsx)("span",{children:"pH 7.1 – 14.0"})]})]})]})}e.s(["default",()=>o])}]);