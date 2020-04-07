var Node = require("./Node.js")

// this function takes in a name of a node and a hardware object then creates a new node and adds it to the current
// network arcitecture. 
exports.addNode = function(name, data, x, y){
	// first checks to see if there is already a node with that name 
	'use strict';
	const fs = require('fs');

	// read the file first and then add the new node
	let rawdata = fs.readFileSync('./nodeList.json');

	// convert the rawdata into an array of objects
	let hardware = JSON.parse(rawdata);

	// check to see if name exists
	var i;
	for (i = 0; i < hardware.length; i++){
		if (hardware[i].name == name){
			console.log("A node by this name already exists");
			return;
		}
	}

	// the data provided is a an object with all the information needed to create a new node
	var newNode = new Node(name, data.brand, data.model, data.quality, data.nodeType, data.WANports,
		data.LANports, data.ethbitRate, data.lobitRate, data.hibitRate, data.wireless, data.price, x, y)

	// create an array to store the nodes from the json file and to append the new addition
	var nodes = [];
	var i;
	for (i = 0; i < hardware.length; i++){
		nodes.push(hardware[i]);
	}
	nodes.push(newNode);

	// get the array into json format and then write it to the nodeList.json file
	let newNodejson = JSON.stringify(nodes);
	fs.writeFileSync('./nodeList.json', newNodejson);
}

// this function will take in the name of a node, search for it in the nodeList.json file, and delete it if it is there
// this function will also delete any connections that other nodes have with the node that is being deleted. 
exports.deleteNode = function(name){
	// load in the nodeList.json file first
	'use strict'
	const fs = require('fs')
	let rawdata = fs.readFileSync('./nodeList.json');
	let hardware = JSON.parse(rawdata);

	// create an array to hold all the objects currently in the list and only push objects that don't match the name
	// of what you want deleted
	var nodes = []
	var i;
	var j;
	for (i = 0; i < hardware.length; i++){
		if (hardware[i].name != name){
			nodes.push(hardware[i]);
		}
	}
	// next find any nodes that have a connection to the node that is being deleted.
	for (i = 0; i < nodes.length; i++){
		for (j = 0; j < nodes[i].connections.length; j++){
			if (nodes[i].connections[j] == name){
				var index = nodes[i].connections[j].indexOf(name);
				nodes[i].connections.splice(index, 1);
			}
		}
	}
	// get the array into json format and then write it to the nodeList.json file
	let jsonNodes = JSON.stringify(nodes);
	fs.writeFileSync('./nodeList.json', jsonNodes);
	
}

// this function will take in the names of two nodes to connect and return a status code 
// indicating that either the connection is successful, or that one of the names is invalid
// or that the connection already exists.
exports.createConnection = function(node1, node2){
	// load in the nodeList.json file first
	'use strict'
	const fs = require('fs')
	let rawdata = fs.readFileSync('./nodeList.json');
	let hardware = JSON.parse(rawdata);

	// find the index where the first router is located
	var i;
	var firstIndex = null;
	var secondIndex = null;
	for (i = 0; i < hardware.length; i++){
		if (hardware[i].name == node1){
			firstIndex = i;
		}
	}
	// find the index where the second router is located
	for (i = 0; i < hardware.length; i++){
		if (hardware[i].name == node2){
			secondIndex = i;
		}
	}
	// if either index is still null, then one of the node names is invalid
	if(firstIndex == null || secondIndex == null){
		console.log("One of the router names is invalid.");
		return 1;
	}
	// now check to see if that connection already exists 
	for (i = 0; i < hardware[firstIndex].connections.length; i++){
		if (hardware[firstIndex].connections[i] == node2){
			console.log("This connection already exists.");
			return 2;
		}
	}
	for (i = 0; i < hardware[secondIndex].connections.length; i++){
		if (hardware[secondIndex].connections[i] == node1){
			console.log("This connection already exists.");
			return 2;
		}
	}
	// add the name of node2 to the list of connections for node1 and vice versa.
	hardware[firstIndex].connections.push(node2);
	hardware[secondIndex].connections.push(node1);
	
	// update the nodeList.json file with the updated information
	var newjson = JSON.stringify(hardware);
	fs.writeFileSync('./nodeList.json', newjson);
	return 0;
}

exports.deleteConnection = function(node1, node2){
	// load in the nodeList.json file first
	'use strict'
	const fs = require('fs')
	let rawdata = fs.readFileSync('./nodeList.json');
	let hardware = JSON.parse(rawdata);

	// find the index where the first router is located
	var i;
	var firstIndex = null;
	var secondIndex = null;
	for (i = 0; i < hardware.length; i++){
		if (hardware[i].name == node1){
			firstIndex = i;
		}
	}
	// find the index where the second router is located
	for (i = 0; i < hardware.length; i++){
		if (hardware[i].name == node2){
			secondIndex = i;
		}
	}
	// if either index is still null, then one of the node names is invalid
	if(firstIndex == null || secondIndex == null){
		console.log("One of the router names is invalid.");
		return;
	}
	// check to see if there is a connection between node1 and node2
	if (hardware[firstIndex].connections.includes(node2) != true){
		console.log("This connection does not exist.");
		return;
	}
	// remove the connection from both nodes
	for (i = 0; i < hardware[firstIndex].connections.length; i++){
		if (hardware[firstIndex].connections[i] == node2){
			var index = hardware[firstIndex].connections[i].indexOf(node2);
			hardware[firstIndex].connections.splice(index, 1);
		}
	}
	for (i = 0; i < hardware[secondIndex].connections.length; i++){
		if (hardware[secondIndex].connections[i] == node1){
			var index = hardware[secondIndex].connections[i].indexOf(node1);
			hardware[secondIndex].connections.splice(index, 1);
		}
	}
	// update the nodeList.json file with the updated information
	var newjson = JSON.stringify(hardware);
	fs.writeFileSync('./nodeList.json', newjson);
}

exports.clearAll = function() {
	console.log("Clearing all nodes")

	// Load the file
	const fs = require('fs')

	// Write empty JSON
	fs.writeFileSync('./nodeList.json', JSON.stringify([]));
}

exports.secureConnection = function(){
	// load in the nodeList.json file first
	// copied from delete connection
	'use strict'
	const fs = require('fs')
	let rawdata = fs.readFileSync('./nodeList.json');
	let hardware = JSON.parse(rawdata);

	// list to hold all nodes and node types
	var nodes = []
	var router = []
	var server = []
	var switches = []
	var i;
	var j;
	for (i = 0; i < hardware.length; i++){
		nodes.push(hardware[i]);
		if (hardware[i].nodeType == "router"){
			router.push(hardware[i]);
		}
		else if (hardware[i].nodeType == "server"){
			server.push(hardware[i]);
		}
		else{
			switches.push(hardware[i]);
		}
	}
	
	// when connecting nodes to server, maintain at most square root of non-router nodes rounded connections
	// only works while servers is less than square root of non-router nodes
	// add routers that connect to server to routerCon list
	var tempRouters = router;
	var routerCon = [];
	for (i = 0; i < server.length; i++){
			// eventually change so faster nodes are equally distributed among servers
			while (server[i].connections.length <= Math.round(Math.sqrt(nodes.length - server.length))){
				// choose fastest routers to connect to server 
				// must not already be connected to a server
				var curConnect = 0;
				var curRouter;
				// check routers unconnected to server
				for (j = 0; j < tempRouters.length - 1; j++){
					if (curConnect < router[j].ethbitRate){
						curConnect = router[j].ethbitRate;
						curRouter = router[j];
					}
				}
				// connect higheset bit rate router to server and remove from list
				createConnection(server[i].name, curRouter.name);
				tempRouters.splice(tempRouters.indexOf(curRouter),1);
				routerCon.push(curRouter);
		}
	}

	// make list of unconnected routers
	var routerUncon = router;
	for (i = 0; i < routerUncon.length; i++){
		if (routerCon.includes(routerUncon[i])){
			routerUncon.splice(i,1);
		}
	}
	
	// make modifiable list of server connected routers
	// connect remainder of routers to a server connected router based on fastest to slowest
	// only works if number of unconnected routers is <= server connected routers
	var routerToCon = routerCon;
	var curConnect = 0;
	var curRouter;
	// connect all unconnected nodes to one connected to routers
	for (i = 0; i < routerUncon.length; i++){
		for (j = 0; j < routerToCon.length;){
			if (routerToCon[j].ethbitRate > curConnect){
				curConnect = routerToCon[j].ethbitRate;
				curRouter = routerToCon[j];
			}
			createConnection(routerUncon[i].name, curRouter.name);
			tempRouters.splice(routerToCon.indexOf(curRouter),1);
			routerUncon.push(curRouter);
		}
	}
}