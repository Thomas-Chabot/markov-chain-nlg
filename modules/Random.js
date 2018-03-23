function randBetween (min, max) {
  if (max < min){
    console.trace ();
    throw `cannot create a random number between ${min} and ${max}`;
  }
  return Math.floor (Math.random() * (max - min)) + min;
}

module.exports.between = randBetween;
