import { Button, Text } from "@chakra-ui/react";
import { Link } from "react-router-dom";
import styled from "@emotion/styled";
import React from "react";

const NavGameButton = ({
  gameName,
  gameId,
}: {
  gameName: string;
  gameId: string;
}) => {
  console.log(gameName, gameId);
  return (
    <StyledButton>
      <Link to={`/game/${gameId.toString()}`}>
        <Button pointerEvents="all">
          <Text
            pointerEvents="all"
            overflow="hidden"
            whiteSpace="nowrap"
            textOverflow="ellipsis"
          >
            {gameName}
          </Text>
        </Button>
      </Link>
    </StyledButton>
  );
};

const StyledButton = styled.span`
  position: absolute;
  top: -65px;
  left: 150px;
  height: 65px;
  width: calc(100% - 150px - 70px);
  pointer-events: none;

  display: flex;
  align-items: center;
`;

export default NavGameButton;
