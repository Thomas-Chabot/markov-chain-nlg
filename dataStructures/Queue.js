// Code written by Michael Mitrakos, from https://initjs.org/implement-a-queue-in-javascript-de306a8821c

// This Stack is written using the pseudoclassical pattern

// Creates the queue
var Queue = function(e) {
    this.storage = {};
    this.count = 0;
    this.lowestCount = 0;

    for (var i in e)
      this.push (e [i]);
}

// Adds a value to the end of the chain
Queue.prototype.push = function(value) {
    // Check to see if value is defined
    if (value) {
        this.storage[this.count] = value;
        this.count++;
    }
}

// Removes a value from the beginning of the chain
Queue.prototype.pop = function() {
    // Check to see if queue is empty
    if (this.count - this.lowestCount === 0) {
        return undefined;
    }

    var result = this.storage[this.lowestCount];
    delete this.storage[this.lowestCount];
    this.lowestCount++;
    return result;
}

// Returns the length of the queue
Queue.prototype.size = function() {
    return this.count - this.lowestCount;
}
Queue.prototype.empty = function() {
  return this.size() === 0;
}

Queue.prototype.get = function (index) {
  return this.storage [this.lowestCount + index];
}

Queue.prototype.join = function (con) {
  var res = "";
  for (var i = this.lowestCount; i < this.count; i++) {
    res += this.storage[i] + con;
  }
  return res;
}

module.exports.Queue = Queue;
