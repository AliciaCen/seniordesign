// Known Bugs:
// - Prevent dragging the screen

// TODO:
// - Allow for easy node image changing
// - Make graph-container change size to match window
// - Make toolbox better
// - Make script imports smaller

// NPM Module Imports
var sigma = require('sigma');
require('sigma/plugins/sigma.plugins.dragNodes/sigma.plugins.dragNodes.js')
var $ = require('jquery');
const fs = require('fs');

// Custom class import
var Node = require("./js/Node.js")
var nodeModification = require("./js/modifyNodes.js")
var analysis = require("./js/pathAnalysis.js")

// format of hardware database
// Brand, Model, Quality, Node type, WAN ports, LAN ports, Ethernet speed, 2.4 GHz speed, 5.0GHz speed, 
// wireless capability, price

// load in the hardware database
let rawdata = fs.readFileSync('./hardware_database.json');
let hardware = JSON.parse(rawdata);

// create network to be tested for path analysis

/* nodeModification.addNode("Router_1", hardware[1]);
nodeModification.addNode("Router_2", hardware[2]);
nodeModification.addNode("Router_3", hardware[2]);
nodeModification.addNode("Router_4", hardware[0]);
nodeModification.addNode("Router_5", hardware[0]);
nodeModification.addNode("Router_6", hardware[1]);
nodeModification.addNode("Router_7", hardware[2]);
nodeModification.addNode("Router_8", hardware[1]); */

// error codes: 0 - successful, 1 - one of the routers is invalid, 2 - this connection already exists
/* status = nodeModification.createConnection("Router_1", "Router_2");
status = nodeModification.createConnection("Router_1", "Router_3");
status = nodeModification.createConnection("Router_2", "Router_4");
status = nodeModification.createConnection("Router_3", "Router_4");
status = nodeModification.createConnection("Router_4", "Router_5");
status = nodeModification.createConnection("Router_5", "Router_6");
status = nodeModification.createConnection("Router_5", "Router_7");
status = nodeModification.createConnection("Router_7", "Router_8");
 */
// run path analysis on network
//analysis.dijksta();

function demoNodeNum() {
	var x = document.getElementById("nodeNumber").value;
	document.getElementById("demo").innerHTML = x;
}


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
	id = e.data.node.id
	$("#modalcontainer").show();
	document.getElementById("save").onclick = renamemodal
	document.getElementById("cancel").onclick = 
		function () {
			$("#modalcontainer").hide()
			$("#nodelabel").val("")
		}
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

	$("#modalcontainer").show();
	document.getElementById("nodelabel").focus()

	document.getElementById("save").onclick = naming
	document.getElementById("cancel").onclick = 
		function () {
			$("#modalcontainer").hide()
			$("#nodelabel").val("")
		}
}

removeNode = function (e) {
	nodeName = e.data.node.id
	console.log("Removing node " + nodeName)

	// TODO:
	// Make a "Clear all" function

	nodeModification.deleteNode(nodeName);

	s.graph.dropNode(e.data.node.id);
	s.refresh();
}

connectionStart = function (e) {
	toConnect = e.data.node.id

	connectionComplete = function (e) {

		var src = toConnect
		var tgt = e.data.node.id

		// TODO
		// None (for now)

		result = nodeModification.createConnection(src, tgt);
		
		if (result == 0) {
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
	}

	console.log("Initializing connection from node " + toConnect);

	s.unbind('clickNode', connectionStart);
	s.bind('clickNode', connectionComplete);
}

removeEdge = function(e){
	src = e.data.edge.source;
	tgt = e.data.edge.target;

	console.log("Removing edge between nodes " + src + " and " + tgt);

	// TODO:
	// None (For now)

	nodeModification.deleteConnection(src, tgt);
	s.graph.dropEdge(e.data.edge.id);
	s.refresh()
}

function naming(){
	dom.removeEventListener("click", naming)
	
	name = $("#nodelabel").val() 
	
	// TODO:
	// - Define Chosen Hardware
	// - Function accepts Coordinate System

	nodeModification.addNode(name, hardware[1], newx, newy);

	console.log("Creating node " + name);

	s.graph.addNode({
		id: (id = name),
		label: name,
		size: 10,
		x: newx,
		y: newy,
		color: '#666'
	});
	s.refresh()
	$("#nodelabel").val("")
	$("#modalcontainer").hide();
	
}

function renamemodal() {
	dom.removeEventListener("click", naming)
	name = $("#nodelabel").val() 
	s.graph.nodes(id).label =  name
	s.graph.nodes(id).id = name
	s.refresh()
	$("#modalcontainer").hide();
	$("#nodelabel").val("")	
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
var timer = setInterval(onToolboxLoad, 100); // Check every 100ms

function onToolboxLoad() {
	if ($('#toolbox').length) {
		clearInterval(timer);
		
		// Begin by clearing the current directory of nodes
		// EVENTUALLY WE NEED TO FIGURE OUT SAVING/LOADING
		nodeModification.clearAll();

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
}