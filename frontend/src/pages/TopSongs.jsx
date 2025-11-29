import { useEffect, useState } from 'react';
import { analyticsAPI } from '../services/api';

export default function TopSongs() {
  const [songs, setSongs] = useState([]);
  const [period, setPeriod] = useState('7d');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchTopSongs();
  }, [period]);

  const fetchTopSongs = async () => {
    setLoading(true);
    try {
      const response = await analyticsAPI.getTopSongs({ period, limit: 50 });
      console.log('TopSongs - Response:', response);
      // Handle nested response structure
      const songs = response.data.data?.songs || response.data.songs || [];
      console.log('TopSongs - Extracted songs:', songs);
      setSongs(songs);
    } catch (error) {
      console.error('Error fetching top songs:', error);
      setSongs([]); // Set empty array on error
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-6 animate-fade-in">
      <div className="flex justify-between items-center animate-slide-up">
        <div>
          <h1 className="text-4xl font-bold gradient-text mb-2">Top Songs</h1>
          <p className="text-gray-600">Discover the most played songs</p>
        </div>
        <select
          value={period}
          onChange={(e) => setPeriod(e.target.value)}
          className="input-modern w-auto min-w-[150px]"
        >
          <option value="1d">Today</option>
          <option value="7d">This Week</option>
          <option value="30d">This Month</option>
          <option value="90d">Last 3 Months</option>
          <option value="all">All Time</option>
        </select>
      </div>

      {loading ? (
        <div className="text-center py-16 animate-slide-up">
          <div className="animate-spin rounded-full h-16 w-16 border-4 border-rwanda-blue border-t-transparent mx-auto"></div>
          <p className="mt-6 text-lg font-medium text-gray-600">Loading top songs...</p>
        </div>
      ) : songs.length > 0 ? (
        <div className="card overflow-hidden animate-slide-up" style={{ animationDelay: '0.1s' }}>
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gradient-to-r from-rwanda-blue to-blue-600">
              <tr>
                <th className="px-6 py-4 text-left text-xs font-bold text-white uppercase tracking-wider">
                  Rank
                </th>
                <th className="px-6 py-4 text-left text-xs font-bold text-white uppercase tracking-wider">
                  Song
                </th>
                <th className="px-6 py-4 text-left text-xs font-bold text-white uppercase tracking-wider">
                  Artist
                </th>
                <th className="px-6 py-4 text-left text-xs font-bold text-white uppercase tracking-wider">
                  Plays
                </th>
                <th className="px-6 py-4 text-left text-xs font-bold text-white uppercase tracking-wider">
                  Venues
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {songs.map((song, index) => (
                <tr key={song.song_id || index} className="hover:bg-blue-50/50 transition-colors duration-150">
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-rwanda-blue to-blue-600 flex items-center justify-center text-white font-bold text-sm">
                      {index + 1}
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm font-bold text-gray-900">{song.title || 'Unknown Title'}</div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm text-gray-600">{song.artist_name || 'Unknown Artist'}</div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm font-semibold text-rwanda-blue">{(song.play_count || 0).toLocaleString()}</div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm text-gray-500">{song.unique_venues || 0}</div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      ) : (
        <div className="card p-12 text-center animate-slide-up">
          <div className="text-6xl mb-4">🎵</div>
          <p className="text-gray-700 text-xl font-semibold">No songs data available yet.</p>
          <p className="text-gray-500 text-sm mt-2">Songs will appear here as they are tracked across Rwanda.</p>
        </div>
      )}
    </div>
  );
}

