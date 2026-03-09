
document.addEventListener('DOMContentLoaded', function() {
  
  const loader = document.getElementById('loader');
  if (loader) loader.style.display = 'none';
  
  document.body.addEventListener('submit', async function(event) {
    
    const form = event.target;
    if (form.id !== 'form_aceptacondiciones') return;
    
    event.preventDefault();

    // Validación email
    if (!/^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/.test(form.email.value)) {
      alert('Ingrese un email válido');
      return;
    }

    // Validación recaptcha
    let recaptcha = '';
    if (typeof grecaptcha === 'object') {
      recaptcha = grecaptcha.getResponse();
      if (recaptcha.trim() === '') {
        alert('Ingrese recaptcha');
        return;
      }
    }

    // Mostrar loader
    
    if (loader) loader.style.display = 'block';

    let response = await fetch('https://mailing.jotace.cl/api/mailing/multidomain', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        to: form.email.value,
        message: 'Acepta condiciones de servicio',
        subject: 'Acepta condiciones del sitio web ' + document.location.hostname,
        'g-recaptcha-response': recaptcha
      })
    });
    
    if(response.status != 200) {
      alert('Hubo un problema al aceptar las condiciones, por favor avise a un encargado, codigo: 1');
      console.log(response);
    }
    
    response = await response.json();
    
    if(!response.data) {
      alert('Hubo un problema al aceptar las condiciones, por favor avise a un encargado, codigo: 2');
      console.log(response);
    } 
    
    if (loader) loader.style.display = 'none';

    alert('Se han aceptado las condiciones con éxito, será redireccionado a la página principal\n');
    location.href = '/';
  });
});