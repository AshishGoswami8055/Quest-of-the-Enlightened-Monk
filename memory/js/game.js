// Immediately Invoked Function Expression (IIFE) to encapsulate variables and avoid global scope pollution
(function (d, w) { 
  // Array to hold the card types
  let cards = [];
  // Count of matched pairs
  let matches = 0;
  // Array to keep track of flipped cards
  const flipped_cards = [];

  // Mapping of card names to image file names
  const imageMapping = {
    react: "bear.png",
    vuejs: "blackrock.png",
    angular: "cloud.png",
    css3: "snowman.png",
    html5: "fire.png",
    js: "firstaid.png",
  };

  // Function to build the game board
  const build_board = () => {
    const board = d.querySelector(".board"); // Select the board element
    cards = get_cards(); // Retrieve shuffled cards
    // Create card items as list elements
    const card_items = cards
      .map((card, id) => {
        return `<li class="card" data-id="${id}"></li>`; // Assign an ID to each card
      })
      .join(""); // Join the card items into a single string

    board.innerHTML = card_items; // Insert card items into the board
    board.addEventListener("click", flip_card); // Add click event listener to the board
  };

  // Function to handle card flipping
  const flip_card = (e) => {
    const card = e.target.closest(".card"); // Get the closest card element
    // Check if the clicked element is valid for flipping
    if (!card || card.matches(".is-match") || card.matches(".is-flipped"))
      return; // Ignore if card is already matched or flipped
    if (flipped_cards.length == 2) return; // Limit to two flipped cards

    // Set background image for the card and flip it
    card.style.backgroundImage = `url(images/${imageMapping[cards[card.dataset.id]]})`;
    card.classList.add("is-flipped"); // Mark card as flipped

    // Add flipped card information to the array
    flipped_cards.push({
      card,
      name: cards[card.dataset.id],
    });

    // Check for matches if two cards are flipped
    if (flipped_cards.length == 2) {
      check_match();
    }
  };

  // Function to check if the flipped cards match
  const check_match = () => {
    // Compare the names of the two flipped cards
    if (flipped_cards[0].name === flipped_cards[1].name) {
      // If they match, mark them as matched
      flipped_cards.forEach((flipped_card) => {
        flipped_card.card.classList.add("is-match");
        flipped_card.card.classList.remove("is-flipped"); // Remove flipped class
      });

      matches += 2; // Increment matched count
      flipped_cards.length = 0; // Clear flipped cards

      // Check if the game is over
      if (game_over()) {
        console.log("Game finished! You are awesome!!!");
        // build_board(); // Uncomment to reset the board for a new game
      }
    } else {
      // If cards don't match, flip them back after a delay
      w.setTimeout(() => {
        flipped_cards.forEach((flipped_card) => {
          const card = flipped_card.card;
          card.style.backgroundImage = ""; // Clear background image
          card.classList.remove("is-flipped"); // Remove flipped class
        });
        flipped_cards.length = 0; // Clear flipped cards
      }, 800); // Delay for 800ms
    }
  };

  // Function to shuffle the cards
  const shuffle_cards = (stack) => {
    const shuffled = []; // Array to hold shuffled cards
    const random_numbers = []; // Array to track random numbers used for shuffling
    const total = stack.length; // Total number of cards
    let i = 0;

    // While there are cards left to shuffle
    while (i < total) {
      const number = Math.floor(Math.random() * total); // Generate a random index
      // Ensure the number hasn't been used yet
      if (!random_numbers.includes(number)) {
        shuffled.push(stack[number]); // Add the card to shuffled array
        random_numbers.push(number); // Track the random number
        i++;
      }
    }

    return shuffled; // Return the shuffled array
  };

  // Function to check if the game is over
  const game_over = () => {
    // Check if all matches are found
    if (matches === cards.length) {
      matches = 0; // Reset matches for a new game
      return true; // Game is over
    }
    return false; // Game is still ongoing
  };

  // Function to get and shuffle the cards
  const get_cards = () => {
    const stack = ["react", "vuejs", "angular", "css3", "html5", "js"]; // Base card names

    const full_stack = stack.concat(stack); // Duplicate the stack for pairs

    return shuffle_cards(full_stack); // Shuffle and return the full stack
  };

  build_board(); // Initialize the game board
})(document, window); // Pass document and window as arguments
