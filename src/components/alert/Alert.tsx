import { View, Text, Platform } from "react-native";
import { useAlert } from "../../context/alert/AlertContext";
import { AntDesign, MaterialIcons, Feather } from "@expo/vector-icons";

export default function Alert() {
  const { alertType, message, showAlert } = useAlert();

  let backgroundStyle;
  let textStyle;
  let iconType;
  let borderColor;

  switch (alertType) {
    case "success":
      backgroundStyle = "bg-successAlert";
      textStyle = "#0e610e";
      iconType = <AntDesign name="checkcircleo" size={22} color={textStyle} />;
      break;
    case "error":
      backgroundStyle = "bg-[#f76b6b]";
      textStyle = "#fff";
      borderColor = "transparent";
      iconType = (
        <MaterialIcons name="error-outline" size={22} color={textStyle} />
      );
      break;
    case "warning":
      backgroundStyle = "bg-warningAlert";
      textStyle = "#4b4b12";
      iconType = <AntDesign name="warning" size={22} color={textStyle} />;
      break;
    case "info":
      backgroundStyle = "bg-infoAlert";
      textStyle = "#0e0e44";
      borderColor = "#0c0c46";
      iconType = <Feather name="info" size={22} color={textStyle} />;
      break;
    default:
      return null;
  }

  return (
    <View style={{ paddingHorizontal: 16 }}>
      {showAlert ? (
        <View
          className={backgroundStyle}
          style={[
            {
              position: "absolute",
              bottom: Platform.OS === "ios" ? 730 : 70,
              left: 16,
              right: 16,
              borderRadius: 8,
              borderWidth: 0.2,
              borderColor: textStyle,
            },
          ]}
        >
          <View
            style={{ flexDirection: "row", alignItems: "center", padding: 12 }}
          >
            {iconType}
            <Text
              className="font-bold"
              style={{
                color: textStyle,
                fontWeight: "bold",
                fontSize: 16,
                marginLeft: 8,
              }}
            >
              {message}
            </Text>
          </View>
        </View>
      ) : null}
    </View>
  );
}
