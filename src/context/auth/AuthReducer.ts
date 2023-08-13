import { AuthAction, AuthState } from "../../types/auth";

export function AuthReducer(state: AuthState, action: AuthAction): AuthState {
  switch (action.type) {
    case "SET_ACTIVE_USER":
      return { ...state, user: action.payload };
    case "REMOVE_ACTIVE_USER":
      return { ...state, user: null };
    default:
      return state;
  }
}
