var Node = require("./Node.js")
var modifyNodes = require("./modifyNodes.js")

exports.secureConnection = function(){
	// load in the nodeList.json file first
	// copied from addNode
	'use strict'
	// first checks to see if there is already a node with that name 
	'use strict';
	const fs = require('fs');

	// read the file first and then add the new node
	let rawdata = fs.readFileSync('./nodeList.json');

	// convert the rawdata into an array of objects
	let hardware = JSON.parse(rawdata);

	// create an array to store the nodes from the json file and to append the new addition
	// list of instantiated variables for later use
	var nodes = [];
	var i;
	var j;
	var router = []
	var server = []
	var switches = []
	var x;
	for (i = 0; i < hardware.length; i++){
		nodes.push(hardware[i]);
	}

	for (i = 0; i < nodes.length; i++){
		if (nodes[i].nodeType == "Router"){
			router.push(nodes[i]);
		}
		else if (nodes[i].nodeType == "Server"){
			server.push(nodes[i]);
		}
		else{
			switches.push(nodes[i]);
		}
	}

	// when connecting nodes to server, maintain at most square root of non-router nodes rounded connections
	// only works while servers is less than square root of non-router nodes
	// add routers that connect to server to routerCon list
	// length of connections isn't updated in real time, but in the JSON file
	var tempRouters = router;
	console.log(tempRouters);
	for (i = 0; i < server.length; i++){
			// eventually change so faster nodes are equally distributed among servers
			while (server[i].connections.length <= Math.round(Math.sqrt(nodes.length - server.length))){
				// choose fastest routers to connect to server 
				// must not already be connected to a server
				var curConnect = 0;
				var curRouter;
				// check routers unconnected to server
				for (j = 0; j < tempRouters.length - 1; j++){
					if (curConnect < tempRouters[j].ethbitRate){
						curConnect = tempRouters[j].ethbitRate;
						curRouter = tempRouters[j];
					}
				}
				// connect higheset bit rate router to server and remove from list
				server[i].connections.push(curRouter.name);
				console.log(server[i].connections.length);
				modifyNodes.createConnection(server[i].name, curRouter.name);
				tempRouters.splice(tempRouters.indexOf(curRouter),1);
				/*for (x = 0; router.length; x++){
					// this brings an error of unidentified type name, but .name works
					if (curRouter.name == router[x].name){
						router[x].connections.push(1);
					}
				}*/
		}
	}

	// make list of unconnected and connected routers
	var routerUncon = [];
	var routerCon = [];
	for (i = 0; i < router.length; i++){
		console.log(router[i].connections.length)
		if (router[i].connections.length == 0){
            routerUncon.push(router[i]);
		}
		else{
			routerCon.push(router[i]);
		}
	}
	console.log("connected routers are " + routerCon)
	console.log("unconnected routers are " + routerUncon)
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
			modifyNodes.createConnection(routerUncon[i].name, curRouter.name);
			tempRouters.splice(routerToCon.indexOf(curRouter),1);
			routerUncon.push(curRouter);
		}
	}
}