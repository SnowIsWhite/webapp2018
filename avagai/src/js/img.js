module.exports = function(app, conn){
  var express = require('express');
  var fs = require('fs');
  var route = express.Router();

  route.get('/index/cover-fashion-2.jpg', function(req, res){
    fs.readFile('/img/index/cover-fashion-2.jpg', function(err, data){
      if (err){
        throw err;
      }
      console.log(data);
      res.writeHead(200, {'Content-Type': 'image/jpeg'});
      res.end(data);
    });
  });

  return route;
}
