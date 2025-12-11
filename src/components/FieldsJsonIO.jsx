// components/FieldsJsonIO.jsx
import React, { useRef } from "react";
import { Button, Stack } from "@mui/material";
import {
  UploadFile as UploadIcon,
  Download as DownloadIcon,
} from "@mui/icons-material";
import { useFields } from "../context/fields-context";

const ensureIds = (arr = []) =>
  (Array.isArray(arr) ? arr : []).map((f) => ({
    id: f.id ?? crypto.randomUUID(),
    label: f.label ?? "Untitled",
    name: f.name ?? "field_" + Math.random().toString(36).slice(2, 7),
    type: f.type ?? "text",
    required: !!f.required,
    fullWidth: f.fullWidth ?? true,
    placeholder: f.placeholder ?? "",
    helperText: f.helperText ?? "",
    options: f.options ?? ["Option A", "Option B"],
    multiple: !!f.multiple,
    dateFormat: f.dateFormat ?? f.format ?? "DD/MM/YYYY",
    dateTimeFormat: f.dateTimeFormat ?? f.format ?? "DD/MM/YYYY HH:mm",
    minDate: f.minDate ?? "",
    maxDate: f.maxDate ?? "",
    minDateTime: f.minDateTime ?? "",
    maxDateTime: f.maxDateTime ?? "",
    ...f,
  }));

export default function FieldsJsonIO() {
  const { fields, setAll } = useFields();
  const fileRef = useRef(null);

  const download = (data, name) => {
    const blob = new Blob([JSON.stringify(data, null, 2)], {
      type: "application/json",
    });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = name;
    a.click();
    URL.revokeObjectURL(url);
  };

  const downloadSchema = () => {
    const schema = fields.map(({ id, ...rest }) => rest);
    download(schema, "schema.json");
  };

  const onImport = async (e) => {
    const file = e.target.files?.[0];
    e.target.value = "";
    if (!file) return;
    try {
      const json = JSON.parse(await file.text());
      const arr =
        (Array.isArray(json) && json) ||
        (Array.isArray(json?.fields) && json.fields) ||
        (Array.isArray(json?.schema) && json.schema) ||
        null;
      if (!arr) throw new Error("Invalid JSON");
      setAll(ensureIds(arr));
    } catch {
      alert("Invalid JSON file.");
    }
  };

  return (
    <Stack direction="row" gap={1}>
      <input
        ref={fileRef}
        type="file"
        accept="application/json,.json"
        hidden
        onChange={onImport}
      />
      <Button
        variant="outlined"
        size="small"
        startIcon={<UploadIcon />}
        onClick={() => fileRef.current?.click()}
      >
        Import JSON
      </Button>
      <Button
        variant="outlined"
        size="small"
        startIcon={<DownloadIcon />}
        onClick={downloadSchema}
      >
        Download schema
      </Button>
    </Stack>
  );
}
