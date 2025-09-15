import {createContext, ReactNode, useState} from "react";

export const ToastContext = createContext({
  toast: undefined,
  setToast: (_toast: string|undefined) => {},
});

export function ToastProvider({ children }: { children: ReactNode }) {
  const [toast, setToast] = useState(undefined);

  return (
    // @ts-ignore
    <ToastContext.Provider value={{toast, setToast}}>
      {children}
    </ToastContext.Provider>
  );
}
