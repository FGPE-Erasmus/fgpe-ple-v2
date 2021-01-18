import React, { useState } from "react";
// import Editor from "react-simple-code-editor";
import Prism from "prismjs";
import styled from "@emotion/styled";
// import "../styles/prism.css";
import { Controlled as CodeMirror } from "react-codemirror2";

import Editor, { DiffEditor, useMonaco, loader } from "@monaco-editor/react";

export enum languages {
  python = "python",
  java = "java",
  shell = "shell",
}

const CodeEditor = ({
  language,
  setCode,
  code,
}: {
  language: languages;
  code: any;
  setCode: (value: string) => void;
}) => {
  function handleEditorChange(value: any, event: any) {
    setCode(value);
    console.log("here is the current model value:", value);
  }

  return (
    <EditorStyled>
      <Editor
        language={language}
        defaultValue="#some content"
        value={code}
        onChange={handleEditorChange}
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
