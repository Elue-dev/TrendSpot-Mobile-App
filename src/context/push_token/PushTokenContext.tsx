import { ExpoPushToken } from "expo-notifications";
import React, { createContext, useContext, useState, ReactNode } from "react";

interface PushTokenContextProps {
  expoPushToken: ExpoPushToken | undefined;
  updateExpoPushToken: (token: ExpoPushToken | undefined) => void;
}

const PushTokenContext = createContext<PushTokenContextProps | undefined>(
  undefined
);

export function usePushTokenContext(): PushTokenContextProps {
  const context = useContext(PushTokenContext);
  if (!context) {
    throw new Error(
      "usePushTokenContext must be used within a PushTokenProvider"
    );
  }
  return context;
}

interface PushTokenProviderProps {
  children: ReactNode;
}

export function PushTokenProvider({
  children,
}: PushTokenProviderProps): JSX.Element {
  const [expoPushToken, setExpoPushToken] = useState<
    ExpoPushToken | undefined
  >();

  const updateExpoPushToken = (token: ExpoPushToken | undefined): void => {
    setExpoPushToken(token!);
  };

  const contextValue: PushTokenContextProps = {
    expoPushToken,
    updateExpoPushToken,
  };

  return (
    <PushTokenContext.Provider value={contextValue}>
      {children}
    </PushTokenContext.Provider>
  );
}
