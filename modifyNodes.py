import sys

# Read data from stdin
data = sys.stdin.readlines()

# split the data by the delimiter to get the arguments
# data is a single element list with "\n" at the end of the element
arguments = data[0].split(":")

if(arguments[0] == "Add"):
    print("We should add a node")
elif(arguments[0] == "Delete"):
    print("We should delete a node")
elif(arguments[0] == "Modify"):
    print("We should modify a node")
else:
    print("Error")