// MUI
import { Box, Button, Divider, Paper, Stack, Typography } from "@mui/material";
import {
  Add as AddIcon,
  Delete as DeleteIcon,
  PlaylistAdd as PlaylistAddIcon,
} from "@mui/icons-material";

// eslint-disable-next-line no-unused-vars
import { AnimatePresence, motion } from "framer-motion";

// Hooks
import { useFields } from "../context/fields-context";

// Components
import BuilderRow from "./BuilderRow";

const styles = {
  rootPaper: {
    p: 2,
    flex: 1,
    border: "1px solid",
    borderColor: "divider",
    bgcolor: "background.paper",
  },
  placeholderBox: {
    p: 2,
    color: "text.secondary",
  },
};

const FormBuilderCard = () => {
  const {
    fields,
    addField,
    removeField,
    duplicateField,
    moveField,
    updateField,
    clearForm,
  } = useFields();

  console.log("render builder card");

  return (
    <Paper elevation={0} sx={styles.rootPaper}>
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
            startIcon={<DeleteIcon />}
            variant="outlined"
            onClick={clearForm}
            color="error"
          >
            Clear form
          </Button>
        </Stack>
      </Stack>
      <Divider sx={{ mb: 2 }} />

      {fields.length === 0 && (
        <Box sx={styles.placeholderBox}>No fields yet. Click "Add field".</Box>
      )}

      <AnimatePresence initial={false}>
        {fields.map((f, idx) => (
          <BuilderRow
            field={f}
            index={idx}
            total={fields.length}
            onUpdate={updateField}
            onRemove={removeField}
            onMove={moveField}
            onDuplicate={duplicateField}
            key={f.id}
          />
        ))}
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
          style={{ borderRadius: 12 }}
        >
          <Stack direction="row" spacing={1} justifyContent="center">
            <Button
              disableElevation
              startIcon={<AddIcon />}
              variant="contained"
              onClick={addField}
            >
              Add field
            </Button>
          </Stack>
        </motion.div>
      </AnimatePresence>
    </Paper>
  );
};

export default FormBuilderCard;
