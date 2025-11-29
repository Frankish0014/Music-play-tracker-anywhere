import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet, Alert, ScrollView } from 'react-native';
import { useAuth } from '../contexts/AuthContext';

export default function ProfileScreen() {
  const { user, logout } = useAuth();

  const handleLogout = () => {
    Alert.alert(
      'Logout',
      'Are you sure you want to logout?',
      [
        { text: 'Cancel', style: 'cancel' },
        { text: 'Logout', onPress: logout, style: 'destructive' },
      ]
    );
  };

  return (
    <ScrollView style={styles.container}>
      <View style={styles.profileCard}>
        <View style={styles.avatar}>
          <Text style={styles.avatarText}>
            {(user?.name || user?.email || 'U').charAt(0).toUpperCase()}
          </Text>
        </View>
        <Text style={styles.profileName}>{user?.name || 'User'}</Text>
        <Text style={styles.profileEmail}>{user?.email}</Text>
        <View style={styles.roleBadge}>
          <Text style={styles.roleText}>{user?.role || 'resident'}</Text>
        </View>
      </View>

      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Settings</Text>
        <TouchableOpacity style={styles.settingItem} activeOpacity={0.7}>
          <View style={styles.settingLeft}>
            <Text style={styles.settingEmoji}>🎵</Text>
            <Text style={styles.settingText}>Background Tracking</Text>
          </View>
          <View style={styles.statusBadge}>
            <View style={styles.statusDot} />
            <Text style={styles.settingValue}>Active</Text>
          </View>
        </TouchableOpacity>
        <TouchableOpacity style={styles.settingItem} activeOpacity={0.7}>
          <View style={styles.settingLeft}>
            <Text style={styles.settingEmoji}>🔄</Text>
            <Text style={styles.settingText}>Sync Frequency</Text>
          </View>
          <Text style={styles.settingValue}>Every 1 hour</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.settingItem} activeOpacity={0.7}>
          <View style={styles.settingLeft}>
            <Text style={styles.settingEmoji}>🔋</Text>
            <Text style={styles.settingText}>Battery Mode</Text>
          </View>
          <Text style={styles.settingValue}>Normal</Text>
        </TouchableOpacity>
      </View>

      <View style={styles.section}>
        <Text style={styles.sectionTitle}>About</Text>
        <TouchableOpacity style={styles.settingItem} activeOpacity={0.7}>
          <View style={styles.settingLeft}>
            <Text style={styles.settingEmoji}>📱</Text>
            <Text style={styles.settingText}>App Version</Text>
          </View>
          <Text style={styles.settingValue}>1.0.0</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.settingItem} activeOpacity={0.7}>
          <View style={styles.settingLeft}>
            <Text style={styles.settingEmoji}>ℹ️</Text>
            <Text style={styles.settingText}>Help & Support</Text>
          </View>
        </TouchableOpacity>
      </View>

      <TouchableOpacity
        style={styles.logoutButton}
        onPress={handleLogout}
        activeOpacity={0.8}
      >
        <Text style={styles.logoutText}>Logout</Text>
      </TouchableOpacity>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f8fafc',
  },
  profileCard: {
    backgroundColor: '#fff',
    padding: 32,
    marginBottom: 16,
    alignItems: 'center',
    borderBottomWidth: 1,
    borderBottomColor: '#e2e8f0',
  },
  avatar: {
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: '#00A3E0',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 16,
  },
  avatarText: {
    fontSize: 32,
    fontWeight: '700',
    color: '#fff',
  },
  profileName: {
    fontSize: 24,
    fontWeight: '700',
    color: '#1e293b',
    marginBottom: 4,
  },
  profileEmail: {
    fontSize: 16,
    color: '#64748b',
    marginBottom: 12,
  },
  roleBadge: {
    backgroundColor: '#f0f9ff',
    paddingHorizontal: 16,
    paddingVertical: 6,
    borderRadius: 20,
  },
  roleText: {
    fontSize: 14,
    fontWeight: '600',
    color: '#00A3E0',
    textTransform: 'capitalize',
  },
  section: {
    backgroundColor: '#fff',
    marginBottom: 16,
    padding: 20,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: '#1e293b',
    marginBottom: 16,
  },
  settingItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#f1f5f9',
  },
  settingLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  settingEmoji: {
    fontSize: 20,
    marginRight: 12,
  },
  settingText: {
    fontSize: 16,
    color: '#1e293b',
    fontWeight: '500',
  },
  settingValue: {
    fontSize: 15,
    color: '#00A3E0',
    fontWeight: '600',
  },
  statusBadge: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  statusDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: '#22c55e',
    marginRight: 6,
  },
  logoutButton: {
    backgroundColor: '#ef4444',
    padding: 18,
    borderRadius: 12,
    alignItems: 'center',
    margin: 16,
    marginTop: 8,
    shadowColor: '#ef4444',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 4,
  },
  logoutText: {
    color: '#fff',
    fontSize: 18,
    fontWeight: '700',
    letterSpacing: 0.5,
  },
});

