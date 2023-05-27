// react
import { useState, useEffect } from "react";

// react native
import { View, Text, TouchableOpacity } from "react-native";

// context
import { useAuth } from "../context/AuthContext";

// components
import Loading from "../components/Loading";
import ImageCard from "../components/ImageCard";
import Header from "../components/Header";

// interfaces
import { Post } from "../interfaces";

// firebase
import { firestore } from "../firebase/config";
import { collection, onSnapshot } from "firebase/firestore";

// masonry
import MasonryList from "@react-native-seoul/masonry-list";

const Profile = () => {
  const { user, logout } = useAuth();
  const [isLoading, setIsLoading] = useState(true);
  const [images, setImages] = useState<Post[]>([]);
  const savedDocRef = collection(firestore, `users/${user?.uid}/saved`);

  const getData = async () => {
    try {
      setIsLoading(true);
      return onSnapshot(savedDocRef, (snap) => {
        setImages(
          // eslint-disable-next-line @typescript-eslint/ban-ts-comment
          // @ts-ignore
          snap.docs?.reverse()?.map((doc) => ({
            ...doc.data(),
          }))
        );
      });
    } catch (error) {
      console.log(error);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    getData();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [user]);

  return (
    <View className="flex-1">
      <Header showBottomBar={false} />
      <View className="p-2 w-full flex-row items-center justify-between">
        <Text className="font-bold">Hello {user?.displayName}</Text>
        <TouchableOpacity onPress={logout}>
          <Text className="font-bold text-red-500">Logout</Text>
        </TouchableOpacity>
      </View>
      {isLoading && <Loading />}
      {images && !isLoading && (
        <MasonryList
          containerStyle={{
            padding: 5,
          }}
          onRefresh={getData}
          // @ts-ignore
          data={images}
          keyExtractor={(item) => item.id}
          // @ts-ignore
          renderItem={({ item, i }) => <ImageCard image={item} index={i} />}
        />
      )}
    </View>
  );
};

export default Profile;
