import { Box, Input, useColorMode } from "@chakra-ui/react";
import SyntaxHighlighter from "react-syntax-highlighter";
import { FindChallenge_programmingLanguages } from "../../../generated/FindChallenge";

import {
  docco,
  atomOneDark,
} from "react-syntax-highlighter/dist/esm/styles/hljs";
import { useState } from "react";

const FillInGapsEditor = ({
  skeleton,
  language,
  setCode,
}: {
  skeleton: string;
  language: FindChallenge_programmingLanguages;
  setCode: (code: string) => void;
}) => {
  const { colorMode } = useColorMode();
  const [inputsValues, setInputsValues] = useState<string[]>([]);
  const gapsLength = skeleton.split("{{gap}}").length - 1;

  const onChange = (code: string, index: number) => {
    console.log("code", code);
    let newCode = "";
    const splitted = skeleton.split("{{gap}}");

    for (let i = 0; i < gapsLength; i++) {
      if (i === index) {
        newCode = splitted[i] + code;
      } else {
        newCode = splitted[i] + inputsValues[i];
      }
    }

    newCode = newCode + splitted[splitted.length - 1];

    setCode(newCode);
  };

  return (
    <>
      <Box width="100%" height="100%">
        {skeleton.split("{{gap}}").map((line, i) => {
          return (
            <span key={i}>
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
                {line.replaceAll("\n", "\n ")}
              </SyntaxHighlighter>
              {i < gapsLength && (
                <Input
                  value={inputsValues[gapsLength - 1 - i] || ""}
                  onChange={(e) => {
                    let newValues = [...inputsValues];
                    newValues[gapsLength - 1 - i] = e.target.value;
                    setInputsValues(newValues);
                    onChange(e.target.value, gapsLength - 1 - i);
                  }}
                  display="inline-block"
                  maxW={50}
                  maxH={30}
                  padding={1}
                  textAlign="center"
                />
              )}
            </span>
          );
        })}
      </Box>
    </>
  );
};

export default FillInGapsEditor;
