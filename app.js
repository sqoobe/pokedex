function handleSearch() {
  const name = document
    .getElementById("pokemonName")
    .value.toLowerCase()
    .trim();

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
  // Basic info
  document.getElementById("pokemonTitle").textContent = data.name.toUpperCase();
  document.getElementById("pokemonImage").src =
    data.sprites.other["official-artwork"].front_default;
  document.getElementById("pokemonHeight").textContent = data.height;
  document.getElementById("pokemonWeight").textContent = data.weight;
  document.getElementById("pokemonId").textContent = data.id;
  document.getElementById("pokemonTypes").textContent = data.types
    .map((type) => type.type.name)
    .join(", ");

  // Stats
  displayStats(data.stats);

  document.getElementById("pokemonInfo").hidden = false;
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
