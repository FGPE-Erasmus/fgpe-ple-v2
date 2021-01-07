import React from "react";
import styled from "@emotion/styled";
import { AnimatePresence, motion } from "framer-motion";

const Loading = ({
  fullscreen,
  show,
}: {
  fullscreen?: boolean;
  show: boolean;
}) => {
  return (
    <AnimatePresence initial={false}>
      {show && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.2 }}
        >
          {fullscreen ? (
            <Fullscreen>
              <Indicator />
            </Fullscreen>
          ) : (
            <div>
              <Indicator />
            </div>
          )}{" "}
        </motion.div>
      )}
    </AnimatePresence>
  );
};

const Fullscreen = styled.div`
  position: absolute;
  width: 100%;
  height: 100%;
  background-color: ${({ theme }) => theme.background};
  z-index: 999;
  display: flex;
  justify-content: center;
  align-items: center;
`;

const Indicator = styled.div`
  &,
  &:before,
  &:after {
    background: ${({ theme }) => theme.primary};
    -webkit-animation: load1 1s infinite ease-in-out;
    animation: load1 1s infinite ease-in-out;
    width: 1em;
    height: 4em;
  }
  & {
    color: ${({ theme }) => theme.primary};
    text-indent: -9999em;
    margin: 88px auto;
    position: relative;
    font-size: 11px;
    -webkit-transform: translateZ(0);
    -ms-transform: translateZ(0);
    transform: translateZ(0);
    -webkit-animation-delay: -0.16s;
    animation-delay: -0.16s;
  }
  &:before,
  &:after {
    position: absolute;
    top: 0;
    content: "";
  }
  &:before {
    left: -1.5em;
    -webkit-animation-delay: -0.32s;
    animation-delay: -0.32s;
  }
  &:after {
    left: 1.5em;
  }
  @-webkit-keyframes load1 {
    0%,
    80%,
    100% {
      box-shadow: 0 0;
      height: 4em;
    }
    40% {
      box-shadow: 0 -2em;
      height: 5em;
    }
  }
  @keyframes load1 {
    0%,
    80%,
    100% {
      box-shadow: 0 0;
      height: 4em;
    }
    40% {
      box-shadow: 0 -2em;
      height: 5em;
    }
  }
`;

export default Loading;
