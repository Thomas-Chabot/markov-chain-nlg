var Chain = require ("./Chain.js").Chain;
var Kgram = require ("./Kgram.js").Kgram;
var Arr   = require ("../modules/ArrayHelper.js");
var Seq   = require ("../modules/Sequence.js");
var Random = require ("../modules/Random.js");

class Generator {
  constructor (k, startWords) {
    this._kgram = new Kgram (k);
    this._startWords = startWords || [ ];
  }

  addStartWord (word) {
    this._startWords.push (word);
  }

  generate (maxLength) {
    if (typeof (maxLength) !== 'number') maxLength = 250;

    var result = "";
    var i = 0;

    var word = Arr.random (this._startWords);
    while (true) {
      if (i >= maxLength) break;
      result += word + Seq.separator;

      // end case: end at the end of the sentence with 50/50 probability
      if ((word && word.endsWith(".") && Random.between (1, 2) === 1))
        break;

      // other end case: if we're stuck in a loop, just exit
      if (this._hasLoop (result))
        break;

      this._kgram.addToChain (word);
      word = this._getNext ();

      // if we don't get anything - and the result is null - just break out here.
      if (!word) break;

      i++;
    }

    //console.log (result);
    return result;
  }

  _getNext () {
    var seq = this._kgram.toString ();
    var word;

    //console.log (word, seq);

    while (!word && seq !== null) {
      word = Chain.next (seq);
      if (!word) seq = Seq.shorten (seq);

      //console.log (word, seq);
    }

    //console.log ("\n\n")

    return word;
  }

  _hasLoop (result) {
    result = result.trim ();

    // loop is defined as WORD1 WORD2 WORD3 WORD1 WORD2 WORD3 WORD1 WORD2 WORD3
    // that is, some number of words in a sequence, with the sequence repeating
    var sep           = Seq.separator;
    var sepSize       = sep.length;

    var lastWordIndex = result.lastIndexOf (sep);
    var lastWord      = result.substring (lastWordIndex + sepSize);

    var chainedIndex  = result.substr (0, lastWordIndex - 1).lastIndexOf (lastWord);
    if (chainedIndex < 0) return false;

    var startIndex = chainedIndex + lastWord.length + sepSize ;
    var totalLen   = result.length - startIndex + 1;

    var chain    = result.substring (startIndex);
    var last     = result.substring (startIndex - totalLen, startIndex);

    return last.trim() === chain.trim();
  }
}

module.exports.Generator = Generator;
