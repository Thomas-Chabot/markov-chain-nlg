const IS_CHAR = false;

function cutFirst (sequence) {
  var results = IS_CHAR ? sequence.match (/. (.+$)/) : sequence.match(/ (.+$)/)

  if (results) return results[1];
  return null;
}

function parse (words) {
  return words.split (IS_CHAR ? '' : ' ');
}

function length (sequence) {
  return (sequence.match(/ /g) || []).length + 1;
}

module.exports.shorten   = cutFirst;
module.exports.length    = length;
module.exports.parse     = parse;
module.exports.separator = IS_CHAR ? '' : ' ';
