import { View, Text, SafeAreaView, TouchableOpacity } from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { NavigationProp, useNavigation } from "@react-navigation/native";
import { AntDesign } from "@expo/vector-icons";
import { useSheet } from "../../../context/bottom_sheet/BottomSheetContext";
import { COLORS } from "../../../common/colors";

export default function CreateAccountStart() {
  const navigation = useNavigation<NavigationProp<any>>();
  const { isDarkMode } = useSheet();

  async function resetOnboarding() {
    await AsyncStorage.removeItem("userHasOnboarded");
    navigation.navigate("TabStack");
  }

  async function handleGoogleSignIn() {}

  return (
    <SafeAreaView
      className={`flex-1 ${isDarkMode ? "bg-darkNeutral" : "bg-white"} `}
    >
      <View className="ml-4">
        <View>
          <Text
            className={`${
              isDarkMode ? "text-lightText" : "text-darkNeutral"
            } text-2xl font-bold  mt-20`}
          >
            Welcome to TrendSpot
          </Text>
          <Text
            className={`${
              isDarkMode ? "text-lightText" : "text-grayText"
            } text-[18px] mt-1`}
          >
            For credibility and reliability.
          </Text>
        </View>

        <View className="pt-14">
          <TouchableOpacity
            onPress={() => navigation.navigate("TabStack")}
            className="border border-1 border-lightGray mr-3 rounded-md"
          >
            <View className="flex-row items-center justify-center">
              <Text className="text-extraLightGray dark:text-lightGray p-4 text-center  text-base">
                Sign Up Later
              </Text>
              <AntDesign
                name="doubleright"
                size={18}
                color={isDarkMode ? "#C7C7CC" : COLORS.authDark}
              />
            </View>
          </TouchableOpacity>
        </View>

        <View className="pt-16">
          <View className="h-[0.5px] w-[96%] bg-lightGray relative" />
          <Text
            className={`text-center absolute top-[52px] left-[30%]  px-2  text-base ${
              isDarkMode
                ? "bg-darkNeutral text-lightGray"
                : "bg-white text-grayText"
            }`}
          >
            Or Continue With
          </Text>
        </View>

        <View className="pt-14">
          <TouchableOpacity
            onPress={() =>
              navigation.navigate("AuthSequence", { state: "Sign Up" })
            }
            className="border border-1 border-lightGray mr-3 rounded-md mt-4 bg-grayNeutral"
          >
            <Text
              className={`p-4 text-center text-base  ${
                isDarkMode ? "bg-gray300 font-bold" : "font-semibold"
              }`}
              style={{ color: isDarkMode ? "#4E0F12" : "#74171C" }}
            >
              Email Address
            </Text>
          </TouchableOpacity>

          <Text className="text-right mr-3 mt-4 text-base  flex-col justify-center items-center text-grayText dark:text-lightGray">
            Already have an account?{" "}
            <Text
              onPress={() =>
                navigation.navigate("AuthSequence", {
                  state: "Sign In",
                })
              }
            >
              <Text className=" text-primaryColor dark:text-primaryColorTheme font-semibold underline text-base">
                Sign In
              </Text>
            </Text>
          </Text>
        </View>

        <View className="mt-32">
          <Text className="leading-6 text-grayText dark:text-lightGray">
            By signing up, you agree with our{" "}
            <Text
              onPress={() =>
                navigation.navigate("Terms", { defaultTitle: "Terms Of Use" })
              }
            >
              <Text className="font-bold uppercase text-grayText dark:text-lightGray">
                Terms of Service
              </Text>
            </Text>{" "}
            and{" "}
            <Text
              onPress={() =>
                navigation.navigate("Terms", { defaultTitle: "Privacy Policy" })
              }
            >
              <Text className="font-bold uppercase text-grayText dark:text-lightGray">
                Privacy Policy
              </Text>
            </Text>
          </Text>
        </View>
      </View>
    </SafeAreaView>
  );
}
