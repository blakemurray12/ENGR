$(document).ready(function() {
    $('#loginForm').submit(function(e) {
      e.preventDefault();
  
      var username = $('#username').val();
      var password = $('#password').val();
  
      if (username === 'user' && password === 'password1234') {
        // Authorized, open the code
        window.location.href = 'code.html';
      } else {
        alert('Invalid username or password. Please try again.');
      }
    });
  });
  