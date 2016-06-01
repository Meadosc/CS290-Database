document.addEventListener('DOMContentLoaded', callSelect);

function callSelect(){
	console.log("it makes it inside the function"); //testing
	var req = new XMLHttpRequest();
	req.open('POST', "http://52.36.135.10:3000/select", true);
	req.setRequestHeader('Content-Type', 'application/json');
	req.addEventListener('load',function(){
		console.log("it makes it inside the AJAX 'load' event listener"); //testing
		if(req.status >= 200 && req.status < 400){
			console.log("Just before the assignment of the JSON response"); //testing
			var response = JSON.parse(req.responseText); // This gives us the response as a variable
			console.log("Just after the assignment of the JSON response"); //testing
			console.log(response); //testing to see if I get the JSON back. duplicat below
		} else {
			console.log("Error in network request: " + request.statusText);
		}
		console.log(JSON.parse(req.responseText)); //For debugging and testing
	});
	req.send(JSON.stringify()); //Send the content
			
	// I'm not clicking anything. event.preventDefault(); //Stops form from refreshing page
};
