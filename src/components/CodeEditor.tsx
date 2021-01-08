import React, { useState } from "react";
import Editor from "react-simple-code-editor";
import Prism from "prismjs";
import styled from "@emotion/styled";
import "../styles/prism.css";

const CodeEditor = ({
  code,
  setCode,
}: {
  code: string;
  setCode: (code: string) => void;
}) => {
  return (
    <EditorStyled>
      <Editor
        value={code}
        onValueChange={(code) => setCode(code)}
        highlight={(code) =>
          Prism.highlight(code, Prism.languages.javascript, "javascript")
        }
        padding={10}
        style={{
          fontFamily: '"Fira code", "Fira Mono", monospace',
          fontSize: 15,
          backgroundColor: "white",
          minHeight: 150,
          borderRadius: 5,
          border: "none",
        }}
      />
    </EditorStyled>
  );
};

const EditorStyled = styled.div`
  textarea:focus {
    outline: none;
  }
`;

export default CodeEditor;
