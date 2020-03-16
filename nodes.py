# Imports
import sys
import json

# Functions to have:
# incidentEdges(node)				-> checkConnections()
# insertVertex(node)				-> new Node()
# insertEdge(node, node2, edge)		-> node.connect(otherNode)
# removeVertex(node)				-> TODO (extra Data structure to hold nodes)
# removeEdge(edge)					-> TODO node.disconnect(otherNode) or node.disconnectAll()

# List of Nodes
dataList = []

# Basic class structure. Port and Rate are intended to be integers
# Wireless is a boolean set to 0 or 1 and Connections is a list
class Node:
	def __init__(self, name, ports = 1, bitRate = 0, wireless = 0, connections = None):
		self.name = name
		self.ports = ports
		self.bitRate = bitRate
		self.wireless = wireless
		self.connections = connections if connections is not None else []

	def __str__(self):
		return "I am {}, a router with {} ports, a data rate of {}".format(self.name, self.ports, self.bitRate)

	# Connect node to existing node
	# Checks if nodes are already connected
	def connect(self, other):
		if other.name not in self.connections:
			self.connections.append(other.name)
			other.connections.append(self.name)

	# Reads all existing connections as string
	def checkConnections(self):
		for item in self.connections:
			print (item)

	# Check to see if the node has that neighbor
	# If so, delete it
	def disconnect(self, other):
		if other.name in self.connections:
			self.connections.remove(other.name)
			other.connections.remove(self.name)

	# Clear all connections
	def disconnectAll(self):
		pass

	@classmethod
	def from_json(cls, data):
		return cls(data)

# Create 5 basic router nodes
Router1 = Node('Router_1', 4, 2400, 0)
Router2 = Node('Router_2', 5, 3000, 0)
Router3 = Node('Router_3', 6, 3600, 0)
Router4 = Node('Router_4', 7, 4200, 0)
Router5 = Node('Router_5', 8, 4800, 0)

# List of all nodes
dataList.append(Router1)
dataList.append(Router2)
dataList.append(Router3)
dataList.append(Router4)
dataList.append(Router5)

# Test connections between routers
Router1.connect(Router3)
Router3.connect(Router1)
Router1.connect(Router4)
Router4.connect(Router1)
Router4.connect(Router2)

#print (Router1.checkConnections())
data = json.dumps(Router1.__dict__, indent=4)
#print (data)

decodedData = Node(**json.loads(data))
#print (decodedData)

# You need to create a list of nodes
with open("nodeList.json", "w") as writeFile:
	for items in dataList:
		data = json.dumps(items.__dict__)
		writeFile.write(data)
		writeFile.write("\n")

nodeList = []

with open("nodeList.json", "r") as readFile:
	for line in readFile:
		nodeList.append(Node(**json.loads(line)))

for item in nodeList:
	print (item)

# How to scan for specific router and relay it's connections
for item in nodeList:
	if item.name == "Router_1":
		item.checkConnections()