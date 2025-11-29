import { useEffect, useState } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { analyticsAPI, artistsAPI } from '../services/api';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';

export default function ArtistDashboard() {
  const { user } = useAuth();
  const [artist, setArtist] = useState(null);
  const [analytics, setAnalytics] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchArtistData();
  }, []);

  const fetchArtistData = async () => {
    try {
      // Get artist profile
      const artistsRes = await artistsAPI.getAll({ search: user?.name });
      if (artistsRes.data.artists.length > 0) {
        const artistData = artistsRes.data.artists[0];
        setArtist(artistData);

        // Get analytics
        const analyticsRes = await analyticsAPI.getArtistAnalytics(artistData.artist_id, {
          start_date: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000).toISOString(),
        });
        setAnalytics(analyticsRes.data.analytics);
      }
    } catch (error) {
      console.error('Error fetching artist data:', error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <div className="animate-spin rounded-full h-16 w-16 border-4 border-rwanda-blue border-t-transparent mx-auto"></div>
          <p className="mt-6 text-lg font-medium text-gray-600">Loading analytics...</p>
        </div>
      </div>
    );
  }

  if (!artist) {
    return (
      <div className="card p-8 text-center animate-slide-up">
        <div className="text-6xl mb-4">🎤</div>
        <p className="text-xl font-semibold text-gray-700 mb-2">Artist profile not found</p>
        <p className="text-gray-500">Please contact support to set up your artist profile.</p>
      </div>
    );
  }

  const totalPlays = analytics.reduce((sum, day) => sum + parseInt(day.daily_plays || 0), 0);

  return (
    <div className="space-y-6 animate-fade-in">
      <div className="animate-slide-up">
        <h1 className="text-4xl font-bold gradient-text mb-2">My Analytics</h1>
        <p className="text-lg text-gray-600">Track your music performance</p>
      </div>

      <div className="grid grid-cols-1 gap-6 sm:grid-cols-3 animate-slide-up" style={{ animationDelay: '0.1s' }}>
        <div className="card p-6">
          <div className="text-sm font-medium text-gray-500 mb-2">Total Plays (30d)</div>
          <div className="text-3xl font-bold gradient-text">{totalPlays.toLocaleString()}</div>
        </div>
        <div className="card p-6">
          <div className="text-sm font-medium text-gray-500 mb-2">Unique Venues</div>
          <div className="text-3xl font-bold gradient-text">
            {analytics[0]?.unique_venues || 0}
          </div>
        </div>
        <div className="card p-6">
          <div className="text-sm font-medium text-gray-500 mb-2">Songs Played</div>
          <div className="text-3xl font-bold gradient-text">
            {analytics[0]?.songs_played || 0}
          </div>
        </div>
      </div>

      <div className="card p-6 animate-slide-up" style={{ animationDelay: '0.2s' }}>
        <h2 className="text-xl font-bold text-gray-900 mb-6 flex items-center">
          <span className="mr-2">📊</span>
          Daily Plays (Last 30 Days)
        </h2>
        <ResponsiveContainer width="100%" height={300}>
          <LineChart data={analytics}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="date" />
            <YAxis />
            <Tooltip />
            <Line type="monotone" dataKey="daily_plays" stroke="#00A3E0" strokeWidth={2} />
          </LineChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}

