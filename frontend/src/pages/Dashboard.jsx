import { useEffect, useState } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { analyticsAPI } from '../services/api';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';

export default function Dashboard() {
  const { user } = useAuth();
  const [topSongs, setTopSongs] = useState([]);
  const [topArtists, setTopArtists] = useState([]);
  const [loading, setLoading] = useState(true);

  console.log('Dashboard component rendering, user:', user);

  useEffect(() => {
    console.log('Dashboard useEffect running');
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      const [songsRes, artistsRes] = await Promise.all([
        analyticsAPI.getTopSongs({ period: '7d', limit: 10 }),
        analyticsAPI.getTopArtists({ period: '7d', limit: 10 }),
      ]);
      console.log('Songs response:', songsRes);
      console.log('Artists response:', artistsRes);
      
      // Handle nested response structure
      const songs = songsRes.data.data?.songs || songsRes.data.songs || [];
      const artists = artistsRes.data.data?.artists || artistsRes.data.artists || [];
      
      setTopSongs(songs);
      setTopArtists(artists);
    } catch (error) {
      console.error('Error fetching data:', error);
      // Set empty arrays on error so the page still renders
      setTopSongs([]);
      setTopArtists([]);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <div className="animate-spin rounded-full h-16 w-16 border-4 border-rwanda-blue border-t-transparent mx-auto"></div>
          <p className="mt-6 text-lg font-medium text-gray-600">Loading dashboard...</p>
        </div>
      </div>
    );
  }

  console.log('Dashboard rendering with:', { user, topSongs: topSongs.length, topArtists: topArtists.length, loading });

  return (
    <div className="space-y-6 animate-fade-in">
      <div className="animate-slide-up">
        <h1 className="text-4xl font-bold gradient-text mb-2">Dashboard</h1>
        <p className="text-lg text-gray-600">Welcome back, <span className="font-semibold text-gray-900">{user?.name || user?.email || 'User'}</span>! 👋</p>
      </div>

      <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3 animate-slide-up" style={{ animationDelay: '0.1s' }}>
        <div className="card overflow-hidden">
          <div className="p-6">
            <div className="flex items-center">
              <div className="flex-shrink-0 w-12 h-12 bg-gradient-to-br from-rwanda-blue to-blue-600 rounded-lg flex items-center justify-center text-2xl">
                🎵
              </div>
              <div className="ml-5 flex-1">
                <dl>
                  <dt className="text-sm font-medium text-gray-500 truncate">Total Plays (7d)</dt>
                  <dd className="text-2xl font-bold text-gray-900 mt-1">
                    {topSongs.reduce((sum, song) => sum + parseInt(song.play_count || 0), 0).toLocaleString()}
                  </dd>
                </dl>
              </div>
            </div>
          </div>
        </div>

        <div className="card overflow-hidden">
          <div className="p-6">
            <div className="flex items-center">
              <div className="flex-shrink-0 w-12 h-12 bg-gradient-to-br from-purple-400 to-pink-500 rounded-lg flex items-center justify-center text-2xl">
                🎤
              </div>
              <div className="ml-5 flex-1">
                <dl>
                  <dt className="text-sm font-medium text-gray-500 truncate">Active Artists</dt>
                  <dd className="text-2xl font-bold text-gray-900 mt-1">{topArtists.length}</dd>
                </dl>
              </div>
            </div>
          </div>
        </div>

        <div className="card overflow-hidden">
          <div className="p-6">
            <div className="flex items-center">
              <div className="flex-shrink-0 w-12 h-12 bg-gradient-to-br from-yellow-400 to-orange-500 rounded-lg flex items-center justify-center text-2xl">
                📊
              </div>
              <div className="ml-5 flex-1">
                <dl>
                  <dt className="text-sm font-medium text-gray-500 truncate">Top Songs</dt>
                  <dd className="text-2xl font-bold text-gray-900 mt-1">{topSongs.length}</dd>
                </dl>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 gap-6 lg:grid-cols-2 animate-slide-up" style={{ animationDelay: '0.2s' }}>
        <div className="card p-6">
          <h2 className="text-xl font-bold text-gray-900 mb-6 flex items-center">
            <span className="mr-2">📈</span>
            Top Songs (7 days)
          </h2>
          {topSongs.length > 0 ? (
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={topSongs.slice(0, 5)}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="title" angle={-45} textAnchor="end" height={80} />
                <YAxis />
                <Tooltip />
                <Bar dataKey="play_count" fill="#00A3E0" />
              </BarChart>
            </ResponsiveContainer>
          ) : (
            <div className="text-center py-12 text-gray-500">No data available</div>
          )}
        </div>

        <div className="card p-6">
          <h2 className="text-xl font-bold text-gray-900 mb-6 flex items-center">
            <span className="mr-2">🎤</span>
            Top Artists (7 days)
          </h2>
          {topArtists.length > 0 ? (
            <div className="space-y-3">
              {topArtists.slice(0, 5).map((artist, index) => (
                <div key={artist.artist_id || index} className="flex items-center justify-between p-3 rounded-lg hover:bg-gray-50 transition-colors duration-200">
                  <div className="flex items-center">
                    <div className="w-8 h-8 rounded-full bg-gradient-to-br from-rwanda-blue to-blue-600 flex items-center justify-center text-white font-bold text-sm mr-3">
                      {index + 1}
                    </div>
                    <span className="font-semibold text-gray-900">{artist.name}</span>
                  </div>
                  <span className="text-sm font-medium text-rwanda-blue bg-blue-50 px-3 py-1 rounded-full">{(artist.total_plays || 0).toLocaleString()} plays</span>
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-12 text-gray-500">No data available</div>
          )}
        </div>
      </div>
    </div>
  );
}

