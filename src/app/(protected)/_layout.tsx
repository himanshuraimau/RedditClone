import { Redirect, Stack } from 'expo-router'
import { useAuth } from '@clerk/clerk-expo'
import { View } from 'react-native'
import { AntDesign, Entypo, MaterialIcons } from '@expo/vector-icons'

export default function AppLayout() {
    const { isSignedIn } = useAuth()


    if (!isSignedIn) {
        return <Redirect href="/sign-in" />
    }
    return (
        <Stack>
            <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
            <Stack.Screen name="post/[id]"
                options={{
                    headerTitle: '',
                    headerStyle: {
                        backgroundColor: '#FF4500',
                         // Reddit's orange color
                    },
                    headerShadowVisible: true, // This enables the header shadow
                    headerLeft: () => <AntDesign name="left" size={24} color="white" />,
                    headerRight: () => (
                        <View style={{ flexDirection: 'row', justifyContent: 'space-between', width: 90, marginRight: 10 }}>
                            <AntDesign name="search1" size={24} color="white" />
                            <MaterialIcons name="sort" size={24} color="white" />
                            <Entypo name="dots-three-horizontal" size={24} color="white" />
                        </View>
                    ),
                    animation: 'slide_from_bottom',
                }} />

        </Stack>
    )

}