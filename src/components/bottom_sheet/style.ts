import { StyleSheet } from "react-native";

export const styles = StyleSheet.create({
  bottomSheetWrap: {
    padding: 15,
    zIndex: 20,
  },
  bottomSheetItem: {
    flexDirection: "row",
    justifyContent: "flex-start",
    alignItems: "center",
    gap: 18,
    paddingVertical: 10,
    borderBottomWidth: 1,
    borderColor: "#dbdbdb",
    paddingBottom: 20,
  },
  sheetText: {
    fontSize: 18,
    paddingTop: 10,
  },
  switch: {
    transform: [{ scale: 0.9 }],
  },
});
