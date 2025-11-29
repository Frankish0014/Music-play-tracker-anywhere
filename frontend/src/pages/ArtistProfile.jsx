import { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { artistsAPI, analyticsAPI } from '../services/api';

export default function ArtistProfile() {
  const { id } = useParams();
  const [artist, setArtist] = useState(null);
  const [analytics, setAnalytics] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchArtist();
  }, [id]);

  const fetchArtist = async () => {
    try {
      const [artistRes, analyticsRes] = await Promise.all([
        artistsAPI.getById(id),
        analyticsAPI.getArtistAnalytics(id, {
          start_date: new Date(Date.now() - 90 * 24 * 60 * 60 * 1000).toISOString(),
        }),
      ]);
      setArtist(artistRes.data.artist);
      setAnalytics(analyticsRes.data.analytics);
    } catch (error) {
      console.error('Error fetching artist:', error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <div className="animate-spin rounded-full h-16 w-16 border-4 border-rwanda-blue border-t-transparent mx-auto"></div>
          <p className="mt-6 text-lg font-medium text-gray-600">Loading artist profile...</p>
        </div>
      </div>
    );
  }

  if (!artist) {
    return (
      <div className="card p-12 text-center animate-slide-up">
        <div className="text-6xl mb-4">👤</div>
        <p className="text-xl font-semibold text-gray-700">Artist not found</p>
      </div>
    );
  }

  return (
    <div className="space-y-6 animate-fade-in">
      <div className="card p-8 animate-slide-up">
        <div className="flex items-start space-x-6">
          <div className="w-24 h-24 rounded-full bg-gradient-to-br from-rwanda-blue to-blue-600 flex items-center justify-center text-white text-4xl font-bold">
            {artist.name?.charAt(0) || 'A'}
          </div>
          <div className="flex-1">
            <h1 className="text-4xl font-bold gradient-text mb-3">{artist.name}</h1>
            {artist.bio && <p className="text-lg text-gray-600 mb-4">{artist.bio}</p>}
            {artist.genre && (
              <span className="inline-block px-4 py-2 text-sm font-semibold bg-gradient-to-r from-rwanda-blue to-blue-600 text-white rounded-full shadow-md">
                {artist.genre}
              </span>
            )}
          </div>
        </div>
      </div>

      {analytics && analytics.length > 0 && (
        <div className="card p-6 animate-slide-up" style={{ animationDelay: '0.1s' }}>
          <h2 className="text-xl font-bold text-gray-900 mb-6 flex items-center">
            <span className="mr-2">📈</span>
            Performance Stats
          </h2>
          <div className="grid grid-cols-3 gap-6">
            <div className="text-center p-4 bg-gradient-to-br from-blue-50 to-blue-100 rounded-xl">
              <div className="text-sm font-medium text-gray-600 mb-2">Total Plays (90d)</div>
              <div className="text-3xl font-bold gradient-text">
                {analytics.reduce((sum, day) => sum + parseInt(day.daily_plays || 0), 0).toLocaleString()}
              </div>
            </div>
            <div className="text-center p-4 bg-gradient-to-br from-purple-50 to-pink-100 rounded-xl">
              <div className="text-sm font-medium text-gray-600 mb-2">Unique Venues</div>
              <div className="text-3xl font-bold gradient-text">{analytics[0]?.unique_venues || 0}</div>
            </div>
            <div className="text-center p-4 bg-gradient-to-br from-yellow-50 to-orange-100 rounded-xl">
              <div className="text-sm font-medium text-gray-600 mb-2">Songs Played</div>
              <div className="text-3xl font-bold gradient-text">{analytics[0]?.songs_played || 0}</div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

