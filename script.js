const container = document.getElementById("card-container");
const filterButton = document.querySelector(".filter-button");
const resetButton = document.querySelector(".reset-button");
const dropdown = document.querySelector(".dropdown");
const inputText = document.querySelector(".input-text");

// Store all Pokémon data
let allPokemon = [];

// Function to fetch Pokémon data by ID
async function fetchPokemonData(id) {
    const response = await fetch(`https://pokeapi.co/api/v2/pokemon/${id}`);
    const data = await response.json();
    return data;
}


// Function to fetch all Pokémon up to a specified limit
async function fetchAllPokemon() {
    for (let i = 1; i <= 151; i++) {
        const pokemon = await fetchPokemonData(i);
        allPokemon.push(pokemon); // Save the fetched data in the array
        createPokemonCard(pokemon);
    }
}

// Function to create a Pokémon card
function createPokemonCard(pokemon) {
    const card = document.createElement("div");
    card.classList.add("card");

    const type = pokemon.types[0].type.name;
    const typeColor = getTypeColor(type);

    card.innerHTML = `
        <div class="card-inner" style="background-color: ${typeColor}">
            <div class="card-front">
                <p class="pokemonID">#${pokemon.id}</p>
                <img src="${pokemon.sprites.front_default}" alt="${pokemon.name}">
                <h3>${pokemon.name.charAt(0).toUpperCase() + pokemon.name.slice(1)}</h3>
                <div class="type">${type.toUpperCase()}</div>
            </div>
            <div class="card-back">
                <img src="${pokemon.sprites.front_default}" alt="${pokemon.name}">
                <p><strong>Ability:</strong> ${pokemon.abilities[0].ability.name}</p>
                <p><strong>Base Exp:</strong> ${pokemon.base_experience}</p>
                <button class="details-button" onclick="showMoreDetails(${pokemon.id})">Show More Details</button>
            </div>
        </div>
    `;

    card.setAttribute("data-type", type); // Store type as data attribute
    card.setAttribute("data-name", pokemon.name.toLowerCase()); // Store name in lowercase for case-insensitive comparison
    card.addEventListener("mouseover", () => card.classList.add("flipped"));
    card.addEventListener("mouseout", () => card.classList.remove("flipped"));

    container.appendChild(card);
}

// Function to show more details in a modal
async function showMoreDetails(id) {
    const pokemon = await fetchPokemonData(id);
    const modal = document.createElement("div");
    modal.classList.add("modal");

    modal.innerHTML = `
        <div class="modal-content">
            <span class="close-button" onclick="closeModal()">&times;</span>
            <h2>${pokemon.name.charAt(0).toUpperCase() + pokemon.name.slice(1)}</h2>
            <img class="popImg" src="${pokemon.sprites.other["official-artwork"].front_default}" alt="${pokemon.name}">
            <p><strong>Type:</strong> ${pokemon.types.map(type => type.type.name).join(", ")}</p>
            <p><strong>Height:</strong> ${pokemon.height}</p>
            <p><strong>Weight:</strong> ${pokemon.weight}</p>
            <p><strong>Base Experience:</strong> ${pokemon.base_experience}</p>
            <p><strong>Abilities:</strong> ${pokemon.abilities.map(ability => ability.ability.name).join(", ")}</p>
        </div>
    `;

    document.body.appendChild(modal);
}

// Function to close the modal
function closeModal() {
    const modal = document.querySelector(".modal");
    if (modal) modal.remove();
}

// Function to get color based on Pokémon type
function getTypeColor(type) {
    const colors = {
        grass: "#78C850",
        fire: "#F08030",
        water: "#6890F0",
        bug: "#A8B820",
        normal: "#A8A878",
        poison: "#A040A0",
        electric: "#F8D030",
        ground: "#E0C068",
        fairy: "#EE99AC",
        rock: "#B8A038",
        fighting: "#C03028",
        psychic: "#F85888",
        ghost: "#705898",
        ice: "#98D8D8",
        dragon: "#7038F8",
        dark: "#705848",
        steel: "#B8B8D0",
        flying: "#A890F0"
    };
    return colors[type] || "#68A090";
}

// Function to filter Pokémon by selected type
function filterByType() {
    const selectedType = dropdown.value.toLowerCase();
    const cards = document.querySelectorAll(".card");

    cards.forEach(card => {
        const cardType = card.getAttribute("data-type");
        const cardName = card.getAttribute("data-name");
        const nameFilter = inputText.value.toLowerCase();
        
        if (
            (selectedType === "types" || cardType === selectedType) &&
            (cardName.includes(nameFilter) || nameFilter === "")
        ) {
            card.style.display = "block"; // Show card if it matches the type and name
        } else {
            card.style.display = "none"; // Hide card if it doesn't match
        }
    });
}

// Function to reset the Pokémon list
function resetPokemonList() {
    const cards = document.querySelectorAll(".card");
    cards.forEach(card => {
        card.style.display = "block"; // Show all cards
    });
    dropdown.value = "Types"; // Reset dropdown selection
    inputText.value = ""; // Clear input field
}

// Event listeners for filter and reset buttons
filterButton.addEventListener("click", filterByType);
resetButton.addEventListener("click", resetPokemonList);

// Event listener for input text change
inputText.addEventListener("input", filterByType);

// Call the function to load all Pokémon data
fetchAllPokemon();



