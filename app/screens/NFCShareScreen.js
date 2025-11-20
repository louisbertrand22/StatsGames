import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  ActivityIndicator,
  Alert,
  Platform,
  ScrollView,
} from 'react-native';
import NfcManager, { NfcTech, Ndef } from 'react-native-nfc-manager';
import * as Clipboard from 'expo-clipboard';
import { lightColors, darkColors } from '../theme';
import { useAuth } from '../contexts/AuthContext';
import { useTheme } from '../contexts/ThemeContext';
import { useLanguage } from '../contexts/LanguageContext';
import { createNFCToken, cleanupExpiredTokens } from '../services/nfc';

export default function NFCShareScreen({ navigation, route }) {
  const { user } = useAuth();
  const { isDarkMode } = useTheme();
  const { t } = useLanguage();
  const [nfcSupported, setNfcSupported] = useState(false);
  const [nfcEnabled, setNfcEnabled] = useState(false);
  const [loading, setLoading] = useState(false);
  const [tokenData, setTokenData] = useState(null);
  const [timeRemaining, setTimeRemaining] = useState(null);
  const [isWriting, setIsWriting] = useState(false);

  // Get colors based on theme
  const colors = isDarkMode ? darkColors : lightColors;
  const styles = getStyles(colors);

  useEffect(() => {
    checkNFCAvailability();
    return () => {
      // Cleanup NFC when component unmounts
      if (isWriting) {
        NfcManager.cancelTechnologyRequest().catch(() => {});
      }
    };
  }, []);

  useEffect(() => {
    if (tokenData?.expires_at) {
      const interval = setInterval(() => {
        const now = new Date();
        const expiresAt = new Date(tokenData.expires_at);
        const diff = expiresAt - now;

        if (diff <= 0) {
          setTimeRemaining('Expired');
          setTokenData(null);
          clearInterval(interval);
        } else {
          const minutes = Math.floor(diff / 60000);
          const seconds = Math.floor((diff % 60000) / 1000);
          setTimeRemaining(`${minutes}:${seconds.toString().padStart(2, '0')}`);
        }
      }, 1000);

      return () => clearInterval(interval);
    }
  }, [tokenData]);

  const checkNFCAvailability = async () => {
    try {
      const supported = await NfcManager.isSupported();
      setNfcSupported(supported);

      if (supported) {
        await NfcManager.start();
        const enabled = await NfcManager.isEnabled();
        setNfcEnabled(!!enabled);
      }
    } catch (error) {
      console.error('Error checking NFC availability:', error);
      setNfcSupported(false);
    }
  };

  const handleGenerateToken = async () => {
    if (!user) {
      Alert.alert('Error', 'You must be logged in to share your profile');
      return;
    }

    setLoading(true);
    try {
      // Clean up any expired tokens first
      await cleanupExpiredTokens(user.id);

      // Create new token
      const result = await createNFCToken(user.id, 15);

      if (result.error) {
        Alert.alert('Error', 'Failed to generate token. Please try again.');
        console.error('Token generation error:', result.error);
      } else {
        setTokenData(result);
        Alert.alert(
          'Success',
          nfcSupported && nfcEnabled
            ? 'Token generated! You can now tap your device to another device to share your profile.'
            : 'Token generated! Use the "Copy Link" button to share your profile.'
        );
      }
    } catch (error) {
      Alert.alert('Error', 'An unexpected error occurred');
      console.error('Error generating token:', error);
    } finally {
      setLoading(false);
    }
  };

  const writeNFC = async () => {
    if (!tokenData) {
      Alert.alert('Error', 'Please generate a token first');
      return;
    }

    if (!nfcSupported) {
      Alert.alert('NFC Not Supported', 'Your device does not support NFC');
      return;
    }

    if (!nfcEnabled) {
      Alert.alert('NFC Disabled', 'Please enable NFC in your device settings');
      return;
    }

    setIsWriting(true);
    try {
      // Request NFC technology
      await NfcManager.requestTechnology(NfcTech.Ndef);

      // Create NDEF message with URI record
      const bytes = Ndef.encodeMessage([Ndef.uriRecord(tokenData.url)]);

      if (bytes) {
        await NfcManager.ndefHandler.writeNdefMessage(bytes);
        Alert.alert('Success', 'Profile link written to NFC tag!');
      }
    } catch (error) {
      console.warn('NFC write error:', error);
      if (error.toString().includes('cancelled') || error.toString().includes('canceled')) {
        // User cancelled, no need to show error
      } else {
        Alert.alert('Error', 'Failed to write to NFC tag. Please try again.');
      }
    } finally {
      setIsWriting(false);
      NfcManager.cancelTechnologyRequest().catch(() => {});
    }
  };

  const handleCopyLink = async () => {
    if (!tokenData) {
      Alert.alert('Error', 'Please generate a token first');
      return;
    }

    try {
      await Clipboard.setStringAsync(tokenData.url);
      Alert.alert('Success', 'Link copied to clipboard!');
    } catch (error) {
      Alert.alert('Error', 'Failed to copy link');
      console.error('Clipboard error:', error);
    }
  };

  const handleStartSharing = async () => {
    if (!tokenData) {
      await handleGenerateToken();
    } else if (nfcSupported && nfcEnabled) {
      await writeNFC();
    }
  };

  // Auto-generate token if requested from navigation
  useEffect(() => {
    if (route?.params?.autoGenerate && user && !tokenData && !loading) {
      handleGenerateToken();
    }
  }, [route?.params?.autoGenerate, user, tokenData, loading]);

  return (
    <ScrollView style={styles.container}>
      <View style={styles.content}>
        <View style={styles.header}>
          <TouchableOpacity
            style={styles.backButton}
            onPress={() => navigation.goBack()}
          >
            <Text style={styles.backButtonText}>← {t('back')}</Text>
          </TouchableOpacity>
          <Text style={styles.title}>{t('shareProfileNFC')}</Text>
        </View>

        {!nfcSupported && (
          <View style={styles.warningBox}>
            <Text style={styles.warningText}>
              ⚠️ {t('nfcNotSupported')}
            </Text>
          </View>
        )}

        {nfcSupported && !nfcEnabled && (
          <View style={styles.warningBox}>
            <Text style={styles.warningText}>
              ⚠️ {t('nfcDisabled')}
            </Text>
          </View>
        )}

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>{t('profileSharing')}</Text>
          <Text style={styles.sectionDescription}>
            {t('tokenExpiresInfo')}
          </Text>

          {tokenData && (
            <View style={styles.tokenInfo}>
              <Text style={styles.tokenLabel}>{t('activeToken')}</Text>
              <Text style={styles.tokenValue} numberOfLines={1}>
                {tokenData.token}
              </Text>
              {timeRemaining && (
                <View style={styles.timerContainer}>
                  <Text style={styles.timerLabel}>{t('timeRemaining')}:</Text>
                  <Text style={styles.timerValue}>{timeRemaining}</Text>
                </View>
              )}
            </View>
          )}

          <TouchableOpacity
            style={[
              styles.button,
              styles.primaryButton,
              loading && styles.buttonDisabled,
            ]}
            onPress={handleGenerateToken}
            disabled={loading}
          >
            {loading ? (
              <ActivityIndicator color="#fff" />
            ) : (
              <Text style={styles.buttonText}>
                {tokenData ? t('generateNewToken') : t('generateToken')}
              </Text>
            )}
          </TouchableOpacity>
        </View>

        {tokenData && (
          <>
            <View style={styles.section}>
              <Text style={styles.sectionTitle}>{t('shareMethods')}</Text>

              {nfcSupported && nfcEnabled && (
                <TouchableOpacity
                  style={[styles.button, styles.nfcButton, isWriting && styles.buttonDisabled]}
                  onPress={writeNFC}
                  disabled={isWriting}
                >
                  {isWriting ? (
                    <>
                      <ActivityIndicator color="#fff" size="small" />
                      <Text style={[styles.buttonText, { marginLeft: 10 }]}>
                        {t('tapDeviceToNFC')}
                      </Text>
                    </>
                  ) : (
                    <Text style={styles.buttonText}>📱 {t('writeToNFCTag')}</Text>
                  )}
                </TouchableOpacity>
              )}

              <TouchableOpacity
                style={[styles.button, styles.secondaryButton]}
                onPress={handleCopyLink}
              >
                <Text style={styles.buttonText}>📋 {t('copyLink')}</Text>
              </TouchableOpacity>
            </View>

            <View style={styles.section}>
              <Text style={styles.sectionTitle}>{t('shareLink')}</Text>
              <View style={styles.linkBox}>
                <Text style={styles.linkText} numberOfLines={2}>
                  {tokenData.url}
                </Text>
              </View>
            </View>
          </>
        )}

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>{t('howItWorks')}</Text>
          <Text style={styles.infoText}>
            {t('howItWorksStep1')}{'\n'}
            {t('howItWorksStep2')}{'\n'}
            {t('howItWorksStep3')}{'\n'}
            {t('howItWorksStep4')}{'\n'}
            {t('howItWorksStep5')}
          </Text>
        </View>
      </View>
    </ScrollView>
  );
}

const getStyles = (colors) =>
  StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: colors.background,
    },
    content: {
      padding: 20,
      paddingTop: Platform.OS === 'ios' ? 50 : 20,
    },
    header: {
      marginBottom: 20,
    },
    backButton: {
      marginBottom: 10,
    },
    backButtonText: {
      color: colors.primary,
      fontSize: 16,
    },
    title: {
      fontSize: 28,
      fontWeight: 'bold',
      color: colors.text,
      marginBottom: 10,
    },
    warningBox: {
      backgroundColor: colors.warning || '#FFA500',
      padding: 15,
      borderRadius: 10,
      marginBottom: 20,
    },
    warningText: {
      color: '#000',
      fontSize: 14,
      lineHeight: 20,
    },
    section: {
      marginBottom: 30,
    },
    sectionTitle: {
      fontSize: 20,
      fontWeight: '600',
      color: colors.text,
      marginBottom: 10,
    },
    sectionDescription: {
      fontSize: 14,
      color: colors.textSecondary,
      marginBottom: 15,
      lineHeight: 20,
    },
    tokenInfo: {
      backgroundColor: colors.surface || colors.card,
      padding: 15,
      borderRadius: 10,
      marginBottom: 15,
    },
    tokenLabel: {
      fontSize: 12,
      color: colors.textSecondary,
      marginBottom: 5,
    },
    tokenValue: {
      fontSize: 14,
      color: colors.text,
      fontFamily: Platform.OS === 'ios' ? 'Courier' : 'monospace',
      marginBottom: 10,
    },
    timerContainer: {
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'space-between',
      marginTop: 10,
      paddingTop: 10,
      borderTopWidth: 1,
      borderTopColor: colors.border || '#ddd',
    },
    timerLabel: {
      fontSize: 14,
      color: colors.textSecondary,
    },
    timerValue: {
      fontSize: 18,
      fontWeight: 'bold',
      color: colors.primary,
    },
    button: {
      padding: 15,
      borderRadius: 10,
      alignItems: 'center',
      justifyContent: 'center',
      marginBottom: 10,
      flexDirection: 'row',
    },
    primaryButton: {
      backgroundColor: colors.primary,
    },
    secondaryButton: {
      backgroundColor: colors.secondary || '#6B7280',
    },
    nfcButton: {
      backgroundColor: '#10B981',
    },
    buttonDisabled: {
      opacity: 0.5,
    },
    buttonText: {
      color: '#fff',
      fontSize: 16,
      fontWeight: '600',
    },
    linkBox: {
      backgroundColor: colors.surface || colors.card,
      padding: 15,
      borderRadius: 10,
      borderWidth: 1,
      borderColor: colors.border || '#ddd',
    },
    linkText: {
      fontSize: 12,
      color: colors.text,
      fontFamily: Platform.OS === 'ios' ? 'Courier' : 'monospace',
    },
    infoText: {
      fontSize: 14,
      color: colors.textSecondary,
      lineHeight: 22,
    },
  });
