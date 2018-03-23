var main = require ("./main.js");
var express = require ("express");
var app     = express();

const MAIN_FILE_PATHS = ["data/discord.json"];
const MAIN_PORT = 5050;

app.get ("/generate", (req, res) => {
  res.send (main.generate ());
})

function start (port, filePaths) {
  if (!filePaths) filePaths = MAIN_FILE_PATHS;
  if (!port) port = MAIN_PORT;

  return new Promise ((fulfill, reject) => {
    function doInit (index) {
      if (index >= filePaths.length) return finish ();
      main.init (filePaths [index], index === filePaths.length - 1).then(() => {
        doInit(index+1)
      });
    }
    function finish () {
      app.listen (port, () => {
        fulfill ();
      });
    }
    doInit (0);
  });
}

if (require.main === module)
  start ().then(()=>{
    console.log ("Server is listening");
  }, console.error);

module.exports.generate = main.generate;
module.exports.trainTxt = main.trainTxt;
module.exports.train    = main.train;
module.exports.start = start;
