import { Redirect, Stack } from 'expo-router'
import { useAuth } from '@clerk/clerk-expo'
import { Colors } from '../../constants/Colors'
import { Platform, StyleSheet, View, Image } from 'react-native'
import { LinearGradient } from 'expo-linear-gradient'

export default function AuthRoutesLayout() {
  const { isSignedIn } = useAuth()

  if (isSignedIn) {
    return <Redirect href={'/'} />
  }

  return (
    <LinearGradient
      colors={[Colors.background, '#121212']}
      style={styles.container}
      start={{ x: 0, y: 0 }}
      end={{ x: 1, y: 1 }}
    >
      <View style={styles.backgroundDecoration}>
        <View style={styles.circle1} />
        <View style={styles.circle2} />
        <View style={styles.circle3} />
      </View>
      
      <Stack
        screenOptions={{
          headerShown: false,
          contentStyle: {
            backgroundColor: 'transparent',
          },
          animation: 'fade',
        }}
      >
        <Stack.Screen name="sign-in" />
        <Stack.Screen name="sign-up" />
      </Stack>
    </LinearGradient>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  backgroundDecoration: {
    ...StyleSheet.absoluteFillObject,
    overflow: 'hidden',
  },
  circle1: {
    position: 'absolute',
    width: 300,
    height: 300,
    borderRadius: 150,
    top: -50,
    right: -50,
    backgroundColor: 'rgba(255, 69, 0, 0.1)', // Reddit orange with low opacity
  },
  circle2: {
    position: 'absolute',
    width: 200,
    height: 200,
    borderRadius: 100,
    bottom: 100,
    left: -100,
    backgroundColor: 'rgba(255, 69, 0, 0.08)',
  },
  circle3: {
    position: 'absolute',
    width: 250,
    height: 250,
    borderRadius: 125,
    bottom: -50,
    right: -70,
    backgroundColor: 'rgba(255, 69, 0, 0.06)',
  },
})