import {
  Box,
  Container,
  CssBaseline,
  Divider,
  Link,
  Typography,
} from "@mui/material";

// Components
import SchemaContentCard from "./components/SchemaContentCard";
import FormBuilderCard from "./components/FormBuilderCard";
import FormPreviewCard from "./components/FormPreviewCard";
import FieldsProvider from "./providers/FieldsProvider";
import SummaryCard from "./components/SummaryCard";

const styles = {
  main: {
    p: {
      xs: 2,
      md: 3,
    },
    bgcolor: "#fafafa",
    minHeight: "100vh",
  },
  content: {
    display: "flex",
    flexDirection: {
      xs: "column",
      md: "row",
    },
    gap: 2,
  },
  column: {
    display: "flex",
    flexDirection: "column",
    gap: 2,
    flex: 1,
  },
};

const LICENSE_URL =
  "https://github.com/heberacostalipera/mui-dynamic-form-generator?tab=MIT-1-ov-file";

export default function App() {
  return (
    <FieldsProvider>
      <CssBaseline />
      <Box sx={styles.main}>
        <Container maxWidth="xl">
          <SummaryCard />
          <Box sx={styles.content}>
            <FormBuilderCard />
            <Box sx={styles.column}>
              <FormPreviewCard />
              <SchemaContentCard />
            </Box>
          </Box>
          <Box component="footer" sx={{ mt: 6, pb: 4 }}>
            <Divider sx={{ mb: 2 }} />
            <Typography variant="body2" color="text.secondary" align="center">
              © {new Date().getFullYear()} Heber Acosta Lipera ·{" "}
              <Link
                href={LICENSE_URL}
                rel="noopener noreferrer"
                target="_blank"
                underline="hover"
              >
                MIT License
              </Link>{" "}
              · Built with{" "}
              <Link
                href="https://mui.com/"
                rel="noopener noreferrer"
                target="_blank"
                underline="hover"
              >
                Material UI
              </Link>
            </Typography>
          </Box>
        </Container>
      </Box>
    </FieldsProvider>
  );
}
