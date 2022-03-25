const path = require('path');
const fs = require('fs');
const vm = require('vm');

function Module(id) {
    this.id = id;
    this.exports = {};
}
Module.extensions = {}
Module.extensions['.js'] = function (module) {
    let script = fs.readFileSync(module.id, 'utf8');
    let content = wrapper[0] + script + wrapper[1];
    let fn = vm.runInThisContext(content);//转化为fn
    let __dirname = path.dirname(module.id);
    fn.call(module.exports, module.exports, req, module, __dirname, module.id);//fn执行
}
let wrapper = [
    '(function(exports,require,module,__filename,__dirname){\r\n',
    '\r\n})'
]
// 拿到要加载的文件绝对路径。没有后缀的尝试添加后缀
Module._resolveFilename = function (id) {
    let absolutePath = path.resolve(__dirname, id);
    if (fs.existsSync(absolutePath)) {
        return absolutePath;
    }
    let extensions = Object.keys(Module.extensions);
    for (let i = 0; i < extensions.length; i++) {
        let ext = extensions[i];
        let absolutePath = path.resolve(__dirname, id + ext);
        if (fs.existsSync(absolutePath)) {
            return absolutePath;
        }
    }
}


function req(id) {
    let _filename = Module._resolveFilename(id);
    let module = new Module(_filename);
    // 加载相关模块 （就是给这个模块的exports赋值）
    tryModuleLoad(module); // module.exports = {}
    return module.exports;
}

function tryModuleLoad(module) {
    let ext = path.extname(module.id);
    Module.extensions[ext](module)//尝试加载模块
}
let a = req('./a.js');
console.log(a);


