import {
  Box,
  Button,
  Flex,
  Tab,
  TabList,
  TabPanel,
  TabPanels,
  Tabs,
  useColorMode,
} from "@chakra-ui/react";
import styled from "@emotion/styled";
import React from "react";
import { TFunction, useTranslation } from "react-i18next";
import ReactMarkdown from "react-markdown";
import { FindChallenge_myChallengeStatus_refs } from "../../generated/FindChallenge";
import ScrollbarWrapper from "../ScrollbarWrapper";

// TODO: Refactor alphabetical sorting, now it's copied multiple times

const GET_LANGUAGES_FROM_A_TAG_MENU_REGEX = new RegExp(
  /(<a href="#)[\w.-]+(">)[\w.-]+(<\/a>)/g
);

const STATEMENT_LANGUAGES_SPLIT_REGEX = new RegExp(
  /(<a name=")[\w.-]+(" data-type="lang"><\/a><br \/>)/g
);

const Statement = ({
  exercise,
  gameId,
}: {
  exercise: FindChallenge_myChallengeStatus_refs | null;
  gameId: string;
}) => {
  const { t, i18n } = useTranslation();
  const { colorMode } = useColorMode();
  const statementOrNoDescriptionMessage = getStatement(exercise, t);

  return (
    <ScrollbarWrapper>
      <Flex
        maxHeight="calc(50vh - 67px)"
        height={
          exercise?.activity?.pdf ? 150 : 150 + getStatementLength(exercise) / 5
        }
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
            {exercise?.activity?.pdf ? (
              <Button
                colorScheme="blue"
                variant="ghost"
                onClick={() => {
                  let pdfWindow = window.open("");
                  if (pdfWindow) {
                    pdfWindow.document.write(
                      "<iframe width='100%' height='100%' src='data:application/pdf;base64, " +
                        encodeURI(exercise.activity?.statement || "") +
                        "'></iframe>"
                    );
                  }
                }}
              >
                {t("Open PDF statement")}
              </Button>
            ) : statementOrNoDescriptionMessage.split('data-type="lang"')
                .length > 1 ? (
              <Tabs
                variant="soft-rounded"
                defaultIndex={(() => {
                  // Initial active tab to active language

                  let defaultIndex = 0;
                  let languageChanged = false;

                  const userDefaultStatementsLanguage =
                    localStorage.getItem("statementLanguage");

                  statementOrNoDescriptionMessage
                    .match(GET_LANGUAGES_FROM_A_TAG_MENU_REGEX)
                    ?.sort((a: any, b: any) =>
                      a
                        .split('">')[1]
                        .split("</")[0]
                        .localeCompare(b.split('">')[1].split("</")[0])
                    )
                    .forEach((lang, i) => {
                      console.log(
                        i18n.language.toLowerCase(),
                        lang.split('">')[1].split("</")[0].toLowerCase()
                      );
                      if (userDefaultStatementsLanguage) {
                        // If user has a default statement language (the user clicked at least once on a language tab)
                        if (
                          userDefaultStatementsLanguage.toLowerCase() ===
                          lang.split('">')[1].split("</")[0].toLowerCase()
                        ) {
                          defaultIndex = i;
                          languageChanged = true;
                        }
                      } else {
                        if (
                          i18n.language.toLowerCase() ===
                          lang.split('">')[1].split("</")[0].toLowerCase()
                        ) {
                          defaultIndex = i;
                        }
                      }

                      if (userDefaultStatementsLanguage && !languageChanged) {
                        if (
                          i18n.language.toLowerCase() ===
                          lang.split('">')[1].split("</")[0].toLowerCase()
                        ) {
                          defaultIndex = i;
                        }
                      }
                    });

                  return defaultIndex;
                })()}
              >
                <TabList>
                  {statementOrNoDescriptionMessage
                    .match(GET_LANGUAGES_FROM_A_TAG_MENU_REGEX)
                    ?.sort((a: any, b: any) =>
                      a
                        .split('">')[1]
                        .split("</")[0]
                        .localeCompare(b.split('">')[1].split("</")[0])
                    )
                    .map((lang, i) => {
                      const languageCode = lang.split('">')[1].split("</")[0];

                      return (
                        <Tab
                          key={i}
                          onClick={() => {
                            localStorage.setItem(
                              "statementLanguage",
                              languageCode
                            );
                          }}
                        >
                          {languageCode}
                        </Tab>
                      );
                    })}
                </TabList>

                <TabPanels>
                  {statementOrNoDescriptionMessage
                    .replaceAll(STATEMENT_LANGUAGES_SPLIT_REGEX, "{{DIVIDER}}")
                    .split("{{DIVIDER}}")
                    .slice(1)
                    .flatMap((statementLanguageVersion, i) => {
                      const unsortedListOfLanguages =
                        statementOrNoDescriptionMessage.match(
                          GET_LANGUAGES_FROM_A_TAG_MENU_REGEX
                        );

                      return {
                        lang: unsortedListOfLanguages
                          ? unsortedListOfLanguages[i]
                          : "undefined",
                        statement: statementLanguageVersion,
                      };
                    })
                    .sort((a, b) => a.lang.localeCompare(b.lang))
                    .map((statementLanguageVersion, i) => {
                      return (
                        <TabPanel key={i}>
                          <ReactMarkdown allowDangerousHtml>
                            {statementLanguageVersion.statement}
                          </ReactMarkdown>
                        </TabPanel>
                      );
                    })}
                </TabPanels>
              </Tabs>
            ) : (
              <ReactMarkdown allowDangerousHtml>
                {statementOrNoDescriptionMessage}
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
    color: gray;
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

export const getStatement = (
  exercise: FindChallenge_myChallengeStatus_refs | null,
  tFunction: TFunction
) => {
  if (!exercise) {
    return tFunction("No description");
  }

  if (exercise.activity?.statement) {
    return exercise.activity?.statement;
  } else {
    return tFunction("No description");
  }
};

export const getStatementLength = (
  exercise: FindChallenge_myChallengeStatus_refs | null
) => {
  if (!exercise) {
    return 0;
  }

  if (exercise.activity?.statement) {
    return exercise.activity?.statement.length;
  } else {
    return 0;
  }
};

export default Statement;
