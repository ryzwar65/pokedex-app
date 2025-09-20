'use client';

import { useState, useEffect, useCallback, useRef } from 'react';
import { fetchPokemonList, getFavoritePokemon, searchPokemon } from '@/lib/api';
import { debounce } from '@/lib/utils';
import PokemonCard from '@/components/PokemonCard';
import LoadingSpinner, { PokemonCardSkeleton } from '@/components/LoadingSpinner';
import { NoSearchResults } from '@/components/NoData';

export default function Home() {
  const [pokemon, setPokemon] = useState([]);
  const [filteredPokemon, setFilteredPokemon] = useState([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [loading, setLoading] = useState(true);
  const [loadingMore, setLoadingMore] = useState(false);
  const [hasMore, setHasMore] = useState(true);
  const [offset, setOffset] = useState(0);
  const observerRef = useRef();
  const lastPokemonElementRef = useRef();

  const ITEMS_PER_PAGE = 20;

  // Load initial Pokemon data
  useEffect(() => {
    loadPokemon(0, true);
  }, []);

  // Load more Pokemon
  const loadPokemon = async (currentOffset, isInitial = false) => {
    if (isInitial) {
      setLoading(true);
    } else {
      setLoadingMore(true);
    }

    try {
      const data = await fetchPokemonList(currentOffset, ITEMS_PER_PAGE);
      const favoritePoke = await getFavoritePokemon()
      const newPokemon = data.data.data.map((v) => {
        let found = favoritePoke.find((val) => val?.pokemons?.name.toLowerCase() == v?.name?.toLowerCase())
        if(found){
          return {...v, mark: found?.mark}          
        }
        return v
      });

      setPokemon(prevPokemon => 
        isInitial ? newPokemon : [...prevPokemon, ...newPokemon]
      );
      setFilteredPokemon(prevFiltered => 
        isInitial ? newPokemon : [...prevFiltered, ...newPokemon]
      );
      
      setHasMore(data.next !== null);
      setOffset(currentOffset + ITEMS_PER_PAGE);
    } catch (error) {
      console.error('Error loading Pokemon:', error);
    } finally {
      setLoading(false);
      setLoadingMore(false);
    }
  };

  // Debounced search function
  const debouncedSearch = useCallback(
    debounce(async (query) => {
      if (!query.trim()) {
        setFilteredPokemon(pokemon);
        return;
      }

      try {
        const results = await searchPokemon(query);
        setFilteredPokemon(results);
      } catch (error) {
        console.error('Error searching Pokemon:', error);
        setFilteredPokemon([]);
      }
    }, 300),
    [pokemon]
  );

  // Handle search input
  const handleSearchChange = (e) => {
    const query = e.target.value;
    setSearchQuery(query);
  };

  // Clear search
  const clearSearch = () => {
    setSearchQuery('');
    setFilteredPokemon(pokemon);
  };

  // Intersection Observer for infinite scroll
  useEffect(() => {
    if (observerRef.current) observerRef.current.disconnect();

    const observer = new IntersectionObserver(
      (entries) => {
        const lastEntry = entries[0];
        if (lastEntry.isIntersecting && hasMore && !loadingMore && !searchQuery) {
          loadPokemon(offset);
        }
      },
      { threshold: 0.1 }
    );

    observerRef.current = observer;

    if (lastPokemonElementRef.current) {
      observer.observe(lastPokemonElementRef.current);
    }

    return () => {
      if (observerRef.current) {
        observerRef.current.disconnect();
      }
    };
  }, [hasMore, loadingMore, offset, searchQuery]);

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-6">
            {Array.from({ length: 20 }).map((_, index) => (
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
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold text-gray-900 mb-4">Pokédex</h1>
          <p className="text-lg text-gray-600 mb-6">
            Discover and explore the world of Pokémon
          </p>

          {/* Search Bar */}
          <div className="w-full justify-center flex space-x-3 mx-auto relative">
            <div className="relative w-md">
              <input
                type="text"
                placeholder="Search Pokémon by name..."
                value={searchQuery}
                onChange={handleSearchChange}
                className="w-full pl-10 pr-10 text-gray-700 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
              />
              <svg
                className="absolute left-3 top-3.5 h-5 w-5 text-gray-400"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
                />
              </svg>
              {searchQuery && (
                <button
                  onClick={clearSearch}
                  className="absolute right-3 top-3.5 text-gray-400 hover:text-gray-600"
                >
                  <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M6 18L18 6M6 6l12 12"
                    />
                  </svg>
                </button>
              )}
            </div>
            <button onClick={() => debouncedSearch(searchQuery)} className='py-1 rounded-lg cursor-pointer px-3 text-white bg-blue-500 hover:bg-blue-600 font-semibold'>
              Search
            </button>
          </div>
        </div>

        {/* Pokemon Grid */}
        {filteredPokemon.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-6">
            {filteredPokemon.map((poke, index) => (
              <div
                key={`${poke.name}-${index}`}
                ref={index === filteredPokemon.length - 1 ? lastPokemonElementRef : null}
              >
                <PokemonCard pokemon={poke} />
              </div>
            ))}
          </div>
        ) : (
          <NoSearchResults query={searchQuery} />
        )}

        {/* Loading More Indicator */}
        {loadingMore && !searchQuery && (
          <div className="mt-8">
            <LoadingSpinner text="Loading more Pokémon..." />
          </div>
        )}

        {/* End of results message */}
        {!hasMore && !searchQuery && filteredPokemon.length > 0 && (
          <div className="text-center mt-8 py-4">
            <p className="text-gray-500">You've seen all the Pokémon!</p>
          </div>
        )}
      </div>
    </div>
  );
}
