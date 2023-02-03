const background = function(parent){
	this.service = createService('GET','/api/background/collection');
}

background.prototype.start = async function(){
	const images = await this.service();
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