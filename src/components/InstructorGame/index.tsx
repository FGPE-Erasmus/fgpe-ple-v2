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
  Tooltip,
  useDisclosure,
} from "@chakra-ui/react";
import { useParams } from "react-router-dom";
import { gql, useMutation, useQuery } from "@apollo/client";
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
import { useNotifications } from "../Notifications";
import AddGroupModal from "./AddGroupModal";
import { getGroupsQuery } from "../../generated/getGroupsQuery";
import SetGroupModal from "./SetGroupModal";
import { GET_GROUPS } from "../../graphql/GET_GROUPS";

interface ParamTypes {
  gameId: string;
}

const AUTO_ASSIGN_GROUPS = gql`
  mutation autoAssignGroupsMutation($gameId: String!) {
    autoAssignGroups(gameId: $gameId) {
      id
    }
  }
`;

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
  const {
    isOpen: isAddGroupModalOpen,
    onOpen: onAddGroupModalOpen,
    onClose: onAddGroupModalClose,
  } = useDisclosure();

  const {
    isOpen: isSetGroupModalOpen,
    onOpen: onSetGroupModalOpen,
    onClose: onSetGroupModalClose,
  } = useDisclosure();

  const { add: addNotification } = useNotifications();

  const { gameId } = useParams<ParamTypes>();
  const { t } = useTranslation();

  const selectedStudentsRef = useRef([]);
  const [isStudentSelected, setIsStudentSelected] = useState<boolean>(false);

  const [
    autoAssignGroups,
    { data: autoAssignGroupsData, loading: autoAssignGroupsLoading },
  ] = useMutation(AUTO_ASSIGN_GROUPS);

  const {
    data: groupsData,
    error: groupsError,
    loading: groupsLoading,
    refetch: groupsRefetch,
  } = useQuery<getGroupsQuery>(GET_GROUPS, {
    variables: {
      gameId,
    },
    skip: !gameId,
    fetchPolicy: "no-cache",
  });

  const {
    data: gameData,
    error: gameError,
    loading: gameLoading,
    refetch: gameRefetch,
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

  if (gameLoading || groupsLoading) {
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

  if (!gameData || !groupsData) {
    return <Error status="warning" errorContent={"No data"} />;
  }

  // console.log("game data", gameData);

  return (
    <>
      <AddGroupModal
        isOpen={isAddGroupModalOpen}
        onClose={onAddGroupModalClose}
        gameId={gameId}
      />
      <SetGroupModal
        gameId={gameId}
        groupsData={groupsData}
        onClose={onSetGroupModalClose}
        isOpen={isSetGroupModalOpen}
        selectedStudentsRef={selectedStudentsRef}
        refetch={gameRefetch}
      />

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
            <Button
              marginRight={2}
              size="sm"
              isLoading={autoAssignGroupsLoading}
              disabled={autoAssignGroupsLoading}
              onClick={async () => {
                try {
                  await autoAssignGroups({
                    variables: {
                      gameId,
                    },
                  });
                  gameRefetch();
                } catch (err) {
                  addNotification({
                    status: "error",
                    title: t("error.autoAssign.title"),
                    description: t("error.autoAssign.description"),
                  });
                }
              }}
            >
              {t("Auto-assign groups")}
            </Button>
            <Button marginRight={2} size="sm" onClick={onAddGroupModalOpen}>
              {t("Add new group")}
            </Button>

            <Menu>
              <MenuButton
                disabled={!isStudentSelected}
                size="sm"
                as={Button}
                rightIcon={<ChevronDownIcon />}
              >
                {t("Actions")}
              </MenuButton>

              <MenuList>
                <MenuItem onClick={onSetGroupModalOpen}>
                  {t("Set group")}
                </MenuItem>
              </MenuList>
            </Menu>
          </Flex>
        </Flex>
        {/* {JSON.stringify(selectedStudents)} */}
        <Box>
          <TableComponent
            selectableRows
            setIsAnythingSelected={setIsStudentSelected}
            setSelectedStudents={(rows: any) => {
              selectedStudentsRef.current = rows;
            }}
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
                  <ColumnFilter
                    column={column}
                    placeholder={t("table.group")}
                  />
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
    </>
  );
};

export default withChangeAnimation(InstructorGame);
