import { FC } from "react";
import { Post } from "../interfaces";

import { LinearGradient } from "expo-linear-gradient";

// icons

import { useAuth } from "../context/AuthContext";
import {
  arrayRemove,
  arrayUnion,
  deleteDoc,
  doc,
  serverTimestamp,
  setDoc,
} from "firebase/firestore";
import { firestore } from "../firebase/config";
import { Text, TouchableOpacity, View } from "react-native";
import { Image } from "react-native";
import { useNavigation } from "@react-navigation/native";
import { useToast } from "react-native-toast-notifications";

interface Props {
  image: Post;
  index: number;
}

const ImageCard: FC<Props> = ({ image, index }) => {
  const { user } = useAuth();
  const toast = useToast();
  const { navigate } = useNavigation();
  const postDocRef = doc(firestore, `users/${user?.uid}/saved/${image.id}`);
  const userDocRef = doc(firestore, `users/${user?.uid}`);

  const isSaved = user?.saved?.includes(image.id);

  const saveToDB = async () => {
    await setDoc(
      postDocRef,
      {
        ...image,
        timestamp: serverTimestamp(),
      },
      {
        merge: true,
      }
    );

    await setDoc(
      userDocRef,
      {
        saved: arrayUnion(image.id),
      },
      {
        merge: true,
      }
    );

    toast.show(`${image.title} saved to your profile.`, {
      type: "success",
    });
  };
  const unSaveToDB = async () => {
    await deleteDoc(postDocRef);

    await setDoc(
      userDocRef,
      {
        saved: arrayRemove(image.id),
      },
      {
        merge: true,
      }
    );
    toast.show(`${image.title} removed from your profile.`, {
      type: "danger",
    });
  };

  return (
    <View
      className="p-1"
      style={{
        aspectRatio: index === 0 ? 1 : 0.6,
      }}
    >
      <TouchableOpacity
        // @ts-ignore
        onPress={() => navigate("Wallpaper", { id: image.id })}
        className="relative w-full overflow-hidden rounded-md"
      >
        <LinearGradient
          className="absolute bottom-0 right-0 h-full w-full z-10 rotate-180"
          colors={["#0e0e0f", "rgba(14,14,15,.29)", "rgba(14,14,15,0)"]}
          // locations={[0, 0.26, 0.41]}
        />
        <TouchableOpacity>
          <Image
            // @ts-ignore
            source={{
              uri:
                (image.preview
                  ? image.preview[3] || image.preview[2] || image.preview[1]
                  : image?.thumbnail) ||
                "https://static.vecteezy.com/system/resources/previews/005/337/799/original/icon-image-not-found-free-vector.jpg",
            }}
            className="w-full min-h-[250px] h-full object-center object-cover"
          />
        </TouchableOpacity>
        {image.flair && (
          <View
            className="absolute top-1 left-1 z-10 px-2 py-1 rounded-md"
            style={{
              backgroundColor: image.flair.bgColor,
            }}
          >
            <Text
              className="font-bold"
              style={{
                color: image.flair.textColor === "dark" ? "#333" : "#fff",
                fontSize: 10,
              }}
            >
              {image.flair.text}
            </Text>
          </View>
        )}
        <View className="flex flex-row items-center justify-between absolute bottom-0 left-0 z-10 w-full ">
          <TouchableOpacity
            style={{
              width: user ? "70%" : "100%",
            }}
          >
            <Text
              className="text-sm md:text-base font-bold p-2 text-left  text-white capitalize"
              numberOfLines={1}
            >
              {image.title}
            </Text>
          </TouchableOpacity>
          {user && (
            <TouchableOpacity
              onPress={isSaved ? unSaveToDB : saveToDB}
              className={`${
                isSaved
                  ? "bg-red-600 active:bg-red-900"
                  : "bg-blue-500 active:bg-blue-800"
              }  px-2.5 py-1 rounded-full`}
            >
              <Text className="text-xs text-white font-bold">
                {isSaved ? "Unsave" : "Save"}
              </Text>
            </TouchableOpacity>
          )}
        </View>
        <View className="absolute bottom-0 left-0 z-10 h-1 w-full bg-red-500">
          <View
            className="h-full bg-green-500"
            style={{ width: `${image.ratio}%` }}
          />
        </View>
      </TouchableOpacity>
    </View>
  );
};

export default ImageCard;
