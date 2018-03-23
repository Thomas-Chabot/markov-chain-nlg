var Arr = require ("../modules/ArrayHelper.js");
var Log = require ("../modules/Log.js").Log;

class Chain {
  static init(opts){
    this._chains  = { };
    this._didInit = true;

    this._minOptions = opts.minOpts;
  }

  static has (key){ return this._chains [this._chain(key)] !== undefined; }
  static get (key) { return this._chains [this._chain(key)]; }
  static update (key, value){ this._chains [this._chain(key)] = value; }
  static delete (key){ delete this._chains [this._chain(key)]; }
  static remove (key) { this._chains [this._chain (key)] = null; }
  static clear(){ this._chains = { }; }

  static add (key, values) {
    var origValues = this.get (key);
    var newValues = origValues ? origValues.concat (values) : values;

    this.update (key, newValues);
  }

  static each (f) {
    for (var key of this._chains)
      f (key, this._chains [key]);
  }

  static getWords(){ return Object.keys (this._chains); }
  static getRelationships(){ return this._chains; }

  static addTransition (v, w) {
    if (!this._didInit)
      this.init();

    if (!v) return;

    var t = this.has (v) ? this.get(v) : [ ];
    t.push (w);

    this.update (v, t);
  }

  static next (v) {
    if (!this.has (v)) return null;

    var tab = this.get (v);
    return Arr.random (tab);
  }

  static toString () {
    var chains = "";
    this.each ((word, values) => {
      chains += word + ": " + values.join(", ") + "\n";
    });
    return chains;
  }

  static _chain (key) {
    return key;
  }

  static _copyWords (words) {
    var res = [ ];
    for (var word of words) {
      res.push (word.slice (0));
    }
    return res;
  }
}

module.exports.Chain = Chain;
