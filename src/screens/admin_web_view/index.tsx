import { WebView } from "react-native-webview";

export default function AdminView() {
  return (
    <WebView
      source={{ uri: "https://trend-spot-admin.vercel.app" }}
      style={{ flex: 1 }}
    />
  );
}
