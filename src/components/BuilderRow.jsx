import React, { useCallback, useMemo } from "react";

// MUI
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

// Icons
import {
  Delete as DeleteIcon,
  ContentCopy as CopyIcon,
  ArrowUpward as ArrowUpIcon,
  ArrowDownward as ArrowDownIcon,
} from "@mui/icons-material";

// Date Pickers
import { DatePicker } from "@mui/x-date-pickers/DatePicker";
import { DateTimePicker } from "@mui/x-date-pickers/DateTimePicker";
import dayjs from "dayjs";

// eslint-disable-next-line no-unused-vars
import { motion } from "framer-motion";

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
    format: "DD/MM/YYYY",
    minDate: "",
    maxDate: "",
    minDateTime: "",
    maxDateTime: "",
  },
  dateTime: {
    placeholder: "",
    helperText: "",
    format: "DD/MM/YYYY HH:mm",
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
  if (nextType === "dateTime") {
    withDefaults.minDate = "";
    withDefaults.maxDate = "";
  }
  return withDefaults;
};

const BuilderRow = ({
  field,
  index,
  total,
  onUpdate,
  onRemove,
  onMove,
  onDuplicate,
}) => {
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
      const nextType = e.target.value;
      const newValues = applyTypeDefaults(field, nextType);
      if (Object.keys(newValues).some((k) => newValues[k] !== field[k]))
        onUpdate(newValues);
    },
    [onUpdate, field]
  );

  const onMoveUp = useCallback(() => onMove(index, index - 1), [onMove, index]);
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
    <motion.div
      layout
      initial={{ opacity: 0, y: 10, scale: 0.98 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      exit={{ opacity: 0, y: -8, scale: 0.98 }}
      transition={{
        type: "spring",
        stiffness: 600,
        damping: 38,
        mass: 0.6,
      }}
    >
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
                  format={field.format}
                  label="Min date"
                  value={field.minDate ? dayjs(field.minDate) : null}
                  onChange={(v) =>
                    handle("minDate", v ? v.format("YYYY-MM-DD") : "")
                  }
                  sx={{ flex: 1 }} // ⬅️ ocupa mitad de la fila
                  slotProps={{ textField: { fullWidth: true } }} // ⬅️ el input llena su contenedor
                />
                <DatePicker
                  format={field.format}
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
                  value={field.format || "DD/MM/YYYY"}
                  onChange={(e) => handle("format", e.target.value)}
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
                  format={field.format}
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
                  format={field.format}
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
                  value={field.format || "DD/MM/YYYY HH:mm"}
                  onChange={(e) => handle("format", e.target.value)}
                >
                  <MenuItem value="DD/MM/YYYY HH:mm">DD/MM/YYYY HH:mm</MenuItem>
                  <MenuItem value="MM/DD/YYYY HH:mm">MM/DD/YYYY HH:mm</MenuItem>
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
    </motion.div>
  );
};

export default React.memo(
  BuilderRow,
  (prev, next) =>
    prev.index === next.index &&
    prev.total === next.total &&
    prev.field === next.field
);
