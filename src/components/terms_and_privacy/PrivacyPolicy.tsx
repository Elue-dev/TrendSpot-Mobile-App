import { View, Text, ScrollView } from "react-native";

export default function PrivacyPolicy() {
  return (
    <ScrollView showsVerticalScrollIndicator={false}>
      <View className="pt-4 pb-28 bg-white dark:bg-darkNeutral">
        <Text className="text-primaryColor dark:text-primaryColorTheme font-bold text-[18px] pb-1">
          Data Collection and Usage
        </Text>
        <Text className="pb-10 leading-4 text-base text-darkNeutral dark:text-lightText">
          he privacy policy must be transparent about the types of data the app
          collects from users. This may include personal information (such as
          name, email, and profile picture) and non-personal data (such as
          device information, app usage patterns, etc.). It should clarify that
          this data is used to enhance user experience, personalize content, and
          improve the overall performance of the app.
        </Text>

        <Text className="text-primaryColor dark:text-primaryColorTheme font-bold text-[18px] pb-1">
          News Verification
        </Text>
        <Text className="pb-10 leading-4 text-base text-darkNeutral dark:text-lightText">
          If the app uses user-generated content for news articles, the privacy
          policy should explain that the submitted content may be subject to
          verification and may be visible to other users during the moderation
          process.
        </Text>

        <Text className="text-primaryColor dark:text-primaryColorTheme font-bold text-[18px] pb-1">
          Third-Party Services
        </Text>
        <Text className="pb-10 leading-4 text-base text-darkNeutral dark:text-lightText">
          If the app integrates with third-party services, such as social media
          platforms or chat services, the privacy policy should disclose how
          user data is shared with these services and how their respective
          privacy policies apply.
        </Text>

        <Text className="text-primaryColor dark:text-primaryColorTheme font-bold text-[18px] pb-1">
          Security Measures
        </Text>
        <Text className="pb-10 leading-4 text-base text-darkNeutral dark:text-lightText">
          The privacy policy should outline the security measures implemented by
          the app to protect user data from unauthorized access, loss, or
          disclosure.
        </Text>

        <Text className="text-primaryColor dark:text-primaryColorTheme font-bold text-[18px] pb-1">
          User Communication
        </Text>
        <Text className="pb-10 leading-4 text-base text-darkNeutral dark:text-lightText">
          If the app includes a chat functionality allowing users to interact
          with one another, the privacy policy should advise users to exercise
          caution when sharing personal information and clearly state that the
          app is not responsible for the content of their communications.
        </Text>

        <Text className="text-primaryColor dark:text-primaryColorTheme font-bold text-[18px] pb-1">
          Data Retention
        </Text>
        <Text className="pb-10 leading-4 text-base text-darkNeutral dark:text-lightText">
          The privacy policy should specify how long user data is retained
          within the app and under what circumstances it may be deleted or
          anonymized.
        </Text>
      </View>
    </ScrollView>
  );
}
