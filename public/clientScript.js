document.addEventListener('DOMContentLoaded', callSelect);

function callSelect(){
	var req = new XMLHttpRequest();
	req.open('GET', "http://52.36.135.10:3000/select", true);
	req.setRequestHeader('Content-Type', 'application/json');
	req.addEventListener('load',function(){
		console.log("req.responseText: " + req.responseText); //testing
		var response = JSON.parse(req.responseText); // This gives us the response as a variable
		createTable(response); //Creates the table
	});
	req.send(); //Send the content
			
	// I'm not clicking anything. event.preventDefault(); //Stops form from refreshing page
};

//Creates a table. Written by Kyle Prouty
function createTable(data){
    var table = document.createElement("table");

    for(var i in data){
        var row = document.createElement("tr");        
        for(var j in data[i]){
        console.log("building table " + j);
            var col = document.createElement("td");
            col.textContent = data[i][j];
            row.appendChild(col);
       	}
        table.appendChild(row);
    }
   // $('#table-wrap').append(table);
}
