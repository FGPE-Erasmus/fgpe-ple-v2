import React from "react";
import styled from "@emotion/styled";

const ProgressBar = ({
  percentage,
  style,
}: {
  percentage: number;
  style?: React.CSSProperties;
}) => {
  return (
    <ProgressBarStyled percentage={percentage} style={style}>
      <span></span>
    </ProgressBarStyled>
  );
};

const ProgressBarStyled = styled.div<{ percentage: number; margin?: number }>`
  height: 20px; /* Can be anything */
  position: relative;
  background: ${({ theme }) => theme.background};
  -moz-border-radius: 25px;
  -webkit-border-radius: 25px;
  border-radius: 25px;
  padding: 10px;
  margin: ${({ margin }) => (margin ? margin : 0)}px;
  box-shadow: inset 0 -1px 1px rgba(255, 255, 255, 0.3);
  & > span {
    display: block;
    height: 100%;
    border-top-right-radius: 8px;
    border-bottom-right-radius: 8px;
    border-top-left-radius: 20px;
    border-bottom-left-radius: 20px;
    background-color: ${({ theme }) => theme.primary};

    position: absolute;
    top: 0;
    left: 0;
    overflow: hidden;
    width: ${({ percentage }) => percentage * 100}%;
  }
`;

export default ProgressBar;
