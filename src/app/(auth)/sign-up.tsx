import * as React from 'react'
import { Text, TextInput, TouchableOpacity, View, StyleSheet, Animated, Image, Platform } from 'react-native'
import { useSignUp } from '@clerk/clerk-expo'
import { useRouter, Link } from 'expo-router'
import { Colors } from '../../constants/Colors'
import { LinearGradient } from 'expo-linear-gradient'
import { MaterialIcons } from '@expo/vector-icons'

export default function SignUpScreen() {
    const { isLoaded, signUp, setActive } = useSignUp()
    const router = useRouter()

    const [emailAddress, setEmailAddress] = React.useState('')
    const [username, setUsername] = React.useState('')
    const [password, setPassword] = React.useState('')
    const [showPassword, setShowPassword] = React.useState(false)

    const [pendingVerification, setPendingVerification] = React.useState(false)
    const [code, setCode] = React.useState('')
    const inputRefs = React.useRef<Array<TextInput | null>>([])

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
    }, [pendingVerification])

    // Handle submission of sign-up form
    const onSignUpPress = async () => {
        if (!isLoaded) return

        // Start sign-up process using email and password provided
        try {
            await signUp.create({
                emailAddress,
                username,
                password,
            })

            // Send user an email with verification code
            await signUp.prepareEmailAddressVerification({ strategy: 'email_code' })

            // Set 'pendingVerification' to true to display second form
            // and capture OTP code
            setPendingVerification(true)
        } catch (err) {
            // See https://clerk.com/docs/custom-flows/error-handling
            // for more info on error handling
            console.error(JSON.stringify(err, null, 2))
        }
    }

    // Handle submission of verification form
    const onVerifyPress = async () => {
        if (!isLoaded) return

        try {
            // Use the code the user provided to attempt verification
            const signUpAttempt = await signUp.attemptEmailAddressVerification({
                code,
            })

            // If verification was completed, set the session to active
            // and redirect the user
            if (signUpAttempt.status === 'complete') {
                await setActive({ session: signUpAttempt.createdSessionId })
                router.replace('/')
            } else {
                // If the status is not complete, check why. User may need to
                // complete further steps.
                console.error(JSON.stringify(signUpAttempt, null, 2))
            }
        } catch (err) {
            // See https://clerk.com/docs/custom-flows/error-handling
            // for more info on error handling
            console.error(JSON.stringify(err, null, 2))
        }
    }

    const handleCodeInput = (index: number, value: string) => {
        const newCode = code.split('');
        
        // Handle deletion
        if (!value) {
            newCode[index] = '';
            setCode(newCode.join(''));
            if (index > 0) {
                inputRefs.current[index - 1]?.focus();
            }
            return;
        }
        
        // Handle new input
        newCode[index] = value;
        setCode(newCode.join(''));
        
        // Move to next input if available
        if (index < 5) {
            inputRefs.current[index + 1]?.focus();
        }
    }

    const renderContent = () => {
        if (pendingVerification) {
            return (
                <Animated.View style={[styles.card, { opacity: fadeAnim, transform: [{ translateY: slideAnim }] }]}>
                    <Image 
                        source={{ uri: 'https://www.redditstatic.com/desktop2x/img/snoo_discovery.png' }}
                        style={styles.logo}
                        resizeMode="contain"
                    />
                    <Text style={styles.title}>Verify your email</Text>
                    <Text style={styles.subtitle}>We sent you a verification code to your email</Text>
                    
                    <View style={styles.codeContainer}>
                        {[0, 1, 2, 3, 4, 5].map((index) => (
                            <TextInput
                                key={index}
                                style={styles.codeInput}
                                maxLength={1}
                                keyboardType="number-pad"
                                value={code[index] || ''}
                                onChangeText={(value) => handleCodeInput(index, value)}
                                onKeyPress={({ nativeEvent }) => {
                                    if (nativeEvent.key === 'Backspace' && !code[index] && index > 0) {
                                        // Clear previous input and move focus back
                                        const newCode = code.split('');
                                        newCode[index - 1] = '';
                                        setCode(newCode.join(''));
                                        inputRefs.current[index - 1]?.focus();
                                    }
                                }}
                                ref={(el) => (inputRefs.current[index] = el)}
                            />
                        ))}
                    </View>
                    
                    <TouchableOpacity style={styles.button} onPress={onVerifyPress}>
                        <LinearGradient
                            colors={[Colors.primary, '#FF6C44']}
                            style={styles.gradient}
                            start={{ x: 0, y: 0 }}
                            end={{ x: 1, y: 0 }}
                        >
                            <Text style={styles.buttonText}>Verify Email</Text>
                        </LinearGradient>
                    </TouchableOpacity>
                </Animated.View>
            )
        }

        return (
            <Animated.View style={[styles.card, { opacity: fadeAnim, transform: [{ translateY: slideAnim }] }]}>
                <Image 
                    source={{ uri: 'https://www.redditstatic.com/desktop2x/img/snoo_discovery.png' }}
                    style={styles.logo}
                    resizeMode="contain"
                />
                <Text style={styles.title}>Join Reddit Clone</Text>
                <Text style={styles.subtitle}>Create your account to start exploring</Text>

                <View style={styles.inputContainer}>
                    <MaterialIcons name="email" size={20} color={Colors.textSecondary} style={styles.inputIcon} />
                    <TextInput
                        style={styles.input}
                        autoCapitalize="none"
                        value={emailAddress}
                        placeholder="Email"
                        placeholderTextColor={Colors.textSecondary}
                        onChangeText={(email) => setEmailAddress(email)}
                    />
                </View>
                
                <View style={styles.inputContainer}>
                    <MaterialIcons name="person" size={20} color={Colors.textSecondary} style={styles.inputIcon} />
                    <TextInput
                        style={styles.input}
                        value={username}
                        placeholder="Username"
                        placeholderTextColor={Colors.textSecondary}
                        onChangeText={(username) => setUsername(username)}
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
                
                <TouchableOpacity style={styles.button} onPress={onSignUpPress}>
                    <LinearGradient
                        colors={[Colors.primary, '#FF6C44']}
                        style={styles.gradient}
                        start={{ x: 0, y: 0 }}
                        end={{ x: 1, y: 0 }}
                    >
                        <Text style={styles.buttonText}>Create Account</Text>
                    </LinearGradient>
                </TouchableOpacity>

                <View style={styles.footer}>
                    <Text style={styles.footerText}>Already have an account?</Text>
                    <Link href="/sign-in" asChild>
                        <TouchableOpacity>
                            <Text style={styles.link}>Log In</Text>
                        </TouchableOpacity>
                    </Link>
                </View>
            </Animated.View>
        )
    }

    return (
        <View style={styles.container}>
            {renderContent()}
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
    codeContainer: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        width: '100%',
        marginBottom: 20,
    },
    codeInput: {
        width: 45,
        height: 50,
        borderRadius: 8,
        backgroundColor: Colors.background,
        borderWidth: 1,
        borderColor: Colors.border,
        textAlign: 'center',
        fontSize: 20,
        fontWeight: 'bold',
        color: Colors.primary,
    },
})