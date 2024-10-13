import React, { useState, useEffect } from 'react';
import { StyleSheet, TouchableOpacity, View, Button, Image } from 'react-native';
import { CameraView, CameraType, useCameraPermissions } from 'expo-camera';
import * as FileSystem from 'expo-file-system';
import { ThemedText } from '@/components/ThemedText';
import { ThemedView } from '@/components/ThemedView';
import { useRouter } from 'expo-router';
import { useAppState } from '../state';
import {v4} from "uuid";
import 'react-native-get-random-values';

export const PhotoTakenStage = ({ photo, clear}: { photo: string, clear: () => void }) => {
  const router = useRouter();
  const {tmpFoodPhotoChange, setState} = useAppState();

  const handleVerifyFood = React.useCallback(async () => {
    try {
      const uuid = v4();
      const fileName = `${FileSystem.documentDirectory}/foodTmp/${uuid}.jpg`;
      await FileSystem.copyAsync({
        from: photo,
        to: fileName
      });
      router.push({
        pathname: "/modal/verifyFood",
        params: { photoUri: fileName }
      });
    } catch (error) {
      console.error("Error saving image:", error);
    }
  }, [photo, router]);

  return <View style={styles.previewContainer}>
    <Image source={{ uri: photo }} style={styles.preview} />
    <ActionButtons buttons={[{name: "Take Another Photo", onClick: clear, secondary: true}, {name: "Can I eat that?", onClick: handleVerifyFood}]} />
  </View>
}

export const VerifyFoodStage = () => {
  return (
    <ThemedView style={styles.verifyContainer}>
      <ThemedText style={styles.verifyText}>Verifying your food...</ThemedText>
    </ThemedView>
  );
}

export interface ActionButton {
  name: string,
  onClick: () => void,
  secondary?: boolean,
}

export interface ActionButtonsProps {
  buttons: ActionButton[]
}

export const ActionButtons = ({buttons}: ActionButtonsProps) => {
  return <View style={styles.buttonContainer}>
    {buttons.map((button) => (
      <TouchableOpacity key={button.name} style={[button.secondary ? styles.buttonSecondary : styles.button]} onPress={button.onClick}>
        <ThemedText style={button.secondary ? styles.buttonTextSecondary : styles.buttonText}>{button.name}</ThemedText>
      </TouchableOpacity>
    ))}
  </View>
}

export default function HomeScreen() {
  const [facing, setFacing] = useState<CameraType>('back');
  const [permission, requestPermission] = useCameraPermissions();
  const [photo, setPhoto] = useState<string | null>(null);
  const cameraRef = React.useRef<CameraView>(null);

  // Move this useEffect outside of any conditional rendering
  useEffect(() => {
    if (!permission) {
      // Request permission when the component mounts if not already granted
      requestPermission();
    }
  }, [permission, requestPermission]);

  if (!permission) {
    // Camera permissions are still loading
    return <ThemedView style={styles.container}><ThemedText>Loading...</ThemedText></ThemedView>;
  }

  if (!permission.granted) {
    // Camera permissions are not granted yet
    return (
      <ThemedView style={styles.container}>
        <ThemedText style={styles.message}>We need your permission to show the camera</ThemedText>
        <Button onPress={requestPermission} title="Grant permission" />
      </ThemedView>
    );
  }

  function toggleCameraFacing() {
    setFacing(current => (current === 'back' ? 'front' : 'back'));
  }

  async function takePhoto() {
    if (cameraRef.current) {
      const photo = await cameraRef.current.takePictureAsync();
      if (photo)
        setPhoto(photo.uri);
      else
        console.error("Photo undefined");
    }
  }

  return (
    <ThemedView style={styles.container}>
      {!photo ? (
        <CameraView ref={cameraRef} style={styles.camera} facing={facing}>
          <ActionButtons buttons={[{name: "Flip Camera", onClick: toggleCameraFacing, secondary: true}, {name: "Take Photo", onClick: takePhoto}]} />
        </CameraView>
      ) : <PhotoTakenStage photo={photo} clear={() => setPhoto(null)}/>}
    </ThemedView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  camera: {
    flex: 1,
    width: '100%',
  },
  buttonContainer: {
    padding: "5%",
    backgroundColor: "white",
    width: '100%',
    position: 'absolute',
    bottom: 0,
    flexDirection: 'row',
    justifyContent: 'center'
  },
  button: {
    backgroundColor: '#5C59F3',
    padding: 15,
    borderRadius: 100,
    marginHorizontal: 10,
  },
  buttonSecondary: {
    padding: 15,
    borderRadius: 100,
    marginHorizontal: 10,
    borderColor: '#5C59F3',
    borderWidth: 2,
  },
  buttonText: {
    fontSize: 18,
    fontWeight: 'bold',
  },
  buttonTextSecondary: {
    fontSize: 18,
    fontWeight: 'bold',
    color: 'black',
  },
  message: {
    marginBottom: 20,
    textAlign: 'center',
  },
  previewContainer: {
    flex: 1,
    width: '100%',
    justifyContent: 'center',
    alignItems: 'center',
  },
  preview: {
    width: '100%',
    height: '80%',
    marginBottom: 20,
  },
  verifyContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    width: '100%',
  },
  verifyText: {
    fontSize: 24,
    fontWeight: 'bold',
  },
});
