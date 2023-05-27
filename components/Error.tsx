import { View, Text, Image, TouchableOpacity } from "react-native";

interface Props {
  text: string;
  action: () => void;
}

const Error = ({ text, action }: Props) => {
  return (
    <View className="flex-1 flex items-center justify-center w-full h-full gap-y-2 bg-white">
      <Image
        source={require("../assets/error.png")}
        className="h-30 w-80"
        resizeMode="contain"
      />
      <Text className="font-bold w-full text-center text-xl">We‘re sorry</Text>
      <Text className="text-gray-700 text-center text-sm w-[70%] mb-5">
        We're sorry, we were unable to load the data from our servers. Please
        check your internet connection and try again later.
      </Text>
      <TouchableOpacity
        onPress={action}
        className="bg-pink-600 py-3 rounded-md w-36"
        style={{
          backgroundColor: "#EA4C89",
        }}
      >
        <Text className="font-bold w-full text-md text-center text-white">
          {text}
        </Text>
      </TouchableOpacity>
    </View>
  );
};

export default Error;
