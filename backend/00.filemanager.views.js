"use strict";

module.exports = {
	
	//@route('/admin/admin')
	//@method(['get'])
	//@roles(['root','admin'])
	renderAdmin: function(req,res){
		res.render('views/filemanager/admin');
	}
	
}