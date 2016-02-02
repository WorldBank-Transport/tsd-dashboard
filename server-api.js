
// BASE SETUP
// =============================================================================

// call the packages we need
var express    = require('express');        // call express
var app        = express();                 // define our app using express
var bodyParser = require('body-parser');

// configure app to use bodyParser()
// this will let us get the data from a POST
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

var port = process.env.PORT || 9080;        // set our port


// Database SETUP
const Datastore = require('nedb');
const db = {};
const DATABASE_PATH = __dirname + '/data/';
console.log('path to database: ' + DATABASE_PATH);
db.users = new Datastore({ filename: `${DATABASE_PATH}/users.json`, autoload: true });
db.data = new Datastore({ filename: `${DATABASE_PATH}/data.json`, autoload: true });
db.share = new Datastore({ filename: `${DATABASE_PATH}/share.json`, autoload: true });

/**
 * Enabling cross cross domain request
 * @param  {[type]} req   [description]
 * @param  {[type]} res   [description]
 * @param  {[type]} next) {               var oneof [description]
 * @return {[type]}       [description]
 */
app.use(function(req, res, next) {
  var oneof = false;
  if (req.headers.origin) {
    res.header('Access-Control-Allow-Origin', req.headers.origin);
    oneof = true;
  }
  if (req.headers['access-control-request-method']) {
    res.header('Access-Control-Allow-Methods', req.headers['access-control-request-method']);
    oneof = true;
  }
  if (req.headers['access-control-request-headers']) {
    res.header('Access-Control-Allow-Headers', req.headers['access-control-request-headers']);
    oneof = true;
  }
  if (oneof) {
    res.header('Access-Control-Max-Age', 60 * 60 * 24 * 365);
  }
  // intercept OPTIONS method
  if (oneof && req.method == 'OPTIONS') {
    res.status(200);
    res.send('ok');
  } else {
    next();
  }
});

const createError = (errorCode, errorMessage) => {
  return {
    code: errorCode,
    message: errorMessage,
  };
};

const createResponse = (code, object) => {
  return {
    code: code,
    object: object,
  };
};

// Disable root path
app.get('/', function(req, res) {
  res.status(400);
  res.send('error.not-found.invalid-api');
});

app.get('/users', function(req, res) {
  db.users.find({ u: 'admin' }, function (err, docs) {
    if (err) {
      console.err(err);
      res.json(createError(500, 'error.ise.database-error'));
    } else {
      console.log(docs);
      res.json(docs);
    }
  });
});

app.post('/security', function(req, res) {
  const user = req.body.u;
  const password = req.body.p;
  if (!user || !password) {
    res.json(createError(400, 'error.bad-request.invalid-parameters'));
  }
  db.users.findOne({ u: user }, function (err, docs) {
    if (err) {
      res.json(createError(500, 'error.ise.database-error'));
    } else {
      if (!docs) {
        res.json(createError(404, 'error.not-found.user-not-found'));
      } else {
        if(user == docs.u && password == docs.p) {
          res.json(createResponse(200, docs));
        } else {
          res.json(createError(400,'error.bad-request.invalid-user-password'));
        }
      }
    }
  });
});

app.get('/property', function(req, res) {
  const propName = req.query.p;
  if (!propName) {
    res.json(createError(400, 'error.bad-request.invalid-parameters'));
  } else {
    db.data.findOne({ p: propName }, function (err, doc) {
      if (err) {
        res.json(createError(500, 'error.ise.database-error'));
      } else {
        if (!doc) {
          res.json(createError(404, 'error.not-found.property-not-found'));
        } else {
          res.json(createResponse(200, doc));
        }
      }
    });
  }
});

app.post('/properties', function(req, res) {
  const userId = req.body.userId;
  const properties = req.body.properties;
  if (!userId) {
    res.json(createError(400, 'error.bad-request.invalid-parameters'));
  } else {
    db.users.findOne({ _id: userId }, function (err, doc) {
      if (err) {
        res.json(createError(500, 'error.ise.database-error'));
      } else {
        if (!doc) {
          res.json(createError(400, 'error.bad-request.invalid-user'));
        } else {
          properties.forEach(property => {
            db.data.update({ p: property.p }, property, {}, function (err, numReplaced) {
              if(err || numReplaced !== 1) {
                res.json(createError(500, 'error.ise.database-error'));  
              }
            });
          });
          res.json(createResponse(200, properties));
        }
      }
    });
  }
});

app.post('/share', function(req, res) {
  db.share.insert(req.body, function (err, newDoc) {
    if (err) {
      res.json(createError(500, 'error.ise.database-error'));
    } else {
      res.json(createResponse(200, {shareId: newDoc._id}));
    }
  });
});

app.get('/share', function(req, res) {
  const id = req.query.id;
  if (!id) {
    res.json(createError(400, 'error.bad-request.invalid-parameters'));
  } else {
    db.share.findOne({ _id: id }, function (err, doc) {
      if (err) {
        res.json(createError(500, 'error.ise.database-error'));
      } else {
        if (!doc) {
          res.json(createError(404, 'error.not-found.share-not-found'));
        } else {
          res.json(createResponse(200, doc));
        }
      }
    });
  }
});

// START THE SERVER
// =============================================================================
app.listen(port);
console.log('Starting API at: ' + port);