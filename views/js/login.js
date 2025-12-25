// Login JS - Now simplified to use API with Cookies

// Check if user is already logged in (via API)
// Check if user is already logged in (via API)
async function checkLogin() {
  try {
    const res = await fetch("/api/auth/me");
    if (res.ok) {
        // User is logged in, redirect
        window.location.href = "/";
    }
  } catch (err) {
      // Not logged in, stay here
  }
}
checkLogin();

// Handle Login Form Submission
const loginForm = document.getElementById("loginForm");
if(loginForm) {
    loginForm.addEventListener("submit", async (e) => {
        e.preventDefault();
        
        const email = document.getElementById("email").value;
        const password = document.getElementById("password").value;
        const remember = document.getElementById("remember")?.checked;
        
        if (remember) {
           localStorage.setItem("rememberedEmail", email);
        } else {
           localStorage.removeItem("rememberedEmail");
        }

        try {
            const res = await fetch("/api/auth/login", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ email, password })
            });

            const data = await res.json();
            
            if(res.ok && data.success) {
                // Success - Cookie is set automatically
                window.location.href = "/";
            } else {
                alert(data.error || "Login failed");
            }
        } catch(err) {
            console.error(err);
            alert("Login error. Please try again.");
        }
    });
    
    // Auto-fill email
    const savedEmail = localStorage.getItem("rememberedEmail");
    if(savedEmail) {
        document.getElementById("email").value = savedEmail;
        if(document.getElementById("remember")) document.getElementById("remember").checked = true;
    }
}


// Styles for UI feedback
const style = document.createElement("style");
style.textContent = `
  .toggle-password {
    position: absolute;
    right: 10px;
    top: 50%;
    transform: translateY(-50%);
    cursor: pointer;
    color: #666;
  }
`;
document.head.appendChild(style);

// Password Toggle
const passwordInput = document.getElementById("password");
const toggleButton = document.createElement("span");
toggleButton.className = "toggle-password";
toggleButton.innerHTML = '<i class="fas fa-eye"></i>';
if(passwordInput) {
    passwordInput.parentElement.appendChild(toggleButton);
    toggleButton.addEventListener("click", () => {
      const type = passwordInput.getAttribute("type") === "password" ? "text" : "password";
      passwordInput.setAttribute("type", type);
      toggleButton.innerHTML = type === "password" ? '<i class="fas fa-eye"></i>' : '<i class="fas fa-eye-slash"></i>';
    });
}

// Redirect to register
document.getElementById("registerLink")?.addEventListener("click", (e) => {
  e.preventDefault();
  window.location.href = "register.html";
});

// Social Login Placeholders
document.querySelectorAll(".social-btn").forEach((button) => {
  button.addEventListener("click", () => {
    alert("Social login coming soon!");
  });
});
