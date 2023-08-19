import { Platform, StyleSheet } from "react-native";
import { COLORS } from "../../common/colors";

export const styles = StyleSheet.create({
  noComments: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  noCommentsHeadingText: {
    fontSize: 24,
    fontWeight: "700",
    paddingTop: 10,
  },
  noCommentsSubText: {
    paddingTop: 10,
    fontSize: 16,
  },
  addCommentwrap: {
    paddingHorizontal: 10,
    marginBottom: 30,
    flexDirection: "row",
    alignItems: "center",
    marginTop: 5,
  },
  noUserwrap: {
    paddingHorizontal: 10,
    marginBottom: 30,
    marginTop: 5,
  },
  adjustedHeight: {
    marginBottom: Platform.OS === "ios" ? 350 : 20,
  },
  input: {
    flex: 2,
    paddingHorizontal: 15,
    fontSize: 15,
  },
  activeText: {
    fontWeight: "700",
    fontSize: 17,
  },
  disabledtext: {
    color: COLORS.authDark,
    fontWeight: "600",
    fontSize: 17,
  },
  commentsWrap: {
    paddingTop: 10,
    paddingHorizontal: 10,
    paddingBottom: 15,
  },
  commentsContent: {
    flexDirection: "row",
    gap: 10,
  },
  topSec: {
    flexDirection: "row",
    gap: 5,
  },
  authorNames: {
    fontSize: 14,
  },
  comment: {
    paddingTop: 6,
    fontSize: 16,
  },
  replyingTo: {
    paddingVertical: 2,
    color: COLORS.grayNeutral,
    textAlign: "center",
  },
  avatarStyle: {
    height: 35,
    width: 35,
    borderRadius: 50,
    marginTop: 3,
    backgroundColor: COLORS.primaryColorTheme,
  },
  container: { flex: 1 },
  scrollView: { flex: 1 },
  centerContainer: {
    justifyContent: "center",
    alignItems: "center",
    paddingVertical: 280,
    flex: 1,
  },
  headingText: { fontSize: 24, fontWeight: "bold", paddingTop: 3 },
  subheadingText: { paddingTop: 3, fontSize: 16 },
  commentInputContainer: {
    position: "absolute",
    bottom: 0,
    left: 0,
    right: 0,
    borderTopWidth: 1,
    borderColor: "#ccc",
    padding: 10,
  },
  textGray300: { color: "#D1D5DB" },
  textPrimaryColorSec: { color: COLORS.primaryColorSec },
  fontSemiBold: { fontWeight: "600" },
});
