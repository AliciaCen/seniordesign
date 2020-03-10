// Known Bugs:
// - Changing modes doesn't end the previous mode's functionality
// - Prevent dragging the screen

// TODO:
// - Allow for easy node image changing
// - Make "Remove Connections"
// 		- Allow for edge hovering
// - Make graph-container change size to match window
// - Make toolbox better
// - Make script imports smaller

var s,
	g = {
		nodes: [],
		edges: []
	},
	currentMode = 0, 	// 0:normal,1:add,2:Remove,3:Connect,4:Drag
	n = 0;


// Instantiate sigma:
s = new sigma({
	graph: g,
	renderer: {
		container: document.getElementById('graph-container'),
		type: 'canvas'
	},
	settings: {
		autoRescale: false,
		doubleClickEnabled: false,
		minEdgeSize: 0.5,
		maxEdgeSize: 4
	}
});
dom = document.querySelector('#graph-container canvas:last-child');
cam = s.camera;


// Helper Functions
addNode = function (e) {
	var x, y, p, id;
		
	newx = sigma.utils.getX(e) - dom.offsetWidth / 2;
	newy = sigma.utils.getY(e) - dom.offsetHeight / 2;

	p = cam.cameraPosition(newx, newy);
	newx = p.x;
	newy = p.y;

	console.log("Creating node n" + n);

	s.graph.addNode({
		id: (id = 'n' + n),
		label: 'Node ' + n++,
		size: 10,
		x: newx,
		y: newy,
		color: '#666'
	});
	s.refresh()
}

removeNode = function (e) {
	console.log("Removing node " + e.data.node.id)
	s.graph.dropNode(e.data.node.id);
	s.refresh();
}

connectionStart = function (e) {
	toConnect = e.data.node.id

	connectionComplete = function (e) {

		var src = toConnect
		var tgt = e.data.node.id
		
		s.graph.addEdge({
			id: 'e' + src + "-" + tgt,
			source: src,
			target: tgt,
			size: 3,
			type: 'line',
			color: '#ccc',
			hover_color: '#000'
		});
		s.refresh();
		
		console.log("Connection from node " + src + " to " + tgt + " created.");
		
		s.unbind('clickNode', connectionComplete);
		s.bind('clickNode', connectionStart);
	}

	console.log("Initializing connection from node " + toConnect);

	s.unbind('clickNode', connectionStart);
	s.bind('clickNode', connectionComplete);
}


// Mode listeners

// Wait until the Toolbox is loaded
setInterval(function() {
	if ($('#toolbox').length) {
		clearInterval(onToolboxLoad);
		
		// Add Mode
		document.getElementById('add').onclick = function() {

			if (currentMode != 1) {
				currentMode = 1;
				dom.addEventListener('click', addNode);
				
			} else {
				currentMode = 0;
				dom.removeEventListener('click', addNode);
			}
		};

		// Remove Mode
		document.getElementById('remove').onclick = function() {
			if (currentMode != 2) {
				currentMode = 2;
				s.bind('clickNode', removeNode);
			} else {
				currentMode = 0;
				s.unbind('clickNode', removeNode);
			}
		};

		// Connect Mode
		document.getElementById('connect').onclick = function() {
			if (currentMode != 3) {
				currentMode = 3;
				s.bind('clickNode', connectionStart);
			} else {
				currentMode = 0;
				s.unbind('clickNode', connectionStart);
				s.unbind('clickNode', connectionComplete);
			}
		};

		// Move Mode
		document.getElementById('move').onclick = function() {
			if (currentMode != 4) {
				currentMode = 4;
				console.log("Creating dragListener")
				dragListener = sigma.plugins.dragNodes(s, s.renderers[0]);
				
			} else {
				currentMode = 0;
				console.log("Removing dragListener")
				sigma.plugins.killDragNodes(s);
			}
		};

	}
}, 100); // Check every 100ms