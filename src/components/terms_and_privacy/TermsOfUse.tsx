import { View, Text, ScrollView } from "react-native";

export default function TermsOfUse() {
  return (
    <ScrollView showsVerticalScrollIndicator={false}>
      <View className="pt-4 pb-28 bg-white dark:bg-darkNeutral">
        <Text className="text-primaryColor dark:text-primaryColorTheme font-bold text-[18px] pb-1">
          User-Generated Content
        </Text>
        <Text className="pb-10 leading-4 text-base text-darkNeutral dark:text-lightText">
          The news mobile application allows users to contribute and add news
          articles. The "Terms of Use" should clearly state that users are
          solely responsible for the content they submit. It should prohibit the
          submission of false, misleading, or offensive content, along with any
          copyrighted materials that users do not have the rights to share.
        </Text>

        <Text className="text-primaryColor dark:text-primaryColorTheme font-bold text-[18px] pb-1">
          Content Moderation
        </Text>
        <Text className="pb-10 leading-4 text-base text-darkNeutral dark:text-lightText">
          To maintain the quality and credibility of the platform, the app will
          have a system in place for verifying news articles. The "Terms of Use"
          should explain that the app reserves the right to moderate, edit, or
          remove any content that violates the guidelines. Users should be aware
          that repeated violations may lead to the suspension or termination of
          their accounts.
        </Text>

        <Text className="text-primaryColor dark:text-primaryColorTheme font-bold text-[18px] pb-1">
          Intellectual Property
        </Text>
        <Text className="pb-10 leading-4 text-base text-darkNeutral dark:text-lightText">
          The "Terms of Use" should state that any content submitted by users
          becomes the property of the news mobile application. This is necessary
          to ensure the app's ability to distribute, display, and use the
          content within the platform and for promotional purposes. However,
          users should retain their intellectual property rights to the content
          they contribute.
        </Text>

        <Text className="text-primaryColor dark:text-primaryColorTheme font-bold text-[18px] pb-1">
          Prohibited Activities
        </Text>
        <Text className="pb-10 leading-4 text-base text-darkNeutral dark:text-lightText">
          The "Terms of Use" should outline activities that are strictly
          prohibited, including but not limited to hacking attempts,
          unauthorized access to the app's infrastructure, spreading malware, or
          any other actions that may harm the app or its users.
        </Text>

        <Text className="text-primaryColor dark:text-primaryColorTheme font-bold text-[18px] pb-1">
          Age Restriction
        </Text>
        <Text className="pb-10 leading-4 text-base text-darkNeutral dark:text-lightText">
          If the app allows for user accounts and interactions, it should
          specify a minimum age requirement for users to sign up and use the
          platform. This is to comply with regulations such as COPPA (Children's
          Online Privacy Protection Act) and to ensure that the app does not
          collect personal information from minors without parental consent.
        </Text>
      </View>
    </ScrollView>
  );
}
