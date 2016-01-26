const Datastore = require('nedb');
const db = {};
const DATABASE_PATH = '/data/';

db.users = new Datastore({ filename: `${__dirname}${DATABASE_PATH}/users.json`, autoload: true });
db.data = new Datastore({ filename: `${__dirname}${DATABASE_PATH}/data.json`, autoload: true });

db.users.findOne({ u: 'admin' }, function (err, doc) {
  if (err) {
  	console.err("Error trying to find admin user: ", err);
  }
  console.log("found doc: ", doc);
  if (!doc) {
  	db.users.insert({ u: 'admin', p: 'admin'}, function (err, newDocs) {
      if (err) {
        console.err(err);
      } else {
        console.log("inserted doc", newDocs);
      }
    });
  }
});
