import { Platform, StyleSheet } from "react-native";
import { COLORS } from "../../common/colors";

export const styles = StyleSheet.create({
  wrapper: {
    flex: 1,
    paddingTop: 40,
    paddingHorizontal: 10,
  },
  avatar: {
    width: 100,
    height: 100,
    borderRadius: 50,
    marginTop: 15,
  },
  flexTop: {
    flexDirection: "row",
    justifyContent: "flex-start",
    alignItems: "center",
    gap: 10,
  },
  replaceText: {
    fontSize: 17,
    fontWeight: "600",
    textDecorationLine: "underline",
    marginBottom: 10,
  },
  subText: {
    fontSize: 17,
  },

  flexInput: {
    flexDirection: "row",
    justifyContent: "flex-start",
    alignItems: "center",
    gap: 5,
  },
  input: {
    marginVertical: 15,
    flex: 1,
    fontSize: 16,
  },

  btn: {
    flex: 1,
    padding: 15,
    borderRadius: 20,
  },
  btnText: {
    textAlign: "center",
    fontWeight: "700",
    fontSize: 17,
  },
});
