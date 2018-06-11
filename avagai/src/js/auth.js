module.exports = function(app){
  var conn = require('./db')();
  var bkfd2Password = require("pbkdf2-password");
  var hasher = bkfd2Password();
  var express = require('express');
  var route = express.Router();
  var passport = require('./passport')(app);
  var flash = require('connect-flash');

  route.use(flash());

  route.get('/login', function(req, res){
    var err_msg = req.flash('error');
    res.render('auth/login', {err: err_msg[0]});
  });

  route.post('/login',
    passport.authenticate('local',
      { successRedirect: '/survey/profile',
        failureRedirect: '/auth/login',
        failureFlash: true})
  );

  route.get('/register', function(req, res){
    res.render('auth/register');
  });

  route.post('/register', function(req, res){

    var email = req.body.username.trim();
    var pwd = req.body.password.trim();
    var fname = req.body.first_name.trim();
    var lname = req.body.last_name.trim();

    console.log(email.length);
    console.log(pwd.length);
    console.log(fname.length);
    console.log(lname.length);

    //check every slot is not empty
    if (email == null || email.length == 0){
      var err_msg = 'empty';
      res.render('auth/register', {data:err_msg});
      return;
    }

    if (email.length > 100){
      var err_msg = 'email';
      res.render('auth/register', {data:err_msg});
      return;
    }

    if (pwd == null || pwd.length == 0){
      var err_msg = 'empty';
      res.render('auth/register', {data:err_msg});
      return;
    }

    if (fname == null || fname.length == 0){
      var err_msg = 'empty';
      res.render('auth/register', {data:err_msg});
      return;
    }

    if (lname == null || lname.length == 0){
      var err_msg = 'empty';
      res.render('auth/register', {data:err_msg});
      return;
    }

    //check type of email and password
    var re = /^(([^<>()[\]\\.,;:\s@\"]+(\.[^<>()[\]\\.,;:\s@\"]+)*)|(\".+\"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
    if (!re.test(email)){
      var err_msg = 'email';
      res.render('auth/register', {data:err_msg});
      return;
    }
    if (! (pwd.length > 6)){
      var err_msg = 'password';
      res.render('auth/register', {data:err_msg});
      return;
    }

    var date = new Date();
    var reg_date = date.getFullYear() + '-' + date.getMonth() + '-' + date.getDate() + ':' + date.getHours() + '-' + date.getMinutes() + '-' + date.getSeconds();
    hasher({password:req.body.password}, function(err, pass, salt, hash){
      var user = {
        user_id : 'local: ' + req.body.username,
        first_name : req.body.first_name,
        last_name : req.body.last_name,
        password: hash,
        salt: salt,
        register_date: reg_date
      };
      var sql = 'INSERT INTO users SET ?';
      conn.query(sql, user, function(err, results){
        if (err){
          console.log(err)
          var err_msg = 'email_exists'
          //handle duplicate entry -> 이미 존재하는 아이디 입니다.
          res.render('auth/register', {data:err_msg})
          return
        }
        else{
          req.login(user, function(err){
            req.session.save(function(){
              res.redirect('/survey/profile');
            });
          });
        }
      });
    });
  });

  route.get('/logout', function(req, res){
    req.logout();
    res.redirect('/');
  });

  return route;
}
