import { Box, Button, Flex, useColorMode } from "@chakra-ui/react";
import styled from "@emotion/styled";
import React from "react";
import { useTranslation } from "react-i18next";
import ReactMarkdown from "react-markdown";
import { FindChallenge_challenge_refs } from "../../generated/FindChallenge";
import ScrollbarWrapper from "../ScrollbarWrapper";

const Statement = ({
  exercise,
  gameId,
}: {
  exercise: FindChallenge_challenge_refs | null;
  gameId: string;
}) => {
  const { t } = useTranslation();

  const { colorMode } = useColorMode();
  return (
    <ScrollbarWrapper>
      <Flex
        height={exercise?.pdf ? 150 : 150 + getStatementLength(exercise) / 5}
        maxHeight={250}
        overflowY={"auto"}
        borderBottom="1px solid rgba(0,0,0,0.1)"
        position="relative"
      >
        <MarkdownStyled
          h="100%"
          w="100%"
          bgColor={colorMode === "dark" ? "gray.900" : "gray.100"}
        >
          <Box bgColor={colorMode === "dark" ? "gray.900" : "gray.100"} p={5}>
            {exercise?.pdf ? (
              <Button
                colorScheme="blue"
                variant="ghost"
                onClick={() => {
                  let pdfWindow = window.open("");
                  if (pdfWindow) {
                    pdfWindow.document.write(
                      "<iframe width='100%' height='100%' src='data:application/pdf;base64, " +
                        encodeURI(exercise.statement || "") +
                        "'></iframe>"
                    );
                  }
                }}
              >
                {t("Open PDF statement")}
              </Button>
            ) : (
              <ReactMarkdown allowDangerousHtml>
                {getStatement(exercise)}
              </ReactMarkdown>
            )}
          </Box>
        </MarkdownStyled>
      </Flex>
    </ScrollbarWrapper>
  );
};

const MarkdownStyled = styled(Box)`
  table {
    border-collapse: collapse;
    border-spacing: 0;
  }

  td {
    vertical-align: top;
  }

  h1,
  h2,
  h3,
  h4,
  h5,
  h6 {
    font-weight: normal;

    line-height: 1em;
  }

  h4,
  h5,
  h6 {
    font-weight: bold;
  }

  h1 {
    font-size: 2.5em;
  }

  h2 {
    font-size: 2em;
  }

  h3 {
    font-size: 1.5em;
  }

  h4 {
    font-size: 1.2em;
  }

  h5 {
    font-size: 1em;
  }

  h6 {
    font-size: 0.9em;
  }

  blockquote {
    color: #666666;
    margin: 0;
    padding-left: 3em;
    border-left: 0.1em #aaa solid;
  }

  hr {
    display: block;
    border: 0;
    border-top: 1px solid #aaa;
    border-bottom: 1px solid #eee;
    margin: 1em 0;
    padding: 0;
  }

  pre,
  code,
  kbd,
  samp {
    color: lightgray;
    font-family: monospace, monospace;
    _font-family: "courier new", monospace;
    font-size: 0.98em;
  }

  pre {
    white-space: pre;
    white-space: pre-wrap;
    word-wrap: break-word;
  }

  b,
  strong {
    font-weight: bold;
  }

  dfn {
    font-style: italic;
  }

  ins {
    background: #ff9;
    color: #000;
    text-decoration: none;
  }

  mark {
    background: #ff0;
    color: #000;
    font-style: italic;
    font-weight: bold;
  }

  sub,
  sup {
    font-size: 75%;
    line-height: 0;
    position: relative;
    vertical-align: baseline;
  }

  sup {
    top: -0.5em;
  }

  sub {
    bottom: -0.25em;
  }

  ul,
  ol {
    margin: 1em 0;
    padding: 0 0 0 2em;
  }

  li p:last-child {
    margin: 0;
  }

  dd {
    margin: 0 0 0 2em;
  }
`;

export const getStatement = (exercise: FindChallenge_challenge_refs | null) => {
  if (!exercise) {
    return "No description";
  }

  if (exercise.statement) {
    return exercise.statement;
  } else {
    return "No description";
  }
};

export const getStatementLength = (
  exercise: FindChallenge_challenge_refs | null
) => {
  if (!exercise) {
    return 0;
  }

  if (exercise.statement) {
    return exercise.statement.length;
  } else {
    return 0;
  }
};

export default Statement;
