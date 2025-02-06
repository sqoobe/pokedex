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

    // For now, just update the title to show we got the data
    document.getElementById("pokemonTitle").textContent =
      data.name.toUpperCase();
    document.getElementById("pokemonInfo").hidden = false;
  } catch (error) {
    alert(error.message);
  }
}

// Event Listeners
document.getElementById("searchButton").addEventListener("click", handleSearch);
document.getElementById("pokemonName").addEventListener("keydown", (event) => {
  if (event.key === "Enter") {
    handleSearch();
  }
});
