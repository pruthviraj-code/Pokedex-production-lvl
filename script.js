const imgContainer = document.querySelector(".img-container");
const nextBtn = document.querySelector(".next-btn");
const backBtn = document.querySelector(".back-btn");
const pokemonId = document.querySelector(".pokemon-id p");
const pokemonName = document.querySelector(".name");
const ability = document.querySelector(".title");
const shinyImg = document.querySelector(".sprite-box");
const type1 = document.querySelector(".type-1");
const type2 = document.querySelector(".type-2");
const height = document.querySelector(".t1");
const weight = document.querySelector(".t2");
const flavouredText = document.querySelector(".text");

let allPokemon = []; // store list of all Pokémon
let currentIndex = 0; // track which Pokémon we are on

const typeColors = {
  normal: "#CFCFC4",
  fire: "#FFB385",
  water: "#89CFF0",
  electric: "#FDE47F",
  grass: "#A8E6A3",
  ice: "#B3F0F0",
  fighting: "#E57373",
  poison: "#D98AD9",
  ground: "#F2D49B",
  flying: "#C5A3FF",
  psychic: "#FF9BB3",
  bug: "#D4E157",
  rock: "#D6C385",
  ghost: "#B39DDB",
  dragon: "#A78BFA",
  dark: "#A1887F",
  steel: "#D1D1E0",
  fairy: "#F8BBD0",
};

// 1. Fetch full Pokémon list
fetch("https://pokeapi.co/api/v2/pokemon?limit=1&offset=0")
  .then((res) => res.json())
  .then((firstData) => {
    const total = firstData.count;
    return fetch(`https://pokeapi.co/api/v2/pokemon?limit=${total}&offset=0`);
  })
  .then((res) => res.json())
  .then((data) => {
    allPokemon = data.results; // save all Pokémon list

    // Show the first Pokémon
    showPokemon(currentIndex);
  });

// 2. Function to fetch & display one Pokémon
function showPokemon(index) {
  if (index < 0 || index >= allPokemon.length) return; // out of range

  const pokemon = allPokemon[index];

  fetch(pokemon.url)
    .then((res) => res.json())
    .then((pokeInfo) => {
      imgContainer.innerHTML = "";
      const pokeImg = document.createElement("img");
      pokeImg.src = pokeInfo.sprites.front_default; // sprite Img
      imgContainer.appendChild(pokeImg);
      pokemonId.textContent = `#${String(pokeInfo.id).padStart(3, "0")}`;
      pokemonName.textContent = pokeInfo.name;
      ability.textContent = "";

      // Loop through each ability

      pokeInfo.abilities.forEach((ab, i) => {
        if (i < 2) {
          ability.textContent += (i > 0 ? ", " : "") + ab.ability.name;
        }
      });
      shinyImg.innerHTML = "";
      const shinyPokeImg = document.createElement("img");
      shinyPokeImg.src = pokeInfo?.sprites?.front_shiny; // sprite shiny Img
      shinyImg.appendChild(shinyPokeImg);

      // change color
      const types = pokeInfo.types; // access type array

      const type1Name = types[0].type.name;
      type1.innerText = type1Name;
      type1.style.backgroundColor = typeColors[type1Name];

      if (pokeInfo.types.length > 1) {
        const type2Name = types[1].type.name;
        type2.style.display = "inline-block";
        type2.innerText = type2Name;
        type2.style.backgroundColor = typeColors[type2Name];
      } else {
        type2.style.display = "none";
      }

      height.innerHTML = `HT: ${pokeInfo.height / 10} m`;
      weight.innerHTML = `WT: ${pokeInfo.weight / 10} lbs`;

      const textUrl = pokeInfo.species.url;
      fetch(textUrl)
        .then((res) => res.json()) // <--- add ()
        .then((speciesData) => {
          // Optionally display some flavor text:

          const englishEntry = speciesData.flavor_text_entries.find(
            (entry) => entry.language.name === "en"
          );
          if (englishEntry) {
            flavouredText.innerHTML = englishEntry.flavor_text.replace(
              /\f/g,
              " "
            );
          }
        });
    });
}




let holdInterval;
const holdDelay = 160; // how fast to scroll (ms)
function startHold(action) {
  action();
  holdInterval = setInterval(action, holdDelay);
}

function stopHold() {
  clearInterval(holdInterval);
}

nextBtn.addEventListener("mousedown", () => startHold(() => {
  currentIndex++;
  if (currentIndex >= allPokemon.length) currentIndex = 0;
  showPokemon(currentIndex);
}));

nextBtn.addEventListener("mouseup", stopHold);
nextBtn.addEventListener("mouseleave", stopHold);

nextBtn.addEventListener("touchstart", () => startHold(() => {
  currentIndex++;
  if (currentIndex >= allPokemon.length) currentIndex = 0;
  showPokemon(currentIndex);
}));
nextBtn.addEventListener("touchend", stopHold);

// === BACK BUTTON EVENTS ===
backBtn.addEventListener("mousedown", () => startHold(() => {
  currentIndex--;
  if (currentIndex < 0) currentIndex = allPokemon.length - 1;
  showPokemon(currentIndex);
}));

backBtn.addEventListener("mouseup", stopHold);
backBtn.addEventListener("mouseleave", stopHold);
backBtn.addEventListener("touchstart", () => startHold(() => {
  currentIndex--;
  if (currentIndex < 0) currentIndex = allPokemon.length - 1;
  showPokemon(currentIndex);
}));
backBtn.addEventListener("touchend", stopHold);
