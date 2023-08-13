import {
  CommonActions,
  NavigationProp,
  useNavigation,
} from "@react-navigation/native";
import {
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
} from "firebase/auth";
import { doc, getDoc, serverTimestamp, setDoc } from "firebase/firestore";
import { Alert } from "react-native";
import { useAuth } from "../context/auth/AuthContext";
import { auth, database } from "../lib/firebase";

export async function createAccount(
  email: string,
  password: string,
  username: string,
  selectedCategories: string[]
) {
  let createAccountSuccessful = true;

  const { dispatch } = useAuth();

  if (email !== "" && password !== "") {
    try {
      const userCredential = await createUserWithEmailAndPassword(
        auth,
        email,
        password
      );
      const user = userCredential.user;
      if (user) {
        const userDocRef = doc(database, "users", user.uid);
        const userDocData = {
          id: user.uid,
          username,
          email,
          interests: selectedCategories,
          avatar: "",
          createdAt: serverTimestamp(),
          updatedAt: serverTimestamp(),
        };
        await setDoc(userDocRef, userDocData);
        dispatch({
          type: "SET_ACTIVE_USER",
          payload: {
            id: user.uid,
            username,
            email,
            interests: selectedCategories,
            avatar: "",
          },
        });
      } else {
        throw new Error("User not found");
      }
    } catch (error: any) {
      Alert.alert("Signup error", error.message);
    }
  }

  return createAccountSuccessful;
}

export async function loginUser(email: string, password: string) {
  const { dispatch } = useAuth();
  const navigation = useNavigation<NavigationProp<any>>();

  if (email !== "" && password !== "") {
    try {
      const user: any = await signInWithEmailAndPassword(auth, email, password);
      if (user) {
        const userDocReference = doc(database, "users", user.uid);
        const userDocSnapshot = await getDoc(userDocReference);
        if (userDocSnapshot.exists()) {
          const userData = userDocSnapshot.data();

          dispatch({
            type: "SET_ACTIVE_USER",
            payload: {
              id: user.uid,
              username: userData.username || "",
              email: userData.email || "",
              interests: userData.interests || [""],
              avatar: userData.avatar || "",
            },
          });
        }
      }
      navigation.dispatch(
        CommonActions.reset({
          index: 0,
          routes: [{ name: "TabStack" }],
        })
      );
    } catch (error: any) {
      Alert.alert("Login error", error.message);
    }
  }
}
