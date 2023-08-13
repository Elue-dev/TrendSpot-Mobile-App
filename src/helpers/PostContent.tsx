import { View, useWindowDimensions } from "react-native";
import HTML from "react-native-render-html";
import { useSheet } from "../context/bottom_sheet/BottomSheetContext";
import { COLORS } from "../common/colors";

export default function PostContent({ content }: { content: string }) {
  const windowWidth = useWindowDimensions().width;
  const { isDarkMode } = useSheet();
  const colorToUse = isDarkMode ? COLORS.lightText : COLORS.extraLightGray;

  return (
    <View
      style={{
        marginTop: 10,
      }}
    >
      <HTML
        source={{
          html: `<div 
              style='color: ${colorToUse}; 
              font-size: 1.2rem; 
              font-weight: 300;
              line-height: 2rem'
            >
              ${content}
            </div>`,
        }}
        contentWidth={windowWidth}
      />
    </View>
  );
}
