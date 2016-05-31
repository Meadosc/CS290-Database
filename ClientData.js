//********************************************************************************************************
//This is the set up for the code
//********************************************************************************************************
var express = require('express');
var mysql = require('./mysql.js');

var app = express();
var handlebars = require('express-handlebars').create({defaultLayout:'main'});

app.engine('handlebars', handlebars.engine);
app.set('view engine', 'handlebars');
app.set('port', 3001);
//********************************************************************************************************
//End of set up
//********************************************************************************************************

//********************************************************************************************************
//This is the client side code
//********************************************************************************************************
//selecting data
app.get('/',function(req,res,next){
  var context = {};
  res.render('home');
  });
});

app.use(function(req,res){
  res.status(404);
  res.render('404');
});

app.use(function(err, req, res, next){
  console.error(err.stack);
  res.type('plain/text');
  res.status(500);
  res.render('500');
});

app.listen(app.get('port'), function(){
  console.log('Express started on http://localhost:' + app.get('port') + '; press Ctrl-C to terminate.');
});
//********************************************************************************************************
//This is the end of the client side code
//********************************************************************************************************
