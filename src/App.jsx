import React, { useMemo, useState } from "react";
import {
  Box,
  Button,
  Chip,
  CssBaseline,
  Divider,
  Paper,
  Stack,
  Tooltip,
  Typography,
} from "@mui/material";

import {
  Add as AddIcon,
  PlaylistAdd as PlaylistAddIcon,
} from "@mui/icons-material";
import { AnimatePresence, motion } from "framer-motion";

// Components
import SchemaContent from "./components/SchemaContent";
import BuilderRow from "./components/BuilderRow";
import FieldPreview from "./components/FieldPreview";

// --- Types and helpers -----------------------------------------------------
const newField = (overrides = {}) => ({
  id: crypto.randomUUID(),
  name: "field_" + Math.random().toString(36).slice(2, 7),
  label: "Untitled",
  type: "text",
  required: false,
  fullWidth: true,
  placeholder: "",
  helperText: "",
  options: "Option A, Option B", // used for select
  ...overrides,
});

function moveIndex(arr, from, to) {
  if (to < 0 || to >= arr.length) return arr;
  const copy = [...arr];
  const [it] = copy.splice(from, 1);
  copy.splice(to, 0, it);
  return copy;
}

// --- Main App ---------------------------------------------------------------
export default function App() {
  const [fields, setFields] = useState([
    newField({ label: "Full name", name: "fullName", placeholder: "John Doe" }),
    newField({
      label: "Email",
      name: "email",
      type: "email",
      placeholder: "you@example.com",
      required: true,
    }),
    newField({
      label: "About you",
      name: "about",
      type: "textarea",
      helperText: "A short bio",
    }),
    newField({
      label: "Role",
      name: "role",
      type: "select",
      options: "Engineer, Designer, Product",
    }),
    newField({
      label: "Accept terms",
      name: "terms",
      type: "checkbox",
      required: true,
    }),
  ]);

  const [formValues, setFormValues] = useState({});
  const [submitted, setSubmitted] = useState(false);

  const updateField = (f) =>
    setFields((prev) => prev.map((x) => (x.id === f.id ? f : x)));
  const removeField = (id) =>
    setFields((prev) => prev.filter((x) => x.id !== id));
  const moveField = (from, to) =>
    setFields((prev) => moveIndex(prev, from, to));
  const duplicateField = (f) =>
    setFields((prev) => {
      const clone = {
        ...f,
        id: crypto.randomUUID(),
        name: f.name + "_copy",
        label: f.label + " (copy)",
      };
      const idx = prev.findIndex((x) => x.id === f.id);
      const copy = [...prev];
      copy.splice(idx + 1, 0, clone);
      return copy;
    });

  const addField = () =>
    setFields((prev) => [
      ...prev,
      newField({ label: `Field ${prev.length + 1}` }),
    ]);

  const schema = useMemo(() => fields.map(({ id, ...rest }) => rest), [fields]);

  const validate = () => {
    const errors = {};
    for (const f of fields) {
      if (f.required) {
        const v = formValues[f.name];
        if (f.type === "checkbox") {
          if (!v) errors[f.name] = "Required";
        } else if (!v || String(v).trim() === "") {
          errors[f.name] = "Required";
        }
      }
      if (f.type === "email" && formValues[f.name]) {
        const ok = /[^@\s]+@[^@\s]+\.[^@\s]+/.test(String(formValues[f.name]));
        if (!ok) errors[f.name] = "Invalid email";
      }
    }
    return errors;
  };

  const errors = useMemo(validate, [fields, formValues, submitted]);

  const onChange = (name, value) =>
    setFormValues((v) => ({ ...v, [name]: value }));

  const onSubmit = (e) => {
    e.preventDefault();
    setSubmitted(true);
    const errs = validate();
    if (Object.keys(errs).length === 0) {
      alert("Submitted!\n" + JSON.stringify(formValues, null, 2));
    }
  };

  return (
    <>
      <CssBaseline />
      <Box sx={{ p: { xs: 2, md: 3 }, bgcolor: "#fafafa", minHeight: "100vh" }}>
        <Typography variant="h4" fontWeight={700} gutterBottom>
          MUI 7 Dynamic Form Builder
        </Typography>
        <Typography variant="body1" color="text.secondary" gutterBottom>
          Add, edit and reorder fields; the right panel shows the form in real
          time. Export the schema as JSON.
        </Typography>

        <Box
          sx={{
            display: "flex",
            flexDirection: {
              xs: "column",
              md: "row",
            },
            gap: 2,
          }}
        >
          {/* Builder (Left) */}
          <Paper
            elevation={0}
            sx={{
              p: 2,
              flex: 1,
              border: "1px solid",
              borderColor: "divider",
              bgcolor: "background.paper",
            }}
          >
            <Stack
              direction="row"
              justifyContent="space-between"
              alignItems="center"
              mb={1}
            >
              <Stack direction="row" spacing={1} alignItems="center">
                <PlaylistAddIcon />
                <Typography variant="h6">Form Builder</Typography>
              </Stack>
              <Stack direction="row" spacing={1}>
                <Button
                  disableElevation
                  startIcon={<AddIcon />}
                  variant="contained"
                  onClick={addField}
                >
                  Add field
                </Button>
              </Stack>
            </Stack>
            <Divider sx={{ mb: 2 }} />

            {fields.length === 0 && (
              <Box sx={{ p: 2, color: "text.secondary" }}>
                No fields yet. Click "Add field".
              </Box>
            )}

            <AnimatePresence initial={false}>
              {fields.map((f, idx) => (
                <motion.div
                  key={f.id}
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
                  style={{ borderRadius: 12 }}
                >
                  <BuilderRow
                    field={f}
                    index={idx}
                    total={fields.length}
                    onUpdate={updateField}
                    onRemove={removeField}
                    onMove={moveField}
                    onDuplicate={duplicateField}
                  />
                </motion.div>
              ))}
            </AnimatePresence>
          </Paper>

          <Box
            sx={{
              display: "flex",
              flexDirection: "column",
              gap: 2,
              flex: 1,
            }}
          >
            <Paper
              elevation={0}
              sx={{
                p: 2,
                border: "1px solid",
                borderColor: "divider",
                bgcolor: "background.paper",
              }}
            >
              <Stack
                direction="row"
                justifyContent="space-between"
                alignItems="center"
                mb={1}
              >
                <Typography variant="h6">Live Preview</Typography>
                <Tooltip title="Show current schema">
                  <Chip label={`${schema.length} fields`} />
                </Tooltip>
              </Stack>
              <Divider sx={{ mb: 2 }} />

              <Box component="form" onSubmit={onSubmit} noValidate>
                <Stack spacing={2}>
                  {fields.map((f) => (
                    <FieldPreview
                      key={f.id}
                      field={f}
                      value={formValues[f.name]}
                      onChange={onChange}
                      error={submitted ? errors[f.name] : undefined}
                    />
                  ))}
                  <Stack direction="row" spacing={1}>
                    <Button disableElevation type="submit" variant="contained">
                      Submit
                    </Button>
                    <Button
                      disableElevation
                      variant="outlined"
                      onClick={() => {
                        setFormValues({});
                        setSubmitted(false);
                      }}
                    >
                      Reset
                    </Button>
                  </Stack>
                </Stack>
              </Box>
            </Paper>
            <Paper
              elevation={0}
              sx={{
                border: "1px solid",
                borderColor: "divider",
                bgcolor: "background.paper",
                overflow: "hidden",
              }}
            >
              <SchemaContent schema={schema} />
            </Paper>
          </Box>
        </Box>
      </Box>
    </>
  );
}
