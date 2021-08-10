import { Box } from "@chakra-ui/layout";
import React, { useEffect, useRef, useState } from "react";

import styled from "@emotion/styled";
import { AnimateSharedLayout, motion } from "framer-motion";
import {
  docco,
  atomOneDark,
} from "react-syntax-highlighter/dist/esm/styles/hljs";
import SyntaxHighlighter from "react-syntax-highlighter";
import { FindChallenge_programmingLanguages } from "../../../generated/FindChallenge";
import { Flex, IconButton, useColorMode } from "@chakra-ui/react";
import { TriangleDownIcon, TriangleUpIcon } from "@chakra-ui/icons";

const swapArrayElements = function (
  arr: Array<any>,
  indexA: number,
  indexB: number
) {
  var temp = arr[indexA];
  arr[indexA] = arr[indexB];
  arr[indexB] = temp;
};

// const Item = ({
//   top,
//   language,
//   content,
//   index,
//   total,
//   setOrder,
// }: {
//   top: number;
//   language: FindChallenge_programmingLanguages;
//   content: string;
//   index: number;
//   total: number;
//   setOrder: () => void;
// }) => {
//   // const [onTop, setOnTop] = useState(false);

//   return (

//   );
// };

const SortBlocksEditor = ({
  codeSkeletons,
  language,
  setCode,
}: {
  codeSkeletons: string[];
  language: FindChallenge_programmingLanguages;
  setCode: (code: string) => void;
}) => {
  const [codeSkeletonsOrdered, setCodeSkeletonsOrder] = useState<string[]>([]);
  const { colorMode } = useColorMode();

  useEffect(() => {
    if (codeSkeletonsOrdered.length <= 0) {
      /** Addition of "_____${i}" string is a workaround to make both framer-motion work and have unique keys */
      setCodeSkeletonsOrder(codeSkeletons.map((item, i) => item + `_____${i}`));
    }
  }, [codeSkeletons]);

  useEffect(() => {
    setCodeSkeletonsOrder(codeSkeletons.map((item, i) => item + `_____${i}`));
  }, [language]);

  const moveElement = (index: number, up: boolean) => {
    let codeSkeletonsNewOrder = [...codeSkeletonsOrdered];
    swapArrayElements(
      codeSkeletonsNewOrder,
      index,
      up
        ? index - 1 < 0
          ? 0
          : index - 1
        : index + 1 < codeSkeletonsOrdered.length
        ? index + 1
        : codeSkeletonsOrdered.length - 1
    );

    const linesWithRemovedAdditionalSymbols = codeSkeletonsNewOrder.map(
      (code) => code.split("_____")[0]
    );
    setCodeSkeletonsOrder(codeSkeletonsNewOrder);
    setCode(linesWithRemovedAdditionalSymbols.join("\n"));
    console.log(linesWithRemovedAdditionalSymbols.join("\n"));
  };

  return (
    <Flex
      position="relative"
      width="100%"
      justifyContent="center"
      marginTop={5}
      flexDirection="column"
    >
      {codeSkeletonsOrdered.map((line, i) => {
        return (
          <Block
            isDark={colorMode === "dark"}
            height={50}
            layout
            key={line}
            transition={{
              type: "spring",
              damping: 20,
              stiffness: 300,
            }}
          >
            <SyntaxHighlighter
              wrapLines
              wrapLongLines
              customStyle={{
                fontSize: "14px",
                background: "none",
                padding: 0,
                height: "auto",
                // minHeight: "200px",
              }}
              language={language.id ? language.id.toLowerCase() : "plain"}
              style={colorMode === "dark" ? atomOneDark : docco}
            >
              {line.split("_____")[0]}
            </SyntaxHighlighter>
            <Flex flexDir="column">
              <IconButton
                aria-label="Up"
                icon={<TriangleUpIcon />}
                width={50}
                height={25}
                size="xs"
                borderRadius="4px 4px 0px 0px"
                borderBottom="none"
                colorScheme="gray"
                variant="outline"
                color="grey"
                onClick={() => moveElement(i, true)}
              />
              <IconButton
                color="grey"
                aria-label="Down"
                icon={<TriangleDownIcon />}
                width={50}
                height={25}
                size="xs"
                borderRadius="0px 0px 4px 4px"
                colorScheme="gray"
                variant="outline"
                onClick={() => moveElement(i, false)}
              />
            </Flex>
          </Block>
        );
      })}
    </Flex>
  );
};

const Block = styled(motion.div)<{ height: number; isDark: boolean }>`
  width: 95%;
  margin: auto;
  padding-left: 15px;
  margin-bottom: 5px;
  min-height: ${({ height }) => height}px;
  border: 1px solid black;
  border-radius: 4px;
  display: flex;
  align-items: center;
  justify-content: space-between;
  border-color: ${({ isDark: dark }) =>
    dark ? "rgba(255,255,255,0.06)" : "rgba(0,0,0,0.06)"};
  background-color: ${({ isDark: dark }) =>
    dark ? "rgba(255,255,255,0.03)" : "rgba(0,0,0,0.03)"};
`;

export default SortBlocksEditor;
