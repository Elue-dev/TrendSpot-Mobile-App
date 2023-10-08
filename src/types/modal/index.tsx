import { Dispatch, ReactNode, SetStateAction } from "react";

export interface ModalProviderProps {
  children: ReactNode;
}

export interface ModalArgs {
  title: string;
  message: string;
  actionBtnText: string;
  action: string;
  param?: string;
}

export interface ModalState {
  showModal: boolean;
  title: string;
  message: string;
  actionBtnText: string;
  action: string;
  setShowModal: Dispatch<SetStateAction<boolean>>;
  param?: string | null;
  setParam: Dispatch<SetStateAction<string | null>>;
  showModalAndContent: ({ title, message, actionBtnText }: ModalArgs) => void;
  closeModal: () => void;
}
