// cSpell: disable
// ========================
// KONSTANTER
// ========================
// Objekter for stat-farger og navn som brukes i applikasjonen
const statColors = {
  hp: "hp",
  attack: "atk",
  defense: "def",
  "special-attack": "spatk",
  "special-defense": "spdef",
  speed: "speed",
};

const statNames = {
  hp: "HP",
  attack: "ATK",
  defense: "DEF",
  "special-attack": "SP.A",
  "special-defense": "SP.D",
  speed: "SPD",
};

let isShiny = false; // Holder styr på om shiny versjon er aktiv

// Konstanter for paginering
const POKEMON_PER_PAGE = 20;
let currentPage = 1;
let totalPokemon = 1017; // Totalt antall Pokemon
const TOTAL_PAGES = Math.ceil(totalPokemon / POKEMON_PER_PAGE);

// ========================
// HENDELSELYTTERE
// ========================

// Oppdater siden
const refreshBtn = document.getElementById("nav-ico");

function handleClick() {
  window.location.reload();
}
refreshBtn.addEventListener("click", handleClick);

// Søkefunksjonalitet
document.getElementById("searchButton").addEventListener("click", handleSearch);
document.getElementById("pokemonName").addEventListener("keydown", (event) => {
  if (event.key === "Enter") handleSearch();
});

// ========================
// KJERNEFUNKSJONER
// ========================

// Håndterer søk etter Pokemon
function handleSearch() {
  const name = document
    .getElementById("pokemonName")
    .value.toLowerCase()
    .trim();
  if (!name) {
    alert("Skriv inn navnet på en Pokemon!");
    return;
  }
  fetchPokemonData(name);
}

// Henter Pokemon-data fra API
async function fetchPokemonData(name) {
  try {
    const response = await fetch(`https://pokeapi.co/api/v2/pokemon/${name}`);
    if (!response.ok) throw new Error("Pokemon ikke funnet! Prøv igjen.");
    const data = await response.json();
    displayPokemonInfo(data);
  } catch (error) {
    alert(error.message);
  }
}

// ========================
// VISNINGSFUNKSJONER
// ========================

// Viser Pokemon-informasjon
function displayPokemonInfo(data) {
  // Skjuler grid og viser Pokemon-info
  document.getElementById("pokemonGrid").hidden = true;

  // Viser Pokemon-info containere
  const mainElement = document.querySelector("main");
  const nameTypingElement = document.querySelector(".nameAndTyping");
  const pokemonInfoElement = document.getElementById("pokemonInfo");

  if (mainElement) mainElement.hidden = false;
  if (nameTypingElement) nameTypingElement.hidden = false;
  if (pokemonInfoElement) pokemonInfoElement.hidden = false;

  // Legger til tilbakeknapp hvis den ikke eksisterer
  if (!document.getElementById("backToGrid")) {
    const backBtn = document.createElement("button");
    backBtn.id = "backToGrid";
    backBtn.textContent = "Tilbake til oversikt";
    backBtn.addEventListener("click", () => {
      mainElement.hidden = true;
      nameTypingElement.hidden = true;
      pokemonInfoElement.hidden = true;
      document.getElementById("pokemonGrid").hidden = false;
    });
    document.body.appendChild(backBtn);
  }

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

// Laster Pokemon-kort utenfor DOMContentLoaded
async function loadPokemonCards(page) {
  const startId = (page - 1) * POKEMON_PER_PAGE + 1;
  const endId = Math.min(page * POKEMON_PER_PAGE, totalPokemon);
  const gridContainer = document.getElementById("pokemonGrid");
  const cardsContainer = gridContainer.querySelector(".cards-container");

  cardsContainer.innerHTML = ""; // Tømmer kortene

  for (let i = startId; i <= endId; i++) {
    try {
      const response = await fetch(`https://pokeapi.co/api/v2/pokemon/${i}`);
      const pokemon = await response.json();

      const card = document.createElement("div");
      card.className = "pokemon-card";
      card.innerHTML = `
        <span class="card-id">#${String(pokemon.id).padStart(3, "0")}</span>
        <img src="${pokemon.sprites.front_default}" alt="${pokemon.name}" />
        <h3>${pokemon.name.toUpperCase()}</h3>
        <div class="card-types">
          ${pokemon.types
            .map(
              (type) =>
                `<span class="type-badge" style="background-color: var(--${
                  type.type.name
                }-clr)">
                  ${type.type.name.toUpperCase()}
                </span>`
            )
            .join("")}
        </div>
      `;

      card.addEventListener("click", () => {
        document.getElementById("pokemonGrid").hidden = true;
        displayPokemonInfo(pokemon);
      });

      cardsContainer.appendChild(card);
    } catch (error) {
      console.error(`Feil ved lasting av Pokemon ${i}:`, error);
    }
  }

  // Oppdater paginering
  const pageSelect = document.getElementById("pageSelect");
  if (pageSelect) pageSelect.value = page.toString();

  document.getElementById("prevPage").disabled = page === 1;
  document.getElementById("nextPage").disabled = endId >= totalPokemon;
}

// Hendelselyttere og initialisering når DOM er lastet
document.addEventListener("DOMContentLoaded", () => {
  // Initialiser pagineringskontroller
  const pageSelect = document.getElementById("pageSelect");
  const prevButton = document.getElementById("prevPage");
  const nextButton = document.getElementById("nextPage");
  const firstButton = document.getElementById("firstPage");
  const lastButton = document.getElementById("lastPage");

  // Fyll nedtrekksmeny med sider
  for (let i = 1; i <= TOTAL_PAGES; i++) {
    const option = document.createElement("option");
    option.value = i;
    option.textContent = `Side ${i}`;
    pageSelect.appendChild(option);
  }

  // Legg til hendelselyttere
  pageSelect.addEventListener("change", () => {
    currentPage = parseInt(pageSelect.value);
    loadPokemonCards(currentPage);
  });

  prevButton.addEventListener("click", () => {
    if (currentPage > 1) {
      currentPage--;
      loadPokemonCards(currentPage);
    }
  });

  nextButton.addEventListener("click", () => {
    if (currentPage * POKEMON_PER_PAGE < totalPokemon) {
      currentPage++;
      loadPokemonCards(currentPage);
    }
  });

  firstButton.addEventListener("click", () => {
    currentPage = 1;
    loadPokemonCards(currentPage);
  });

  lastButton.addEventListener("click", () => {
    currentPage = TOTAL_PAGES;
    loadPokemonCards(currentPage);
  });

  // Legg til shiny-toggle lytter
  const shinyToggle = document.getElementById("shinyToggle");
  if (shinyToggle) {
    shinyToggle.addEventListener("click", () => {
      isShiny = !isShiny;
      const shinyIcon = document.getElementById("shinyIcon");
      if (shinyIcon) {
        shinyIcon.src = isShiny ? "img/Shiny.png" : "img/NonShiny.png";
      }
      const pokemonImage = document.getElementById("pokemonImage");
      if (pokemonImage && pokemonImage.dataset.pokemonData) {
        updatePokemonSprite(pokemonImage.dataset.pokemonData);
      }
    });
  }

  // Last første side
  loadPokemonCards(1);
});

// cSpell: enable
