import { useState } from "react";
import UserCredentials from "../../components/auth/UserCredentials";
import UserInterests from "../../components/auth/UserInterests";
import { Credentials } from "../../types/auth";
import {
  CommonActions,
  NavigationProp,
  useNavigation,
  useRoute,
} from "@react-navigation/native";
import {
  ActivityIndicator,
  Platform,
  SafeAreaView,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";

import { useSheet } from "../../context/bottom_sheet/BottomSheetContext";
import { ScrollView } from "react-native-gesture-handler";
import { Ionicons, Feather } from "@expo/vector-icons";
import { useAuth } from "../../context/auth/AuthContext";
import { useAlert } from "../../context/alert/AlertContext";
import { COLORS } from "../../common/colors";
import { httpRequest } from "../../services";
import { useQueryClient } from "@tanstack/react-query";

const initialCredentials: Credentials = {
  firstName: "",
  lastName: "",
  email: "",
  password: "",
};

interface PageParams {
  state: string;
}

export default function AuthSequence() {
  const { state } = useRoute().params as PageParams;
  const [credentials, setCredentials] = useState(initialCredentials);
  const [currentInput, setCurrentInput] = useState("");
  const [loading, setLoading] = useState(false);
  const [hidePassword, setHidePassword] = useState(true);
  const [authAction, setAuthAction] = useState(state ? state : "Sign Up");
  const changedActionState = authAction === "Sign Up" ? "Sign In" : "Sign Up";
  const isAndroid = Platform.OS === "android";
  const navigation = useNavigation<NavigationProp<any>>();
  const { email, password, firstName, lastName } = credentials;
  const { setActiveUser, setCurrRoute, previousRoute } = useAuth();
  const { isDarkMode } = useSheet();
  const { showAlertAndContent } = useAlert();
  const queryClient = useQueryClient();

  function handleTextChange(name: string, text: string) {
    setCredentials({ ...credentials, [name]: text });
  }

  async function createUserAccount() {
    if (!firstName || !lastName || !email || !password)
      return showAlertAndContent({
        type: "error",
        message: "Please provide all credentials",
      });

    try {
      setLoading(true);
      const response = await httpRequest.post(`/auth/register`, {
        firstName,
        lastName,
        email,
        password,
      });

      if (response.data.status === "success") {
        setLoading(false);
        setActiveUser(response.data.user);
        navigation.dispatch(
          CommonActions.reset({
            index: 0,
            routes: [{ name: "TabStack" }],
          })
        );
        queryClient.invalidateQueries(["activities"]);
        setCurrRoute("Home");
      }
    } catch (error: any) {
      showAlertAndContent({
        type: "error",
        message:
          error?.response?.data?.message ||
          "Something went wrong. Please try again.",
      });
      setLoading(false);
    }
  }

  async function loginUser() {
    if (!email || !password)
      return showAlertAndContent({
        type: "error",
        message: "both email and password are required",
      });
    try {
      setLoading(true);
      const response = await httpRequest.post(`/auth/signin`, {
        email,
        password,
      });
      if (response.data.status === "success") {
        setLoading(false);
        setActiveUser(response.data.user);
        if (previousRoute === "") {
          navigation.dispatch(
            CommonActions.reset({
              index: 0,
              routes: [{ name: "TabStack" }],
            })
          );
          setCurrRoute("Home");
        } else if (previousRoute === "Comments") {
          navigation.goBack();
        } else {
          navigation.dispatch(
            CommonActions.reset({
              index: 0,
              routes: [{ name: previousRoute }],
            })
          );
        }
        queryClient.invalidateQueries(["activities"]);
      }
    } catch (error: any) {
      console.log(error?.response?.data?.message);
      showAlertAndContent({
        type: "error",
        message:
          error?.response?.data?.message ||
          "Something went wrong. Please try again.",
      });
      setLoading(false);
    }
  }

  return (
    <SafeAreaView className="bg-white dark:bg-darkNeutral flex-1">
      <ScrollView
        showsVerticalScrollIndicator={false}
        className="px-4 mt-8"
        style={{
          paddingTop: isAndroid ? 60 : null,
        }}
      >
        <View className={currentInput !== "" ? "-mt-10" : ""}>
          <TouchableOpacity
            onPress={() => (loading ? () => {} : navigation.goBack())}
          >
            <Ionicons
              name="arrow-back-outline"
              size={24}
              color={isDarkMode ? "white" : "#1C1C1E"}
            />
          </TouchableOpacity>
          <View className="bg-grayNeutral dark:bg-dark  flex-row p-[5px] justify-around items-center rounded-lg mt-5 overflow-hidden">
            {["Sign Up", "Sign In"].map((currentAction, index) => (
              <TouchableOpacity
                onPress={() => {
                  if (loading) {
                    () => {};
                  } else {
                    setAuthAction(changedActionState);
                    setCredentials(initialCredentials);
                  }
                }}
                key={index}
                className={`py-1 px-16 rounded-lg ${
                  currentAction === authAction && isDarkMode
                    ? "bg-authDark"
                    : currentAction === authAction && !isDarkMode
                    ? "bg-white"
                    : ""
                }`}
              >
                <Text
                  style={{ fontFamily: "rubikSB" }}
                  className={`text-center text-base dark:text-white ${
                    currentAction === authAction ? "font-bold" : "font-semibold"
                  } `}
                >
                  {currentAction}
                </Text>
              </TouchableOpacity>
            ))}
          </View>

          {authAction === "Sign Up" ? (
            <View>
              <Text
                style={{ fontFamily: "rubikSB" }}
                className="text-darkNeutral dark:text-lightText text-2xl font-bold  mt-12"
              >
                Welcome to TrendSpot
              </Text>
              <Text
                style={{ fontFamily: "rubikREG" }}
                className="text-darkNeutral dark:text-lightText font-normal dark:font-light text-[18px] mt-3 tracking-wide leading-6"
              >
                We are committed to delivering accurate and trustworthy news
                from around the world.
              </Text>
            </View>
          ) : (
            <View>
              <Text
                style={{ fontFamily: "rubikSB" }}
                className="text-darkNeutral dark:text-lightText text-2xl font-bold  mt-12"
              >
                Welcome back to TrendSpot
              </Text>
              <Text
                style={{ fontFamily: "rubikREG" }}
                className="text-darkNeutral dark:text-lightText font-normal dark:font-light text-[18px] mt-3 tracking-wide leading-6"
              >
                As always, we are committed to delivering accurate and
                trustworthy news from around the world.
              </Text>
            </View>
          )}

          <View>
            {authAction === "Sign Up" && (
              <View>
                <View className="mt-14">
                  <Text
                    style={{ fontFamily: "rubikREG" }}
                    className={`absolute ${
                      currentInput === "FirstName" || firstName
                        ? "bottom-5 text-[12px] mb-2 text-grayText dark:text-lightText"
                        : "bottom-2 text-[16px] text-grayText dark:text-lightText"
                    }`}
                  >
                    First Name
                  </Text>
                  <TextInput
                    value={firstName}
                    onChangeText={(text) => handleTextChange("firstName", text)}
                    className="border-b-2 relative text-[16px] border-lightGray dark:border-lightBorder"
                    onFocus={() => setCurrentInput("FirstName")}
                    onBlur={() => setCurrentInput("")}
                    style={{ color: isDarkMode ? "#E5E5EA" : "#000" }}
                  />
                </View>
                <View className="mt-9">
                  <Text
                    style={{ fontFamily: "rubikREG" }}
                    className={`absolute ${
                      currentInput === "LastName" || lastName
                        ? "bottom-5 text-[12px] mb-2 text-grayText dark:text-lightText"
                        : "bottom-2 text-[16px] text-grayText dark:text-lightText"
                    }`}
                  >
                    Last Name
                  </Text>
                  <TextInput
                    value={lastName}
                    onChangeText={(text) => handleTextChange("lastName", text)}
                    className="border-b-2 relative text-[16px] border-lightGray dark:border-lightBorder"
                    onFocus={() => setCurrentInput("LastName")}
                    onBlur={() => setCurrentInput("")}
                    style={{ color: isDarkMode ? "#E5E5EA" : "#000" }}
                  />
                </View>
              </View>
            )}
          </View>

          <View className={`${authAction === "Sign Up" ? "mt-10" : "mt-12"}`}>
            <Text
              style={{ fontFamily: "rubikREG" }}
              className={`absolute ${
                currentInput === "Email Address" || email
                  ? "bottom-5 text-[12px] mb-2 text-grayText dark:text-lightText"
                  : "bottom-2 text-[16px] text-grayText dark:text-lightText"
              }`}
            >
              Email Address
            </Text>
            <TextInput
              value={email}
              keyboardType="email-address"
              onChangeText={(text) => handleTextChange("email", text)}
              className="border-b-2 relative text-[16px] border-lightGray dark:border-lightBorder"
              onFocus={() => setCurrentInput("Email Address")}
              onBlur={() => setCurrentInput("")}
              style={{ color: isDarkMode ? "#E5E5EA" : "#000" }}
            />
          </View>

          <View
            className="mt-10"
            style={{ flex: 1, justifyContent: "flex-end" }}
          >
            <Text
              style={{ fontFamily: "rubikREG" }}
              className={`absolute ${
                currentInput === "Password" || password
                  ? "bottom-5 text-[12px] mb-2 text-grayText dark:text-lightText"
                  : "bottom-2 text-[16px] text-grayText dark:text-lightText"
              }`}
            >
              Password
            </Text>

            <TouchableOpacity
              className="absolute right-0 bottom-2 z-10"
              onPress={() => {
                setHidePassword(!hidePassword);
                setCurrentInput("Password");
              }}
            >
              <Feather
                name={hidePassword ? "eye-off" : "eye"}
                size={22}
                style={{ color: isDarkMode ? "#E5E5EA" : COLORS.authDark }}
              />
            </TouchableOpacity>

            <TextInput
              value={password}
              secureTextEntry={hidePassword}
              onChangeText={(text) => handleTextChange("password", text)}
              className="border-b-2 relative text-[16px] border-lightGray dark:border-lightBorder z-1"
              onFocus={() => setCurrentInput("Password")}
              onBlur={() => setCurrentInput("")}
              style={{ color: isDarkMode ? "#E5E5EA" : "#000" }}
            />
          </View>
        </View>

        <View className="mt-7">
          {loading ? (
            <TouchableOpacity className="bg-primaryColorLighter py-3 rounded-md">
              <ActivityIndicator color={"#fff"} size="small" />
            </TouchableOpacity>
          ) : (
            <TouchableOpacity
              onPress={authAction === "Sign In" ? loginUser : createUserAccount}
              className="bg-primaryColor dark:bg-primaryColorTheme py-3 rounded-md"
            >
              <Text
                style={{ fontFamily: "rubikSB" }}
                className="text-white font-semibold text-center text-xl"
              >
                {authAction === "Sign In" ? "Sign In" : "Sign Up"}
              </Text>
            </TouchableOpacity>
          )}
        </View>

        {/* Forgot Passwoord */}
        {authAction === "Sign In" && (
          <TouchableOpacity
            onPress={() => navigation.navigate("ForgotPassword")}
          >
            <Text
              style={{ fontFamily: "rubikREG" }}
              className="text-base text-darkNeutral dark:text-white mt-5 text-right"
            >
              Forgot your password?
            </Text>
          </TouchableOpacity>
        )}
      </ScrollView>
    </SafeAreaView>
  );
}
