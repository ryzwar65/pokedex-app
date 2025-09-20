'use client';

import { useState, useEffect, useCallback, useRef } from 'react';
import { fetchPokemonList, getFavoritePokemon, insertGroupPokemon, searchPokemon } from '@/lib/api';
import { debounce, addGroup } from '@/lib/utils';
import PokemonCard from '@/components/PokemonCard';
import LoadingSpinner, { PokemonCardSkeleton } from '@/components/LoadingSpinner';
import { NoSearchResults } from '@/components/NoData';

export default function CreateGroupPage() {
  const [pokemon, setPokemon] = useState([]);
  const [filteredPokemon, setFilteredPokemon] = useState([]);
  const [selectedPokemon, setSelectedPokemon] = useState([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [groupName, setGroupName] = useState('');
  const [loading, setLoading] = useState(true);
  const [loadingMore, setLoadingMore] = useState(false);
  const [hasMore, setHasMore] = useState(true);
  const [offset, setOffset] = useState(0);
  const [isCreatingGroup, setIsCreatingGroup] = useState(false);
  const [groupCreated, setGroupCreated] = useState(false);
  const observerRef = useRef();
  const lastPokemonElementRef = useRef();

  const ITEMS_PER_PAGE = 20;

  useEffect(() => {
    loadPokemon(0, true);
  }, []);

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

  const debouncedSearch = useCallback(
    debounce(async (query) => {
      if (!query.trim()) {
        let sorted = [...pokemon].sort(
          (a, b) => (b.isSelected ? 1 : 0) - (a.isSelected ? 1 : 0)
        );

        setFilteredPokemon(sorted);
        return;
      }

      try {
        const results = await searchPokemon(query);
        setFilteredPokemon((prev) => {
          const keepSelected = prev.filter((p) => p.isSelected);
          const merged = [...results, ...keepSelected];
          const unique = merged.filter(
            (v, i, self) => i === self.findIndex((p) => p.name === v.name)
          );
          return unique.sort((a, b) => {
            if (a.isSelected === b.isSelected) return 0;
            return a.isSelected ? -1 : 1;
          });
        });
      } catch (error) {
        console.error('Error searching Pokemon:', error);
        setFilteredPokemon([]);
      }
    }, 300),
    [pokemon]
  );

  const handleSearchChange = (e) => {
    const query = e.target.value;
    setSearchQuery(query);
  };

  const handlePokemonSelection = (pokemon, isSelected) => {
    if (isSelected) {
      setSelectedPokemon(prev => [...prev, pokemon]);
      setPokemon(prev =>
        [...prev]
          .map(p =>
            p.name === pokemon.name ? { ...p, isSelected: isSelected } : p
          )
          .sort((a, b) => (b.isSelected ? 1 : 0) - (a.isSelected ? 1 : 0))
      );
      
    } else {
      setSelectedPokemon(prev => prev.filter(data => data.name !== pokemon?.name));
      setPokemon(prev =>
        [...prev]
          .map(p =>
            p.name === pokemon.name ? { ...p, isSelected: false } : p
          )
          .sort((a, b) => (b.isSelected ? 1 : 0) - (a.isSelected ? 1 : 0))
      );
    }
    setFilteredPokemon(prev => {
      let updated = prev.map(p =>
        p.name === pokemon.name ? { ...p, isSelected } : p
      );

      if (isSelected) {
        const exists = updated.some(p => p.name === pokemon.name);
        if (!exists) {
          updated = [...updated, { ...pokemon, isSelected: true }];
        }
      } else {
        // updated = [...updated, { ...pokemon, isSelected: false }];
        //  updated = updated.filter(p => p.name !== pokemon.name);
      }
      updated = updated.sort((a, b) => {
        if (a.isSelected === b.isSelected) return 0;
        return a.isSelected ? -1 : 1;
      });
      return updated;
    });
  };

  const handleCreateGroup = async () => {
    if (!groupName.trim() || selectedPokemon.length === 0) {
      return;
    }

    setIsCreatingGroup(true);

    try {
      let payload = {
        name : groupName,
        pokemons: selectedPokemon
      }
      await insertGroupPokemon(payload)
      const group = {
        name: groupName.trim(),
        pokemonNames: selectedPokemon
      };

      addGroup(group);
      setGroupCreated(true);

      setTimeout(() => {
        setGroupName('');
        setSelectedPokemon([]);
        setGroupCreated(false);
      }, 3000);
      window.location.href = "/list-group"
    } catch (error) {
      console.error('Error creating group:', error);
      alert('Failed to create group. Please try again.');
    } finally {
      setIsCreatingGroup(false);
    }
  };

  const clearSearch = () => {
    setSearchQuery('');
    let sorted = [...pokemon].sort(
      (a, b) => (b.isSelected ? 1 : 0) - (a.isSelected ? 1 : 0)
    );

    setFilteredPokemon(sorted);
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

  const isFormValid = groupName.trim() && selectedPokemon.length > 0;

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="text-center mb-8">
            <h1 className="text-4xl font-bold text-gray-900 mb-4">Create Pokémon Group</h1>
            <p className="text-lg text-gray-600">Select Pokémon to create your custom group</p>
          </div>
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
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold text-gray-900 mb-4">Create Pokémon Group</h1>
          <p className="text-lg text-gray-600 mb-6">Select multiple Pokémon to create your custom group</p>
        </div>

        <div className="bg-white rounded-lg shadow-lg p-6 mb-8">
          <div className="flex flex-col md:flex-row gap-4 items-end">
            <div className="flex-1">
              <label htmlFor="groupName" className="block text-sm font-medium text-gray-700 mb-2">
                Group Name *
              </label>
              <input
                type="text"
                id="groupName"
                value={groupName}
                onChange={(e) => setGroupName(e.target.value)}
                placeholder="Enter group name..."
                className="w-full text-gray-700 px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                maxLength={50}
              />
            </div>

            <div className="flex items-center space-x-4">
              <div className="text-center">
                <p className="text-sm text-gray-600">Selected</p>
                <p className="text-2xl font-bold text-blue-600">{selectedPokemon.length}</p>
              </div>

              <button
                onClick={handleCreateGroup}
                disabled={!isFormValid || isCreatingGroup}
                className={`px-6 py-2 rounded-lg font-medium transition-all ${
                  isFormValid && !isCreatingGroup
                    ? 'bg-green-500 text-white hover:bg-green-600'
                    : 'bg-gray-300 text-gray-500 cursor-not-allowed'
                }`}
              >
                {isCreatingGroup ? 'Creating...' : 'Create Group'}
              </button>
            </div>
          </div>

          {groupCreated && (
            <div className="mt-4 p-3 bg-green-100 border border-green-400 text-green-700 rounded-lg">
              ✅ Group created successfully!
            </div>
          )}

          <div className="mt-6">
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
        </div>

        {filteredPokemon.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-6">
            {filteredPokemon.map((poke, index) => {
              
              const isSelected = selectedPokemon.find(v => v?.name == poke.name) ? true : false;

              return (
                <div key={`${poke.name}-${index}`}
                  ref={index === filteredPokemon.length - 1 ? lastPokemonElementRef : null}>
                  <PokemonCard 
                    pokemon={poke}
                    showCheckbox={true}
                    isSelected={isSelected}
                    onSelectionChange={handlePokemonSelection}
                  />
                </div>
              );
            })}
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

        {selectedPokemon.length > 0 && (
          <div className="fixed bottom-6 right-6 bg-white rounded-lg shadow-xl p-4 border border-gray-200">
            <div className="flex items-center space-x-3">
              <div className="w-8 h-8 bg-blue-500 text-white rounded-full flex items-center justify-center font-bold">
                {selectedPokemon.length}
              </div>
              <span className="text-sm text-gray-700">
                Pokémon selected for group
              </span>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
