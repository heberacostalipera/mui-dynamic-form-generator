import React, { useState, useCallback, useEffect } from "react";
import { Box, Button, Divider, Stack, Typography } from "@mui/material";

import {
  Add as AddIcon,
  PlaylistAdd as PlaylistAddIcon,
} from "@mui/icons-material";
import { AnimatePresence, motion } from "framer-motion";

import BuilderRow from "./BuilderRow";

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
  // date/datetime only:
  dateFormat: "DD/MM/YYYY", // para 'date'
  dateTimeFormat: "DD/MM/YYYY HH:mm", // para 'datetime' (24hs)
  minDate: "", // YYYY-MM-DD
  maxDate: "", // YYYY-MM-DD
  minDateTime: "", // YYYY-MM-DDTHH:mm
  maxDateTime: "", // YYYY-MM-DDTHH:mm
  ...overrides,
});

function moveIndex(arr, from, to) {
  if (to < 0 || to >= arr.length) return arr;
  const copy = [...arr];
  const [it] = copy.splice(from, 1);
  copy.splice(to, 0, it);
  return copy;
}

const FormBuilder = () => {
  const [fields, setFields] = useState(() => {
    try {
      return [
        newField({
          label: "Full name",
          name: "fullName",
          placeholder: "John Doe",
        }),
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
      ];
    } catch {
      return [];
    }
  });

  const updateField = useCallback(
    () => (f) => setFields((prev) => prev.map((x) => (x.id === f.id ? f : x))),
    []
  );
  const removeField = useCallback(
    () => (id) => setFields((prev) => prev.filter((x) => x.id !== id)),
    []
  );
  const moveField = useCallback(
    () => (from, to) => setFields((prev) => moveIndex(prev, from, to)),
    []
  );
  const duplicateField = useCallback(
    () => (f) =>
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
      }),
    []
  );

  const addField = useCallback(
    () =>
      setFields((prev) => [
        ...prev,
        newField({ label: `Field ${prev.length + 1}` }),
      ]),
    []
  );

  return (
    <>
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
    </>
  );
};

export default FormBuilder;
