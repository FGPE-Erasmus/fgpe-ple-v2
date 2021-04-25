import { gql, useQuery } from "@apollo/client";
import { Button, Checkbox, Heading, useDisclosure } from "@chakra-ui/react";
import { useKeycloak } from "@react-keycloak/web";
import React from "react";
import { useTranslation } from "react-i18next";
import { Box, Flex } from "reflexbox";
import { getAllAvailableGames } from "../generated/getAllAvailableGames";
import {
  checkIfConnectionAborted,
  SERVER_ERRORS,
} from "../utilities/ErrorMessages";
import withChangeAnimation from "../utilities/withChangeAnimation";
import AddGameModal from "./AddGameModal";
import Error from "./Error";
import TableComponent from "./TableComponent";
import ColumnFilter from "./TableComponent/ColumnFilter";

const GET_ALL_AVAILABLE_GAMES = gql`
  query getAllAvailableGames {
    games {
      id
      name
      description
      gedilLayerId
      gedilLayerDescription
      startDate
      endDate
      createdAt
      updatedAt
      evaluationEngine
      private
      instructors {
        email
        id
      }
    }
  }
`;

const ManageGames = () => {
  const { data, error, loading, refetch } = useQuery<getAllAvailableGames>(
    GET_ALL_AVAILABLE_GAMES,
    {
      fetchPolicy: "no-cache",
    }
  );
  const { t } = useTranslation();
  const { keycloak } = useKeycloak();
  const {
    isOpen: isAddGameModalOpen,
    onOpen: onAddGameModalOpen,
    onClose: onAddGameModalClose,
  } = useDisclosure();

  if (!loading && error) {
    const isServerConnectionError = checkIfConnectionAborted(error);

    if (isServerConnectionError) {
      return <Error serverConnectionError />;
    } else {
      return <Error errorContent={JSON.stringify(error)} />;
    }
  }

  if (loading) {
    return <div>{t("Loading")}</div>;
  }

  return (
    <Box>
      <AddGameModal
        isOpen={isAddGameModalOpen}
        onOpen={onAddGameModalOpen}
        onClose={onAddGameModalClose}
        refetchGames={refetch}
      />
      <Flex justifyContent="space-between" alignItems="center">
        <Heading as="h3" size="md" marginTop={5} marginBottom={5}>
          {t("All available games")}
        </Heading>
        <Button onClick={onAddGameModalOpen}>{t("Add new game")}</Button>
      </Flex>

      <Box>
        <TableComponent
          //   onClickFunc={(row) => {}}
          columns={[
            {
              Header: t("table.gameName"),
              accessor: "name",
              Filter: ({ column }: { column: any }) => (
                <ColumnFilter
                  column={column}
                  placeholder={t("placeholders.gameName")}
                />
              ),
            },
            {
              Header: t("table.gameDescription"),
              accessor: "description",
              Filter: ({ column }: { column: any }) => (
                <ColumnFilter
                  column={column}
                  placeholder={t("placeholders.gameDescription")}
                />
              ),
            },
            {
              Header: t("table.enrolled"),
              accessor: (row: any) => {
                const enrolled =
                  row.instructors.filter(
                    (instructor: any) =>
                      instructor.email == keycloak.profile?.email || false
                  ).length > 0;

                return (
                  <Checkbox
                    colorScheme={enrolled ? "green" : "blue"}
                    disabled={enrolled}
                    isChecked={enrolled}
                  />
                );
              },
              disableFilters: true,
              //   Cell: ({ row }: { row: any }) => {
              //     console.log(row);
              //     return "-";
              //   },
              //   Filter: ({ column }: { column: any }) => (
              //     <ColumnFilter
              //       column={column}
              //       placeholder={t("placeholders.gameDescription")}
              //     />
              //   ),
            },
          ]}
          data={data?.games}
        />
      </Box>
    </Box>
  );
};

export default withChangeAnimation(ManageGames);
