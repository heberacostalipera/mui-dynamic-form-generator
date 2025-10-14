import React, { useMemo } from "react";

// MUI
import { Button, Paper, Stack, Typography } from "@mui/material";
import {
  ContentCopy as CopyIcon,
  Check as CheckIcon,
} from "@mui/icons-material";

// JSON
import { PrismLight as SyntaxHighlighter } from "react-syntax-highlighter";
import jsonLang from "react-syntax-highlighter/dist/esm/languages/prism/json";
import { vscDarkPlus } from "react-syntax-highlighter/dist/esm/styles/prism";

// Hooks
import { useFields } from "../context/fields-context";

SyntaxHighlighter.registerLanguage("json", jsonLang);

function SchemaCopyButton({ schema }) {
  const [copied, setCopied] = React.useState(false);
  const json = useMemo(() => JSON.stringify(schema, null, 2), [schema]);

  const onCopy = async () => {
    try {
      await navigator.clipboard.writeText(json);
      setCopied(true);
      setTimeout(() => setCopied(false), 1200);
    } catch {
      console.error("Copy to clipboard failed");
    }
  };

  const Icon = copied ? CheckIcon : CopyIcon;

  return (
    <Button
      disableElevation
      startIcon={<Icon />}
      size="small"
      onClick={onCopy}
      aria-label="Copy JSON schema"
      variant="outlined"
    >
      {copied ? "Copied" : "Copy schema"}
    </Button>
  );
}

const SchemaContentCard = () => {
  const { fields } = useFields();
  // eslint-disable-next-line no-unused-vars
  const schema = useMemo(() => fields.map(({ id, ...rest }) => rest), [fields]);

  return (
    <Paper
      elevation={0}
      sx={{
        border: "1px solid",
        borderColor: "divider",
        bgcolor: "background.paper",
        overflow: "hidden",
      }}
    >
      <Stack
        direction="row"
        justifyContent="space-between"
        alignItems="center"
        p={2}
      >
        <Typography variant="h6">Schema</Typography>
        <SchemaCopyButton schema={schema} />
      </Stack>
      <SyntaxHighlighter
        language="json"
        style={vscDarkPlus}
        customStyle={{
          margin: 0,
          maxHeight: "70vh",
          overflow: "auto",
          fontSize: 13,
        }}
        showLineNumbers
        wrapLongLines
      >
        {JSON.stringify(schema, null, 2)}
      </SyntaxHighlighter>
    </Paper>
  );
};

export default SchemaContentCard;
