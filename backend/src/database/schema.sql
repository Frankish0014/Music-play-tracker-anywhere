-- Enable TimescaleDB extension (optional - only if TimescaleDB is installed)
DO $$
BEGIN
    CREATE EXTENSION IF NOT EXISTS timescaledb;
EXCEPTION
    WHEN OTHERS THEN
        RAISE NOTICE 'TimescaleDB extension not available, continuing without it';
END $$;

-- Users table
CREATE TABLE IF NOT EXISTS users (
    user_id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    email VARCHAR(255) UNIQUE NOT NULL,
    password_hash VARCHAR(255) NOT NULL,
    role VARCHAR(50) NOT NULL CHECK (role IN ('artist', 'dj', 'venue', 'admin', 'resident')),
    phone VARCHAR(20),
    name VARCHAR(255),
    verified BOOLEAN DEFAULT FALSE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX idx_users_email ON users(email);
CREATE INDEX idx_users_role ON users(role);

-- Artists table
CREATE TABLE IF NOT EXISTS artists (
    artist_id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID REFERENCES users(user_id) ON DELETE CASCADE,
    name VARCHAR(255) NOT NULL,
    bio TEXT,
    genre VARCHAR(100),
    verified BOOLEAN DEFAULT FALSE,
    profile_image_url VARCHAR(500),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX idx_artists_user_id ON artists(user_id);
CREATE INDEX idx_artists_name ON artists(name);

-- Songs table
CREATE TABLE IF NOT EXISTS songs (
    song_id VARCHAR(100) PRIMARY KEY,
    title VARCHAR(255) NOT NULL,
    artist_id UUID REFERENCES artists(artist_id) ON DELETE CASCADE,
    genre VARCHAR(100),
    duration INTEGER, -- in seconds
    release_date DATE,
    fingerprint TEXT, -- AcoustID fingerprint
    metadata JSONB, -- Additional metadata (album, ISRC, etc.)
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX idx_songs_artist_id ON songs(artist_id);
CREATE INDEX idx_songs_title ON songs(title);
CREATE INDEX idx_songs_genre ON songs(genre);
-- GIN index on fingerprint (requires pg_trgm extension for text)
-- Using btree index instead for compatibility
CREATE INDEX idx_songs_fingerprint ON songs(fingerprint);

-- Venues table
CREATE TABLE IF NOT EXISTS venues (
    venue_id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID REFERENCES users(user_id) ON DELETE CASCADE,
    name VARCHAR(255) NOT NULL,
    type VARCHAR(50) CHECK (type IN ('club', 'restaurant', 'bar', 'radio', 'event', 'other')),
    location_lat DECIMAL(10, 8),
    location_lng DECIMAL(11, 8),
    address TEXT,
    verified BOOLEAN DEFAULT FALSE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX idx_venues_user_id ON venues(user_id);
-- Spatial index (requires PostGIS extension - optional)
-- Using regular indexes on lat/lng for compatibility
CREATE INDEX idx_venues_location_lat ON venues(location_lat);
CREATE INDEX idx_venues_location_lng ON venues(location_lng);

-- Play Events table (hypertable for TimescaleDB)
CREATE TABLE IF NOT EXISTS play_events (
    event_id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    song_id VARCHAR(100) REFERENCES songs(song_id) ON DELETE CASCADE,
    venue_id UUID REFERENCES venues(venue_id) ON DELETE SET NULL,
    device_id VARCHAR(255), -- For always-on background detection
    timestamp TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT CURRENT_TIMESTAMP,
    source VARCHAR(50) CHECK (source IN ('background_listen', 'manual', 'dj_controller', 'radio', 'streaming')),
    confidence_score DECIMAL(5, 2) CHECK (confidence_score >= 0 AND confidence_score <= 100),
    duration_played INTEGER, -- seconds
    location_lat DECIMAL(10, 8),
    location_lng DECIMAL(11, 8),
    metadata JSONB -- Additional context (phone model, OS version, etc.)
);

-- Convert to hypertable for time-series optimization (only if TimescaleDB is available)
DO $$
BEGIN
    PERFORM create_hypertable('play_events', 'timestamp', if_not_exists => TRUE);
EXCEPTION
    WHEN OTHERS THEN
        RAISE NOTICE 'TimescaleDB not available, using regular table';
END $$;

CREATE INDEX idx_play_events_song_id ON play_events(song_id);
CREATE INDEX idx_play_events_venue_id ON play_events(venue_id);
CREATE INDEX idx_play_events_timestamp ON play_events(timestamp DESC);
CREATE INDEX idx_play_events_device_id ON play_events(device_id);
CREATE INDEX idx_play_events_source ON play_events(source);

-- Payment Records table
CREATE TABLE IF NOT EXISTS payment_records (
    payment_id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    artist_id UUID REFERENCES artists(artist_id) ON DELETE CASCADE,
    period_start DATE NOT NULL,
    period_end DATE NOT NULL,
    total_plays INTEGER NOT NULL DEFAULT 0,
    amount_earned DECIMAL(10, 2) NOT NULL DEFAULT 0,
    rate_per_1000_plays DECIMAL(10, 2) NOT NULL DEFAULT 0,
    status VARCHAR(50) CHECK (status IN ('pending', 'processing', 'paid', 'failed')),
    payment_method VARCHAR(50),
    transaction_id VARCHAR(255),
    paid_date TIMESTAMP WITH TIME ZONE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX idx_payment_records_artist_id ON payment_records(artist_id);
CREATE INDEX idx_payment_records_period ON payment_records(period_start, period_end);
CREATE INDEX idx_payment_records_status ON payment_records(status);

-- Device Registry (for fraud prevention)
CREATE TABLE IF NOT EXISTS devices (
    device_id VARCHAR(255) PRIMARY KEY,
    user_id UUID REFERENCES users(user_id) ON DELETE SET NULL,
    phone_model VARCHAR(255),
    os_version VARCHAR(50),
    app_version VARCHAR(50),
    imei VARCHAR(50),
    fingerprint_hash VARCHAR(255), -- Device fingerprint
    is_verified BOOLEAN DEFAULT FALSE,
    reputation_score INTEGER DEFAULT 100 CHECK (reputation_score >= 0 AND reputation_score <= 100),
    last_seen TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX idx_devices_user_id ON devices(user_id);
CREATE INDEX idx_devices_reputation ON devices(reputation_score);

-- Fraud Flags table
CREATE TABLE IF NOT EXISTS fraud_flags (
    flag_id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    device_id VARCHAR(255) REFERENCES devices(device_id) ON DELETE CASCADE,
    event_id UUID REFERENCES play_events(event_id) ON DELETE CASCADE,
    flag_type VARCHAR(50) NOT NULL,
    severity VARCHAR(20) CHECK (severity IN ('low', 'medium', 'high', 'critical')),
    description TEXT,
    resolved BOOLEAN DEFAULT FALSE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX idx_fraud_flags_device_id ON fraud_flags(device_id);
CREATE INDEX idx_fraud_flags_resolved ON fraud_flags(resolved);

-- Functions and Triggers
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = CURRENT_TIMESTAMP;
    RETURN NEW;
END;
$$ language 'plpgsql';

CREATE TRIGGER update_users_updated_at BEFORE UPDATE ON users
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_artists_updated_at BEFORE UPDATE ON artists
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_songs_updated_at BEFORE UPDATE ON songs
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_venues_updated_at BEFORE UPDATE ON venues
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_payment_records_updated_at BEFORE UPDATE ON payment_records
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

