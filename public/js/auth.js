const url = ( window.location.hostname.includes('localhost') ) ? 'http://localhost:8080/api/auth/'
            : 'https://restserver-nodejs-jsosa.herokuapp.com/api/auth/';

const miFormulario = document.querySelector('form');

miFormulario.addEventListener('submit', event => {
    //Evita que refresque el navegador 
    event.preventDefault();

    const formData = {};

    for(let element of miFormulario.elements){
        if(element.name.length > 0)
            formData[element.name] = element.value;        
    }
    
    fetch( url + 'login', {
        method: 'POST',
        body: JSON.stringify( formData ),
        headers: { 'Content-Type': 'application/json' }
    })
    .then(resp => resp.json())
    .then(({ msg, token }) => {
        if(msg){
            return console.error(msg);
        }

        localStorage.setItem('token', token);
        window.location = 'chat.html';
    })
    .catch(error => {
        console.log(error);
    });


});



function onSignIn(googleUser) {
    /*var profile = googleUser.getBasicProfile();
    console.log('ID: ' + profile.getId()); // Do not send to your backend! Use an ID token instead.
    console.log('Name: ' + profile.getName());
    console.log('Image URL: ' + profile.getImageUrl());
    console.log('Email: ' + profile.getEmail());*/ // This is null if the 'email' scope is not present.
    var id_token = googleUser.getAuthResponse().id_token;
    const data = { id_token };

    fetch( url + 'google', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify( data ) 
    })
    .then( resp => resp.json())
    .then(({ token }) => {
        localStorage.setItem('token', token);
        window.location = 'chat.html';
    })
    .catch(error => console.log(error));
}

function signOut() {
    var auth2 = gapi.auth2.getAuthInstance();
    auth2.signOut().then(function () {
    console.log('User signed out.');
    });
}
