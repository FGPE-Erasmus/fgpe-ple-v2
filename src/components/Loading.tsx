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
  & {
    font-size: 10px;
    margin: 50px auto;
    text-indent: -9999em;
    width: 5em;
    height: 5em;
    border-radius: 50%;
    background: ${({ theme }) => theme.primary};
    background: -moz-linear-gradient(
      left,
      ${({ theme }) => theme.primary} 10%,
      rgba(255, 255, 255, 0) 42%
    );
    background: -webkit-linear-gradient(
      left,
      ${({ theme }) => theme.primary} 10%,
      rgba(255, 255, 255, 0) 42%
    );
    background: -o-linear-gradient(
      left,
      ${({ theme }) => theme.primary} 10%,
      rgba(255, 255, 255, 0) 42%
    );
    background: -ms-linear-gradient(
      left,
      ${({ theme }) => theme.primary} 10%,
      rgba(255, 255, 255, 0) 42%
    );
    background: linear-gradient(
      to right,
      ${({ theme }) => theme.primary} 10%,
      rgba(255, 255, 255, 0) 42%
    );
    position: relative;
    -webkit-animation: load3 1.4s infinite linear;
    animation: load3 1.4s infinite linear;
    -webkit-transform: translateZ(0);
    -ms-transform: translateZ(0);
    transform: translateZ(0);
  }
  &:before {
    width: 50%;
    height: 50%;
    background: ${({ theme }) => theme.primary};
    border-radius: 100% 0 0 0;
    position: absolute;
    top: 0;
    left: 0;
    content: "";
  }
  &:after {
    background: ${({ theme }) => theme.background};
    width: 75%;
    height: 75%;
    border-radius: 50%;
    content: "";
    margin: auto;
    position: absolute;
    top: 0;
    left: 0;
    bottom: 0;
    right: 0;
  }
  @-webkit-keyframes load3 {
    0% {
      -webkit-transform: rotate(0deg);
      transform: rotate(0deg);
    }
    100% {
      -webkit-transform: rotate(360deg);
      transform: rotate(360deg);
    }
  }
  @keyframes load3 {
    0% {
      -webkit-transform: rotate(0deg);
      transform: rotate(0deg);
    }
    100% {
      -webkit-transform: rotate(360deg);
      transform: rotate(360deg);
    }
  }
`;

export default Loading;
