import React, { useEffect } from 'react';
import { StyleSheet, TouchableOpacity, Image } from 'react-native';
import { useRouter, useLocalSearchParams } from 'expo-router';
import * as FileSystem from 'expo-file-system';
import { ThemedText } from '@/components/ThemedText';
import { ThemedView } from '@/components/ThemedView';

export default function VerifyFoodPage() {
  const router = useRouter();
  const { photoUri } = useLocalSearchParams<{ photoUri: string }>();

  useEffect(() => {
    return () => {
      // Clean up the temporary file when leaving this screen
      if (photoUri) {
        FileSystem.deleteAsync(photoUri, { idempotent: true }).catch(console.error);
      }
    };
  }, [photoUri]);

  return (
    <ThemedView style={styles.container}>
      <ThemedText style={styles.title}>Verify Food</ThemedText>
      {photoUri && (
        <Image source={{ uri: photoUri }} style={styles.image} />
      )}
      <ThemedText style={styles.text}>Is this food safe to eat?</ThemedText>
      <TouchableOpacity style={styles.button} onPress={() => router.back()}>
        <ThemedText style={styles.buttonText}>Go Back</ThemedText>
      </TouchableOpacity>
    </ThemedView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    padding: 20,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 20,
  },
  image: {
    width: '100%',
    height: 300,
    resizeMode: 'contain',
    marginBottom: 20,
  },
  text: {
    fontSize: 18,
    marginBottom: 20,
    textAlign: 'center',
  },
  button: {
    backgroundColor: '#A1CEDC',
    padding: 15,
    borderRadius: 5,
    marginTop: 20,
  },
  buttonText: {
    fontSize: 18,
    fontWeight: 'bold',
  },
});
