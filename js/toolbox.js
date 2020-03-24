// Wait until the Toolbox is loaded
var onToolboxLoad = setInterval(function() {
	if ($('#toolbox').length) {
		clearInterval(onToolboxLoad);
		dragElement(document.getElementById("toolbox")); // Begin watching for clicking

		$("#modal").click(function(){ 
			console.log("I show the modal!");
		})

	}
}, 100); // Check every 100ms


function dragElement(elmnt) {
	var pos1 = 0, pos2 = 0, pos3 = 0, pos4 = 0, elemX = 0, elemY = 0;
	var minHeight, minWidth, maxHeight, maxWidth;

	// Begin watching the toolbox controller
	document.getElementById(elmnt.id + "controller").onmousedown = dragMouseDown;

	// When the controller is clicked
	function dragMouseDown(e) {
		e = e || window.event;
		e.preventDefault();

		// Calculate the current min and max dimensions
		maxWidth = window.innerWidth - elmnt.offsetWidth;
		maxHeight = window.innerHeight - elmnt.offsetHeight;

		minWidth = document.getElementById("sidebar").offsetWidth
		minHeight = 0;

		// Get the mouse cursor position
		pos3 = e.clientX;
		pos4 = e.clientY;

		// Call this function when the mouse button is released
		document.onmouseup = closeDragElement;
		// Call this function whenever the cursor moves
		document.onmousemove = elementDrag;
	}

	function elementDrag(e) {
		e = e || window.event;
		e.preventDefault();

		// Calculate the new cursor position:
		pos1 = pos3 - e.clientX;
		pos2 = pos4 - e.clientY;
		pos3 = e.clientX;
		pos4 = e.clientY;
		elemX = elmnt.offsetTop - pos2;
		elemY = elmnt.offsetLeft - pos1;

		// Set the element's new position:
		if (elemX < minHeight){
			elmnt.style.top = minHeight + "px";
		} else if (elemX > maxHeight){
			elmnt.style.top = maxHeight + "px";
		} else {
			elmnt.style.top = elemX + "px";
		}

		if (elemY < minWidth){
			elmnt.style.left = minWidth + "px";
		} else if (elemY > maxWidth){
			elmnt.style.left = maxWidth + "px";
		} else {
			elmnt.style.left = elemY + "px";
		}
  	}

	function closeDragElement() {
		// Stop moving when mouse button is released
		document.onmouseup = null;
		document.onmousemove = null;
	}
}