const background = function(parent){
	this.service = createService('GET','/api/background/collection');
	this.serviceWWW = createService('GET',location.protocol + '://' + location.host.replace(location.host.split('.')[0],'www') + '/api/background/collection');
}

background.prototype.start = async function(){
	let images;
	try{
		images = await this.service();
	}catch(e){
		console.log(e);
		images = await this.serviceWWW();
	}
	if(!images.data || images.data.length==0){
		return;
	}
	jQuery(function($) {
		$.supersized({    
			slides: images.data.map((image)=>{
				return {image: image};
			})
		});
	});
}

app.modules.background = background;