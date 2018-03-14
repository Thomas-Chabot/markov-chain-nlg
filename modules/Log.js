var File = require ("./File.js").File;

var logRoot = "logs";
var paths = {
  log: logRoot + "/log.out",
  err: logRoot + "/error.out"
};

class Log {
  static msg (...message) {
    return this._doLog (paths.log, ...message);
  }

  static error (...message) {
    return this._doLog (paths.err, ...message);
  }

  static _doLog (path, ...msg) {
    var message = msg.join (" ");
    File.write (path, message + "\n").then (console.log, console.error);
  }
}

module.exports.Log = Log;
