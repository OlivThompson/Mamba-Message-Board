import { ThemedText } from '@/components/themed-text';
import { ThemedView } from '@/components/themed-view';
import { useRouter } from 'expo-router';
import React, { useState } from 'react';
import { Button, StyleSheet, Text, TextInput, View } from 'react-native';

const ORG_PIN = '123456'; // TODO: Replace this with real PIN storage/auth logic

export default function PinLoginScreen() {
  const router = useRouter();
  const [pin, setPin] = useState('');
  const [error, setError] = useState('');

  const handlePinSubmit = () => {
    if (pin.trim() === '') {
      setError('PIN cannot be empty');
    } else if (pin === ORG_PIN) {
      // On successful PIN entry, navigate to message board
      router.replace('/message-board'); // path to message board screen
    } else {
      setError('Incorrect PIN. Try again.');
    }
  };

  return (
    
    <ThemedView style={styles.container}>
      <ThemedText style={styles.header}>Enter Organization PIN</ThemedText>
      <TextInput
        style={styles.input}
        value={pin}
        onChangeText={(text) => { setPin(text); setError(''); }}
        placeholder="Enter PIN"
        keyboardType="number-pad"
        secureTextEntry
        maxLength={8}
      />
      {error !== '' && <Text style={styles.error}>{error}</Text>}
      <View style={styles.buttonRow}>
        <Button title="Submit" onPress={handlePinSubmit} />
      </View>
    </ThemedView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, justifyContent: 'center', alignItems: 'center', backgroundColor: '#8b5cf6' },
  header: { fontSize: 22, fontWeight: 'bold', marginBottom: 20 },
  input: { width: 200, borderColor: '#ccc', borderWidth: 1, borderRadius: 8, paddingHorizontal: 10, height: 40, marginBottom: 8 },
  buttonRow: { width: 200, marginTop: 8 },
  error: { color: 'red', marginTop: 4 },

  //button colorvbvb
  
});
