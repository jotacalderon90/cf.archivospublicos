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
	}
}