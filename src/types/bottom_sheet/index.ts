import { Dispatch, ReactNode, SetStateAction } from "react";
import { News } from "../news";

export interface BottomSheetProviderProps {
  children: ReactNode;
}

export interface BottomSheetContextType {
  state: SheetState;
  isDarkMode: boolean;
  setIsDarkMode: Dispatch<SetStateAction<boolean>>;
  dispatch: Dispatch<SheetAction>;
  toggleBottomSheet: () => void;
  toggleOverlay: () => void;
  toggleColorScheme: () => void;
  toggleTheme: () => void;
}

export interface SheetState {
  bottomSheetOpen: boolean;
  isOverlayVisible: boolean;
  // isDarkMode: boolean;
}

export type SheetAction =
  | { type: "TOGGLE_BOTTOM_SHEET" }
  | { type: "TOGGLE_OVERLAY" };

export interface BottomSheetProps {
  selectedInterest: string;
  dataToUse: News[];
  setDataToUse: Dispatch<SetStateAction<News[]>>;
  selectedOption: string;
  setSelectedOption: Dispatch<SetStateAction<string>>;
}

export interface BottomSheetTwoProps {
  currentNews: News;
}
