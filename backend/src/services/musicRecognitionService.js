import axios from 'axios';
import crypto from 'crypto';

// AcoustID API integration
export async function identifySongWithAcoustID(audioFingerprint, duration) {
  const apiKey = process.env.ACOUSTID_API_KEY;
  
  if (!apiKey) {
    throw new Error('AcoustID API key not configured');
  }

  try {
    const response = await axios.post('https://api.acoustid.org/v2/lookup', null, {
      params: {
        client: apiKey,
        fingerprint: audioFingerprint,
        duration: duration,
        meta: 'recordings+releasegroups+releases',
      },
    });

    if (response.data.status === 'ok' && response.data.results.length > 0) {
      const bestMatch = response.data.results[0];
      if (bestMatch.score > 0.5) {
        return {
          success: true,
          song_id: bestMatch.id,
          title: bestMatch.recordings?.[0]?.title,
          artist: bestMatch.recordings?.[0]?.artists?.[0]?.name,
          confidence: bestMatch.score * 100,
          metadata: bestMatch,
        };
      }
    }

    return { success: false, confidence: 0 };
  } catch (error) {
    console.error('AcoustID API error:', error);
    throw error;
  }
}

// Audd.io API integration (alternative)
export async function identifySongWithAudd(audioFile) {
  const apiKey = process.env.AUDD_API_KEY;
  
  if (!apiKey) {
    throw new Error('Audd API key not configured');
  }

  try {
    const formData = new FormData();
    formData.append('file', audioFile);
    formData.append('api_token', apiKey);
    formData.append('return', 'spotify,apple_music,deezer');

    const response = await axios.post('https://api.audd.io/', formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });

    if (response.data.status === 'success' && response.data.result) {
      return {
        success: true,
        title: response.data.result.title,
        artist: response.data.result.artist,
        album: response.data.result.album,
        confidence: response.data.result.score * 100,
        metadata: response.data.result,
      };
    }

    return { success: false, confidence: 0 };
  } catch (error) {
    console.error('Audd API error:', error);
    throw error;
  }
}

// Generate audio fingerprint (simplified - in production, use proper library)
export function generateFingerprint(audioBuffer) {
  // This is a placeholder - in production, use a proper fingerprinting library
  // like chromaprint or a JavaScript port
  const hash = crypto.createHash('sha256');
  hash.update(audioBuffer);
  return hash.digest('hex');
}

