import React, { useEffect, useMemo, useReducer } from "react";
import { fieldsReducer } from "../context/fields-reducer";
import { ACTIONS, DEFAULT_FIELDS, newField } from "../context/fields-helpers";
import { FieldsContextProvider } from "../context/fields-context";

const FieldsProvider = ({
  children,
  persist = false,
  storageKey = "builder_fields_v1",
}) => {
  const initial = () => {
    if (persist && typeof window !== "undefined") {
      try {
        const raw = localStorage.getItem(storageKey);
        const parsed = raw ? JSON.parse(raw) : null;
        if (Array.isArray(parsed)) return parsed;
      } catch {
        // noop
      }
    }
    return DEFAULT_FIELDS.map(newField);
  };

  const [fields, dispatch] = useReducer(fieldsReducer, undefined, initial);

  useEffect(() => {
    if (!persist) return;
    try {
      localStorage.setItem(storageKey, JSON.stringify(fields));
    } catch {
      // noop
    }
  }, [fields, persist, storageKey]);

  const api = useMemo(() => {
    const addField = () => dispatch({ type: ACTIONS.ADD });
    const updateField = (f) => dispatch({ type: ACTIONS.UPDATE, payload: f });
    const removeField = (id) => dispatch({ type: ACTIONS.REMOVE, payload: id });
    const moveField = (from, to) =>
      dispatch({ type: ACTIONS.MOVE, payload: { from, to } });
    const duplicateField = (f) =>
      dispatch({ type: ACTIONS.DUPLICATE, payload: f });
    const clearForm = () => dispatch({ type: ACTIONS.CLEAR });
    const resetToDefaults = () => dispatch({ type: ACTIONS.RESET_DEFAULTS });
    const setAll = (arr) => dispatch({ type: ACTIONS.SET_ALL, payload: arr });

    return {
      fields,
      addField,
      updateField,
      removeField,
      moveField,
      duplicateField,
      clearForm,
      resetToDefaults,
      setAll,
    };
  }, [fields]);

  return <FieldsContextProvider value={api}>{children}</FieldsContextProvider>;
};
export default FieldsProvider;
