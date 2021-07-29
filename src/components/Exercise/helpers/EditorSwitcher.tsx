import React from "react";
import CodeEditor, { CodeEditorProps } from "../../CodeEditor";
import FillInGapsEditor from "../editors/FillInGapsEditor";
import SortBlocksEditor from "../editors/SortBlocksEditor";
import SpotTheBugEditor from "../editors/SpotTheBugEditor";

const EditorSwitcher = ({
  editorKind,

  codeSkeleton,
  language,
  setCode,
  code,
  evaluateSubmission,
  validateSubmission,
}: {
  codeSkeleton: string;
  editorKind: string | undefined | null;
} & CodeEditorProps) => {
  console.log("CODE SKELETON", codeSkeleton);

  switch (editorKind) {
    case "FILL_IN_GAPS":
      return (
        <FillInGapsEditor
          skeleton={codeSkeleton}
          language={language}
          setCode={setCode}
        />
      );
    // case "SPOT_BUG":
    //   return (
    //     <SpotTheBugEditor codeSkeleton={codeSkeleton} language={language} />
    //   );
    // case "SORT_BLOCKS":
    //   return <SortBlocksEditor codeSkeleton={codeSkeleton} />;
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
