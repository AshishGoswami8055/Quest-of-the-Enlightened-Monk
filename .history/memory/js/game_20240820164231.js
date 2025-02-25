(function (d, w) {
  let cards = [];
  let matches = 0;
  const flipped_cards = [];

  const imageMapping = {
    react: "bear.png",
    vuejs: "blackrock.png",
    angular: "cloud.png",
    css3: "snowman.png",
    html5: "fire.png",
    js: "firstaid.png",
  };

  const build_board = () => {
    const board = d.querySelector(".board");
    cards = get_cards();
    const card_items = cards
      .map((card, id) => {
        return `<li class="card" data-id="${id}"></li>`;
      })
      .join("");

    board.innerHTML = card_items;
    board.addEventListener("click", flip_card);
  };

  const flip_card = (e) => {
    const card = e.target.closest(".card");
    if (!card || card.matches(".is-match") || card.matches(".is-flipped"))
      return;
    if (flipped_cards.length == 2) return;

    card.style.backgroundImage = `url(images/${
      imageMapping[cards[card.dataset.id]]
    })`;
    card.classList.add("is-flipped");

    flipped_cards.push({
      card,
      name: cards[card.dataset.id],
    });

    if (flipped_cards.length == 2) {
      check_match();
    }
  };

  const check_match = () => {
    if (flipped_cards[0].name === flipped_cards[1].name) {
      flipped_cards.forEach((flipped_card) => {
        flipped_card.card.classList.add("is-match");
        flipped_card.card.classList.remove("is-flipped");
      });

      matches += 2;
      flipped_cards.length = 0;

      if (game_over()) {
        console.log("Game finished! You are awesome!!!");
        // build_board();
      }
    } else {
      w.setTimeout(() => {
        flipped_cards.forEach((flipped_card) => {
          const card = flipped_card.card;
          card.style.backgroundImage = "";
          card.classList.remove("is-flipped");
        });
        flipped_cards.length = 0;
      }, 800);
    }
  };

  const shuffle_cards = (stack) => {
    const shuffled = [];
    const random_numbers = [];
    const total = stack.length;
    let i = 0;

    while (i < total) {
      const number = Math.floor(Math.random() * total);
      if (!random_numbers.includes(number)) {
        shuffled.push(stack[number]);
        random_numbers.push(number);
        i++;
      }
    }

    return shuffled;
  };

  const game_over = () => {
    if (matches === cards.length) {
      matches = 0;
      return true;
    }
    return false;
  };

  const get_cards = () => {
    const stack = ["react", "vuejs", "angular", "css3", "html5", "js"];

    const full_stack = stack.concat(stack);

    return shuffle_cards(full_stack);
  };

  build_board();
})(document, window);
