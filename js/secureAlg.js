var Node = require("./Node.js")
var modifyNodes = require("./modifyNodes.js")

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
		if (hardware[i].nodeType == "Router"){
			router.push(hardware[i]);
		}
		else if (hardware[i].nodeType == "Server"){
			server.push(hardware[i]);
		}
		else{
			switches.push(hardware[i]);
		}
	}
    console.log(server[0].name)
	// when connecting nodes to server, maintain at most square root of non-router nodes rounded connections
	// only works while servers is less than square root of non-router nodes
	// add routers that connect to server to routerCon list
	var tempRouters = router;
	var routerCon = [];
	for (i = 0; i < server.length; i++){
			// eventually change so faster nodes are equally distributed among servers
			while (server[i].connections.length < Math.round(Math.sqrt(nodes.length - server.length))){
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
				modifyNodes.createConnection(server[i].name, curRouter.name);
				tempRouters.splice(tempRouters.indexOf(curRouter),1);
                routerCon.push(curRouter);
                console.log(server[i].connections)
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
			modifyNodes.createConnection(routerUncon[i].name, curRouter.name);
			tempRouters.splice(routerToCon.indexOf(curRouter),1);
			routerUncon.push(curRouter);
		}
	}
}