//********************************************************************************************************
//This is the set up for the code
//********************************************************************************************************
var express = require('express');
var mysql = require('./mysql.js');

var app = express();
var handlebars = require('express-handlebars').create({defaultLayout:'main'});

app.engine('handlebars', handlebars.engine);
app.set('view engine', 'handlebars');
app.set('port', 3000);
app.use(express.static('public')); //This has the app use the static folder 'public'
//********************************************************************************************************
//End of set up
//********************************************************************************************************

//********************************************************************************************************
//This is the server side code
//********************************************************************************************************
app.get('/',function(req,res,next){
  var context = {};
  res.render('home', context);
});

//selecting data
app.get('/select',function(req,res,next){
  mysql.pool.query('SELECT * FROM workouts', function(err, rows, fields){
    if(err){
      next(err);
      return;
    }
    res.send(JSON.stringify(rows));
  });
});
console.log("too far, oustide select");
//Insert data into the database
app.get('/insert',function(req,res,next){
  var context = {};
  mysql.pool.query("INSERT INTO workouts (`name`) VALUES (?)", [req.query.c], function(err, result){
    if(err){
      next(err);
      return;
    }
    context.results = "Inserted id " + result.insertId;
    res.render('home',context);
  });
});

//Update data in the database
app.get('/update',function(req,res,next){
  var context = {};
  mysql.pool.query("SELECT * FROM workouts WHERE id=?", [req.query.id], function(err, result){
    if(err){
      next(err);
      return;
    }
    if(result.length == 1){
      var curVals = result[0];
      mysql.pool.query("UPDATE workouts SET name=?, reps=?, weight=?, date=?, lbs=? WHERE id=? ",
        [req.query.name || curVals.name, req.query.reps || curVals.reps, req.query.weight || curVals.weight, req.query.date || curVals.date, req.query.lbs || curVals.lbs, req.query.id],
        function(err, result){
        if(err){
          next(err);
          return;
        }
        context.results = "Updated " + result.changedRows + " rows.";
        res.render('home',context);
      });
    }
  });
});

//Delete data in the database
app.get('/delete',function(req,res,next){
  var context = {};
  mysql.pool.query("SELECT * FROM workouts WHERE id=?", [req.query.id], function(err, result){
    if(err){
      next(err);
      return;
    }
    if(result.length == 1){
      var curVals = result[0];
      mysql.pool.query("DELETE FROM workouts WHERE id=? ",
        [req.query.id],
        function(err, result){
        if(err){
          next(err);
          return;
        }
        context.results = "Deleted " + result.affectedRows + " rows.";
        res.render('home',context);
      });
    }
  });
});

//Reset and create the database
app.get('/reset-table',function(req,res,next){
  var context = {};
  mysql.pool.query("DROP TABLE IF EXISTS workouts", function(err){ //replace your connection pool with the your variable containing the connection pool
    var createString = "CREATE TABLE workouts("+
    "id INT PRIMARY KEY AUTO_INCREMENT,"+
    "name VARCHAR(255) NOT NULL,"+
    "reps INT,"+
    "weight INT,"+
    "date DATE,"+
    "lbs BOOLEAN)";
    mysql.pool.query(createString, function(err){
      context.results = "Table reset";
      res.render('home',context);
    })
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
//This is the end of the server side code
//********************************************************************************************************
