// ===============================
// GET ELEMENTS
// ===============================

const searchToggle = document.getElementById("searchToggle");
const searchArea = document.getElementById("searchArea");
const searchInput = document.getElementById("searchInput");
const searchButton = document.getElementById("searchButton");
const searchResults = document.getElementById("searchResults");

const menuToggle = document.getElementById("menuToggle");
const navMenu = document.getElementById("navMenu");

const newsletterForm = document.getElementById("newsletterForm");
const emailInput = document.getElementById("emailInput");


// ===============================
// SEARCH TOGGLE
// ===============================

searchToggle.addEventListener("click", () => {
  searchArea.classList.toggle("active");

  if (searchArea.classList.contains("active")) {
    searchInput.focus();
  }
});


// ===============================
// MOBILE MENU
// ===============================

menuToggle.addEventListener("click", () => {
  navMenu.classList.toggle("active");

  if (navMenu.classList.contains("active")) {
    menuToggle.textContent = "✕";
  } else {
    menuToggle.textContent = "☰";
  }
});


// Close mobile menu after clicking a link
const navLinks = document.querySelectorAll(".nav-menu a");

navLinks.forEach((link) => {
  link.addEventListener("click", () => {
    navMenu.classList.remove("active");
    menuToggle.textContent = "☰";
  });
});


// ===============================
// SEARCH FUNCTION
// ===============================

function performSearch() {

  const searchText = searchInput.value
    .toLowerCase()
    .trim();

  const items = document.querySelectorAll(".searchable-item");

  searchResults.innerHTML = "";

  if (searchText === "") {
    searchResults.innerHTML =
      '<p class="no-results">Please type something to search.</p>';
    return;
  }

  let foundItems = [];

  items.forEach((item) => {

    const title = item.dataset.title.toLowerCase();

    if (title.includes(searchText)) {
      foundItems.push(item);
    }

  });


  if (foundItems.length === 0) {

    searchResults.innerHTML =
      '<p class="no-results">No movies, natok or web series found.</p>';

  } else {

    foundItems.forEach((item) => {

      const movieName =
        item.querySelector("h3").textContent;

      const movieMeta =
        item.querySelector(".movie-meta").textContent;

      const result = document.createElement("div");

      result.classList.add("search-result-item");

      result.innerHTML = `
        <strong>${movieName}</strong>
        <br>
        <small>${movieMeta}</small>
      `;


      // Click search result
      result.addEventListener("click", () => {

        item.scrollIntoView({
          behavior: "smooth",
          block: "center"
        });

        // Small highlight effect
        item.style.transform = "scale(1.04)";

        setTimeout(() => {
          item.style.transform = "scale(1)";
        }, 800);

      });


      searchResults.appendChild(result);

    });

  }

}


// Search button click
searchButton.addEventListener("click", performSearch);


// Enter key search
searchInput.addEventListener("keydown", (event) => {

  if (event.key === "Enter") {
    performSearch();
  }

});


// ===============================
// LIVE SEARCH
// ===============================

searchInput.addEventListener("input", () => {

  if (searchInput.value.trim() === "") {
    searchResults.innerHTML = "";
    return;
  }

  performSearch();

});


// ===============================
// PLAY BUTTON
// ===============================

const playButtons = document.querySelectorAll(".play-card");

playButtons.forEach((button) => {

  button.addEventListener("click", (event) => {

    event.stopPropagation();

    const movieCard =
      button.closest(".movie-card");

    const movieName =
      movieCard.querySelector("h3").textContent;

    alert(
      `"${movieName}" selected!\n\nStep 2-তে আমরা Movie Details Page এবং real Watch Page বানাবো.`
    );

  });

});


// ===============================
// MOVIE CARD CLICK
// ===============================

const movieCards = document.querySelectorAll(".movie-card");

movieCards.forEach((card) => {

  card.addEventListener("click", () => {

    const movieName =
      card.querySelector("h3").textContent;

    console.log("Selected:", movieName);

  });

});


// ===============================
// NOTIFY BUTTON
// ===============================

const notifyButtons =
  document.querySelectorAll(".notify-btn");

notifyButtons.forEach((button) => {

  button.addEventListener("click", () => {

    const movieName =
      button.parentElement.querySelector("h3").textContent;

    alert(
      `You will be notified when "${movieName}" is released!`
    );

  });

});


// ===============================
// NEWSLETTER
// ===============================

newsletterForm.addEventListener("submit", (event) => {

  event.preventDefault();

  const email = emailInput.value.trim();

  if (email === "") {
    alert("Please enter your email.");
    return;
  }

  alert(
    `Thank you!\n\n${email} has been subscribed successfully.`
  );

  emailInput.value = "";

});


// ===============================
// VIEW ALL BUTTON
// ===============================

const viewAllButtons =
  document.querySelectorAll(".view-all-btn");

viewAllButtons.forEach((button) => {

  button.addEventListener("click", () => {

    alert(
      "Step 2-তে View All page তৈরি করা হবে!"
    );

  });

});