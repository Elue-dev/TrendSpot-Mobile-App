import { createContext, useContext, useState } from "react";
import { ModalArgs, ModalProviderProps, ModalState } from "../../types/modal";

const ModalContext = createContext<ModalState>({} as ModalState);

export function useModal() {
  return useContext(ModalContext);
}

export function ModalProvider({ children }: ModalProviderProps) {
  const [showModal, setShowModal] = useState(false);
  const [title, setTitle] = useState("");
  const [message, setMessage] = useState("");
  const [actionBtnText, setActionBtnText] = useState("");
  const [action, setAction] = useState("");

  function showModalAndContent({
    title,
    message,
    actionBtnText,
    action,
  }: ModalArgs) {
    setShowModal(true);
    setTitle(title);
    setMessage(message);
    setActionBtnText(actionBtnText);
    setAction(action);
  }

  function closeModal() {
    setShowModal(false);
  }

  const values: ModalState = {
    showModal,
    title,
    message,
    actionBtnText,
    action,
    setShowModal,
    showModalAndContent,
    closeModal,
  };

  return (
    <ModalContext.Provider value={values}>{children}</ModalContext.Provider>
  );
}
