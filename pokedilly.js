// card variables
const allCards = $(".card.searchable");
const allCardsArray = Array.from(allCards);
const allCardsArrayLength = allCardsArray.length;
const searchInput = document.getElementById("cardSearch");
let isCardView = true;
const toggleViewButton = document.getElementById("toggleViewButton");
const containerPAL = document.getElementById("pal_cards");

// Get all the filter checkboxes
const checkboxes = document.querySelectorAll('.filter-checkbox');

// Event Listeners
checkboxes.forEach(checkbox => {
  checkbox.addEventListener('change', () => {
    cardSearch(searchInput.value);
  });
});

searchInput.addEventListener("keyup", () => {
  const filterValue = searchInput.value;
  cardSearch(filterValue, isCardView);
});

toggleViewButton.addEventListener("click", () => {
  // Preserve the search input value
  const filterValue = searchInput.value;

  // Toggle the view mode
  isCardView = !isCardView;

  // Generate HTML based on the view mode
  const generatedContent = isCardView ? generateCardViewContent(palSet) : generateListViewContent(palSet);

  // Update the container element with the new HTML content
  containerPAL.innerHTML = generatedContent;

  // Restore the search input value and perform search
  searchInput.value = filterValue;
  cardSearch(filterValue);
});

// Filter function
function applySearchFilter(items, filters) {
  for (let i = 0; i < items.length; i++) {
    const item = items[i];
    const itemTags = item.getAttribute("class").split(" ");
    let hasMatchingFilter = true;
    filters.forEach(filter => {
      let isMatched = false;
      itemTags.forEach(tag => {
        if (tag.includes(filter)) {
          isMatched = true;
          return;
        }
      });
      if (!isMatched) {
        hasMatchingFilter = false;
        return;
      }
    });

    if (hasMatchingFilter) {
      item.style.display = "block";
    } else {
      item.style.display = "none";
    }
  }
}

function cardSearch(filterInput) {
  const filterInputLower = filterInput ? filterInput.toLowerCase() : "";
  if (filterInputLower === "") {
    clearFilters();
    return;
  }
  const filters = filterInputLower.split(" ");

  if (isCardView) {
    const cardViewCards = document.querySelectorAll(".card.searchable");
    applySearchFilter(cardViewCards, filters);
  } else {
    const generatedListItems = document.querySelectorAll("#generatedList > li");
    applySearchFilter(generatedListItems, filters);
  }
}

// Clear filters
function clearFilters() {
  searchInput.value = ""; // Reset the filter input value

  if (isCardView) {
    const cardViewCards = document.querySelectorAll(".card.searchable");
    cardViewCards.forEach(card => {
      card.style.display = "block"; // Show all cards
    });
  } else {
    const generatedListItems = document.querySelectorAll("#generatedList > li");
    generatedListItems.forEach(item => {
      item.style.display = "block"; // Show all list items
    });
  }
}
