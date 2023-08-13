import { StatusBar } from "expo-status-bar";
import { useSheet } from "../../context/bottom_sheet/BottomSheetContext";

export default function CustomStatusBar() {
  const { isDarkMode } = useSheet();

  return <StatusBar style={isDarkMode ? "light" : "dark"} />;
}
