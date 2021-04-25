import React, { useRef, useState } from "react";
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
  Menu,
  MenuButton,
  MenuItem,
  MenuList,
} from "@chakra-ui/react";
import { useParams } from "react-router-dom";
import { gql, useQuery } from "@apollo/client";
import { getGameByIdQuery } from "../../generated/getGameByIdQuery";
import { useTranslation } from "react-i18next";
import { Link } from "react-router-dom";
import TableComponent from "../TableComponent";
import ColumnFilter from "../TableComponent/ColumnFilter";
import {
  checkIfConnectionAborted,
  SERVER_ERRORS,
} from "../../utilities/ErrorMessages";
import ActivitiesStats from "./ActivitiesStats";
import { ChevronDownIcon } from "@chakra-ui/icons";

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
      courseId
      startDate
      endDate
      state
      evaluationEngine
      challenges {
        name
        refs {
          name
          id
        }
      }
      players {
        group {
          name
        }
        id
        stats {
          nrOfSubmissions
          nrOfValidations
          nrOfSubmissionsByActivity
          nrOfValidationsByActivity
          nrOfSubmissionsByActivityAndResult
          nrOfValidationsByActivityAndResult
        }
        user {
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

  const [isStudentSelected, setIsStudentSelected] = useState<boolean>(false);

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
    const isServerConnectionError = checkIfConnectionAborted(gameError);

    if (isServerConnectionError) {
      return <Error serverConnectionError />;
    } else {
      return <Error errorContent={JSON.stringify(gameError)} />;
    }
  }

  if (!gameData) {
    return <Error status="warning" errorContent={"No data"} />;
  }

  // console.log("game data", gameData);

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

      <Flex justifyContent="space-between" alignItems="center">
        <Heading as="h3" size="sm" marginTop={5} marginBottom={5}>
          {t("Students")}
        </Heading>

        <Flex>
          <Button marginRight={2} size="sm">
            Add new group
          </Button>
          <Menu>
            <MenuButton
              disabled={!isStudentSelected}
              size="sm"
              as={Button}
              rightIcon={<ChevronDownIcon />}
            >
              Actions
            </MenuButton>
            <MenuList>
              <MenuItem>Set group</MenuItem>
              <MenuItem>Remove from the game</MenuItem>
            </MenuList>
          </Menu>
        </Flex>
      </Flex>
      {/* {JSON.stringify(selectedStudents)} */}
      <Box>
        <TableComponent
          selectableRows
          setIsAnythingSelected={setIsStudentSelected}
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
              accessor: "stats.nrOfSubmissions",
              Filter: ({ column }: { column: any }) => (
                <ColumnFilter column={column} placeholder="123" />
              ),
            },
            {
              Header: t("table.validations"),
              accessor: "stats.nrOfValidations",
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

      <Heading as="h3" size="sm" marginTop={5} marginBottom={5}>
        {t("Activities")}
      </Heading>
      <ActivitiesStats gameData={gameData} gameId={gameId} />
    </div>
  );
};

export default withChangeAnimation(InstructorGame);
