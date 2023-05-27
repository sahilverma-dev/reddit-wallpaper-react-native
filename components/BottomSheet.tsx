import "react-native-gesture-handler";
import { StatusBar } from "expo-status-bar";
import {
  Button,
  Pressable,
  StyleSheet,
  Switch,
  Text,
  useWindowDimensions,
  View,
} from "react-native";
import { BottomSheetModal, BottomSheetView } from "@gorhom/bottom-sheet";
import { useRef, useState } from "react";
import { AntDesign } from "@expo/vector-icons";
import { Entypo } from "@expo/vector-icons";

export default function BottomSheet() {
  const [darkmode, setDarkmode] = useState(false);
  const [device, setDevice] = useState(false);
  const { width } = useWindowDimensions();
  const [theme, setTheme] = useState("dim");
  const [isOpen, setIsOpen] = useState(false);

  const bottomSheetModalRef = useRef<BottomSheetModal>(null);

  const snapPoints = ["25%", "48%", "75%"];

  function handlePresentModal() {
    bottomSheetModalRef.current?.present();
    setTimeout(() => {
      setIsOpen(true);
    }, 100);
  }

  return (
    <BottomSheetModal
      ref={bottomSheetModalRef}
      index={1}
      snapPoints={snapPoints}
      backgroundStyle={{ borderRadius: 50 }}
      onDismiss={() => setIsOpen(false)}
      enablePanDownToClose
    >
      <BottomSheetView>
        <Text>Hello</Text>
      </BottomSheetView>
    </BottomSheetModal>
  );
}
