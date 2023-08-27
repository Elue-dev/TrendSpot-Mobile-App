import {
  createContext,
  useContext,
  useReducer,
  useEffect,
  Dispatch,
  useState,
} from "react";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { AuthReducer } from "./AuthReducer";
import {
  AuthProviderProps,
  User,
  AuthAction,
  AuthContextType,
} from "../../types/auth";

const AuthContext = createContext<AuthContextType>({} as AuthContextType);

export function useAuth() {
  return useContext(AuthContext);
}

async function loadUserFromStorage(dispatch: Dispatch<AuthAction>) {
  try {
    const storedUser = await AsyncStorage.getItem("user");
    const user = JSON.parse(storedUser!);
    dispatch({ type: "SET_ACTIVE_USER", payload: user });
  } catch (error) {
    console.error("Error loading user from storage:", error);
  }
}

export function AuthProvider({ children }: AuthProviderProps) {
  const [selectedInterest, setSelectedInterest] = useState("All");
  const [currrRoute, setCurrRoute] = useState("Home");
  const [previousRoute, setPreviousRoute] = useState("");
  const [state, dispatch] = useReducer(AuthReducer, {
    user: null,
  });

  useEffect(() => {
    loadUserFromStorage(dispatch);
  }, []);

  async function setActiveUser(user: User | null) {
    await AsyncStorage.removeItem("user");
    try {
      dispatch({ type: "SET_ACTIVE_USER", payload: user });
      await AsyncStorage.setItem("user", JSON.stringify(user));
    } catch (error) {
      console.error("Error setting active user:", error);
    }
  }

  function removeActiveUser() {
    dispatch({ type: "REMOVE_ACTIVE_USER" });
    AsyncStorage.removeItem("user");
  }

  const values: AuthContextType = {
    state,
    selectedInterest,
    setSelectedInterest,
    currrRoute,
    setCurrRoute,
    previousRoute,
    setPreviousRoute,
    dispatch,
    setActiveUser,
    removeActiveUser,
  };

  return <AuthContext.Provider value={values}>{children}</AuthContext.Provider>;
}
