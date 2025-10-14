import React, { useCallback, useMemo } from "react";
import {
  FormControl,
  FormControlLabel,
  IconButton,
  InputLabel,
  MenuItem,
  Paper,
  Select,
  Stack,
  Switch,
  TextField,
  Tooltip,
} from "@mui/material";
import {
  Delete as DeleteIcon,
  ContentCopy as CopyIcon,
  ArrowUpward as ArrowUpIcon,
  ArrowDownward as ArrowDownIcon,
} from "@mui/icons-material";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import { DatePicker } from "@mui/x-date-pickers/DatePicker";
import { DateTimePicker } from "@mui/x-date-pickers/DateTimePicker";
import dayjs from "dayjs";

const FIELD_TYPES = [
  { id: "text", label: "Text" },
  { id: "number", label: "Number" },
  { id: "email", label: "Email" },
  { id: "password", label: "Password" },
  { id: "textarea", label: "Textarea" },
  { id: "select", label: "Select" },
  { id: "checkbox", label: "Checkbox" },
  { id: "date", label: "Date" },
  { id: "dateTime", label: "Date & Time" },
];

const TYPE_DEFAULTS = {
  checkbox: { placeholder: "", helperText: "" },
  select: { placeholder: "", helperText: "" },
  date: {
    placeholder: "",
    helperText: "",
    dateFormat: "DD/MM/YYYY",
    minDate: "",
    maxDate: "",
    minDateTime: "",
    maxDateTime: "",
  },
  datetime: {
    placeholder: "",
    helperText: "",
    dateTimeFormat: "DD/MM/YYYY HH:mm",
    minDateTime: "",
    maxDateTime: "",
    minDate: "",
    maxDate: "",
  },
};

const applyTypeDefaults = (field, nextType) => {
  const extra = TYPE_DEFAULTS[nextType] || {};
  const withDefaults = {
    ...field,
    type: nextType,
    ...Object.fromEntries(
      Object.entries(extra).map(([k, v]) => [k, field[k] ?? v])
    ),
  };
  if (nextType === "date") {
    withDefaults.minDateTime = "";
    withDefaults.maxDateTime = "";
  }
  if (nextType === "datetime") {
    withDefaults.minDate = "";
    withDefaults.maxDate = "";
  }
  return withDefaults;
};

const BuilderRow = React.memo(
  function BuilderRow({
    field,
    index,
    total,
    onUpdate,
    onRemove,
    onMove,
    onDuplicate,
  }) {
    const isFirst = index === 0;
    const isLast = index === total - 1;
    const isCheckbox = field.type === "checkbox";
    const isSelect = field.type === "select";
    const isDate = field.type === "date";
    const isDateTime = field.type === "dateTime";

    const handle = useCallback(
      (key, val) => onUpdate({ ...field, [key]: val }),
      [onUpdate, field]
    );

    const onTypeChange = useCallback(
      (e) => {
        const raw = e.target.value;
        const nextType = raw === "dateTime" ? "datetime" : raw;
        const newValues = applyTypeDefaults(field, nextType);

        let changed = false;
        for (const k in newValues) {
          if (newValues[k] !== field[k]) {
            changed = true;
            break;
          }
        }
        if (changed) onUpdate(newValues);
      },
      [onUpdate, field]
    );

    const onMoveUp = useCallback(
      () => onMove(index, index - 1),
      [onMove, index]
    );
    const onMoveDown = useCallback(
      () => onMove(index, index + 1),
      [onMove, index]
    );
    const onDup = useCallback(() => onDuplicate(field), [onDuplicate, field]);
    const onDel = useCallback(() => onRemove(field.id), [onRemove, field.id]);

    const typeItems = useMemo(
      () =>
        FIELD_TYPES.map((t) => (
          <MenuItem key={t.id} value={t.id}>
            {t.label}
          </MenuItem>
        )),
      []
    );

    return (
      <Paper variant="outlined" sx={{ p: 2, mb: 2 }}>
        <Stack
          direction={{ xs: "row" }}
          spacing={2}
          alignItems="center"
          justifyContent="space-between"
        >
          <Stack
            direction="row"
            alignItems="center"
            spacing={1}
            sx={{ minWidth: 180 }}
          >
            <FormControl fullWidth>
              <InputLabel>Type</InputLabel>
              <Select label="Type" value={field.type} onChange={onTypeChange}>
                {typeItems}
              </Select>
            </FormControl>
            <TextField
              label="Name (key)"
              value={field.name}
              onChange={(e) =>
                handle("name", e.target.value.replace(/\s+/g, "_"))
              }
              fullWidth
            />
          </Stack>

          <Stack direction="row" alignItems="center" spacing={1}>
            <Tooltip title="Move up">
              <span>
                <IconButton size="small" onClick={onMoveUp} disabled={isFirst}>
                  <ArrowUpIcon />
                </IconButton>
              </span>
            </Tooltip>
            <Tooltip title="Move down">
              <span>
                <IconButton size="small" onClick={onMoveDown} disabled={isLast}>
                  <ArrowDownIcon />
                </IconButton>
              </span>
            </Tooltip>
          </Stack>
        </Stack>

        <Stack direction={{ xs: "column" }} spacing={2} mt={2}>
          <TextField
            label="Label"
            value={field.label}
            onChange={(e) => handle("label", e.target.value)}
            fullWidth
          />

          {isSelect && (
            <TextField
              label={"Options (comma-separated)"}
              value={field.options}
              onChange={(e) => handle("options", e.target.value)}
              fullWidth
            />
          )}

          {!isSelect && !isCheckbox && !isDate && !isDateTime && (
            <TextField
              label={"Placeholder"}
              value={field.placeholder}
              onChange={(e) => handle("placeholder", e.target.value)}
              fullWidth
            />
          )}

          {!isCheckbox && (
            <TextField
              label="Helper text"
              value={field.helperText}
              onChange={(e) => handle("helperText", e.target.value)}
              fullWidth
            />
          )}

          {isDate && (
            <>
              <Stack direction={{ xs: "column", sm: "row" }} spacing={2}>
                <DatePicker
                  label="Min date"
                  value={field.minDate ? dayjs(field.minDate) : null}
                  onChange={(v) =>
                    handle("minDate", v ? v.format("YYYY-MM-DD") : "")
                  }
                  sx={{ flex: 1 }} // ⬅️ ocupa mitad de la fila
                  slotProps={{ textField: { fullWidth: true } }} // ⬅️ el input llena su contenedor
                />
                <DatePicker
                  label="Max date"
                  value={field.maxDate ? dayjs(field.maxDate) : null}
                  onChange={(v) =>
                    handle("maxDate", v ? v.format("YYYY-MM-DD") : "")
                  }
                  sx={{ flex: 1 }} // ⬅️ ocupa mitad de la fila
                  slotProps={{ textField: { fullWidth: true } }} // ⬅️ el input llena su contenedor
                />
              </Stack>

              <FormControl fullWidth sx={{ mt: 2 }}>
                <InputLabel>Date format</InputLabel>
                <Select
                  label="Date format"
                  value={field.dateFormat || "DD/MM/YYYY"}
                  onChange={(e) => handle("dateFormat", e.target.value)}
                >
                  <MenuItem value="DD/MM/YYYY">DD/MM/YYYY</MenuItem>
                  <MenuItem value="MM/DD/YYYY">MM/DD/YYYY</MenuItem>
                </Select>
              </FormControl>
            </>
          )}

          {isDateTime && (
            <>
              <Stack direction={{ xs: "column", sm: "row" }} spacing={2}>
                <DateTimePicker
                  label="Min Date & Time"
                  ampm={false}
                  value={field.minDateTime ? dayjs(field.minDateTime) : null}
                  onChange={(v) =>
                    handle("minDateTime", v ? v.format("YYYY-MM-DDTHH:mm") : "")
                  }
                  sx={{ flex: 1 }}
                  slotProps={{ textField: { fullWidth: true } }}
                />
                <DateTimePicker
                  label="Max Date & Time"
                  ampm={false}
                  value={field.maxDateTime ? dayjs(field.maxDateTime) : null}
                  onChange={(v) =>
                    handle("maxDateTime", v ? v.format("YYYY-MM-DDTHH:mm") : "")
                  }
                  sx={{ flex: 1 }}
                  slotProps={{ textField: { fullWidth: true } }}
                />
              </Stack>

              <FormControl fullWidth sx={{ mt: 2 }}>
                <InputLabel>Date & time format</InputLabel>
                <Select
                  label="Date & time format"
                  value={field.dateTimeFormat || "DD/MM/YYYY HH:mm"}
                  onChange={(e) => handle("dateTimeFormat", e.target.value)}
                >
                  <MenuItem value="DD/MM/YYYY HH:mm">dd/mm/yyyy HH:mm</MenuItem>
                  <MenuItem value="MM/DD/YYYY HH:mm">mm/dd/yyyy HH:mm</MenuItem>
                </Select>
              </FormControl>
            </>
          )}
        </Stack>

        <Stack
          direction="row"
          spacing={1}
          mt={2}
          justifyContent="space-between"
        >
          <FormControlLabel
            control={
              <Switch
                checked={field.required}
                onChange={(e) => handle("required", e.target.checked)}
              />
            }
            label="Required"
          />
          <Stack direction="row">
            <Tooltip title="Duplicate field">
              <IconButton onClick={onDup}>
                <CopyIcon />
              </IconButton>
            </Tooltip>
            <Tooltip title="Remove field">
              <IconButton color="error" onClick={onDel}>
                <DeleteIcon />
              </IconButton>
            </Tooltip>
          </Stack>
        </Stack>
      </Paper>
    );
  },
  (prev, next) => {
    const a = prev.field,
      b = next.field;
    return (
      prev.index === next.index &&
      prev.total === next.total &&
      a.id === b.id &&
      a.type === b.type &&
      a.label === b.label &&
      a.name === b.name &&
      a.placeholder === b.placeholder &&
      a.helperText === b.helperText &&
      a.required === b.required &&
      a.options === b.options
    );
  }
);

export default BuilderRow;
