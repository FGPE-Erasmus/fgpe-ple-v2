import React, { useEffect, useRef, useState } from "react";
// import Editor from "react-simple-code-editor";
import Prism from "prismjs";
import styled from "@emotion/styled";
// import "../styles/prism.css";
import { Controlled as CodeMirror } from "react-codemirror2";

import Editor, { DiffEditor, useMonaco, loader } from "@monaco-editor/react";
import { FindChallenge_programmingLanguages } from "../generated/FindChallenge";
import { SettingsContext } from "./Exercise/SettingsContext";
import { useContext } from "react";
// import { useHotkeys } from "react-hotkeys-hook";
import useHotKeys from "./Exercise/useHotKeys";

const CodeEditor = ({
  language,
  setCode,
  code,
  evaluateSubmission,
  validateSubmission,
}: {
  language: FindChallenge_programmingLanguages;
  code: any;
  setCode: (value: string) => void;
  evaluateSubmission: () => void;
  validateSubmission: () => void;
}) => {
  const hotkeys = useHotKeys({ validateSubmission, evaluateSubmission });

  const { editorTheme } = useContext(SettingsContext);

  const editorRef = useRef({
    _actions: { submitYourCode: {}, runYourCode: {} },
    addAction: (x: any) => {},
  });
  const monaco = useMonaco();

  function handleEditorDidMount(editor: any) {
    // here is the editor instance
    // you can store it in `useRef` for further usage
    // console.log("editor", editor);
    editorRef.current = editor;

    editor.addAction({
      // An unique identifier of the contributed action.
      id: "runYourCode",
      // A label of the action that will be presented to the user.
      label: "Run your code",
      // An optional array of keybindings for the action.
      keybindings: [monaco.KeyMod.CtrlCmd | monaco.KeyCode.Enter],
      // A precondition for this action.
      precondition: null,
      // A rule to evaluate on top of the precondition in order to dispatch the keybindings.
      keybindingContext: null,
      contextMenuGroupId: "navigation",
      contextMenuOrder: 1.5,
      // Method that will be executed when the action is triggered.
      // @param editor The editor instance is passed in as a convinience
      run: function (ed: any) {
        // console.log("VALIDATE");
        validateSubmission();
        return null;
      },
    });

    editorRef.current.addAction({
      id: "submitYourCode",
      label: "Submit your code",
      keybindings: [monaco.KeyMod.CtrlCmd | monaco.KeyCode.US_BACKSLASH],
      precondition: null,
      keybindingContext: null,
      contextMenuGroupId: "navigation",
      contextMenuOrder: 1.5,
      run: function (ed: any) {
        // console.log("EVALUATE");
        evaluateSubmission();
        return null;
      },
    });
  }

  useEffect(() => {
    if (monaco && editorRef.current) {
      editorRef.current.addAction({
        // An unique identifier of the contributed action.
        id: "runYourCode",
        // A label of the action that will be presented to the user.
        label: "Run your code",
        // An optional array of keybindings for the action.
        keybindings: [monaco.KeyMod.CtrlCmd | monaco.KeyCode.Enter],
        // A precondition for this action.
        precondition: null,
        // A rule to evaluate on top of the precondition in order to dispatch the keybindings.
        keybindingContext: null,
        contextMenuGroupId: "navigation",
        contextMenuOrder: 1.5,
        // Method that will be executed when the action is triggered.
        // @param editor The editor instance is passed in as a convinience
        run: function (ed: any) {
          // console.log("VALIDATE");
          validateSubmission();
          return null;
        },
      });
      // }

      if (!editorRef.current._actions.runYourCode) {
        editorRef.current.addAction({
          id: "submitYourCode",
          label: "Submit your code",
          keybindings: [monaco.KeyMod.CtrlCmd | monaco.KeyCode.US_BACKSLASH],
          precondition: null,
          keybindingContext: null,
          contextMenuGroupId: "navigation",
          contextMenuOrder: 1.5,
          run: function (ed: any) {
            // console.log("EVALUATE");
            evaluateSubmission();
            return null;
          },
        });
      }
    }
  }, [monaco, editorRef, language]);

  function handleEditorChange(value: any, event: any) {
    setCode(value);
    // console.log("here is the current model value:", value);
  }

  if (!monaco) {
    return <EditorStyled>Loading...</EditorStyled>;
  }

  return (
    <EditorStyled>
      <Editor
        onMount={handleEditorDidMount}
        language={language.id?.toLowerCase()}
        value={code}
        onChange={handleEditorChange}
        theme={editorTheme}
        wrapperClassName="editor-wrapper"
        className="editor"
        options={{
          fixedOverflowWidgets: true,
          wordWrap: "on",
          minimap: {
            enabled: false,
          },
        }}
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
  border-top: 1px solid rgba(0, 0, 0, 0.1);
`;

export default CodeEditor;
