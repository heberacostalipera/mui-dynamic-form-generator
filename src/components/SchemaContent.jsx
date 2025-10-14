import React, { useMemo } from "react";
import { Button, Stack, Tooltip, Typography } from "@mui/material";
import {
  ContentCopy as CopyIcon,
  Check as CheckIcon,
} from "@mui/icons-material";

import { PrismLight as SyntaxHighlighter } from "react-syntax-highlighter";
import jsonLang from "react-syntax-highlighter/dist/esm/languages/prism/json";
import { vscDarkPlus } from "react-syntax-highlighter/dist/esm/styles/prism";

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

const SchemaContent = ({ schema }) => {
  return (
    <>
      <Stack
        direction="row"
        justifyContent="space-between"
        alignItems="center"
        p={2}
      >
        <Typography variant="h6">Schema JSON</Typography>
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
    </>
  );
};

export default SchemaContent;
