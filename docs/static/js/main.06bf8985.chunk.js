(this["webpackJsonprgl-hidden-elements"]=this["webpackJsonprgl-hidden-elements"]||[]).push([[0],{19:function(t,e,n){t.exports=n(37)},24:function(t,e,n){},35:function(t,e,n){},37:function(t,e,n){"use strict";n.r(e);var i,a=n(0),r=n.n(a),o=n(10),u=n.n(o),l=(n(24),n(8)),c=n(1),s=n(3),m=n(4),h=n(6),y=n(5),d=n(7),f=n(11),v=n.n(f);!function(t){t[t.Editor=0]="Editor",t[t.View=1]="View"}(i||(i={}));var g={layout:[{i:"0",w:2,h:50,x:0,y:0,minH:0},{i:"1",w:2,h:50,x:2,y:0,minH:0},{i:"2",w:4,h:50,x:0,y:50,minH:0},{i:"3",w:2,h:50,x:0,y:100,minH:0},{i:"4",w:2,h:50,x:2,y:100,minH:0},{i:"5",w:2,h:50,x:0,y:150,minH:0},{i:"6",w:2,h:50,x:2,y:150,minH:0},{i:"7",w:2,h:50,x:0,y:200,minH:0},{i:"8",w:2,h:50,x:2,y:200,minH:0},{i:"9",w:2,h:50,x:0,y:250,minH:0},{i:"10",w:2,h:50,x:2,y:250,minH:0},{i:"11",w:2,h:50,x:0,y:300,minH:0},{i:"12",w:2,h:50,x:2,y:300,minH:0},{i:"13",w:2,h:50,x:0,y:350,minH:0},{i:"14",w:2,h:50,x:2,y:350,minH:0},{i:"15",w:2,h:50,x:0,y:400,minH:0},{i:"16",w:2,h:50,x:2,y:400,minH:0},{i:"17",w:2,h:50,x:0,y:450,minH:0},{i:"18",w:2,h:50,x:2,y:450,minH:0},{i:"19",w:2,h:50,x:0,y:500,minH:0},{i:"20",w:2,h:50,x:2,y:500,minH:0}]},p=function(t){function e(){var t,n;Object(s.a)(this,e);for(var a=arguments.length,r=new Array(a),o=0;o<a;o++)r[o]=arguments[o];return(n=Object(h.a)(this,(t=Object(y.a)(e)).call.apply(t,[this].concat(r)))).state=Object(c.a)({},g),n.toggleSingleElement=function(t){var e=t.currentTarget.dataset.index;if(e)return n.setState((function(t){return Object(c.a)({},t,{layout:t.layout.map((function(t){switch(t.i){case e:return Object(c.a)({},t,{maxW:void 0!==t.maxW?void 0:t.w,maxH:void 0!==t.maxH?void 0:t.h});default:return t}}))})}))},n.onLayoutChange=function(t){n.setState((function(e){return Object(c.a)({},e,{layout:t})}))},n.commitLayout=function(){n.props.setLayout(n.state.layout.map((function(t){switch(!0){case void 0!==t.maxH:return Object(c.a)({},t,{h:0});default:return t}})),i.Editor)},n}return Object(d.a)(e,t),Object(m.a)(e,[{key:"render",value:function(){return r.a.createElement("div",{className:"editor"},r.a.createElement("h1",null,"Editor"),r.a.createElement("div",{className:"main-action"},r.a.createElement("button",{className:"save",onClick:this.commitLayout},"Save Layout")),this.mapButtons(),r.a.createElement(v.a,{width:600,margin:[0,0],draggableCancel:".non-draggable",isDraggable:!0,isResizable:!0,compactType:"vertical",layout:this.state.layout,cols:4,rowHeight:1,onLayoutChange:this.onLayoutChange},this.mapItems()))}},{key:"mapButtons",value:function(){var t=this;return this.state.layout.map((function(e){return r.a.createElement("button",{key:e.i,"data-index":e.i,onClick:t.toggleSingleElement},"Toggle ",e.i)}))}},{key:"mapItems",value:function(){var t=this;return this.state.layout.map((function(e){return r.a.createElement("div",{key:e.i,className:"item ".concat(t.isHidden(e)?"hidden":"")},e.i)}))}},{key:"isHidden",value:function(t){return void 0!==t.maxH}}]),e}(r.a.PureComponent),b=function(t){function e(){var t,n;Object(s.a)(this,e);for(var a=arguments.length,r=new Array(a),o=0;o<a;o++)r[o]=arguments[o];return(n=Object(h.a)(this,(t=Object(y.a)(e)).call.apply(t,[this].concat(r)))).toggleSingleElement=function(t){var e=t.currentTarget.dataset.index;e&&n.props.toggleElement(e)},n.changeInterceptor=function(t){n.props.onLayoutChange(t,i.View)},n}return Object(d.a)(e,t),Object(m.a)(e,[{key:"render",value:function(){return r.a.createElement("div",{className:"view"},r.a.createElement("h1",null,"View"),this.mapButtons(),r.a.createElement(v.a,{width:600,margin:[0,0],draggableCancel:".non-draggable",isDraggable:!1,isResizable:!1,verticalCompact:!0,compactType:"vertical",layout:this.props.layout,cols:4,rowHeight:1,onLayoutChange:this.changeInterceptor},this.mapItems()))}},{key:"mapButtons",value:function(){var t=this;return this.props.layout.sort((function(t,e){return Number(t.i)>Number(e.i)?1:-1})).map((function(e){return r.a.createElement("button",{key:e.i,"data-index":e.i,onClick:t.toggleSingleElement},"Toggle ",e.i)}))}},{key:"mapItems",value:function(){var t=this;return this.props.layout.map((function(e){return r.a.createElement("div",{key:e.i,className:"item ".concat(t.isHidden(e)?"hidden":"")},e.i)}))}},{key:"isHidden",value:function(t){return void 0!==t.maxH&&0===t.h}}]),e}(r.a.PureComponent);function w(t,e,n,i){return n>=t&&n<e||i>t&&i<=e}function x(t,e){var n,i=t.x,a=t.x+t.w,r=e.sort((function(t,e){switch(!0){case t.y>e.y:return 1;case t.y<e.y:return-1;default:return 0}})),o=r.filter((function(e){var n=e.x,r=e.x+e.w,o=0===t.h&&void 0!==t.maxH?t.maxH:t.h;return t.i!==e.i&&t.y+o===e.y&&w(i,a,n,r)}));return o.length?o.map((function(t){return{i:t.i,x:t.x,y:t.y}})):r.filter((function(e){var r=e.x,o=e.x+e.w;if(!n){var u=e.i!==t.i&&e.y>=t.y+t.h&&w(i,a,r,o);return u&&(n=e),u}return e.i!==t.i&&e.y===n.y&&w(i,a,r,o)}))}n(35),n(36);var E=function(t){function e(){var t,n;Object(s.a)(this,e);for(var a=arguments.length,r=new Array(a),o=0;o<a;o++)r[o]=arguments[o];return(n=Object(h.a)(this,(t=Object(y.a)(e)).call.apply(t,[this].concat(r)))).state={layout:[],hiddenElements:[]},n.layoutYSiblingMap={},n.setLayout=function(t,e){e===i.Editor&&n.buildLayoutYSiblingMap(t),n.setState((function(a){return Object(c.a)({},a,{layout:t,hiddenElements:e===i.Editor?n.buildHiddenElementState(t):a.hiddenElements})}))},n.toggleElement=function(t){var e=n.state.layout.find((function(e){return e.i===t}));if(e)switch(!0){case e.i===t&&void 0===e.maxH&&0!==e.h:return n.hideElement(t);case e.i===t&&void 0!==e.maxH&&0===e.h:return n.showElement(t);default:return}},n}return Object(d.a)(e,t),Object(m.a)(e,[{key:"render",value:function(){return r.a.createElement("div",{className:"base"},r.a.createElement(p,{setLayout:this.setLayout}),r.a.createElement(b,{layout:this.state.layout,toggleElement:this.toggleElement,onLayoutChange:this.setLayout}))}},{key:"buildHiddenElementState",value:function(t){var e=[],n=!0,i=!1,a=void 0;try{for(var r,o=t[Symbol.iterator]();!(n=(r=o.next()).done);n=!0){var u=r.value;void 0!==u.maxH&&e.push({i:u.i,bottomSiblings:x(u,t).map((function(t){return t.i}))})}}catch(l){i=!0,a=l}finally{try{n||null==o.return||o.return()}finally{if(i)throw a}}return e}},{key:"buildLayoutYSiblingMap",value:function(t){var e=!0,n=!1,i=void 0;try{for(var a,r=t[Symbol.iterator]();!(e=(a=r.next()).done);e=!0){var o=a.value;this.layoutYSiblingMap[o.i]=x(o,t).map((function(t){return t.i}))}}catch(u){n=!0,i=u}finally{try{e||null==r.return||r.return()}finally{if(n)throw i}}console.log("Built Y Sibling map:",this.layoutYSiblingMap)}},{key:"hideElement",value:function(t){this.setState((function(e){var n=e.layout.find((function(e){return e.i===t}));return Object(c.a)({},e,{layout:e.layout.map((function(e){switch(e.i){case t:return Object(c.a)({},e,{w:0,h:0,maxH:e.h,maxW:e.w,static:!0});default:return e}})),hiddenElements:n?[].concat(Object(l.a)(e.hiddenElements),[{i:n.i,bottomSiblings:x(n,e.layout).map((function(t){return t.i}))}]):e.hiddenElements})}))}},{key:"showElement",value:function(t){var e=this,n=this.state.hiddenElements.find((function(e){return e.i===t}));n&&this.setState((function(i){var a=i.layout.map((function(e){switch(e.i){case t:return Object(c.a)({},e,{w:e.maxW,h:e.maxH,maxW:void 0,maxH:void 0,static:!1});default:return e}}));return Object(c.a)({},i,{layout:e.normalizePositions(a),hiddenElements:i.hiddenElements.filter((function(t){return t.i!==n.i}))})}),(function(){return console.log("Next state:",e.state)}))}},{key:"normalizePositions",value:function(t){for(var e=this,n=Object.keys(this.layoutYSiblingMap),i=Object(l.a)(t),a=function(){var t=o[r],n=i.find((function(e){return e.i===t}));if(!n||n.static)return"continue";i=e.mapElementSiblingPositions(n,i)},r=0,o=n;r<o.length;r++)a();return console.log("Mapped new layout:",JSON.parse(JSON.stringify(i))),i}},{key:"mapElementSiblingPositions",value:function(t,e,n){for(var i=this,a=Object(l.a)(e),r=this.layoutYSiblingMap[t.i],o=0,u=a.length;o<u;o++){var s=a[o];r.includes(s.i)&&(s.static&&function(){var e=i.mapElementSiblingPositions(s,a,void 0!==n?n:t.y+t.h);a=a.map((function(t){var n=e.find((function(e){return e.i===t.i}));return n||t}))}(),void 0===n&&(a[o]=Object(c.a)({},s,{y:t.y+t.h})),void 0!==n&&n>=a[o].y&&(a[o]=Object(c.a)({},s,{y:n})))}return a}}]),e}(r.a.PureComponent);Boolean("localhost"===window.location.hostname||"[::1]"===window.location.hostname||window.location.hostname.match(/^127(?:\.(?:25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)){3}$/));u.a.render(r.a.createElement(E,null),document.getElementById("root")),"serviceWorker"in navigator&&navigator.serviceWorker.ready.then((function(t){t.unregister()}))}},[[19,1,2]]]);
//# sourceMappingURL=main.06bf8985.chunk.js.map