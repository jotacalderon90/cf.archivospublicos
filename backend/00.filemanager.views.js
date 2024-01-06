"use strict";

module.exports = {
	
	//@route('/')
	//@method(['get'])
	index: function(req,res){
		res.render('filemanager/page/index/_');
	},
		
	//@route('/vue')
	//@method(['get'])
	vue: function(req,res){
		res.render('vue/dist/index');
	}
	
}