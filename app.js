/* app.js – handles page flow, card logic & fortunes */
import { tarotCards } from "./tarotData.js";

const areaSelect = document.getElementById("areaSelect");
const genderSelect = document.getElementById("genderSelect");
const startBtn = document.getElementById("startBtn");

const welcomeStage = document.getElementById("welcome-stage");
const cardSelectionStage = document.getElementById("card-selection-stage");
const loadingStage = document.getElementById("loading-stage");
const predictionStage = document.getElementById("prediction-stage");

const cardGrid = document.getElementById("cardGrid");
const selectedCount = document.getElementById("selectedCount");
const counterFill = document.getElementById("counterFill");
const revealBtn = document.getElementById("revealBtn");
const loadingText = document.getElementById("loadingText");
const selectedCardsDisplay = document.getElementById("selectedCardsDisplay");
const fortuneBox = document.getElementById("fortuneBox");
const againBtn = document.getElementById("againBtn");

let selectedArea = "";
let selectedGender = "";
let selectedCards = [];

// Loading messages for the mystical experience
const loadingMessages = [
  "Consulting cosmic entities...",
  "Channeling IITK vibes...",
  "Reading the astral plane...",
  "Decoding universal signals...",
  "Aligning chakras with CPI...",
  "Summoning academic spirits...",
  "Interpreting dormitory auras...",
  "Consulting the canteen oracle..."
];

/* ----------  WELCOME FLOW  ---------- */
[areaSelect, genderSelect].forEach(sel =>
  sel.addEventListener("change", () => {
    startBtn.disabled = !(areaSelect.value && genderSelect.value);
  })
);

startBtn.addEventListener("click", () => {
  selectedArea = areaSelect.value;
  selectedGender = genderSelect.value;
  showStage("cardSelection");
  initCardGrid();
});

/* ----------  STAGE MANAGEMENT  ---------- */
function showStage(stageName) {
  // Hide all stages
  [welcomeStage, cardSelectionStage, loadingStage, predictionStage].forEach(stage => {
    if (stage) stage.classList.remove("active");
  });

  // Show target stage
  switch(stageName) {
    case "welcome":
      if (welcomeStage) welcomeStage.classList.add("active");
      break;
    case "cardSelection":
      if (cardSelectionStage) cardSelectionStage.classList.add("active");
      break;
    case "loading":
      if (loadingStage) loadingStage.classList.add("active");
      break;
    case "prediction":
      if (predictionStage) predictionStage.classList.add("active");
      break;
  }
}

/* ----------  CARD GRID  ---------- */
function initCardGrid() {
  if (!cardGrid) return;

  cardGrid.innerHTML = "";
  selectedCards = [];
  updateCounter();

  tarotCards.forEach((card, idx) => {
    const cardEl = document.createElement("div");
    cardEl.className = "card";
    cardEl.dataset.index = idx;

    cardEl.innerHTML = `
      <div class="card-inner">
        <div class="card-face card-back"></div>
        <div class="card-face card-front">
          <span>${card.name}</span>
        </div>
      </div>
    `;

    cardEl.addEventListener("click", () => handleCardClick(cardEl, idx));
    cardGrid.appendChild(cardEl);
  });
}

/* ----------  CARD CLICK  ---------- */
function handleCardClick(cardEl, idx) {
  if (selectedCards.includes(idx)) {
    // Deselect card
    cardEl.classList.remove("flipped");
    selectedCards = selectedCards.filter(cardIdx => cardIdx !== idx);
  } else if (selectedCards.length < 3) {
    // Select card
    cardEl.classList.add("flipped");
    selectedCards.push(idx);
  } else {
    // Already have 3 cards - do nothing
    return;
  }

  updateCounter();
}

/* ----------  UPDATE COUNTER  ---------- */
function updateCounter() {
  if (selectedCount) {
    selectedCount.textContent = selectedCards.length;
  }

  if (counterFill) {
    const percentage = (selectedCards.length / 3) * 100;
    counterFill.style.width = percentage + "%";
  }

  if (revealBtn) {
    if (selectedCards.length === 3) {
      revealBtn.classList.remove("hidden");
    } else {
      revealBtn.classList.add("hidden");
    }
  }
}

/* ----------  REVEAL FORTUNE  ---------- */
revealBtn.addEventListener("click", () => {
  showLoadingStage();
});

function showLoadingStage() {
  showStage("loading");

  let messageIndex = 0;
  let messageInterval;

  // Cycle through loading messages
  if (loadingText) {
    messageInterval = setInterval(() => {
      loadingText.textContent = loadingMessages[messageIndex];
      messageIndex = (messageIndex + 1) % loadingMessages.length;
    }, 600);
  }

  // Show prediction after 4 seconds
  setTimeout(() => {
    if (messageInterval) clearInterval(messageInterval);
    showPrediction();
  }, 4000);
}

/* ----------  SHOW PREDICTION  ---------- */
function showPrediction() {
  showStage("prediction");
  displaySelectedCards();
  generateAndDisplayPrediction();
}

function displaySelectedCards() {
  if (!selectedCardsDisplay) return;

  selectedCardsDisplay.innerHTML = "";

  selectedCards.forEach((cardIdx, index) => {
    const cardDiv = document.createElement("div");
    cardDiv.className = "selected-card-mini";
    cardDiv.textContent = tarotCards[cardIdx].name;
    cardDiv.style.animationDelay = `${index * 0.2}s`;
    selectedCardsDisplay.appendChild(cardDiv);
  });
}

function generateAndDisplayPrediction() {
  if (!fortuneBox) return;

  const prediction = generateCoherentPrediction();

  // Typewriter effect for prediction
  fortuneBox.textContent = "";
  let index = 0;

  const typeInterval = setInterval(() => {
    if (index < prediction.length) {
      fortuneBox.textContent += prediction[index];
      index++;
    } else {
      clearInterval(typeInterval);
    }
  }, 30);
}

/* ----------  GENERATE COHERENT PREDICTION  ---------- */
function generateCoherentPrediction() {
  // Get the meanings of selected cards
  const cardMeanings = selectedCards.map(idx => tarotCards[idx].meaning);

  // Create transitions to connect the meanings
  const transitions = [
    "Furthermore, ",
    "In addition to this, ",
    "Building on that, ",
    "To make matters more interesting, ",
    "As if that wasn't enough, ",
    "Adding to the cosmic chaos, "
  ];

  // Area-specific intros
  const areaIntros = {
    "Academics": "Bacche, your academic journey reveals that ",
    "Social Life": "The cosmic forces whisper about your social destiny: ",
    "Romantic": "Bacche, your love life is written in the stars, and it says ",
    "Extracurriculars": "Your extracurricular adventures are destined to unfold as follows: ",
    "Future Plans": "The universe has grand plans for your future, starting with "
  };

  // Gender-specific endings
  const genderEndings = {
    "Female": " At least you won't have to deal with Hall 13's plumbing disasters.",
    "Male": " Hall 4's mosquitoes have already started preparing a welcome committee for you.",
    "Non-binary": " The universe doesn't discriminate—chaos awaits everyone equally at IITK.",
    "Prefer not to say": " Mystery suits you, just like the mystery meat in the mess."
  };

  // Start with area-specific intro
  const intro = areaIntros[selectedArea] || "The cosmic forces reveal that ";

  // Create the main prediction by weaving card meanings together
  let mainPrediction = intro.toLowerCase() + cardMeanings[0].toLowerCase();

  // Add second meaning with transition
  if (cardMeanings.length > 1) {
    const transition1 = transitions[Math.floor(Math.random() * transitions.length)];
    mainPrediction += " " + transition1.toLowerCase() + cardMeanings[1].toLowerCase();
  }

  // Add third meaning with another transition
  if (cardMeanings.length > 2) {
    const transition2 = transitions[Math.floor(Math.random() * transitions.length)];
    mainPrediction += " " + transition2.toLowerCase() + cardMeanings[2].toLowerCase();
  }

  // Add gender-specific ending
  const ending = genderEndings[selectedGender] || " The cosmos works in mysterious ways at IITK.";
  mainPrediction += ending;

  // Add some IITK-specific flavor
  const iitKFlavors = [
    " Remember, this is IITK—expect the unexpected, especially during endsems.",
    " In the grand tradition of IIT Kanpur, your destiny will be equal parts challenging and character-building.",
    " May the Wi-Fi be with you, because you'll need all the connectivity you can get.",
    " The peacocks of IITK have witnessed many such destinies unfold—yours is just another thread in the tapestry.",
    " As the seniors always say, 'Yeh IIT hai, yahan sab kuch possible hai.'"
  ];

  const flavor = iitKFlavors[Math.floor(Math.random() * iitKFlavors.length)];
  mainPrediction += flavor;

  // Capitalize first letter
  return mainPrediction.charAt(0).toUpperCase() + mainPrediction.slice(1);
}

/* ----------  READ AGAIN  ---------- */
againBtn.addEventListener("click", () => {
  resetApplication();
});

function resetApplication() {
  // Reset state
  selectedCards = [];
  selectedArea = "";
  selectedGender = "";

  // Reset UI
  if (areaSelect) areaSelect.value = "";
  if (genderSelect) genderSelect.value = "";
  if (startBtn) startBtn.disabled = true;
  if (selectedCount) selectedCount.textContent = "0";
  if (counterFill) counterFill.style.width = "0%";
  if (revealBtn) revealBtn.classList.add("hidden");
  if (fortuneBox) fortuneBox.textContent = "";
  if (selectedCardsDisplay) selectedCardsDisplay.innerHTML = "";

  // Clear selected cards visually
  document.querySelectorAll('.card.flipped').forEach(card => {
    card.classList.remove('flipped');
  });

  // Show welcome stage
  showStage("welcome");
}
