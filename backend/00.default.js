"use strict";

module.exports = {
	
	//@route('/favicon.ico')
	//@method(['get'])
	favicon: function(req,res){
		res.sendFile(process.cwd() + '/frontend/assets/img/favicon.ico');
	},
	
	//@route('/robots.txt')
	//@method(['get'])
	robots: function(req,res){
		res.setHeader('content-type', 'text/plain');
		res.send('User-agent: *\n\nDisallow: /');
	}
	
};