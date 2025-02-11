// cSpell: disable
// ========================
// KONSTANTER
// ========================
// Her definerer vi objekter for statfarger og statnavn som vi bruker i koden.
const statColors = {
  hp: "hp", // HP
  attack: "atk", // Angrep
  defense: "def", // Forsvar
  "special-attack": "spatk", // Spesialangrep
  "special-defense": "spdef", // Spesialforsvar
  speed: "speed", // fast as fuck boiii
};

const statNames = {
  hp: "HP", // HP
  attack: "ATK", // ATK (angrep)
  defense: "DEF", // DEF (forsvar)
  "special-attack": "SP.A", // SP.A (spesialangrep)
  "special-defense": "SP.D", // SP.D (spesialforsvar)
  speed: "SPD", // SPD (fart)
};

let isShiny = false; // Holder styr på om shiny versjon er aktiv

// ========================
// HENDELSELYTTERE
// ========================
// Her setter vi opp lyttere for ulike hendelser på siden

// Når innholdet i DOM-en er lastet, starter vi rotasjonen av starter Pokémon
document.addEventListener("DOMContentLoaded", rotateStarterPokemon);

//refresh page
const refreshBtn = document.getElementById("nav-ico");

function handleClick() {
  window.location.reload();
}
refreshBtn.addEventListener("click", handleClick);

// Legger til klikk-lytter på søk-knappen
document.getElementById("searchButton").addEventListener("click", handleSearch);

// Legger til lytter på input-feltet slik at "Enter"-tast fungerer som søk
document.getElementById("pokemonName").addEventListener("keydown", (event) => {
  if (event.key === "Enter") handleSearch();
});

// ========================
// KJERNEFUNKSJONER
// ========================

// Funksjonen som kjøres når brukeren trykker søk
function handleSearch() {
  // Henter og formaterer brukerens input
  const name = document
    .getElementById("pokemonName")
    .value.toLowerCase()
    .trim();
  if (!name) {
    alert("Please enter a Pokémon name!"); // Advar bruker om å skrive inn et navn
    return;
  }
  // Henter data for den oppgitte Pokémonen
  fetchPokemonData(name);
}

// Henter Pokémon-data asynkront fra PokeAPI
async function fetchPokemonData(name) {
  try {
    // Gjør et kall til API-et med navnet på Pokémonen
    const response = await fetch(`https://pokeapi.co/api/v2/pokemon/${name}`);
    if (!response.ok) throw new Error("Pokémon not found! Try again."); // Feilmelding hvis ikke funnet
    const data = await response.json();
    // Viser informasjonen om Pokémonen
    displayPokemonInfo(data);
  } catch (error) {
    alert(error.message); // Viser feilmeldingen til brukeren
  }
}

// ========================
// VISNINGSFUNKSJONER
// ========================

// Oppdaterer grensesnittet for å vise Pokémon-info
function displayPokemonInfo(data) {
  // Hide welcome screen
  document.getElementById("welcomeScreen").style.display = "none";

  // Show Pokemon info containers
  document.querySelector("main").hidden = false;
  document.querySelector(".nameAndTyping").hidden = false;
  document.getElementById("pokemonInfo").hidden = false;

  // Update Pokemon info
  updatePokemonInfo(data);
  displayStats(data.stats);
}

// Oppdaterer info-delen med data fra API-et
function updatePokemonInfo(data) {
  // Lagrer data for sprite toggling
  const pokemonImage = document.getElementById("pokemonImage");
  pokemonImage.dataset.pokemonData = JSON.stringify(data);

  // Oppdater typer og bakgrunn
  const types = data.types.map((type) => type.type.name);
  setTypeBackground(types);

  // Oppdater grunnleggende info
  document.getElementById("pokemonTitle").textContent = data.name.toUpperCase();
  updatePokemonSprite(data); // Bruk ny funksjon for sprite-håndtering

  // Format height and weight
  const heightInMeters = (data.height / 10).toFixed(1);
  document.getElementById("pokemonHeight").textContent = `${heightInMeters}m`;

  const weightInKg = (data.weight / 10).toFixed(1);
  document.getElementById("pokemonWeight").textContent = `${weightInKg}kg`;

  document.getElementById("pokemonId").textContent = data.id;

  updateTypeDisplay(types);
}

// ========================
// STATFUNKSJONER
// ========================

// Viser statistikk for Pokémonen
function displayStats(stats) {
  const statsElement = document.getElementById("pokemonStats");
  statsElement.innerHTML = `
    <div class="stats-container">
      <div class="stats-header">
        ${stats
          .map(
            (stat) =>
              `<span class="stat-label">${formatStatName(
                stat.stat.name
              )}</span>`
          )
          .join("")}
      </div>
      <div class="stats-bars">
        ${stats.map((stat) => createStatElement(stat)).join("")}
      </div>
      <div class="stats-values">
        ${stats.map((stat) => `<span>${stat.base_stat}</span>`).join("")}
      </div>
    </div>
  `;
}

// Lager HTML for en enkelt stat-bar med riktig høyde og farge
function createStatElement(stat) {
  const percentage = calculateNonLinearHeight(stat.base_stat);
  const colorVar = statColors[stat.stat.name];
  return `<div class="stat-bar" style="height: ${percentage}%; background-color: var(--${colorVar}-clr)"></div>`;
}

// Beregner høyden på stat-baren på en ikke-lineær måte
function calculateNonLinearHeight(baseStat) {
  if (baseStat <= 50) return (baseStat / 50) * 30;
  if (baseStat <= 100) return 30 + ((baseStat - 50) / 50) * 30;
  if (baseStat <= 150) return 60 + ((baseStat - 100) / 50) * 25;
  return 85 + ((baseStat - 150) / 105) * 15;
}

// ========================
// HJELPEFUNKSJONER
// ========================

// Formaterer statnavnet basert på våre konstanter
function formatStatName(statName) {
  return statNames[statName] || statName;
}

// Setter bakgrunnsfarge basert på Pokémon-typen/typene
function setTypeBackground(types) {
  const main = document.querySelector("main");
  const statsContainer = document.querySelector(".stats-container");

  // Hvis Pokémonen har én type
  if (types.length === 1) {
    const bgColor = `var(--${types[0]}-clr)`;
    main.style.background = bgColor;
    statsContainer.style.background = bgColor;
  } else {
    // Hvis Pokémonen har to typer, bruk en lineær gradient
    const gradient = `linear-gradient(90deg, 
      var(--${types[0]}-clr) 0%, 
      var(--${types[0]}-clr) 50%, 
      var(--${types[1]}-clr) 50%, 
      var(--${types[1]}-clr) 100%
    )`;
    main.style.background = gradient;
    statsContainer.style.background = gradient;
  }
}

// Oppdaterer visningen av Pokémon-typene (som badges)
function updateTypeDisplay(types) {
  const typesContainer = document.getElementById("pokemonTypes");
  typesContainer.innerHTML = ""; // Tømmer containeren før vi legger til nye
  types.forEach((type) => {
    const typeSpan = document.createElement("span");
    typeSpan.className = "type-badge";
    typeSpan.textContent = type.toUpperCase();
    typeSpan.style.backgroundColor = `var(--${type}-clr)`;
    typesContainer.appendChild(typeSpan);
  });
}

// ========================
// ANIMASJON PÅ VELKOMSTSKJERMEN
// ========================

// Animerer bytte av starter Pokémon på velkomstskjermen
function rotateStarterPokemon() {
  // Liste over starter Pokémon med id og navn
  const starters = [
    { id: 1, name: "Bulbasaur" },
    { id: 4, name: "Charmander" },
    { id: 7, name: "Squirtle" },
  ];

  let currentIndex = 0;
  const welcomeImage = document.querySelector(".welcome-pokeball");

  // Bytt bilde hvert 3. sekund
  setInterval(() => {
    currentIndex = (currentIndex + 1) % starters.length;
    const starter = starters[currentIndex];
    welcomeImage.src = `https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/${starter.id}.png`;
    welcomeImage.alt = starter.name;
  }, 3000);
}

// ========================
// SPRITE HÅNDTERING
// ========================

// Oppdaterer Pokemon-sprite basert på tilgjengelige sprites og shiny status
function updatePokemonSprite(data) {
  // Konverterer data fra string hvis nødvendig
  if (typeof data === "string") {
    data = JSON.parse(data);
  }

  const spriteVersion = isShiny ? "front_shiny" : "front_default";
  const pokemonImage = document.getElementById("pokemonImage");

  // Prøver Gen V sprite først (animert)
  const genVSprite =
    data.sprites.versions["generation-v"]?.["black-white"]?.animated?.[
      spriteVersion
    ];

  // Hvis ingen Gen V, prøv Showdown sprite (animert)
  const showdownSprite = data.sprites.other?.showdown?.[spriteVersion];

  // Hvis ingen Showdown, bruk basic sprite (ikke animert)
  const basicSprite = data.sprites[spriteVersion];

  // Bruker første tilgjengelige sprite
  pokemonImage.src = genVSprite || showdownSprite || basicSprite;
}

// Håndterer klikk på shiny-toggle knappen
document.getElementById("shinyToggle").addEventListener("click", () => {
  isShiny = !isShiny; // Bytter mellom normal og shiny

  // Oppdaterer ikonet for shiny-toggle
  const shinyIcon = document.getElementById("shinyIcon");
  shinyIcon.src = isShiny ? "img/Shiny.png" : "img/NonShiny.png";

  // Oppdaterer Pokemon sprite hvis en Pokemon vises
  const currentPokemon = document.getElementById("pokemonImage");
  if (!currentPokemon.hidden) {
    updatePokemonSprite(currentPokemon.dataset.pokemonData);
  }
});

// cSpell: enable
