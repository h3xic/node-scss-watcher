//
// Author: Jason Pritchard
// Description:
// Starts the sass watcher process from within node so that 
// only one process can be used during developed.
//
'use strict';

var _ = require('lodash')._;


//
// Default sass properties. Thes can be overridden with the 
// config properties.
//
var $defaults = {

	/*
	 * Sass libs to load
	 */
	libs : [
		'style/bourbon'
	],

	/*
	 * directory where your sass files are 
	 * located. 
	 * 
	 * Default is './style'.
	 */
	sassDir    : 'style',

	/*
	 * Output directory. This should be your 
	 * public root css dir.
	 *
	 * Default is ./www/syle
	 */
	outputDir  : 'www/style',

	/*
	 * Compiled css output format. 
	 * nested, expanded, compact, compressed
	 *
	 * Default is expanded

	 * @see sass --style optins
	 */
	outStyle   : 'expanded'

};


var _sassProc;
var scssWatcher;


/**
 * Create a new sass watcher. This just runs sass so you don't 
 * have to open another window for it.
 * 
 * @param  {object} options options to pass to sass
 */
scssWatcher = exports.scssWatcher = function(options) {
	var $options = _.extend($defaults, options);

	// build the command line statement
	var cmd = 'sass';

	// add input and output folders
	var opts = ['--watch'];
	opts.push($options.sassDir+':'+$options.outputDir);

	// add style output options
	opts.push('--style');
	opts.push($options.outStyle);

	// add included libraries
	$options.libs.forEach(function(lib) {
		opts.push('-I');
		opts.push(lib);
	});

	// i only work with scss
	opts.push('--scss');



	// create the sass process
	var sass = require('child_process').spawn(cmd, opts, {/*detached:true,*/ stdio: 'inherit'});
	sass.on('exit', function (code) {
		if (code !== 0) {
			console.log('exiting sass ' + code);
		}
	});


	/**
	 * Try to kill the sass process. Used when this process 
	 * gets controlled by another process like nodemon.
	 * @param  {Function} callback something to do when we're done cleaning up
	 */
	sass.cleanup = function(callback) {
		console.info('killing sass');
		// send Ctrl+C to the sass (ruby) process
		this.kill('SIGINT');
		// return control
		return setTimeout(callback, 0);
	};


	//_sassProc = sass;
	return sass;
};



/**
 * Run this script directly from the commandline, not 
 * as an included file.
 */
if ( !module.parent ) {
	// in case this is in a global bootstrap
	var hasAppConfig = (typeof appConfig === 'function');
	var which = 'tool';
	if ( process.argv.length > 2 ) {
		which = process.argv[2];
		var appConfig = hasAppConfig ? appConfig : function() { return require('./config'); }
	}

	//
	// I generally use this function in a global bootstrap and keep 
	// my config data in its own file. 
	//
	var base   = (hasAppConfig) ? appConfig() : {};
	var config = {};
	var props  = {};

	if ( base.hasOwnProperty(which) ) {
		config = base[which];
	}

	if ( config.hasOwnProperty('sassProps') ) {
		props = config['sassProps'];
	}

	scssWatcher(props);
}

