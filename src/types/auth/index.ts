import { Dispatch, ReactNode, SetStateAction } from "react";

export interface Credentials {
  firstName: string;
  lastName: string;
  email: string;
  password: string;
}

export interface UserCredentialsProps {
  initiaCredentials: Credentials;
  credentials: Credentials;
  paramsPassed: string;
  setCredentials: Dispatch<SetStateAction<UserCredentialsProps["credentials"]>>;
  setSelectedCategories: Dispatch<SetStateAction<string[]>>;
  handleTextChange: (name: string, text: string) => void;
  prevStep: () => void;
  nextStep: () => void;
}

export interface UserInterestsProps {
  initiaCredentials: Credentials;
  credentials: Credentials;
  selectedCategories: string[];
  setSelectedCategories: Dispatch<SetStateAction<string[]>>;
  prevStep: () => void;
}

export interface User {
  id: string;
  firstName: string;
  lastName: string;
  email: string;
  bio: string;
  avatar: string;
  joinedAt: Date;
  lastUpdated: Date;
  isAdmin: boolean;
  isDeactivated: boolean;
  isDeactivatedByAdmin: boolean;
  token: string;
}

export interface AuthState {
  user: User | null;
}

export interface AuthContextType {
  state: AuthState;
  selectedInterest: string;
  setSelectedInterest: Dispatch<SetStateAction<string>>;
  currrRoute: string;
  setCurrRoute: Dispatch<SetStateAction<string>>;
  previousRoute: string;
  setPreviousRoute: Dispatch<SetStateAction<string>>;
  dispatch: Dispatch<AuthAction>;
  setActiveUser: (user: User) => Promise<void>;
  removeActiveUser: () => void;
}

export type AuthAction =
  | { type: "SET_ACTIVE_USER"; payload: User | null }
  | { type: "REMOVE_ACTIVE_USER" };

export interface AuthProviderProps {
  children: ReactNode;
}
