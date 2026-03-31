import React, { useState, useEffect } from 'react';
import { View } from 'react-native';
import { Modal, Portal, Text, IconButton } from 'react-native-paper';
import { CameraView, Camera } from 'expo-camera';
import { useTranslation } from 'react-i18next';
import tw from 'twrnc';

interface ScannerModalProps {
  visible: boolean;
  onDismiss: () => void;
  onScan: (barcode: string) => void;
}

export default function ScannerModal({ visible, onDismiss, onScan }: ScannerModalProps) {
  const { t } = useTranslation();
  const [hasPermission, setHasPermission] = useState<boolean | null>(null);
  const [scanned, setScanned] = useState(false);

  useEffect(() => {
    (async () => {
      const { status } = await Camera.requestCameraPermissionsAsync();
      setHasPermission(status === 'granted');
    })();
  }, []);

  useEffect(() => {
    if (visible) {
      setScanned(false);
    }
  }, [visible]);

  const handleBarCodeScanned = ({ type, data }: any) => {
    setScanned(true);
    onScan(data);
  };

  if (!visible) return null;

  return (
    <Portal>
      <Modal visible={visible} onDismiss={onDismiss} contentContainerStyle={tw`bg-black flex-1 m-4 rounded-3xl overflow-hidden`}>
        {hasPermission === null ? (
          <View style={tw`flex-1 justify-center items-center`}><Text style={tw`text-white`}>Requesting camera permission...</Text></View>
        ) : hasPermission === false ? (
          <View style={tw`flex-1 justify-center items-center`}><Text style={tw`text-white`}>{t('cameraPermission')}</Text></View>
        ) : (
          <View style={tw`flex-1`}>
            <CameraView
              style={tw`flex-1`}
              facing="back"
              onBarcodeScanned={scanned ? undefined : handleBarCodeScanned}
            />
            <View style={tw`absolute top-4 right-4`}>
              <IconButton icon="close" iconColor="#fff" size={32} style={tw`bg-black/50`} onPress={onDismiss} />
            </View>
            <View style={tw`absolute bottom-10 w-full items-center`}>
              <Text style={tw`text-white bg-black/50 px-4 py-2 rounded-xl`}>{t('scanPrompt')}</Text>
            </View>
          </View>
        )}
      </Modal>
    </Portal>
  );
}
