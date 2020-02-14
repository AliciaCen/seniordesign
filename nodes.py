#Imports, currently unused
import sys

#Basic class structure. Port and Rate are intended to be integers
#Wireless is a boolean set to 0 or 1 and Connections is a list
class Node:
    def __init__(self, Name, Ports = 1, Rate = 0, Wireless = 0, Connections = []):
        self.name = Name
        self.ports = Ports
        self.bitRate = Rate
        self.wireless = Wireless
        self.connections = Connections
    
    def __str__(self):
        return "I am a router with {} ports, a data rate of {}".format(self.ports, self.bitRate)

    def connect(self, other):
        if other not in self.connections:
            self.connections.append(other)
    
    def checkConnections(self):
        for items in self.connections:
            print(items.name)

#Create 5 basic router nodes
Router1 = Node('Router_1', 4, 2400, 0)
Router2 = Node('Router_2', 5, 3000, 0)
Router3 = Node('Router_3', 6, 3600, 0)
Router4 = Node('Router_4', 7, 4200, 0)
Router5 = Node('Router_5', 8, 4800, 0)

#Test connections between routers
#Since Python is pass by reference, these lists are all connected using the connect function
#I don't know how to currently fix this.
#The lists of each object is connected for some reason
Router1.connect(Router3)
#Router3.connect(Router1)
Router1.connect(Router4)
#Router4.connect(Router1)
Router4.connect(Router2)

Router1.checkConnections()
print (Router1.connections)
#Router3.checkConnections()
