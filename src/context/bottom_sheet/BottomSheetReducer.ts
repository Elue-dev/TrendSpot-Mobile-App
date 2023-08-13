import { SheetAction, SheetState } from "../../types/bottom_sheet";

export function BottomSheetReducer(
  state: SheetState,
  action: SheetAction
): SheetState {
  switch (action.type) {
    case "TOGGLE_BOTTOM_SHEET":
      return { ...state, bottomSheetOpen: !state.bottomSheetOpen };
    case "TOGGLE_OVERLAY":
      return { ...state, isOverlayVisible: !state.isOverlayVisible };

    default:
      return state;
  }
}
