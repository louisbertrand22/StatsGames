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
    
    // Common
    success: 'Success',
    error: 'Error',
    info: 'Info',
  },
  fr: {
    // Home Screen
    welcome: 'Bienvenue',
    welcomeMessage: 'Votre tableau de bord de statistiques de jeu sera ici.',
    editProfile: 'Modifier le profil',
    signOut: 'Se déconnecter',
    settings: 'Paramètres',
    
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
    
    // Common
    success: 'Succès',
    error: 'Erreur',
    info: 'Info',
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
