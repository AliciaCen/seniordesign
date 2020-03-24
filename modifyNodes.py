import sys
import json
from nodes import Node

# Read data from stdin
data = sys.stdin.readlines()

# split the data by the delimiter to get the arguments
# data is a single element list with "\n" at the end of the element
arguments = data[0].split(":")

if(arguments[0] == "Add"):
    # create a node with the specified arguments
    newNode = Node(arguments[1], int(arguments[2]), int(arguments[3]), int(arguments[4]))
    nodeList = []
    # load the json data
    with open("nodeList.json", "r") as readFile:
        for line in readFile:
            nodeList.append(Node(**json.loads(line)))

    # add the new node to the nodeList
    nodeList.append(newNode)
    
    # rewrite the edited json data
    with open("nodeList.json", "w") as f:
        for node in nodeList:
            data = json.dumps(node.__dict__)
            f.write(data)
            f.write("\n")
    
elif(arguments[0] == "Delete"):
    nodeList = []
    # load the json data
    with open("nodeList.json", "r") as readFile:
        for line in readFile:
            nodeList.append(Node(**json.loads(line)))

    # find the node in question
    for node in nodeList:
        if(node.name == arguments[1]):
            nodeList.remove(node)

    # find any nodes that have the deleted node listed as a connection and remove it
    for node in nodeList:
        if(arguments[1] in node.connections):
            node.connections.remove(arguments[1])
    
    # rewrite the edited json data
    with open("nodeList.json", "w") as f:
        for node in nodeList:
            data = json.dumps(node.__dict__)
            f.write(data)
            f.write("\n")

elif(arguments[0] == "AddConnection"):
    nodeList = []
    # load the json data
    with open("nodeList.json", "r") as readFile:
        for line in readFile:
            nodeList.append(Node(**json.loads(line)))

    for item in nodeList:
	    # find the appropriate node
        if(item.name in arguments[1]):
            # append the name of the new connection
            item.connections.append(arguments[2][:-1])

        # find the node that you are connecting to and append the host node there also
        print(item.name, arguments[2])
        if(item.name in arguments[2]):
            item.connections.append(arguments[1])

    # rewrite the edited json data
    with open("nodeList.json", "w") as f:
        for node in nodeList:
            data = json.dumps(node.__dict__)
            f.write(data)
            f.write("\n")
    
elif(arguments[0] == "DeleteConnection"):
    nodeList = []
    # load the json data
    with open("nodeList.json", "r") as readFile:
        for line in readFile:
            nodeList.append(Node(**json.loads(line)))

    for item in nodeList:
	    # find the appropriate node
        if(item.name == arguments[1]):
            # delete the name of the connection
            item.connections.remove(arguments[2][:-1])
        # find the node that is at the other end of the connection
        print(item.name, arguments[2])
        if(item.name in arguments[2]):
            item.connections.remove(arguments[1])

    # rewrite the edited json data
    with open("nodeList.json", "w") as f:
        for node in nodeList:
            data = json.dumps(node.__dict__)
            f.write(data)
            f.write("\n")
else:
    print("Error")