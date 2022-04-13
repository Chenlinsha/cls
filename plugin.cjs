const path=require('path');
const fs=require('fs');
const shell=require('shelljs');
class EndingConsolePlugin {
  constructor(options) {
      this.options = options;
  }
  apply(compiler) {
      let data='';
      let paths=this.options.path;
      shell.exec('git log ', {silent:true}, function(code, stdout, stderr) {
        if(stdout!==""){
data=stdout;
        }else{
          data=stderr;
        }
        const __dirname=path.resolve('./dist');
        if(!fs.existsSync(__dirname)){
          fs.mkdirSync(__dirname);
        }
        fs.writeFile(`${paths}/readme.md`,data,(err)=>{
          console.log(data);
        })
      }
      );
      }
      
    
  
}
module.exports = EndingConsolePlugin;
 