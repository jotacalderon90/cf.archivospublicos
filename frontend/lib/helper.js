document.helper = {
	copy: function(content) {
		const aux = document.createElement("input");
		content = content.split("\n").join("");
		aux.setAttribute("value", content);
		document.body.appendChild(aux);
		aux.select();
		document.execCommand("copy");
		document.body.removeChild(aux);
	},
	addTouchEvent: function(element,parent,callback){
		
		let xDown,yDown,detectSwipe;
		
		const getTouches = function(evt){
			return evt.touches || // browser API
			evt.originalEvent.touches; // jQuery
		}     
		
		const handleTouchStart = function(evt) {
			const firstTouch = getTouches(evt)[0];                                      
			xDown = firstTouch.clientX;                                      
			yDown = firstTouch.clientY;                                      
		}                                 
		
		const handleTouchMove = function(evt) {
			if ( ! xDown || ! yDown ) {
				return;
			}
			var xUp = evt.touches[0].clientX;                                    
			var yUp = evt.touches[0].clientY;
			var xDiff = xDown - xUp;
			var yDiff = yDown - yUp;
			if ( Math.abs( xDiff ) > Math.abs( yDiff ) ) {/*most significant*/
				if ( xDiff > 0 ) {
					detectSwipe = 'left';
				} else {
					detectSwipe = 'right';
				}                       
			} else {
				if ( yDiff > 0 ) {
					detectSwipe = 'up';
				} else { 
					detectSwipe = 'down';
				}                                                                 
			}
			/* reset values */
			xDown = null;
			yDown = null;                             
		}
		
		document.querySelector(element).addEventListener('touchstart', (evt)=>{handleTouchStart(evt)});
		document.querySelector(element).addEventListener('touchmove', (evt)=>{handleTouchMove(evt)});
		document.querySelector(element).addEventListener('touchend', ()=>{parent[callback](detectSwipe);detectSwipe = null;});
		
	},
	cleaner: function(cadena){
		const specialChars = "!@#$^&%*()+=-[]\/{}|:<>?,.`";
		for (var i = 0; i < specialChars.length; i++) {
			cadena= cadena.replace(new RegExp("\\" + specialChars[i], 'gi'), '');
		}
		cadena = cadena.toLowerCase();
		cadena = cadena.replace(/ /g,"-");
		cadena = cadena.replace(/á/gi,"a");
		cadena = cadena.replace(/é/gi,"e");
		cadena = cadena.replace(/í/gi,"i");
		cadena = cadena.replace(/ó/gi,"o");
		cadena = cadena.replace(/ú/gi,"u");
		cadena = cadena.replace(/ñ/gi,"n");
		return cadena;
	},
	createService: function(METHOD,URL,headerContentType){
		METHOD = METHOD.toUpperCase();
		
		const URIBuild = function(uri,params){
			for(let attr in params){
				uri = uri.replace(":"+attr,params[attr]);
			}
			return uri;
		}
			
		const execute = function(method,url,body,headerContentType){
			return new Promise(function(resolve, reject) {
				const xhttp = new XMLHttpRequest();
				xhttp.onreadystatechange = function() {
					if (xhttp.readyState == 4) {
						if(xhttp.status == 401){
							location.reload();
						}
						try{
							xhttp.json = JSON.parse(xhttp.responseText);
							if(xhttp.json.data!=null){
								resolve(xhttp.json.data);
							}else{
								throw(xhttp.json.error);
							}
						}catch(e){
							reject({
								error: e,
								xhttp: xhttp
							});
						}
					}
				};
				xhttp.open(method,url);
				if(body!=undefined){
					if(headerContentType!=""){
						xhttp.setRequestHeader("Content-Type", headerContentType);
					}
					if(typeof body!="string"){
						body = JSON.stringify(body);
					}
					xhttp.send(body);
				}else{
					xhttp.send();
				}
			});
		}
		
		if(METHOD == "GET" || METHOD == "DELETE"){
			return function(params){
				return execute(METHOD,URIBuild(URL,params),undefined,undefined);
			}
		}else if(METHOD == "POST" || METHOD == "PUT"){
			return function(params,body){
				return execute(METHOD,URIBuild(URL,params),body,headerContentType || 'application/json;charset=UTF-8');
			}
		}
	},
	createServices: function(baseurl){
		const services = {
			total:		["GET", 	baseurl + "/total?query=:query"],
			collection: ["GET", 	baseurl + "/collection?query=:query&options=:options"],
			tag:		["GET",		baseurl + "/tag/collection"],
			create:		["POST",	baseurl],
			read:		["GET", 	baseurl + "/:id"],
			update:		["PUT",		baseurl + "/:id"],
			delete:		["DELETE",	baseurl + "/:id"]
		};
		for(service in services){
			services[service] = this.createService(services[service][0],services[service][1]);
		}
		return services;
	},
	formatBody: function(doc,headerContentType){
		if(headerContentType){
			const formData = new FormData();
			formData.append("file", doc.file);
			return formData;
		}else{
			return JSON.stringify(doc);
		}
	},
	scrolling: function(parent,callback){
		$(window).scroll(()=>{
			if(Math.round($(window).scrollTop() + $(window).height()) == Math.round($(document).height())) {
				if(parent.obtained < parent.cant && !parent.obtaining){
					parent[callback]();
				}
			}
		});	
	}

}