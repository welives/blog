import{y as Et,P as $t,d as Q,h as D,g as ie,j as Ge,o as P,b as ue,w as M,c as F,e as Me,T as qe,p as Lt,q as At,k as z,_ as Ot,an as St,ad as Je,D as Qe,I as B,n as k,r as se,m as _e,t as ve,ah as ye,ae as we,F as kt,M as et,a0 as tt,aj as Ht,aa as Pt,N as Rt,v as Re,ap as Nt,aq as Bt,ar as Vt,as as Mt,at as qt,au as Dt,av as Ft,aw as jt,ax as It,ay as Wt,Y as Ut,u as Yt,z as Kt,az as Xt,aA as Zt,aB as Gt}from"./chunks/framework.0ARc0mp4.js";import{t as Jt}from"./chunks/theme.B8X_xuFm.js";import{E as Qt}from"./chunks/ExampleSentence.Wtzh54-D.js";import{K as eo}from"./chunks/Kbd.O_mh5CxZ.js";import{N as to,E as oo,b as no,a as io}from"./chunks/NceTexts.2Jzrjt2Q.js";/*! medium-zoom 1.1.0 | MIT License | https://github.com/francoischalifour/medium-zoom */var G=Object.assign||function(e){for(var t=1;t<arguments.length;t++){var o=arguments[t];for(var i in o)Object.prototype.hasOwnProperty.call(o,i)&&(e[i]=o[i])}return e},he=function(t){return t.tagName==="IMG"},so=function(t){return NodeList.prototype.isPrototypeOf(t)},xe=function(t){return t&&t.nodeType===1},Ie=function(t){var o=t.currentSrc||t.src;return o.substr(-4).toLowerCase()===".svg"},We=function(t){try{return Array.isArray(t)?t.filter(he):so(t)?[].slice.call(t).filter(he):xe(t)?[t].filter(he):typeof t=="string"?[].slice.call(document.querySelectorAll(t)).filter(he):[]}catch{throw new TypeError(`The provided selector is invalid.
Expects a CSS selector, a Node element, a NodeList or an array.
See: https://github.com/francoischalifour/medium-zoom`)}},ro=function(t){var o=document.createElement("div");return o.classList.add("medium-zoom-overlay"),o.style.background=t,o},ao=function(t){var o=t.getBoundingClientRect(),i=o.top,n=o.left,s=o.width,r=o.height,a=t.cloneNode(),d=window.pageYOffset||document.documentElement.scrollTop||document.body.scrollTop||0,c=window.pageXOffset||document.documentElement.scrollLeft||document.body.scrollLeft||0;return a.removeAttribute("id"),a.style.position="absolute",a.style.top=i+d+"px",a.style.left=n+c+"px",a.style.width=s+"px",a.style.height=r+"px",a.style.transform="",a},ne=function(t,o){var i=G({bubbles:!1,cancelable:!1,detail:void 0},o);if(typeof window.CustomEvent=="function")return new CustomEvent(t,i);var n=document.createEvent("CustomEvent");return n.initCustomEvent(t,i.bubbles,i.cancelable,i.detail),n},lo=function e(t){var o=arguments.length>1&&arguments[1]!==void 0?arguments[1]:{},i=window.Promise||function(f){function v(){}f(v,v)},n=function(f){var v=f.target;if(v===K){p();return}T.indexOf(v)!==-1&&u({target:v})},s=function(){if(!($||!l.original)){var f=window.pageYOffset||document.documentElement.scrollTop||document.body.scrollTop||0;Math.abs(te-f)>_.scrollOffset&&setTimeout(p,150)}},r=function(f){var v=f.key||f.keyCode;(v==="Escape"||v==="Esc"||v===27)&&p()},a=function(){var f=arguments.length>0&&arguments[0]!==void 0?arguments[0]:{},v=f;if(f.background&&(K.style.background=f.background),f.container&&f.container instanceof Object&&(v.container=G({},_.container,f.container)),f.template){var C=xe(f.template)?f.template:document.querySelector(f.template);v.template=C}return _=G({},_,v),T.forEach(function(E){E.dispatchEvent(ne("medium-zoom:update",{detail:{zoom:L}}))}),L},d=function(){var f=arguments.length>0&&arguments[0]!==void 0?arguments[0]:{};return e(G({},_,f))},c=function(){for(var f=arguments.length,v=Array(f),C=0;C<f;C++)v[C]=arguments[C];var E=v.reduce(function(h,A){return[].concat(h,We(A))},[]);return E.filter(function(h){return T.indexOf(h)===-1}).forEach(function(h){T.push(h),h.classList.add("medium-zoom-image")}),H.forEach(function(h){var A=h.type,R=h.listener,oe=h.options;E.forEach(function(I){I.addEventListener(A,R,oe)})}),L},y=function(){for(var f=arguments.length,v=Array(f),C=0;C<f;C++)v[C]=arguments[C];l.zoomed&&p();var E=v.length>0?v.reduce(function(h,A){return[].concat(h,We(A))},[]):T;return E.forEach(function(h){h.classList.remove("medium-zoom-image"),h.dispatchEvent(ne("medium-zoom:detach",{detail:{zoom:L}}))}),T=T.filter(function(h){return E.indexOf(h)===-1}),L},m=function(f,v){var C=arguments.length>2&&arguments[2]!==void 0?arguments[2]:{};return T.forEach(function(E){E.addEventListener("medium-zoom:"+f,v,C)}),H.push({type:"medium-zoom:"+f,listener:v,options:C}),L},b=function(f,v){var C=arguments.length>2&&arguments[2]!==void 0?arguments[2]:{};return T.forEach(function(E){E.removeEventListener("medium-zoom:"+f,v,C)}),H=H.filter(function(E){return!(E.type==="medium-zoom:"+f&&E.listener.toString()===v.toString())}),L},w=function(){var f=arguments.length>0&&arguments[0]!==void 0?arguments[0]:{},v=f.target,C=function(){var h={width:document.documentElement.clientWidth,height:document.documentElement.clientHeight,left:0,top:0,right:0,bottom:0},A=void 0,R=void 0;if(_.container)if(_.container instanceof Object)h=G({},h,_.container),A=h.width-h.left-h.right-_.margin*2,R=h.height-h.top-h.bottom-_.margin*2;else{var oe=xe(_.container)?_.container:document.querySelector(_.container),I=oe.getBoundingClientRect(),Oe=I.width,ht=I.height,gt=I.left,vt=I.top;h=G({},h,{width:Oe,height:ht,left:gt,top:vt})}A=A||h.width-_.margin*2,R=R||h.height-_.margin*2;var de=l.zoomedHd||l.original,yt=Ie(de)?A:de.naturalWidth||A,wt=Ie(de)?R:de.naturalHeight||R,pe=de.getBoundingClientRect(),xt=pe.top,_t=pe.left,Se=pe.width,ke=pe.height,bt=Math.min(Math.max(Se,yt),A)/Se,Tt=Math.min(Math.max(ke,wt),R)/ke,He=Math.min(bt,Tt),Ct=(-_t+(A-Se)/2+_.margin+h.left)/He,zt=(-xt+(R-ke)/2+_.margin+h.top)/He,je="scale("+He+") translate3d("+Ct+"px, "+zt+"px, 0)";l.zoomed.style.transform=je,l.zoomedHd&&(l.zoomedHd.style.transform=je)};return new i(function(E){if(v&&T.indexOf(v)===-1){E(L);return}var h=function Oe(){$=!1,l.zoomed.removeEventListener("transitionend",Oe),l.original.dispatchEvent(ne("medium-zoom:opened",{detail:{zoom:L}})),E(L)};if(l.zoomed){E(L);return}if(v)l.original=v;else if(T.length>0){var A=T;l.original=A[0]}else{E(L);return}if(l.original.dispatchEvent(ne("medium-zoom:open",{detail:{zoom:L}})),te=window.pageYOffset||document.documentElement.scrollTop||document.body.scrollTop||0,$=!0,l.zoomed=ao(l.original),document.body.appendChild(K),_.template){var R=xe(_.template)?_.template:document.querySelector(_.template);l.template=document.createElement("div"),l.template.appendChild(R.content.cloneNode(!0)),document.body.appendChild(l.template)}if(l.original.parentElement&&l.original.parentElement.tagName==="PICTURE"&&l.original.currentSrc&&(l.zoomed.src=l.original.currentSrc),document.body.appendChild(l.zoomed),window.requestAnimationFrame(function(){document.body.classList.add("medium-zoom--opened")}),l.original.classList.add("medium-zoom-image--hidden"),l.zoomed.classList.add("medium-zoom-image--opened"),l.zoomed.addEventListener("click",p),l.zoomed.addEventListener("transitionend",h),l.original.getAttribute("data-zoom-src")){l.zoomedHd=l.zoomed.cloneNode(),l.zoomedHd.removeAttribute("srcset"),l.zoomedHd.removeAttribute("sizes"),l.zoomedHd.removeAttribute("loading"),l.zoomedHd.src=l.zoomed.getAttribute("data-zoom-src"),l.zoomedHd.onerror=function(){clearInterval(oe),console.warn("Unable to reach the zoom image target "+l.zoomedHd.src),l.zoomedHd=null,C()};var oe=setInterval(function(){l.zoomedHd.complete&&(clearInterval(oe),l.zoomedHd.classList.add("medium-zoom-image--opened"),l.zoomedHd.addEventListener("click",p),document.body.appendChild(l.zoomedHd),C())},10)}else if(l.original.hasAttribute("srcset")){l.zoomedHd=l.zoomed.cloneNode(),l.zoomedHd.removeAttribute("sizes"),l.zoomedHd.removeAttribute("loading");var I=l.zoomedHd.addEventListener("load",function(){l.zoomedHd.removeEventListener("load",I),l.zoomedHd.classList.add("medium-zoom-image--opened"),l.zoomedHd.addEventListener("click",p),document.body.appendChild(l.zoomedHd),C()})}else C()})},p=function(){return new i(function(f){if($||!l.original){f(L);return}var v=function C(){l.original.classList.remove("medium-zoom-image--hidden"),document.body.removeChild(l.zoomed),l.zoomedHd&&document.body.removeChild(l.zoomedHd),document.body.removeChild(K),l.zoomed.classList.remove("medium-zoom-image--opened"),l.template&&document.body.removeChild(l.template),$=!1,l.zoomed.removeEventListener("transitionend",C),l.original.dispatchEvent(ne("medium-zoom:closed",{detail:{zoom:L}})),l.original=null,l.zoomed=null,l.zoomedHd=null,l.template=null,f(L)};$=!0,document.body.classList.remove("medium-zoom--opened"),l.zoomed.style.transform="",l.zoomedHd&&(l.zoomedHd.style.transform=""),l.template&&(l.template.style.transition="opacity 150ms",l.template.style.opacity=0),l.original.dispatchEvent(ne("medium-zoom:close",{detail:{zoom:L}})),l.zoomed.addEventListener("transitionend",v)})},u=function(){var f=arguments.length>0&&arguments[0]!==void 0?arguments[0]:{},v=f.target;return l.original?p():w({target:v})},g=function(){return _},x=function(){return T},S=function(){return l.original},T=[],H=[],$=!1,te=0,_=o,l={original:null,zoomed:null,zoomedHd:null,template:null};Object.prototype.toString.call(t)==="[object Object]"?_=t:(t||typeof t=="string")&&c(t),_=G({margin:0,background:"#fff",scrollOffset:40,container:null,template:null},_);var K=ro(_.background);document.addEventListener("click",n),document.addEventListener("keyup",r),document.addEventListener("scroll",s),window.addEventListener("resize",p);var L={open:w,close:p,toggle:u,update:a,clone:d,attach:c,detach:y,on:m,off:b,getOptions:g,getImages:x,getZoomedImage:S};return L};function co(e,t){t===void 0&&(t={});var o=t.insertAt;if(!(!e||typeof document>"u")){var i=document.head||document.getElementsByTagName("head")[0],n=document.createElement("style");n.type="text/css",o==="top"&&i.firstChild?i.insertBefore(n,i.firstChild):i.appendChild(n),n.styleSheet?n.styleSheet.cssText=e:n.appendChild(document.createTextNode(e))}}var uo=".medium-zoom-overlay{position:fixed;top:0;right:0;bottom:0;left:0;opacity:0;transition:opacity .3s;will-change:opacity}.medium-zoom--opened .medium-zoom-overlay{cursor:pointer;cursor:zoom-out;opacity:1}.medium-zoom-image{cursor:pointer;cursor:zoom-in;transition:transform .3s cubic-bezier(.2,0,.2,1)!important}.medium-zoom-image--hidden{visibility:hidden}.medium-zoom-image--opened{position:relative;cursor:pointer;cursor:zoom-out;will-change:transform}";co(uo);const mo=lo,fo=Symbol("mediumZoom");function po(e,t){const o=mo();o.refresh=()=>{o.detach(),o.attach(":not(a) > img:not(.image-src)")},e.provide(fo,o),Et(()=>t.route.path,()=>$t(()=>o.refresh()))}const ho=e=>(Lt("data-v-80708a93"),e=e(),At(),e),go=ho(()=>z("svg",{class:"icon-top",viewBox:"0 0 48 48",fill:"none",xmlns:"http://www.w3.org/2000/svg",stroke:"currentColor","stroke-width":"4","stroke-linecap":"butt","stroke-linejoin":"miter"},[z("path",{d:"M39.6 30.557 24.043 15 8.487 30.557"})],-1)),vo=[go],yo=Q({__name:"BackToTop",props:{threshold:{default:300}},setup(e){const t=e,o=D(0),i=ie(()=>o.value>t.threshold);Ge(()=>{o.value=n(),window.addEventListener("scroll",r(()=>{o.value=n()},100))});function n(){return window.pageYOffset||document.documentElement.scrollTop||document.body.scrollTop||0}function s(){window.scrollTo({top:0,behavior:"smooth"}),o.value=0}function r(a,d=100){let c;return(...y)=>{clearTimeout(c),c=setTimeout(()=>{a.apply(null,y)},d)}}return(a,d)=>(P(),ue(qe,{name:"fade"},{default:M(()=>[i.value?(P(),F("div",{key:0,class:"go-to-top",onClick:s},vo)):Me("",!0)]),_:1}))}}),wo=Ot(yo,[["__scopeId","data-v-80708a93"]]),xo=e=>{typeof window>"u"||window.addEventListener("load",()=>{const t=document.createElement("div");document.body.appendChild(t),St(Je(wo,{threshold:e==null?void 0:e.threshold}),t)})};function X(e,t,o="DemoPreview"){e.component(o,t)}const Pe="el",_o="is-",Z=(e,t,o,i,n)=>{let s=`${e}-${t}`;return o&&(s+=`-${o}`),i&&(s+=`__${i}`),n&&(s+=`--${n}`),s},bo=Symbol("namespaceContextKey"),To=e=>{const t=e||(Pt()?Rt(bo,D(Pe)):D(Pe));return ie(()=>_e(t)||Pe)},Co=(e,t)=>{const o=To(t);return{namespace:o,b:(u="")=>Z(o.value,e,u,"",""),e:u=>u?Z(o.value,e,"",u,""):"",m:u=>u?Z(o.value,e,"","",u):"",be:(u,g)=>u&&g?Z(o.value,e,u,g,""):"",em:(u,g)=>u&&g?Z(o.value,e,"",u,g):"",bm:(u,g)=>u&&g?Z(o.value,e,u,"",g):"",bem:(u,g,x)=>u&&g&&x?Z(o.value,e,u,g,x):"",is:(u,...g)=>{const x=g.length>=1?g[0]:!0;return u&&x?`${_o}${u}`:""},cssVar:u=>{const g={};for(const x in u)u[x]&&(g[`--${o.value}-${x}`]=u[x]);return g},cssVarName:u=>`--${o.value}-${u}`,cssVarBlock:u=>{const g={};for(const x in u)u[x]&&(g[`--${o.value}-${e}-${x}`]=u[x]);return g},cssVarBlockName:u=>`--${o.value}-${e}-${u}`}},zo=Q({name:"CollapseTransition",__name:"CollapseTransition",setup(e){const t=Co("collapse-transition"),o=n=>{n.style.maxHeight="",n.style.overflow=n.dataset.oldOverflow,n.style.paddingTop=n.dataset.oldPaddingTop,n.style.paddingBottom=n.dataset.oldPaddingBottom},i={beforeEnter(n){n.dataset||(n.dataset={}),n.dataset.oldPaddingTop=n.style.paddingTop,n.dataset.oldPaddingBottom=n.style.paddingBottom,n.style.maxHeight=0,n.style.paddingTop=0,n.style.paddingBottom=0},enter(n){n.dataset.oldOverflow=n.style.overflow,n.scrollHeight!==0?n.style.maxHeight=`${n.scrollHeight}px`:n.style.maxHeight=0,n.style.paddingTop=n.dataset.oldPaddingTop,n.style.paddingBottom=n.dataset.oldPaddingBottom,n.style.overflow="hidden"},afterEnter(n){n.style.maxHeight="",n.style.overflow=n.dataset.oldOverflow},enterCancelled(n){o(n)},beforeLeave(n){n.dataset||(n.dataset={}),n.dataset.oldPaddingTop=n.style.paddingTop,n.dataset.oldPaddingBottom=n.style.paddingBottom,n.dataset.oldOverflow=n.style.overflow,n.style.maxHeight=`${n.scrollHeight}px`,n.style.overflow="hidden"},leave(n){n.scrollHeight!==0&&(n.style.maxHeight=0,n.style.paddingTop=0,n.style.paddingBottom=0)},afterLeave(n){o(n)},leaveCancelled(n){o(n)}};return(n,s)=>(P(),ue(qe,et({name:_e(t).b()},tt(i)),{default:M(()=>[se(n.$slots,"default")]),_:3},16,["name"]))}}),Ne=Math.min,re=Math.max,be=Math.round,W=e=>({x:e,y:e}),Eo={left:"right",right:"left",bottom:"top",top:"bottom"},$o={start:"end",end:"start"};function Ue(e,t,o){return re(e,Ne(t,o))}function ze(e,t){return typeof e=="function"?e(t):e}function J(e){return e.split("-")[0]}function Ee(e){return e.split("-")[1]}function ot(e){return e==="x"?"y":"x"}function nt(e){return e==="y"?"height":"width"}function $e(e){return["top","bottom"].includes(J(e))?"y":"x"}function it(e){return ot($e(e))}function Lo(e,t,o){o===void 0&&(o=!1);const i=Ee(e),n=it(e),s=nt(n);let r=n==="x"?i===(o?"end":"start")?"right":"left":i==="start"?"bottom":"top";return t.reference[s]>t.floating[s]&&(r=Te(r)),[r,Te(r)]}function Ao(e){const t=Te(e);return[Be(e),t,Be(t)]}function Be(e){return e.replace(/start|end/g,t=>$o[t])}function Oo(e,t,o){const i=["left","right"],n=["right","left"],s=["top","bottom"],r=["bottom","top"];switch(e){case"top":case"bottom":return o?t?n:i:t?i:n;case"left":case"right":return t?s:r;default:return[]}}function So(e,t,o,i){const n=Ee(e);let s=Oo(J(e),o==="start",i);return n&&(s=s.map(r=>r+"-"+n),t&&(s=s.concat(s.map(Be)))),s}function Te(e){return e.replace(/left|right|bottom|top/g,t=>Eo[t])}function ko(e){return{top:0,right:0,bottom:0,left:0,...e}}function Ho(e){return typeof e!="number"?ko(e):{top:e,right:e,bottom:e,left:e}}function Ce(e){return{...e,top:e.y,left:e.x,right:e.x+e.width,bottom:e.y+e.height}}function Ye(e,t,o){let{reference:i,floating:n}=e;const s=$e(t),r=it(t),a=nt(r),d=J(t),c=s==="y",y=i.x+i.width/2-n.width/2,m=i.y+i.height/2-n.height/2,b=i[a]/2-n[a]/2;let w;switch(d){case"top":w={x:y,y:i.y-n.height};break;case"bottom":w={x:y,y:i.y+i.height};break;case"right":w={x:i.x+i.width,y:m};break;case"left":w={x:i.x-n.width,y:m};break;default:w={x:i.x,y:i.y}}switch(Ee(t)){case"start":w[r]-=b*(o&&c?-1:1);break;case"end":w[r]+=b*(o&&c?-1:1);break}return w}const Po=async(e,t,o)=>{const{placement:i="bottom",strategy:n="absolute",middleware:s=[],platform:r}=o,a=s.filter(Boolean),d=await(r.isRTL==null?void 0:r.isRTL(t));let c=await r.getElementRects({reference:e,floating:t,strategy:n}),{x:y,y:m}=Ye(c,i,d),b=i,w={},p=0;for(let u=0;u<a.length;u++){const{name:g,fn:x}=a[u],{x:S,y:T,data:H,reset:$}=await x({x:y,y:m,initialPlacement:i,placement:b,strategy:n,middlewareData:w,rects:c,platform:r,elements:{reference:e,floating:t}});if(y=S??y,m=T??m,w={...w,[g]:{...w[g],...H}},$&&p<=50){p++,typeof $=="object"&&($.placement&&(b=$.placement),$.rects&&(c=$.rects===!0?await r.getElementRects({reference:e,floating:t,strategy:n}):$.rects),{x:y,y:m}=Ye(c,b,d)),u=-1;continue}}return{x:y,y:m,placement:b,strategy:n,middlewareData:w}};async function st(e,t){var o;t===void 0&&(t={});const{x:i,y:n,platform:s,rects:r,elements:a,strategy:d}=e,{boundary:c="clippingAncestors",rootBoundary:y="viewport",elementContext:m="floating",altBoundary:b=!1,padding:w=0}=ze(t,e),p=Ho(w),g=a[b?m==="floating"?"reference":"floating":m],x=Ce(await s.getClippingRect({element:(o=await(s.isElement==null?void 0:s.isElement(g)))==null||o?g:g.contextElement||await(s.getDocumentElement==null?void 0:s.getDocumentElement(a.floating)),boundary:c,rootBoundary:y,strategy:d})),S=m==="floating"?{...r.floating,x:i,y:n}:r.reference,T=await(s.getOffsetParent==null?void 0:s.getOffsetParent(a.floating)),H=await(s.isElement==null?void 0:s.isElement(T))?await(s.getScale==null?void 0:s.getScale(T))||{x:1,y:1}:{x:1,y:1},$=Ce(s.convertOffsetParentRelativeRectToViewportRelativeRect?await s.convertOffsetParentRelativeRectToViewportRelativeRect({rect:S,offsetParent:T,strategy:d}):S);return{top:(x.top-$.top+p.top)/H.y,bottom:($.bottom-x.bottom+p.bottom)/H.y,left:(x.left-$.left+p.left)/H.x,right:($.right-x.right+p.right)/H.x}}const Ro=function(e){return e===void 0&&(e={}),{name:"flip",options:e,async fn(t){var o,i;const{placement:n,middlewareData:s,rects:r,initialPlacement:a,platform:d,elements:c}=t,{mainAxis:y=!0,crossAxis:m=!0,fallbackPlacements:b,fallbackStrategy:w="bestFit",fallbackAxisSideDirection:p="none",flipAlignment:u=!0,...g}=ze(e,t);if((o=s.arrow)!=null&&o.alignmentOffset)return{};const x=J(n),S=J(a)===a,T=await(d.isRTL==null?void 0:d.isRTL(c.floating)),H=b||(S||!u?[Te(a)]:Ao(a));!b&&p!=="none"&&H.push(...So(a,u,p,T));const $=[a,...H],te=await st(t,g),_=[];let l=((i=s.flip)==null?void 0:i.overflows)||[];if(y&&_.push(te[x]),m){const f=Lo(n,r,T);_.push(te[f[0]],te[f[1]])}if(l=[...l,{placement:n,overflows:_}],!_.every(f=>f<=0)){var K,L;const f=(((K=s.flip)==null?void 0:K.index)||0)+1,v=$[f];if(v)return{data:{index:f,overflows:l},reset:{placement:v}};let C=(L=l.filter(E=>E.overflows[0]<=0).sort((E,h)=>E.overflows[1]-h.overflows[1])[0])==null?void 0:L.placement;if(!C)switch(w){case"bestFit":{var O;const E=(O=l.map(h=>[h.placement,h.overflows.filter(A=>A>0).reduce((A,R)=>A+R,0)]).sort((h,A)=>h[1]-A[1])[0])==null?void 0:O[0];E&&(C=E);break}case"initialPlacement":C=a;break}if(n!==C)return{reset:{placement:C}}}return{}}}};async function No(e,t){const{placement:o,platform:i,elements:n}=e,s=await(i.isRTL==null?void 0:i.isRTL(n.floating)),r=J(o),a=Ee(o),d=$e(o)==="y",c=["left","top"].includes(r)?-1:1,y=s&&d?-1:1,m=ze(t,e);let{mainAxis:b,crossAxis:w,alignmentAxis:p}=typeof m=="number"?{mainAxis:m,crossAxis:0,alignmentAxis:null}:{mainAxis:0,crossAxis:0,alignmentAxis:null,...m};return a&&typeof p=="number"&&(w=a==="end"?p*-1:p),d?{x:w*y,y:b*c}:{x:b*c,y:w*y}}const Bo=function(e){return e===void 0&&(e=0),{name:"offset",options:e,async fn(t){const{x:o,y:i}=t,n=await No(t,e);return{x:o+n.x,y:i+n.y,data:n}}}},Vo=function(e){return e===void 0&&(e={}),{name:"shift",options:e,async fn(t){const{x:o,y:i,placement:n}=t,{mainAxis:s=!0,crossAxis:r=!1,limiter:a={fn:g=>{let{x,y:S}=g;return{x,y:S}}},...d}=ze(e,t),c={x:o,y:i},y=await st(t,d),m=$e(J(n)),b=ot(m);let w=c[b],p=c[m];if(s){const g=b==="y"?"top":"left",x=b==="y"?"bottom":"right",S=w+y[g],T=w-y[x];w=Ue(S,w,T)}if(r){const g=m==="y"?"top":"left",x=m==="y"?"bottom":"right",S=p+y[g],T=p-y[x];p=Ue(S,p,T)}const u=a.fn({...t,[b]:w,[m]:p});return{...u,data:{x:u.x-o,y:u.y-i}}}}};function U(e){return rt(e)?(e.nodeName||"").toLowerCase():"#document"}function N(e){var t;return(e==null||(t=e.ownerDocument)==null?void 0:t.defaultView)||window}function Y(e){var t;return(t=(rt(e)?e.ownerDocument:e.document)||window.document)==null?void 0:t.documentElement}function rt(e){return e instanceof Node||e instanceof N(e).Node}function j(e){return e instanceof Element||e instanceof N(e).Element}function q(e){return e instanceof HTMLElement||e instanceof N(e).HTMLElement}function Ke(e){return typeof ShadowRoot>"u"?!1:e instanceof ShadowRoot||e instanceof N(e).ShadowRoot}function fe(e){const{overflow:t,overflowX:o,overflowY:i,display:n}=V(e);return/auto|scroll|overlay|hidden|clip/.test(t+i+o)&&!["inline","contents"].includes(n)}function Mo(e){return["table","td","th"].includes(U(e))}function De(e){const t=Fe(),o=V(e);return o.transform!=="none"||o.perspective!=="none"||(o.containerType?o.containerType!=="normal":!1)||!t&&(o.backdropFilter?o.backdropFilter!=="none":!1)||!t&&(o.filter?o.filter!=="none":!1)||["transform","perspective","filter"].some(i=>(o.willChange||"").includes(i))||["paint","layout","strict","content"].some(i=>(o.contain||"").includes(i))}function qo(e){let t=ce(e);for(;q(t)&&!Le(t);){if(De(t))return t;t=ce(t)}return null}function Fe(){return typeof CSS>"u"||!CSS.supports?!1:CSS.supports("-webkit-backdrop-filter","none")}function Le(e){return["html","body","#document"].includes(U(e))}function V(e){return N(e).getComputedStyle(e)}function Ae(e){return j(e)?{scrollLeft:e.scrollLeft,scrollTop:e.scrollTop}:{scrollLeft:e.pageXOffset,scrollTop:e.pageYOffset}}function ce(e){if(U(e)==="html")return e;const t=e.assignedSlot||e.parentNode||Ke(e)&&e.host||Y(e);return Ke(t)?t.host:t}function at(e){const t=ce(e);return Le(t)?e.ownerDocument?e.ownerDocument.body:e.body:q(t)&&fe(t)?t:at(t)}function Ve(e,t,o){var i;t===void 0&&(t=[]),o===void 0&&(o=!0);const n=at(e),s=n===((i=e.ownerDocument)==null?void 0:i.body),r=N(n);return s?t.concat(r,r.visualViewport||[],fe(n)?n:[],r.frameElement&&o?Ve(r.frameElement):[]):t.concat(n,Ve(n,[],o))}function lt(e){const t=V(e);let o=parseFloat(t.width)||0,i=parseFloat(t.height)||0;const n=q(e),s=n?e.offsetWidth:o,r=n?e.offsetHeight:i,a=be(o)!==s||be(i)!==r;return a&&(o=s,i=r),{width:o,height:i,$:a}}function ct(e){return j(e)?e:e.contextElement}function ae(e){const t=ct(e);if(!q(t))return W(1);const o=t.getBoundingClientRect(),{width:i,height:n,$:s}=lt(t);let r=(s?be(o.width):o.width)/i,a=(s?be(o.height):o.height)/n;return(!r||!Number.isFinite(r))&&(r=1),(!a||!Number.isFinite(a))&&(a=1),{x:r,y:a}}const Do=W(0);function dt(e){const t=N(e);return!Fe()||!t.visualViewport?Do:{x:t.visualViewport.offsetLeft,y:t.visualViewport.offsetTop}}function Fo(e,t,o){return t===void 0&&(t=!1),!o||t&&o!==N(e)?!1:t}function me(e,t,o,i){t===void 0&&(t=!1),o===void 0&&(o=!1);const n=e.getBoundingClientRect(),s=ct(e);let r=W(1);t&&(i?j(i)&&(r=ae(i)):r=ae(e));const a=Fo(s,o,i)?dt(s):W(0);let d=(n.left+a.x)/r.x,c=(n.top+a.y)/r.y,y=n.width/r.x,m=n.height/r.y;if(s){const b=N(s),w=i&&j(i)?N(i):i;let p=b.frameElement;for(;p&&i&&w!==b;){const u=ae(p),g=p.getBoundingClientRect(),x=V(p),S=g.left+(p.clientLeft+parseFloat(x.paddingLeft))*u.x,T=g.top+(p.clientTop+parseFloat(x.paddingTop))*u.y;d*=u.x,c*=u.y,y*=u.x,m*=u.y,d+=S,c+=T,p=N(p).frameElement}}return Ce({width:y,height:m,x:d,y:c})}function jo(e){let{rect:t,offsetParent:o,strategy:i}=e;const n=q(o),s=Y(o);if(o===s)return t;let r={scrollLeft:0,scrollTop:0},a=W(1);const d=W(0);if((n||!n&&i!=="fixed")&&((U(o)!=="body"||fe(s))&&(r=Ae(o)),q(o))){const c=me(o);a=ae(o),d.x=c.x+o.clientLeft,d.y=c.y+o.clientTop}return{width:t.width*a.x,height:t.height*a.y,x:t.x*a.x-r.scrollLeft*a.x+d.x,y:t.y*a.y-r.scrollTop*a.y+d.y}}function Io(e){return Array.from(e.getClientRects())}function ut(e){return me(Y(e)).left+Ae(e).scrollLeft}function Wo(e){const t=Y(e),o=Ae(e),i=e.ownerDocument.body,n=re(t.scrollWidth,t.clientWidth,i.scrollWidth,i.clientWidth),s=re(t.scrollHeight,t.clientHeight,i.scrollHeight,i.clientHeight);let r=-o.scrollLeft+ut(e);const a=-o.scrollTop;return V(i).direction==="rtl"&&(r+=re(t.clientWidth,i.clientWidth)-n),{width:n,height:s,x:r,y:a}}function Uo(e,t){const o=N(e),i=Y(e),n=o.visualViewport;let s=i.clientWidth,r=i.clientHeight,a=0,d=0;if(n){s=n.width,r=n.height;const c=Fe();(!c||c&&t==="fixed")&&(a=n.offsetLeft,d=n.offsetTop)}return{width:s,height:r,x:a,y:d}}function Yo(e,t){const o=me(e,!0,t==="fixed"),i=o.top+e.clientTop,n=o.left+e.clientLeft,s=q(e)?ae(e):W(1),r=e.clientWidth*s.x,a=e.clientHeight*s.y,d=n*s.x,c=i*s.y;return{width:r,height:a,x:d,y:c}}function Xe(e,t,o){let i;if(t==="viewport")i=Uo(e,o);else if(t==="document")i=Wo(Y(e));else if(j(t))i=Yo(t,o);else{const n=dt(e);i={...t,x:t.x-n.x,y:t.y-n.y}}return Ce(i)}function mt(e,t){const o=ce(e);return o===t||!j(o)||Le(o)?!1:V(o).position==="fixed"||mt(o,t)}function Ko(e,t){const o=t.get(e);if(o)return o;let i=Ve(e,[],!1).filter(a=>j(a)&&U(a)!=="body"),n=null;const s=V(e).position==="fixed";let r=s?ce(e):e;for(;j(r)&&!Le(r);){const a=V(r),d=De(r);!d&&a.position==="fixed"&&(n=null),(s?!d&&!n:!d&&a.position==="static"&&!!n&&["absolute","fixed"].includes(n.position)||fe(r)&&!d&&mt(e,r))?i=i.filter(y=>y!==r):n=a,r=ce(r)}return t.set(e,i),i}function Xo(e){let{element:t,boundary:o,rootBoundary:i,strategy:n}=e;const r=[...o==="clippingAncestors"?Ko(t,this._c):[].concat(o),i],a=r[0],d=r.reduce((c,y)=>{const m=Xe(t,y,n);return c.top=re(m.top,c.top),c.right=Ne(m.right,c.right),c.bottom=Ne(m.bottom,c.bottom),c.left=re(m.left,c.left),c},Xe(t,a,n));return{width:d.right-d.left,height:d.bottom-d.top,x:d.left,y:d.top}}function Zo(e){return lt(e)}function Go(e,t,o){const i=q(t),n=Y(t),s=o==="fixed",r=me(e,!0,s,t);let a={scrollLeft:0,scrollTop:0};const d=W(0);if(i||!i&&!s)if((U(t)!=="body"||fe(n))&&(a=Ae(t)),i){const c=me(t,!0,s,t);d.x=c.x+t.clientLeft,d.y=c.y+t.clientTop}else n&&(d.x=ut(n));return{x:r.left+a.scrollLeft-d.x,y:r.top+a.scrollTop-d.y,width:r.width,height:r.height}}function Ze(e,t){return!q(e)||V(e).position==="fixed"?null:t?t(e):e.offsetParent}function ft(e,t){const o=N(e);if(!q(e))return o;let i=Ze(e,t);for(;i&&Mo(i)&&V(i).position==="static";)i=Ze(i,t);return i&&(U(i)==="html"||U(i)==="body"&&V(i).position==="static"&&!De(i))?o:i||qo(e)||o}const Jo=async function(e){let{reference:t,floating:o,strategy:i}=e;const n=this.getOffsetParent||ft,s=this.getDimensions;return{reference:Go(t,await n(o),i),floating:{x:0,y:0,...await s(o)}}};function Qo(e){return V(e).direction==="rtl"}const en={convertOffsetParentRelativeRectToViewportRelativeRect:jo,getDocumentElement:Y,getClippingRect:Xo,getOffsetParent:ft,getElementRects:Jo,getClientRects:Io,getDimensions:Zo,getScale:ae,isElement:j,isRTL:Qo},tn=(e,t,o)=>{const i=new Map,n={platform:en,...o},s={...n.platform,_c:i};return Po(e,t,{...n,platform:s})},on=Q({name:"Tooltip",__name:"Tooltip",props:{placement:{},content:{}},setup(e){const t=e,o=D(),i=D(),n=D(!1),s=()=>{tn(o.value,i.value,{placement:t.placement,middleware:[Bo(10),Ro(),Vo()]}).then(({x:c,y})=>{Object.assign(i.value.style,{left:0,top:0,transform:`translate(${c}px, ${y}px)`,willChange:"transform",pointerEvents:"none"})})},r=()=>{n.value=!0,s()},a=()=>{n.value=!1},d={mouseenter:r,mouseleave:a,focus:r,blur:a};return(c,y)=>(P(),F("div",{class:k(c.$style["example-tooltip"])},[z("div",et({ref_key:"reference",ref:o},tt(d,!0)),[se(c.$slots,"default")],16),we(z("div",{ref_key:"floating",ref:i,class:k([c.$style["example-tooltip-content"]])},ve(c.content),3),[[ye,n.value]])],2))}}),nn="_dark_18ews_24",sn={"example-tooltip":"_example-tooltip_18ews_2","example-tooltip-content":"_example-tooltip-content_18ews_6",dark:nn},ee=(e,t)=>{const o=e.__vccOpts||e;for(const[i,n]of t)o[i]=n;return o},rn={$style:sn},ge=ee(on,[["__cssModules",rn]]),an=["href"],ln=z("svg",{version:"1.1",id:"Layer_1",xmlns:"http://www.w3.org/2000/svg","xmlns:xlink":"http://www.w3.org/1999/xlink",widht:"16",height:"16",viewBox:"0 0 1024 1024","xml:space":"preserve"},[z("g",null,[z("path",{d:"M1004.57 319.408l-468-312c-15.974-9.83-33.022-9.92-49.142 0l-468 312C7.428 327.406 0 341.694 0 355.978v311.998c0 14.286 7.428 28.572 19.43 36.572l468 312.044c15.974 9.83 33.022 9.92 49.142 0l468-312.044c12-7.998 19.43-22.286 19.43-36.572V355.978c-0.002-14.284-7.43-28.572-19.432-36.57zM556 126.262l344.572 229.716-153.714 102.858L556 331.406V126.262z m-88 0v205.144l-190.858 127.43-153.714-102.858L468 126.262zM88 438.264l110.286 73.714L88 585.692v-147.428z m380 459.43L123.428 667.978l153.714-102.858L468 692.55v205.144z m44-281.716l-155.43-104 155.43-104 155.43 104-155.43 104z m44 281.716V692.55l190.858-127.43 153.714 102.858L556 897.694z m380-312.002l-110.286-73.714L936 438.264v147.428z","p-id":"2793",fill:"#555"})])],-1),cn=[ln],dn="https://play.vuejs.org/",un=Q({__name:"SfcPlayground",props:{code:{}},setup(e){const t=e,o=ie(()=>{const i={"App.vue":t.code};return`${dn}#${btoa(unescape(encodeURIComponent(JSON.stringify(i))))}`});return(i,n)=>(P(),F("a",{href:o.value,target:"_blank"},cn,8,an))}}),mn={},fn={xmlns:"http://www.w3.org/2000/svg",width:"17",height:"17",viewBox:"0 0 24 24"},pn=z("path",{fill:"#666",d:"M5 19h2q.425 0 .713.288T8 20q0 .425-.288.713T7 21H4q-.425 0-.712-.288T3 20v-3q0-.425.288-.712T4 16q.425 0 .713.288T5 17zm14 0v-2q0-.425.288-.712T20 16q.425 0 .713.288T21 17v3q0 .425-.288.713T20 21h-3q-.425 0-.712-.288T16 20q0-.425.288-.712T17 19zM5 5v2q0 .425-.288.713T4 8q-.425 0-.712-.288T3 7V4q0-.425.288-.712T4 3h3q.425 0 .713.288T8 4q0 .425-.288.713T7 5zm14 0h-2q-.425 0-.712-.288T16 4q0-.425.288-.712T17 3h3q.425 0 .713.288T21 4v3q0 .425-.288.713T20 8q-.425 0-.712-.288T19 7z"},null,-1),hn=[pn];function gn(e,t){return P(),F("svg",fn,hn)}const vn=ee(mn,[["render",gn]]),yn={},wn={t:"1596458734865",class:"icon",viewBox:"0 0 1024 1024",version:"1.1",xmlns:"http://www.w3.org/2000/svg","p-id":"4898","xmlns:xlink":"http://www.w3.org/1999/xlink",width:"14",height:"14"},xn=z("path",{d:"M68.608 962.56V206.848h740.864V962.56H68.608zM746.496 271.36H131.584v629.248h614.912V271.36zM131.584 262.144","p-id":"4899",fill:"#666"},null,-1),_n=z("path",{d:"M219.136 65.024v116.224h62.976V129.536h614.912v629.248h-60.416v61.952h123.392V65.024z","p-id":"4900",fill:"#666"},null,-1),bn=[xn,_n];function Tn(e,t){return P(),F("svg",wn,bn)}const Cn=ee(yn,[["render",Tn]]),zn={},En={t:"1596458647160",class:"icon",viewBox:"0 0 1024 1024",version:"1.1",xmlns:"http://www.w3.org/2000/svg","p-id":"2840","xmlns:xlink":"http://www.w3.org/1999/xlink",width:"18",height:"18"},$n=z("path",{d:"M311.1 739c-6.1 0-12.2-2.3-16.8-7L69.7 507.4l224.6-224.6c9.3-9.3 24.3-9.3 33.6 0s9.3 24.3 0 33.6l-191 191 191 191c9.3 9.3 9.3 24.3 0 33.6-4.6 4.7-10.7 7-16.8 7zM711.5 739c-6.1 0-12.2-2.3-16.8-7-9.3-9.3-9.3-24.3 0-33.6l191-191-191-191c-9.3-9.3-9.3-24.3 0-33.6s24.3-9.3 33.6 0L953 507.4 728.3 732c-4.6 4.7-10.7 7-16.8 7zM418.5 814.7c-2.4 0-4.8-0.4-7.2-1.1-12.5-4-19.4-17.3-15.5-29.8l179.6-567.1c4-12.5 17.3-19.4 29.8-15.5 12.5 4 19.4 17.3 15.5 29.8L441.1 798.1a23.73 23.73 0 0 1-22.6 16.6z",fill:"#666","p-id":"2841"},null,-1),Ln=[$n];function An(e,t){return P(),F("svg",En,Ln)}const On=ee(zn,[["render",An]]);function Sn(e){const t=D(!1);return{copyTip:t,copyCode:()=>{navigator.clipboard.writeText(e),t.value=!0,setTimeout(()=>{t.value=!1},2*1e3)}}}const kn={},Hn={xmlns:"http://www.w3.org/2000/svg",width:"32",height:"32",viewBox:"0 0 24 24"},Pn=z("path",{fill:"currentColor",d:"m12 13.4l2.9 2.9q.275.275.7.275t.7-.275q.275-.275.275-.7t-.275-.7L13.4 12l2.9-2.9q.275-.275.275-.7t-.275-.7q-.275-.275-.7-.275t-.7.275L12 10.6L9.1 7.7q-.275-.275-.7-.275t-.7.275q-.275.275-.275.7t.275.7l2.9 2.9l-2.9 2.9q-.275.275-.275.7t.275.7q.275.275.7.275t.7-.275zm0 8.6q-2.075 0-3.9-.788t-3.175-2.137q-1.35-1.35-2.137-3.175T2 12q0-2.075.788-3.9t2.137-3.175q1.35-1.35 3.175-2.137T12 2q2.075 0 3.9.788t3.175 2.137q1.35 1.35 2.138 3.175T22 12q0 2.075-.788 3.9t-2.137 3.175q-1.35 1.35-3.175 2.138T12 22"},null,-1),Rn=[Pn];function Nn(e,t){return P(),F("svg",Hn,Rn)}const Bn=ee(kn,[["render",Nn]]),Vn=Q({__name:"DemoFullScreenPreview",props:{modelValue:{type:Boolean}},emits:["update:modelValue"],setup(e,{emit:t}){const o=t,i=()=>{o("update:modelValue",!1)};return(n,s)=>{const r=Qe("ClientOnly");return n.modelValue?(P(),ue(r,{key:0},{default:M(()=>[(P(),ue(Ht,{to:"body"},[z("div",{class:k([n.$style["example-modal"]])},null,2),z("section",{class:k(n.$style.example)},[z("div",{class:k(n.$style["example-showcase"])},[se(n.$slots,"default")],2)],2),z("div",{class:k([n.$style["example-close"]]),onClick:i},[B(Bn)],2)]))]),_:3})):Me("",!0)}}}),Mn="_example_11dtw_2",qn={"example-modal":"_example-modal_11dtw_2",example:Mn,"example-showcase":"_example-showcase_11dtw_25","example-close":"_example-close_11dtw_30"},Dn={$style:qn},Fn=ee(Vn,[["__cssModules",Dn]]),jn={class:"lang"},In=["innerHTML"],Wn=Q({name:"DemoPreview",__name:"DemoPreview",props:{lang:{default:"vue"},source:{},isFile:{type:Boolean,default:!1},hlSource:{default:""}},setup(e){const t=e,o=ie(()=>({"view-source":"查看源代码","hide-source":"隐藏源代码","edit-in-playground":"在 Playground 中编辑","full-screen":"全屏预览","copy-code":"复制代码","copy-success":"复制成功"})),i=ie(()=>decodeURIComponent(t.source)),n=ie(()=>decodeURIComponent(t.hlSource)),s=D(!1),r=()=>{s.value=!0},a=D(!1),d=()=>{a.value=!a.value},{copyTip:c,copyCode:y}=Sn(i.value);return(m,b)=>{const w=Qe("ClientOnly");return P(),F(kt,null,[B(w,null,{default:M(()=>[z("section",{class:k([m.$style.example])},[z("div",{class:k(m.$style["example-showcase"])},[se(m.$slots,"default")],2),z("div",{class:k(m.$style["example-divider--horizontal"])},null,2),z("div",{class:k(m.$style["example-actions"])},[B(ge,{placement:"top",content:o.value["edit-in-playground"]},{default:M(()=>[m.lang==="vue"?(P(),ue(un,{key:0,style:{cursor:"pointer"},code:i.value},null,8,["code"])):Me("",!0)]),_:1},8,["content"]),z("div",{class:k(m.$style["example-actions--right"])},[B(ge,{placement:"top",content:o.value["full-screen"]},{default:M(()=>[B(vn,{style:{cursor:"pointer"},onClick:r})]),_:1},8,["content"]),B(ge,{placement:"top",content:o.value["copy-code"]},{default:M(()=>[B(Cn,{style:{cursor:"pointer"},onClick:_e(y)},null,8,["onClick"])]),_:1},8,["content"]),B(ge,{placement:"top",content:o.value["view-source"]},{default:M(()=>[B(On,{style:{cursor:"pointer"},onClick:d})]),_:1},8,["content"])],2),we(z("span",{class:k(m.$style["example-actions-tip"])},ve(o.value["copy-success"]),3),[[ye,_e(c)]])],2),B(zo,null,{default:M(()=>[we(z("div",{class:k(m.$style["example-source-wrapper"])},[m.isFile?(P(),F("div",{key:0,class:k(`example-source language-${m.lang}`)},[z("span",jn,ve(m.lang),1),z("div",{innerHTML:n.value},null,8,In)],2)):se(m.$slots,"highlight",{key:1})],2),[[ye,a.value]])]),_:3}),B(qe,{name:"el-fade-in-linear"},{default:M(()=>[we(z("div",{class:k(m.$style["example-control"]),onClick:d},[z("span",{class:k(m.$style["control-icon"])},null,2),z("span",{class:k(m.$style["control-text"])},ve(o.value["hide-source"]),3)],2),[[ye,a.value]])]),_:1})],2)]),_:3}),B(Fn,{modelValue:s.value,"onUpdate:modelValue":b[0]||(b[0]=p=>s.value=p)},{default:M(()=>[se(m.$slots,"default")]),_:3},8,["modelValue"])],64)}}}),Un="_example_8jhae_2",Yn={example:Un,"example-showcase":"_example-showcase_8jhae_14","example-divider--horizontal":"_example-divider--horizontal_8jhae_20","example-actions":"_example-actions_8jhae_25","example-actions--right":"_example-actions--right_8jhae_35","example-source-wrapper":"_example-source-wrapper_8jhae_41","example-control":"_example-control_8jhae_46","control-text":"_control-text_8jhae_63","control-icon":"_control-icon_8jhae_68","example-actions-tip":"_example-actions-tip_8jhae_85"},Kn={$style:Yn},Xn=ee(Wn,[["__cssModules",Kn]]),Zn={extends:Jt,enhanceApp(e){const{app:t,router:o}=e;po(t,o),X(t,Xn),X(t,eo,"Kbd"),X(t,to,"NceTexts"),X(t,oo,"EnglishWords"),X(t,no,"EnglishWord"),X(t,Qt,"ExampleSentence"),X(t,io,"NceComprehension"),xo()}};function pt(e){if(e.extends){const t=pt(e.extends);return{...t,...e,async enhanceApp(o){t.enhanceApp&&await t.enhanceApp(o),e.enhanceApp&&await e.enhanceApp(o)}}}return e}const le=pt(Zn),Gn=Q({name:"VitePressApp",setup(){const{site:e}=Yt();return Ge(()=>{Kt(()=>{document.documentElement.lang=e.value.lang,document.documentElement.dir=e.value.dir})}),e.value.router.prefetchLinks&&Xt(),Zt(),Gt(),le.setup&&le.setup(),()=>Je(le.Layout)}});async function Jn(){const e=ei(),t=Qn();t.provide(Bt,e);const o=Vt(e.route);return t.provide(Mt,o),t.component("Content",qt),t.component("ClientOnly",Dt),Object.defineProperties(t.config.globalProperties,{$frontmatter:{get(){return o.frontmatter.value}},$params:{get(){return o.page.value.params}}}),le.enhanceApp&&await le.enhanceApp({app:t,router:e,siteData:Ft}),{app:t,router:e,data:o}}function Qn(){return jt(Gn)}function ei(){let e=Re,t;return It(o=>{let i=Wt(o),n=null;return i&&(e&&(t=i),(e||t===i)&&(i=i.replace(/\.js$/,".lean.js")),n=Ut(()=>import(i),__vite__mapDeps([]))),Re&&(e=!1),n},le.NotFound)}Re&&Jn().then(({app:e,router:t,data:o})=>{t.go().then(()=>{Nt(t.route,o.site),e.mount("#app")})});export{Jn as createApp};
function __vite__mapDeps(indexes) {
  if (!__vite__mapDeps.viteFileDeps) {
    __vite__mapDeps.viteFileDeps = []
  }
  return indexes.map((i) => __vite__mapDeps.viteFileDeps[i])
}