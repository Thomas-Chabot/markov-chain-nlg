var File  = require ("./modules/File.js").File;
var Arr   = require ("./modules/ArrayHelper.js");
var Log   = require ("./modules/Log.js").Log;
var Chain = require ("./chaining/Chain.js").Chain;
var Backoff = require ("./chaining/Backoff.js").Backoff;
var Training = require ("./chaining/Training.js").Train;
var Generator = require ("./chaining/Generator.js").Generator;

const K = 5;
const MIN_BACKOFF = 1;
const MIN_OPTS = 2;

const FILE_PATH = "./data/instantVideoReviews.json"
                  //"./data/discord.json";

var startWords;

Chain.init ({minOpts: MIN_OPTS});

function doTraining (data) {
  if (!Array.isArray(data)) data = [data];

  var startingWords = [ ];
  if (data.length === 1 && Array.isArray (data [0])) data = data [0];

  for (var review of data) {
    if (review === '') continue;
    let training = new Training (review, K);
    startingWords.push (training.train ());
  }

  return startingWords;
}

function doBackoff () {
  Log.msg ("Starting backing off process ");
  var backoff = new Backoff (MIN_OPTS);
  backoff.apply (MIN_BACKOFF);
}

function generate(maxLen) {
  var gen = new Generator (K, startWords);
  return gen.generate (maxLen);
}

function train (data, shouldBackoff) {
  var start = doTraining (data);
  if (shouldBackoff) doBackoff();

  if (startWords)
    startWords = startWords.concat (start);
  else
    startWords = start;
}

function trainTxt (txtFile, split) {
  if (!txtFile) return false;

  if (!split) split = "\n";
  return new Promise ((fulfill, reject) => {
    File.read (txtFile).then ((data) => {
      data = data.replace(/\r/g, "");
      train (data.split (split), true);
      fulfill ();
    }, reject);
  });
}

function trainJson (filePath, doBackoff) {
  if (!filePath) return false;

  return new Promise ((fulfill, reject) => {
    try{
      File.readJSON(filePath).then ((data) => {
        train (data, doBackoff);
        fulfill();
      }, reject);
    } catch (err) {
      reject (err);
    }
  });
}

function run () {
  trainTxt("data/words.txt").then (()=>{
    var result = generate (250);
    console.log ("Generated: ", result);
  }, (err) => {
    console.error (err.stack || err)
  });
}

module.exports.train = train;
module.exports.trainTxt = trainTxt;
module.exports.generate = generate;
module.exports.init = trainJson; // TODO rename

if (require.main === module)
  run ();
