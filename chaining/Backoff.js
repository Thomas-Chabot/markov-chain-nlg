var Chain = require ("./Chain.js").Chain;
var Seq   = require ("../modules/Sequence.js");
var Log   = require ("../modules/Log.js").Log;

class Backoff {
  constructor (minWords) {
    this._min = minWords;
  }

  apply () {
    var chains = Chain.getRelationships ();
    Chain.clear ();
    this._doApply (chains);
  }

  _doApply (keys) {
    var needsUpdate = true;
    while (needsUpdate) {
      global.gc ();
      [keys, needsUpdate] = this._shorten (keys);

      Log.msg ("Continuing to next apply level");
    }
  }

  _shorten (keys) {
    var shortened = { };
    var didUpdate = false;

    for (var seq in keys) {
      var options = keys [seq];
      if (options.length >= this._min) {
        this._update (seq, options);
        continue;
      }

      var short = Seq.shorten (seq);
      if (!short) {
        this._update (seq, options);
        continue;
      }

      this._merge (shortened, short, options);
      didUpdate = true;
    }

    return [shortened, didUpdate];
  }

  _update (seq, options) {
    Chain.update (seq, options);
  }

  _merge (results, key, opts) {
    var newOpts = results[key] ? results[key].concat (opts) : opts.slice ();
    results [key] = newOpts;
  }
}

module.exports.Backoff = Backoff;
