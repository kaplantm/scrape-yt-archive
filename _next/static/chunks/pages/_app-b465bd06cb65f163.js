(self.webpackChunk_N_E=self.webpackChunk_N_E||[]).push([[888],{6010:function(e,t,r){"use strict";t.Z=function(){for(var e,t,r=0,n="";r<arguments.length;)(e=arguments[r++])&&(t=function e(t){var r,n,o="";if("string"==typeof t||"number"==typeof t)o+=t;else if("object"==typeof t){if(Array.isArray(t))for(r=0;r<t.length;r++)t[r]&&(n=e(t[r]))&&(o&&(o+=" "),o+=n);else for(r in t)t[r]&&(o&&(o+=" "),o+=r)}return o}(e))&&(n&&(n+=" "),n+=t);return n}},6840:function(e,t,r){(window.__NEXT_P=window.__NEXT_P||[]).push(["/_app",function(){return r(6757)}])},1210:function(e,t){"use strict";Object.defineProperty(t,"__esModule",{value:!0}),t.getDomainLocale=function(e,t,r,n){return!1},("function"==typeof t.default||"object"==typeof t.default&&null!==t.default)&&void 0===t.default.__esModule&&(Object.defineProperty(t.default,"__esModule",{value:!0}),Object.assign(t.default,t),e.exports=t.default)},8418:function(e,t,r){"use strict";Object.defineProperty(t,"__esModule",{value:!0}),t.default=void 0;var n=r(2648).Z,o=r(7273).Z,l=n(r(7294)),a=r(3297),u=r(4634),i=r(4611),s=r(3794),c=r(2725),f=r(3462),d=r(1018),p=r(7190),h=r(1210),v=r(8684);let g=new Set;function b(e,t,r,n,o){if(o||u.isLocalURL(t)){if(!n.bypassPrefetchedCheck){let o=void 0!==n.locale?n.locale:"locale"in e?e.locale:void 0,l=t+"%"+r+"%"+o;if(g.has(l))return;g.add(l)}Promise.resolve(e.prefetch(t,r,n)).catch(e=>{})}}function x(e){return"string"==typeof e?e:i.formatUrl(e)}let y=l.default.forwardRef(function(e,t){let r,n;let{href:i,as:g,children:y,prefetch:m,passHref:j,replace:w,shallow:_,scroll:Y,locale:k,onClick:C,onMouseEnter:M,onTouchStart:D,legacyBehavior:N=!1}=e,S=o(e,["href","as","children","prefetch","passHref","replace","shallow","scroll","locale","onClick","onMouseEnter","onTouchStart","legacyBehavior"]);r=y,N&&("string"==typeof r||"number"==typeof r)&&(r=l.default.createElement("a",null,r));let E=!1!==m,O=l.default.useContext(f.RouterContext),P=l.default.useContext(d.AppRouterContext),L=null!=O?O:P,I=!O,{href:T,as:R}=l.default.useMemo(()=>{if(!O){let e=x(i);return{href:e,as:g?x(g):e}}let[e,t]=a.resolveHref(O,i,!0);return{href:e,as:g?a.resolveHref(O,g):t||e}},[O,i,g]),A=l.default.useRef(T),U=l.default.useRef(R);N&&(n=l.default.Children.only(r));let B=N?n&&"object"==typeof n&&n.ref:t,[Z,F,H]=p.useIntersection({rootMargin:"200px"}),K=l.default.useCallback(e=>{(U.current!==R||A.current!==T)&&(H(),U.current=R,A.current=T),Z(e),B&&("function"==typeof B?B(e):"object"==typeof B&&(B.current=e))},[R,B,T,H,Z]);l.default.useEffect(()=>{L&&F&&E&&b(L,T,R,{locale:k},I)},[R,T,F,k,E,null==O?void 0:O.locale,L,I]);let X={ref:K,onClick(e){N||"function"!=typeof C||C(e),N&&n.props&&"function"==typeof n.props.onClick&&n.props.onClick(e),L&&!e.defaultPrevented&&function(e,t,r,n,o,a,i,s,c,f){let{nodeName:d}=e.currentTarget,p="A"===d.toUpperCase();if(p&&(function(e){let t=e.currentTarget,r=t.getAttribute("target");return r&&"_self"!==r||e.metaKey||e.ctrlKey||e.shiftKey||e.altKey||e.nativeEvent&&2===e.nativeEvent.which}(e)||!c&&!u.isLocalURL(r)))return;e.preventDefault();let h=()=>{"beforePopState"in t?t[o?"replace":"push"](r,n,{shallow:a,locale:s,scroll:i}):t[o?"replace":"push"](n||r,{forceOptimisticNavigation:!f})};c?l.default.startTransition(h):h()}(e,L,T,R,w,_,Y,k,I,E)},onMouseEnter(e){N||"function"!=typeof M||M(e),N&&n.props&&"function"==typeof n.props.onMouseEnter&&n.props.onMouseEnter(e),L&&(E||!I)&&b(L,T,R,{locale:k,priority:!0,bypassPrefetchedCheck:!0},I)},onTouchStart(e){N||"function"!=typeof D||D(e),N&&n.props&&"function"==typeof n.props.onTouchStart&&n.props.onTouchStart(e),L&&(E||!I)&&b(L,T,R,{locale:k,priority:!0,bypassPrefetchedCheck:!0},I)}};if(s.isAbsoluteUrl(R))X.href=R;else if(!N||j||"a"===n.type&&!("href"in n.props)){let e=void 0!==k?k:null==O?void 0:O.locale,t=(null==O?void 0:O.isLocaleDomain)&&h.getDomainLocale(R,e,null==O?void 0:O.locales,null==O?void 0:O.domainLocales);X.href=t||v.addBasePath(c.addLocale(R,e,null==O?void 0:O.defaultLocale))}return N?l.default.cloneElement(n,X):l.default.createElement("a",Object.assign({},S,X),r)});t.default=y,("function"==typeof t.default||"object"==typeof t.default&&null!==t.default)&&void 0===t.default.__esModule&&(Object.defineProperty(t.default,"__esModule",{value:!0}),Object.assign(t.default,t),e.exports=t.default)},7190:function(e,t,r){"use strict";Object.defineProperty(t,"__esModule",{value:!0}),t.useIntersection=function(e){let{rootRef:t,rootMargin:r,disabled:i}=e,s=i||!l,[c,f]=n.useState(!1),d=n.useRef(null),p=n.useCallback(e=>{d.current=e},[]);n.useEffect(()=>{if(l){if(s||c)return;let e=d.current;if(e&&e.tagName){let n=function(e,t,r){let{id:n,observer:o,elements:l}=function(e){let t;let r={root:e.root||null,margin:e.rootMargin||""},n=u.find(e=>e.root===r.root&&e.margin===r.margin);if(n&&(t=a.get(n)))return t;let o=new Map,l=new IntersectionObserver(e=>{e.forEach(e=>{let t=o.get(e.target),r=e.isIntersecting||e.intersectionRatio>0;t&&r&&t(r)})},e);return t={id:r,observer:l,elements:o},u.push(r),a.set(r,t),t}(r);return l.set(e,t),o.observe(e),function(){if(l.delete(e),o.unobserve(e),0===l.size){o.disconnect(),a.delete(n);let e=u.findIndex(e=>e.root===n.root&&e.margin===n.margin);e>-1&&u.splice(e,1)}}}(e,e=>e&&f(e),{root:null==t?void 0:t.current,rootMargin:r});return n}}else if(!c){let e=o.requestIdleCallback(()=>f(!0));return()=>o.cancelIdleCallback(e)}},[s,r,t,c,d.current]);let h=n.useCallback(()=>{f(!1)},[]);return[p,c,h]};var n=r(7294),o=r(9311);let l="function"==typeof IntersectionObserver,a=new Map,u=[];("function"==typeof t.default||"object"==typeof t.default&&null!==t.default)&&void 0===t.default.__esModule&&(Object.defineProperty(t.default,"__esModule",{value:!0}),Object.assign(t.default,t),e.exports=t.default)},6757:function(e,t,r){"use strict";r.r(t),r.d(t,{default:function(){return m}});var n=r(5893),o=r(6010),l=r(738);let a=function(){let e=arguments.length>0&&void 0!==arguments[0]?arguments[0]:0,t=arguments.length>1?arguments[1]:void 0;return Array.from(Array(t-e),(t,r)=>r+e)}(2005,2011);var u=r(1163),i=r(1664),s=r.n(i);let c=()=>{let{query:e={}}=(0,u.useRouter)(),{year:t,month:r}=e;return(0,n.jsx)("nav",{className:"flex flex-wrap bg-red-700 text-sm",children:(0,n.jsxs)("div",{className:"flex flex-col w-full",children:[(0,n.jsxs)("div",{className:"p-2",children:[a.map(e=>(0,n.jsx)("a",{href:"/year/".concat(e),className:(0,o.Z)("text-red-200 hover:text-white p-2",{"font-bold border rounded":e===parseInt(t)}),children:e},e)),(0,n.jsx)(s(),{href:"/",className:(0,o.Z)("text-red-200 hover:text-white p-2",{"font-bold border rounded":!t}),children:"All Data"})]}),t&&(0,n.jsx)("div",{className:"bg-red-800 p-2 w-full",children:l.lQ.map((e,l)=>"2005"===t&&l<5?(0,n.jsx)("span",{className:"text-gray-400 p-2",children:e},e):(0,n.jsx)(s(),{href:"/year/".concat(t,"/month/").concat(l+1),className:(0,o.Z)("text-red-200 hover:text-white p-2",{"font-bold border rounded":l+1===parseInt(r)}),children:e},e))})]})})};var f=r(9008),d=r.n(f);let p=e=>{let{children:t}=e,{query:r={}}=(0,u.useRouter)(),{year:o,month:a}=r,i=new Date(Date.UTC(parseInt(o),parseInt(a||"1"),1)),s=a?l.fw.shortMonthYYYY:l.fw.YYYY,f=s(i);return(0,n.jsxs)(n.Fragment,{children:[(0,n.jsxs)(d(),{children:[(0,n.jsx)("title",{children:"".concat(o?f:""," Featured Youtube Videos")}),(0,n.jsx)("script",{src:"https://storage.ko-fi.com/cdn/scripts/overlay-widget.js"})]}),(0,n.jsx)(c,{}),(0,n.jsx)("div",{className:"p-10",children:t}),(0,n.jsx)("div",{dangerouslySetInnerHTML:{__html:"<script>\nif(typeof kofiWidgetOverlay !== 'undefined'){\n    kofiWidgetOverlay.draw('tonarie', {\n    'type': 'floating-chat',\n    'floating-chat.donateButton.text': 'Support Project',\n    'floating-chat.donateButton.background-color': '#00b9fe',\n    'floating-chat.donateButton.text-color': '#fff',\n  })}</script>"}})]})};var h=r(7294);BigInt.prototype.toJSON=function(){return this.toString()};let v=e=>{let{data:t}=e,[r,o]=(0,h.useState)(!1),l=()=>o(e=>!e);return(0,n.jsxs)("div",{className:"flex flex-col max-w-lg gap-5 max-h-96",children:[r&&(0,n.jsx)(n.Fragment,{children:(0,n.jsx)("div",{className:"border-red-800 border rounded-md overflow-scroll p-5 hide-scroll backdrop-blur-sm bg-teal-950/50",children:(0,n.jsx)("pre",{children:JSON.stringify(t,null,2)})})}),(0,n.jsxs)("button",{onClick:l,className:"bg-teal-800 hover:bg-teal-900 text-white font-bold py-1 px-2 rounded-full self-start",children:[r&&"X "," Data"]})]})},g=e=>{let{data:t}=e,[r,o]=(0,h.useState)(!1),l=()=>o(e=>!e);return(0,n.jsxs)("div",{className:"flex flex-col max-w-lg fixed bottom-4 right-4 gap-5 text-xs",children:[r&&(0,n.jsx)(v,{data:t}),(0,n.jsx)("button",{onClick:l,className:"bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded-full self-start",children:r?"Close":"Debug"})]})},b={debugData:{},updateDebugData:()=>{}},x=(0,h.createContext)(b),y=e=>{let{path:t,data:r}=e,{debugData:o}=function(e,t){let r=(0,h.useContext)(x),{updateDebugData:n}=r;return(0,h.useEffect)(()=>{n({[e]:"object"==typeof t&&(null==t?void 0:t._superjson)?{...t,_superjson:"Removed by debugger"}:t})},[n,t,e]),r}(t,r);return(0,n.jsx)(g,{data:o})};function m(e){let{Component:t,pageProps:r,router:o}=e,l=h.Fragment,a=h.Fragment,u=function(){let[e,t]=(0,h.useState)(b.debugData),r=(0,h.useCallback)(e=>{t(t=>({...t,...e}))},[]);return{debugData:e,updateDebugData:r}}();return(0,n.jsx)(l,{value:u,children:(0,n.jsx)(a,{data:r,path:o.asPath,children:(0,n.jsx)(p,{children:(0,n.jsx)(t,{...r})})})})}r(2488)},738:function(e,t,r){"use strict";r.d(t,{fw:function(){return l},lQ:function(){return n}});let n=Array(12).fill(0).map((e,t)=>new Date("".concat(t+1,"/1/2005")).toLocaleDateString(void 0,{month:"long"}));!function(){let e=arguments.length>0&&void 0!==arguments[0]?arguments[0]:"long",t=new Date(Date.UTC(2017,0,2)),r=[];for(let n=0;n<7;n++)r.push(t.toLocaleDateString(void 0,{weekday:e})),t.setDate(t.getDate()+1)}();let o={numeric:{weekday:void 0,year:"numeric",month:"numeric",day:"numeric"},shortMonthYYYY:{weekday:void 0,year:"numeric",month:"short",day:void 0},YYYY:{weekday:void 0,year:"numeric",month:void 0,day:void 0}},l={numeric:e=>e.toLocaleDateString(void 0,o.numeric),shortMonthYYYY:e=>e.toLocaleDateString(void 0,o.shortMonthYYYY),YYYY:e=>e.toLocaleDateString(void 0,o.YYYY)}},2488:function(){},9008:function(e,t,r){e.exports=r(5443)},1664:function(e,t,r){e.exports=r(8418)},1163:function(e,t,r){e.exports=r(387)}},function(e){var t=function(t){return e(e.s=t)};e.O(0,[774,179],function(){return t(6840),t(387)}),_N_E=e.O()}]);