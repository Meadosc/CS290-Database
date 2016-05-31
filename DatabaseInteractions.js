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
//********************************************************************************************************
//End of set up
//********************************************************************************************************

//********************************************************************************************************
//This is the client side code
//********************************************************************************************************
app.get('/', function(req,res,next){
// Variables to adjust table size
var numRows = 3; //Not including header row
var numCols = 4;

//Create the table
var table = document.createElement('table');
document.body.appendChild(table);

//Create the table header
var addElement = document.getElementsByTagName('table');
var newTH = document.createElement('thead');
addElement[0].appendChild(newTH); //Add thead element to table element

addElement = document.getElementsByTagName('thead'); // Reassign addElement to thead element
var newTR = document.createElement('tr');
addElement[0].appendChild(newTR); //Add tr element to table element

//Create 4 header elements
for (var i = 0; i < numCols; i++){
	addElement = document.getElementsByTagName('tr');
	var tempTH = document.createElement('th');
	var newThText = document.createTextNode('Header ' + (i + 1) );
	tempTH.appendChild(newThText);
	addElement[0].appendChild(tempTH);
}

// Create Table Body
var position = document.getElementsByTagName('table');
var newTbody = document.createElement('tbody');
position[0].appendChild(newTbody);

// Create 3 body rows of 4 columns each to append to the table
var xVal = 1; // Column number
var yVal = 1; // Row number
var index = 1; // Element number

for (var i = 0; i < numRows; i++) {
  // Create a new Row
  position = document.getElementsByTagName('tbody');
  var newTr = document.createElement('tr');
  position[0].appendChild(newTr);

    for (var j = 0; j < numCols; j++) {
      // Append elements to the Row
      position = document.getElementsByTagName('tr');
      var newTd = document.createElement('td');
      newTd.setAttribute('id', index);
      var newTdText = document.createTextNode(xVal + ' , ' + yVal);
      newTd.appendChild(newTdText);
      position[i+1].appendChild(newTd);
      xVal++;
      index++;
    }
  xVal = 1;
  yVal++;
}

// This function creates a new button on the page with the given text
function makeButton(button, type) {
  var newButton = document.createElement(button);
  var buttonText = document.createTextNode(type);
  newButton.setAttribute('id', type);
  newButton.appendChild(buttonText);
  document.body.appendChild(newButton);

}

// Call function to create UP, LEFT, RIGHT, and DOWN buttons to 'select' table elements
makeButton('button', 'Up');
makeButton('button', 'Down');
makeButton('button', 'Left');
makeButton('button', 'Right');

// Create Mark Cell button
var newP = document.createElement('p');
document.body.appendChild(newP);
makeButton('button', 'Mark Cell');

// When called, this function 'selects' the table element in the given direction (if possible)
function move(direction) {

  var selected = document.getElementsByClassName('selected')[0];
  var curr = selected.getAttribute('Id');
  //console.log("Class: " + selected.getAttribute('class') + " Id: " + curr);

  if (direction == Up) {
    if (Number(curr) <= 4) {
      //console.log('You cannot move up from here');
    }
    else {
      selected.removeAttribute('class');
      selected.style.border = 'solid 1px black';

      var newSelect = document.getElementById(Number(curr) - 4);
      newSelect.style.border = 'solid 2px black';
      newSelect.setAttribute('class', 'selected');
    }
  }

  else if (direction == Down) {
    if (Number(curr) >= 9) {
      //console.log('You cannot move down from here');
    }
    else {
      selected.removeAttribute('class');
      selected.style.border = 'solid 1px black';

      var newSelect = document.getElementById(Number(curr) + 4);
      newSelect.style.border = 'solid 2px black';
      newSelect.setAttribute('class', 'selected');
    }
  }

  else if (direction == Left) {
    if (Number(curr) == 1 || Number(curr) == 5 || Number(curr) == 9) {
      //console.log('You cannot move left from here');
    }
    else {
      selected.removeAttribute('class');
      selected.style.border = 'solid 1px black';

    var newSelect = document.getElementById(Number(curr) - 1);
      newSelect.style.border = 'solid 2px black';
      newSelect.setAttribute('class', 'selected');
    }

  }

  else if (direction == Right) {
    if (Number(curr) == 4 || Number(curr) == 8 || Number(curr) == 12) {
      //console.log('You cannot move right from here');
    }
    else {
      selected.removeAttribute('class');
      selected.style.border = 'solid 1px black';

    var newSelect = document.getElementById(Number(curr) + 1);
      newSelect.style.border = 'solid 2px black';
      newSelect.setAttribute('class', 'selected');
    }
  }


}

// When called, the selected element in the table will be permanently marked yellow
function markCell() {
  var selected = document.getElementsByClassName('selected')[0];

  selected.style.background = 'yellow';

}
// Select first element in table
var selected = document.getElementsByTagName('td')[0];
selected.setAttribute('style', 'border: 2px solid black');
selected.setAttribute('Class', 'selected');


// Select new element in table if user clicks a button
document.getElementById('Up').addEventListener('click', function() {
  move(Up);
}, false);

document.getElementById('Down').addEventListener('click', function() {
  move(Down);
}, false);

document.getElementById('Left').addEventListener('click', function() {
  move(Left);
}, false);

document.getElementById('Right').addEventListener('click', function() {
  move(Right);
}, false);

document.getElementById('Mark Cell').addEventListener('click', function() {
  markCell(selected);
}, false);

});
//********************************************************************************************************
//End of client side code
//********************************************************************************************************

//********************************************************************************************************
//This is the server side code
//********************************************************************************************************
//selecting data
app.get('/select',function(req,res,next){
  var context = {};
  mysql.pool.query('SELECT * FROM workouts', function(err, rows, fields){
    if(err){
      next(err);
      return;
    }
    res.send(JSON.stringify(rows));
  });
});

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
