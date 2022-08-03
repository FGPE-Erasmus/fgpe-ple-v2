import { ChevronRightIcon } from "@chakra-ui/icons";
import { Breadcrumb, BreadcrumbItem, BreadcrumbLink } from "@chakra-ui/react";
import styled from "@emotion/styled";
import { Link } from "react-router-dom";
import React from "react";

const BreadcrumbComponent = ({
  gameName,
  challengeName,
  gameId,
  challengeId,
  isChallengeActive,
}: {
  gameName: string;
  gameId: string;
  challengeName?: string;
  challengeId?: string;
  isChallengeActive?: boolean;
}) => {
  return (
    <Wrapper challengeView={isChallengeActive}>
      <Breadcrumb
        separator={<ChevronRightIcon color="gray.500" />}
        width="100%"
        data-cy="breadcrumb"
      >
        <BreadcrumbItem pointerEvents="all" maxWidth="100%">
          <BreadcrumbLink
            data-cy="breadcrumb-link"
            as={Link}
            overflow="hidden"
            whiteSpace="nowrap"
            textOverflow="ellipsis"
            to={`/game/${gameId.toString()}`}
          >
            {gameName}
          </BreadcrumbLink>
        </BreadcrumbItem>

        {challengeName && challengeId && (
          <BreadcrumbItem
            pointerEvents="all"
            isCurrentPage={isChallengeActive}
            maxWidth="100%"
          >
            <BreadcrumbLink
              data-cy="breadcrumb-link"
              as={Link}
              to={`/game/${gameId.toString()}/challenge/${challengeId.toString()}`}
              overflow="hidden"
              whiteSpace="nowrap"
              textOverflow="ellipsis"
            >
              {challengeName}
            </BreadcrumbLink>
          </BreadcrumbItem>
        )}
      </Breadcrumb>
    </Wrapper>
  );
};

const Wrapper = styled.span<{ challengeView?: boolean }>`
  position: absolute;
  top: ${({ challengeView }) => (challengeView ? -65 : 0)}px;
  left: 150px;
  height: 65px;
  width: calc(100% - 150px - 70px);
  pointer-events: none;

  display: flex;
  align-items: center;
`;

export default BreadcrumbComponent;
