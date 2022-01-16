import styled from "@emotion/styled";
import Editor, { useMonaco } from "@monaco-editor/react";
import React, { useContext, useEffect, useRef, useState } from "react";
import { FindChallenge_programmingLanguages } from "../generated/FindChallenge";
import { SettingsContext } from "./Exercise/SettingsContext";
// import { useHotkeys } from "react-hotkeys-hook";
import useHotKeys from "./Exercise/useHotKeys";

import constrainedEditor from "constrained-editor-plugin/dist/esm/constrainedEditor";
import { AnimatePresence, motion } from "framer-motion";
// import constrainedEditor1 from "constrained-editor-plugin";

// const findAllOccurrences = (str: string, substr: string) => {
//   str = str.toLowerCase();

//   let result = [];

//   let idx = str.indexOf(substr);

//   while (idx !== -1) {
//     result.push(idx);
//     idx = str.indexOf(substr, idx + 1);
//   }
//   return result;
// };

// const findPositions = (
//   input: string,
//   stringWeLookingFor: string,
//   isStartString?: boolean
// ) => {
//   const indices = findAllOccurrences(input, stringWeLookingFor);
//   console.log("indices", indices);
//   if (indices.length < 1) {
//     return false;
//   }

//   const coordinates = indices.map((indexToFind) => {
//     const tempString = input.substring(0, indexToFind);
//     const lines = tempString.split("\n");
//     const lineNumber = lines.length;

//     const col =
//       (lines[lineNumber - 1] + stringWeLookingFor).indexOf(stringWeLookingFor) +
//       (isStartString ? stringWeLookingFor.length : 0);

//     if (col < 0) {
//       return false;
//     }

//     return { col, row: lineNumber };
//   });

//   return coordinates;
// };

const findPos = (
  input: string,
  stringWeLookingFor: string,
  isStartString?: boolean
) => {
  const indexToFind = input.indexOf(stringWeLookingFor);
  if (indexToFind < 0) {
    return false;
  }

  const tempString = input.substring(0, indexToFind);
  const lines = tempString.split("\n");
  const lineNumber = lines.length;

  const col =
    (lines[lineNumber - 1] + stringWeLookingFor).indexOf(stringWeLookingFor) +
    (isStartString ? stringWeLookingFor.length : 0);

  if (col < 0) {
    return false;
  }

  return { col, row: lineNumber };
};

export interface CodeEditorProps {
  language: FindChallenge_programmingLanguages;
  code: any;
  setCode: (value: string, editableCodeRange?: number[]) => void;
  evaluateSubmission: () => void;
  validateSubmission: () => void;

  //** Function that can be used to store the blocked code range in local storage */
  editableCodeRange?: number[];

  //** Change of this force reloads the code editor */
  reloaded?: boolean;

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
  reloaded,

  //** Function that can be used to store the blocked code range in local storage */
  editableCodeRange,
}: CodeEditorProps) => {
  // const [monacoModel, setMonacoModel] = useState<undefined | any>();
  const hotkeys = useHotKeys({ validateSubmission, evaluateSubmission });

  const { editorTheme } = useContext(SettingsContext);

  const editorRef = useRef({
    _actions: { submitYourCode: {}, runYourCode: {} },
    addAction: (x: any) => {},
    getModel: () => {},
  });
  const monaco = useMonaco();

  //** Returns editable lines range. Gives false if editor should not lock lines  */
  const getEditableLinesRange = () => {
    if (editableCodeRange) {
      return editableCodeRange;
    }

    const startOfEditableCode = findPos(code, "{{", true);
    // const test = findPositions(code, "{{");
    // console.log("START", startOfEditableCode);
    const endOfEditableCode = findPos(code, "}}");
    // console.log("END", endOfEditableCode);

    if (!startOfEditableCode || !endOfEditableCode) {
      return false;
    }

    return [
      startOfEditableCode.row,
      startOfEditableCode.col,
      endOfEditableCode.row,
      endOfEditableCode.col,
    ];
  };

  const blockLines = () => {
    // if(){}

    const range = getEditableLinesRange();

    if (range) {
      const constrainedInstance = constrainedEditor(monaco);
      const model = editorRef.current.getModel() as any;

      constrainedInstance.initializeIn(editorRef.current);

      const codeWithoutSpecialCharacters = !editableCodeRange
        ? code.replaceAll("}}", "").replaceAll("{{", "")
        : code;
      model.setValue(codeWithoutSpecialCharacters);

      const unlocked = [
        {
          range,
          allowMultiline: true,
        },
      ];

      // INDICATE WHICH CODE IS EDITABLE / NOT EDITABLE
      // (editorRef.current as any).deltaDecorations(
      //   [],
      //   [
      //     {
      //       range: new monaco.Range(3, 1, 5, 1),
      //       options: {
      //         isWholeLine: true,
      //         linesDecorationsClassName: "notEditable",
      //       },
      //     },
      //     {
      //       range: new monaco.Range(18, 9, 22, 6),
      //       options: { inlineClassName: "notEditable" },
      //     },
      //   ]
      // );

      constrainedInstance.addRestrictionsTo(model, unlocked);
      // setEditableCodeRange([
      //   startOfEditableCode.row,
      //   startOfEditableCode.col,
      //   endOfEditableCode.row,
      //   endOfEditableCode.col,
      // ]);
      // console.log("yooo", model.getValueInEditableRanges());

      // model.onDidChangeContentInEditableRange(function (
      //   currentlyChangedContent: any,
      //   allValuesInEditableRanges: any,
      //   currentEditableRangeObject: {
      //     [key: string]: {
      //       allowMultiline: boolean;
      //       index: number;
      //       originalRange: number[];
      //       range: {
      //         endColumn: 6;
      //         endLineNumber: 23;
      //         startColumn: 6;
      //         startLineNumber: 18;
      //       };
      //     };
      //   }
      // ) {
      //   const { range } =
      //     currentEditableRangeObject[
      //       Object.keys(currentEditableRangeObject)[0]
      //     ];

      //   console.log("currentEditableRangeObject", range);
      //   // Function to execute on content change inside editable ranges
      // });
      console.log("TEST", constrainedInstance);
    }
  };

  function handleEditorDidMount(editor: any) {
    // here is the editor instance
    // you can store it in `useRef` for further usage
    // console.log("editor", editor);
    editorRef.current = editor;

    blockLines();

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

  const getCurrentEditableRanges = () => {
    try {
      const currentState = (
        editorRef.current.getModel() as any
      ).getCurrentEditableRanges();

      const { range } = currentState[Object.keys(currentState)[0]];

      return [
        range.startLineNumber,
        range.startColumn,
        range.endLineNumber,
        range.endColumn,
      ];
    } catch (err) {
      return;
    }
  };

  function handleEditorChange(value: any, event: any) {
    const codeRanges = getCurrentEditableRanges();
    setCode(value, codeRanges);

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
          key={
            exerciseId +
            (typeof reloaded !== "undefined" ? reloaded.toString() : "")
          }
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

  .notEditable {
    color: red !important;
    cursor: pointer;
    text-decoration: underline;
    font-weight: bold;
    font-style: oblique;
  }
`;

export default CodeEditor;
