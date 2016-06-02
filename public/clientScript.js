document.addEventListener('DOMContentLoaded', callSelect);//Renders page and calls to select page.
document.addEventListener('DOMContentLoaded', bindInsertButton);//Binds the input button

//calls to the input page and inserts data
function bindInsertButton(){
	
	//Listener for the insert button
	document.getElementById('insertSubmit').addEventListener("click", function(event){
	
		console.log("bindInsertButton is called with click event"); // debug
		
		var payload = {}; //payload is the object I will use to send data to the insert page via get request
		payload.name = document.getElementById('name').value;
		payload.reps = document.getElementById('reps').value;
		payload.weight = document.getElementById('weight').value;
		payload.date = document.getElementById('date').value;
		//payload.units= document.getElementsByName('units').value;
		
		var radio = document.getElementsByName("units");
	        if(radio[0].checked) payload.units = "1";
	        else payload.units = "0";
		
		console.log("radio: " + payload.units);
		

		//make request to insert page 
		var req = new XMLHttpRequest();
		var requestString= "name=" + payload.name + "&reps=" + payload.reps + "&weight=" + payload.weight + "&date=" + payload.date + "&lbs=" + payload.units;
		console.log("Request String: " + requestString); //debug
		
		req.open('GET', "http://52.36.135.10:3000/insert?" + requestString , true);
		//req.setRequestHeader('Content-Type', 'application/json');
		req.addEventListener('load',function(){
			//callSelect(); //call for the new table.
		});
		req.send(); //Send the content
		event.preventDefault(); //Stop page from refreshing
	});
};

//calls the select page to get info for table
function callSelect(){
	var req = new XMLHttpRequest();
	req.open('GET', "http://52.36.135.10:3000/select", true);
	req.setRequestHeader('Content-Type', 'application/json');
	req.addEventListener('load',function(){
		//console.log("req.responseText: " + req.responseText); //testing
		var response = JSON.parse(req.responseText); // This gives us the response as a variable
		createTable(response); //Creates the table
	});
	req.send(); //Send the content
};

//Creates a table.
function createTable(data){
   
	var table = document.createElement("table");//Create table in HTML
	document.body.appendChild(table); //Add the table as a child of the body in HTML

	//Create table headers
	var headers = ["id","name","reps","weight","date","lbs/kilos"];
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
		for(var j in data[i]){
			var col = document.createElement("td");
			col.textContent = data[i][j];
			row.appendChild(col);
		}
		table.appendChild(row);
	}
};
