'use client';

import { useState, useEffect } from 'react';
import { fetchPokemonById, getFavoritePokemon, updateFavoritePokemon } from '@/lib/api';
import { getFavorites, removeFromFavorites } from '@/lib/utils';
import PokemonCard from '@/components/PokemonCard';
import LoadingSpinner, { PokemonCardSkeleton } from '@/components/LoadingSpinner';
import { NoFavoritesFound } from '@/components/NoData';

export default function FavoritesPage() {
  const [favorites, setFavorites] = useState([]);
  const [favoritePokemon, setFavoritePokemon] = useState([]);
  const [loading, setLoading] = useState(true);
  const [loadingStates, setLoadingStates] = useState({});

  useEffect(() => {
    loadFavorites();
  }, []);

  const loadFavorites = async () => {
    setLoading(true);

    const getFavorite = await getFavoritePokemon();
    console.log("getFavorite", getFavorite);

    const result = (getFavorite || [])
      .map((v) => {
        if (!v?.pokemons || !v?.pokemons?.id) return null; // buang data gak valid
        return { ...v.pokemons, mark: v?.mark };
      })
      .filter(Boolean); // hapus null

    console.log("Result after filter", result);

    const favoriteIds = result.map((v) => v.id);

    setFavorites(favoriteIds);
    setFavoritePokemon(result);
    setLoading(false);
  };

  const handleRemoveFromFavorites = async (pokemonId) => {
    await updateFavoritePokemon(pokemonId)
    // removeFromFavorites(pokemonId);
    // setFavorites(prev => {
    //   prev.filter(id => id !== pokemonId)
    // });
    loadFavorites()
    // setFavoritePokemon(prev => prev.filter(pokemon => {
    //   const id = parseInt(pokemon.url.match(/\/pokemon\/(\d+)\//)[1]);
    //   return id !== pokemonId;
    // }));
  };

  useEffect(() => {
   console.log("Favorite Pokemon", favoritePokemon)
  }, [favoritePokemon])
  

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="text-center mb-8">
            <h1 className="text-4xl font-bold text-gray-900 mb-4">Favorite Pokémon</h1>
            <p className="text-lg text-gray-600">Your personally curated collection</p>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-6">
            {Array.from({ length: 8 }).map((_, index) => (
              <PokemonCardSkeleton key={index} />
            ))}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold text-gray-900 mb-4">Favorite Pokémon</h1>
          <p className="text-lg text-gray-600 mb-6">Your personally curated collection</p>
          
          {favorites.length > 0 && (
            <div className="flex items-center justify-center space-x-4">
              <p className="text-sm text-gray-500">
                {favorites.length} Pokémon in your favorites
              </p>
              <button
                onClick={loadFavorites}
                className="text-blue-600 hover:text-blue-800 text-sm font-medium transition-colors"
              >
                Refresh
              </button>
            </div>
          )}
        </div>
        
        {favoritePokemon.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-6">
            {favoritePokemon.map((pokemon) => {
              const pokemonId = pokemon.id
              return (
                <div key={pokemon.name} className="relative group">
                  <PokemonCard 
                    pokemon={pokemon} 
                    pokemonData={pokemon.pokemonData}
                    handleRemoveFromFavorites={handleRemoveFromFavorites}
                  />
                  
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      handleRemoveFromFavorites(pokemonId);
                    }}
                    className="absolute top-2 left-2 z-20 p-2 bg-red-500 text-white rounded-full opacity-0 group-hover:opacity-100 transition-all hover:bg-red-600 shadow-lg"
                    title="Remove from favorites"
                  >
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                    </svg>
                  </button>

                  {loadingStates[pokemonId] && (
                    <div className="absolute inset-0 bg-white bg-opacity-75 flex items-center justify-center rounded-xl">
                      <LoadingSpinner size="sm" text="" />
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        ) : (
          <NoFavoritesFound />
        )}

        {favoritePokemon.length > 0 && (
          <div className="mt-12 text-center">
            <div className="bg-white rounded-lg shadow-lg p-6 max-w-2xl mx-auto">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Quick Actions</h3>
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <button
                  onClick={() => window.location.href = '/'}
                  className="px-6 py-3 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors"
                >
                  Browse More Pokémon
                </button>
                <button
                  onClick={() => window.location.href = '/create-group'}
                  className="px-6 py-3 bg-green-500 text-white rounded-lg hover:bg-green-600 transition-colors"
                >
                  Create a Group
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
