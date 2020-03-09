from nodes import Node

Router1 = Node('Router_1', 4, 2400, 0)
Router2 = Node('Router_2', 5, 3000, 0)
Router3 = Node('Router_3', 6, 3600, 0)
Router4 = Node('Router_4', 7, 4200, 0)
Router5 = Node('Router_5', 8, 4800, 0)

Router1.connect(Router4)
Router1.connect(Router5)
Router2.connect(Router3)
Router3.connect(Router4)

Router1.checkConnections()
print("-"*40)
Router2.checkConnections()
print("-"*40)
Router3.checkConnections()
print("-"*40)
Router4.checkConnections()
print("-"*40)
Router5.checkConnections()