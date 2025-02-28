import * as React from 'react'
import { Text, TextInput, TouchableOpacity, View, StyleSheet, Animated, Image, Alert } from 'react-native'
import { useSignIn } from '@clerk/clerk-expo'
import { useRouter, Link } from 'expo-router'
import { Colors } from '../../constants/Colors'
import { LinearGradient } from 'expo-linear-gradient'
import { MaterialIcons } from '@expo/vector-icons'

// Helper function to validate email format
const isValidEmail = (email: string): boolean => {
    if (!email.includes('@')) {
        return false;
    }
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
}

// Helper function to validate username format (alphanumeric and underscores)
const isValidUsername = (username: string): boolean => {
    const usernameRegex = /^[a-zA-Z0-9_]+$/
    return usernameRegex.test(username)
}

export default function SignInScreen() {
    const { isLoaded, signIn, setActive } = useSignIn()
    const router = useRouter()

    const [identifier, setIdentifier] = React.useState('')
    const [password, setPassword] = React.useState('')
    const [showPassword, setShowPassword] = React.useState(false)
    const [loading, setLoading] = React.useState(false)

    // Animation values
    const fadeAnim = React.useRef(new Animated.Value(0)).current
    const slideAnim = React.useRef(new Animated.Value(50)).current

    React.useEffect(() => {
        // Start animations when component mounts
        Animated.parallel([
            Animated.timing(fadeAnim, {
                toValue: 1,
                duration: 800,
                useNativeDriver: true,
            }),
            Animated.timing(slideAnim, {
                toValue: 0,
                duration: 800,
                useNativeDriver: true,
            })
        ]).start()
    }, [])

    // Handle sign-in with email or username and password
    const onSignInPress = async () => {
        if (!isLoaded) {
            return
        }

        // Validation for identifier
        if (!identifier) {
            Alert.alert("Error", "Please enter your email or username.")
            return
        }

        if (!isValidEmail(identifier) && !isValidUsername(identifier)) {
            Alert.alert("Error", "Please enter a valid email or username.")
            return
        }

        setLoading(true)
        try {
            const completeSignIn = await signIn.create({
                identifier,
                password,
            })

            // This indicates the user is signed in
            await setActive({ session: completeSignIn.createdSessionId })
            router.replace('/')
        } catch (err) {
            console.error(JSON.stringify(err, null, 2))
        } finally {
            setLoading(false)
        }
    }

    return (
        <View style={styles.container}>
            <Animated.View
                style={[
                    styles.card,
                    { opacity: fadeAnim, transform: [{ translateY: slideAnim }] }
                ]}
            >
                <Image
                    source={{ uri: 'https://www.redditstatic.com/desktop2x/img/snoo_discovery.png' }}
                    style={styles.logo}
                    resizeMode="contain"
                />
                <Text style={styles.title}>Welcome Back</Text>
                <Text style={styles.subtitle}>Log in to your Reddit Clone account</Text>

                <View style={styles.inputContainer}>
                    <MaterialIcons name="person" size={20} color={Colors.textSecondary} style={styles.inputIcon} />
                    <TextInput
                        style={styles.input}
                        autoCapitalize="none"
                        value={identifier}
                        placeholder="Email or Username"
                        placeholderTextColor={Colors.textSecondary}
                        onChangeText={(text) => setIdentifier(text)}
                    />
                </View>

                <View style={styles.inputContainer}>
                    <MaterialIcons name="lock" size={20} color={Colors.textSecondary} style={styles.inputIcon} />
                    <TextInput
                        style={[styles.input, { flex: 1 }]}
                        value={password}
                        placeholder="Password"
                        placeholderTextColor={Colors.textSecondary}
                        secureTextEntry={!showPassword}
                        onChangeText={(password) => setPassword(password)}
                    />
                    <TouchableOpacity onPress={() => setShowPassword(!showPassword)} style={styles.eyeIcon}>
                        <MaterialIcons
                            name={showPassword ? "visibility" : "visibility-off"}
                            size={20}
                            color={Colors.textSecondary}
                        />
                    </TouchableOpacity>
                </View>

                <TouchableOpacity
                    style={[styles.button, loading && styles.buttonDisabled]}
                    onPress={onSignInPress}
                    disabled={loading}
                >
                    <LinearGradient
                        colors={[Colors.primary, '#FF6C44']}
                        style={styles.gradient}
                        start={{ x: 0, y: 0 }}
                        end={{ x: 1, y: 0 }}
                    >
                        <Text style={styles.buttonText}>
                            {loading ? 'Signing in...' : 'Sign In'}
                        </Text>
                    </LinearGradient>
                </TouchableOpacity>

                <View style={styles.footer}>
                    <Text style={styles.footerText}>Don't have an account?</Text>
                    <Link href="/sign-up" asChild>
                        <TouchableOpacity>
                            <Text style={styles.link}>Sign Up</Text>
                        </TouchableOpacity>
                    </Link>
                </View>
            </Animated.View>
        </View>
    )
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        padding: 20,
        justifyContent: 'center',
        backgroundColor: Colors.background,
    },
    card: {
        backgroundColor: Colors.inputBackground,
        padding: 25,
        borderRadius: 16,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 5 },
        shadowOpacity: 0.3,
        shadowRadius: 10,
        elevation: 8,
        alignItems: 'center',
        borderWidth: 1,
        borderColor: Colors.border,
    },
    logo: {
        width: 80,
        height: 80,
        marginBottom: 20,
    },
    title: {
        fontSize: 26,
        fontWeight: 'bold',
        color: Colors.text,
        marginBottom: 8,
        textAlign: 'center',
    },
    subtitle: {
        fontSize: 14,
        color: Colors.textSecondary,
        marginBottom: 24,
        textAlign: 'center',
    },
    inputContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: Colors.background,
        borderRadius: 12,
        marginBottom: 16,
        borderWidth: 1,
        borderColor: Colors.border,
        paddingHorizontal: 15,
        height: 55,
        width: '100%',
    },
    inputIcon: {
        marginRight: 10,
    },
    eyeIcon: {
        padding: 10,
    },
    input: {
        flex: 1,
        color: Colors.text,
        fontSize: 16,
        height: '100%',
    },
    button: {
        width: '100%',
        borderRadius: 25,
        overflow: 'hidden',
        marginTop: 10,
        height: 55,
    },
    buttonDisabled: {
        opacity: 0.7,
    },
    gradient: {
        width: '100%',
        height: '100%',
        justifyContent: 'center',
        alignItems: 'center',
    },
    buttonText: {
        color: Colors.background,
        fontSize: 16,
        fontWeight: '600',
    },
    footer: {
        flexDirection: 'row',
        justifyContent: 'center',
        alignItems: 'center',
        marginTop: 25,
        gap: 5,
    },
    footerText: {
        color: Colors.textSecondary,
    },
    link: {
        color: Colors.primary,
        fontWeight: '600',
    },
})