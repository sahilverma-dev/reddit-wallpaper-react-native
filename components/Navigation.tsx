import { StatusBar } from "react-native";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { NavigationContainer } from "@react-navigation/native";
import Home from "../pages/Home";
import Wallpaper from "../pages/Wallpaper";
import Login from "../pages/Login";
import Profile from "../pages/Profile";
import { useAuth } from "../context/AuthContext";
import Loading from "./Loading";
import { useEffect, useState } from "react";
import { GoogleAuthProvider, signInWithCredential } from "firebase/auth";
import { auth } from "../firebase/config";
import { useToast } from "react-native-toast-notifications";

const Stack = createNativeStackNavigator();

const Navigation = () => {
  const toast = useToast();
  const { user } = useAuth();
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const loadUser = async () => {
      try {
        setIsLoading(true);
        const payload = await AsyncStorage.getItem("payload");
        if (payload) {
          const parsedPayload = JSON.parse(payload);
          const credentials = GoogleAuthProvider.credential(
            parsedPayload.idToken,
            parsedPayload.accessToken
          );
          await signInWithCredential(auth, credentials);
        }
      } catch (error: any) {
        console.log(JSON.stringify(error));
        if (error.code === "auth/invalid-credential") {
          toast.show("Please log in again as your session has expired.", {
            type: "warning",
          });
        }
      } finally {
        setIsLoading(false);
      }
    };

    loadUser();
  }, []);

  return (
    <NavigationContainer>
      <StatusBar />
      {isLoading ? (
        <Loading />
      ) : (
        <Stack.Navigator
          initialRouteName={user ? "Home" : "Login"}
          screenOptions={{
            headerShown: false,
          }}
        >
          <Stack.Screen name="Home" component={Home} />
          <Stack.Screen name="Wallpaper" component={Wallpaper} />
          {user ? (
            <>
              <Stack.Screen name="Profile" component={Profile} />
            </>
          ) : (
            <>
              <Stack.Screen name="Login" component={Login} />
            </>
          )}
        </Stack.Navigator>
      )}
    </NavigationContainer>
  );
};

export default Navigation;
