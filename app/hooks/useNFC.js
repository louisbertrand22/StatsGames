import { useEffect, useState } from 'react';
import { Platform, Linking } from 'react-native';
import NfcManager, { NfcTech, Ndef } from 'react-native-nfc-manager';

/**
 * Hook to handle NFC reading and deep linking
 * @param {Function} onNFCUrl - Callback when NFC URL is detected
 * @param {boolean} enabled - Whether NFC reading is enabled
 */
export const useNFCReader = (onNFCUrl, enabled = true) => {
  const [nfcSupported, setNfcSupported] = useState(false);
  const [isReading, setIsReading] = useState(false);

  useEffect(() => {
    initNFC();
    return () => {
      cleanupNFC();
    };
  }, []);

  useEffect(() => {
    if (enabled && nfcSupported) {
      startNFCReading();
    } else {
      stopNFCReading();
    }

    return () => {
      stopNFCReading();
    };
  }, [enabled, nfcSupported]);

  const initNFC = async () => {
    try {
      const supported = await NfcManager.isSupported();
      setNfcSupported(supported);

      if (supported) {
        await NfcManager.start();
      }
    } catch (error) {
      console.error('Error initializing NFC:', error);
      setNfcSupported(false);
    }
  };

  const cleanupNFC = async () => {
    try {
      await stopNFCReading();
      // Don't call NfcManager.stop() as it might be used elsewhere
    } catch (error) {
      console.error('Error cleaning up NFC:', error);
    }
  };

  const startNFCReading = async () => {
    if (isReading || !nfcSupported) return;

    try {
      setIsReading(true);
      await NfcManager.registerTagEvent();
    } catch (error) {
      console.error('Error starting NFC reading:', error);
      setIsReading(false);
    }
  };

  const stopNFCReading = async () => {
    if (!isReading) return;

    try {
      await NfcManager.unregisterTagEvent();
      setIsReading(false);
    } catch (error) {
      console.error('Error stopping NFC reading:', error);
    }
  };

  const readNFCTag = async () => {
    try {
      await NfcManager.requestTechnology(NfcTech.Ndef);
      const tag = await NfcManager.getTag();

      if (tag && tag.ndefMessage) {
        const ndefRecords = tag.ndefMessage;
        
        for (const record of ndefRecords) {
          const uri = Ndef.uri.decodePayload(record.payload);
          
          if (uri && uri.includes('/nfc/')) {
            const token = uri.split('/nfc/')[1];
            if (token && onNFCUrl) {
              onNFCUrl(token);
            }
          }
        }
      }
    } catch (error) {
      console.warn('Error reading NFC tag:', error);
    } finally {
      NfcManager.cancelTechnologyRequest().catch(() => {});
    }
  };

  return {
    nfcSupported,
    isReading,
    readNFCTag,
  };
};

/**
 * Hook to handle deep linking for NFC profile sharing
 * @param {Function} onTokenReceived - Callback when token is received via deep link
 */
export const useNFCDeepLink = (onTokenReceived) => {
  useEffect(() => {
    // Handle initial URL (app opened via link)
    Linking.getInitialURL().then((url) => {
      if (url) {
        handleDeepLink(url);
      }
    });

    // Handle URL when app is already open
    const subscription = Linking.addEventListener('url', (event) => {
      handleDeepLink(event.url);
    });

    return () => {
      subscription?.remove();
    };
  }, []);

  const handleDeepLink = (url) => {
    if (!url) return;

    // Parse URL to extract NFC token
    // Expected format: https://statsgames.app/nfc/{token} or statsgames://nfc/{token}
    const nfcMatch = url.match(/\/nfc\/([a-zA-Z0-9]+)/);
    
    if (nfcMatch && nfcMatch[1]) {
      const token = nfcMatch[1];
      if (onTokenReceived) {
        onTokenReceived(token);
      }
    }
  };

  return { handleDeepLink };
};
