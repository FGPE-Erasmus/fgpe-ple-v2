import React from "react";
import styled from "@emotion/styled";
import { CircularProgress } from "@chakra-ui/react";

const MainLoading = () => {
  return (
    <Fullscreen>
      <CircularProgress isIndeterminate color="blue.300" />
    </Fullscreen>
  );
};

const Fullscreen = styled.div`
  width: 100%;
  height: 100%;
  position: absolute;
  top: 0;
  left: 0;
  display: flex;
  justify-content: center;
  align-items: center;
`;

export default MainLoading;
