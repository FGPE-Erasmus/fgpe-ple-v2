import { Box, useColorMode } from "@chakra-ui/react";
import React from "react";
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
}: {
  codeSkeleton: string;
  language: FindChallenge_programmingLanguages;
}) => {
  const { colorMode } = useColorMode();

  return (
    <Box>
      {codeSkeleton.split("\n").map((line, i) => {
        return (
          <CodeLine key={i} darkMode={colorMode === "dark"}>
            {/* <span>{i}.</span> */}

            <SyntaxHighlighter
              wrapLines
              wrapLongLines
              customStyle={{
                fontSize: "14px",
                display: "inline",
                background: "none",
                // minHeight: "200px",
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

const CodeLine = styled.div<{ darkMode?: boolean }>`
  span {
    color: #323232;
    font-size: 14px;
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
  transition: transform 0.5s;

  &:hover {
    transform: scale(0.95);
  }
`;

export default SpotTheBugEditor;
