import React, { createContext, useState, useEffect, useContext } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';

const LanguageContext = createContext({});

// Translation strings
const translations = {
  en: {
    // Home Screen
    welcome: 'Welcome',
    welcomeMessage: 'Your game statistics dashboard will be here.',
    editProfile: 'Edit Profile',
    signOut: 'Sign Out',
    settings: 'Settings',
    updateProfileInfo: 'Update your profile information',
    customizePreferences: 'Customize your preferences',
    startSharing: 'Start Sharing',
    generateTokenShare: 'Generate token and share your profile',
    
    // Profile Screen
    profileSettings: 'Profile Settings',
    back: 'Back',
    accountInformation: 'Account Information',
    email: 'Email',
    profilePicture: 'Profile Picture',
    changePhoto: 'Change Photo',
    uploadPhoto: 'Upload Photo',
    clickToSelect: 'Click to select a profile picture from your device',
    username: 'Username',
    enterUsername: 'Enter username',
    updateUsername: 'Update Username',
    changePassword: 'Change Password',
    newPassword: 'New Password',
    confirmNewPassword: 'Confirm New Password',
    updatePassword: 'Update Password',
    
    // Settings Screen
    settingsTitle: 'Settings',
    theme: 'Theme',
    themeDescription: 'Choose your preferred theme',
    lightMode: 'Light Mode',
    darkMode: 'Dark Mode',
    language: 'Language',
    languageDescription: 'Select your language',
    english: 'English',
    french: 'Français',
    about: 'About',
    aboutDescription: 'Learn more about StatsGames',
    appName: 'StatsGames',
    version: 'Version',
    description: 'Game statistics with NFC',
    copyright: '© 2025 StatsGames. All rights reserved.',
    
    // Login Screen
    createAccount: 'Create Account',
    welcomeBack: 'Welcome Back',
    emailPlaceholder: 'Email',
    passwordPlaceholder: 'Password',
    sendMagicLink: 'Send Magic Link',
    signIn: 'Sign In',
    signUp: 'Sign Up',
    usePasswordInstead: 'Use password instead',
    useMagicLinkInstead: 'Use magic link instead',
    or: 'or',
    alreadyHaveAccount: 'Already have an account? Sign In',
    dontHaveAccount: "Don't have an account? Sign Up",
    
    // NFC Share Screen
    shareProfileNFC: 'Share Profile via NFC',
    nfcNotSupported: 'NFC is not supported on this device. You can still share your profile using the link.',
    nfcDisabled: 'NFC is disabled. Please enable it in your device settings to share via NFC.',
    profileSharing: 'Profile Sharing',
    tokenExpiresInfo: 'Generate a temporary token to share your profile. The token expires after 15 minutes.',
    activeToken: 'Active Token',
    timeRemaining: 'Time Remaining',
    generateNewToken: 'Generate New Token',
    generateToken: 'Generate Token',
    shareMethods: 'Share Methods',
    writeToNFCTag: 'Write to NFC Tag',
    tapDeviceToNFC: 'Tap device to NFC tag...',
    copyLink: 'Copy Link',
    shareLink: 'Share Link',
    howItWorks: 'How it works',
    howItWorksStep1: '1. Generate a temporary sharing token',
    howItWorksStep2: '2. Either write the link to an NFC tag or copy the link',
    howItWorksStep3: '3. Share the NFC tag or link with others',
    howItWorksStep4: '4. They can view your public profile and stats',
    howItWorksStep5: '5. Token expires automatically after 15 minutes',
    
    // NFC Profile Screen
    loadingProfile: 'Loading profile...',
    sharedProfile: 'Shared Profile',
    userId: 'User ID',
    gameStatistics: 'Game Statistics',
    unknownGame: 'Unknown Game',
    noStatsAvailable: 'No stats available',
    noGameStatsYet: 'No game statistics available yet',
    profileSharedViaNFC: 'This profile was shared via NFC',
    updated: 'Updated',
    linkExpired: 'This sharing link has expired',
    invalidLink: 'Invalid sharing link',
    failedToLoadProfile: 'Failed to load profile',
    unexpectedError: 'An unexpected error occurred',
    askForNewLink: 'Please ask the user to generate a new sharing link',
    checkLinkAndRetry: 'Please check the link and try again',
    goBack: 'Go Back',
    noProfileData: 'No profile data available',
    anonymousUser: 'Anonymous User',
    
    // Loading Screen
    gameStatisticsWithNFC: 'Game Statistics with NFC',
    
    // Common
    success: 'Success',
    error: 'Error',
    info: 'Info',
    
    // Alert Messages
    pleaseEnterEmail: 'Please enter your email',
    pleaseEnterPassword: 'Please enter your password',
    checkYourEmail: 'Check your email',
    magicLinkSent: 'We sent you a magic link to sign in.',
    accountCreated: 'Account created! Please check your email to verify your account.',
    mustBeLoggedIn: 'You must be logged in to share your profile',
    failedToGenerateToken: 'Failed to generate token. Please try again.',
    pleaseGenerateTokenFirst: 'Please generate a token first',
    nfcNotSupportedTitle: 'NFC Not Supported',
    nfcNotSupportedMessage: 'Your device does not support NFC',
    nfcDisabledTitle: 'NFC Disabled',
    nfcDisabledMessage: 'Please enable NFC in your device settings',
    profileLinkWritten: 'Profile link written to NFC tag!',
    failedToWriteNFC: 'Failed to write to NFC tag. Please try again.',
    linkCopied: 'Link copied to clipboard!',
    failedToCopyLink: 'Failed to copy link',
    tokenGeneratedNFC: 'Token generated! You can now tap your device to another device to share your profile.',
    tokenGeneratedLink: 'Token generated! Use the "Copy Link" button to share your profile.',
    noTokenProvided: 'No token provided',
    expired: 'Expired',
    imageSelected: 'Image Selected',
    profilePictureUploadPending: 'Profile picture upload to server will be implemented soon. For now, the image is stored locally.',
  },
  fr: {
    // Home Screen
    welcome: 'Bienvenue',
    welcomeMessage: 'Votre tableau de bord de statistiques de jeu sera ici.',
    editProfile: 'Modifier le profil',
    signOut: 'Se déconnecter',
    settings: 'Paramètres',
    updateProfileInfo: 'Mettre à jour vos informations de profil',
    customizePreferences: 'Personnaliser vos préférences',
    startSharing: 'Commencer à partager',
    generateTokenShare: 'Générer un jeton et partager votre profil',
    
    // Profile Screen
    profileSettings: 'Paramètres du profil',
    back: 'Retour',
    accountInformation: 'Informations du compte',
    email: 'E-mail',
    profilePicture: 'Photo de profil',
    changePhoto: 'Changer la photo',
    uploadPhoto: 'Télécharger une photo',
    clickToSelect: 'Cliquez pour sélectionner une photo de profil depuis votre appareil',
    username: "Nom d'utilisateur",
    enterUsername: "Entrez le nom d'utilisateur",
    updateUsername: "Mettre à jour le nom d'utilisateur",
    changePassword: 'Changer le mot de passe',
    newPassword: 'Nouveau mot de passe',
    confirmNewPassword: 'Confirmer le nouveau mot de passe',
    updatePassword: 'Mettre à jour le mot de passe',
    
    // Settings Screen
    settingsTitle: 'Paramètres',
    theme: 'Thème',
    themeDescription: 'Choisissez votre thème préféré',
    lightMode: 'Mode clair',
    darkMode: 'Mode sombre',
    language: 'Langue',
    languageDescription: 'Sélectionnez votre langue',
    english: 'English',
    french: 'Français',
    about: 'À propos',
    aboutDescription: 'En savoir plus sur StatsGames',
    appName: 'StatsGames',
    version: 'Version',
    description: 'Statistiques de jeu avec NFC',
    copyright: '© 2025 StatsGames. Tous droits réservés.',
    
    // Login Screen
    createAccount: 'Créer un compte',
    welcomeBack: 'Bon retour',
    emailPlaceholder: 'E-mail',
    passwordPlaceholder: 'Mot de passe',
    sendMagicLink: 'Envoyer le lien magique',
    signIn: 'Se connecter',
    signUp: "S'inscrire",
    usePasswordInstead: 'Utiliser le mot de passe à la place',
    useMagicLinkInstead: 'Utiliser le lien magique à la place',
    or: 'ou',
    alreadyHaveAccount: 'Vous avez déjà un compte ? Se connecter',
    dontHaveAccount: "Vous n'avez pas de compte ? S'inscrire",
    
    // NFC Share Screen
    shareProfileNFC: 'Partager le profil via NFC',
    nfcNotSupported: 'NFC n\'est pas pris en charge sur cet appareil. Vous pouvez toujours partager votre profil en utilisant le lien.',
    nfcDisabled: 'NFC est désactivé. Veuillez l\'activer dans les paramètres de votre appareil pour partager via NFC.',
    profileSharing: 'Partage de profil',
    tokenExpiresInfo: 'Générez un jeton temporaire pour partager votre profil. Le jeton expire après 15 minutes.',
    activeToken: 'Jeton actif',
    timeRemaining: 'Temps restant',
    generateNewToken: 'Générer un nouveau jeton',
    generateToken: 'Générer un jeton',
    shareMethods: 'Méthodes de partage',
    writeToNFCTag: 'Écrire sur une étiquette NFC',
    tapDeviceToNFC: 'Appuyez l\'appareil sur l\'étiquette NFC...',
    copyLink: 'Copier le lien',
    shareLink: 'Partager le lien',
    howItWorks: 'Comment ça marche',
    howItWorksStep1: '1. Générer un jeton de partage temporaire',
    howItWorksStep2: '2. Écrire le lien sur une étiquette NFC ou copier le lien',
    howItWorksStep3: '3. Partager l\'étiquette NFC ou le lien avec d\'autres',
    howItWorksStep4: '4. Ils peuvent voir votre profil public et vos statistiques',
    howItWorksStep5: '5. Le jeton expire automatiquement après 15 minutes',
    
    // NFC Profile Screen
    loadingProfile: 'Chargement du profil...',
    sharedProfile: 'Profil partagé',
    userId: 'ID utilisateur',
    gameStatistics: 'Statistiques de jeu',
    unknownGame: 'Jeu inconnu',
    noStatsAvailable: 'Aucune statistique disponible',
    noGameStatsYet: 'Aucune statistique de jeu disponible pour le moment',
    profileSharedViaNFC: 'Ce profil a été partagé via NFC',
    updated: 'Mis à jour',
    linkExpired: 'Ce lien de partage a expiré',
    invalidLink: 'Lien de partage invalide',
    failedToLoadProfile: 'Échec du chargement du profil',
    unexpectedError: 'Une erreur inattendue s\'est produite',
    askForNewLink: 'Veuillez demander à l\'utilisateur de générer un nouveau lien de partage',
    checkLinkAndRetry: 'Veuillez vérifier le lien et réessayer',
    goBack: 'Retour',
    noProfileData: 'Aucune donnée de profil disponible',
    anonymousUser: 'Utilisateur anonyme',
    
    // Loading Screen
    gameStatisticsWithNFC: 'Statistiques de jeu avec NFC',
    
    // Common
    success: 'Succès',
    error: 'Erreur',
    info: 'Info',
    
    // Alert Messages
    pleaseEnterEmail: 'Veuillez entrer votre e-mail',
    pleaseEnterPassword: 'Veuillez entrer votre mot de passe',
    checkYourEmail: 'Vérifiez votre e-mail',
    magicLinkSent: 'Nous vous avons envoyé un lien magique pour vous connecter.',
    accountCreated: 'Compte créé ! Veuillez vérifier votre e-mail pour vérifier votre compte.',
    mustBeLoggedIn: 'Vous devez être connecté pour partager votre profil',
    failedToGenerateToken: 'Échec de la génération du jeton. Veuillez réessayer.',
    pleaseGenerateTokenFirst: 'Veuillez d\'abord générer un jeton',
    nfcNotSupportedTitle: 'NFC non pris en charge',
    nfcNotSupportedMessage: 'Votre appareil ne prend pas en charge NFC',
    nfcDisabledTitle: 'NFC désactivé',
    nfcDisabledMessage: 'Veuillez activer NFC dans les paramètres de votre appareil',
    profileLinkWritten: 'Lien de profil écrit sur l\'étiquette NFC !',
    failedToWriteNFC: 'Échec de l\'écriture sur l\'étiquette NFC. Veuillez réessayer.',
    linkCopied: 'Lien copié dans le presse-papiers !',
    failedToCopyLink: 'Échec de la copie du lien',
    tokenGeneratedNFC: 'Jeton généré ! Vous pouvez maintenant toucher votre appareil à un autre appareil pour partager votre profil.',
    tokenGeneratedLink: 'Jeton généré ! Utilisez le bouton "Copier le lien" pour partager votre profil.',
    noTokenProvided: 'Aucun jeton fourni',
    expired: 'Expiré',
    imageSelected: 'Image sélectionnée',
    profilePictureUploadPending: 'Le téléchargement de la photo de profil sur le serveur sera bientôt disponible. Pour l\'instant, l\'image est stockée localement.',
  },
};

export const LanguageProvider = ({ children }) => {
  const [language, setLanguage] = useState('en');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadLanguagePreference();
  }, []);

  const loadLanguagePreference = async () => {
    try {
      const savedLanguage = await AsyncStorage.getItem('language');
      if (savedLanguage !== null && (savedLanguage === 'en' || savedLanguage === 'fr')) {
        setLanguage(savedLanguage);
      }
    } catch (error) {
      console.error('Error loading language preference:', error);
    } finally {
      setLoading(false);
    }
  };

  const changeLanguage = async (newLanguage) => {
    try {
      setLanguage(newLanguage);
      await AsyncStorage.setItem('language', newLanguage);
    } catch (error) {
      console.error('Error saving language preference:', error);
    }
  };

  const t = (key) => {
    return translations[language][key] || key;
  };

  const value = {
    language,
    changeLanguage,
    t,
    loading,
  };

  return (
    <LanguageContext.Provider value={value}>
      {children}
    </LanguageContext.Provider>
  );
};

export const useLanguage = () => {
  const context = useContext(LanguageContext);
  if (!context) {
    throw new Error('useLanguage must be used within a LanguageProvider');
  }
  return context;
};
