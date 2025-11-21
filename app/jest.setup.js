// Jest setup file for global test configuration

// Mock NFC manager globally
jest.mock('react-native-nfc-manager', () => ({
  start: jest.fn(),
  isSupported: jest.fn(() => Promise.resolve(true)),
  requestTechnology: jest.fn(() => Promise.resolve()),
  cancelTechnologyRequest: jest.fn(() => Promise.resolve()),
  writeNdefMessage: jest.fn(() => Promise.resolve()),
  registerTagEvent: jest.fn(() => Promise.resolve()),
  unregisterTagEvent: jest.fn(() => Promise.resolve()),
  setEventListener: jest.fn(),
  NfcTech: {
    Ndef: 'Ndef',
  },
}));

// Mock expo modules
jest.mock('expo-linking', () => ({
  createURL: jest.fn((path) => `exp://localhost:8081/${path}`),
  makeUrl: jest.fn((path) => `exp://localhost:8081/${path}`),
}));

jest.mock('expo-clipboard', () => ({
  setStringAsync: jest.fn(() => Promise.resolve()),
}));

// Suppress console warnings in tests
global.console = {
  ...console,
  warn: jest.fn(),
  error: jest.fn(),
};
