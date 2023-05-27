import { View, Text, ActivityIndicator } from "react-native";

const Loader = () => {
  return (
    <View className="flex-1 flex items-center justify-center w-full h-full gap-y-2">
      <ActivityIndicator color="#EA4C89" size="large" />
      <Text className="font-bold w-full text-center text-xl">Loading ...</Text>
    </View>
  );
};

export default Loader;
