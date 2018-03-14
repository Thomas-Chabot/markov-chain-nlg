var File  = require ("./modules/File.js").File;
var Arr   = require ("./modules/ArrayHelper.js");
var Log   = require ("./modules/Log.js").Log;
var Chain = require ("./chaining/Chain.js").Chain;
var Backoff = require ("./chaining/Backoff.js").Backoff;
var Training = require ("./chaining/Training.js").Train;
var Generator = require ("./chaining/Generator.js").Generator;

const K = 25;
const MIN_OPTS = 2;

const FILE_PATH = "./data/instantVideoReviews.json"
                  //"./data/discord.json";

var startWords;

try {
  global.gc();
} catch (e) {
  console.log("You must run program with 'node --expose-gc index.js' or 'npm start'");
  process.exit();
}

Chain.init ({minOpts: MIN_OPTS});

function doTraining (data) {
  var startingWords = [ ];
  if (data.length === 1) data = data [0];

  for (var review of data) {
    let training = new Training (review, K);
    startingWords.push (training.train ());
  }
  return startingWords;
}

function doBackoff () {
  Log.msg ("Starting backing off process ");
  var backoff = new Backoff (MIN_OPTS);
  backoff.apply ();
}

function generate() {
  var gen = new Generator (K, startWords);
  return gen.generate ();
}

function train (data) {
  startWords = doTraining (data);
  doBackoff();
}

function init (filePath) {
  var parsing = filePath ? null : 'reviewText';
  filePath = filePath || FILE_PATH;

  return new Promise ((fulfill, reject) => {
    try{
      File.readJSON(filePath, parsing).then ((data) => {
        train (data);
        fulfill();
      }, reject);
    } catch (err) {
      reject (err);
    }
  });
}

function run () {
  init().then (()=>{
    var result = generate (250);
    console.log (result);
  }, (err) => {
    console.error (err.stack || err)
  });
}

module.exports.train = train;
module.exports.generate = generate;
module.exports.init = init;

if (require.main === module)
  run ();
