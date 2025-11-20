import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  ActivityIndicator,
  Alert,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  Image,
} from 'react-native';
import * as ImagePicker from 'expo-image-picker';
import { lightColors, darkColors } from '../theme';
import { useAuth } from '../contexts/AuthContext';
import { useTheme } from '../contexts/ThemeContext';
import { useLanguage } from '../contexts/LanguageContext';

export default function ProfileScreen({ navigation }) {
  const { user, profile, updateUsername, updatePassword, updateProfilePicture, loading } = useAuth();
  const { isDarkMode } = useTheme();
  const { t } = useLanguage();
  const [username, setUsername] = useState(profile?.username || '');
  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [localLoading, setLocalLoading] = useState(false);
  const [selectedImage, setSelectedImage] = useState(profile?.avatar_url || null);

  // Get colors based on theme
  const colors = isDarkMode ? darkColors : lightColors;
  const styles = getStyles(colors);

  // Update local state when profile changes
  useEffect(() => {
    if (profile) {
      setUsername(profile.username || '');
      setSelectedImage(profile.avatar_url || null);
    }
  }, [profile]);

  const handleUpdateUsername = async () => {
    if (!username.trim()) {
      Alert.alert('Error', 'Please enter a username');
      return;
    }

    if (username === profile?.username) {
      Alert.alert('Info', 'Username is the same as current');
      return;
    }

    setLocalLoading(true);
    const { error } = await updateUsername(username);
    setLocalLoading(false);

    if (error) {
      Alert.alert('Error', error.message);
    } else {
      Alert.alert('Success', 'Username updated successfully');
    }
  };

  const handleUpdatePassword = async () => {
    if (!newPassword.trim() || !confirmPassword.trim()) {
      Alert.alert('Error', 'Please fill in all password fields');
      return;
    }

    if (newPassword !== confirmPassword) {
      Alert.alert('Error', 'New passwords do not match');
      return;
    }

    if (newPassword.length < 6) {
      Alert.alert('Error', 'Password must be at least 6 characters');
      return;
    }

    setLocalLoading(true);
    const { error } = await updatePassword(newPassword);
    setLocalLoading(false);

    if (error) {
      Alert.alert('Error', error.message);
    } else {
      Alert.alert('Success', 'Password updated successfully');
      setCurrentPassword('');
      setNewPassword('');
      setConfirmPassword('');
    }
  };

  const pickImage = async () => {
    // Request permission
    const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
    
    if (status !== 'granted') {
      Alert.alert('Permission Required', 'Please grant permission to access your photos');
      return;
    }

    // Launch image picker
    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      aspect: [1, 1],
      quality: 0.8,
    });

    if (!result.canceled && result.assets && result.assets.length > 0) {
      const imageUri = result.assets[0].uri;
      setSelectedImage(imageUri);
      
      // Upload to Supabase would go here
      // For now, just update the local state
      Alert.alert(
        t('imageSelected'), 
        t('profilePictureUploadPending')
      );
      
      // TODO: Implement actual upload to Supabase Storage
      // const { error } = await updateProfilePicture(imageUri);
      // if (error) {
      //   Alert.alert(t('error'), 'Failed to upload profile picture');
      // } else {
      //   Alert.alert(t('success'), 'Profile picture updated!');
      // }
    }
  };

  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      style={styles.container}
    >
      <ScrollView
        contentContainerStyle={styles.scrollContent}
        keyboardShouldPersistTaps="handled"
      >
        <View style={styles.header}>
          <TouchableOpacity
            style={styles.backButton}
            onPress={() => navigation.goBack()}
          >
            <Text style={styles.backButtonText}>← {t('back')}</Text>
          </TouchableOpacity>
          <Text style={styles.title}>{t('profileSettings')}</Text>
        </View>

        <View style={styles.content}>
          {/* User Info Section */}
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>{t('accountInformation')}</Text>
            <View style={styles.infoRow}>
              <Text style={styles.infoLabel}>{t('email')}:</Text>
              <Text style={styles.infoValue}>{user?.email}</Text>
            </View>
          </View>

          {/* Profile Picture Section */}
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>{t('profilePicture')}</Text>
            <View style={styles.profilePictureContainer}>
              {selectedImage ? (
                <Image 
                  source={{ uri: selectedImage }} 
                  style={styles.profilePictureImage}
                />
              ) : (
                <View style={styles.profilePicturePlaceholder}>
                  <Text style={styles.profilePictureInitial}>
                    {username ? username.charAt(0).toUpperCase() : user?.email?.charAt(0).toUpperCase()}
                  </Text>
                </View>
              )}
              <TouchableOpacity style={styles.uploadButton} onPress={pickImage}>
                <Text style={styles.uploadButtonText}>
                  {selectedImage ? t('changePhoto') : t('uploadPhoto')}
                </Text>
              </TouchableOpacity>
            </View>
            <Text style={styles.helperText}>
              {t('clickToSelect')}
            </Text>
          </View>

          {/* Username Section */}
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>{t('username')}</Text>
            <TextInput
              style={styles.input}
              placeholder={t('enterUsername')}
              placeholderTextColor={colors.textSecondary}
              value={username}
              onChangeText={setUsername}
              autoCapitalize="none"
            />
            <TouchableOpacity
              style={[styles.button, styles.primaryButton]}
              onPress={handleUpdateUsername}
              disabled={localLoading || loading}
            >
              {localLoading ? (
                <ActivityIndicator color="#fff" />
              ) : (
                <Text style={styles.buttonText}>{t('updateUsername')}</Text>
              )}
            </TouchableOpacity>
          </View>

          {/* Password Section */}
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>{t('changePassword')}</Text>
            <TextInput
              style={styles.input}
              placeholder={t('newPassword')}
              placeholderTextColor={colors.textSecondary}
              value={newPassword}
              onChangeText={setNewPassword}
              secureTextEntry
              autoCapitalize="none"
            />
            <TextInput
              style={styles.input}
              placeholder={t('confirmNewPassword')}
              placeholderTextColor={colors.textSecondary}
              value={confirmPassword}
              onChangeText={setConfirmPassword}
              secureTextEntry
              autoCapitalize="none"
            />
            <TouchableOpacity
              style={[styles.button, styles.primaryButton]}
              onPress={handleUpdatePassword}
              disabled={localLoading || loading}
            >
              {localLoading ? (
                <ActivityIndicator color="#fff" />
              ) : (
                <Text style={styles.buttonText}>{t('updatePassword')}</Text>
              )}
            </TouchableOpacity>
          </View>
        </View>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}

const getStyles = (colors) => StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
  },
  scrollContent: {
    flexGrow: 1,
  },
  header: {
    padding: 16,
    paddingTop: Platform.OS === 'ios' ? 60 : 40,
    backgroundColor: colors.surface,
    borderBottomWidth: 1,
    borderBottomColor: colors.border,
  },
  backButton: {
    marginBottom: 8,
  },
  backButtonText: {
    color: colors.primary,
    fontSize: 16,
    fontWeight: '500',
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    color: colors.text,
  },
  content: {
    padding: 16,
  },
  section: {
    marginBottom: 32,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: colors.text,
    marginBottom: 16,
  },
  infoRow: {
    flexDirection: 'row',
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: colors.divider,
  },
  infoLabel: {
    fontSize: 16,
    fontWeight: '600',
    color: colors.text,
    marginRight: 12,
    minWidth: 80,
  },
  infoValue: {
    fontSize: 16,
    color: colors.textSecondary,
    flex: 1,
  },
  profilePictureContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
  },
  profilePicturePlaceholder: {
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: colors.primary,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 16,
  },
  profilePictureImage: {
    width: 80,
    height: 80,
    borderRadius: 40,
    marginRight: 16,
  },
  profilePictureInitial: {
    fontSize: 32,
    fontWeight: '700',
    color: '#fff',
  },
  uploadButton: {
    backgroundColor: colors.surface,
    paddingVertical: 12,
    paddingHorizontal: 20,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: colors.border,
  },
  uploadButtonText: {
    color: colors.primary,
    fontSize: 14,
    fontWeight: '600',
  },
  helperText: {
    fontSize: 12,
    color: colors.textTertiary,
    marginTop: 8,
  },
  input: {
    backgroundColor: colors.surface,
    borderWidth: 1,
    borderColor: colors.border,
    borderRadius: 8,
    padding: 16,
    marginBottom: 16,
    fontSize: 16,
    color: colors.text,
  },
  button: {
    borderRadius: 8,
    padding: 16,
    alignItems: 'center',
  },
  primaryButton: {
    backgroundColor: colors.primary,
  },
  buttonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
  },
});
