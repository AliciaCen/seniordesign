#Imports, currently unused
import sys
import json

# Functions to have:
# incidentEdges(node)				-> checkConnections()
# insertVertex(node)				-> new Node()
# insertEdge(node, node2, edge)		-> node.connect(otherNode)
# removeVertex(node)				-> TODO (extra Data structure to hold nodes)
# removeEdge(edge)					-> TODO node.disconnect(otherNode) or node.disconnectAll()

#Basic class structure. Port and Rate are intended to be integers
#Wireless is a boolean set to 0 or 1 and Connections is a list
class Node:
	def __init__(self, Name, Ports = 1, Rate = 0, Wireless = 0):
		self.name = Name
		self.ports = Ports
		self.bitRate = Rate
		self.wireless = Wireless
		self.connections = []

	def __str__(self):
		return "I am {}, a router with {} ports, a data rate of {}".format(self.name, self.ports, self.bitRate)

	def connect(self, other):
		if other.name not in self.connections:
			self.connections.append(other.name)
			other.connections.append(self.name)

	def checkConnections(self):
		for item in self.connections:
			print(item)

	# Check to see if the node has that neighbor
	# If so, delete it
	def disconnect(self, other):
		pass

	# Clear all connections
	def disconnectAll(self):
		pass

#Create 5 basic router nodes
Router1 = Node('Router_1', 4, 2400, 0)
Router2 = Node('Router_2', 5, 3000, 0)
Router3 = Node('Router_3', 6, 3600, 0)
Router4 = Node('Router_4', 7, 4200, 0)
Router5 = Node('Router_5', 8, 4800, 0)

#Test connections between routers
Router1.connect(Router3)
Router3.connect(Router1)
Router1.connect(Router4)
Router4.connect(Router1)
Router4.connect(Router2)

# Router1.checkConnections()
# print("="*40)
# Router4.checkConnections()
jsonStr = json.dumps(Router1.__dict__)

print(jsonStr)