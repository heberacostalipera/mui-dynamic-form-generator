import React, { useCallback, useState } from "react";
import SubmitResultDialog from "./SubmitResultsDialog";

const defaultDialog = {
  rows: [],
  json: null,
  open: false,
};
const FormDialogWrapper = ({ children }) => {
  const [dialog, setDialog] = useState(defaultDialog);

  const handleSubmit = useCallback(({ fields, values }) => {
    const display = (f, raw) => {
      if (raw == null) return "—";
      if (Array.isArray(raw)) return raw.join(", ");
      if (typeof raw === "boolean") return raw ? "Yes" : "No";
      return String(raw);
    };

    const rows = fields.map((f) => ({
      label: f.label ?? f.name,
      name: f.name,
      value: display(f, values?.[f.name]),
    }));

    const out = {};
    for (const f of fields) out[f.name] = values?.[f.name] ?? null;
    const json = JSON.stringify(out, null, 2);

    setDialog({ open: true, rows, json });
  }, []);

  const handleClose = useCallback(() => setDialog(defaultDialog), []);

  return (
    <>
      {children(handleSubmit)}
      <SubmitResultDialog onClose={handleClose} {...dialog} />
    </>
  );
};

export default FormDialogWrapper;
