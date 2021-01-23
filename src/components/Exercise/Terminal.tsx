import React, { useContext } from "react";
import styled from "@emotion/styled";
import ReactHtmlParser from "react-html-parser";
import { SettingsContext } from "./SettingsContext";
import { Result } from "../../generated/globalTypes";

const Terminal = ({
  submissionResult,
  submissionFeedback,
}: {
  submissionResult: Result | null;
  submissionFeedback: string;
}) => {
  const { terminalTheme } = useContext(SettingsContext);

  return (
    <TerminalStyled terminalTheme={terminalTheme}>
      <div>
        {submissionResult == Result.COMPILATION_ERROR
          ? submissionFeedback
          : ReactHtmlParser(
              submissionFeedback ? submissionFeedback : "Waiting..."
            )}
      </div>
    </TerminalStyled>
  );
};

const TerminalStyled = styled.div<{ terminalTheme: string }>`
  border-top: 1px solid rgba(0, 0, 0, 0.1);
  position: relative;
  height: 100%;
  width: 100%;
  background-color: ${({ terminalTheme }) =>
    terminalTheme == "dark" ? "#323232" : "white"};
  color: ${({ terminalTheme }) =>
    terminalTheme == "dark" ? "white" : "#121212"};
  padding: 12px;
  margin: 0px;
  font-size: 13px;
  font-family: "Source Code Pro", monospace;
  overflow-y: auto;
  overflow-x: hidden;
  word-wrap: break-word;
  & > div {
    margin: auto;
    width: 90%;
    position: absolute;
  }
`;

export default Terminal;
