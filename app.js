function handleSearch() {
  const name = document.getElementById("pokemonName").value.toLowerCase().trim();

  if (!name) {
    alert("Please enter a Pokémon name!");
    return;
  }

  fetchPokemonData(name);
}

async function fetchPokemonData(name) {
  try {
    const response = await fetch(`https://pokeapi.co/api/v2/pokemon/${name}`);
    if (!response.ok) throw new Error("Pokémon not found! Try again.");
    const data = await response.json();

    displayPokemonInfo(data);
  } catch (error) {
    alert(error.message);
  }
}

function displayPokemonInfo(data) {
  // Hide welcome screen
  document.getElementById("welcomeScreen").style.display = "none";

  // Show the previously hidden elements
  document.querySelector("main").hidden = false;
  document.querySelector(".nameAndTyping").hidden = false;
  document.getElementById("pokemonInfo").hidden = false;

  // Get types and set background
  const types = data.types.map((type) => type.type.name);
  setTypeBackground(types);

  // Basic info
  document.getElementById("pokemonTitle").textContent = data.name.toUpperCase();
  document.getElementById("pokemonImage").src = data.sprites.other["official-artwork"].front_default;
  document.getElementById("pokemonHeight").textContent = data.height;
  document.getElementById("pokemonWeight").textContent = data.weight;
  document.getElementById("pokemonId").textContent = data.id;

  // Update type display
  const typesContainer = document.getElementById("pokemonTypes");
  typesContainer.innerHTML = ""; // Clear existing content
  types.forEach((type) => {
    const typeSpan = document.createElement("span");
    typeSpan.className = "type-badge";
    typeSpan.textContent = type.toUpperCase();
    typeSpan.style.backgroundColor = `var(--${type}-clr)`;
    typesContainer.appendChild(typeSpan);
  });

  // Stats
  displayStats(data.stats);
}

function setTypeBackground(types) {
  const main = document.querySelector("main");

  if (types.length === 1) {
    // Single type - solid background
    main.style.background = `var(--${types[0]}-clr)`;
  } else {
    // Two types - gradient background
    main.style.background = `linear-gradient(90deg, 
      var(--${types[0]}-clr) 0%, 
      var(--${types[0]}-clr) 50%, 
      var(--${types[1]}-clr) 50%, 
      var(--${types[1]}-clr) 100%
    )`;
  }
}

function displayStats(stats) {
  const statsElement = document.getElementById("pokemonStats");
  statsElement.innerHTML = "";

  stats.forEach((stat) => {
    statsElement.appendChild(createStatElement(stat));
  });
}

function createStatElement(stat) {
  const wrapper = document.createElement("div");
  wrapper.className = "stat-wrapper";

  const statBar = document.createElement("div");
  statBar.className = "stat-bar";
  statBar.textContent = `${stat.stat.name}: ${stat.base_stat}`;

  wrapper.appendChild(statBar);
  return wrapper;
}

// Event Listeners
document.getElementById("searchButton").addEventListener("click", handleSearch);
document.getElementById("pokemonName").addEventListener("keydown", (event) => {
  if (event.key === "Enter") {
    handleSearch();
  }
});

function rotateStarterPokemon() {
  const starters = [
    { id: 1, name: "Bulbasaur" },
    { id: 4, name: "Charmander" },
    { id: 7, name: "Squirtle" },
  ];

  let currentIndex = 0;
  const welcomeImage = document.querySelector(".welcome-pokeball");

  setInterval(() => {
    currentIndex = (currentIndex + 1) % starters.length;
    const starter = starters[currentIndex];
    welcomeImage.src = `https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/${starter.id}.png`;
    welcomeImage.alt = starter.name;
  }, 3000); // Change every 3 seconds
}

document.addEventListener("DOMContentLoaded", rotateStarterPokemon);
