

//
// Demo config file. I may have multiple processes, 
// so I put them in their own 'tool' sections. 
// Within each tool that uses sass, I'll add the 
// sass properties. These override the defaults in
// scss.js.
//
module.exports = {

	tool : {
		someProps : true,
		useSass      : true,
		sassProps : {
			sassDir    : 'style',
			outputDir  : 'www/style',
			outStyle   : 'compact'
		}
	}

};

