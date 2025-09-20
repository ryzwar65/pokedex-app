export default function NoData({ 
  title = "No data found", 
  message = "Try adjusting your search or filters", 
  icon = "search",
  action = null 
}) {
  const icons = {
    search: (
      <svg className="w-16 h-16 text-gray-300 mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
      </svg>
    ),
    heart: (
      <svg className="w-16 h-16 text-gray-300 mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
      </svg>
    ),
    folder: (
      <svg className="w-16 h-16 text-gray-300 mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M3 7v10a2 2 0 002 2h14a2 2 0 002-2V9a2 2 0 00-2-2h-6l-2-2H5a2 2 0 00-2 2z" />
      </svg>
    ),
    pokemon: (
      <div className="w-16 h-16 bg-gray-200 rounded-full flex items-center justify-center mb-4">
        <span className="text-2xl text-gray-400">🔍</span>
      </div>
    )
  };

  return (
    <div className="flex flex-col items-center justify-center py-16 px-4">
      {icons[icon]}
      <h3 className="text-xl font-semibold text-gray-700 mb-2">{title}</h3>
      <p className="text-gray-500 text-center mb-6 max-w-md">{message}</p>
      {action}
    </div>
  );
}

export function NoFavoritesFound() {
  return (
    <NoData
      icon="heart"
      title="No favorite Pokémon yet"
      message="Start exploring and add some Pokémon to your favorites!"
      action={
        <button 
          onClick={() => window.location.href = '/'}
          className="px-6 py-3 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors"
        >
          Browse Pokémon
        </button>
      }
    />
  );
}

export function NoSearchResults({ query }) {
  return (
    <NoData
      icon="search"
      title="No Pokémon found"
      message={query ? `No results found for "${query}". Try a different search term.` : "Try searching for a Pokémon name."}
      action={
        <button 
          onClick={() => window.location.reload()}
          className="px-6 py-3 bg-gray-500 text-white rounded-lg hover:bg-gray-600 transition-colors"
        >
          Clear Search
        </button>
      }
    />
  );
}

export function NoGroupsFound() {
  return (
    <NoData
      icon="folder"
      title="No groups created yet"
      message="Create your first Pokémon group to organize your favorites!"
      action={
        <button 
          onClick={() => window.location.href = '/create-group'}
          className="px-6 py-3 bg-green-500 text-white rounded-lg hover:bg-green-600 transition-colors"
        >
          Create Group
        </button>
      }
    />
  );
}