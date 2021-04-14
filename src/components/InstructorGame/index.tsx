import React from "react";
import withChangeAnimation from "../../utilities/withChangeAnimation";
import Error from "../Error";

import {
  Progress,
  Text,
  Heading,
  Box,
  useColorModeValue,
  Skeleton,
  Flex,
  Table,
  TableCaption,
  Tbody,
  Td,
  Tfoot,
  Th,
  Thead,
  Tr,
  Button,
  Alert,
  AlertIcon,
  Divider,
} from "@chakra-ui/react";
import { useParams } from "react-router-dom";
import { gql, useQuery } from "@apollo/client";
import { getGameByIdQuery } from "../../generated/getGameByIdQuery";
import { useTranslation } from "react-i18next";
import { Link } from "react-router-dom";
import TableComponent from "../TableComponent";
import ColumnFilter from "../TableComponent/ColumnFilter";
import { SERVER_ERRORS } from "../../utilities/ErrorMessages";
import ExercisesStats from "./ExercisesStats";

interface ParamTypes {
  gameId: string;
}

const GET_GAME_BY_ID = gql`
  query getGameByIdQuery($gameId: String!) {
    game(id: $gameId) {
      id
      name
      description
      gedilLayerId
      gedilLayerDescription
      startDate
      endDate
      evaluationEngine
      players {
        id
        validations {
          id
        }
        submissions {
          exerciseId
          feedback
          result
        }
        user {
          email
          id
          firstName
          lastName
        }
      }
      instructors {
        id
        username
      }
      createdAt
      updatedAt
    }
  }
`;

const InstructorGame = () => {
  const { gameId } = useParams<ParamTypes>();
  const { t } = useTranslation();

  const {
    data: gameData,
    error: gameError,
    loading: gameLoading,
  } = useQuery<getGameByIdQuery>(GET_GAME_BY_ID, {
    variables: {
      gameId,
    },
    skip: !gameId,
    fetchPolicy: "no-cache",
  });

  if (!gameId) {
    return <div>Game ID not provided</div>;
  }

  if (gameLoading) {
    return <div>{t("Loading")}</div>;
  }

  if (!gameLoading && gameError) {
    const isServerConnectionError = gameError.graphQLErrors[0].message.includes(
      SERVER_ERRORS.ECONNABORTED
    );

    if (isServerConnectionError) {
      return <Error serverConnectionError />;
    } else {
      return <Error errorContent={JSON.stringify(gameError)} />;
    }
  }

  if (!gameData) {
    return <Error status="warning" errorContent={"No data"} />;
  }

  return (
    <div>
      {gameData.game.players.length < 1 && (
        <>
          <Alert status="info">
            <AlertIcon />
            {t("teacher.noPlayersAlert")}
          </Alert>
        </>
      )}
      <Flex width="100%" justifyContent="space-between" alignItems="center">
        <Box>
          <Heading as="h3" size="md" marginTop={5} marginBottom={5}>
            {t("Game")}: {gameData.game.name}
          </Heading>
        </Box>
        <Box>
          <Link
            to={{
              pathname: "/profile",
            }}
          >
            <Button marginRight={2} variant="outline">
              {t("Back")}
            </Button>
          </Link>
          <Link
            to={{
              pathname: `/teacher/game/${gameId}/add-players`,
            }}
            onClick={() => {}}
          >
            <Button>{t("Add or remove players")}</Button>
          </Link>
        </Box>
      </Flex>
      <Divider marginBottom={50} />

      <Heading as="h3" size="sm" marginTop={5} marginBottom={5}>
        {t("Exercises")}
      </Heading>
      <ExercisesStats gameData={gameData} gameId={gameId} />

      <Heading as="h3" size="sm" marginTop={5} marginBottom={5}>
        {t("Students")}
      </Heading>
      <Box>
        <TableComponent
          columns={[
            {
              Header: t("table.name"),
              accessor: "user.firstName",
              Filter: ({ column }: { column: any }) => (
                <ColumnFilter
                  column={column}
                  placeholder={t("placeholders.name")}
                />
              ),
            },
            {
              Header: t("table.lastName"),
              accessor: "user.lastName",
              Filter: ({ column }: { column: any }) => (
                <ColumnFilter
                  column={column}
                  placeholder={t("placeholders.lastName")}
                />
              ),
            },

            {
              Header: t("table.submissions"),
              accessor: "submissions.length",
              Filter: ({ column }: { column: any }) => (
                <ColumnFilter column={column} placeholder="123" />
              ),
            },
            {
              Header: t("table.validations"),
              accessor: "validations.length",
              Filter: ({ column }: { column: any }) => (
                <ColumnFilter column={column} placeholder="123" />
              ),
            },
            {
              Header: t("table.group"),
              accessor: "group.name",
              Cell: ({ value }: { value: any }) => {
                return value ? value : "-";
              },
              Filter: ({ column }: { column: any }) => (
                <ColumnFilter column={column} placeholder={t("table.group")} />
              ),
            },
          ]}
          data={gameData.game.players}
        />
      </Box>
    </div>
  );
};

export default withChangeAnimation(InstructorGame);
