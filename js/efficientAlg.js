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

addCoords = function(){
    // load in the current network toplogy 
    const fs = require('fs');
    let rawdata = fs.readFileSync('./nodeList.json');
    let nodes = JSON.parse(rawdata);

    // add nodes of each hardware type into their own arrays
    var routers = [];
    var switches = [];
    var workstations = [];
    var databases = [];
    var i = 0;
    var j = 0;
    var k = 0;
    var xCoord = 0;
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
        else{
            databases.push(nodes[i]);
        }
    }
    console.log(databases);
    // add x and y coordinates to nodes based on node type
    
    // place the edge router
    routers[0].xValue = -350
    routers[0].yValue = 0
    nodeModification.addCoords(routers[0]);

    // now place the switches
    for (i = 0; i < switches.length; i++){
        // start at the top and work down max of 4 switches
        if (i == 0){
            switches[i].yValue = -225;
        }
        else if (i == 1){
            switches[i].yValue = 225;
        }
        else if (i == 2){
            switches[i].yValue = 75;
        }
        else{
            switches[i].yValue = 225;
        }
        nodeModification.addCoords(switches[i]);
    }

    // now add all the workstations
    for (i = 0; i < switches.length; i++){
        if (i == 0){
            // workstations need to be in the top most zone
            // add workstations from left to right, top to bottom in that zone
            xCoord = -250;
            l = 0;
            for (j = 0; j < workstations.length; j++){
                for (k = 0; k < switches[i].connections.length; k++){
                    if (workstations[j].name == switches[i].connections[k]){
                        // this workstation is connected to this switch
                        if (l <= switches[i].connections.length / 2 - 2){
                            workstations[j].xValue = xCoord;
                            workstations[j].yValue = -275;
                            l++;
                        }
                        else{
                            workstations[j].xValue = xCoord - (l * 50);
                            workstations[j].yValue = -175;
                        }
                        xCoord = xCoord + xoffset;
                        nodeModification.addCoords(workstations[j]);
                    }
                }
            }
        }
        else if (i == 1){
            // workstations need to be in the upper zone
            // add workstations from left to right, top to bottom in that zone
            xCoord = -250;
            l = 0;
            for (j = 0; j < workstations.length; j++){
                for (k = 0; k < switches[i].connections.length; k++){
                    if (workstations[j].name == switches[i].connections[k]){
                        // this workstation is connected to this switch
                        if (l <= switches[i].connections.length / 2 - 2){
                            workstations[j].xValue = xCoord;
                            workstations[j].yValue = 175;
                            l++;
                        }
                        else{
                            workstations[j].xValue = xCoord - (l * 50);
                            workstations[j].yValue = 275;
                        }
                        xCoord = xCoord + xoffset;
                        nodeModification.addCoords(workstations[j]);
                    }
                }
            }
        }
    
        else if (i == 2){
            // workstations need to be in the lower zone
            // add workstations from left to right, top to bottom in that zone
            xCoord = -250;
            l = 0;
            for (j = 0; j < workstations.length; j++){
                for (k = 0; k < switches[i].connections.length; k++){
                    if (workstations[j].name == switches[i].connections[k]){
                        // this workstation is connected to this switch
                        if (l <= switches[i].connections.length / 2 - 2){
                            workstations[j].xValue = xCoord;
                            workstations[j].yValue = 25;
                            l++;
                        }
                        else{
                            workstations[j].xValue = xCoord - (l * 50);
                            workstations[j].yValue = 125;
                        }
                        xCoord = xCoord + xoffset;
                        nodeModification.addCoords(workstations[j]);
                    }
                }
            }
        }
        else{
            // workstations need to be in the bottom most zone  
            // add workstations from left to right, top to bottom in that zone
            xCoord = -250;
            l = 0;
            for (j = 0; j < workstations.length; j++){
                for (k = 0; k < switches[i].connections.length; k++){
                    if (workstations[j].name == switches[i].connections[k]){
                        // this workstation is connected to this switch
                        if (l <= switches[i].connections.length / 2 - 2){
                            workstations[j].xValue = xCoord;
                            workstations[j].yValue = 175;
                            l++;
                        }
                        else{
                            workstations[j].xValue = xCoord - (l * 50);
                            workstations[j].yValue = 275;
                        }
                        xCoord = xCoord + xoffset;
                        nodeModification.addCoords(workstations[j]);
                    }
                }
            } 
        }
    }
    
    // now add the database
    if (databases.length == 2){
        databases[0].xValue = 325;
        databases[0].yValue = -100;
        databases[1].xValue = 325;
        databases[1].yValue = 100;
    }
    else{
        databases[0].xValue = 325;
    }
    for (i = 0; i < databases.length; i++){
        nodeModification.addCoords(databases[i]);
    }
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
                nodeModification.addNode("WS_" + nodes, hardware[i]);
                console.log("Created workstation_" + nodes);
                nodes++;
            }
        }
    }

    // now connect all the workstations to switches
    nodes = 0;
    i = 0;
        while (nodes < workstations){
            if (nodeModification.createConnection("Switch_" + i, "WS_" + nodes) == 0){
                console.log("Connected workstation_" + nodes + " to Switch_" + i);
                nodes++;
            }
            else{
                i++;
            }
        }
    
    // now add x and y coordinates to all the nodes on the network
    addCoords();

    // evaluate the current cost of the setup
    evaulateCost();


}