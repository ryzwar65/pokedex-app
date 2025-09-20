'use client';

import { useState, useEffect } from 'react';
import { deleteGroupPokemon, fetchPokemonById, getFavoritePokemon, getGroupPokemon, updateFavoritePokemon } from '@/lib/api';
import { getFavorites, removeFromFavorites } from '@/lib/utils';
import PokemonCard from '@/components/PokemonCard';
import LoadingSpinner, { PokemonCardSkeleton } from '@/components/LoadingSpinner';
import { NoFavoritesFound, NoGroupsFound } from '@/components/NoData';

export default function ListGroupPage() {
  const [groupPokemon, setGroupPokemon] = useState([]);
  const [loading, setLoading] = useState(true);
  const [loadingStates, setLoadingStates] = useState({});

  useEffect(() => {
    loadGroupPokemon()
  }, []);

  const loadGroupPokemon = async () => {
    const getGroup = await getGroupPokemon();
    setGroupPokemon(getGroup)
    setTimeout(() => {
        setLoading(false);
    }, 3000);
    console.log("getGroup", getGroup);
  }

  const handleRemoveGroup = async (groupId) => {
    await deleteGroupPokemon(groupId)
    loadGroupPokemon()
  };
  

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="text-center mb-8">
            <h1 className="text-4xl font-bold text-gray-900 mb-4">Your Team Pokémon</h1>
            <p className="text-lg text-gray-600">Your personally curated collection</p>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-6">
           {[...Array(8)].map((_, index) => (
                <div key={index}>
                    <PokemonCardSkeleton />
                </div>
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
          <h1 className="text-4xl font-bold text-gray-900 mb-4">Your Team Pokémon</h1>
          <p className="text-lg text-gray-600 mb-6">Your personally curated collection</p>
          
          {groupPokemon.length > 0 && (
            <div className="flex items-center justify-center space-x-4">
              <p className="text-sm text-gray-500">
                {groupPokemon.length} group
              </p>
            </div>
          )}
        </div>
        
        {groupPokemon.length > 0 ? (
            <div className='flex flex-col'>
            {groupPokemon.map((group, index) => {
              return (
                    <div key={index} className='pt-10'>
                        <div className='flex items-center space-x-5 group relative'>
                            <div className="text-3xl font-bold text-gray-900 mb-4">
                                {group.name}
                            </div>
                            <button
                                onClick={(e) => {
                                e.stopPropagation();
                                handleRemoveGroup(group.id)
                            }}
                                className="absolute top-0 right-0 z-20 p-2 bg-red-500 text-white rounded-full cursor-pointer hover:bg-red-600 shadow-lg"
                                title="Remove from favorites"
                            >
                                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                                </svg>
                            </button>
                        </div>
                            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-6">
                            {
                                group?.pokemons.map((pokemon) => (
                                    <div key={pokemon.name} className="relative group">
                                        <PokemonCard 
                                            pokemon={pokemon} 
                                            pokemonData={pokemon.pokemonData}
                                            showFavorite={false}
                                        />
                                    </div>
                                ))
                            }
                        </div>
                    </div>
                );
            })}
        </div>
        ) : (
          <NoGroupsFound />
        )}

        {groupPokemon.length > 0 && (
          <div className="mt-12 text-center">
            <div className="bg-white rounded-lg shadow-lg p-6 max-w-2xl mx-auto">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Quick Actions</h3>
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
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
