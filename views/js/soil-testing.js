// Check if user is logged in
async function checkAuth() {
    try {
        const res = await fetch("/api/auth/me");
        if (!res.ok) return null;
        return await res.json();
    } catch (err) {
        return null;
    }
}

document.getElementById("soil-form").addEventListener("submit", async function (e) {
    e.preventDefault();

    const auth = await checkAuth();
    if (!auth || !auth.user) {
        alert("Please login to save soil test results.");
        // We can still proceed with analysis if we want, but to save we need login.
        // For now, let's require login to save.
        return;
    }

    // Get form values
    const soilType = document.getElementById("soil-type").value;
    const phLevel = parseFloat(document.getElementById("ph-level").value);
    const moisture = parseFloat(document.getElementById("moisture").value);
    const organicMatter = parseFloat(document.getElementById("organic-matter").value);
    const location = document.getElementById("location").value;
    const cropType = document.getElementById("crop-type").value;
    const analysisMethod = document.querySelector(".method-btn.active").dataset.method;

    try {
      // Send data to server
      const response = await fetch("/api/soil-tests", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          userId: auth.user._id, 
          soilType,
          phLevel,
          moisture,
          organicMatter,
          location,
          cropType,
          analysisMethod,
        }),
      });

      if (!response.ok) {
        throw new Error("Failed to save soil test");
      }

      const result = await response.json();

      // Analyze soil and show results
      const analysisResults = analyzeSoil({
        soilType,
        phLevel,
        moisture,
        organicMatter,
      });

      updateResultsDisplay(analysisResults);

      // Reset form
      this.reset();
    } catch (error) {
      console.error("Error:", error);
      alert("Failed to save soil test. Please try again.");
    }
});

// Soil analysis form submission
function analyzeSoil(soilData) {
  const { soilType, phLevel, moisture, organicMatter } = soilData;
  let condition = "";
  let recommendations = [];
  let improvements = [];
  let suitableCrops = [];
  let soilDescription = "";

  // Determine soil condition based on pH and organic matter
  if (
    phLevel >= 6.0 &&
    phLevel <= 7.0 &&
    organicMatter >= 4 &&
    organicMatter <= 6
  ) {
    condition = "Optimal";
    soilDescription =
      "Your soil is in optimal condition with ideal pH and organic matter levels. This type of soil is typically found in fertile plains and valleys, where moisture is well-balanced.";
    suitableCrops = ["Wheat", "Rice", "Various Vegetables", "Fruits"];
    recommendations = [
      "Maintain current organic matter levels through regular composting",
      "Continue balanced irrigation practices",
      "Monitor soil health regularly",
      "Practice crop rotation to maintain soil fertility",
    ];
  } else if (
    phLevel >= 6.0 &&
    phLevel <= 6.5 &&
    organicMatter >= 3 &&
    organicMatter <= 5
  ) {
    condition = "Excellent";
    soilDescription =
      "Your soil has excellent conditions with slightly acidic pH and good organic matter content. These conditions are common near riverbanks or wetland regions.";
    suitableCrops = ["Rice", "Leafy Greens", "Root Vegetables"];
    recommendations = [
      "Maintain moisture levels through proper irrigation",
      "Add organic compost periodically",
      "Monitor water retention",
      "Consider mulching to retain moisture",
    ];
  } else if (
    phLevel >= 6.5 &&
    phLevel <= 7.5 &&
    organicMatter >= 2 &&
    organicMatter <= 4
  ) {
    condition = "Good";
    soilDescription =
      "Your soil has good conditions, typical of upland farms and temperate areas. While not as nutrient-rich as optimal soil, it's still very suitable for farming.";
    suitableCrops = ["Wheat", "Maize", "Beans"];
    recommendations = [
      "Add organic matter through composting",
      "Implement crop rotation",
      "Consider cover crops",
      "Monitor nutrient levels regularly",
    ];
  } else if (
    phLevel >= 5.5 &&
    phLevel <= 6.5 &&
    organicMatter >= 1.5 &&
    organicMatter <= 3
  ) {
    condition = "Moderate";
    soilDescription =
      "Your soil has moderate conditions, common in hilly terrains or semi-arid zones. The fertility is limited but can be improved.";
    suitableCrops = ["Potatoes", "Citrus Fruits", "Pulses"];
    recommendations = [
      "Implement regular irrigation system",
      "Add significant amounts of organic matter",
      "Consider pH adjustment",
      "Use appropriate fertilizers",
    ];
  } else if (phLevel >= 7.5 && phLevel <= 8.5 && organicMatter < 2) {
    condition = "Poor";
    soilDescription =
      "Your soil has poor conditions, typical of drylands or arid regions. Significant improvements are needed for productive farming.";
    suitableCrops = [
      "Salt-tolerant crops",
      "Drought-resistant varieties",
    ];
    recommendations = [
      "Add large amounts of organic matter",
      "Implement proper drainage system",
      "Consider soil amendments to adjust pH",
      "Use drought-resistant crops initially",
    ];
  } else {
    condition = "Unsuitable";
    soilDescription =
      "Your soil has unsuitable conditions, typical of saline, degraded, or heavily eroded lands. Extensive restoration is needed.";
    suitableCrops = ["Hardy grasses", "Specialized restoration crops"];
    recommendations = [
      "Consult agricultural experts for restoration",
      "Consider soil replacement or extensive amendment",
      "Implement erosion control measures",
      "Start with soil-building plants",
    ];
  }

  return {
    condition,
    soilDescription,
    recommendations,
    improvements,
    suitableCrops,
    soilType,
    phLevel,
    moisture,
    organicMatter,
    details: {
      phRange: getPHRange(phLevel),
      moistureLevel: getMoistureLevel(moisture),
      organicMatterLevel: getOrganicMatterLevel(organicMatter),
    },
  };
}

function getPHRange(ph) {
  if (ph >= 6.0 && ph <= 7.0) return "Neutral (Optimal)";
  if (ph >= 6.0 && ph <= 6.5) return "Slightly Acidic (Excellent)";
  if (ph >= 6.5 && ph <= 7.5) return "Near Neutral (Good)";
  if (ph >= 5.5 && ph <= 6.5) return "Mildly Acidic (Moderate)";
  if (ph >= 7.5 && ph <= 8.5) return "Alkaline (Poor)";
  return "Extreme (Unsuitable)";
}

function getMoistureLevel(moisture) {
  if (moisture >= 40 && moisture <= 60) return "Well-balanced";
  if (moisture > 60) return "High (Potential waterlogging)";
  if (moisture >= 30 && moisture < 40) return "Moderate";
  return "Low (Requires irrigation)";
}

function getOrganicMatterLevel(om) {
  if (om >= 4 && om <= 6) return "High (Optimal)";
  if (om >= 3 && om <= 5) return "Good (Excellent)";
  if (om >= 2 && om <= 4) return "Moderate (Good)";
  if (om >= 1.5 && om <= 3) return "Low (Moderate)";
  if (om < 2) return "Very Low (Poor)";
  return "Insufficient (Unsuitable)";
}

function updateResultsDisplay(results) {
  // Clear previous results
  document.querySelector(".results-container").innerHTML = "";

  // Create main result card
  const mainCard = document.createElement("div");
  mainCard.className = "condition-display";
  mainCard.innerHTML = `
    <h4>Soil Condition: <span class="condition-${results.condition.toLowerCase()}">${
    results.condition
  }</span></h4>
    <p class="soil-description">${results.soilDescription}</p>
    <div class="soil-parameters">
      <div class="parameter">
        <h5>pH Level</h5>
        <p>${results.phLevel.toFixed(1)} (${results.details.phRange})</p>
      </div>
      <div class="parameter">
        <h5>Moisture Content</h5>
        <p>${results.moisture}% (${results.details.moistureLevel})</p>
      </div>
      <div class="parameter">
        <h5>Organic Matter</h5>
        <p>${results.organicMatter}% (${
    results.details.organicMatterLevel
  })</p>
      </div>
    </div>
  `;
  document.querySelector(".results-container").appendChild(mainCard);

  // Add recommendations card
  const recommendationsCard = document.createElement("div");
  recommendationsCard.className = "result-card";
  recommendationsCard.innerHTML = `
    <h4>Recommendations</h4>
    <div class="result-content">
      <ul>
        ${results.recommendations
          .map((rec) => `<li>${rec}</li>`)
          .join("")}
      </ul>
    </div>
  `;
  document
    .querySelector(".results-container")
    .appendChild(recommendationsCard);

  // Add suitable crops card
  const cropsCard = document.createElement("div");
  cropsCard.className = "result-card";
  cropsCard.innerHTML = `
    <h4>Suitable Crops</h4>
    <div class="result-content">
      <ul>
        ${results.suitableCrops
          .map((crop) => `<li>${crop}</li>`)
          .join("")}
      </ul>
    </div>
  `;
  document.querySelector(".results-container").appendChild(cropsCard);

  // Add styles for the new results display
  const styleElement = document.createElement("style");
  styleElement.textContent = `
    .soil-description {
      font-size: 1.1rem;
      line-height: 1.6;
      margin: 1rem 0;
      color: #333;
    }

    .soil-parameters {
      display: grid;
      grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
      gap: 1rem;
      margin: 1.5rem 0;
      background: rgba(255, 255, 255, 0.1);
      padding: 1rem;
      border-radius: 8px;
    }

    .parameter {
      text-align: center;
      padding: 1rem;
      background: rgba(255, 255, 255, 0.2);
      border-radius: 6px;
    }

    .parameter h5 {
      margin: 0 0 0.5rem 0;
      color: #fff;
      font-size: 1.1rem;
    }

    .parameter p {
      margin: 0;
      font-size: 1.2rem;
      font-weight: 500;
    }

    .condition-optimal { color: #4CAF50; }
    .condition-excellent { color: #8BC34A; }
    .condition-good { color: #CDDC39; }
    .condition-moderate { color: #FFC107; }
    .condition-poor { color: #FF9800; }
    .condition-unsuitable { color: #F44336; }
  `;
  document.head.appendChild(styleElement);

  // Show results section and scroll to it
  document.querySelector(".analysis-results").style.display = "block";
  document
    .querySelector(".analysis-results")
    .scrollIntoView({ behavior: "smooth" });
}
