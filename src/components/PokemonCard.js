'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { capitalize, getTypeColor, isFavorite, addToFavorites, removeFromFavorites } from '@/lib/utils';
import { getFavoritePokemon, insertFavoritePokemon, updateFavoritePokemon } from '@/lib/api';

export default function PokemonCard({ pokemon, pokemonData, showCheckbox = false, isSelected = false, onSelectionChange, handleRemoveFromFavorites = null, showFavorite = true}) {
  const router = useRouter();
  const [isLoadingData, setIsLoadingData] = useState(false);
  const [data, setData] = useState(pokemonData);
  const [favorite, setFavorite] = useState(false);
  
  const pokemonName = pokemon.name

  useEffect(() => {
    if (pokemon?.mark) {
      setFavorite(pokemon?.mark);
    }
  }, [pokemon]);

  const handleCardClick = (e) => {
    if (showCheckbox) {
      e.preventDefault();
      onSelectionChange?.(pokemon, !isSelected);
    } else {
      router.push(`/pokemon/${pokemonName}`);
    }
  };

  const handleFavoriteToggle = async (e) => {
    e.stopPropagation();
    if (favorite) {
      const dataFavorite = await getFavoritePokemon()
      if (dataFavorite.length > 0) {
        const found = dataFavorite.find((v) => v?.pokemons?.name.toLowerCase() == pokemonName.toLowerCase())
        if (found && !handleRemoveFromFavorites){
          await updateFavoritePokemon(found?.id)
          removeFromFavorites(pokemonName);
        }
        else if (handleRemoveFromFavorites) {
          handleRemoveFromFavorites(found?.id)
        }
      }
      
    } else {
      await insertFavoritePokemon(pokemon)
      const dataFavorite = await getFavoritePokemon()
      if (dataFavorite.length > 0) {
        const found = dataFavorite.find((v) => v?.pokemons?.name.toLowerCase() == pokemonName.toLowerCase())
        if (found){
          addToFavorites(pokemonName);
        }
      }
    }
    setFavorite(!favorite);
  };

  const handleCheckboxChange = (e) => {
    e.stopPropagation();
    onSelectionChange?.(pokemon, e.target.checked);
  };

  return (
    <div 
      className={`
        relative bg-white rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 cursor-pointer transform hover:scale-105
        ${isSelected ? 'ring-4 ring-blue-500 bg-blue-50' : ''}
      `}
      onClick={handleCardClick}
    >
      {/* Selection checkbox */}
      {showCheckbox && (
        <div className="absolute top-2 left-2 z-10">
          <input
            type="checkbox"
            checked={isSelected}
            onChange={handleCheckboxChange}
            className="w-5 h-5 rounded border-2 border-gray-300 checked:bg-blue-500 checked:border-blue-500 focus:ring-blue-500"
            onClick={(e) => e.stopPropagation()}
          />
        </div>
      )}

      {/* Favorite button */}
      {!showCheckbox && showFavorite && (
        <button
          onClick={handleFavoriteToggle}
          className="absolute top-2 right-2 z-10 p-2 rounded-full bg-white shadow-md hover:shadow-lg transition-all"
        >
          <svg
            className={`w-5 h-5 ${favorite ? 'text-red-500 fill-current' : 'text-gray-400'}`}
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
          >
            <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z" />
          </svg>
        </button>
      )}

      {/* Pokemon image */}
      <div className="p-4">
        <div className="w-full h-40 flex items-center justify-center mb-4">
          <img
            src={pokemon.image}
            alt={pokemon.name}
            className="w-full h-full object-contain"
            onError={(e) => {
              e.target.src = '/api/placeholder/150/150';
            }}
          />
        </div>

        {/* Pokemon info */}
        <div className="text-center">
          <h3 className="font-bold text-lg text-gray-800 mb-2">
            {capitalize(pokemon.name)}
          </h3>
          
          {/* Pokemon types */}
          {data?.types && (
            <div className="flex justify-center gap-2">
              {data.types.map((type) => (
                <span
                  key={type.name}
                  className={`px-3 py-1 rounded-full text-white text-xs font-medium ${getTypeColor(type.name)}`}
                >
                  {capitalize(type.name)}
                </span>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}