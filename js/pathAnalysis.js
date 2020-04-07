
exports.dijksta = function(){
    // load in the current network topology
    const fs = require('fs');
    let rawdata = fs.readFileSync('./nodeList.json');
    let nodes = JSON.parse(rawdata);
    var minPaths = {};
    var visited = [];
    var startNode
    var curNode;
    var nextNode;
    var pathCost;
    var neighborbitRate = 0;
    var match;
    var sum = 0;
    var avg = 0;
    var networkavg = 0;
    var i;
    var j;
    var k;

    // we need the min cost path from each starting node to every other node on the network
    for (i = 0; i < nodes.length; i++){
        startNode = nodes[i];
        curNode = startNode
        sum = 0;
        avg = 0;
        // create a dictionary to hold the names and min cost path for each of the nodes
        // a value of 999 equates to an infinity value therefore showing that the two nodes
        // aren't directly connected.
        for (j = 0; j < nodes.length; j++){
            minPaths[nodes[j].name] = 999;
        }
        // the current node will have a min cost of 0 since it is the starting node
        minPaths[curNode.name] = 0;
        // initialize the visited list to be empty
        visited.length = 0;

        // until all nodes have been visited and evaluated, keep iterating through the algorithm
        while (visited.length < nodes.length){
            nextNode = null;

            // evaluate the cost of the current nodes neighbors to the cost held in the dictionary for the min cost paths
            for (j = 0; j < curNode.connections.length; j++){

                // find the bitRate for the neighbor being evaluated
                for (k = 0; k < nodes.length; k++){
                    if (curNode.connections[j] == nodes[k].name){
                        neighborbitRate = nodes[k].ethbitRate;
                    }
                }
                // use the lesser of the current node and neighbor bit rate for the path cost
                if (curNode.ethbitRate < neighborbitRate){
                    pathCost = curNode.ethbitRate;
                }
                else{
                    pathCost = neighborbitRate;
                }
                // adjust the value to reflect that a higher bit rate equals a lower cost on the graph
                pathCost = (1000 / pathCost);
                // compare this value to the values in the dictionary
                if ((minPaths[curNode.name] + pathCost) < minPaths[curNode.connections[j]]){
                    //console.log("Updated value for Node " + curNode.connections[j] + " with value of " + minPaths[curNode.connections[j]] + " to a value of " + (minPaths[curNode.name] + pathCost));
                    minPaths[curNode.connections[j]] = (minPaths[curNode.name] + pathCost);
                }
            }
            // add the current node to the list of visted nodes
            visited.push(curNode);
            
            // find the node with the shortest cost path that has not been visited.
            for (j = 0; j < nodes.length; j++){
                match = false;
                // for each node, check to see if it's in the visited list
                for (k = 0; k < visited.length; k++){
                    if (nodes[j].name == visited[k].name){
                        match = true;
                    }
                }
                if (!match){
                    if (nextNode == null){
                        nextNode = nodes[j];
                    }
                    else{
                        if (minPaths[nodes[j].name] < minPaths[nextNode.name]){
                            nextNode = nodes[j];
                        }
                    }
                }
            }
            curNode = nextNode;
        }
        // once the final paths have been determined, calculate the average cost to produce an efficiency score.
        for (j = 0; j < nodes.length; j++){
            if (nodes[j].name != startNode.name){
                sum = sum + minPaths[nodes[j].name];
            }
        }
        avg = (sum / (nodes.length - 1));
        networkavg = networkavg + avg;
        console.log("START NODE: " + startNode.name);
        console.log("Average Path Cost: " + avg);
    }
    // calculate the network average for all the nodes
    networkavg = networkavg / nodes.length;
    console.log("Overall Network Average: " + networkavg);
}
