module.exports = class Node {
	constructor(name = "", brand = "", model = "", quality = "", nodeType = "Router", WANports = 1, LANports = 4, ethbitRate = 0 , lobitRate = 0, 
	hibitRate = 0, wireless = 0, price = 0, bandwidth = 0, xValue = 0, yValue = 0, connections = []) {
	#name = "";
	#brand = "";
	#model = "";
	#quality = "";
	#nodeType = "Router";
	#WANports = 1;
	#LANports = 4;
	#ethbitRate = 0
	#lobitRate = 0;
	#hibitRate = 0;
	#wireless = 0;
	#price = 0;
	#xValue = 0;
	#yValue = 0;
	#connections = [];

	defineAll(name, brand, model, quality, nodeType, WANports, LANports, ethbitRate, lobitRate, 
	hibitRate, wireless, price, xValue, yValue, connections){
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

	get name() { return this.#name;	};
	set name(name) { this.#name = name };

	get brand() { return this.#brand };
	set brand(brand) { this.#brand = brand };

	get model() { return this.#model };
	set model(model) { this.#model = model };

	get quality() { return this.#quality };
	set quality(quality) { this.#quality = quality };

	get nodeType() { return this.#nodeType };
	set nodeType(nodeType) { this.#nodeType = nodeType };

	get WANports() { return this.#WANports };
	set WANports(WANports) { this.#WANports = WANports };

	get LANports() { return this.#LANports };
	set LANports(LANports) { this.#LANports = LANports };

	get ethbitRate() { return this.#ethbitRate };
	set ethbitRate(ethbitRate) { this.#ethbitRate = ethbitRate };

	get lobitRate() { return this.#lobitRate };
	set lobitRate(lobitRate) { this.#lobitRate = lobitRate };

	get hibitRate() { return this.#hibitRate };
	set hibitRate(hibitRate) { this.#hibitRate = hibitRate };

	get wireless() { return this.#wireless };
	set wireless(wireless) { this.#wireless = wireless };

	get price() { return this.#price };
	set price(price) { this.#price = price };

	get xValue() { return this.#xValue };
	set xValue(xValue) { 
		if (Number.isInteger(xValue))
			this.#xValue = xValue;
	};

	get yValue() { return this.#yValue };
	set yValue(yValue) { 
		if (Number.isInteger(yValue))
			this.#yValue = yValue;
	};

	get connections() { return this.#connections };
	set connections(connections) {
		if (Array.isArray(connections))
			this.#connections = connections
	};

	toJSON() {
		return { "name":this.name , "brand":this.brand, "model":this.model, "quality":this.quality, "nodeType":this.nodeType, 
		"WANports":this.WANports, "LANports":this.LANports, "ethbitRate":this.ethbitRate, "lobitRate":this.lobitRate, 
		"hibitRate":this.hibitRate, "wireless":this.wireless, "xValue":this.xValue, "yValue":this.yValue, "connections":this.connections}
	}

	toString() {
		return "I am " + this.name + ", a " + this.nodeType + " with " + this.LANports + " ports, and a data rate of " + this.hibitRate
	}

	connect(other) {
		
		if (this.connections.length >= this.LANports)
			return false;
		else
			this.connections.push(other);

		return true;
	}
}