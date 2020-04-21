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
    
    // create the internet facing firewall
    for (i = 0; i < hardware.length; i++){
        if ((hardware[i].nodeType == "Firewall") && (hardware[i].users == 100)){
            nodeModification.addNode("Firewall_" + firewalls, hardware[i]);
            console.log("Added the internet facing firewall.");
            firewalls++;
        }
    }
    // create the internet facing router
    for (i = 0; i < hardware.length; i++){
        if ((hardware[i].nodeType == "Router") && (hardware[i].ethbitRate == 1000)){
            nodeModification.addNode("Edge Router", hardware[i]);
            console.log("Added an internet facing router.");
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
                    console.log("Added Switch_" + switches + ", a 16 port switch");
                    // switches is used for the enumeration of switch names
                    switches++;
                }
            }
            connected = connected + 15;
			// create proper firewall for 16 port switches
			for (i = 0; i < hardware.length; i++){
        		if ((hardware[i].nodeType == "Firewall") && (hardware[i].users == 25)){
            		nodeModification.addNode("Firewall_" + firewalls, hardware[i]);
					console.log("Added Firewall_" + firewalls);
					firewalls++;
        		}
    		}
        }
        else if (workstations - connected <= 7){
            // add an 8 port switch
            for (i = 0; i < hardware.length; i++){
                if ((hardware[i].nodeType == "Switch") && (hardware[i].quality == "Low")){
                    nodeModification.addNode("Switch_" + switches, hardware[i]);
                    console.log("Added Switch_" + switches + ", an 8 port switch");
                    // switches is used for the enumeration of switch names
                    switches++;
                }
            }
            connected = connected + 7;
			// create proper firewall for 8 port switches
			for (i = 0; i < hardware.length; i++){
        		if ((hardware[i].nodeType == "Firewall") && (hardware[i].users == 10)){
            		nodeModification.addNode("Firewall_" + firewalls, hardware[i]);
					console.log("Added Firewall_" + firewalls);
					firewalls++;
        		}
    		}
        }
    }
      
    // next add data servers for intra-network file sharing. Low quailty is for workstations, medium and high quaility are for servers
    // for now there will only be one data server
    for (i = 0; i < hardware.length; i++){
        if ((hardware[i].nodeType == "Server") && (hardware[i].quality == "Medium")){
            nodeModification.addNode("Server_" + servers, hardware[i]);
            console.log("Added Server_" + servers);
        }
    }
	
	// add a firewall for the server zone
	for (i = 0; i < hardware.length; i++){
		if ((hardware[i].nodeType == "Firewall") && (hardware[i].users == 10)){
			nodeModification.addNode("Firewall_" + firewalls, hardware[i]);
			console.log("Added Firewall_" + firewalls);
			firewalls++;
		}
    }
    
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
    
    // now that all the network hardware has been created, make all the appropriate connections
    
    // firewall connections

    nodes = 0;
    while (nodes < firewalls){
        if (nodeModification.createConnection("Firewall_" + nodes, "Edge Router") == 0){
            console.log("Connected Firewall_" + nodes + " to Edge Router");
            nodes++;
        }
    }
    for (i = 1; i < firewalls; i++){
        if (i == 3){
            nodeModification.createConnection("Firewall_" + i, "Server_0");
            console.log("Connected Firewall_" + i + " to Server_0");
        }
        else{
            nodeModification.createConnection("Firewall_" + i, "Switch_" + (i - 1));
            console.log("Connected Firewall_" + i + " Switch_" + (i - 1));
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