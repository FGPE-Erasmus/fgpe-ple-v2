import styled from "@emotion/styled";
import Editor, { useMonaco } from "@monaco-editor/react";
import React, { useContext, useEffect, useRef } from "react";
import { FindChallenge_programmingLanguages } from "../generated/FindChallenge";
import { SettingsContext } from "./Exercise/SettingsContext";
// import { useHotkeys } from "react-hotkeys-hook";
import useHotKeys from "./Exercise/useHotKeys";

import constrainedEditor from "constrained-editor-plugin/dist/esm/constrainedEditor";
import { AnimatePresence, motion } from "framer-motion";
// import constrainedEditor1 from "constrained-editor-plugin";

const findPos = (input: string, stringWeLookingFor: string) => {
  const indexToFind = input.indexOf(stringWeLookingFor);
  if (indexToFind < 0) {
    return false;
  }

  const tempString = input.substring(0, indexToFind);
  const lines = tempString.split("\n");
  const lineNumber = lines.length;

  const col = (lines[lineNumber - 1] + stringWeLookingFor).indexOf(
    stringWeLookingFor
  );

  if (col < 0) {
    return false;
  }

  return { col, row: lineNumber };
};

export interface CodeEditorProps {
  language: FindChallenge_programmingLanguages;
  code: any;
  setCode: (value: string) => void;
  evaluateSubmission: () => void;
  validateSubmission: () => void;

  //** If true, the editor will check first if the code is available */
  lockLines?: boolean;

  exerciseId?: string | null;
}

const CodeEditor = ({
  language,
  setCode,
  code,
  evaluateSubmission,
  validateSubmission,
  lockLines,
  exerciseId,
}: CodeEditorProps) => {
  const hotkeys = useHotKeys({ validateSubmission, evaluateSubmission });

  const { editorTheme } = useContext(SettingsContext);

  const editorRef = useRef({
    _actions: { submitYourCode: {}, runYourCode: {} },
    addAction: (x: any) => {},
    getModel: () => {},
  });
  const monaco = useMonaco();

  function handleEditorDidMount(editor: any) {
    // here is the editor instance
    // you can store it in `useRef` for further usage
    // console.log("editor", editor);
    editorRef.current = editor;

    const startOfEditableCode = findPos(code, "{{");
    console.log("START", startOfEditableCode);
    const endOfEditableCode = findPos(code, "}}");
    console.log("END", endOfEditableCode);

    if (startOfEditableCode && endOfEditableCode) {
      const constrainedInstance = constrainedEditor(monaco);
      const model = editorRef.current.getModel() as any;
      constrainedInstance.initializeIn(editorRef.current);
      model.setValue(code);

      const blocked = [
        {
          range: [
            startOfEditableCode.row,
            startOfEditableCode.col,
            endOfEditableCode.row,
            endOfEditableCode.col,
          ],
          allowMultiline: true,
        },
      ];

      constrainedInstance.addRestrictionsTo(model, blocked);
      console.log("ELDO", constrainedInstance);
    }

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
      {/* <div style={{ position: "absolute", color: "white" }}>
        {exerciseId && exerciseId}
      </div> */}

      <AnimatePresence exitBeforeEnter>
        <motion.div
          key={exerciseId}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="editor"
          style={{ height: "100%" }}
        >
          {code && (
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
          )}
        </motion.div>
      </AnimatePresence>
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
