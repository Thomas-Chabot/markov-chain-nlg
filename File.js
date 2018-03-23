var fs = require ("fs");
var JSONStream = require ("JSONStream");

class File {
  static read (filePath) {
    return new Promise((fulfill, reject) => {
      fs.readFile (filePath, (err, contents) => {
        if (err) reject (err);
        else {
          fulfill (contents.toString ());
        }
      });
    });
  }

  static readJSON (filePath) {
    return new Promise ((fulfill, reject) => {
      var data = fs.createReadStream(filePath)
                   .pipe (JSONStream.parse ('reviewText'));

      var results = [ ];
      data.on ('data', (data) => {
        results.push (data);
      })

      data.on ('end', ()=>{
        fulfill (results);
      });
      /*
      .then ((contents) => {
        try {
          fulfill(JSON.parse (contents.toString ()));
        } catch (e) {
          reject (e);
        }
      }, reject);*/
    });
  }

  static write (filePath, data) {
    return new Promise ((fulfill, reject) => {
      fs.appendFile (filePath, data, (err) => {
        if (err) reject (err);
        fulfill ();
      });
    });
  }
}

module.exports.File = File;
