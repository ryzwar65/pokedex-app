'use client';

import React, { Suspense, useEffect } from 'react';
import { PokemonDetailSkeleton } from '@/components/LoadingSpinner';
import PokemonDetail from '@/components/PokemonDetail';

export default function PokemonDetailPage({ params }) {
  const { name } = React.use(params)
  
  return (
    <div className="min-h-screen bg-gray-50">
      <Suspense fallback={<PokemonDetailSkeleton />}>
        <PokemonDetail pokemonName={name} />
      </Suspense>
    </div>
  );
}