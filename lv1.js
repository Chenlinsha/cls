const QUEUED_STATE = 0; //已经入队 等待执行
const PROCESSING_STATE = 1; //处理中
const DONE_STATE = 2; //处理完成

/**
 * 实现一个异步并发的控制队列类
 * 1.ArrayQueue是一个类 用于存储操作异步的函数
 *  (1).包含一个_list属性用于存放异步函数
 *  (2).有一个enqueue(入队列的方法)
 *  (3).有一个dequeue(出队列的方法)函数需要有返回值(谁离开了这个队列就返回谁)
 *
 * 2.checkType方法用于检测类型(参数一个value)
 *   如果是Object返回'object'
 *   如果是Array返回'array'
 *   如果是Null返回'null'
 *   如果是Function返回'function'
 *   如果是Number返回'number'
 * 使用采用Object.prototype.toString.call方法
 * 不允许使用if else else if 语句
 * 使用映射表实现(对象或者Map)
 *
 * 3.createError方法用于创建错误信息
 *  参数是data 如果调用createError(data)那么浏览器会报错
 *
 
 *
 * 5.AsyncQueue核心类 用于控制异步并发
 *
 */

function checkType(value) {
    //映射表
    const types = {
        //your code
        '[object String]': 'string',
        '[object Number]': 'number',
        '[object Boolean]': 'boolean',
        '[object Null]': 'null',
        '[object Undefined]': 'undefined',
        '[object Object]': 'object',
        '[object Array]': 'array',
        '[object Function]': 'function',
        '[object Date]': 'date',
        '[object RegExp]': 'regExp',
        '[object Map]': 'map',
        '[object Set]': 'set',
        '[object HTMLDivElement]': 'dom',
        '[object WeakMap]': 'weakMap',
        '[object Window]': 'window',
        '[object Error]': 'error',
        '[object Arguments]': 'arguments',
    };
    return types[Object.prototype.toString.call(value)];
}

function createError(data) {
    throw Error; //your code
}

class ArrayQueue {
    constructor() {
        this._list = [];
    }
    //推入
    enqueue(item) {
        //验证错误
        if (checkType(item) !== "Object") {
            createError(
                "Function 'enqueue' arguments should be Object(类型:AsyncQueueEntry)!"
            );
        }
        //your code
        return true;
    }
    //推出队列 推出谁就返回谁
    dequeue() {
        if (this._list.length === 0) return undefined
        if (this._list.length === 1) return this._list.pop()
        else { //移除并返回数组中的第一个元素
            return this._list.shift(); //your code;
        }
    }
}
// * 4.AsyncQueueEntry是一个类 用于包装单个异步函数为一个对象(包含三个属性)
//  *  (1).item是一个标识符
//  *  (2).callback
//  *  (3).当前state执行的状态 三个状态QUEUED_STATE(开始) PROCESSING_STATE(执行中) DONE_STATE(完成执行)
class AsyncQueueEntry {
    constructor(item, callback) {
        this.result = undefined; //用于保存结果
        this.error = undefined; //用于保存错误
        this.callbacks = undefined; //后期优化用
        //还有三个属性自己补充
        //your code
        this.state = QUEUED_STATE;
        this.callback = callback;
        this.item = item
    }
}

class AsyncQueue {
    constructor({
        name,
        parallelism,
        parent,
        processor,
        getKey
    }) {
        //可能会用到的初始化值
        this._name = name; //队列的名字
        this._parallelism = parallelism; //并发数
        this._processor = processor; //针对队列中的每个条目执行什么操作
        this._getKey = getKey; //函数,返回一个key用来唯一标识每个元素
        this._entries = new Map(); //条目map key:Map (entry)
        this._queued = new ArrayQueue(); //存放的队列
        this._activeTasks = 0; //当前的执行任务个数
        this._willEnsureProcessing = false; //是否将要开始处理
    }
    //加入任务
    add(item, callback) {
        //const newEntry = new AsyncQueueEntry(item, callback);
        this._queued._list.push(item)
        // console.log(this._queued._list);
        processor(item, callback)
        if (this._willEnsureProcessing === false) {
            this._willEnsureProcessing = true;
            setImmediate(this._ensureProcessing.bind(this));
        // callback.apply(this,this.processor)
        //your code
    }}
    //当用户调用完所有的add之后就可以开始执行这个函数
    //也就是执行异步函数 但是执行的个数不能超过parallelism这个最大并发量
    //并且当一个任务完成后 那么_activeTasks<_parallelism时就需要执行下一个异步任务
    //提示:可以使用封装的ArrayQueue类 执行一个就取出来并且让_activeTasks--
    _ensureProcessing() {
        // while (this._activeTasks < this._parallelism) {
        //     if (this._queued._list.length > 0) return
        //     const entry = this._queued.dequeue() === undefined
        //     if (entry === undefined) break;
        //     this._activeTasks++;
        //     entry.state = PROCESSING_STATE;
        //     this._startProcessing(entry)
        // }
            debugger;
    while (this._activeTasks < this._parallelism) {
      const entry = this._queued.dequeue(); //出队 先入先出
      if (entry === undefined) break;
      entry.state = PROCESSING_STATE;
      this._activeTasks++;
      this._startProcessing(entry);
    }
    this._willEnsureProcessing = false;
  }
  _startProcessing(entry) {
    this._processor(entry.item, (e, r) => {
      this._handleResult(entry, e, r);
    });

        //your code
    }
    //执行单个任务
    _startProcessing(entry) {
        this._processor(entry.item, (e, r) => {
            this._handleResult(entry, e, r);
        });
    }
    //处理执行完的结果 例如1.把条目的状态设置为已经完成等;_activeTasks--;重新执行_ensureProcessing;调用callback等
    _handleResult(entry, err, result) {
        //your code
        const callback = entry.callback
        const callbacks = entry.callbacks
        entry.state = DONE_STATE
        entry.callback = undefined
        entry.callbacks = undefined
        entry.result = result
        this._activeTasks--
        if (this._willEnsureProcessing === false) {
            this._willEnsureProcessing = true;
            setImmediate(this._ensureProcessing.bind(this));
        }
    }
}

//这是执行的异步函数
function processor(item, callback) {
    setTimeout(() => {
        console.log(item);
        callback();
    }, 1000);
}

const getKey = (item) => item.key;

const asyncQueue = new AsyncQueue({
    name: "异步队列", //类名
    parallelism: 3, //最大并发数
    processor,
    getKey,
});
const time = Date.now();

//每次调用add都会new AsyncQueueEntry()
asyncQueue.add({
        key: "module1"
    },
    () => {
        console.log(Date.now() - time);
    }
    /*这个回调函数就是AsyncQueueEntry中的callback属性
      也是processor中的参数callback 当processor函数中调用
      callback的时候就会走这个函数(下同)*/
);
asyncQueue.add({
    key: "module2"
}, () => {
    console.log(Date.now() - time);
});
asyncQueue.add({
    key: "module3"
}, () => {
    console.log(Date.now() - time);
});
asyncQueue.add({
    key: "module4"
}, () => {
    console.log(Date.now() - time);
});


/**
 * 最终的打印结果
 *{ key: 'module1' }
  1014  //打印的时间
  { key: 'module2' }
  1015 //打印的时间
  { key: 'module3' }
  1016 //打印的时间
 
  { key: 'module4' }
  2032 //打印的时间
 */

module.exports = AsyncQueue;