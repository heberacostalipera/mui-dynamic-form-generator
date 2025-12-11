import { Paper, Typography } from "@mui/material";
import FieldsJsonIO from "./FieldsJsonIO";

const SummaryCard = () => {
  return (
    <Paper
      variant="outlined"
      sx={{
        p: 2,
        border: "1px solid",
        borderColor: "divider",
        bgcolor: "background.paper",
        mb: 2,
      }}
    >
      <Typography variant="h4" fontWeight={700} gutterBottom>
        MUI 7 Dynamic Form Builder
      </Typography>
      <Typography variant="body1" color="text.secondary" gutterBottom>
        Add, edit and reorder fields; the right panel shows the form in real
        time. Export the schema as JSON.
      </Typography>
      <FieldsJsonIO />
    </Paper>
  );
};

export default SummaryCard;
