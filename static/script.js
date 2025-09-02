document.addEventListener("DOMContentLoaded", () => {
  const loginFormContainer = document.getElementById("login-form");
  const registerFormContainer = document.getElementById("register-form");
  const showRegisterLink = document.getElementById("show-register");
  const showLoginLink = document.getElementById("show-login");

  const loginForm = document.getElementById("login-page");
  const registerForm = document.getElementById("register-page");

  // Function to switch forms
  const switchForm = (formToShow, formToHide) => {
    formToHide.classList.add("hidden");
    setTimeout(() => {
      formToShow.classList.remove("hidden");
    }, 100);
  };

  // Event listener for showing the register form
  showRegisterLink.addEventListener("click", (e) => {
    e.preventDefault();
    switchForm(registerFormContainer, loginFormContainer);
  });

  // Event listener for showing the login form
  showLoginLink.addEventListener("click", (e) => {
    e.preventDefault();
    switchForm(loginFormContainer, registerFormContainer);
  });

  // Handle login form submission
  loginForm.addEventListener("submit", async (e) => {
    e.preventDefault();
    const username = document.getElementById("login-username").value;
    const password = document.getElementById("login-password").value;

    try {
      const response = await fetch("http://127.0.0.1:5000/api/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ username, password }),
      });

      const result = await response.json();
      alert(result.message);
      
      if (response.ok) {
        alert("Login successful! Redirecting to Dashboard");
        console.log("Login successful! You can now show the main content.");
         window.location.href = '/dashboard.html';
      }
    } catch (error) {
      console.error("Login error:", error);
      alert("Failed to connect to the server.");
    }
  });

  // Handle registration form submission
  registerForm.addEventListener("submit", async (e) => {
    e.preventDefault();
    const username = document.getElementById("register-username").value;
    const password = document.getElementById("register-password").value;

    try {
      const response = await fetch("http://127.0.0.1:5000/api/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ username, password }),
      });

      const result = await response.json();
      alert(result.message);

      if (response.ok) {
        // If registration is successful, you can switch to the login form
        switchForm(loginFormContainer, registerFormContainer);
        console.log("Registration successful! You can now log in.");
      }
    } catch (error) {
      console.error("Registration error:", error);
      alert("Failed to connect to the server.");
      
    }
  });
});

// Handle login form submission
loginForm.addEventListener('submit', async (e) => {
    e.preventDefault();
    const username = document.getElementById('login-username').value;
    const password = document.getElementById('login-password').value;

    try {
        const response = await fetch('http://127.0.0.1:5000/api/login', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ username, password })
        });

        const result = await response.json();
        
        if (response.ok) {
            // This is the line you need to add or confirm
            window.location.href = '/dashboard.html';
        } else {
            alert(result.message);
        }
    } catch (error) {
        console.error('Login error:', error);
        alert('Failed to connect to the server.');
    }
});