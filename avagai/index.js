var app = require('./src/js/express')();
var conn = require('./src/js/db')();
var auth = require('./src/js/auth')(app);
var survey = require('./src/js/survey')(app, conn);
var _ = require('underscore');
var async = require('async');
const format = require('string-format');

app.use('/auth', auth);
app.use('/survey', survey);
app.get('/', function(req,res){
  res.redirect('/index');
})
app.get('/index', function(req, res){
  if (req.user){
    res.redirect('survey/profile');
  }
  else{
    res.render('index');
  }
});

app.get('/success', function(req, res){
  res.render('success');
})

app.listen(4000, function(){
  console.log('Connected 4000 port!');
});
