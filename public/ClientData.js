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
