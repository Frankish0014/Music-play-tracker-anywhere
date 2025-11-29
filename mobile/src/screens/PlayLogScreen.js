import React, { useState } from 'react';
import { View, Text, StyleSheet, FlatList, RefreshControl } from 'react-native';

export default function PlayLogScreen() {
  const [refreshing, setRefreshing] = useState(false);
  // In production, this would fetch from local storage or API
  const plays = [];

  const onRefresh = async () => {
    setRefreshing(true);
    // Simulate API call
    setTimeout(() => {
      setRefreshing(false);
    }, 1000);
  };

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>Play History</Text>
        <Text style={styles.subtitle}>All detected music plays</Text>
      </View>
      {plays.length === 0 ? (
        <View style={styles.empty}>
          <Text style={styles.emptyEmoji}>🎵</Text>
          <Text style={styles.emptyText}>No plays recorded yet</Text>
          <Text style={styles.emptySubtext}>
            Plays will appear here as they are detected by the background service
          </Text>
        </View>
      ) : (
        <FlatList
          data={plays}
          keyExtractor={(item) => item.id}
          renderItem={({ item }) => (
            <View style={styles.playItem}>
              <View style={styles.playIcon}>
                <Text style={styles.playIconText}>🎶</Text>
              </View>
              <View style={styles.playContent}>
                <Text style={styles.playTitle}>{item.song}</Text>
                <Text style={styles.playArtist}>{item.artist}</Text>
                <Text style={styles.playTime}>{item.timestamp}</Text>
              </View>
            </View>
          )}
          refreshControl={
            <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
          }
          contentContainerStyle={styles.listContent}
        />
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f8fafc',
  },
  header: {
    backgroundColor: '#fff',
    padding: 24,
    paddingBottom: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#e2e8f0',
  },
  title: {
    fontSize: 28,
    fontWeight: '700',
    color: '#1e293b',
    marginBottom: 4,
  },
  subtitle: {
    fontSize: 14,
    color: '#64748b',
  },
  empty: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 32,
  },
  emptyEmoji: {
    fontSize: 64,
    marginBottom: 16,
  },
  emptyText: {
    fontSize: 20,
    fontWeight: '600',
    color: '#1e293b',
    marginBottom: 8,
    textAlign: 'center',
  },
  emptySubtext: {
    fontSize: 15,
    color: '#64748b',
    textAlign: 'center',
    lineHeight: 22,
  },
  listContent: {
    padding: 16,
  },
  playItem: {
    backgroundColor: '#fff',
    padding: 16,
    marginBottom: 12,
    borderRadius: 16,
    flexDirection: 'row',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 3,
  },
  playIcon: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: '#f0f9ff',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 16,
  },
  playIconText: {
    fontSize: 24,
  },
  playContent: {
    flex: 1,
  },
  playTitle: {
    fontSize: 17,
    fontWeight: '700',
    color: '#1e293b',
    marginBottom: 4,
  },
  playArtist: {
    fontSize: 15,
    color: '#64748b',
    marginBottom: 4,
  },
  playTime: {
    fontSize: 13,
    color: '#94a3b8',
  },
});

