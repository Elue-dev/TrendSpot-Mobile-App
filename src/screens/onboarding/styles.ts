import { Dimensions, StyleSheet } from "react-native";
import { COLORS } from "../../common/colors";

const { width, height } = Dimensions.get("window");

export const styles = StyleSheet.create({
  image: {
    flex: 1,
    resizeMode: "contain",
    height: "100%",
    width,
  },
  titleText: {
    marginTop: 15,
    fontSize: 24,
    fontWeight: "bold",
    textAlign: "center",
  },
  subTitle: {
    marginTop: 10,
    marginLeft: 19,
    fontSize: 16,
    textAlign: "center",
    maxWidth: "90%",
    color: COLORS.grayText,
    lineHeight: 23,
  },
  slidesWrap: {
    height: height * 0.25,
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginHorizontal: 10,
  },
  slidesWrapA: {
    height: height * 0.25,
    marginHorizontal: 10,
    marginTop: 30,
  },
  indicator: {
    height: 15,
    width: 15,
    backgroundColor: "#fff",
    marginHorizontal: 3,
    borderRadius: 50,
    borderWidth: 1.5,
  },
  btn: {
    paddingVertical: 10,
    paddingHorizontal: 50,
    borderRadius: 5,
  },
});
