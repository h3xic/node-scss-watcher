//
// demo.js
//
// This file is just here to show how to use the watcher. Just run
// it with:
//
// $ node demo.js
//
'use strict';


//
// Sass watcher
// 
var watcher = require('./scss');
var config = require('./config');

var sass = watcher.scssWatcher(config.tool.sassProps);
//var sass = watcher.scssWatcher();

// kill listener - kill sass
process.once('SIGUSR2', function () {
	sass.cleanup(function(){
		process.kill(process.pid, 'SIGUSR2');
	});
});


//
// Start express or whatever here
// 

