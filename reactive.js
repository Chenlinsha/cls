/**
 * 实现4个函数
 * 需要用到Proxy构造函数
 */

//这个函数用于创建浅的响应式对象也就是只代理第一层
/**
 * obj={
//  *   a:{
//  *    b:1
//  *  }
//  * }
 * 例如这个对象 只有在访问obj.a的时候会被代理 obj.a.b不会被代理
 */
const obj1 = {
  a: {
    b: 1
  }
}
const readhandle={
  get(obj,prop){
    return Reflect.get(obj, prop)
  },
  set(obj,prop,value){
    console.warn(`the${prop}set to${value}faild,beacuse the object is readonly.`)
  }

}
const handle = {
  get(obj, prop) {
    console.log('拦截get', prop);
    return Reflect.get(obj, prop)
  },
  set(obj, prop, value) {
    console.log('拦截set', prop, value);
    return Reflect.set(obj, prop, value)
  }
}

function shallowReactive(obj) {
  //your code
  if (obj && typeof (obj) === "object") {
    return new Proxy(obj, handle)
  } else {
    return obj
  }
}


//这个创建只读的对象
function readonly(obj) {
  //your code
  if (obj && typeof (obj) === "object") {
    Object.keys(obj).forEach(key => {
      obj[key] = readonly(obj[key])
    })
    return new Proxy(obj, readhandle)
  } else {
    return obj
  }
}

//这个创建浅的只读的对象 也就是说只有第一层是只读的 更深层的数据是可以修改的
function shallowReadonly(obj) {
  if (obj && typeof (obj) === "object") {
    return new Proxy(obj, readhandle)
  } else {
    return obj
  }

}

//所有的数据都会被代理
function reactive(obj) {
  //your code
  if (obj && typeof (obj) === "object") {
    Object.keys(obj).forEach(key => {
      obj[key] = reactive(obj[key])
    })
    return new Proxy(obj, handle)
  } else {
    return obj
  }
  // return reactiveObj;
}
const a= shallowReactive(obj1)
const b=reactive(obj1)
const c=readonly(obj1)
c.a=1
c.a.b=2

// const data=shallowReactive({
//   name:'aaa',
//   face:{
//     eyes:"small"
//   }
// })
// data.name
// data.name="123"
