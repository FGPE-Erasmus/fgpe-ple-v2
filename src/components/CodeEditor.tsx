import React, { useState } from "react";
// import Editor from "react-simple-code-editor";
import Prism from "prismjs";
import styled from "@emotion/styled";
// import "../styles/prism.css";
import { Controlled as CodeMirror } from "react-codemirror2";
require("codemirror/lib/codemirror.css");
require("codemirror/theme/neo.css");
// require("codemirror/theme/neat.css");
require("codemirror/mode/xml/xml.js");
require("codemirror/mode/python/python.js");

const options = {
  mode: "python",
  theme: "neo",
  lineNumbers: true,
};

const CodeEditor = ({
  code,
  setCode,
  language,
}: {
  code: string;
  setCode: (code: string) => void;
  language?: string;
}) => {
  return (
    <EditorStyled>
      <CodeMirror
        value={code}
        options={options}
        onBeforeChange={(editor, data, value) => {
          setCode(value);
        }}
        onChange={(editor, data, value) => {}}
      />
    </EditorStyled>
  );
};

const EditorStyled = styled.div`
  /* border-radius: 5px;
  height: 100%;
  textarea:focus {
    outline: none;
  } */
  height: 100%;

  .react-codemirror2 {
    height: 100%;
  }

  .CodeMirror {
    height: 100%;
  }
`;

export default CodeEditor;
