document.addEventListener('DOMContentLoaded', callSelect);//Renders page and calls to select page.
document.addEventListener('DOMContentLoaded', bindInsertButton);//Binds the input button

//calls to the input page and inserts data
function bindInsertButton(){
	
	//Listener for the insert button
	document.getElementById('insertSubmit').addEventListener("click", function(event){
	
		console.log("bindInsertButton is called with click event"); // debug
		
		var payload = []; //payload is the array object I will use to send data to the insert page via get request
		payload[0] = document.getElementById('name').value;
		payload[1] = document.getElementById('reps').value;
		payload[2] = document.getElementById('weight').value;
		payload[3] = document.getElementById('date').value;
		var radio = document.getElementsByName("units");
	        if(radio[0].checked) payload[4] = "1";
	        else payload[4] = "0";

		//make request to insert page 
		var req = new XMLHttpRequest();
		var requestString= "name=" + payload[0] + "&reps=" + payload[1] + "&weight=" + payload[2] + "&date=" + payload[3] + "&lbs=" + payload[4];
		console.log("Request String: " + requestString); //debug
		
		req.open('GET', "http://52.36.135.10:3000/insert?" + requestString , true);
		//req.setRequestHeader('Content-Type', 'application/json');
		req.addEventListener('load',function(){
			//add a row to the table with new info
			var table = document.getElementById('table'); //put the table element in a variable
			var row = document.createElement("tr"); 
			table.appendChild(row); //Create a new row
			//using payload array to populate new row
			for(var j in payload){
				var col = document.createElement("th");
				col.textContent = payload[j];
				row.appendChild(col);
			}:
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
