module.exports = function(){
  var express = require('express');
  var session = require('express-session');
  var MySQLStore = require('express-mysql-session')(session);
  var bodyParser = require('body-parser');

  var app = express();
  app.use(bodyParser.urlencoded({ extended: false }));
  app.locals.pretty = true;
  app.set('views', './views');
  app.set('view engine', 'pug');
  app.use(express.static('./public'));

  var options = {
    host: 'localhost',
    port: 3306,
    user: 'root',
    password: 'nuri0619',
    database: 'test1'
  };

  var sessionStore = new MySQLStore(options);

  app.use(session({
      secret: '1q@W3e$R5t^Y7u*I9o)P',
      store: sessionStore,
      resave: false,
      saveUninitialized: true
  }));

  return app;
}
