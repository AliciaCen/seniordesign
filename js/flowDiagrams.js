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
var secureAlg = require("./js/secureAlg.js")
var efficientAlg = require("./js/efficientAlg.js");

// format of hardware database
// Brand, Model, Quality, Node type, WAN ports, LAN ports, Ethernet speed, 2.4 GHz speed, 5.0GHz speed, 
// wireless capability, price

// load in the hardware database
let rawdata = fs.readFileSync('./hardware_database.json');
let hardware = JSON.parse(rawdata);

// variable for invidivdual error messages
var errorMessage = "TEST ERROR -- errorMessage variable is working correctly";

//secureAlg.secureConnections(20);

// efficientAlg.generateNetwork(8000,88);

	// The function below is just to display the number of nodes the user enters. This function is only for demonstration purposes and will be removed. 
function demoNodeNum() {
	var x = document.getElementById("nodeNumber").value;

	if (x > 30) {
		errorMessage = "Please enter a number less than or equal 30";
		showError();
	} else {
		nodeModification.clearAll();
		s.graph.clear()
		s.refresh()

		if (x != "0") {
			var sec = document.getElementById("prefSecure").checked;
			var eff = document.getElementById("prefEfficient").checked;
		
			if (sec) {
				secureAlg.secureConnections(x);
				loadConfig("nodeList.json")
	
			} else if (eff) {
				efficientAlg.generateNetwork(8000,x);
				loadConfig("nodeList.json")
			}
		}
		document.getElementById("networkConfig").style.display = "none";
	}

	
}




function showError() {
	$("#errorPopup").show();
	// find errorInfo and display the contents of errorMessage
	document.getElementById("errorInfo").innerHTML = errorMessage;

	document.getElementById("closeError").onclick =
		function () {
			$("#errorPopup").hide()
		}
}

sigma.utils.pkg('sigma.canvas.nodes');
sigma.canvas.nodes.image = (function() {
	var _cache = {},
		_loading = {},
		_callbacks = {};

	// Return the renderer itself:
	var renderer = function(node, context, settings) {
		var args = arguments,
			prefix = settings('prefix') || '',
			size = node[prefix + 'size'],
			color = node.color || settings('defaultNodeColor'),
			url = node.url;

		if (_cache[url]) {
			context.save();

			// Draw the image
			context.drawImage(
				_cache[url],
				node[prefix + 'x'] - size,
				node[prefix + 'y'] - size,
				2 * size,
				2 * size
			);

			// Quit the "clipping mode":
			context.restore();

		} else {
			sigma.canvas.nodes.image.cache(url);
			sigma.canvas.nodes.def.apply(
				sigma.canvas.nodes,
				args
			);
		}
	};

	// Let's add a public method to cache images, to make it possible to
	// preload images before the initial rendering:
	renderer.cache = function(url, callback) {
		if (callback)
			_callbacks[url] = callback;

		if (_loading[url])
			return;

		var img = new Image();

		img.onload = function() {
			_loading[url] = false;
			_cache[url] = img;

			if (_callbacks[url]) {
				_callbacks[url].call(this, img);
				delete _callbacks[url];
			}
		};

		_loading[url] = true;
		img.src = url;
	};

	return renderer;
})();

var s,
	cam,
	dom,
	g = {
		nodes: [],
		edges: []
	},
	n = 0,
	images = [
		"img/circle.png",
		"img/triangle.png",
		"img/square.png",
		"img/hexagon.png"
	],
	loaded = 0;


images.forEach(function(url) {
	sigma.canvas.nodes.image.cache(
		url,
		function() {
			if (++loaded === images.length) {
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
			}
		}
	);
});

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
			
			
			s.unbind('clickNode', connectionComplete);
			s.bind('clickNode', connectionStart);
		}else if (result == 3){
			errorMessage = "Connection failed: No more connections available.";
			showError();
		}
		
	}


	s.unbind('clickNode', connectionStart);
	s.bind('clickNode', connectionComplete);
}

removeEdge = function(e){
	src = e.data.edge.source;
	tgt = e.data.edge.target;


	// TODO:
	// None (For now)

	nodeModification.deleteConnection(src, tgt);
	s.graph.dropEdge(e.data.edge.id);
	s.refresh()
}

naming = function(){
	name = $("#nodelabel").val()
	hardwareType = $("#hardwareType").val()
	// check to see if user left node name blank
	if (name == "") {
		errorMessage = "Please enter a name for the node.";
		showError();
		
	}
	else {
		// Check to see if the node name already exists
		currentNodes = s.graph.nodes()
		duplicate = false;
		for (var i = 0; i < currentNodes.length; i ++) {
			if (name == currentNodes[i].id) {
				duplicate = true;
			}
		}

		if (duplicate) {
			errorMessage = "Name already exists";
			showError();
		}
		else {
			document.getElementById("save").removeEventListener("click", naming);

			var imgIndex = 0
			var hardwareIndex = 1
			switch (hardwareType) {
				case "Workstation":
					imgIndex = 0;
					hardwareIndex = 6;
					break;
				case "Router":
					imgIndex = 1;
					hardwareIndex = 0;
					break;
				case "Switch":
					imgIndex = 1;
					hardwareIndex = 4;
					break;
				case "Server":
					imgIndex = 2;
					hardwareIndex = 7;
					break;
				case "Firewall":
					imgIndex = 3;
					hardwareIndex = 10;
			}
			
			nodeModification.addNode(name, hardware[hardwareIndex], newx, newy);

			s.graph.addNode({
				id: (id = name),
				label: name,
				size: 10,
				type: 'image',
				url: images[imgIndex],
				x: newx,
				y: newy,
			});
			s.refresh()
			$("#nodelabel").val("")
			$("#modalcontainer").hide();
		}
	}

}

rename = function (e) {
	id = e.data.node.id
	$("#modalcontainer").show();
	document.getElementById("nodelabel").focus()

	document.getElementById("save").onclick = renamemodal
	document.getElementById("cancel").onclick = 
		function () {
			$("#modalcontainer").hide()
			$("#nodelabel").val("")
		}
}

function renamemodal() {
	dom.removeEventListener("click", naming)
	name = $("#nodelabel").val() 

	// Check to see if the node name already exists
	currentNodes = s.graph.nodes()
	duplicate = false;
	for (var i = 0; i < currentNodes.length; i ++) {
		if (name == currentNodes[i].id) {
			duplicate = true;
		}
	}

	if (duplicate) {
		errorMessage = "Name already exists";
		showError();
	}
	// check to see if user left node name blank
	else if (name == "") {
		errorMessage = "Please enter a name for the node.";
		showError();
	}
	else {
		nodeModification.rename(s.graph.nodes(id).id, name)
		s.graph.nodes(id).label = name
		s.graph.nodes(id).id = name
		s.refresh()
		$("#modalcontainer").hide();
		$("#nodelabel").val("")
	}

}

updateCoords = function(e) {
	updatedNode = e.data.node

	nodeModification.updateCoords(updatedNode)
}

loadConfig = function(fileName) {
	//nodeModification.clearAll();

	nodeConfig = nodeModification.getNodeConfigByFile(fileName)

	// Add all nodes to the canvas
	for (var i = 0; i < nodeConfig.length; i++) {
		n = nodeConfig[i]

		hardwareType = n.nodeType
		if(hardwareType == "Server" && n.quality == "Low") {
			hardwareType = "Workstation"
		}
		imgIndex = 0
		switch (hardwareType) {
			case "Workstation":
				imgIndex = 0;
				break;
			case "Router":
				imgIndex = 1;
				break;
			case "Switch":
				imgIndex = 1;
				break;
			case "Server":
				imgIndex = 2;
				break;
			case "Firewall":
				imgIndex = 3;
		}

		s.graph.addNode({
			id: (id = n.name),
			label: n.name,
			size: 10,
			type: 'image',
			url: images[imgIndex],
			x: n.xValue,
			y: n.yValue,
		});

	}

	// Create all connections
	for (var i = 0; i < nodeConfig.length; i++) {
		n = nodeConfig[i]
		for (var j = 0; j < n.connections.length; j++) {
			src = n.name
			tgt = n.connections[j]

			// Verify the connection doesn't already exist
			exists = false;
			edges = s.graph.edges()
			for (var e = 0; e < edges.length; e++) {
				if ((edges[e].source == src && edges[e].target == tgt) || (edges[e].source == tgt && edges[e].target == src)) {
					exists = true;
				}
			}

			// If not, add the connection
			if (!exists) {
				s.graph.addEdge({
					id: 'e' + src + "-" + tgt,
					source: src,
					target: tgt,
					size: 3,
					type: 'line',
					color: '#ccc',
					hover_color: '#000'
				});
			}
		}
	}

	s.refresh()
	nodeModification.writeCurrentConfig(nodeConfig)
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
	s.unbind('clickNode', updateCoords)
}


// Mode listeners

// Wait until the Toolbox is loaded
var timer = setInterval(onToolboxLoad, 100); // Check every 100ms

function onToolboxLoad() {
	if ($('#toolbox').length) {
		clearInterval(timer);

		s.bind('doubleClickNode', rename); // Currently always active

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
				s.bind('clickNode', updateCoords);

			} else {
				// Turn off move mode
				endMove(move);
			}
		};
	}
}