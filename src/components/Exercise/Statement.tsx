import { Box, Flex, useColorMode } from "@chakra-ui/react";
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
    <Flex
      height={150 + getStatementLength(exercise) / 5}
      maxHeight={250}
      overflowY={"auto"}
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
  );
};

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
