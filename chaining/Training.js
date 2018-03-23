var Chain = require ("./Chain.js").Chain;
var Kgram = require ("./Kgram.js").Kgram;
var Seq   = require ("../modules/Sequence.js");

class Train {
  constructor (wordset, k) {
    this._kgram = new Kgram (k);
    this._words = this._parse (wordset);
  }

  train(){
    for (var word of this._words) {
      Chain.addTransition (this._kgram.toString (), word);
      this._kgram.addToChain (word);
    }

    return this._words [0];
  }

  _parse (wordset) {
    return Seq.parse (wordset);
  }
}

module.exports.Train = Train;
