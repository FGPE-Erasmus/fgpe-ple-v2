import React, { useState } from "react";
// import Editor from "react-simple-code-editor";
import Prism from "prismjs";
import styled from "@emotion/styled";
// import "../styles/prism.css";
import { Controlled as CodeMirror } from "react-codemirror2";
import { read } from "fs";
require("codemirror/lib/codemirror.css");
require("codemirror/theme/neo.css");
require("codemirror/theme/dracula.css");
// require("codemirror/theme/neat.css");
require("codemirror/mode/xml/xml.js");
require("codemirror/mode/python/python.js");
require("codemirror/mode/shell/shell.js");

export enum languages {
  python = "python",
  java = "java",
  shell = "shell",
}

const CodeEditor = ({
  code,
  setCode,
  language,
  theme,
  lineNumbers,
  readOnly,
  showCursorWhenSelecting,
}: {
  code: string;
  setCode?: (code: string) => void;
  language: languages;
  theme?: string;
  lineNumbers?: boolean;
  readOnly?: boolean;
  showCursorWhenSelecting?: boolean;
}) => {
  return (
    <EditorStyled>
      <CodeMirror
        value={code}
        options={{
          mode: language ? language : "python",
          theme: theme ? theme : "neo",
          lineNumbers: lineNumbers != undefined ? lineNumbers : true,
          readOnly: readOnly ? readOnly : false,
          showCursorWhenSelecting: showCursorWhenSelecting
            ? showCursorWhenSelecting
            : false,
          cursorBlinkRate: showCursorWhenSelecting == undefined ? 530 : -1,
          lineWrapping: true,
        }}
        onBeforeChange={(editor, data, value) => {
          if (setCode) {
            setCode(value);
          }
        }}
        onChange={(editor, data, value) => {}}
        // editorDidMount={(x) => {
        //   console.log("info", x);
        // }}
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
