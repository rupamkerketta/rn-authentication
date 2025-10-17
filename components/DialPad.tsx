import { Ionicons } from "@expo/vector-icons";
import {
  Dimensions,
  FlatList,
  Text,
  TouchableOpacity,
  View,
} from "react-native";

const { width } = Dimensions.get("window");
const dialPadSize = width * 0.2;
const dialPadTextSize = dialPadSize * 0.4;
const _spacing = 20;

const DIAL_PAD_BUTTONS = [1, 2, 3, 4, 5, 6, 7, 8, 9, "", 0, "del"];

const DialPad = ({
  onPress,
}: {
  onPress: (item: (typeof DIAL_PAD_BUTTONS)[number]) => void;
}) => {
  return (
    <FlatList
      numColumns={3}
      data={DIAL_PAD_BUTTONS}
      style={{ flexGrow: 0 }}
      keyExtractor={(_, index) => index.toString()}
      scrollEnabled={false}
      columnWrapperStyle={{ gap: _spacing }}
      contentContainerStyle={{ gap: _spacing }}
      renderItem={({ item }) => {
        return (
          <TouchableOpacity
            disabled={item === ""}
            onPress={() => {
              onPress(item);
            }}
          >
            <View
              style={{
                width: dialPadSize,
                height: dialPadSize,
                borderRadius: dialPadSize,
                borderWidth: typeof item !== "number" ? 0 : 1,
                borderColor: "#e5e7eb",
                backgroundColor:
                  typeof item !== "number" ? "transparent" : "#e5e7eb",
              }}
              className="items-center justify-center"
            >
              {item === "del" ? (
                <Ionicons
                  name="backspace-outline"
                  color={"black"}
                  size={dialPadTextSize}
                />
              ) : (
                <Text style={{ fontSize: dialPadTextSize }}>{item}</Text>
              )}
            </View>
          </TouchableOpacity>
        );
      }}
    />
  );
};

export default DialPad;
