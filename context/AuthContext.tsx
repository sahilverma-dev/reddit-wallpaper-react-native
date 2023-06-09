import {
  GoogleAuthProvider,
  onAuthStateChanged,
  signInWithCredential,
  signOut,
} from "firebase/auth";
import { doc, onSnapshot } from "firebase/firestore";
import { createContext, useContext, useState, useEffect, FC } from "react";
import Loading from "../components/Loading";

import * as Google from "expo-auth-session/providers/google";

import { auth, firestore } from "../firebase/config";

// interfaces
import { AuthContextReturnType, AuthProviderType, IUser } from "../interfaces";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { useToast } from "react-native-toast-notifications";
import { clientId } from "@env";

const AuthContext = createContext<AuthContextReturnType | null>(null);

const AuthProvider = ({ children }: AuthProviderType) => {
  const [user, setUser] = useState<IUser | null>(null);
  const [loading, setLoading] = useState(false);
  const toast = useToast();

  useEffect(() => {
    const unsub = onAuthStateChanged(auth, async (user) => {
      if (user) {
        await AsyncStorage.setItem("user", JSON.stringify(user));
        const userDocRef = doc(firestore, `users/${user?.uid}`);
        onSnapshot(userDocRef, (snap) => {
          // eslint-disable-next-line @typescript-eslint/ban-ts-comment
          // @ts-ignore
          setUser({
            ...user,
            saved: snap?.data()?.saved,
          });
        });
        toast.show(`Welcome ${user.displayName}`, {
          type: "success",
        });
      } else setUser(null);
      setLoading(true);
    });

    return unsub;
  }, []);

  const [_, response, promptAsync] = Google.useAuthRequest({
    expoClientId: "##########################",
    androidClientId: "##########################",
  });

  useEffect(() => {
    const getData = async () => {
      if (response?.type === "success") {
        const payload = {
          idToken: response.authentication?.idToken,
          accessToken: response.authentication?.accessToken,
        };
        const credentials = GoogleAuthProvider.credential(
          payload.idToken,
          payload.accessToken
        );
        await signInWithCredential(auth, credentials);
      }
    };

    getData();
  }, [response]);

  const googleLogin = () => promptAsync();

  const logout = async () => {
    await AsyncStorage.removeItem("user");
    setUser(null);
    signOut(auth);
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        setUser,
        logout,
        googleLogin,
      }}
    >
      {loading ? children : <Loading />}
    </AuthContext.Provider>
  );
};

const useAuth = () => {
  const context = useContext(AuthContext);
  if (context) {
    return context;
  } else {
    throw new Error("Something is wrong with auth context");
  }
};

export { AuthProvider, useAuth };
