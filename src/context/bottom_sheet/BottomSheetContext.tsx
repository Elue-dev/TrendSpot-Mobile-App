import {
  createContext,
  useContext,
  useEffect,
  useReducer,
  useState,
} from "react";
import { useColorScheme } from "nativewind";
import { BottomSheetReducer } from "./BottomSheetReducer";
import {
  BottomSheetContextType,
  BottomSheetProviderProps,
} from "../../types/bottom_sheet";
import AsyncStorage from "@react-native-async-storage/async-storage";

const BottomSheetContext = createContext<BottomSheetContextType>(
  {} as BottomSheetContextType
);

export function useSheet() {
  return useContext(BottomSheetContext);
}

export function BottomSheetProvider({ children }: BottomSheetProviderProps) {
  const { colorScheme, toggleColorScheme } = useColorScheme();
  const [isDarkMode, setIsDarkMode] = useState(false);

  useEffect(() => {
    async function checkTheme() {
      const storedTheme = await AsyncStorage.getItem("theme");
      setIsDarkMode(storedTheme === "dark" || colorScheme === "dark");
    }

    checkTheme();
  }, [colorScheme]);

  const [state, dispatch] = useReducer(BottomSheetReducer, {
    bottomSheetOpen: false,
    isOverlayVisible: false,
  });

  function toggleBottomSheet() {
    dispatch({ type: "TOGGLE_BOTTOM_SHEET" });
  }

  function toggleOverlay() {
    dispatch({ type: "TOGGLE_OVERLAY" });
  }

  async function toggleTheme() {
    await AsyncStorage.removeItem("theme");
    toggleColorScheme();
    setIsDarkMode(!isDarkMode);
    const storedTheme = await AsyncStorage.getItem("theme");
    const themeToStore = storedTheme === "light" ? "dark" : "light";
    await AsyncStorage.setItem("theme", themeToStore);
  }

  const values: BottomSheetContextType = {
    state,
    dispatch,
    toggleBottomSheet,
    toggleOverlay,
    toggleTheme,
    isDarkMode,
    setIsDarkMode,
    toggleColorScheme,
  };

  return (
    <BottomSheetContext.Provider value={values}>
      {children}
    </BottomSheetContext.Provider>
  );
}
