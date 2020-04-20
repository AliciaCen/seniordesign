var Node = require("./Node.js")
var modifyNodes = require("./modifyNodes.js")

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
	
    // find a router that can handle gigabit speeds and create a new node with that data and append it to the nodes list
    for (i = 0; i < hardware.length; i++){
        if ((hardware[i].nodeType == "Router") && (hardware[i].ethbitRate == 1000)){
            nodeModification.addNode("Edge Router", hardware[i]);
            console.log("Added a router connected to the Internet.");
		}
		for (i = 0; i < hardware.length; i++){
        		if ((hardware[i].nodeType == "Firewall") && (hardware[i].users == 100)){
            		nodeModification.addNode("Firewall_" + firewalls, hardware[i]);
					console.log("Added a new firewall");
					nodeModification.createConnection("Firewall_" + firewalls, "Edge Router")
					firewalls++;
        		}
    		}
	}
	
	// Create central router/switch to connect servers, switches, and edge router together using a medium switch to support all connections
	for (i = 0; i < hardware.length; i++){
        if ((hardware[i].nodeType == "Switch") && (hardware[i].quality == "Medium")){
            nodeModification.addNode("Central Router", hardware[i]);
            console.log("Added a router connected to the Internet.");
		}
		for (i = 0; i < hardware.length; i++){
        		if ((hardware[i].nodeType == "Firewall") && (hardware[i].users == 100)){
            		nodeModification.addNode("Firewall_" + firewalls, hardware[i]);
					console.log("Added a new firewall");
					nodeModification.createConnection("Firewall_" + firewalls, "Central Router")
					firewalls++;
        		}
    		}
    }
    
    // next add enough switches to handle connections based on the number of workstations specified. 
    // each switch should connect to a firewall that connects to a central router

    while (connected < workstations){
        if (workstations - connected > 7){
            // add a 16 port switch
            for (i = 0; i < hardware.length; i++){
                if ((hardware[i].nodeType == "Switch") && (hardware[i].quality == "Medium")){
                    nodeModification.addNode("Switch_" + switches, hardware[i]);
                    // switches is used for the enumeration of switch names
                    switches++;
                }
            }
            connected = connected + 15;
			console.log("Added a 16 port switch");
			// create proper firewall for 16 port switches
			for (i = 0; i < hardware.length; i++){
        		if ((hardware[i].nodeType == "Firewall") && (hardware[i].users == 25)){
            		nodeModification.addNode("Firewall_" + firewalls, hardware[i]);
					console.log("Added a new firewall");
					nodeModification.createConnection("Firewall_" + firewalls, "Switch" + (switches - 1))
					firewalls++;
        		}
    		}
        }
        else if (workstations - connected <= 7){
            // add an 8 port switch
            for (i = 0; i < hardware.length; i++){
                if ((hardware[i].nodeType == "Switch") && (hardware[i].quality == "Low")){
                    nodeModification.addNode("Switch_" + switches, hardware[i]);
                    // switches is used for the enumeration of switch names
                    switches++;
                }
            }
            connected = connected + 7;
			console.log("Added an 8 port switch");
			// create proper firewall for 8 port switches
			for (i = 0; i < hardware.length; i++){
        		if ((hardware[i].nodeType == "Firewall") && (hardware[i].users == 10)){
            		nodeModification.addNode("Firewall_" + firewalls, hardware[i]);
					console.log("Added a new firewall");
					nodeModification.createConnection("Firewall_" + firewalls, "Switch" + (switches - 1))
					firewalls++;
        		}
    		}
        }
    }
    // next add data servers for intra-network file sharing. Low quailty is for workstations, medium and high quaility are for servers
    // the number of servers needed depend on how many switches there are. 
    while (switchSpace < switches){

        // add a data server to accomadate additional switches
        for (i = 0; i < hardware.length; i++){
            if ((hardware[i].nodeType == "Server") && (hardware[i].quality == "Medium")){
                nodeModification.addNode("Server_" + servers, hardware[i]);
                console.log("Added a data server.");
            }
        }
        switchSpace = switchSpace + 2;
        servers++;
    }
	
	// create firewall for server zone
	for (i = 0; i < hardware.length; i++){
		if ((hardware[i].nodeType == "Firewall") && (hardware[i].users == 10)){
			nodeModification.addNode("Firewall_" + firewalls, hardware[i]);
			console.log("Added a new firewall");
			firewalls++;
		}
	}

	// connect all servers to server firewall
	for (i = 0; i < servers; i++){
		nodeModification.createConnection("Server_" + i, "Firewall_" + (firewalls - 1));
	}

    // make connections between the edge router, switches, and the server
    for (i = 0; i < firewalls; i++){
        nodeModification.createConnection("Central Router", "Firewall_" + i);
    }
    console.log("Central Router has been connected to all the Firewalls.");

    // now connect all the switches to the data server(s)
    // each data server in this configuration can accomodate 2 switches
	// disabled because zones connect to central router/switch instead of to each server
	/*j = 0;
    for (i = 0; i < switches; i++){
        if (i < 2){
            nodeModification.createConnection("Switch_" + i, "Server_" + j)
        }
        if (i == 1){
            j++
        }
        if (i >= 2){
            nodeModification.createConnection("Switch_" + i, "Server_" + j)
        }
        console.log("Connected Switch_" + i + " to Server_" + j);
    }*/

    // create all the workstations with the low quality server hardware
    for (i = 0; i < hardware.length; i++){
        if (hardware[i].nodeType == "Server" && hardware[i].quality == "Low"){
            while (nodes < workstations){
                nodeModification.addNode("workstation_" + nodes, hardware[i]);
                console.log("Created workstation_" + nodes);
                nodes++;
            }
        }
    }

    // now connect all the workstations to switches
    nodes = 0;
    i = 0;
        while (nodes < workstations){
            if (nodeModification.createConnection("Switch_" + i, "workstation_" + nodes) == 0){
                console.log("Connected workstation_" + nodes + " to Switch_" + i);
                nodes++;
            }
            else{
                i++;
            }
		}
}