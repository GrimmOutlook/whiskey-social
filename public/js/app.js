//        Do I need a jQuery event handler on every single button in my app?


$(document).ready(function(){

  $('#sign-up').submit(e => {
    e.preventDefault();
    const username = $('#username').val();
    const password = $('#password').val();
      $.ajax({
        method: "POST",
        url: "http://localhost:8080/login",
        data: { username: username, password: password }
      })
      .done(function( msg ) {
          console.log("msg: ", msg);
          console.log("msg.token: ", msg.token);
          localStorage.setItem('token', msg.token);
          window.location="http://localhost:8080/profile/";
      });
  });

})
