module.exports = function(app){
  var conn = require('./db')();
  var bkfd2Password = require('pbkdf2-password');
  var passport = require('passport');
  var LocalStrategy = require('passport-local').Strategy;
  var hasher = bkfd2Password();
  app.use(passport.initialize());
  app.use(passport.session());

  passport.serializeUser(function(user, done){
    done(null, user.user_id);
  });

  passport.deserializeUser(function(id, done){
    var sql = 'SELECT * FROM users WHERE user_id=?';
    conn.query(sql, [id], function(err, results){
      if(err){
        console.log(err);
        done(null, {message: 'There is no user'});
      }else{
        done(null, results[0]);
      }
    });
  });

  passport.use(new LocalStrategy(
    function(username, password, done){
      var uname = username.trim();
      console.log(uname);
      var pwd = password;
      var sql = 'SELECT * FROM users WHERE user_id=?';
      conn.query(sql, ['local: ' + uname], function(err, results){
        console.log(results)
        if (err){
          return done(null, false, {message: 'Database Error.'});
        }
        else if(results.length==0){
          return done(null, false, {message: 'Incorrect Username.'})
        }
        var user = results[0];
        return hasher({password:pwd, salt:user.salt}, function(err, pass, salt, hash){
          if (hash == user.password){
            done(null, user);
          }else{
            done(null, false, {message: 'Incorrect password.'});
          }
        });
      });
    }
  ));
  return passport;
}


//   passport.use(new FacebookStrategy({
//       clientID: '1602353993419626',
//       clientSecret: '6c7c3f6563511116dbc13b06f81a398a',
//       callbackURL: "/auth/facebook/callback",
//       profileFields:['id', 'email', 'gender', 'link', 'locale', 'name', 'timezone', 'updated_time', 'verified', 'displayName']
//     },
//     function(accessToken, refreshToken, profile, done) {
//       console.log(profile);
//       var authId = 'facebook:'+profile.id;
//       var sql = 'SELECT * FROM users WHERE authId=?';
//       conn.query(sql, [authId], function(err, results){
//         if(results.length>0){
//           done(null, results[0]);
//         } else {
//           var newuser = {
//             'authId':authId,
//             'displayName':profile.displayName,
//             'email':profile.emails[0].value
//           };
//           var sql = 'INSERT INTO users SET ?'
//           conn.query(sql, newuser, function(err, results){
//             if(err){
//               console.log(err);
//               done('Error');
//             } else {
//               done(null, newuser);
//             }
//           })
//         }
//       });
//     }
//   ));
//   return passport;
// }
