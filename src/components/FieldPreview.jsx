import React from "react";
import {
  Checkbox,
  FormControl,
  FormControlLabel,
  FormHelperText,
  InputLabel,
  MenuItem,
  Select,
  TextField,
} from "@mui/material";
import { DateTimePicker } from "@mui/x-date-pickers/DateTimePicker";

const FieldPreview = ({ field, value, onChange, error }) => {
  const common = {
    name: field.name,
    label: field.label,
    placeholder: field.placeholder,
    required: field.required,
    fullWidth: true,
    helperText: error || field.helperText,
    error: Boolean(error),
    size: "medium",
  };

  switch (field.type) {
    case "textarea":
      return (
        <TextField
          {...common}
          multiline
          minRows={3}
          value={value ?? ""}
          onChange={(e) => onChange(field.name, e.target.value)}
        />
      );
    case "number":
      return (
        <TextField
          {...common}
          type="number"
          value={value ?? ""}
          onChange={(e) => onChange(field.name, e.target.value)}
        />
      );
    case "email":
      return (
        <TextField
          {...common}
          type="email"
          value={value ?? ""}
          onChange={(e) => onChange(field.name, e.target.value)}
        />
      );
    case "password":
      return (
        <TextField
          {...common}
          type="password"
          value={value ?? ""}
          onChange={(e) => onChange(field.name, e.target.value)}
        />
      );
    case "date":
      return (
        <DateTimePicker
          label={field.label}
          value={value || null}
          onChange={(newValue) => onChange(field.name, newValue)}
          ampm={false}
          slotProps={{
            textField: {
              fullWidth: true,
              required: field.required,
              helperText: error || field.helperText,
              error: Boolean(error),
            },
          }}
        />
      );
    case "select": {
      const options = String(field.options || "")
        .split(",")
        .map((s) => s.trim())
        .filter(Boolean);
      return (
        <FormControl fullWidth error={Boolean(error)}>
          <InputLabel>{field.label}</InputLabel>
          <Select
            label={field.label}
            value={value ?? ""}
            onChange={(e) => onChange(field.name, e.target.value)}
          >
            {options.map((opt) => (
              <MenuItem key={opt} value={opt}>
                {opt}
              </MenuItem>
            ))}
          </Select>
          <FormHelperText>{error || field.helperText}</FormHelperText>
        </FormControl>
      );
    }
    case "checkbox":
      return (
        <FormControlLabel
          control={
            <Checkbox
              checked={Boolean(value)}
              onChange={(e) => onChange(field.name, e.target.checked)}
            />
          }
          label={field.label + (field.required ? " *" : "")}
        />
      );
    default:
      return (
        <TextField
          {...common}
          value={value ?? ""}
          onChange={(e) => onChange(field.name, e.target.value)}
        />
      );
  }
};

export default FieldPreview;
