var Random = require ("./Random.js");

function random (array) {
  return array [Random.between (0, array.length - 1)];
}

function unique (array) {
  var c = [ ];
  var found = { };

  for (var i in array) {
    var word = array [i];
    if (found[word]) continue;

    found [word] = true;
    c.push (word);
  }

  return c;
}

function copy (array) {
  return array.slice();
}

module.exports.random = random;
module.exports.copy   = copy;
