import { Box, Flex, useColorMode } from "@chakra-ui/react";
import styled from "@emotion/styled";
import React from "react";
import ReactHtmlParser from "react-html-parser";
import { FindChallenge_challenge_refs } from "../../generated/FindChallenge";

const Statement = ({
  exercise,
}: {
  exercise: FindChallenge_challenge_refs | null;
}) => {
  const { colorMode } = useColorMode();

  return (
    <ScrollbarStyled colorMode={colorMode}>
      <Flex
        height={150 + getStatementLength(exercise) / 5}
        maxHeight={250}
        overflowY={"auto"}
        borderBottom="1px solid rgba(0,0,0,0.1)"
      >
        <Box
          h="100%"
          w="100%"
          bgColor={colorMode == "dark" ? "gray.900" : "gray.100"}
        >
          <Box bgColor={colorMode == "dark" ? "gray.900" : "gray.100"} p={5}>
            {ReactHtmlParser(getStatement(exercise))}
          </Box>
        </Box>
      </Flex>
    </ScrollbarStyled>
  );
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
