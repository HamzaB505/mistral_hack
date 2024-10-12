import React, { useState, useEffect } from 'react';
import { StyleSheet, TouchableOpacity, View, Button, Image } from 'react-native';
import { CameraView, CameraType, useCameraPermissions } from 'expo-camera';
import * as FileSystem from 'expo-file-system';
import { ThemedText } from '@/components/ThemedText';
import { ThemedView } from '@/components/ThemedView';
import { useRouter } from 'expo-router';


export const PhotoTakenStage = ({ photo, clear}: { photo: string, clear: () => void }) => {
  const router = useRouter();

  const handleVerifyFood = async () => {
    try {
      const fileName = `${FileSystem.documentDirectory}temp_food_image.jpg`;
      await FileSystem.copyAsync({
        from: photo,
        to: fileName
      });
      router.push({
        pathname: "/verifyFood",
        params: { photoUri: fileName }
      });
    } catch (error) {
      console.error("Error saving image:", error);
    }
  };

  return <View style={styles.previewContainer}>
    <Image source={{ uri: photo }} style={styles.preview} />
    <TouchableOpacity style={styles.button} onPress={handleVerifyFood}>
      <ThemedText style={styles.buttonText}>Can I eat that</ThemedText>
    </TouchableOpacity>
    <TouchableOpacity style={styles.button} onPress={() => clear()}>
      <ThemedText style={styles.buttonText}>Take Another Photo</ThemedText>
    </TouchableOpacity>
  </View>
}

export const VerifyFoodStage = () => {
  return (
    <ThemedView style={styles.verifyContainer}>
      <ThemedText style={styles.verifyText}>Verifying your food...</ThemedText>
    </ThemedView>
  );
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
          <View style={styles.buttonContainer}>
            <TouchableOpacity style={styles.button} onPress={toggleCameraFacing}>
              <ThemedText style={styles.buttonText}>Flip Camera</ThemedText>
            </TouchableOpacity>
            <TouchableOpacity style={styles.button} onPress={takePhoto}>
              <ThemedText style={styles.buttonText}>Take Photo</ThemedText>
            </TouchableOpacity>
          </View>
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
    position: 'absolute',
    bottom: 20,
    alignSelf: 'center',
    flexDirection: 'row',
  },
  button: {
    backgroundColor: '#A1CEDC',
    padding: 15,
    borderRadius: 5,
    marginHorizontal: 10,
  },
  buttonText: {
    fontSize: 18,
    fontWeight: 'bold',
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
