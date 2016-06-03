document.addEventListener('DOMContentLoaded', callSelect);//Renders page and calls to select page.
document.addEventListener('DOMContentLoaded', bindInsertButton);//Binds the input button

//calls to the input page and inserts data
function bindInsertButton(){
	
	//Listener for the insert button
	document.getElementById('insertSubmit').addEventListener("click", function(event){
		
		var payload = {}; //payload is the object I will use to send data to the insert page via get request
		payload.name = document.getElementById("name").value;
		payload.reps = document.getElementById("reps").value;
		payload.weight = document.getElementById("weight").value;
		payload.date = document.getElementById("date").value;
		var radio = document.getElementsByName("units");
	        if(radio[0].checked) payload.units = "1";
	        else payload.units = "0";

		//make request to insert page 
		var req = new XMLHttpRequest();
		var requestString= "name=" + payload.name + "&reps=" + payload.reps + "&weight=" + payload.weight + "&date=" + payload.date + "&lbs=" + payload.units;
		
		req.open('GET', "http://52.36.135.10:3000/insert?" + requestString , true);
		req.addEventListener('load',function(){
			//delete table and then insert new table
			deleteTable(); //delete old table
			callSelect(); //create new table
		});
		req.send(); //Send the content
		event.preventDefault(); //Stop page from refreshing
	});
};

//Delete table so a new and updated table can be displayed.
function deleteTable(){
	var table = document.getElementById('tableID');
	table.parentNode.removeChild(table); //Remove table. The table must be removed from its parent
};

//calls the select page to get info for table
function callSelect(){
	var req = new XMLHttpRequest();
	req.open('GET', "http://52.36.135.10:3000/select", true);
	req.setRequestHeader('Content-Type', 'application/json');
	req.addEventListener('load',function(){
		var response = JSON.parse(req.responseText); // This gives us the response as a variable
		createTable(response); //Creates the table
	});
	req.send(); //Send the content
};

//Creates a table.
function createTable(data){
	var table = document.createElement("table");//Create table in HTML
	table.setAttribute('id','tableID'); //Add id to table so I can use getElementById()
	document.body.appendChild(table); //Add the table as a child of the body in HTML

	//Create table headers
	var headers = ["","name","reps","weight","date","lbs/kilos"];
	var row = document.createElement("tr"); 
	table.appendChild(row); //Create a new row
	for(var j in headers){
		var col = document.createElement("th");
		col.textContent = headers[j];
		row.appendChild(col);
	};

	//Create table body
	for(var i in data){
		var row = document.createElement("tr");
		var rowID = null;
		var flag = 1; //Flag to make first column hidden (id column)
		for(var j in data[i]){
			var col = document.createElement("td");
			col.textContent = data[i][j];
			if(flag === 1){
				col.style.visibility = "hidden"
				flag = 0; //Set flag so this is only done on first column
			}; //hide id column
			row.appendChild(col); //add row to table
		}
		//Add delete button
		var btn = document.createElement("BUTTON");
		var t = document.createTextNode("Delete");
		btn.appendChild(t);
		btn.id = row.firstChild.textContent;
		btn.onclick = function(x){
			return function(){
				deleteButton(x);
			};
		}(btn.id);  
		row.appendChild(btn);
		
		//Add update button
		var upBtn = document.createElement("BUTTON");
		var UpdateText = document.createTextNode("Update");
		upBtn.appendChild(UpdateText);
		upBtn.id = row.firstChild.textContent;
		upBtn.onclick = function(x){
			return function(){
				updateButton(x);
			};
		}(upBtn.id); 
		row.appendChild(upBtn);
		
		//add data + buttons to table
		table.appendChild(row);
	}
};

function deleteButton(id){
	//make request to insert page 
	var req = new XMLHttpRequest();
	req.open('GET', "http://52.36.135.10:3000/delete?id=" + id , true);
	req.addEventListener('load',function(){
		//delete table and then insert new table
		deleteTable(); //delete old table
		callSelect(); //create new table
	});
	req.send(); //Send the content
	event.preventDefault(); //Stop page from refreshing
};

function updateButton(id){
	//Create form and set attributes*******************************
	var upForm = document.createElement("form"); //create form element
	upForm.setAttribute("id", id); //Give the form the same ID as the data we are changing
	//***********************************************************
	
	//Create fieldset + label**********************************
	var fieldset = document.createElement("fieldset");
	var legend = document.createElement("legend");
	legend.setAttribute('textContent','Update the workout');
	fieldset.appendChild(legend);

	//********************************************************
	
	//Below are the input text boxes of the form**************
	var name = document.createElement("input");
	name.setAttribute('type','text');
	name.setAttribute('name','name');
	fieldset.appendChild(name);
	
	var reps = document.createElement("input");
	reps.setAttribute('type','text');
	reps.setAttribute('name','reps');
	fieldset.appendChild(reps);
	//*******************************************************

	upForm.appendChild(fieldset); //append the fieldset to the form	
	var table = document.getElementById("tableID"); //Get the table ID so I can put the form above it in the next line
	document.body.insertBefore(upForm, table);
	
};
