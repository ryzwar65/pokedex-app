// Debounce function to prevent excessive API calls during search
export const debounce = (func, wait) => {
  let timeout;
  return function executedFunction(...args) {
    const later = () => {
      clearTimeout(timeout);
      func(...args);
    };
    clearTimeout(timeout);
    timeout = setTimeout(later, wait);
  };
};

// Local storage keys
const FAVORITES_KEY = 'pokemon-favorites';
const GROUPS_KEY = 'pokemon-groups';

// Favorites management functions
export const getFavorites = () => {
  if (typeof window === 'undefined') return [];
  try {
    const favorites = localStorage.getItem(FAVORITES_KEY);
    return favorites ? JSON.parse(favorites) : [];
  } catch (error) {
    console.error('Error getting favorites:', error);
    return [];
  }
};

export const addToFavorites = (pokemonId) => {
  if (typeof window === 'undefined') return;
  try {
    const favorites = getFavorites();
    if (!favorites.includes(pokemonId)) {
      favorites.push(pokemonId);
      localStorage.setItem(FAVORITES_KEY, JSON.stringify(favorites));
    }
  } catch (error) {
    console.error('Error adding to favorites:', error);
  }
};

export const removeFromFavorites = (pokemonId) => {
  if (typeof window === 'undefined') return;
  try {
    const favorites = getFavorites();
    const updatedFavorites = favorites.filter(id => id !== pokemonId);
    localStorage.setItem(FAVORITES_KEY, JSON.stringify(updatedFavorites));
  } catch (error) {
    console.error('Error removing from favorites:', error);
  }
};

export const isFavorite = (pokemonId) => {
  const favorites = getFavorites();
  return favorites.includes(pokemonId);
};

// Pokemon groups management
export const getGroups = () => {
  if (typeof window === 'undefined') return [];
  try {
    const groups = localStorage.getItem(GROUPS_KEY);
    return groups ? JSON.parse(groups) : [];
  } catch (error) {
    console.error('Error getting groups:', error);
    return [];
  }
};

export const addGroup = (group) => {
  if (typeof window === 'undefined') return;
  try {
    const groups = getGroups();
    const newGroup = {
      id: Date.now().toString(),
      name: group.name,
      pokemonIds: group.pokemonIds,
      createdAt: new Date().toISOString()
    };
    groups.push(newGroup);
    localStorage.setItem(GROUPS_KEY, JSON.stringify(groups));
    return newGroup;
  } catch (error) {
    console.error('Error adding group:', error);
    throw error;
  }
};

export const removeGroup = (groupId) => {
  if (typeof window === 'undefined') return;
  try {
    const groups = getGroups();
    const updatedGroups = groups.filter(group => group.id !== groupId);
    localStorage.setItem(GROUPS_KEY, JSON.stringify(updatedGroups));
  } catch (error) {
    console.error('Error removing group:', error);
  }
};

// Utility function to capitalize first letter
export const capitalize = (str) => {
  return str.charAt(0).toUpperCase() + str.slice(1);
};

// Utility function to format Pokemon types with colors
export const getTypeColor = (type) => {
  const colors = {
    normal: 'bg-gray-400',
    fire: 'bg-red-500',
    water: 'bg-blue-500',
    electric: 'bg-yellow-400',
    grass: 'bg-green-500',
    ice: 'bg-blue-200',
    fighting: 'bg-red-700',
    poison: 'bg-purple-500',
    ground: 'bg-yellow-600',
    flying: 'bg-indigo-400',
    psychic: 'bg-pink-500',
    bug: 'bg-green-400',
    rock: 'bg-yellow-800',
    ghost: 'bg-purple-700',
    dragon: 'bg-indigo-700',
    dark: 'bg-gray-700',
    steel: 'bg-gray-500',
    fairy: 'bg-pink-300',
  };
  return colors[type] || 'bg-gray-400';
};

// Utility function to format stats for chart
export const formatStatsForChart = (stats) => {
  return stats.map(stat => ({
    name: stat.name.replace('-', ' ').toUpperCase(),
    value: stat.base_stat,
    fullName: stat.name
  }));
};