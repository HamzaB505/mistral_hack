import React, { useEffect, useMemo, useState } from 'react';
import { StyleSheet, TouchableOpacity, Image, ActivityIndicator, ScrollView } from 'react-native';
import { useRouter, useLocalSearchParams } from 'expo-router';
import * as FileSystem from 'expo-file-system';
import { ThemedText } from '@/components/ThemedText';
import { ThemedView } from '@/components/ThemedView';
import { useAppState } from '../state';
import { ActionButton, ActionButtons } from '../(tabs)';

interface Result {
  canEat: boolean;
  explanation: string;
  detected: {
    name: string,
    type: string
  }
}

async function verifyFood(image: string): Promise<Result> {
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve({
        canEat: false,
        explanation: `This food appears safe to eat.Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. \n\nDuis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.\n\nSed ut perspiciatis unde omnis iste natus error sit voluptatem accusantium doloremque laudantium, totam rem aperiam, eaque ipsa quae ab illo inventore veritatis et quasi architecto beatae vitae dicta sunt explicabo.`,
        detected: {
          name: "Milka oreo",
          type: "chocolate bar"
        }
      });
    }, 2000);
  });
}

export default function VerifyFoodPage() {
  const router = useRouter();
  const [result, setResult] = useState<Result | undefined>(undefined);
  const { photoUri } = useLocalSearchParams<{ photoUri: string }>();

  const photoNode = useMemo(() => {
    if (photoUri) {
      return <Image source={{ uri: `${photoUri}` }} style={styles.image} />;
    } else {
      return (
        <ThemedView style={styles.container}>
          <ActivityIndicator size="large" />
          <ThemedText style={styles.text}>Loading Image...</ThemedText>
        </ThemedView>
      );
    }
  }, [photoUri]);

  useEffect(() => {
    setResult(undefined);
    const doVerify = async () => {
      const response = await verifyFood(photoUri)
      setResult(response);
    }
    if (photoUri) {
      doVerify();
    }
  }, [photoUri]);

  const displayResult = (result: Result | undefined) => {
    if (!result) {
      return (
        <ThemedView style={styles.container}>
          <ActivityIndicator size="large" />
          <ThemedText style={styles.text}>Verifying food</ThemedText>
        </ThemedView>
      );
    }
    return (
      <ThemedView style={styles.container}>
                <ThemedView style={styles.foodInfoBox}>
                  <ThemedText style={styles.text}>Detected food: {result.detected.name}</ThemedText>
                  <ThemedText style={styles.text}>Food type: {result.detected.type}</ThemedText>
                </ThemedView>
        <ThemedText style={[styles.text, { color: result.canEat ? 'green' : 'red' }]}>
          {result.canEat ? 'This food appears safe to eat.' : 'This food may not be safe to eat.'}
        </ThemedText>
        {result.explanation && <ScrollView><ThemedText style={styles.text}>{result.explanation}</ThemedText></ScrollView>}
      </ThemedView>
    );
  };

  const actionButtons = useMemo<ActionButton[]>(() => {
    if (result?.canEat == false)
      return [{ name: "Find alternatives", onClick: () => alert("alternatives"), secondary: true}, {name: "Home", onClick: () => router.push("/")}];
    return [{name: "Home", onClick: () => router.push("/")}];

  }, [result]);

  return (
    <ThemedView style={styles.container}>
      <ThemedText style={styles.title}>Is this food safe to eat?</ThemedText>
      {/* {photoNode} */}
      {displayResult(result)}
      <ActionButtons buttons={actionButtons} />
      {/* <TouchableOpacity style={styles.button} onPress={() => router.back()}>
        <ThemedText style={styles.buttonText}>Go Back</ThemedText>
      </TouchableOpacity> */}
    </ThemedView>
  );
}

const styles = StyleSheet.create({
  foodInfoBox: {
    borderWidth: 1,
    backgroundColor: "transparent",
    width: "100%",
    borderColor: 'gray',
    borderRadius: 10,
    padding: 10,
    marginBottom: 10,
  },
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    padding: 20,
    backgroundColor: "white"
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 20,
    color: "black"
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
    color: "black"
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
