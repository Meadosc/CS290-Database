document.addEventListener('DOMContentLoaded', bindButtons);

function bindButtons(){
	//Listener for the stuff submit
	document.getElementById('submitStuff').addEventListener('click', function(event){
		var req = new XMLHttpRequest();
		var payload = {stuff:null}; //This is what the API will receive
		payload.stuff = document.getElementById('textStuff').value;
		req.open('POST', "http://httpbin.org/post?" + payload.stuff, true);
		req.setRequestHeader('Content-Type', 'application/json');
		req.addEventListener('load',function(){
			if(req.status >= 200 && req.status < 400){
				var response = JSON.parse(req.responseText); // This gives us the response as a variable
				document.getElementById('StuffReceived').textContent = response.data; //Report stuff
			} else {
				console.log("Error in network request: " + request.statusText);
			}
			console.log(JSON.parse(req.responseText)); //For debugging and testing
		});
		req.send(JSON.stringify(payload)); //Send the content
				
		event.preventDefault(); //Stops form from refreshing page
	})
};
