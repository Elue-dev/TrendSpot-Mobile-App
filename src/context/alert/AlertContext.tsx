import { createContext, useContext, useState } from "react";
import { AlertArgs, AlertProviderProps, AlertState } from "../../types/alert";

const AlertContext = createContext<AlertState>({} as AlertState);

export function useAlert() {
  return useContext(AlertContext);
}

export function AlertProvider({ children }: AlertProviderProps) {
  const [showAlert, setShowAlert] = useState(false);
  const [alertType, setAlertType] = useState("");
  const [message, setMessage] = useState("");

  function showAlertAndContent({ type, message, timeout }: AlertArgs) {
    setAlertType(type);
    setShowAlert(true);
    setMessage(message);
    setTimeout(() => setShowAlert(false), timeout || 4000);
  }

  function closeAlert() {
    setShowAlert(false);
  }

  const values: AlertState = {
    showAlert,
    alertType,
    message,
    setShowAlert,
    showAlertAndContent,
    closeAlert,
  };

  return (
    <AlertContext.Provider value={values}>{children}</AlertContext.Provider>
  );
}
