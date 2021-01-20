import React, { useState } from "react";
// import Editor from "react-simple-code-editor";
import Prism from "prismjs";
import styled from "@emotion/styled";
// import "../styles/prism.css";
import { Controlled as CodeMirror } from "react-codemirror2";

import Editor, { DiffEditor, useMonaco, loader } from "@monaco-editor/react";
import { FindChallenge_programmingLanguages } from "../generated/FindChallenge";

const CodeEditor = ({
  language,
  setCode,
  code,
}: {
  language: FindChallenge_programmingLanguages;
  code: any;
  setCode: (value: string) => void;
}) => {
  function handleEditorChange(value: any, event: any) {
    setCode(value);
    console.log("here is the current model value:", value);
  }

  return (
    <Editor
      language={language.id?.toLowerCase()}
      value={code}
      onChange={handleEditorChange}
      theme="vs-dark"
      wrapperClassName="editor-wrapper"
      className="editor"
      options={{ fixedOverflowWidgets: true }}
    />
  );
};

const EditorStyled = styled.div`
  /* border-radius: 5px;
  height: 100%;
  textarea:focus {
    outline: none;
  } */
  height: 100%;
  .editor {
    padding: 0;
    margin: 0;
    position: absolute;
    top: 0;
    left: 0;
  }

  .editor-wrapper {
    padding: 0;
    margin: 0;
  }
  padding: 0;
  margin: 0;
`;

export default CodeEditor;
