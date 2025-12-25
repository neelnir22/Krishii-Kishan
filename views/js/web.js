const loginBtn = document.getElementById("loginBtn");
const loginModal = document.getElementById("loginModal");
const registerModal = document.getElementById("registerModal");
const closeButtons = document.querySelectorAll(".close-modal");
const registerLink = document.getElementById("registerLink");
const loginLink = document.getElementById("loginLink");
const loginForm = document.getElementById("loginForm");
const registerForm = document.getElementById("registerForm");
const socialButtons = document.querySelectorAll(".social-btn");
const togglePassword = document.querySelectorAll(".toggle-password");

// Wrap all existing functions with requireAuth
const protectedLoginBtn = requireAuth(() => {
  loginModal.style.display = "block";
});

const protectedCloseButtons = requireAuth(() => {
  loginModal.style.display = "none";
  registerModal.style.display = "none";
});

const protectedRegisterLink = requireAuth((e) => {
  e.preventDefault();
  loginModal.style.display = "none";
  registerModal.style.display = "block";
});

const protectedLoginLink = requireAuth((e) => {
  e.preventDefault();
  registerModal.style.display = "none";
  loginModal.style.display = "block";
});

// Update event listeners to use protected functions
if (loginBtn) {
  loginBtn.addEventListener("click", protectedLoginBtn);
}

closeButtons.forEach((button) => {
  button.addEventListener("click", protectedCloseButtons);
});

if (registerLink) {
  registerLink.addEventListener("click", protectedRegisterLink);
}

if (loginLink) {
  loginLink.addEventListener("click", protectedLoginLink);
}

// Protect form submissions
if (loginForm) {
  loginForm.addEventListener(
    "submit",
    requireAuth((e) => {
      e.preventDefault();
      // Add your login logic here
      window.open("web.html", "_blank");
    })
  );
}

if (registerForm) {
  registerForm.addEventListener(
    "submit",
    requireAuth((e) => {
      e.preventDefault();
      // Add your registration logic here
      alert("Registration successful! Please login.");
      registerModal.style.display = "none";
      loginModal.style.display = "block";
    })
  );
}

// Protect social login buttons
socialButtons.forEach((button) => {
  button.addEventListener(
    "click",
    requireAuth(() => {
      alert("Social login coming soon!");
    })
  );
});

// Toggle password visibility
togglePassword.forEach((button) => {
  button.addEventListener("click", () => {
    const input = button.previousElementSibling;
    const type =
      input.getAttribute("type") === "password" ? "text" : "password";
    input.setAttribute("type", type);
    button.querySelector("i").classList.toggle("fa-eye");
    button.querySelector("i").classList.toggle("fa-eye-slash");
  });
});
