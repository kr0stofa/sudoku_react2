(window.webpackJsonp=window.webpackJsonp||[]).push([[0],[,,function(e,t,a){},,,function(e,t,a){e.exports=a.p+"static/media/logo.06e73328.svg"},,,function(e,t,a){e.exports=a(24)},,,,,,,,,function(e,t,a){},function(e,t,a){},function(e,t,a){},function(e,t,a){},,,,function(e,t,a){"use strict";a.r(t);var n=a(0),r=a.n(n),c=a(4),o=a.n(c),l=(a(17),a(5)),s=a.n(l),i=a(7);a(18),a(2);var u=Object(n.memo)(function(e){let{x:t,y:a,value:n,onClick:c,isFixed:o,isValid:l,isFocused:s,isSelected:i,isHighlighted:u,onHover:d,onHoverEnd:m}=e;const f=t%3===0,b=a%3===0;return r.a.createElement("div",{onMouseEnter:d,onMouseLeave:m,onClick:c,className:"tile ".concat("".concat(b?"border-top":""," ").concat(f?"border-left":""," ").concat(8===a?"border-bottom":""," \n    ").concat(8===t?"border-right":""))},r.a.createElement("div",{className:"tile-content ".concat(i?"selected":""," \n        ").concat(o?"fixed":""," \n        ").concat(s?"focused":""," \n        ").concat(u?"highlight":""," \n        ").concat(l?"":"invalid")},r.a.createElement("div",{className:"tile-number ".concat(0===n?"no-val":"")},n>0?n:"")))});const d=(e,t)=>100*t+e,m=e=>[e%100,Math.floor(e/100)],f=(e,t,a)=>a[t][e],b=(e,t)=>{if(e<0)return 0;const[a,n]=m(e);return f(a,n,t)},h=e=>e.every(e=>e.every(e=>e>0)),p=(e,t,a)=>{const n=new Map;if(a[t].forEach((t,a)=>{a!==e&&n.set(t,!0)}),a.forEach((a,r)=>{r!==t&&n.set(a[e],!0)}),9===n.set.length)return[];let r=[6,7,8];e<3?r=[0,1,2]:e<6&&(r=[3,4,5]);let c=[6,7,8];return t<3?c=[0,1,2]:t<6&&(c=[3,4,5]),c.forEach(c=>r.forEach(r=>{c===t&&r===e||n.set(a[c][r],!0)})),[1,2,3,4,5,6,7,8,9].filter(e=>!n.has(e))},v=()=>{const e=new Map,t=[],a=[];let n=-1,r=0;const c=()=>{const t={...a.pop()};return t?(t.tileId!==n&&e.set(t.tileId,[]),{tileId:t.tileId,val:0}):(console.error("No history!"),{tileId:-1,val:0})},o=(e,o)=>{let l={tileId:-1,val:1};if(r>0)return r-=1,c();if(h(e))return{...l};const s=(e=>{const t=new Map;return e.forEach((a,n)=>a.forEach((a,r)=>{0===a&&t.set(d(r,n),p(r,n,e))})),t})(e);if(!s)return{...l};let i=10,u=-1,m=[];const f=Array.from(s.entries());for(let[d,h]of f){const s=o.get(d)||[],f=s.length<1?h:h.filter(e=>!s.includes(e)),p=f.length;if(p<1){const e={...t.pop()};if(console.log("rg",e,t.slice()),!e)return console.error("No more guesses to pop!"),{...l};const s=e.tileId,i=e.val,u=o.get(s)||[];o.set(s,[...u,i]),n=s;const d=a.findIndex(e=>e.tileId===s);return d<0?(console.error("Guess cannot be found in history!"),console.log("Tile:",s,"Value:",i),console.log("Err History:",a.slice()),r=0,{...l}):(r=a.length-d-1,l=c(),{...l})}0===b(d,e)&&p<i&&(i=p,u=d,m=f)}return l.tileId=u,l.val=m[Math.floor(Math.random()*m.length)],i>1&&t.push({...l}),a.push({...l}),{...l}};return{startNewAttempt:()=>{r=0,a.splice(0,a.length),t.splice(0,t.length),e.clear()},getMove:t=>o(t,e)}},g=new Array(9).fill(null).map((e,t)=>new Array(9).fill(null));var E=e=>{let{getTileValue:t,validBoard:a,hoveredTile:n,setHoveredTile:c,selectedTile:o,fixedBoardNumbers:l,handleSelectTile:s}=e;const i=(e,t)=>()=>{c(d(e,t))},f=(e,t)=>()=>{c(-1)},b=(e,t)=>n===d(e,t),h=(e,t)=>{const[a,r]=m(n);if(e===a||t===r)return!0;let c=[6,7,8];e<3?c=[0,1,2]:e<6&&(c=[3,4,5]);let o=[6,7,8];return t<3?o=[0,1,2]:t<6&&(o=[3,4,5]),c.includes(a)&&o.includes(r)},p=(e,t)=>()=>{s(d(e,t))};return r.a.createElement("div",{className:"gameboard"},g.map((e,n)=>r.a.createElement("div",{className:"row",key:"row-".concat(n)},e.map((e,c)=>r.a.createElement(u,Object.assign({key:"t-".concat(d(c,n))},((e,n)=>({x:e,y:n,value:t(e,n),isValid:!!a[n][e],isFocused:b(e,n),isFixed:l[n][e]>0,isHighlighted:h(e,n),onHover:i(e,n),onHoverEnd:f(),isSelected:d(e,n)===o,onClick:p(e,n)}))(c,n)))))))};a(19),a(20);var w=Object(n.memo)(e=>{let{onSet:t,currVal:a,availableNums:n}=e;return r.a.createElement("div",{className:"numpad"},new Array(9).fill(null).map((e,c)=>r.a.createElement("button",{key:"num-".concat(c+1),onClick:()=>t(c+1),className:"number ".concat(a===c+1?"highlight":""," ").concat(n.includes(c+1)?"":"badnum")},c+1)))});const y=e=>{const t=[];return e.forEach(e=>{const a=[];for(let t=0;t<e.length;t++)a.push(parseInt(e[t]));t.push(a)}),t},N={easy:y(["409253071","020981560","518607203","694070325","001302740","230495018","170504906","980016432","046800150"]),medium:y(["000500000","950000080","038007250","103000009","009704162","046219000","017000300","000050720","000000090"]),hard:y(["300040960","900008010","600005000","008004090","100300020","000000000","000000506","001050002","007002040"])},k=()=>new Array(9).fill(null).map(()=>new Array(9).fill(0));var S=e=>{let{mobile:t}=e;const[a,c]=Object(n.useState)(!1),[o,l]=Object(n.useState)(),[s,i]=Object(n.useState)(""),[u,g]=Object(n.useState)(k()),[y,S]=Object(n.useState)(k()),[O,j]=Object(n.useState)(500),[I,A]=Object(n.useState)(k()),[T,x]=Object(n.useState)(k()),[C,M]=Object(n.useState)(-1),[H,B]=Object(n.useState)(-1),[F,V]=Object(n.useState)([]),R=Object(n.useCallback)(e=>{const t=k();u.forEach((a,n)=>a.forEach((a,r)=>t[n][r]=((e,t,a,n)=>{if(0===a)return!0;let r=!0;if(!(r=!n[t].some((t,n)=>t===a&&n!==e)))return!1;if(!(r=!n.some((n,r)=>n[e]===a&&r!==t)))return!1;let c=[6,7,8];e<3?c=[0,1,2]:e<6&&(c=[3,4,5]);let o=[6,7,8];return t<3?o=[0,1,2]:t<6&&(o=[3,4,5]),r=!o.some(r=>c.some(c=>n[r][c]===a&&(c!==e||r!==t)))})(r,n,a,e)?1:0)),x(t)},[u]),D=(e,t,a)=>{if(e<0)return;if(b(e,a)===t)return;const[n,r]=m(e);if(y[r][n]>0)return;const c=a.map(e=>[...e]);return A(c),((e,t,a,n)=>{const r=n.map(e=>[...e]);return r[t][e]=a,g(r),r})(n,r,t,a)},L=e=>{M(e),V(((e,t)=>{if(e<0)return[];const[a,n]=m(e);return p(a,n,t)})(e,u))},z=v(),G=e=>{const t=(e=>{if(h(e))return;const{tileId:t,val:a}=z.getMove(e);return L(t),D(t,a,e)})(e);if(!t)return window.console.log("ERROR doing best move"),clearTimeout(o),l(0),void c(!1);l(window.setTimeout(()=>G(t),O))},J=e=>{A(k());let t=[];switch(e){case 1:t=N.medium;break;case 2:t=N.hard;break;default:t=N.easy}L(-1),S(t),g(t)};Object(n.useEffect)(()=>{R(u)},[a,R,u]),Object(n.useEffect)(()=>{J(1)},[]);const P={getTileValue:(e,t)=>f(e,t,u),validBoard:T,selectedTile:C,handleSelectTile:L,hoveredTile:H,fixedBoardNumbers:y,setHoveredTile:B};return r.a.createElement("div",{tabIndex:0,className:"sudoku",onKeyDown:e=>{const{key:t}=e,[a,n]=m(C);let[r,c]=[-1,-1],o=-1;switch(t){case"w":case"ArrowUp":[r,c]=[a,n-1];break;case"s":case"ArrowDown":[r,c]=[a,n+1];break;case"a":case"ArrowLeft":[r,c]=[a-1,n];break;case"d":case"ArrowRight":[r,c]=[a+1,n];break;case"0":case"Escape":case"Backspace":((e,t,a)=>{D(d(e,t),0,a)})(a,n,u);break;default:const e=parseInt(t);console.log("key",t,e,!!e),e&&(o=e)}if(r>-1){if(((e,t)=>e>8||t>8||e<0||t<0)(r,c))return;const e=d(r,c);L(e),B(e)}o>-1&&(console.log("set val",o),D(C,o,u))}},r.a.createElement(E,P),r.a.createElement("div",{className:"actions-group"},r.a.createElement("div",{className:"puzzle-select"},[["Easy",0],["Medium",1],["Hard",2]].map(e=>{let[t,n]=e;return r.a.createElement("button",{className:"btn-ui",disabled:a,onClick:()=>J(n)},t)})),r.a.createElement(w,{availableNums:F,currVal:b(C,u),onSet:e=>D(C,e,u)}),r.a.createElement("div",{className:"slidecontainer"},r.a.createElement("input",{disabled:a,type:"range",min:"20",max:"2500",value:O,className:"slider",id:"myRange",onChange:e=>j(parseInt(e.target.value))}),r.a.createElement("span",{className:"text-input-label"},O,"ms"),r.a.createElement("button",{className:"btn-ui btn-wide  ".concat(s),onClick:()=>{clearTimeout(o),l(0),a?c(!1):(z.startNewAttempt(),c(!0),i("disabled"),G(u))}},a?"Stop":"Auto Solve")),r.a.createElement("button",{className:"btn-ui btn-wide ".concat(s),onClick:()=>{c(!1),g(k())}},"Clear Board")))};var O=function(){const e=Object(i.a)({query:"(max-width: 800px)"});return console.log(e),r.a.createElement("div",{className:"App"},r.a.createElement("header",{className:"App-header"},r.a.createElement("img",{src:s.a,className:"App-logo",alt:"logo"})," by David Goh"),r.a.createElement(S,{mobile:e}))};var j=e=>{e&&e instanceof Function&&a.e(3).then(a.bind(null,25)).then(t=>{let{getCLS:a,getFID:n,getFCP:r,getLCP:c,getTTFB:o}=t;a(e),n(e),r(e),c(e),o(e)})};o.a.createRoot(document.getElementById("root")).render(r.a.createElement(r.a.StrictMode,null,r.a.createElement(O,null))),j()}],[[8,1,2]]]);
//# sourceMappingURL=main.c66e8774.chunk.js.map