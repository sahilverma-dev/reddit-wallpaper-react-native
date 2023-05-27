import { View } from "react-native";

import { ActivityIndicator } from "react-native";

const Loading = () => {
  return (
    <View className="flex-1 items-center justify-center">
      <ActivityIndicator size={"large"} color="#e95000" />
    </View>
  );
};

export default Loading;
