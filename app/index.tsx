import ParallaxScrollView from '@/components/parallax-scroll-view';
import { ThemedText } from '@/components/themed-text';
import { ThemedView } from '@/components/themed-view';
import { Image } from 'expo-image';
import { useRouter } from 'expo-router';
import { StyleSheet, Text, TouchableOpacity, View } from 'react-native';


export default function HomeScreen() {
  const router = useRouter();

  const handleCreateAdmin = () => router.push('/create-admin');
  const handleLoginAdmin = () => router.push('/login-admin');
  const handleOrgPin = () => router.push('/pin-login');
  return (
    <ParallaxScrollView
      headerBackgroundColor={{ light: '#ffffffff', dark: '#8b5cf6' }}
      headerImage={
        <View style={styles.headerImage}>
          <Image
            source={require('@/assets/images/Screenshot (217).png')}
            style={styles.headerImagePhoto}
            contentFit="cover"
          />
        </View>
      }
    >
      <ThemedView style={styles.titleContainer}>
                  
        <ThemedText type="title">Welcome to Mamba Message Board !</ThemedText>
      </ThemedView>
      <View style={styles.buttonContainer}>
        <TouchableOpacity style={styles.purpleButton} onPress={handleCreateAdmin}>
          <Text style={styles.buttonText}>Create Admin Account</Text>
        </TouchableOpacity>
      </View>
      <View style={styles.buttonContainer}>
        <TouchableOpacity style={styles.purpleButton} onPress={handleLoginAdmin}>
          <Text style={styles.buttonText}>Login to Admin Account</Text>
        </TouchableOpacity>
      </View>
      <View style={styles.buttonContainer}>
        <TouchableOpacity style={styles.purpleButton} onPress={handleOrgPin}>
          <Text style={styles.buttonText}>Enter Organization PIN</Text>
        </TouchableOpacity>
      </View>
    </ParallaxScrollView>
  );
}

const styles = StyleSheet.create({
  titleContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    marginBottom: 40,
    marginTop: 30,
    justifyContent: 'center',
  },
  headerImage: {
    width: '100%',
    height: 280,
    overflow: 'hidden',

  },
  
  buttonContainer: {
    marginVertical: 12,
    marginHorizontal: 24,
  },
  purpleButton: {
    backgroundColor: '#8b5cf6',
    paddingVertical: 14,
    paddingHorizontal: 24,
    borderRadius: 8,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOpacity: 0.08,
    shadowRadius: 4,
    elevation: 2,
  },
  buttonText: {
    color: 'white',
    fontWeight: 'bold',
    fontSize: 16,
    
  },
  headerImagePhoto: {
    width: '100%',
    height: '100%',
    transform: [{ translateY:  0}],
  },
});
