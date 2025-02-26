import { Text,View } from "react-native";
import { Link } from "expo-router";

export default function HomeScreen() {
  return (
    <View >
        <Link href="about">About</Link>
      <Text >Home Screen</Text>
    </View>
  );
}
