    
// BASE SETUP
// =============================================================================

// call the packages we need
var express    = require('express');        // call express
var app        = express();                 // define our app using express
var bodyParser = require('body-parser');
var phantom    = require('phantom');

// configure app to use bodyParser()
// this will let us get the data from a POST
app.use(bodyParser.urlencoded({ limit: '50mb', extended: true }));
app.use(bodyParser.json({limit: '50mb'}));

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
  const userId = req.query.userId;
  if (!userId) {
    res.json(createError(400, 'error.bad-request.invalid-parameters'));
  } else  {
    db.users.findOne({ _id: userId }, function (err, doc) {
      if (err) {
        res.json(createError(500, 'error.ise.database-error'));
      } else {
        if (!doc) {
          res.json(createError(400, 'error.bad-request.invalid-user'));
        } else {
          db.users.find({}, function (err, docs) {
            if (err) {
              console.err(err);
              res.json(createError(500, 'error.ise.database-error'));
            } else {
              res.json(createResponse(200, docs));
            }
          });
        }
      }
    });
  }
});

app.post('/user', function(req, res) {
  const userId = req.body.userId;
  const user = req.body.user;
  if (!userId || !user) {
    res.json(createError(400, 'error.bad-request.invalid-parameters'));
  } else  {
    db.users.findOne({ _id: userId }, function (err, doc) {
      if (err) {
        res.json(createError(500, 'error.ise.database-error'));
      } else {
        if (!doc) {
          res.json(createError(400, 'error.bad-request.invalid-user'));
        } else {
          db.users.findOne({ _id: user._id }, function (err, doc) {
            if(err) {
              res.json(createError(500, 'error.ise.database-error'));
            } else {
              if(doc) {
                db.users.update({ _id: user._id }, user, {}, function (err, numReplaced) {
                  if(err || numReplaced !== 1) {
                    res.json(createError(500, 'error.ise.database-error'));
                  } else {
                    res.json(createResponse(200, user));
                  }
                });      
              } else {
                db.users.insert(user, function (err, newUser) {
                  if (err) {
                    res.json(createError(500, 'error.ise.database-error'));  
                  } else {
                    res.json(createResponse(200, newUser));
                  }
                });
              }
            }
          });
        }
      }
    });
  }
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


callbackDone = function(result) {
  console.log('html', html);
};

app.post('/pdf', function(req, res) {
  phantom.create().then(function(ph) {

    ph.createPage().then(function(page) {
      page.property('paperSize', {
        format: 'A3',
        orientation: 'landscape',
        margin: '1cm',
      });
      page.property('viewportSize', {
         width: 3000,
         height: 1000,
      });
      //page.setting('localToRemoteUrlAccessEnabled', true);
      page.setting('javascriptEnabled', true);
      page.setting('resourceTimeout', 20000);
      // page.property('onResourceRequested', function(requestData, networkRequest, debug) {
      //   console.log('requested: ', requestData.url);
      // }, process.env.DEBUG);
      // page.property('onResourceReceived', function(requestData, networkRequest, debug) {
      //   console.log('Received: ', requestData.url);
      // }, process.env.DEBUG);
      
      page.property('content', req.body.content);

      page.evaluate(function() {
        return document.getElementById('pdf-body').outerHTML;
      }).then(function(html){
        setTimeout(function() {
          console.log('about to render');
          var filename = 'tmp/test-' + Date.now() + '.pdf';
          page.render(filename).then(function(result) {
            res.download(filename, filename, function(err) {
              if(err) {
                console.log('error: ', err);
              }
              try {
                console.log('closing');
                page.close();
                ph.exit();
              } catch(phErr) {
                console.log('error: ', phErr);
              }
              res.status(200).end();
            });
          });  
        }, 10000);
      });
    });
  });
});

// START THE SERVER
// =============================================================================
app.listen(port);
console.log('Starting API at: ' + port);