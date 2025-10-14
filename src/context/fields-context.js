import { createContext, useContext } from "react";

const FieldsContext = createContext(null);
export const FieldsContextProvider = FieldsContext.Provider;

export const useFields = () => {
  const ctx = useContext(FieldsContext);
  if (!ctx) throw new Error("useFields must be used within <FieldsProvider>");
  return ctx;
};
