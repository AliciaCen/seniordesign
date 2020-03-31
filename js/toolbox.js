var $ = require('jquery');

// Wait until the Toolbox is loaded
var onToolboxLoad = setInterval(function() {
	if ($('#toolbox').length) {
		clearInterval(onToolboxLoad);

		$("#modal").click(function(){ 
			console.log("I show the modal!");
		})
	}
}, 100); // Check every 100ms