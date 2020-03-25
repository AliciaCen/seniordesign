module.exports = class Node {
	constructor(name, ports = 1, bitRate = 0, wireless = 0, nodeType = "router", xValue = 0, yValue = 0) {
		this.name = name;
		this.ports = ports;
		this.bitRate = bitRate;
		this.wireless = wireless;
		this.nodeType = nodeType;
		this.xValue = xValue;
		this.yValue = yValue;
	}

	toString() {
		return "I am " + this.name + ", a " + this.nodeType + " with " + this.ports + " ports, and a data rate of " + this.bitRate
	}

}