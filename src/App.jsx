import { Box, CssBaseline, Typography } from "@mui/material";

// Components
import SchemaContentCard from "./components/SchemaContentCard";
import FormBuilderCard from "./components/FormBuilderCard";
import FormPreviewCard from "./components/FormPreviewCard";
import FieldsProvider from "./providers/FieldsProvider";

export default function App() {
  return (
    <FieldsProvider>
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
          <FormBuilderCard />
          <Box
            sx={{
              display: "flex",
              flexDirection: "column",
              gap: 2,
              flex: 1,
            }}
          >
            <FormPreviewCard />
            <SchemaContentCard />
          </Box>
        </Box>
      </Box>
    </FieldsProvider>
  );
}
