// Modules to control application life and create native browser window
const {app, BrowserWindow} = require('electron')
const path = require('path')

// Keep a global reference of the window object, if you don't, the window will
// be closed automatically when the JavaScript object is garbage collected.
let mainWindow

function createWindow () {
	// Create the browser window.
	mainWindow = new BrowserWindow({
		width: 1000,
		height: 800,
		webPreferences: {
			preload: path.join(__dirname, 'preload.js'),
			nodeIntegration: true
		}
	})

	// and load the index.html of the app.
	mainWindow.loadFile('index.html')

	// Open the DevTools.
	// mainWindow.webContents.openDevTools()

	// Emitted when the window is closed.
	mainWindow.on('closed', function () {
		// Dereference the window object, usually you would store windows
		// in an array if your app supports multi windows, this is the time
		// when you should delete the corresponding element.
		mainWindow = null
	})
}

// This method will be called when Electron has finished
// initialization and is ready to create browser windows.
// Some APIs can only be used after this event occurs.
app.on('ready', createWindow)

// Quit when all windows are closed.
app.on('window-all-closed', function () {
	// On macOS it is common for applications and their menu bar
	// to stay active until the user quits explicitly with Cmd + Q
	if (process.platform !== 'darwin') app.quit()
})

app.on('activate', function () {
	// On macOS it's common to re-create a window in the app when the
	// dock icon is clicked and there are no other windows open.
	if (mainWindow === null) createWindow()
})

// In this file you can include the rest of your app's specific main process
// code. You can also put them in separate files and require them here.

// DOCUMENTATION:
// https://www.npmjs.com/package/python-shell

// this function allows for the excecution of a python script with a string message
function excecutePyshell(message, script){
	let {PythonShell} = require('python-shell')

	let pyshell = new PythonShell(script);

	pyshell.send(message);

	pyshell.on('message', function (m) {
		console.log(m);
	});

	pyshell.end(function (err,code,signal) {
		if (err) throw err;
		console.log('The exit code was: ' + code);
		console.log('The exit signal was: ' + signal);
		console.log('finished');
	});
}

// initial script that runs and creates the nodeList.json file with 5 sample nodes
excecutePyshell('', 'nodes.py')

// when adding a router, specify that you want to add and provide a name, number of ports, bitrate, and wireless capability (0 or 1).
//excecutePyshell('Add:Router_6:4:1600:0', 'modifyNodes.py')

// when deleteing a node, specify that you want to delete and you only need to provide the node name.
//excecutePyshell('Delete:Router_4:', 'modifyNodes.py')

// when modifying connections, you need to specify what two routers you want to establish or teardown connections with
//excecutePyshell('AddConnection:Router_5:Router_2', 'modifyNodes.py')
//excecutePyshell('DeleteConnection:Router_4:Router_1', 'modifyNodes.py')
