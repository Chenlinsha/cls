/**
 * 我们可以通过一个对象来描述dom结构
 * 今天的任务是将虚拟dom转化为真实dom
 */

const virtualDom = {
  type: "div",
  attribute: {
    style: {
      backgroundColor: "red",
      color: "blue",
    },
    class: "root",
    id: "root",
    //可能还会有其他属性
  },
  content: "我是一个div标签", //如果是单闭合标签则值为null
  children: [{
      type: "p",
      attribute: {
        style: {
          marginTop: "20px",
          color: "skyblue",
        },
        class: "children",
        id: "root-children",
        //可能还会有其他属性
      },
      content: "我是一个p标签", //如果是单闭合标签则值为null
      children: [],
    },
    {
      type: "span",
      attribute: {
        style: {
          backgroundColor: "red",
          color: "blue",
        },
        class: "children",
        id: "root-children",
        //可能还会有其他属性
      },
      content: "我是一个span标签", //如果是单闭合标签则值为null
      children: [
        /*这里可能还有的 简单的说这里可能有无限个children 而且children中可能还有children需要递归 */
      ],
    },
  ], //这个元素的子元素
};

//console.log(style);

//上面是一个虚拟dom 请书写一个函数将这个虚拟dom渲染成为真实dom
function getKebabCase(str) {
  let arr = str.split('');
  let result = arr.map((item) => {
      if (item.toUpperCase() === item) {
          return '-' + item.toLowerCase();
      } else {
          return item;
      }
  }).join('');
  return result;
}


function render(virtualDom) {
  let a=[]
  let b=[]
  let {
    type,
    attribute,
    children,content
  } = virtualDom
  let {
    style
  } = attribute
  console.log(children);
  let el = document.createElement(type)
  el.innerHTML=content
  for(let key in attribute){
    if(typeof(virtualDom.attribute[key])=="object"){
    let value=""
    for(let key1 in attribute[key]){
      let keyv=getKebabCase(key1) 
      value=value+`${keyv}:${attribute[key][key1]};`
      console.log(value);
      
      el.setAttribute(key,value)
    }}
  else{el.setAttribute(key,virtualDom.attribute[key])
  }}
  for (k in children) {
    let {
      type,
      attribute,
      content
    } = children[k]
    let myChildren = document.createElement(type)
    el.appendChild(myChildren)
    for(let key in attribute){
      if(typeof(virtualDom.attribute[key])=="object"){
      let value=""
      myChildren.innerHTML=content
      for(let key1 in attribute[key]){
        let keyv=getKebabCase(key1) 
        value=value+`${keyv}:${attribute[key][key1]};`
        console.log(value);
        
        myChildren.setAttribute(key,value)
      }}
    else{myChildren.setAttribute(key,virtualDom.attribute[key])
      if(children[key]==="children"){
        let{children}=children[key]
        render(children)
      }
    }}
    
  document.querySelector('body').appendChild(el)

 
  
  }
}




// console.log();


render(virtualDom)
