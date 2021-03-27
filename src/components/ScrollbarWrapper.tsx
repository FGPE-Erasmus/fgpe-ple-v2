import { useColorMode } from "@chakra-ui/react";
import styled from "@emotion/styled";
import React from "react";

const ScrollbarWrapper = ({ children }: { children: React.ReactNode }) => {
  const { colorMode } = useColorMode();

  return <ScrollbarStyled colorMode={colorMode}>{children}</ScrollbarStyled>;
};

const ScrollbarStyled = styled.span<{ colorMode: string }>`
  & > * {
    ::-webkit-scrollbar {
      width: 13px;
      height: 13px;
    }
    ::-webkit-scrollbar-thumb {
      background: ${({ colorMode }) =>
        colorMode != "dark"
          ? "rgba(0, 0, 0, 0.1)"
          : "rgba(255, 255, 255, 0.1)"};
      border-radius: 1px;
    }
    ::-webkit-scrollbar-thumb:hover {
      background: #323232;
    }
    ::-webkit-scrollbar-track {
      background: ${({ colorMode }) =>
        colorMode != "dark"
          ? "rgba(0, 0, 0, 0.1)"
          : "rgba(255, 255, 255, 0.1)"};
      border-radius: 1px;
    }
  }
`;

export default ScrollbarWrapper;
