// react
import { useEffect } from "react";

// react native
import {
  View,
  Text,
  TouchableOpacity,
  StatusBar,
  StyleSheet,
} from "react-native";

// icon
import { AntDesign } from "@expo/vector-icons";

// context
import { useAuth } from "../context/AuthContext";

// react native reanimate
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withTiming,
  withDelay,
} from "react-native-reanimated";

const Login = ({ navigation }: any) => {
  const { googleLogin } = useAuth();
  const scaleValue = useSharedValue(1);

  const imageStyle = useAnimatedStyle(() => {
    return {
      transform: [{ scale: scaleValue.value }],
    };
  });

  useEffect(() => {
    scaleValue.value = withTiming(1.2, { duration: 20000 });
  }, []);

  useEffect(() => {
    if (scaleValue.value === 1.2) {
      scaleValue.value = withDelay(1000, withTiming(1, { duration: 20000 }));
    }
  }, [scaleValue.value]);

  const login = () => {
    googleLogin();
    // @ts-ignore
    // navigation.navigate("Home");
  };

  return (
    <View className="flex-1 bg-slate-900">
      <StatusBar hidden />
      <Animated.Image
        source={require("../assets/login.png")}
        style={[styles.backgroundImage, imageStyle]}
      />
      <View className="absolute inset-0 h-full w-full p-3 flex-1 items-center">
        <View className="flex-1" />
        <Text className="text-gray-300 text-xl mb-2">Mobile</Text>
        <Text className="text-white text-4xl mb-2 font-bold">Wallpaper</Text>
        <TouchableOpacity
          onPress={login}
          className="flex-row items-center bg-red-600 px-20 py-3 rounded-full my-4"
        >
          <AntDesign name="google" size={20} color="#fff" />
          <Text className="text-white font-bold text-xl ml-2">
            Login with Google
          </Text>
        </TouchableOpacity>
        <TouchableOpacity
          className="mb-3"
          onPress={() => navigation.navigate("Home")}
        >
          <Text className="text-gray-300">Skip</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  backgroundImage: {
    width: "100%",
    height: "100%",
  },
});

export default Login;
