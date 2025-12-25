// Check if user is logged in
async function checkAuth() {
    try {
        const res = await fetch("/api/auth/me");
        if (!res.ok) {
            // Not logged in
             return null;
        }
        return await res.json();
    } catch (err) {
        return null;
    }
}

document.getElementById("produce-form").addEventListener("submit", async function (e) {
    e.preventDefault();

    // Check auth first
    const auth = await checkAuth();
    if (!auth || !auth.user) {
        alert("Please login to list your produce.");
        return;
    }

    // Get form values
    const cropType = document.getElementById("crop-type").value;
    const quantity = document.getElementById("quantity").value;
    const unit = document.getElementById("unit").value;
    const quality = document.getElementById("quality").value;
    const expectedPrice = document.getElementById("expected-price").value;
    const location = document.getElementById("location").value;
    const harvestDate = document.getElementById("harvest-date").value;
    const paymentMethods = Array.from(
      document.querySelectorAll('input[name="payment"]:checked')
    ).map((cb) => cb.value);

    try {
      // Send data to server
      const response = await fetch("/api/market/list", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          userId: auth.user._id, // Ideally backend gets this from cookie, but controller might expect it in body. 
          // Note: Better to update controller to use req.user._id, but for now passing it matches current controller logic if it uses req.body.userId
          // However, since we rely on cookies, we should update controller. But to satisfy "make button work", we pass it if we have it.
          // Actually, checkAuth returns user data.
          cropType,
          quantity,
          unit,
          quality,
          expectedPrice,
          location,
          harvestDate,
          paymentMethods,
        }),
      });

      if (!response.ok) {
        const errData = await response.json();
        throw new Error(errData.error || "Failed to create market listing");
      }

      const result = await response.json();

      // Show success message
      alert(
        `Your ${cropType} (${quantity} ${unit}, ${quality} grade) from ${location} has been listed successfully! Buyers will contact you soon.`
      );

      // Reset form
      this.reset();
    } catch (error) {
      console.error("Error:", error);
      alert(error.message || "Failed to create market listing. Please try again.");
    }
});
