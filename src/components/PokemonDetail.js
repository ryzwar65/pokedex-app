'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { fetchPokemonById, fetchPokemonByName, getPokemonImageUrl } from '@/lib/api';
import { capitalize, getTypeColor, isFavorite, addToFavorites, removeFromFavorites, formatStatsForChart } from '@/lib/utils';
import { PokemonDetailSkeleton } from '@/components/LoadingSpinner';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, RadarChart, PolarGrid, PolarAngleAxis, PolarRadiusAxis, Radar } from 'recharts';

export default function PokemonDetail({ pokemonName }) {
  const router = useRouter();
  const [pokemon, setPokemon] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [favorite, setFavorite] = useState(false);
  const [chartType, setChartType] = useState('bar');

  useEffect(() => {
    if (pokemonName) {
      loadPokemonDetail();
      setFavorite(pokemonName);
    }
  }, [pokemonName]);

  const loadPokemonDetail = async () => {
    setLoading(true);
    setError(null);

    try {
      const data = await fetchPokemonByName(pokemonName);
      console.log("Data ",data)
      setPokemon(data);
    } catch (err) {
      setError('Failed to load Pokémon details');
      console.error('Error loading Pokemon detail:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleFavoriteToggle = () => {
    const id = parseInt(pokemonName);
    if (favorite) {
      removeFromFavorites(id);
    } else {
      addToFavorites(id);
    }
    setFavorite(!favorite);
  };

  if (loading) {
    return <PokemonDetailSkeleton />;
  }

  if (error || !pokemon) {
    return (
      <div className="max-w-4xl mx-auto p-6">
        <div className="text-center py-16">
          <h2 className="text-2xl font-bold text-gray-700 mb-4">Oops! Something went wrong</h2>
          <p className="text-gray-500 mb-6">{error || 'Pokémon not found'}</p>
          <button
            onClick={() => router.push('/')}
            className="px-6 py-3 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors"
          >
            Back to Pokédex
          </button>
        </div>
      </div>
    );
  }

  const statsData = formatStatsForChart(pokemon.stats);
  const abilities = pokemon.abilities.map(ability => ability.name).join(', ');

  return (
    <div className="max-w-6xl mx-auto p-6">
      {/* Back Button */}
      <button
        onClick={() => router.back()}
        className="flex items-center space-x-2 text-blue-600 hover:text-blue-800 mb-6 transition-colors"
      >
        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
        </svg>
        <span>Back to Pokédex</span>
      </button>

      {/* Header Section */}
      <div className="text-center mb-8">
        <div className="flex items-center justify-center space-x-4 mb-4">
          <h1 className="text-4xl font-bold text-gray-900 capitalize">{pokemon.name}</h1>
          <button
            onClick={handleFavoriteToggle}
            className="p-3 rounded-full bg-white shadow-lg hover:shadow-xl transition-all"
          >
            <svg
              className={`w-6 h-6 ${favorite ? 'text-red-500 fill-current' : 'text-gray-400'}`}
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
            >
              <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z" />
            </svg>
          </button>
        </div>
        {/* <p className="text-lg text-gray-600">#{pokemon.id.toString().padStart(3, '0')}</p> */}
      </div>

      {/* Main Content Grid */}
      <div className="grid lg:grid-cols-2 gap-8 mb-8">
        {/* Pokemon Image and Basic Info */}
        <div className="bg-white rounded-xl shadow-lg p-6">
          <div className="text-center mb-6">
            <img
              src={pokemon.image}
              alt={pokemon.name}
              className="w-64 h-64 mx-auto object-contain mb-4"
            />
          </div>

          {/* Types */}
          <div className="flex justify-center gap-2 mb-6">
            {pokemon.types.map((type) => (
              <span
                key={type.name}
                className={`px-4 py-2 rounded-full text-white font-medium ${getTypeColor(type.name)}`}
              >
                {capitalize(type.name)}
              </span>
            ))}
          </div>

          {/* Basic Info */}
          <div className="grid grid-cols-2 gap-4">
            <div className="text-center p-4 bg-gray-50 rounded-lg">
              <p className="text-sm text-gray-600 mb-1">Height</p>
              <p className="text-lg font-semibold text-gray-900">
                {(pokemon.height / 10).toFixed(1)} m
              </p>
            </div>
            <div className="text-center p-4 bg-gray-50 rounded-lg">
              <p className="text-sm text-gray-600 mb-1">Weight</p>
              <p className="text-lg font-semibold text-gray-900">
                {(pokemon.weight / 10).toFixed(1)} kg
              </p>
            </div>
          </div>

          {/* Abilities */}
          <div className="mt-4">
            <h3 className="text-lg font-semibold text-gray-900 mb-2">Abilities</h3>
            <p className="text-gray-700 capitalize">{abilities}</p>
          </div>

          {/* Base Experience */}
          <div className="mt-4">
            <h3 className="text-lg font-semibold text-gray-900 mb-2">Base Experience</h3>
            <p className="text-gray-700">{pokemon.base_experience || 'Unknown'}</p>
          </div>
        </div>

        {/* Stats Chart */}
        <div className="bg-white rounded-xl shadow-lg p-6">
          <div className="flex items-center justify-between mb-6">
            <h3 className="text-xl font-semibold text-gray-900">Base Stats</h3>
            <div className="flex space-x-2">
              <button
                onClick={() => setChartType('bar')}
                className={`px-3 py-1 text-sm rounded-lg transition-colors ${
                  chartType === 'bar'
                    ? 'bg-blue-500 text-white'
                    : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
                }`}
              >
                Bar
              </button>
              <button
                onClick={() => setChartType('radar')}
                className={`px-3 py-1 text-sm rounded-lg transition-colors ${
                  chartType === 'radar'
                    ? 'bg-blue-500 text-white'
                    : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
                }`}
              >
                Radar
              </button>
            </div>
          </div>

          <div className="h-80">
            <ResponsiveContainer width="100%" height="100%">
              {chartType === 'bar' ? (
                <BarChart data={statsData}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis 
                    dataKey="name" 
                    tick={{ fontSize: 12 }}
                    interval={0}
                    angle={-45}
                    textAnchor="end"
                  />
                  <YAxis />
                  <Tooltip 
                    labelFormatter={(value) => `Stat: ${value}`}
                    formatter={(value) => [value, 'Base Stat']}
                  />
                  <Bar 
                    dataKey="value" 
                    fill="#3B82F6" 
                    radius={[4, 4, 0, 0]}
                    name="Base Stat"
                  />
                </BarChart>
              ) : (
                <RadarChart data={statsData}>
                  <PolarGrid />
                  <PolarAngleAxis dataKey="name" tick={{ fontSize: 12 }} />
                  <PolarRadiusAxis
                    angle={90}
                    domain={[0, 150]}
                    tick={{ fontSize: 10 }}
                  />
                  <Radar
                    name="Base Stats"
                    dataKey="value"
                    stroke="#3B82F6"
                    fill="#3B82F6"
                    fillOpacity={0.3}
                    strokeWidth={2}
                  />
                  <Tooltip 
                    formatter={(value, name) => [value, 'Base Stat']}
                    labelFormatter={(value) => `${value}`}
                  />
                </RadarChart>
              )}
            </ResponsiveContainer>
          </div>

          {/* Stats List */}
          <div className="mt-6 space-y-2">
            {pokemon.stats.map((stat) => (
              <div key={stat.name} className="flex justify-between items-center">
                <span className="text-sm text-gray-600 capitalize">
                  {stat.name.replace('-', ' ')}
                </span>
                <span className="font-semibold text-gray-900">{stat.base_stat}</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Additional Info */}
      <div className="bg-white rounded-xl shadow-lg p-6">
        <h3 className="text-xl font-semibold text-gray-900 mb-4">Additional Information</h3>
        <div className="grid md:grid-cols-3 gap-6">
          <div>
            <h4 className="text-lg font-medium text-gray-800 mb-2">Game Indices</h4>
            <div className="text-sm text-gray-600">
              {pokemon.game_indices?.slice(0, 3).map((game) => (
                <p key={game.version.name} className="capitalize">
                  {game.version.name}: #{game.game_index}
                </p>
              )) || 'No game data available'}
            </div>
          </div>
          {/* <div>
            <h4 className="text-lg font-medium text-gray-800 mb-2">Species</h4>
            <p className="text-sm text-gray-600 capitalize">{pokemon.species.name}</p>
          </div> */}
          {/* <div>
            <h4 className="text-lg font-medium text-gray-800 mb-2">Forms</h4>
            <div className="text-sm text-gray-600">
              {pokemon.forms?.map((form) => (
                <p key={form.name} className="capitalize">{form.name}</p>
              )) || 'Default form'}
            </div>
          </div> */}
        </div>
      </div>
    </div>
  );
}
