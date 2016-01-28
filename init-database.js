const Datastore = require('nedb');
const db = {};
const DATABASE_PATH = '/data/';

db.users = new Datastore({ filename: `${__dirname}${DATABASE_PATH}/users.json`, autoload: true });
db.data = new Datastore({ filename: `${__dirname}${DATABASE_PATH}/data.json`, autoload: true });

function checkAndSet(dbName, query, object) {
  db[dbName].findOne(query, function (err, doc) {
    if (err) {
      console.err("Error trying to find admin user: ", err);
    }
    if (!doc) {
      db[dbName].insert(object, function (err, newDocs) {
        if (err) {
          console.err(err);
        } else {
          console.log("inserted doc", newDocs);
        }
      });
    }
  });  
}
console.log("Runnin Database Init");

checkAndSet('users', { u: 'admin' }, { u: 'admin', p: 'admin', n: 'Admin Admin'});
checkAndSet('users', { u: 'mark' }, { u: 'mark', p: 'admin', n: 'Mark Irura'});

checkAndSet('data', { p: 'edudash.homepage.year' }, { p: 'edudash.homepage.year', v: '2014'});
checkAndSet('data', { p: 'edudash.homepage.target' }, { p: 'edudash.homepage.target', v: '23 %'});
checkAndSet('data', { p: 'edudash.homepage.query' }, { p: 'edudash.homepage.query', v: 'select * from "lala"'});

checkAndSet('data', { p: 'healthdash.homepage.year' }, { p: 'healthdash.homepage.year', v: '2014'});
checkAndSet('data', { p: 'healthdash.homepage.target' }, { p: 'healthdash.homepage.target', v: '6000'});
checkAndSet('data', { p: 'healthdash.homepage.query' }, { p: 'healthdash.homepage.query', v: 'select * from "lala"'});

checkAndSet('data', { p: 'waterdash.homepage.year' }, { p: 'waterdash.homepage.year', v: '2014'});
checkAndSet('data', { p: 'waterdash.homepage.target' }, { p: 'waterdash.homepage.target', v: '61 %'});
checkAndSet('data', { p: 'waterdash.homepage.query' }, { p: 'waterdash.homepage.query', v: 'select * from "lala"'});

