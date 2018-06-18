module.exports = function(app, conn){
  var express = require('express');
  var route = express.Router();
  var _ = require('underscore');
  var async = require('async');
  const format = require('string-format');
  format.extend(String.prototype, {})

  var check_registered = function(id){
    //check if id is registered
    var sql = 'SELECT * FROM users WHERE user_id=?';
    conn.query(sql, [id], function(err,result, fields){
        if (err){
          throw err;
        }
        else if (result.length == 0){
          res.redirect('/');
        }
    });
  }

  var check_profile = function(id){
    var sql = 'SELECT * FROM survey_profile WHERE user_id=?';
    conn.query(sql, [id], function(err, result, fields){
      if (err){
        console.log('db error');
        throw err;
      }
      else if (result.length == 0){
        res.redirect('profile');
      }
    });
  }

  var check_fit = function(id){
    var sql = 'SELECT * FROM survey_fit WHERE user_id=?';
    conn.query(sql, [id], function(err, result, fields){
      if (err){
        console.log('db error');
        throw err;
      }
      else if (result.length == 0){
        res.redirect('fit');
      }
    });
  }

  var check_style = function(id){
    var sql = 'SELECT * FROM preference_style WHERE user_id=?'
    conn.query(sql, [id], function(err, result, fields){
      if (err){
        console.log('db error');
        throw err;
      }
      else if (result.length == 0){
        res.redirect('style');
      }
    });
  }

  route.get('/profile', function(req, res){
    var id = req.session.passport.user;
    check_registered(id);

    //pass saved profile data to template
    var sql = 'SELECT * FROM survey_profile WHERE user_id=?';
    conn.query(sql, [id], function(err, result, fields){
      if (err){
        console.log('h1')
        // database error
        res.render('survey/profile')
      }
      else if (result.length==0){
        console.log('h2')
        // empty database
        conn.query('SELECT * FROM users WHERE user_id=?', [id], function(err, result2){
          if(err) throw err;
          else{
            res.render('survey/profile', {name: result2[0]['first_name']});
          }
        });
      }
      else{
        console.log('h3')
        conn.query('SELECT * FROM users WHERE user_id=?', [id], function(err, result2){
          if (err) throw err;
          else{
            res.render('survey/profile', {data: result[0], name: result2[0]["first_name"]});
          }
        });
      }
    });
  });

  route.post('/profile', function(req, res){
    var id = req.session.passport.user;
    var record = {
      user_id: req.session.passport.user,
      height: parseFloat(req.body.height),
      weight: parseFloat(req.body.weight),
      birth: req.body.birth,
      occupation: req.body.job,
      commute: req.body.commute_radio,
      children: req.body.parent,
      shirts_size: req.body.shirt_size,
      shirts_fit: parseInt(req.body.shirt_size2),
      waist_size: req.body.waist_size,
      waist_fit: parseInt(req.body.waist_size2),
      outer_size: req.body.outer_size,
      shoe_size: req.body.shoe_size,
      body_shape: req.body.bodyshape_radio,
      face_shape: req.body.faceshape_radio,
      skin_tone: req.body.skintone_radio
    };

    // check required field is not empty
    if (record.height == null || record.height.length == 0 || isNaN(record.height)){
      var err_msg = 'empty height';
      record.height = '';
      res.render('survey/profile', {msg:err_msg, data:record});
      return;
    }
    if (record.weight == null || record.weight.length == 0 || isNaN(record.weight)){
      var err_msg = 'empty weight';
      record.weight = '';
      res.render('survey/profile', {msg:err_msg, data:record});
      return;
    }
    if (record.birth == null || record.height.birth == 0 || isNaN(record.height)){
      var err_msg = 'empty birth';
      record.birth = '';
      res.render('survey/profile', {msg:err_msg, data:record});
      return;
    }

    // check birthday form
    var re = /[0-9][0-9][0-9][0-9][0-9][0-9][0-9][0-9]/;
    if (! re.test(record.birth)){
      var err_msg = 'birth format';
      record.birth = '';
      res.render('survey/profile', {msg:err_msg, data:record});
      return;
    }

    //check if data already exsits
    var sql = 'SELECT * FROM survey_profile WHERE user_id=?';
    conn.query(sql, [id], function(err, result){
      if (err){
        throw err;
      }
      else if (result.length != 0){
        //update
        var sql = 'UPDATE survey_profile SET ? where user_id=?';
        conn.query(sql, [record, id], function(err, result){
          if (err){
            throw err;
          }
          else{
            res.redirect('fit');
          }
        });
      }
      else{
        //insert
        var sql = 'INSERT INTO survey_profile SET ?';
        conn.query(sql, [record], function(err, result, fields){
          if (err){
            throw err;
          }
          else{
            res.redirect('fit');
            //redirect to next page
          }
        });
      }
    });

  });

  route.get('/fit', function(req, res){
    var id = req.session.passport.user;
    //check if id is registered
    check_registered(id);
    //check user finished profile survey
    check_profile(id);

    //pass saved profile data to template
    var sql = 'SELECT * FROM survey_fit where user_id=?'
    conn.query(sql, [id], function(err, result, fields){
      if (err){
        console.log('db error');
        // database error
        res.render('survey/fit');
      }
      else if (result.length==0){
        console.log('empty db');
        // empty database
        res.render('survey/fit');
      }
      else{
        console.log('db query success');
        //read other data from database
        var data = result[0];
        async.parallel([
          function(callback){
            var sql = 'SELECT tshirts_fit FROM preference_tshirts_fit WHERE user_id=?';
            conn.query(sql, [id], function(err, result){
              callback(err, result)
            }); //end of conn
          },// end of callback func
          function(callback){
            var sql = 'SELECT button_fit FROM preference_button_fit WHERE user_id=?';
            conn.query(sql, [id], function(err, result){
              callback(err, result)
            }); //end of conn
          },// end of callback func
          function(callback){
            var sql = 'SELECT jeans_fit FROM preference_jeans_fit WHERE user_id=?';
            conn.query(sql, [id], function(err, result){
              callback(err, result)
            }); //end of conn
          },// end of callback func
          function(callback){
            var sql = 'SELECT shorts_fit FROM preference_shorts_fit WHERE user_id=?';
            conn.query(sql, [id], function(err, result){
              callback(err, result)
            }); //end of conn
          },// end of callback func
        ], function(err, results){
            if (err) throw err;
            for (var i = 0; i < results.length; i++){
              var key = Object.keys(results[i][0]);
              var temp_data = {};
              temp_data[key] = [];
              for (var j = 0; j < results[i].length; j++){
                var value = Object.values(results[i][j]);
                temp_data[key].push(value[0])
              }
              temp_data[key] = JSON.stringify(temp_data[key]);
              data = _.extendOwn(data, temp_data);
            }
            console.log(data);
            res.render('survey/fit', {data:data});
            });// end of async
      }
    });
  });

  route.post('/fit', function(req, res){
    var id = req.session.passport.user;
    var record = {
      user_id: req.session.passport.user,
      tuck_in: req.body.tuck_in,
      fit_prob2: req.body.fit_prob2,
      fit_prob3: req.body.fit_prob3,
      fit_prob4: req.body.fit_prob4,
      fit_prob5: req.body.fit_prob5,
      fit_prob6: req.body.fit_prob6
    };

    //check if data already exists
    var sql = 'SELECT * FROM survey_fit WHERE user_id=?';
    conn.query(sql, [id], function(err, result){
      if (err){
        throw err;
      }
      if (result.length != 0){
        //delete existing values
        async.parallel([
          function(callback){
            var sql = 'DELETE FROM survey_fit WHERE user_id=?';
            conn.query(sql, [id], function(err, result){
              callback(err, result);
            });
          },
          function(callback){
            var sql = 'DELETE FROM preference_tshirts_fit WHERE user_id=?';
            conn.query(sql, [id], function(err, result){
              callback(err, result);
            });
          },
          function(callback){
            var sql = 'DELETE FROM preference_button_fit WHERE user_id=?';
            conn.query(sql, [id], function(err, result){
              callback(err, result);
            });
          },
          function(callback){
            var sql = 'DELETE FROM preference_jeans_fit WHERE user_id=?';
            conn.query(sql, [id], function(err, result){
              callback(err, result);
            });
          },
          function(callback){
            var sql = 'DELETE FROM preference_shorts_fit WHERE user_id=?';
            conn.query(sql, [id], function(err, result){
              callback(err, result);
            });
          }
        ],function(err, results){
          if (err) throw err;
          console.log(results);
        });

      } //end of else if
      console.log('out of else if')
      async.parallel([
        function(callback){
          var sql = 'INSERT INTO survey_fit SET ?';
          conn.query(sql, [record], function(err, result){
            callback(err, result);
          });
        },
        function(callback){
          var tshirts_fit = req.body.tshirts_fit;
          if (!_.isArray(tshirts_fit)){
            var temp = tshirts_fit;
            var tshirts_fit = [];
            tshirts_fit.push(temp);
          }
          var sql = 'INSERT INTO preference_tshirts_fit (user_id, tshirts_fit) VALUES ';
          for (var i = 0; i < tshirts_fit.length; i++){
            sql = sql + '('+"'"+id+"'"+','+"'"+tshirts_fit[i]+"'"+')';
            if (i!=(tshirts_fit.length-1)) sql = sql + ',';
          }
          conn.query(sql, function(err, result){
            callback(err, result);
          });
        },
        function(callback){
          var button_fit = req.body.button_fit;
          if (!_.isArray(button_fit)){
            var temp = button_fit;
            var button_fit = [];
            button_fit.push(temp);
          }
          var sql = 'INSERT INTO preference_button_fit (user_id, button_fit) VALUES ';
          for (var i = 0; i < button_fit.length; i++){
            sql = sql + '('+"'"+id+"'"+','+"'"+button_fit[i]+"'"+')';
            if (i!=(button_fit.length-1)) sql = sql + ',';
          }
          conn.query(sql, function(err, result){
            callback(err, result);
          });
        },
        function(callback){
          var jeans_fit = req.body.jeans_fit;
          if (!_.isArray(jeans_fit)){
            var temp = jeans_fit;
            var jeans_fit = [];
            jeans_fit.push(temp);
          }
          var sql = 'INSERT INTO preference_jeans_fit (user_id, jeans_fit) VALUES ';
          for (var i = 0; i < jeans_fit.length; i++){
            sql = sql + '('+"'"+id+"'"+','+"'"+jeans_fit[i]+"'"+')';
            if (i!=(jeans_fit.length-1)) sql = sql + ',';
          }
          conn.query(sql, function(err, result){
            callback(err, result);
          });
        },
        function(callback){
          var shorts_fit = req.body.shorts_fit;
          if (!_.isArray(shorts_fit)){
            var temp = shorts_fit;
            var shorts_fit = [];
            shorts_fit.push(temp);
          }
          var sql = 'INSERT INTO preference_shorts_fit (user_id, shorts_fit) VALUES ';
          for (var i = 0; i < shorts_fit.length; i++){
            sql = sql + '('+"'"+id+"'"+','+"'"+shorts_fit[i]+"'"+')';
            if (i!=(shorts_fit.length-1)) sql = sql + ',';
          }
          conn.query(sql, function(err, result){
            callback(err, result);
          });
        }
      ],function(err, results){
        if (err) throw err;
        console.log(results);
        res.redirect('style');
      });
    });
  });

  route.get('/style', function(req, res){
    var id = req.session.passport.user;
    //check if id is registered
    check_registered(id);
    //check user finished profile survey
    check_profile(id);
    //check user finished profile fit
    check_fit(id);
    console.log('here')
    // fetch all images to be displayed from database
    var tasks = [
      function(callback){
        var sql = 'SELECT * FROM brand'
        conn.query(sql, function(err, content){
          if(err) throw err;
          var brands = content;
          var brand_list = [];
          for (var i = 0; i < brands.length; i++){
            dict = {};
            dict[brands[i]['brand_name']] = brands[i]['file_type'];
            brand_list.push(dict);
          }
          callback(err, brand_list)
        })
      },
      function(callback){
        var sql = 'SELECT * FROM pattern';
        conn.query(sql, function(err, content){
          if (err) throw err;
          var patterns = content;
          var pattern_list = [];
          for (var i = 0; i < patterns.length; i++){
            dict = {};
            dict["pattern-" + patterns[i]['pattern_id']] = patterns[i]['file_type'];
            pattern_list.push(dict);
          }
          callback(err, pattern_list);
        })
      },
      function(callback){
        var sql = 'SELECT * FROM shoe';
        conn.query(sql, function(err, content){
          if (err) throw err;
          var shoes = content;
          callback(err, shoes);
        })
      },
      function(callback){
        var sql = 'SELECT * FROM style_types';
        conn.query(sql, function(err, content){
          if (err) throw err;
          var styles = content;
          callback(err, styles);
        })
      },
      function(callback){
        var sql = 'SELECT * FROM avoid';
        conn.query(sql, function(err, content){
          if (err) throw err;
          callback(err, content);
        })
      }
    ]
    async.parallel(tasks, function (err, results) {
      if (err) throw err;
      else {
        // cleaner data for shoe
        var shoes = results[2];
        var shoe_list = [];
        var shoe_name = [];
        for (var i = 0; i < shoes.length; i++){
          dict = {};
          dict["shoe" + shoes[i]["shoe_id"]] = shoes[i]['file_type'];
          shoe_list.push(dict);
          shoe_name.push(shoes[i]["shoe_name"]);
        }// end of for loop shoe

        // cleaner data from style
        var styles = results[3];
        styles = _.shuffle(styles);
        var style_list = [];
        for (var i = 0; i < styles.length; i++){
          dict = {};
          file_path = styles[i]["category"] + "/" + styles[i]["file_name"] + "." + styles[i]["file_type"];
          dict[styles[i]["style_id"]] = file_path;
          style_list.push(dict);
        }

        var avoids = results[4];
        var avoid_list = {}
        for (var i = 0; i < avoids.length; i++){
          avoid_list[avoids[i]["avoid_item"]] = avoids[i]["avoid_id"];
        }
        // extract user's database
        // check if there's prev user data
        var sql = 'SELECT * FROM survey_style WHERE user_id=?';
        conn.query(sql, [id], function(err, result){
          if (err) throw err;
          else if (result.length == 0){
            //empty db
            res.render('survey/style', {brand_list: results[0], pattern_list: results[1], shoe_list: shoe_list, shoe_name: shoe_name, avoid_list: avoid_list, style_list: style_list});
          }
          else{
            var tasks = [
              function(callback){
                var sql = 'SELECT * FROM  survey_style WHERE user_id=?';
                conn.query(sql, [id], function(err, result){
                  if (err) throw err;
                  callback(err, result);
                })
              },
              function(callback){
                var sql = 'SELECT * FROM preference_brand WHERE user_id=?';
                conn.query(sql, [id], function(err, result){
                  if (err) throw err;
                  callback(err, result);
                 })
              },
              function(callback){
                var sql = 'SELECT * FROM preference_avoid WHERE user_id=?';
                conn.query(sql, [id], function(err, result){
                  if (err) throw err;
                  callback(err, result);
                 })
              },
              function(callback){
                var sql = 'SELECT * FROM preference_pattern WHERE user_id=?';
                conn.query(sql, [id], function(err, result){
                  if (err) throw err;
                  callback(err, result);
                 })
              },
              function(callback){
                var sql = 'SELECT * FROM preference_shoe WHERE user_id=?';
                conn.query(sql, [id], function(err, result){
                  if (err) throw err;
                  callback(err, result);
                 })
              },
              function(callback){
                var sql = 'SELECT * FROM preference_style WHERE user_id=?';
                conn.query(sql, [id], function(err, result){
                  if (err) throw err;
                  callback(err, result);
                 })
              },
            ]
            async.parallel(tasks, function(err, result2){
              if (err) throw err;
              else{
                res.render('survey/style', {brand_list: results[0], pattern_list: results[1], shoe_list: shoe_list, shoe_name: shoe_name, avoid_list: avoid_list, style_list: style_list, data: result2[0][0], brand:JSON.stringify(result2[1]), avoid: JSON.stringify(result2[2]), pattern: result2[3], shoe: result2[4], style: JSON.stringify(result2[5])});
                console.log(result2);
              }
             })
          }
        })
      }// end of else
    });//end of async
  }); //end of get style

  route.post('/style', function(req, res){
    var record = {
      user_id: req.session.passport.user,
      freq_everyday_casual : req.body.everyday_casual,
      freq_business_casual : req.body.business_casual,
      freq_business_formal : req.body.business_formal,
      freq_night_out : req.body.night_out,
      freq_work_out : req.body.work_out,
      freq_special : req.body.special,
      style_comfort : req.body.style_comfort,
      dress_code : req.body.dress_code,
      dry_clean : req.body.dry_clean,
      price_shirts : req.body.price_shirts,
      price_sweats : req.body.price_sweats,
      price_button : req.body.price_button,
      price_pants : req.body.price_pants,
      price_shorts : req.body.price_shorts,
      price_outer : req.body.price_outer,
      price_shoes : req.body.price_shoes,
      avoid_comment : req.body.avoid_comment,
      color : req.body.color,
      adventure : req.body.adventure,
      kakao : req.body.kakao,
      instagram : req.body.instagram,
      facebook : req.body.facebook,
      sns_other : req.body.sns_other,
      extra_comment : req.body.extra_comment
    };

    //check if data already exists
    var id = req.session.passport.user;
    var sql = 'SELECT * FROM survey_style WHERE user_id=?';
    conn.query(sql, [id], function(err, result){
      if (err) throw err;
      if (result.length != 0){
        //delete existing values
        async.parallel([
          function(callback){
            var sql = 'DELETE FROM survey_style WHERE user_id=?';
            conn.query(sql, [id], function(err, result){
              callback(err, result);
            });
          },
          function(callback){
            var sql = 'DELETE FROM preference_brand WHERE user_id=?';
            conn.query(sql, [id], function(err, result){
              callback(err, result);
            });
          },
          function(callback){
            var sql = 'DELETE FROM preference_pattern WHERE user_id=?';
            conn.query(sql, [id], function(err, result){
              callback(err, result);
            });
          },
          function(callback){
            var sql = 'DELETE FROM preference_shoe WHERE user_id=?';
            conn.query(sql, [id], function(err, result){
              callback(err, result);
            });
          },
          function(callback){
            var sql = 'DELETE FROM preference_avoid WHERE user_id=?';
            conn.query(sql, [id], function(err, result){
              callback(err, result);
            });
          },
          function(callback){
            var sql = 'DELETE FROM preference_style WHERE user_id=?';
            conn.query(sql, [id], function(err, result){
              callback(err, result);
            });
          }
        ],function(err, results){
          if (err) throw err;
          console.log(results);
        });

      } //end of if
      //brand, pattern, shoe, avoid, style
      tasks = [
        function(callback){
          var sql = 'INSERT INTO survey_style SET ?';
          conn.query(sql, [record], function(err, result){
            callback(err, result);
          });
        },
        function(callback){
          var brands = req.body.brands;
          if (!_.isArray(brands)){
            var temp = brands;
            var brands = [];
            brands.push(temp);
          }
          var sql = 'INSERT INTO preference_brand (user_id, brand_name) VALUES ';
          for (var i = 0; i < brands.length; i++){
            sql = sql + '('+"'"+id+"'"+','+"'"+brands[i]+"'"+')';
            if (i!=(brands.length-1)) sql = sql + ',';
          }
          conn.query(sql, function(err, result){
            callback(err, result);
          });
        },
        function(callback){
          var avoids = req.body.avoid;
          if (!_.isArray(avoids)){
            var temp = avoids;
            var avoids = [];
            avoids.push(temp);
          }
          var sql = 'INSERT INTO preference_avoid (user_id, avoid_id) VALUES ';
          for (var i = 0; i < avoids.length; i++){
            sql = sql + '('+"'"+id+"'"+','+"'"+avoids[i]+"'"+')';
            if (i!=(avoids.length-1)) sql = sql + ',';
          }
          conn.query(sql, function(err, result){
            callback(err, result);
          });
        },
        function(callback){
          var styles = req.body.style;
          if (!_.isArray(styles)){
            var temp = styles;
            var styles = [];
            styles.push(temp);
          }
          var sql = 'INSERT INTO preference_style (user_id, style_id) VALUES ';
          for (var i = 0; i < styles.length; i++){
            sql = sql + '('+"'"+id+"'"+','+"'"+styles[i]+"'"+')';
            if (i!=(styles.length-1)) sql = sql + ',';
          }
          conn.query(sql, function(err, result){
            callback(err, result);
          });
        },
        function(callback){
          var sql = 'INSERT INTO preference_pattern(user_id, pattern_id, answer) VALUES ';
          for (var i = 1; i < 13; i++){
            sql = sql + '('+"'"+id+"'"+','+"'"+i+"'"+','+"'"+req.body["pattern"+i.toString()]+"'"+')';
            if (i != (12)) sql = sql + ',';
          }
          conn.query(sql, function(err, result){
            callback(err, result);
          });
        },
        function(callback){
          var sql = 'INSERT INTO preference_shoe(user_id, shoe_id, answer) VALUES ';
          for (var i = 1; i < 9; i++){
            sql = sql + '('+"'"+id+"'"+','+"'"+i+"'"+','+"'"+req.body["shoe"+i.toString()]+"'"+')';
            if (i != (8)) sql = sql + ',';
          }
          conn.query(sql, function(err, result){
            callback(err, result);
          });
        }
      ]
      async.parallel(tasks ,function(err, results){
        if (err) throw err;
        res.redirect('having');
      }); // end of async
    });
  });

  route.get('/having', function(req, res){
    var id = req.session.passport.user;
    //check if id is registered
    check_registered(id);
    //check user finished profile survey
    check_profile(id);
    //check user finished profile fit
    check_fit(id);
    //check if user finished style
    check_style(id);

    var tasks = [
      function(callback){
        var sql = 'SELECT * FROM having_items';
        conn.query(sql, function(err, content){
          if (err) throw err;
          var having = content;
          callback(err, having);
        })
      }
    ]
    async.parallel(tasks, function(err, results){
      if (err) throw err;
      else{
        var having = results[0];
        having = _.shuffle(having);
        var having_list = [];
        var name_list = [];
        for (var i = 0; i < having.length; i++){
          dict = {};
          file_path = having[i]["file_name"] + "." + having[i]["file_type"];
          dict[having[i]["having_id"]] = file_path;
          having_list.push(dict)
          name_list.push(having[i]["file_name"])
        }
        // check if there's prev user data
        var sql = 'SELECT * FROM user_having WHERE user_id=?';
        conn.query(sql, [id], function(err, result){
          if (err) throw err;
          else if(result.length == 0){
            res.render('survey/having', {having_list: having_list, having_names: name_list})
          }
          else{
            res.render('survey/having', {having_list: having_list, having_names: name_list, having: JSON.stringify(result[0])})
          }
        })
      }
    })

  });

  route.post('/having', function(req, res){
    var id = req.session.passport.user;
    // check if data already exists
    var sql = 'SELECT * FROM user_having WHERE user_id=?'
    conn.query(sql, [id], function(err, result){
      if (err) throw err;
      if (result.length != 0){
        // delete existing values
        var sql = 'DELETE FROM user_having WHERE user_id=?'
        conn.query(sql, [id], function(err, result2){
          if (err) throw err;
          console.log(result2)
        });
      } // end of if
      var having = req.body.having;
      if (!_.isArray(having)){
        var temp = having;
        var having = [];
        having.push(temp)
      }
      var sql = 'INSERT INTO user_having (user_id, having_id) VALUES ';
      for (var i = 0; i < having.length; i++){
        sql = sql + '(' + "'" + id + "'" + ',' + "'" + having[i] + "'" + ')';
        if (i!=(having.length-1)) sql = sql + ',';
      }
      conn.query(sql, function(err, result2){
        if (err) throw err;
        res.redirect('wanted')
      })
    }); //end of conn
  })

  route.get('/wanted', function(req, res){
    var id = req.session.passport.user;
    //check if id is registered
    check_registered(id);
    //check user finished profile survey
    check_profile(id);
    //check user finished profile fit
    check_fit(id);
    //check if user finished style
    check_style(id);

    var tasks = [
      function(callback){
        var sql = 'SELECT * FROM wanted_items';
        conn.query(sql, function(err, content){
          if (err) throw err;
          var wanted = content;
          callback(err, wanted);
        })
      }
    ]
    async.parallel(tasks, function(err, results){
      if (err) throw err;
      else{
        var wanted = results[0];
        wanted = _.shuffle(wanted);
        var wanted_list = [];
        var wanted_names = [];
        for (var i = 0; i < wanted.length; i++){
          dict = {};
          file_path = wanted[i]["file_name"] + "." + wanted[i]["file_type"];
          dict[wanted[i]["wanted_id"]] = file_path;
          wanted_list.push(dict)
          wanted_names.push(wanted[i]["file_name"])
        }
        // check if there's prev user data
        var sql = 'SELECT * FROM user_wanted WHERE user_id=?';
        conn.query(sql, [id], function(err, result){
          if (err) throw err;
          else if(result.length == 0){
            res.render('survey/wanted', {wanted_list: wanted_list, wanted_names: wanted_names})
          }
          else{
            res.render('survey/wanted', {wanted_list: wanted_list, wanted_names: wanted_names, wanted: JSON.stringify(result[0])})
          }
        })
      }
    })
  });

  route.post('/wanted', function(req, res){
    var id = req.session.passport.user;
    // check if data already exists
    var sql = 'SELECT * FROM user_wanted WHERE user_id=?'
    conn.query(sql, [id], function(err, result){
      if (err) throw err;
      if (result.length != 0){
        // delete existing values
        var sql = 'DELETE FROM user_wanted WHERE user_id=?'
        conn.query(sql, [id], function(err, result2){
          if (err) throw err;
          console.log(result2)
        });
      } // end of if
      var wanted = req.body.wanted;
      if (!_.isArray(wanted)){
        var temp = wanted;
        var wanted = [];
        wanted.push(temp)
      }
      var sql = 'INSERT INTO user_wanted (user_id, wanted_id) VALUES ';
      for (var i = 0; i < wanted.length; i++){
        sql = sql + '(' + "'" + id + "'" + ',' + "'" + wanted[i] + "'" + ')';
        if (i!=(wanted.length-1)) sql = sql + ',';
      }
      conn.query(sql, function(err, result2){
        if (err) throw err;
        res.redirect('/success')
      })
    }); //end of conn
  })
  return route;
}
