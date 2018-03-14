var main = require ("./main.js");
var express = require ("express");
var app     = express();

app.get ("/generate", (req, res) => {
  res.send (main.generate ());
})

function start (port, ...data) {
  return new Promise ((fulfill, reject) => {
    main.init (...data).then (()=>{
      app.listen (port, () => {
        fulfill ();
      })
    }, reject);
  });
}

module.exports.generate = main.generate;
module.exports.start = start;
