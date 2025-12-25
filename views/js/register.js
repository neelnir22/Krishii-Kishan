// Register JS - Simplified

document.getElementById("registerForm")?.addEventListener("submit", async (e) => {
    e.preventDefault();

    const fullName = document.getElementById("fullName").value;
    const email = document.getElementById("email").value;
    const phone = document.getElementById("phone").value;
    const password = document.getElementById("password").value;
    const confirmPassword = document.getElementById("confirmPassword").value;
    const location = document.getElementById("location").value;

    if (password !== confirmPassword) {
      alert("Passwords do not match");
      return;
    }

    try {
      const response = await fetch("/api/auth/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ fullName, email, phone, password, location }),
      });

      const data = await response.json();

      if (response.ok) {
        alert(data.message || "Registration successful! please check email for verification.");
        window.location.href = "login.html";
      } else {
        alert(data.error || "Registration failed");
      }
    } catch (error) {
      console.error("Error:", error);
      alert("An error occurred during registration");
    }
});

document.getElementById("loginLink")?.addEventListener("click", (e) => {
  e.preventDefault();
  window.location.href = "login.html";
});
