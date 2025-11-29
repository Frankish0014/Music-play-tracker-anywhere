import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { songsAPI, analyticsAPI } from '../services/api';

export default function PublicPortal() {
  const [topSongs, setTopSongs] = useState([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [searchResults, setSearchResults] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchTopSongs();
  }, []);

  const fetchTopSongs = async () => {
    try {
      const response = await analyticsAPI.getTopSongs({ period: '7d', limit: 20 });
      console.log('PublicPortal - Top songs response:', response);
      // Handle nested response structure
      const songs = response.data.data?.songs || response.data.songs || [];
      console.log('PublicPortal - Extracted songs:', songs);
      setTopSongs(songs);
    } catch (error) {
      console.error('Error fetching top songs:', error);
      setTopSongs([]); // Set empty array on error
    } finally {
      setLoading(false);
    }
  };

  const handleSearch = async (e) => {
    e.preventDefault();
    if (!searchQuery.trim()) return;

    try {
      const response = await songsAPI.getAll({ search: searchQuery });
      console.log('PublicPortal - Search response:', response);
      // Handle nested response structure
      const songs = response.data.data?.songs || response.data.songs || [];
      console.log('PublicPortal - Extracted search results:', songs);
      setSearchResults(songs);
    } catch (error) {
      console.error('Error searching:', error);
      setSearchResults([]); // Set empty array on error
    }
  };

  return (
    <div className="space-y-6 animate-fade-in">
      <div className="text-center animate-slide-up">
        <h1 className="text-5xl font-bold gradient-text mb-3">Rwandan Music Tracker</h1>
        <p className="text-xl text-gray-600">Discover what's playing across Rwanda</p>
      </div>

      <div className="card p-6 animate-slide-up" style={{ animationDelay: '0.1s' }}>
        <form onSubmit={handleSearch} className="flex gap-3">
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search for songs or artists..."
            className="input-modern flex-1"
          />
          <button
            type="submit"
            className="btn-primary"
          >
            Search
          </button>
        </form>

        {searchResults.length > 0 && (
          <div className="mt-6 space-y-2 animate-scale-in">
            <h3 className="font-bold text-gray-900 mb-3">Search Results ({searchResults.length})</h3>
            {searchResults.map((song, index) => (
              <div key={song.song_id || index} className="p-4 border-2 border-gray-200 rounded-lg hover:border-rwanda-blue hover:bg-blue-50/50 transition-all duration-200">
                <Link to={`/artists/${song.artist_id}`} className="text-rwanda-blue hover:text-blue-700 font-medium flex items-center group">
                  <span className="mr-2 group-hover:scale-110 transition-transform">🎵</span>
                  {song.title || 'Unknown Title'} - {song.artist_name || 'Unknown Artist'}
                </Link>
              </div>
            ))}
          </div>
        )}
        {searchQuery && searchResults.length === 0 && !loading && (
          <div className="mt-6 text-center py-8 text-gray-500 bg-gray-50 rounded-lg">
            <p className="text-lg">No results found for "<span className="font-semibold">{searchQuery}</span>"</p>
          </div>
        )}
      </div>

      <div className="card p-6 animate-slide-up" style={{ animationDelay: '0.2s' }}>
        <h2 className="text-2xl font-bold text-gray-900 mb-6 flex items-center">
          <span className="mr-2">🔥</span>
          Top Songs This Week
        </h2>
        {loading ? (
          <div className="text-center py-12">
            <div className="animate-spin rounded-full h-12 w-12 border-4 border-rwanda-blue border-t-transparent mx-auto"></div>
            <p className="mt-4 text-gray-600 font-medium">Loading top songs...</p>
          </div>
        ) : topSongs.length > 0 ? (
          <div className="space-y-3">
            {topSongs.map((song, index) => (
              <div key={song.song_id || index} className="flex items-center justify-between p-4 border-2 border-gray-200 rounded-xl hover:border-rwanda-blue hover:shadow-md transition-all duration-200 group">
                <div className="flex items-center flex-1">
                  <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-rwanda-blue to-blue-600 flex items-center justify-center text-white font-bold mr-4 group-hover:scale-110 transition-transform">
                    {index + 1}
                  </div>
                  <div className="flex-1">
                    <div className="font-bold text-gray-900 group-hover:text-rwanda-blue transition-colors">{song.title || 'Unknown Title'}</div>
                    <div className="text-sm text-gray-600">{song.artist_name || 'Unknown Artist'}</div>
                  </div>
                </div>
                <div className="text-right ml-4">
                  <div className="font-bold text-lg text-rwanda-blue">{(song.play_count || 0).toLocaleString()}</div>
                  <div className="text-xs text-gray-500 font-medium">plays</div>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="text-center py-12 bg-gradient-to-br from-gray-50 to-blue-50 rounded-xl">
            <div className="text-4xl mb-3">🎵</div>
            <p className="text-lg font-semibold text-gray-700">No songs data available yet.</p>
            <p className="text-sm mt-2 text-gray-500">Songs will appear here as they are tracked.</p>
          </div>
        )}
      </div>
    </div>
  );
}

