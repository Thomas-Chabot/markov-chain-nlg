var Queue = require ("../dataStructures/Queue.js").Queue;

class Kgram {
  constructor (k) {
    this._k = k;
    this._chain = new Queue ();
  }


  toString () { return this._chain.join (" "); }
  addToChain (newWord) {
    var chain = this._chain;

    if (chain.size() >= this._k)
      chain.pop ();

    chain.push (newWord);
  }
  reset () { this._chain = new Queue (); }
}

module.exports.Kgram = Kgram;
