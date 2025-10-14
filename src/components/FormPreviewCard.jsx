import { useCallback, useMemo, useState } from "react";
import {
  Box,
  Button,
  Chip,
  Divider,
  Paper,
  Stack,
  Tooltip,
  Typography,
} from "@mui/material";

// Hooks
import { useFields } from "../context/fields-context";

// Components
import FieldPreview from "./FieldPreview";
import FormDialogWrapper from "./FormDialogWrapper";

const FormPreviewCard = () => {
  const { fields } = useFields();
  const [formValues, setFormValues] = useState({});
  const [submitted, setSubmitted] = useState(false);

  const validate = useCallback(() => {
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
  }, [fields, formValues]);

  const errors = useMemo(validate, [validate, submitted]);

  const onChange = useCallback((name, value) => {
    setFormValues((v) => ({ ...v, [name]: value }));
  }, []);

  const handleSubmit = useCallback(
    (onSubmit) => (e) => {
      e.preventDefault();
      setSubmitted(true);
      const errs = validate();
      if (Object.keys(errs).length === 0) {
        onSubmit({ fields, values: formValues });
      }
    },
    [validate, formValues, fields]
  );

  return (
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
          <Chip label={`${fields.length} fields`} />
        </Tooltip>
      </Stack>
      <Divider sx={{ mb: 2 }} />
      <FormDialogWrapper>
        {(onSubmit) => (
          <Box component="form" onSubmit={handleSubmit(onSubmit)} noValidate>
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
        )}
      </FormDialogWrapper>
    </Paper>
  );
};

export default FormPreviewCard;
