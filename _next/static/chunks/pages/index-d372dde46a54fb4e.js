(self.webpackChunk_N_E=self.webpackChunk_N_E||[]).push([[405],{8312:function(e,l,a){(window.__NEXT_P=window.__NEXT_P||[]).push(["/",function(){return a(5075)}])},2002:function(e,l,a){"use strict";a.d(l,{Z:function(){return u}});var r=a(5893),s=a(1163),n=a(6010);let t=e=>{var l,a,s;let{videoScrapeInstance:t,value:i,label:c,sentiment:d}=e,{Video:o,Selector:u}=t;return o?(0,r.jsxs)("div",{className:(0,n.Z)("flex gap-5 flex-col bg-zinc-900 rounded-md py-8 px-8 items-start border-red-700 border"),children:[c&&(0,r.jsxs)("div",{className:"flex gap-1 w-full place-content-between flex-col",children:[(0,r.jsx)("h5",{className:(0,n.Z)({"bg-cyan-700":"positive"==d,"bg-red-900":"negative"==d,"bg-red-700":"neutral"==d},"px-4 py-2 rounded-md whitespace-nowrap"),children:c}),(0,r.jsx)("span",{className:"whitespace-nowrap pl-4",children:Array.isArray(i)?i.map(e=>(0,r.jsx)("p",{children:e},e)):i})]}),(0,r.jsx)("div",{className:"video-container rounded-md overflow-hidden",children:(0,r.jsx)("iframe",{width:"336",height:"189",src:"https://www.youtube-nocookie.com/embed/".concat(o.youtubeVideoId),title:"YouTube video player - ".concat(t.title),frameBorder:"0",allow:"accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share",allowFullScreen:!0})}),(0,r.jsxs)("ul",{className:"w-full",children:[(0,r.jsx)("li",{children:(0,r.jsx)("a",{target:"_blank",href:"https://www.youtube.com/watch?v=".concat(o.youtubeVideoId),className:"font-lg font-bold underline",children:t.title})}),(0,r.jsx)("li",{className:"max-h-20 overflow-auto",children:t.description}),(0,r.jsxs)("li",{className:"mt-2",children:["Uploaded by"," ",(0,r.jsx)("a",{target:"_blank",href:"https://www.youtube.com/@".concat(o.Author.Username.name),className:"text-cyan-600 underline",children:o.Author.Username.name})]}),u&&(0,r.jsxs)("li",{children:["Featured by"," ",(0,r.jsx)("a",{target:"_blank",href:"https://www.youtube.com/@".concat(u.Username.name),children:u.Username.name})]})]}),(0,r.jsxs)("details",{className:"z-10 h-6",children:[(0,r.jsx)("summary",{children:"Stats for Nerds"}),(0,r.jsxs)("ul",{className:"flex flex-col gap-2 bg-zinc-900 p-4 rounded-md border-red-700 border",children:[(0,r.jsxs)("li",{children:["VideoId: ",o.youtubeVideoId]}),(0,r.jsxs)("li",{children:["Author username: ",null===(l=o.Author)||void 0===l?void 0:l.Username.name]}),(0,r.jsxs)("li",{children:["Author display name at time of feature:"," ",t.DisplayName.name]}),(null===(a=o.Author)||void 0===a?void 0:a.DisplayName.length)>1&&(0,r.jsxs)("li",{children:["All Author display names:"," ",null===(s=o.Author)||void 0===s?void 0:s.DisplayName.map(e=>{let{name:l}=e;return l}).join(", ")]}),(0,r.jsxs)("li",{children:["Historical Author Links:",(0,r.jsx)("ul",{children:o.Author.Links.map(e=>{let{url:l}=e;return(0,r.jsx)("li",{children:(0,r.jsx)("a",{href:l,target:"_blank",children:l})},l)})})]}),(0,r.jsxs)("li",{children:["Historical Video Links:",(0,r.jsx)("ul",{children:o.Links.map(e=>{let{url:l}=e;return(0,r.jsx)("li",{children:(0,r.jsx)("a",{href:l,target:"_blank",children:l})},l)})})]}),(0,r.jsxs)("li",{children:["Wayback Homepage feature Links:",(0,r.jsx)("ul",{children:o.VideoScrapeInstances.map(e=>{let l="https://web.archive.org/web/".concat(e.waybackTimestamp,"/http://youtube.com/");return(0,r.jsx)("li",{children:(0,r.jsx)("a",{href:l,target:"_blank",children:l})},e.waybackTimestamp)})})]})]})]})]}):null};var i=a(7294),c=a(738);let d=e=>{let{highlightedFeaturedVideos:l,mostLeastList:a,counts:n,mostFeaturedAuthors:d}=e,o=(0,s.useRouter)(),{year:u,month:h}=o.query;return(0,r.jsxs)("div",{children:[(0,r.jsxs)("div",{className:"flex gap-10 mb-10",children:[(0,r.jsxs)("header",{children:[(0,r.jsx)("h1",{className:"text-3xl",children:"Featured Videos"}),(0,r.jsx)("span",{className:"text-9xl font-bold text-red-500",children:u||"2005-2010"}),h&&(0,r.jsx)("span",{className:"text-4xl font-bold text-red-600 block",children:c.lQ[parseInt(h)-1]})]}),!!a.length&&(0,r.jsxs)(r.Fragment,{children:[a.map(e=>{var l;return!!(null===(l=e.value)||void 0===l?void 0:l.length)&&(0,r.jsxs)("section",{className:"flex flex-col items-start",children:[(0,r.jsxs)("p",{className:"pb-1",children:[e.label,":"]}),(0,r.jsx)("ul",{className:"flex flex-col gap-1 border-l-red-400 border-l-8 border-t-red-400 border-t-8 pl-2",children:e.value.map(e=>(0,r.jsx)("li",{children:e.name},e.name))})]},e.label)}),!!(null==d?void 0:d.length)&&(0,r.jsxs)("section",{className:"flex flex-col items-start",children:[(0,r.jsx)("p",{className:"pb-1",children:"Top Video Authors:"}),(0,r.jsx)("ul",{className:"flex flex-col gap-1 border-l-red-400 border-l-8 border-t-red-400 border-t-8 pl-2",children:d.map(e=>(0,r.jsx)("li",{children:(0,r.jsx)("a",{target:"_blank",href:"https://www.youtube.com/@".concat(e.name),children:e.name})},e.name))})]}),(0,r.jsx)("div",{className:"flex flex-col gap-2 items-start",children:Object.values(n).map(e=>!!(null==e?void 0:e.value)&&(0,r.jsxs)("p",{children:[(0,r.jsx)("span",{className:"text-lg font-bold text-red-400",children:parseInt(e.value)})," ",e.label]},e.label))})]})]}),(0,r.jsx)("section",{children:(0,r.jsx)("div",{className:"grid grid-cols-4 gap-4",children:null==l?void 0:l.map(e=>{let{most:l,least:a}=e;return!!(l||a)&&(0,r.jsxs)(i.Fragment,{children:[(null==l?void 0:l.videoScrapeInstance)&&(0,r.jsx)(t,{label:l.label,value:l.value,sentiment:l.sentiment,videoScrapeInstance:l.videoScrapeInstance}),(null==a?void 0:a.videoScrapeInstance)&&(0,r.jsx)(t,{label:a.label,value:a.value,sentiment:a.sentiment,videoScrapeInstance:a.videoScrapeInstance})]},(null==l?void 0:l.label)||(null==a?void 0:a.label))})})})]})},o=(0,i.memo)(d);var u=o},5075:function(e,l,a){"use strict";a.r(l),a.d(l,{__N_SSG:function(){return i}});var r=a(5893),s=a(3151),n=a(2002);a(7294);let t=e=>(0,r.jsx)(n.Z,{...e});var i=!0;l.default=(0,s.withSuperJSONPage)(t)}},function(e){e.O(0,[297,774,888,179],function(){return e(e.s=8312)}),_N_E=e.O()}]);