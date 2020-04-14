module.exports = class Node {
	constructor(name = "", brand = "", model = "", quality = "", nodeType = "Router", WANports = 1, LANports = 4, ethbitRate = 0 , lobitRate = 0, 
	hibitRate = 0, wireless = 0, price = 0, bandwidth = 0, xValue = 0, yValue = 0, connections = []) {
		this.name = name;
		this.brand = brand;
		this.model = model;
		this.quality = quality;
		this.nodeType = nodeType;
		this.WANports = WANports;
		this.LANports = LANports;
		this.ethbitRate = ethbitRate
		this.lobitRate = lobitRate;
		this.hibitRate = hibitRate;
		this.wireless = wireless;
		this.price = price;
		this.bandwidth = bandwidth;
		this.xValue = xValue;
		this.yValue = yValue;
		this.connections = connections;
	}

	toString() {
		return "I am a " + this.name + ", a " + this.nodeType + " with " + this.LANports + " ports, and a data rate of " + this.hibitRate
	}

}