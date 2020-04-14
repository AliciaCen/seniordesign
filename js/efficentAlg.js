// Custom class import
var nodeModification = require("./modifyNodes.js")

evaulateCost = function(){
    // load in the current network toplogy and sum up the price of each component
    const fs = require('fs');
    let rawdata = fs.readFileSync('./nodeList.json');
    let nodes = JSON.parse(rawdata);
    var cost = 0;

    for (var i = 0; i < nodes.length; i++){
        cost = cost + nodes[i].price;
    }
    console.log("The total price is " + cost);

}

exports.generateNetwork = function(budget, workstations){
    // load in the hardware database
    const fs = require('fs');
    let rawdata = fs.readFileSync('./hardware_database.json');
    let hardware = JSON.parse(rawdata);

    // create the inital network based on the number of workstations
    var i;
    var j;
    var switches = 0;
    var servers = 0;
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
    }
    
    // next add enough switches to handle connections based on the number of workstations specified. 
    // each switch should connect to the edge router and to a server

    while (connected < workstations){
        if (workstations - connected >= 22){
            // add a 24 port switch
            for (i = 0; i < hardware.length; i++){
                if ((hardware[i].nodeType == "Switch") && (hardware[i].quality == "High")){
                    nodeModification.addNode("Switch_" + switches, hardware[i]);
                    // switches is used for the enumeration of switch names
                    switches++;
                }
            }
            connected = connected + 22;
            console.log("Added a 24 port switch");
        }
        else if (workstations - connected > 6){
            // add a 16 port switch
            for (i = 0; i < hardware.length; i++){
                if ((hardware[i].nodeType == "Switch") && (hardware[i].quality == "Medium")){
                    nodeModification.addNode("Switch_" + switches, hardware[i]);
                    // switches is used for the enumeration of switch names
                    switches++;
                }
            }
            connected = connected + 14;
            console.log("Added a 16 port switch");
        }
        else if (workstations - connected <= 6 ){
            // add an 8 port switch
            for (i = 0; i < hardware.length; i++){
                if ((hardware[i].nodeType == "Switch") && (hardware[i].quality == "Low")){
                    nodeModification.addNode("Switch_" + switches, hardware[i]);
                    // switches is used for the enumeration of switch names
                    switches++;
                }
            }
            connected = connected + 6;
            console.log("Added an 8 port switch");
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
    

    // make connections between the edge router, switches, and the server
    for (i = 0; i < switches; i++){
        nodeModification.createConnection("Edge Router", "Switch_" + i);
    }
    console.log("Edge Router has been connected to all the switches.");

    // now connect all the switches to the data server(s)
    // each data server in this configuration can accomodate 2 switches
    j = 0;
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
    }

    console.log("All switches have been connected to the data server(s).");

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

    // evaluate the current cost of the setup
    evaulateCost();


}