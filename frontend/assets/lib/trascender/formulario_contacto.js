$('body').delegate('#form_contact','submit', async function(event){
	event.preventDefault();
	try{
		
    if(!/^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/.test(this.email.value)){
			alert('Ingrese un email válido');
      return;
		}
		
    if(this.message.value.trim()==''){
			alert('Ingrese un mensaje válido');
      return;
		}
    
    let recaptcha = '';
    if(typeof grecaptcha === 'object'){
      recaptcha = grecaptcha.getResponse();
      if(recaptcha.trim() === '') {
        alert('Ingrese recaptcha');
        return;
      }
    }
    
		$('#loader').fadeIn();
    
		let mailingResponse = await fetch('https://mailing.jotace.cl/api/mailing/multidomain', {
			method: 'POST',
			headers: {
				'Content-Type': 'application/json'
			},
			body: JSON.stringify({
				to: this.email.value,
				message: this.message.value,
				subject: 'Mensaje desde sitio web ' + document.location.hostname,
				'g-recaptcha-response': recaptcha
			})
		});
		
    $('#loader').fadeOut();
    
    if(mailingResponse.status != 200) {
      throw new Error(mailingResponse.status);
    }
    
    mailingResponse = await mailingResponse.json();
    
    if(!mailingResponse.data) {
      throw new Error(mailingResponse.data);
    } 
    
    alert('Hemos recibido su mensaje\nnos contactaremos lo mas pronto posible');
    location.href = '/';		
 
  }catch(error){
		$('#loader').fadeOut();
		alert('No se pudo generar la notificación, por favor contacte por otro medio');
    console.log(error);
	}
});