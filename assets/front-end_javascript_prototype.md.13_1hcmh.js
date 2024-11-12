import{_ as o,o as t,c as e,R as c}from"./chunks/framework.0ARc0mp4.js";const _="/blog/assets/原型链.7KrGxOAT.png",y=JSON.parse('{"title":"原型链","description":"原型链","frontmatter":{"title":"原型链","head":[["meta",{"name":"description","content":"原型链"}],["meta",{"name":"keywords","content":"js ES6 原型链 prototype __proto__"}]]},"headers":[],"relativePath":"front-end/javascript/prototype.md","filePath":"front-end/javascript/prototype.md","lastUpdated":1711386344000}'),d={name:"front-end/javascript/prototype.md"},p=c('<p><img src="'+_+'" alt="原型链" loading="lazy" decoding="async"></p><div class="tip custom-block"><p class="custom-block-title">总结</p><ul><li><p>需要牢记两点</p><ol><li><code>__proto__</code>和<code>constructor</code>属性是对象所独有的</li><li><code>prototype</code>属性是函数所独有的，因为函数也是一种对象，所以函数也拥有<code>__proto__</code>和<code>constructor</code>属性</li></ol></li><li><p><code>prototype</code>属性的作用就是让该函数所实例化的对象们都可以找到公用的属性和方法，即<code>u.__proto__ === User.prototype</code></p></li><li><p><code>constructor</code>属性的含义就是指向该对象的构造函数，所有函数(<em>此时看成对象</em>)最终的构造函数都指向<code>Function</code></p></li><li><p><code>__proto__</code>属性的作用就是：当访问一个对象的属性时，如果该对象内部不存在这个属性，那么就会去它的<code>__proto__</code>属性所指向的那个对象(父对象)里找，一直找，直到<code>__proto__</code>属性的终点<code>null</code>，再往上找就相当于在<code>null</code>上取值，会报错。通过<code>__proto__</code>属性将对象连接起来的这条链路即所谓的「<strong>原型链</strong>」</p></li></ul></div>',2),r=[p];function s(n,a,i,l,m,u){return t(),e("div",null,r)}const g=o(d,[["render",s]]);export{y as __pageData,g as default};
