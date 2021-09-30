import { useColorMode } from "@chakra-ui/react";
import styled from "@emotion/styled";
import React from "react";

const ScrollbarWrapper = ({
  children,
  thin,
}: {
  children: React.ReactNode;
  thin?: boolean;
}) => {
  const { colorMode } = useColorMode();

  return (
    <ScrollbarStyled colorMode={colorMode} thin={thin}>
      {children}
    </ScrollbarStyled>
  );
};

const ScrollbarStyled = styled.span<{ colorMode: string; thin?: boolean }>`
  & > *,
  .better-scrollbar {
    ::-webkit-scrollbar {
      width: ${({ thin }) => (thin ? 6 : 13)}px !important;
      height: ${({ thin }) => (thin ? 6 : 13)}px !important;
    }
    ::-webkit-scrollbar-thumb {
      background: ${({ colorMode }) =>
        colorMode != "dark"
          ? "rgba(0, 0, 0, 0.1)"
          : "rgba(255, 255, 255, 0.1)"} !important;
      border-radius: 1px !important;
    }
    ::-webkit-scrollbar-thumb:hover {
      background: #323232 !important;
    }
    ::-webkit-scrollbar-track {
      background: ${({ colorMode }) =>
        colorMode != "dark"
          ? "rgba(0, 0, 0, 0.1)"
          : "rgba(255, 255, 255, 0.1)"} !important;
      border-radius: 1px !important;
    }
  }
`;

export default ScrollbarWrapper;
