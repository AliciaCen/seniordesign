var Node = require("./Node.js")
var modifyNodes = require("./modifyNodes.js")

changeCoords = function(){
    // load in the current network toplogy 
    const fs = require('fs');
    let rawdata = fs.readFileSync('./nodeList.json');
    let nodes = JSON.parse(rawdata);

    // add nodes of each hardware type into their own arrays
    var routers = [];
    var switches = [];
    var workstations = [];
    var firewalls = []
    var databases = [];
    var i = 0;
    var j = 0;
    var k = 0;
    var xCoord = 0;
    var xCoord2 = 0;
    var yCoord = 0;
    var xoffset = 50;
    var yoffest = 50;

    for (i = 0; i < nodes.length; i++){
        if (nodes[i].nodeType == "Router"){
            routers.push(nodes[i]);
        }
        else if (nodes[i].nodeType == "Switch"){
            switches.push(nodes[i]);
        }
        else if (nodes[i].nodeType == "Server" && nodes[i].quality == "Low"){
            workstations.push(nodes[i]);
        }
        else if (nodes[i].nodeType == "Firewall"){
            firewalls.push(nodes[i]);
        }
        else{
            databases.push(nodes[i]);
        }
    }

    // place edge router in center and connected firewall off to left
    for (i = 0; i < routers.length; i++){
        if (routers[i].name == "Edge Router"){
            routers[i].xValue = 0;
            routers[i].yValue = 0;
            nodeModification.addCoords(routers[i]);
        }
    }

    for (i = 0; i < firewalls.length; i++){
        if (firewalls[i].name == "FW_0"){
            firewalls[i].xValue = -100;
            firewalls[i].yValue = 0;
        }
    }

    // setup switches and firewalls into position
    if (switches.length/2 < 1){
        xCoord = (375)
    }
    else{
        xCoord = (375/(switches.length/2));
    }
    for (i = 0; i < switches.length; i++){
        if(i < (switches.length/2)){
            switches[i].xValue = (-375 + (i+1)*xCoord);
            switches[i].yValue = (-187.5);
        }
        else {
            switches[i].xValue = (-375 + (i-(switches.length)/2 + 1)*xCoord);
            switches[i].yValue = (187.5);
        }
        for (j = 0; j < firewalls.length; j++){
            if (switches[i].connections.includes(firewalls[j].name)){
                firewalls[j].yValue = switches[i].yValue;
                firewalls[j].xValue = (switches[i].xValue + 25);
            }
        }
        nodeModification.addCoords(switches[i]);
    }

    // organize connected workstations around switches
    if (switches.length/2 < 1){
        xCoord = (750)
    }
    else{
        xCoord = (750/(switches.length/2));
    }
    for (i = 0; i < switches.length; i++){
        for (j = 0; j < workstations.length; j++){
            xCoord2 = xCoord/(switches[i].connections.length/2);
            for(k = 0; k < switches[i].connections.length; k++){
                // Place first half above switch and second half below switch
                if (switches[i].connections[k] == workstations[j].name && k <= (switches[i].connections.length/2) && i < (switches.length/2)){
                    workstations[j].xValue = (-375 + (i*xCoord) + ((k-1)*xCoord2));
                    workstations[j].yValue = -270;
                }
                else if (switches[i].connections[k] == workstations[j].name && k > (switches[i].connections.length/2) && i < (switches.length/2)){
                    workstations[j].xValue = (-375 + i*xCoord + (k - switches[i].connections.length/2)*xCoord2);
                    workstations[j].yValue = -115;
                }
                // Bottom switches
                else if (switches[i].connections[k] == workstations[j].name && k <= (switches[i].connections.length/2) && i >= (switches.length/2)){
                    workstations[j].xValue = (-375 + (i - switches.length/2)*xCoord + (k - 1)*xCoord2);
                    workstations[j].yValue = 115;
                }
                else if (switches[i].connections[k] == workstations[j].name && k > (switches[i].connections.length/2) && i >= (switches.length/2)){
                    workstations[j].xValue = (-375 + (i - switches.length/2)*xCoord + (k - switches[i].connections.length/2)*xCoord2);
                    workstations[j].yValue = 270;
                }
            }
        }
    }

    // make server coordinates and update
    yCoord = 200/databases.length;
    for(i = 0; i < databases.length; i++){
        databases[i].xValue = 325;
        databases[i].yValue = -100 + i*yCoord;
        nodeModification.addCoords(databases[i]);
        for (j = 0; j < firewalls.length; j++){
            if (databases[i].connections.includes(firewalls[j].name)){
                firewalls[j].yValue = 0;
                firewalls[j].xValue = 125;
            }
        }
    }

    // update coordinates of workstations
    for (i = 0; i < workstations.length; i++){
        nodeModification.addCoords(workstations[i]);
    }

    // update coordinates of firewalls
    for (i = 0; i < firewalls.length; i++){
        nodeModification.addCoords(firewalls[i]);
    }
}

exports.secureConnections = function(workstations){
    // load in the hardware database
    const fs = require('fs');
    let rawdata = fs.readFileSync('./hardware_database.json');
    let hardware = JSON.parse(rawdata);

    // create the inital network based on the number of workstations
    var i;
    var j;
    var switches = 0;
	var servers = 0;
	var firewalls = 0;
    var switchSpace = 0;
    var nodes = 0;
    var connected = 0;

	// for now we will assume gigabit internet speeds going into the network from the internet
    
    // create the internet facing firewall
    for (i = 0; i < hardware.length; i++){
        if ((hardware[i].nodeType == "Firewall") && (hardware[i].users == 100)){
            nodeModification.addNode("FW_" + firewalls, hardware[i]);
            firewalls++;
        }
    }
    // create the internet facing router
    for (i = 0; i < hardware.length; i++){
        if ((hardware[i].nodeType == "Router") && (hardware[i].ethbitRate == 1000)){
            nodeModification.addNode("Edge Router", hardware[i]);
		}
	}
	
    // next add enough switches to handle connections based on the number of workstations specified. 
    // each switch should connect to a firewall that connects to a central router

    while (connected < workstations){
        if (workstations - connected > 7){
            // add a 16 port switch
            for (i = 0; i < hardware.length; i++){
                if ((hardware[i].nodeType == "Switch") && (hardware[i].quality == "Medium")){
                    nodeModification.addNode("SW_" + switches, hardware[i]);
                    // switches is used for the enumeration of switch names
                    switches++;
                }
            }
            connected = connected + 15;
			// create proper firewall for 16 port switches
			for (i = 0; i < hardware.length; i++){
        		if ((hardware[i].nodeType == "Firewall") && (hardware[i].users == 25)){
            		nodeModification.addNode("FW_" + firewalls, hardware[i]);
					firewalls++;
        		}
    		}
        }
        else if (workstations - connected <= 7){
            // add an 8 port switch
            for (i = 0; i < hardware.length; i++){
                if ((hardware[i].nodeType == "Switch") && (hardware[i].quality == "Low")){
                    nodeModification.addNode("SW_" + switches, hardware[i]);
                    // switches is used for the enumeration of switch names
                    switches++;
                }
            }
            connected = connected + 7;
			// create proper firewall for 8 port switches
			for (i = 0; i < hardware.length; i++){
        		if ((hardware[i].nodeType == "Firewall") && (hardware[i].users == 10)){
            		nodeModification.addNode("FW_" + firewalls, hardware[i]);
					firewalls++;
        		}
    		}
        }
    }
      
    // next add data servers for intra-network file sharing. Low quailty is for workstations, medium and high quaility are for servers
    // for now there will only be one data server
    for (i = 0; i < hardware.length; i++){
        if ((hardware[i].nodeType == "Server") && (hardware[i].quality == "Medium")){
            nodeModification.addNode("SE_" + servers, hardware[i]);
        }
    }
	
	// add a firewall for the server zone
	for (i = 0; i < hardware.length; i++){
		if ((hardware[i].nodeType == "Firewall") && (hardware[i].users == 10)){
			nodeModification.addNode("FW_" + firewalls, hardware[i]);
			firewalls++;
		}
    }
    
    // create all the workstations with the low quality server hardware
    for (i = 0; i < hardware.length; i++){
        if (hardware[i].nodeType == "Server" && hardware[i].quality == "Low"){
            while (nodes < workstations){
                nodeModification.addNode("WS_" + nodes, hardware[i]);
                nodes++;
            }
        }
    }
    
    // now that all the network hardware has been created, make all the appropriate connections
    
    // firewall connections

    nodes = 0;
    while (nodes < firewalls){
        if (nodeModification.createConnection("FW_" + nodes, "Edge Router") == 0){
            console.log("Connected Firewall_" + nodes + " to Edge Router");
            nodes++;
        }
    }
    for (i = 1; i < firewalls; i++){
        if (i == (firewalls-1)){
            nodeModification.createConnection("FW_" + i, "SE_0");
        }
        else{
            nodeModification.createConnection("FW_" + i, "SW_" + (i - 1));
        }
    }


    // now connect all the workstations to switches
    nodes = 0;
    i = 0;
    while (nodes < workstations){
        if (nodeModification.createConnection("SW_" + i, "WS_" + nodes) == 0){
            nodes++;
        }
        else{
            i++;
        }
    }
    // update coordinates to display nodes properly
    changeCoords();
}