// react
import { useRef, useState } from "react";

// react native
import {
  View,
  Text,
  Image,
  TouchableOpacity,
  TouchableWithoutFeedback,
} from "react-native";

// api + react query
import { useQuery } from "react-query";
import { getSinglePost } from "../axios/getSinglePost";

// auth context
import { useAuth } from "../context/AuthContext";

// firebase
import { firestore } from "../firebase/config";
import {
  arrayRemove,
  arrayUnion,
  deleteDoc,
  doc,
  serverTimestamp,
  setDoc,
} from "firebase/firestore";

// components
import Loading from "../components/Loading";
import Error from "../components/Error";

// icons
import {
  Ionicons,
  Entypo,
  AntDesign,
  MaterialCommunityIcons,
} from "@expo/vector-icons";

// utils
// import { saveImageFromURL } from "../utils";

// bottom sheet
import BottomSheet, { BottomSheetView } from "@gorhom/bottom-sheet";

// toast
import { useToast } from "react-native-toast-notifications";
import { saveImageFromURL } from "../utils";

const Wallpaper = ({ route, navigation }: any) => {
  const [showButtons, setShowButtons] = useState(true);

  const toast = useToast();

  const { id } = route.params;

  const image = useQuery([id], () => {
    if (id) {
      return getSinglePost({ id: id });
    }
  });

  // bottom sheet
  const bottomSheetRef = useRef<BottomSheet>(null);
  const [open, setOpen] = useState(false);

  const toggleBottomSheet = () => {
    setOpen(!open);
    if (open) {
      bottomSheetRef.current?.close();
    } else {
      bottomSheetRef.current?.snapToIndex(0);
    }
  };

  // user
  const { user } = useAuth();

  // firebase
  const postDocRef = doc(
    firestore,
    `users/${user?.uid}/saved/${image?.data?.id}`
  );
  const userDocRef = doc(firestore, `users/${user?.uid}`);
  // eslint-disable-next-line @typescript-eslint/ban-ts-comment
  // @ts-ignore

  const isSaved = user?.saved?.includes(id);

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
        saved: arrayUnion(image.data?.id),
      },
      {
        merge: true,
      }
    );

    toast.show("Image saved to your profile.", {
      type: "success",
    });
  };

  const unSaveToDB = async () => {
    await deleteDoc(postDocRef);

    await setDoc(
      userDocRef,
      {
        saved: arrayRemove(image.data?.id),
      },
      {
        merge: true,
      }
    );
    toast.show("Image removed from your profile.", {
      type: "danger",
    });
  };

  return (
    <>
      <View className="flex-1 relative">
        {showButtons && (
          <View className="absolute top-0 left-0 z-10 p-3 flex-row items-center justify-between w-full">
            <TouchableOpacity
              onPress={navigation.goBack}
              className="h-10 w-10 bg-white rounded-full flex items-center justify-center"
            >
              <Ionicons name="arrow-back-outline" size={20} color="black" />
            </TouchableOpacity>
            <TouchableOpacity
              onPress={toggleBottomSheet}
              className="h-10 w-10 bg-white rounded-full flex items-center justify-center"
            >
              <MaterialCommunityIcons
                name="dots-vertical"
                size={24}
                color="black"
              />
            </TouchableOpacity>
          </View>
        )}
        {image.isLoading && <Loading />}
        {image.isError && <Error text="Try Again" action={image.refetch} />}
        {image.data && (
          <>
            <TouchableWithoutFeedback
              onPress={() => setShowButtons(!showButtons)}
            >
              <Image
                source={{
                  uri: image.data.preview
                    ? image.data.preview[image.data.preview.length - 1].url
                    : image.data.thumbnail,
                }}
                className="w-full h-full"
              />
            </TouchableWithoutFeedback>
            {showButtons && (
              <View className="absolute bottom-5 left-0 p-3 z-10 w-full flex-row items-center justify-around">
                <TouchableOpacity
                  disabled={!user}
                  className="h-10 w-10 bg-white rounded-lg flex items-center justify-center"
                  onPress={
                    user
                      ? isSaved
                        ? unSaveToDB
                        : saveToDB
                      : () => {
                          toast.show("You're not logged in", {
                            type: "danger",
                          });
                        }
                  }
                >
                  <Entypo
                    name="heart"
                    size={20}
                    color={isSaved ? "red" : "black"}
                  />
                </TouchableOpacity>
                <TouchableOpacity
                  className="h-10 bg-white rounded-lg flex items-center justify-center w-40"
                  onPress={() => {
                    toast.show("We're working on this feature", {
                      type: "danger",
                    });
                  }}
                >
                  <Text className="font-bold">Apply Wallpaper</Text>
                </TouchableOpacity>
                <TouchableOpacity
                  className="h-10 w-10 bg-blue-500 rounded-lg flex items-center justify-center"
                  // onPress={() => {
                  //   toast.show("We're working on this feature", {
                  //     type: "danger",
                  //   });
                  // }}
                  onPress={() => {
                    if (image?.data?.url)
                      saveImageFromURL(image?.data?.url, image?.data?.title);
                  }}
                >
                  <Entypo name="download" size={20} color="white" />
                </TouchableOpacity>
              </View>
            )}
          </>
        )}
      </View>

      {open && (
        <TouchableOpacity
          onPress={toggleBottomSheet}
          className="absolute inset-0 h-full w-full bg-black/50"
        />
      )}
      <BottomSheet
        ref={bottomSheetRef}
        snapPoints={["50%"]}
        index={open ? 0 : -1}
        enablePanDownToClose={true}
        onClose={() => setOpen(false)}
      >
        <BottomSheetView
          style={{
            padding: 10,
          }}
        >
          <View className="flex-row items-center justify-between">
            <Text className="font-bold text-xl">Info</Text>
            <TouchableOpacity
              onPress={toggleBottomSheet}
              className="h-10 aspect-square rounded-full items-center justify-center bg-slate-900 "
            >
              <AntDesign name="close" size={20} color="#fff" />
            </TouchableOpacity>
          </View>
          <View
            className="py-3"
            style={{
              rowGap: 10,
            }}
          >
            <View className="flex-row items-center justify-between w-full">
              <Text className="text-base font-bold">Name</Text>
              <Text className="text-base">{image.data?.title}</Text>
            </View>
            <View className="flex-row items-center justify-between w-full">
              <Text className="text-base font-bold">SubReddit</Text>
              <Text className="text-base">{image.data?.subreddit}</Text>
            </View>
            <View className="flex-row items-center justify-between w-full">
              <Text className="text-base font-bold">Author Name</Text>
              <Text className="text-base">{image.data?.author}</Text>
            </View>
            <View className="flex-row items-center justify-between w-full">
              <Text className="text-base font-bold">Up votes</Text>
              <Text className="text-base">{image.data?.ups}</Text>
            </View>
            <View className="flex-row items-center justify-between w-full">
              <Text className="text-base font-bold">Down votes</Text>
              <Text className="text-base">{image.data?.downs}</Text>
            </View>
            {image.data?.flair && (
              <View className="flex-row items-center justify-between w-full">
                <Text className="text-base font-bold">Author Name</Text>
                <View
                  className="px-2 py-1 rounded-md font-bold"
                  style={{
                    backgroundColor: image.data.flair.bgColor,
                  }}
                >
                  <Text
                    style={{
                      color:
                        image.data.flair.textColor === "dark" ? "#333" : "#fff",
                      fontSize: 10,
                    }}
                  >
                    {image.data.flair.text}
                  </Text>
                </View>
              </View>
            )}
          </View>
        </BottomSheetView>
      </BottomSheet>
    </>
  );
};

export default Wallpaper;
