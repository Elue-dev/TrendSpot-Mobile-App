import { StyleSheet } from "react-native";
import { COLORS } from "../../../common/colors";

export const styles = StyleSheet.create({
  richTextContainer: {
    display: "flex",
    flexDirection: "column-reverse",
    width: "100%",
    marginBottom: 10,
  },

  richTextEditorStyle: {
    fontSize: 20,
    borderWidth: 0.3,
    borderBottomLeftRadius: 4,
    borderBottomRightRadius: 4,
  },

  richTextToolbarStyle: {
    borderTopLeftRadius: 4,
    borderTopRightRadius: 4,
    backgroundColor: COLORS.lightText,
  },

  saveButtonStyle: {
    borderRadius: 10,
    padding: 10,
    width: "25%",
    alignItems: "center",
    justifyContent: "center",
    fontSize: 20,
  },
  textButtonStyle: {
    fontSize: 18,
    fontWeight: "600",
    color: "#fff",
  },
  imgWrap: {
    borderWidth: 0.5,
    borderStyle: "dashed",
    height: 120,
    marginTop: 10,
    borderRadius: 5,
    marginBottom: 15,
  },
  textWrap: {
    justifyContent: "center",
    alignItems: "center",
    paddingTop: 40,
  },
});
