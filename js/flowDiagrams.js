
// TODO:
// - Allow for easy node image changing
// - Make graph-container change size to match window
// - Make toolbox better

// NPM Module Imports
var sigma = require('sigma');
require('sigma/plugins/sigma.plugins.dragNodes/sigma.plugins.dragNodes.js')
var $ = require('jquery');

// Custom Class Import
var Node = require("./js/Node.js")
var testObj = require("./js/test.js")

var n = new Node("test")

console.log(testObj.test(n).toString())
console.log(testObj.test2())



var s,
	g = {
		nodes: [],
		edges: []
	},
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
		maxEdgeSize: 4,
		enableEdgeHovering: true
	}
});
dom = document.querySelector('#graph-container canvas:last-child');
cam = s.camera;


rename = function (e) {
	updateNode = function() {
		s.graph.nodes(nodeID).label = box.value;
		s.refresh();
	}

	nodeID = e.data.node.id;
	nodeName = e.data.node.label;
	
	console.log(nodeName, nodeID)

	box = document.getElementById("renameBox");
	box.value = nodeName;
	box.style.visibility = "visible";
	box.focus();
	box.select();
	box.addEventListener('input', updateNode);

	document.addEventListener('click', function(e) {
		box.value = "";
		box.style.visibility = "hidden";
		box.removeEventListener('input', updateNode);
	}, {once: true});
}

s.bind('doubleClickNode', rename);

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

removeEdge = function(e){
	console.log("Removing edge between nodes " + e.data.edge.source + " and " + e.data.edge.target);
	s.graph.dropEdge(e.data.edge.id);
	s.refresh()
}

// Mode leaving functions

function endAdd(add) {
	add.checked = false;
	dom.removeEventListener('click', addNode);
}

function endRemove(remove) {
	remove.checked = false;
	s.unbind('clickNode', removeNode);
}

function endConnect(connect) {
	connect.checked = false;
	try {
		s.unbind('clickNode', connectionStart);
		s.unbind('clickNode', connectionComplete);
	}
	catch (err) { }
}

function endDisconnect(disconnect) {
	disconnect.checked = false;
	s.unbind('clickEdge', removeEdge);
}

function endMove(move) {
	move.checked = false;
	sigma.plugins.killDragNodes(s);
}


// Mode listeners

// Wait until the Toolbox is loaded
setInterval(function() {
	if ($('#toolbox').length) {
		clearInterval(onToolboxLoad);
		
		// Get inputs
		add = document.getElementById('add');
		remove = document.getElementById('remove');
		connect = document.getElementById('connect');
		disconnect = document.getElementById('disconnect');
		move = document.getElementById('move');

		// Add Mode
		add.onclick = function() {
			if (this.checked) {
				// Turn off all other modes
				endRemove(remove);
				endConnect(connect);
				endDisconnect(disconnect);
				endMove(move);

				// Turn on add mode
				dom.addEventListener('click', addNode);

			} else {
				// Turn off add mode
				endAdd(add);
			}
		};

		// Remove Mode
		remove.onclick = function() {
			if (this.checked) {
				// Turn off all other modes
				endAdd(add);
				endConnect(connect);
				endDisconnect(disconnect);
				endMove(move);

				// Turn on remove mode
				s.bind('clickNode', removeNode);

			} else {
				// Turn off remove mode
				endRemove(remove);
			}
		};

		// Connect Mode
		connect.onclick = function() {
			if (this.checked) {
				// Turn off all other modes
				endAdd(add);
				endRemove(remove);
				endDisconnect(disconnect);
				endMove(move);

				// Turn on connect mode
				s.bind('clickNode', connectionStart);

			} else {
				// Turn off connect mode
				endConnect(connect);
			}
		};

		// Disconnect Mode
		disconnect.onclick = function() {
			if (this.checked) {
				// Turn off all other modes
				endAdd(add);
				endRemove(remove);
				endConnect(connect);
				endMove(move);

				// Turn on disconnect mode
				s.bind('clickEdge', removeEdge);

			} else {
				// Turn off disconnect mode
				endDisconnect(disconnect);
			}
		};

		// Move Mode
		move.onclick = function() {
			if (this.checked) {
				// Turn off all other modes
				endAdd(add);
				endRemove(remove);
				endConnect(connect);
				endDisconnect(disconnect);

				// Turn on move mode
				dragListener = sigma.plugins.dragNodes(s, s.renderers[0]);

			} else {
				// Turn off move mode
				endMove(move);
			}
		};
	}
}, 100); // Check every 100ms