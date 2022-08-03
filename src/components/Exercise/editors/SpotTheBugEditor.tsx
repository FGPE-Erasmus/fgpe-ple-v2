import { Box, useColorMode } from "@chakra-ui/react";
import React, { useState } from "react";
import SyntaxHighlighter from "react-syntax-highlighter";
import { FindChallenge_programmingLanguages } from "../../../generated/FindChallenge";
import {
  docco,
  atomOneDark,
} from "react-syntax-highlighter/dist/esm/styles/hljs";
import styled from "@emotion/styled";

const SpotTheBugEditor = ({
  codeSkeleton,
  language,
  setCode,
}: {
  codeSkeleton: string;
  language: FindChallenge_programmingLanguages;

  /** Spot the bug mode sets a number of the line with a bug instead of submitting code */
  setCode: (value: string) => void;
}) => {
  const { colorMode } = useColorMode();
  const [selectedLine, setSelectedLine] = useState(-1);

  return (
    <Box padding={2} data-cy="spot-the-bug-editor">
      {codeSkeleton &&
        codeSkeleton.split("\n").map((line, i) => {
          return (
            <CodeLine
              key={i}
              darkMode={colorMode === "dark" ? 1 : 0}
              onClick={() => {
                console.log("1", i, selectedLine === i);
                setSelectedLine(i);
                setCode((i + 1).toString());
              }}
              className={selectedLine === i ? "selected" : ""}
            >
              <span className="line-number">{i + 1}</span>
              <SyntaxHighlighter
                wrapLines
                wrapLongLines
                customStyle={{
                  fontSize: "14px",
                  display: "inline",
                  background: "none",
                }}
                language={language.id ? language.id.toLowerCase() : "plain"}
                style={colorMode === "dark" ? atomOneDark : docco}
              >
                {line}
              </SyntaxHighlighter>
              <br />
            </CodeLine>
          );
        })}
    </Box>
  );
};

const CodeLine = styled.div<{ darkMode?: number }>`
  .line-number {
    color: ${({ darkMode }) =>
      !darkMode ? "rgba(0, 0, 0, 0.3)" : "rgba(255, 255, 255, 0.3)"};
    font-size: 14px;
    margin-right: 10px;
    margin-left: 4px;
  }

  border-radius: 4px;
  border: 1px solid rgba(0, 0, 0, 0.1);
  border-color: ${({ darkMode }) =>
    !darkMode ? "rgba(0, 0, 0, 0.1)" : "rgba(255, 255, 255, 0.1)"};

  background-color: ${({ darkMode }) =>
    !darkMode ? "rgba(0, 0, 0, 0.01)" : "rgba(255, 255, 255, 0.01)"};
  padding: 4px;
  margin: 4px 4px;

  cursor: pointer;
  transition: transform 0.5s, border-color 0.5s, background-color 0.5s,
    border-width 0.5s;

  &:hover {
    transform: scale(0.95);
  }

  &.selected {
    border-width: 3px;
    border-color: ${({ darkMode }) =>
      !darkMode ? "rgba(0, 153, 255, 0.5)" : "rgba(0, 119, 255, 0.5)"};
    background-color: ${({ darkMode }) =>
      !darkMode ? "rgba(0, 56, 93, 0.01)" : "rgba(0, 119, 255, 0.01)"};
  }
`;

export default SpotTheBugEditor;
