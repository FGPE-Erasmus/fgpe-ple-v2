import React from "react";
import CodeEditor, { CodeEditorProps } from "../../CodeEditor";
import FillInGapsEditor from "../editors/FillInGapsEditor";
import SortBlocksEditor from "../editors/SortBlocksEditor";
import SpotTheBugEditor from "../editors/SpotTheBugEditor";

const EditorSwitcher = ({
  editorKind,
  codeSkeletons,
  language,
  setCode,
  code,
  evaluateSubmission,
  validateSubmission,
}: {
  codeSkeletons: string | string[];
  editorKind: string | undefined | null;
} & CodeEditorProps) => {
  // console.log("CODE SKELETON", codeSkeletons);

  switch (editorKind) {
    case "FILL_IN_GAPS":
      return (
        <FillInGapsEditor
          skeleton={
            typeof codeSkeletons === "object" ? codeSkeletons[0] : codeSkeletons
          }
          language={language}
          setCode={setCode}
        />
      );
    case "SPOT_BUG":
      return (
        <SpotTheBugEditor
          codeSkeleton={
            typeof codeSkeletons === "object" ? codeSkeletons[0] : codeSkeletons
          }
          language={language}
          setCode={setCode}
        />
      );
    case "SORT_BLOCKS":
      return (
        <SortBlocksEditor
          codeSkeletons={
            typeof codeSkeletons === "object" ? codeSkeletons : [codeSkeletons]
          }
          language={language}
          setCode={setCode}
        />
      );
    default:
      return (
        <CodeEditor
          language={language}
          code={code}
          setCode={setCode}
          evaluateSubmission={evaluateSubmission}
          validateSubmission={validateSubmission}
        />
      );
  }
};

export default EditorSwitcher;
