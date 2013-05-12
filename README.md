# Description #
Scss watcher script. This can be used in node projects to run the scss tool from the main app or some kind of bootstrap. I typically use it during development so I don't have to start up a bunch of different processes.


## Dependencies ##
The following node dependencies will be needed for this to work. These are listed 
in the `package.json` file, so they can be retrieved using `$ npm install`.

* lodash (underscore may be acceptable too) - https://github.com/bestiejs/lodash
* Sass - http://sass-lang.com/
* nodemon - https://github.com/remy/nodemon

Sass if required for the css compilation. I usually put libraries like compass, bourbon, neat, etc in the style directory.

Nodemon isn't required but this script will play nice with it.


## Use ##
The first thing to do is grap the dependencies:
<pre>
$ npm install
</pre>

This can be used in a couple of ways. It can be started as a normal node script, included within another node script, or included and run with an auto-start process like nodemon.

Running as a basic node script is exactly the same as normal:
<pre>
$ node scss.js [tool confilg]
</pre>
<i>
The optional tool config parameter is if you have a config object with multiple tool configurations. See config below.
</i>

The other two methods are exactly the same from a setup point of view. First, require the script:
<pre>
var watcher = require('./scss');
var config = require('./config');
</pre>
Note that I tend to use a separate config file for my projects. Part of this file will have the watcher properties that I'll pass to the watcher.

Next create the watcher. Note the sass setup properties are being passed in.
<pre>
var sass = watcher.scssWatcher(config.tool.sassProps);
</pre>

Finally, this section can be used in the presense of a tool like nodemon so that the old process will get killed and restarted. Without this, nodemon will not kill the first watcher, and there will be multiple watchers running at the same time.
<pre>
// kill listener - kill sass
process.once('SIGUSR2', function () {
	sass.cleanup(function(){
		process.kill(process.pid, 'SIGUSR2');
	});
});
</pre>

### Note ###
A lot of this project is just demo stuff. 

Everything in `www` is for demo. This is where the watcher will write the compiled css file. 

The `style` directory is where scss files and libraries go, and this is where the watcher looks by default. I tend to drop bourbon (http://bourbon.io/) or compass (http://compass-style.org/) in the style directory as well. I'm aware that I could run compass watccher, but I like having a little more control over the libraries and processes I'm using. 

`config.js` is a demo config file that serves as an example of how to setup options.


### Config ###
I like to keep config objects especially if there are multiple parts to a tool. By adding sass props to each tool config, the sass proceses can have different setups for each tool. These can be used to add libraries or override the default properties.

Here is an example of two tool config objects. The first would add bourbon includes so that they can be used in the sass files.
<pre>
{
	tool : {
		someProps : true,
		useSass      : true,
		sassProps : {
			libs : [
				'style/bourbon'
			],
			sassDir    : 'style',
			outputDir  : 'www/style',
			outStyle   : 'compact'
		}
	},
	
	othertool : {
		someProps : true,
		otherProps: false,
		useSass      : true,
		sassProps : {
			sassDir    : 'style',
			outputDir  : 'www/style',
			outStyle   : 'compact'
		}
	}
};
</pre>

To use the first `tool` config from the commandline tool:
<pre>
$ node scss.js tool
</pre>

To load the second `othertool` in the main project script:
<pre>
var sass = watcher.scssWatcher(config.othertool.sassProps);
</pre>

Or to load sass watching for both:
<pre>
var sassTool  = watcher.scssWatcher(config.tool.sassProps);
var sassOther = watcher.scssWatcher(config.othertool.sassProps);
</pre>
<i>Note that this starts two sass processes, one for each tool.</i>

