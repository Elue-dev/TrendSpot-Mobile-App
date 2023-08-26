import { View, Text, ScrollView } from "react-native";

export default function PrivacyPolicy() {
  return (
    <ScrollView showsVerticalScrollIndicator={false}>
      <View className="pt-4 pb-28 bg-shadowWhite dark:bg-darkNeutral">
        <View className="bg-white dark:bg-transparent border border-gray-200 dark:border-lightBorder shadow-sm px-2 py-3 rounded-lg mb-1">
          <Text
            style={{ fontFamily: "rubikMD" }}
            className="text-primaryColor dark:text-primaryColorTheme font-bold text-[18px] pb-1"
          >
            Data Collection and Usage
          </Text>
          <Text
            style={{ fontFamily: "rubikREG" }}
            className="leading-4 text-base text-darkNeutral dark:text-lightText"
          >
            The privacy policy must be transparent about the types of data the
            app collects from users. This may include personal information (such
            as name, email, and profile picture) and non-personal data (such as
            device information, app usage patterns, etc.). It should clarify
            that this data is used to enhance user experience, personalize
            content, and improve the overall performance of the app.
          </Text>
        </View>
        <View className="bg-white dark:bg-transparent border border-gray-200 dark:border-lightBorder shadow-sm px-2 py-3 rounded-lg mb-1">
          <Text
            style={{ fontFamily: "rubikMD" }}
            className="text-primaryColor dark:text-primaryColorTheme font-bold text-[18px] pb-1"
          >
            News Verification
          </Text>
          <Text
            style={{ fontFamily: "rubikREG" }}
            className="leading-4 text-base text-darkNeutral dark:text-lightText"
          >
            If the app uses user-generated content for news articles, the
            privacy policy should explain that the submitted content may be
            subject to verification and may be visible to other users during the
            moderation process.
          </Text>
        </View>
        <View className="bg-white dark:bg-transparent border border-gray-200 dark:border-lightBorder shadow-sm px-2 py-3 rounded-lg mb-1">
          <Text
            style={{ fontFamily: "rubikMD" }}
            className="text-primaryColor dark:text-primaryColorTheme font-bold text-[18px] pb-1"
          >
            Third-Party Services
          </Text>
          <Text
            style={{ fontFamily: "rubikREG" }}
            className="leading-4 text-base text-darkNeutral dark:text-lightText"
          >
            If the app integrates with third-party services, such as social
            media platforms or chat services, the privacy policy should disclose
            how user data is shared with these services and how their respective
            privacy policies apply.
          </Text>
        </View>
        <View className="bg-white dark:bg-transparent border border-gray-200 dark:border-lightBorder shadow-sm px-2 py-3 rounded-lg mb-1">
          <Text
            style={{ fontFamily: "rubikMD" }}
            className="text-primaryColor dark:text-primaryColorTheme font-bold text-[18px] pb-1"
          >
            Security Measures
          </Text>
          <Text
            style={{ fontFamily: "rubikREG" }}
            className="leading-4 text-base text-darkNeutral dark:text-lightText"
          >
            The privacy policy should outline the security measures implemented
            by the app to protect user data from unauthorized access, loss, or
            disclosure.
          </Text>
        </View>
        <View className="bg-white dark:bg-transparent border border-gray-200 dark:border-lightBorder shadow-sm px-2 py-3 rounded-lg mb-1">
          <Text
            style={{ fontFamily: "rubikMD" }}
            className="text-primaryColor dark:text-primaryColorTheme font-bold text-[18px] pb-1"
          >
            User Communication
          </Text>
          <Text
            style={{ fontFamily: "rubikREG" }}
            className="leading-4 text-base text-darkNeutral dark:text-lightText"
          >
            If the app includes a chat functionality allowing users to interact
            with one another, the privacy policy should advise users to exercise
            caution when sharing personal information and clearly state that the
            app is not responsible for the content of their communications.
          </Text>
        </View>
        <View className="bg-white dark:bg-transparent border border-gray-200 dark:border-lightBorder shadow-sm px-2 py-3 rounded-lg mb-1">
          <Text
            style={{ fontFamily: "rubikMD" }}
            className="text-primaryColor dark:text-primaryColorTheme font-bold text-[18px] pb-1"
          >
            Data Retention
          </Text>
          <Text
            style={{ fontFamily: "rubikREG" }}
            className="leading-4 text-base text-darkNeutral dark:text-lightText"
          >
            The privacy policy should specify how long user data is retained
            within the app and under what circumstances it may be deleted or
            anonymized.
          </Text>
        </View>
      </View>
    </ScrollView>
  );
}
