import { useEffect, useState, FC, Dispatch, SetStateAction } from "react";
import { subReddits } from "../constants/subReddits";
import { useAuth } from "../context/AuthContext";

import {
  Image,
  View,
  Text,
  TouchableOpacity,
  ScrollView,
  FlatList,
} from "react-native";

import { getSubredditInfo } from "../axios/getSubredditInfo";
import { SubReddit } from "../interfaces";
import { useNavigation } from "@react-navigation/native";
interface Props {
  showBottomBar?: boolean;
  subReddit?: string;
  setSubReddit?: Dispatch<SetStateAction<string>>;
}

const Header: FC<Props> = ({ subReddit, setSubReddit, showBottomBar }) => {
  const { user, login } = useAuth();
  const { navigate } = useNavigation();

  const [subRedditsData, setSubRedditsData] = useState<(SubReddit | null)[]>(
    []
  );
  useEffect(() => {
    const getData = async () => {
      const promises = subReddits.map((r) => getSubredditInfo(r));
      const data = await Promise.all(promises);
      setSubRedditsData(data);
    };

    getData();
  }, []);

  return (
    <>
      <View className="flex flex-row w-full items-center p-2 justify-between">
        <TouchableOpacity
          onPress={() =>
            // @ts-ignore
            navigate("Home")
          }
        >
          <Image
            source={require("../assets/logo.png")}
            alt="title"
            className="h-8 w-[120px] origin-left"
            resizeMode="contain"
          />
        </TouchableOpacity>
        {user ? (
          <TouchableOpacity
            //@ts-ignore
            onPress={() => navigate("Profile")}
          >
            <Image
              source={{
                uri: user?.photoURL || "",
              }}
              className="h-9 aspect-square rounded-full"
            />
          </TouchableOpacity>
        ) : (
          <TouchableOpacity
            className=" bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:ring-blue-300 rounded-lg px-5 py-2 dark:bg-blue-600 dark:hover:bg-blue-700 focus:outline-none dark:focus:ring-blue-800"
            // @ts-ignore
            onPress={() => navigate("Login")}
          >
            <Text className="text-white font-medium  text-sm">Login</Text>
          </TouchableOpacity>
        )}
      </View>
      {showBottomBar && (
        <View className="p-2">
          <FlatList
            horizontal
            snapToInterval={168}
            data={subRedditsData}
            keyExtractor={(_, index) => String(index)}
            renderItem={({ item }) =>
              item ? (
                <View
                  key={item?.id}
                  className="relative md:h-12 w-40 h-10 snap-start flex-shrink-0 mr-2"
                >
                  <TouchableOpacity
                    onPress={() => {
                      if (setSubReddit) setSubReddit(item.subreddit);
                    }}
                    className="relative h-full flex items-center justify-center overflow-hidden rounded-md bg-black"
                  >
                    <Text
                      className={`font-bold text-sm  ${
                        item.subreddit === subReddit
                          ? "text-white"
                          : "text-gray-500"
                      }`}
                    >
                      {item.displayName}
                    </Text>
                    <Image
                      className={`absolute inset-0 -z-10 w-full h-full ${
                        item.subreddit === subReddit
                          ? "opacity-70"
                          : "opacity-30"
                      }`}
                      source={{
                        uri:
                          item.mobileBannerImage ||
                          "https://img.freepik.com/free-vector/night-ocean-landscape-full-moon-stars-shine_107791-7397.jpg",
                      }}
                      alt={item.displayName}
                    />
                  </TouchableOpacity>
                </View>
              ) : null
            }
          />
        </View>
      )}
    </>
  );
};

export default Header;
