import React, { useContext } from "react";
import styled from "@emotion/styled";
import ReactHtmlParser from "react-html-parser";
import { SettingsContext } from "./SettingsContext";
import { Result } from "../../generated/globalTypes";

const Terminal = ({
  submissionResult,
  submissionFeedback,
  validationOutputs,
  loading,
}: {
  submissionResult: Result | null;
  submissionFeedback: string;
  validationOutputs: null | any;
  loading: boolean;
}) => {
  const { terminalTheme, terminalFontSize } = useContext(SettingsContext);
  return (
    <TerminalStyled
      terminalTheme={terminalTheme}
      terminalFontSize={terminalFontSize}
    >
      <div>
        {validationOutputs &&
          Object.keys(validationOutputs).map((objectKey, i) => {
            return (
              <span key={i} style={{ whiteSpace: "pre-line" }}>
                {validationOutputs[objectKey]}
              </span>
            );
          })}
        {submissionResult == Result.COMPILATION_ERROR
          ? submissionFeedback
          : ReactHtmlParser(
              submissionFeedback
                ? loading
                  ? "Waiting for result..."
                  : submissionFeedback
                : ""
            )}
      </div>
    </TerminalStyled>
  );
};

const TerminalStyled = styled.div<{
  terminalTheme: string;
  terminalFontSize: string;
}>`
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
  font-size: ${({ terminalFontSize }) => terminalFontSize}px;
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
