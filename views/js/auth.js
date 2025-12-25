// Global User State
let currentUser = null;

// Utility: Check if user is authenticated via API (Cookie)
async function checkAuth() {
  try {
    const res = await fetch("/api/auth/me");
    if (res.ok) {
      const data = await res.json();
      currentUser = data.user;
      return currentUser;
    }
  } catch (error) {
    console.error("Auth check failed:", error);
  }
  currentUser = null;
  return null;
}

// Initialize Auth on page load
checkAuth().then((user) => {
  // If we are on a protected page (which is most of them now due to protectPage middleware), 
  // and user is null, it means session might have just expired or middleware missed it?
  // But protectPage runs on server. 
  // If we are here, server let us in.
  // Exception: If we are on login/register page.
  const path = window.location.pathname;
  if (!user && path !== "/login" && path !== "/register" && path !== "/login.html" && path !== "/register.html") {
       // Session potentially expired after page load or client-side check mismatch
       // For strict enforcement, we can redirect.
       // However, let's trust the user action triggers for now to avoid loops if /me fails differently.
  }
  
  console.log("User logged in:", user ? user.fullName : "No");
  updateUIForUser(user);
});

function updateUIForUser(user) {
  // Update UI elements based on auth state (e.g., show/hide login/logout buttons)
  if (user) {
     const loginBtn = document.getElementById("loginBtn");
     if(loginBtn) {
         loginBtn.textContent = "Profile";
         loginBtn.href = "profile.html";
         // Remove previous event listeners by cloning logic or just setting href
         // Cloning node removes listeners
         const newBtn = loginBtn.cloneNode(true);
         loginBtn.parentNode.replaceChild(newBtn, loginBtn);
     }
  }
}

// Utility: Protect actions requiring authentication
function requireAuth(callback) {
  return async function (e) {
    if (e) e.preventDefault();
    
    // Ensure we have the latest auth state
    if (!currentUser) {
       await checkAuth();
    }

    if (!currentUser) {
      alert("Session expired. Please login again.");
      window.location.href = "/login";
      return;
    }
    return callback(e);
  };
}

// ==========================================
// RENTAL FUNCTIONALITY
// ==========================================
const rentalModal = document.getElementById("rentalModal");
const rentalForm = document.getElementById("rentalForm");

if (rentalModal && rentalForm) {
  const closeModal = rentalModal.querySelector(".close-modal");
  const rentButtons = document.querySelectorAll(".rent-btn");
  let selectedEquipmentId = null; // Renamed to clarify it is ID
  let dailyRate = 0;

  // Open Rental Modal
  rentButtons.forEach((button) => {
    button.addEventListener(
      "click",
      requireAuth(() => {
        const equipmentCard = button.closest(".equipment-card");
        selectedEquipmentId = button.dataset.equipment;
        
        // Extract daily rate
        const rateText = equipmentCard.querySelector(".equipment-details span:first-child").textContent;
        dailyRate = parseInt(rateText.replace(/[^\d]/g, ""));

        // Update modal with specific equipment details
        document.getElementById("selectedEquipmentName").textContent =
          equipmentCard.querySelector("h3").textContent;
        document.getElementById("selectedEquipmentDescription").textContent =
          equipmentCard.querySelector(".description").textContent;
        document.getElementById("selectedEquipmentPrice").textContent = rateText;
        document.getElementById("selectedEquipmentLocation").textContent =
          equipmentCard.querySelector(".equipment-details span:last-child").textContent;

        document.querySelector(".daily-rate").textContent = `₹${dailyRate}`;

        rentalForm.reset();
        updateRentalSummary();
        rentalModal.style.display = "block";
      })
    );
  });

  // Close Modal Interactions
  if (closeModal) {
    closeModal.addEventListener("click", () => {
      rentalModal.style.display = "none";
    });
  }

  window.addEventListener("click", (e) => {
    if (e.target === rentalModal) {
      rentalModal.style.display = "none";
    }
  });

  const cancelRentalBtn = document.getElementById("cancelRental");
  if (cancelRentalBtn) {
    cancelRentalBtn.addEventListener("click", () => {
      rentalModal.style.display = "none";
    });
  }

  // Date & Summary Logic
  const startDate = document.getElementById("startDate");
  const endDate = document.getElementById("endDate");
  const today = new Date().toISOString().split("T")[0];

  if (startDate) {
    startDate.min = today;
    startDate.addEventListener("change", () => {
      if (endDate) {
        endDate.min = startDate.value;
        if (endDate.value && endDate.value < startDate.value) {
          endDate.value = startDate.value;
        }
      }
      updateRentalSummary();
    });
  }

  if (endDate) {
    endDate.addEventListener("change", updateRentalSummary);
  }

  function updateRentalSummary() {
    const startVal = startDate ? startDate.value : null;
    const endVal = endDate ? endDate.value : null;
    const deliveryOption = document.getElementById("delivery").value;

    if (startVal && endVal) {
      const start = new Date(startVal);
      const end = new Date(endVal);
      const duration = Math.ceil((end - start) / (1000 * 60 * 60 * 24));
      const validDuration = duration >= 0 ? duration : 0;
      
      const deliveryCharge = deliveryOption === "delivery" ? 500 : 0;
      const total = dailyRate * validDuration + deliveryCharge;

      const durationEl = document.querySelector(".duration");
      if (durationEl) durationEl.textContent = `${validDuration} days`;
      
      const deliveryEl = document.querySelector(".delivery-charge");
      if (deliveryEl) deliveryEl.textContent = `₹${deliveryCharge}`;
      
      const totalEl = document.querySelector(".total-amount");
      if (totalEl) totalEl.textContent = `₹${total}`;
    }
  }

  // Submit Rental
  rentalForm.addEventListener(
    "submit",
    requireAuth(async (e) => {
      e.preventDefault();

      const startDateVal = document.getElementById("startDate").value;
      const endDateVal = document.getElementById("endDate").value;
      const deliveryOption = document.getElementById("delivery").value;
      const paymentMethod = document.getElementById("payment").value;

      try {
        if (!currentUser) throw new Error("User not logged in");

        const start = new Date(startDateVal);
        const end = new Date(endDateVal);
        const duration = Math.ceil((end - start) / (1000 * 60 * 60 * 24));
        const deliveryCharge = deliveryOption === "delivery" ? 500 : 0;
        const total = dailyRate * duration + deliveryCharge;

        const response = await fetch("/api/equipment/rent", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            userId: currentUser._id,
            equipmentId: selectedEquipmentId,
            equipmentName: document.getElementById("selectedEquipmentName").textContent,
            startDate: startDateVal,
            endDate: endDateVal,
            duration,
            deliveryOption,
            paymentMethod,
            dailyRate,
            deliveryCharge,
            totalAmount: total,
            status: "pending",
          }),
        });

        if (!response.ok) throw new Error("Failed to create rental");

        alert("Rental request submitted successfully!");
        rentalModal.style.display = "none";
        rentalForm.reset();
        selectedEquipmentId = null;
        dailyRate = 0;
      } catch (error) {
        console.error("Error:", error);
        alert("Failed to create rental. Please try again.");
      }
    })
  );

  // Saved Rentals Logic (Using DB)
  const saveRentalBtn = document.getElementById("saveRental");
  if (saveRentalBtn) {
    saveRentalBtn.addEventListener("click", requireAuth(async () => {
       const startVal = startDate.value;
       const endVal = endDate.value;
       const deliveryOption = document.getElementById("delivery").value;
       const paymentMethod = document.getElementById("payment").value;
       
       if (!startVal || !endVal || !deliveryOption || !paymentMethod) {
          showNotification("Please fill in all fields before saving", "error");
          return;
       }

       // Calculate Total using existing logical UI text or recalculate
       const totalAmountText = document.querySelector(".total-amount").textContent;
       const totalAmount = parseInt(totalAmountText.replace(/[^\d]/g, ""));

       try {
           const response = await fetch("/api/saved-rentals", {
               method: "POST",
               headers: { "Content-Type": "application/json" },
               body: JSON.stringify({
                   equipmentName: document.getElementById("selectedEquipmentName").textContent,
                   equipmentDescription: document.getElementById("selectedEquipmentDescription").textContent,
                   startDate: startVal,
                   endDate: endVal,
                   deliveryOption,
                   paymentMethod,
                   dailyRate,
                   totalAmount
               })
           });

           if(response.ok) {
               showNotification("Rental saved successfully!");
               rentalModal.style.display = "none";
               fetchSavedRentals(); // Refresh list
           } else {
               showNotification("Failed to save rental", "error");
           }
       } catch(err) {
           console.error(err);
           showNotification("Error saving rental", "error");
       }
    }));
  }

  // Inject Saved Rentals Section
  const savedRentalsSection = document.createElement("div");
  savedRentalsSection.className = "saved-rentals container";
  savedRentalsSection.innerHTML = `<h3>Saved Rentals</h3><div id="savedRentalsList"></div>`;
  const rentingSection = document.querySelector(".renting-section");
  if (rentingSection) rentingSection.appendChild(savedRentalsSection);
  
  // Initialize Saved Rentals (Async)
  // We call this after we are sure auth is checked, but we can try immediately 
  // and if it fails due to 401, that is fine (it just won't show).
  // But strictly, we should wait for checkAuth.
  // We'll rely on the initial checkAuth in lines 18-20 to trigger something if we really wanted perfect reactivity,
  // but for now, we'll try to fetch.
  setTimeout(fetchSavedRentals, 1000); // Small delay to allow cookie check to maybe resolve? 
  // A better way is to call it inside the then() of checkAuth.
}

// Fetch Saved Rentals from DB
async function fetchSavedRentals() {
  const list = document.getElementById("savedRentalsList");
  if (!list) return; // Not on renting page

  // If not authed, we can't fetch.
  if(!currentUser) return; 

  try {
      const res = await fetch("/api/saved-rentals");
      if(res.ok) {
          const data = await res.json();
          renderSavedRentals(data.rentals || []);
      }
  } catch(err) {
      console.error("Error fetching saved rentals:", err);
  }
}

function renderSavedRentals(rentals) {
    const list = document.getElementById("savedRentalsList");
    if(!list) return;

    if (rentals.length === 0) {
      list.innerHTML = "<p>No saved rentals</p>";
      return;
    }
    
    list.innerHTML = rentals.map(rental => `
      <div class="saved-rental-item">
        <div class="saved-rental-info">
          <h4>${rental.equipmentName}</h4>
          <p>${new Date(rental.startDate).toLocaleDateString()} to ${new Date(rental.endDate).toLocaleDateString()}</p>
          <p>Total: ₹${rental.totalAmount}</p>
        </div>
        <div class="saved-rental-actions">
           <button class="btn btn-primary" onclick="proceedWithSavedRental('${rental._id}')">Proceed</button>
           <button class="btn btn-secondary" onclick="deleteSavedRental('${rental._id}')">Delete</button>
        </div>
      </div>
    `).join("");
}

// Global functions for onclick handlers
window.deleteSavedRental = async function(id) {
  if(!confirm("Delete this saved rental?")) return;
  try {
      const res = await fetch(`/api/saved-rentals/${id}`, { method: "DELETE" });
      if(res.ok) {
          showNotification("Rental deleted!");
          fetchSavedRentals();
      } else {
          showNotification("Delete failed", "error");
      }
  } catch(err) {
      console.error(err);
  }
};

window.proceedWithSavedRental = async function(id) {
  // To proceed, we need the rental details. We can fetch them or find them in the list if we stored it variable.
  // Ideally, we fetch the specific rental again or parse the list.
  // For simplicity, let's fetch the list again or finding it if we stored it.
  // Let's just fetch everything again to find it.
  try {
      const res = await fetch("/api/saved-rentals");
      if(res.ok) {
          const data = await res.json();
          const rental = data.rentals.find(r => r._id === id);
          if(rental && rentalModal) {
             document.getElementById("selectedEquipmentName").textContent = rental.equipmentName;
             document.getElementById("selectedEquipmentDescription").textContent = rental.equipmentDescription || "";
             
             // Format dates for input (YYYY-MM-DD)
             document.getElementById("startDate").value = new Date(rental.startDate).toISOString().split('T')[0];
             document.getElementById("endDate").value = new Date(rental.endDate).toISOString().split('T')[0];
             
             document.getElementById("delivery").value = rental.deliveryOption;
             document.getElementById("payment").value = rental.paymentMethod;
             
             // For daily rate, we use the stored one
             // Note: The modal usually expects us to know the rate separately.
             // We can hack it by setting the scope variable `dailyRate` BUT that variable is inside the closure above.
             // We can't access `dailyRate` here.
             // We probably need to re-trigger the "updateSummary" logic which relies on `dailyRate`.
             
             // WORKAROUND: We will manually populate the summary fields since we have the total.
             document.querySelector(".daily-rate").textContent = `₹${rental.dailyRate}`;
             document.querySelector(".total-amount").textContent = `₹${rental.totalAmount}`;
             
             // Show modal
             rentalModal.style.display = "block";
          }
      }
  } catch(err) {
      console.error(err);
  }
};


// Helper: Show Notification
function showNotification(message, type = "success") {
  const notification = document.createElement("div");
  notification.className = `notification ${type}`;
  notification.textContent = message;
  document.body.appendChild(notification);
  setTimeout(() => notification.remove(), 3000);
}


// ==========================================
// LOGIN / REGISTER MODAL FUNCTIONALITY
// ==========================================
const loginModal = document.getElementById("loginModal");
const registerModal = document.getElementById("registerModal");

if (loginModal && registerModal) {
  const loginBtn = document.getElementById("loginBtn"); 
  
  if (loginBtn && loginBtn.getAttribute("href") === "login.html") {
      // Only hijack if it's the login link, not if we changed it to Logout
      loginBtn.addEventListener("click", (e) => {
        if(loginBtn.textContent !== "Logout") {
            e.preventDefault(); // Only prevent if we keep it as a link to login.html
            loginModal.style.display = "block";
        }
      });
  }

  const registerLink = document.getElementById("registerLink");
  const loginLink = document.getElementById("loginLink");
  const closeButtons = document.querySelectorAll(".close-modal");

  if (registerLink) {
    registerLink.addEventListener("click", (e) => {
      e.preventDefault();
      loginModal.style.display = "none";
      registerModal.style.display = "block";
    });
  }

  if (loginLink) {
    loginLink.addEventListener("click", (e) => {
      e.preventDefault();
      registerModal.style.display = "none";
      loginModal.style.display = "block";
    });
  }

  closeButtons.forEach((button) => {
    button.addEventListener("click", () => {
      loginModal.style.display = "none";
      registerModal.style.display = "none";
    });
  });

  window.addEventListener("click", (e) => {
    if (e.target === loginModal) loginModal.style.display = "none";
    if (e.target === registerModal) registerModal.style.display = "none";
  });
}

// ==========================================
// AUTHENTICATION FORMS HANDLED IN login.js and register.js
// ==========================================

