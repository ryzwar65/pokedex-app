const POKEMON_API_BASE = 'http://localhost:5050/api';

// Cache for storing Pokemon data to avoid redundant API calls
const pokemonCache = new Map();

export const insertGroupPokemon = async (payload) => {
  try {
    const response = await fetch(`${POKEMON_API_BASE}/group-pokemon`,{
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(payload),
    });
    if (!response.ok) {
      throw new Error('Failed to fetch Pokemon list');
    }
    const data = await response.json();
    return data.data
  } catch (error) {
    console.error('Error fetching Pokemon list:', error);
    throw error;
  }
}

export const getGroupPokemon = async () => {
  try {
    const response = await fetch(`${POKEMON_API_BASE}/group-pokemon`);
    if (!response.ok) {
      throw new Error('Failed to fetch Pokemon list');
    }
    const data = await response.json();
    return data.data
  } catch (error) {
    console.error('Error fetching Pokemon list:', error);
    throw error;
  }
}

export const deleteGroupPokemon = async (id) => {
  try {
    const response = await fetch(`${POKEMON_API_BASE}/group-pokemon/${id}`, {
      method: 'DELETE',
      headers: {
        'Content-Type': 'application/json',
      },
    })
    if (!response.ok) {
      throw new Error('Failed to fetch Pokemon list');
    }
    const data = await response.json();
    return data.data
  } catch (error) {
    console.error('Error fetching Pokemon list:', error);
    throw error;
  }
}

export const updateFavoritePokemon = async (id) => {
  try {
    const response = await fetch(`${POKEMON_API_BASE}/favorite/update`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({"id":id}),
    })
    if (!response.ok) {
      throw new Error('Failed to fetch Pokemon list');
    }
    return await response.json();
  } catch (error) {
    console.error('Error fetching Pokemon list:', error);
    throw error;
  }
}

export const getFavoritePokemon = async () => {
  try {
    const response = await fetch(`${POKEMON_API_BASE}/favorite`);
    if (!response.ok) {
      throw new Error('Failed to fetch Pokemon list');
    }
    const data = await response.json();
    return data.data
  } catch (error) {
    console.error('Error fetching Pokemon list:', error);
    throw error;
  }
}

export const insertFavoritePokemon = async (pokemon) => {
  try {
    const response = await fetch(`${POKEMON_API_BASE}/favorite`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(pokemon),
    })
    if (!response.ok) {
      throw new Error('Failed to fetch Pokemon list');
    }
    return await response.json();
  } catch (error) {
    console.error('Error fetching Pokemon list:', error);
    throw error;
  }
}

export const fetchPokemonList = async (offset = 0, limit = 20) => {
  try {
    const response = await fetch(`${POKEMON_API_BASE}/pokemon?offset=${offset}&limit=${limit}`);
    if (!response.ok) {
      throw new Error('Failed to fetch Pokemon list');
    }
    return await response.json();
  } catch (error) {
    console.error('Error fetching Pokemon list:', error);
    throw error;
  }
};

export const fetchPokemonByName = async (name) => {
  // Check cache first
  const cacheKey = name.toLowerCase();
  console.log("Cache Pokemon",pokemonCache.has(cacheKey))
  if (pokemonCache.has(cacheKey)) {
    return pokemonCache.get(cacheKey);
  }

  try {
    const response = await fetch(`${POKEMON_API_BASE}/pokemon/${name.toLowerCase()}`);
    if (!response.ok) {
      throw new Error(`Failed to fetch Pokemon: ${name}`);
    }
    const data = await response.json();
    
    // Cache the result
    pokemonCache.set(cacheKey, data);
    return data.data;
  } catch (error) {
    console.error(`Error fetching Pokemon ${name}:`, error);
    throw error;
  }
};

export const fetchPokemonById = async (id) => {
  // Check cache first
  const cacheKey = id.toString();
  if (pokemonCache.has(cacheKey)) {
    return pokemonCache.get(cacheKey);
  }

  try {
    const response = await fetch(`${POKEMON_API_BASE}/pokemon/${id}`);
    if (!response.ok) {
      throw new Error(`Failed to fetch Pokemon with ID: ${id}`);
    }
    const data = await response.json();
    
    // Cache the result
    pokemonCache.set(cacheKey, data);
    pokemonCache.set(data.name, data); // Cache by name too
    return data;
  } catch (error) {
    console.error(`Error fetching Pokemon with ID ${id}:`, error);
    throw error;
  }
};

export const searchPokemon = async (query) => {
  if (!query.trim()) return [];

  try {
    // For search, we'll need to fetch the full list and filter
    // In a real app, you might want to implement a better search strategy
    const response = await fetch(`${POKEMON_API_BASE}/pokemon/search?name=${query}`);
    if (!response.ok) {
      throw new Error('Failed to fetch Pokemon for search');
    }
    const data = await response.json();
    
    return data.data;
  } catch (error) {
    console.error('Error searching Pokemon:', error);
    throw error;
  }
};

// Helper function to extract Pokemon ID from URL
export const extractPokemonId = (url) => {
  const matches = url.match(/\/pokemon\/(\d+)\//);
  return matches ? parseInt(matches[1]) : null;
};

// Helper function to get Pokemon image URL
export const getPokemonImageUrl = (id) => {
  return `https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/${id}.png`;
};