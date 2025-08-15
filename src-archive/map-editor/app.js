var Module = require('module').Module;
var nodeModulePaths = Module._nodeModulePaths; //backup the original method

Module._nodeModulePaths = function (from) {
  var paths = nodeModulePaths.call(this, from); // call the original method

  //add your logic here to exclude parent dirs, I did a simple match with current dir
  paths = paths.filter(function (path) {
    return path.match(__dirname);
  });
  return paths;
};
