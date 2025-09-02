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

      if (response.ok) {
        // Redirect to the dashboard on successful login
        alert("Login successful! Redirecting to dashboard.");
        window.location.href = "/dashboard.html";
      } else {
        alert(result.message);
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
        // If registration is successful, switch to the login form
        switchForm(loginFormContainer, registerFormContainer);
      }
    } catch (error) {
      console.error("Registration error:", error);
      alert("Failed to connect to the server.");
    }
  });
});

document.addEventListener("DOMContentLoaded", () => {
  const form = document.getElementById("mood-form");
  const userId = localStorage.getItem("userId");
  const userPlan = localStorage.getItem("userPlan");

  form.addEventListener("submit", async (e) => {
    e.preventDefault();

    const mood = document.querySelector('input[name="mood"]:checked')?.value;
    const content = document.getElementById("journal-entry").value;

    const countRes = await fetch(
      `http://127.0.0.1:5000/api/entries_today?user_id=${userId}`
    );
    const { count } = await countRes.json();

    if (userPlan === "free" && count >= 2) {
      alert("Daily limit reached. Upgrade to premium for unlimited entries.");
      return;
    }

    const res = await fetch("http://127.0.0.1:5000/api/log_mood", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ user_id: userId, mood, content }),
    });

    const result = await res.json();
    alert(result.message);
    renderMoodChart(); // Refresh chart
  });

  document
    .getElementById("upgrade-button")
    .addEventListener("click", async () => {
      const res = await fetch("http://127.0.0.1:5000/api/simulate_payment", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ user_id: userId }),
      });

      const result = await res.json();
      localStorage.setItem("userPlan", "premium");
      alert(result.message);
    });

  async function renderMoodChart() {
    const res = await fetch(
      `http://127.0.0.1:5000/api/mood_summary?user_id=${userId}`
    );
    const data = await res.json();

    const ctx = document.getElementById("moodChart").getContext("2d");
    new Chart(ctx, {
      type: "bar",
      data: {
        labels: Object.keys(data),
        datasets: [
          {
            label: "Mood Frequency",
            data: Object.values(data),
            backgroundColor: "#2c7be5",
          },
        ],
      },
      options: {
        responsive: true,
        scales: {
          y: { beginAtZero: true },
        },
      },
    });
  }

  renderMoodChart();
});

document.getElementById("logout-button").addEventListener("click", () => {
  // Clear user session data
  localStorage.removeItem("userId");
  localStorage.removeItem("userPlan");

  // Redirect to login page
  window.location.href = "/index.html";
});
