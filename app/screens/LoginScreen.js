import React, { useState } from 'react';
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
} from 'react-native';
import { colors, textStyles } from '../theme';
import { useAuth } from '../contexts/AuthContext';
import { useLanguage } from '../contexts/LanguageContext';

export default function LoginScreen() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isSignUp, setIsSignUp] = useState(false);
  const [useMagicLink, setUseMagicLink] = useState(false);
  const [localLoading, setLocalLoading] = useState(false);
  const { signIn, signUp, sendMagicLink } = useAuth();
  const { t } = useLanguage();

  const handleAuth = async () => {
    if (!email.trim()) {
      Alert.alert('Error', 'Please enter your email');
      return;
    }

    if (useMagicLink) {
      setLocalLoading(true);
      const { error } = await sendMagicLink(email);
      setLocalLoading(false);

      if (error) {
        Alert.alert('Error', error.message);
      } else {
        Alert.alert(
          'Check your email',
          'We sent you a magic link to sign in.'
        );
        setEmail('');
      }
      return;
    }

    if (!password.trim()) {
      Alert.alert('Error', 'Please enter your password');
      return;
    }

    setLocalLoading(true);
    const { error } = isSignUp
      ? await signUp(email, password)
      : await signIn(email, password);
    setLocalLoading(false);

    if (error) {
      Alert.alert('Error', error.message);
    } else if (isSignUp) {
      Alert.alert(
        'Success',
        'Account created! Please check your email to verify your account.'
      );
    }
  };

  const toggleAuthMode = () => {
    setIsSignUp(!isSignUp);
    setUseMagicLink(false);
  };

  const toggleMagicLink = () => {
    setUseMagicLink(!useMagicLink);
    setPassword('');
  };

  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      style={styles.container}
    >
      <ScrollView
        contentContainerStyle={styles.scrollContent}
        keyboardShouldPersistTaps="always"
      >
        <View style={styles.content}>
          <Text style={styles.logo}>{t('appName')}</Text>
          <Text style={styles.subtitle}>{t('gameStatisticsWithNFC')}</Text>

          <View style={styles.form}>
            <Text style={styles.title}>
              {isSignUp ? t('createAccount') : t('welcomeBack')}
            </Text>

            <TextInput
              style={styles.input}
              placeholder={t('emailPlaceholder')}
              placeholderTextColor={colors.textSecondary}
              value={email}
              onChangeText={setEmail}
              autoCapitalize="none"
              keyboardType="email-address"
              autoComplete="email"
            />

            {!useMagicLink && (
              <TextInput
                style={styles.input}
                placeholder={t('passwordPlaceholder')}
                placeholderTextColor={colors.textSecondary}
                value={password}
                onChangeText={setPassword}
                secureTextEntry
                autoCapitalize="none"
                autoComplete={isSignUp ? 'password-new' : 'password'}
              />
            )}

            <TouchableOpacity
              style={styles.primaryButton}
              onPress={handleAuth}
              disabled={localLoading}
            >
              {localLoading ? (
                <ActivityIndicator color="#fff" />
              ) : (
                <Text style={styles.primaryButtonText}>
                  {useMagicLink
                    ? t('sendMagicLink')
                    : isSignUp
                    ? t('signUp')
                    : t('signIn')}
                </Text>
              )}
            </TouchableOpacity>

            <TouchableOpacity
              style={styles.secondaryButton}
              onPress={toggleMagicLink}
              disabled={localLoading}
            >
              <Text style={styles.secondaryButtonText}>
                {useMagicLink
                  ? t('usePasswordInstead')
                  : t('useMagicLinkInstead')}
              </Text>
            </TouchableOpacity>

            <View style={styles.divider}>
              <View style={styles.dividerLine} />
              <Text style={styles.dividerText}>{t('or')}</Text>
              <View style={styles.dividerLine} />
            </View>

            <TouchableOpacity
              style={styles.secondaryButton}
              onPress={toggleAuthMode}
              disabled={localLoading}
            >
              <Text style={styles.secondaryButtonText}>
                {isSignUp
                  ? t('alreadyHaveAccount')
                  : t('dontHaveAccount')}
              </Text>
            </TouchableOpacity>
          </View>
        </View>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
  },
  scrollContent: {
    flexGrow: 1,
  },
  content: {
    flex: 1,
    padding: 24,
    justifyContent: 'center',
  },
  logo: {
    ...textStyles.h1,
    fontSize: 42,
    fontWeight: '700',
    color: colors.primary,
    textAlign: 'center',
    marginBottom: 8,
  },
  subtitle: {
    ...textStyles.body,
    color: colors.textSecondary,
    textAlign: 'center',
    marginBottom: 48,
  },
  form: {
    width: '100%',
  },
  title: {
    ...textStyles.h2,
    marginBottom: 24,
    textAlign: 'center',
  },
  input: {
    backgroundColor: '#fff',
    borderWidth: 1,
    borderColor: colors.border,
    borderRadius: 8,
    padding: 16,
    marginBottom: 16,
    fontSize: 16,
    color: colors.text,
  },
  primaryButton: {
    backgroundColor: colors.primary,
    borderRadius: 8,
    padding: 16,
    alignItems: 'center',
    marginTop: 8,
  },
  primaryButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
  },
  secondaryButton: {
    padding: 16,
    alignItems: 'center',
  },
  secondaryButtonText: {
    color: colors.primary,
    fontSize: 14,
    fontWeight: '500',
  },
  divider: {
    flexDirection: 'row',
    alignItems: 'center',
    marginVertical: 24,
  },
  dividerLine: {
    flex: 1,
    height: 1,
    backgroundColor: colors.border,
  },
  dividerText: {
    marginHorizontal: 16,
    color: colors.textSecondary,
    fontSize: 14,
  },
});