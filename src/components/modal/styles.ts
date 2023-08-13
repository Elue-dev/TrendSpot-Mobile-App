import { StyleSheet } from "react-native";

export const styles = StyleSheet.create({
  container: {
    ...StyleSheet.absoluteFillObject,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "rgba(0, 0, 0, 0.8)",
    zIndex: 10,
  },
  overlay: {
    ...StyleSheet.absoluteFillObject,
  },
  alertBox: {
    borderRadius: 8,
    paddingVertical: 30,
    paddingHorizontal: 16,
  },
  title: {
    fontWeight: "bold",
    fontSize: 20,
    marginBottom: 8,
    textAlign: "center",
  },
  message: {
    color: "#636366",
    fontSize: 16,
    marginBottom: 16,
    fontWeight: 400,
    textAlign: "center",
    lineHeight: 22,
  },
  closeButton: {
    backgroundColor: "#888",
    borderRadius: 4,
    paddingVertical: 8,
    paddingHorizontal: 16,
    alignSelf: "center",
  },
  closeButtonText: {
    color: "#fff",
    fontWeight: "bold",
    fontSize: 16,
  },
});
