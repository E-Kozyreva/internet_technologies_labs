document.addEventListener('DOMContentLoaded', function() {
    const loginForm = document.getElementById('loginForm');
    const registrationForm = document.getElementById('registrationForm');
    const loginToggle = document.getElementById('loginToggle');
    const registrationToggle = document.getElementById('registrationToggle');

    // Показываем форму входа по умолчанию
    loginForm.style.display = 'block';
    registrationForm.style.display = 'none';

    loginToggle.addEventListener('click', function() {
        loginForm.style.display = 'block';
        registrationForm.style.display = 'none';
    });

    registrationToggle.addEventListener('click', function() {
        loginForm.style.display = 'none';
        registrationForm.style.display = 'block';
    });

    loginForm.addEventListener('submit', function(event) {
        event.preventDefault();
        const username = document.getElementById('loginUsername').value;
        const password = document.getElementById('loginPassword').value;

        // Добавьте код для обработки входа пользователя
        console.log('Login:', username, password);
    });

    registrationForm.addEventListener('submit', function(event) {
        event.preventDefault();
        const username = document.getElementById('regUsername').value;
        const password = document.getElementById('regPassword').value;

        // Добавьте код для обработки регистрации пользователя
        console.log('Register:', username, password);
    });


    document.addEventListener('DOMContentLoaded', function () {
        // ...
      
        loginForm.addEventListener('submit', async function (event) {
          event.preventDefault();
          const username = document.getElementById('loginUsername').value;
          const password = document.getElementById('loginPassword').value;
      
          try {
            const response = await fetch('/login', {
              method: 'POST',
              headers: {
                'Content-Type': 'application/json',
              },
              body: JSON.stringify({ username, password }),
            });
      
            if (response.ok) {
              console.log('Login successful');
            } else {
              console.log('Login failed');
            }
          } catch (error) {
            console.error('Error during login:', error);
          }
        });
      
        loginForm.addEventListener('submit', async function (event) {
            event.preventDefault();
            const username = document.getElementById('loginUsername').value;
            const password = document.getElementById('loginPassword').value;
        
            try {
              const response = await fetch('/login', {
                method: 'POST',
                headers: {
                  'Content-Type': 'application/json',
                },
                body: JSON.stringify({ username, password }),
              });
        
              if (response.ok) {
                console.log('Login successful');
              } else {
                console.log('Login failed');
              }
            } catch (error) {
              console.error('Error during login:', error);
            }
          });
        
          registrationForm.addEventListener('submit', async function (event) {
            event.preventDefault();
            const username = document.getElementById('regUsername').value;
            const password = document.getElementById('regPassword').value;
        
            try {
              const response = await fetch('/register', {
                method: 'POST',
                headers: {
                  'Content-Type': 'application/json',
                },
                body: JSON.stringify({ username, password }),
              });
        
              if (response.ok) {
                console.log('Registration successful');
              } else {
                console.log('Registration failed');
              }
            } catch (error) {
              console.error('Error during registration:', error);
            }
          });
        });
      
});
