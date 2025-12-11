import React, { useState, useCallback } from "react";
import {
  Box,
  Button,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Divider,
  Table,
  TableHead,
  TableRow,
  TableCell,
  TableBody,
  Typography,
} from "@mui/material";
import {
  ContentCopy as CopyIcon,
  Check as CheckIcon,
} from "@mui/icons-material";

// JSON
import { PrismLight as SyntaxHighlighter } from "react-syntax-highlighter";
import jsonLang from "react-syntax-highlighter/dist/esm/languages/prism/json";
import { vscDarkPlus } from "react-syntax-highlighter/dist/esm/styles/prism";

SyntaxHighlighter.registerLanguage("json", jsonLang);

export default function SubmitResultDialog({ open, onClose, rows, json }) {
  const [copied, setCopied] = useState(false);

  const onCopyJson = useCallback(async () => {
    try {
      await navigator.clipboard.writeText(json);
      setCopied(true);
      setTimeout(() => setCopied(false), 1200);
    } catch {
      console.error("Copy to clipboard failed");
    }
  }, [json]);

  return (
    <Dialog open={open} onClose={onClose} maxWidth="md" fullWidth>
      <DialogTitle>Submitted data</DialogTitle>
      <DialogContent dividers>
        <Table size="small" stickyHeader>
          <TableHead>
            <TableRow>
              <TableCell>Label</TableCell>
              <TableCell>Name</TableCell>
              <TableCell>Value</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {rows.map((r) => (
              <TableRow key={r.name}>
                <TableCell sx={{ whiteSpace: "nowrap" }}>{r.label}</TableCell>
                <TableCell sx={{ fontFamily: "monospace" }}>{r.name}</TableCell>
                <TableCell sx={{ maxWidth: 480, whiteSpace: "pre-wrap" }}>
                  {r.value}
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>

        <Divider sx={{ my: 2 }} />

        <Typography variant="subtitle2" gutterBottom>
          JSON
        </Typography>
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
          {json}
        </SyntaxHighlighter>
      </DialogContent>
      <DialogActions>
        <Button
          startIcon={copied ? <CheckIcon /> : <CopyIcon />}
          onClick={onCopyJson}
        >
          {copied ? "Copied" : "Copy JSON"}
        </Button>
        <Button variant="contained" onClick={onClose} disableElevation>
          Close
        </Button>
      </DialogActions>
    </Dialog>
  );
}
