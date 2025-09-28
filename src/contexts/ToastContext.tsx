import {createContext, ReactNode, useContext, useState} from "react";

type Toast = {
  toast: string|undefined;
  style?: "success"|"info"|"warning"|"danger";
}

export const ToastContext = createContext({
  toast: undefined,
  setToast: (_toast: Toast) => {},
});

export function ToastProvider({ children }: { children: ReactNode }) {
  const [toast, setToast] = useState<Toast|undefined>(undefined);

  return (
    // @ts-ignore
    <ToastContext.Provider value={{toast, setToast}}>
      {children}
    </ToastContext.Provider>
  );
}

export const useToast = () => {
  const {toast} = useContext(ToastContext);
  const {setToast} = useContext(ToastContext);
  const addToast = (toast: string, style: "success"|"info"|"warning"|"danger" = "success") => setToast({
    toast: toast,
    style: style,
  });
  const clearToast = () => setToast({
    toast: undefined,
  });

  return {toast: toast?.toast, style: toast?.style, addToast, clearToast}
};
