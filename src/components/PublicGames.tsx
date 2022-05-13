import {
  ApolloError,
  ApolloQueryResult,
  OperationVariables,
  useMutation,
} from "@apollo/client";
import { Box, Button, Tooltip } from "@chakra-ui/react";
import React, { useState } from "react";
import { useTranslation } from "react-i18next";
import { enrollMutation } from "../generated/enrollMutation";
import {
  PlayerGameProfiles,
  PlayerGameProfiles_games,
  PlayerGameProfiles_myGameProfiles,
} from "../generated/PlayerGameProfiles";
import { ENROLL } from "../graphql/enroll";
import { useNotifications } from "./Notifications";
import TableComponent from "./TableComponent";
import ColumnFilter from "./TableComponent/ColumnFilter";

const PublicGames = ({
  gamesData,
  gameProfiles,
  refetch,
}: {
  gamesData: PlayerGameProfiles_games[];
  gameProfiles: PlayerGameProfiles_myGameProfiles[];
  refetch: (
    variables?: Partial<OperationVariables> | undefined
  ) => Promise<ApolloQueryResult<PlayerGameProfiles>>;
}) => {
  const { t } = useTranslation();
  const gameProfileIds = gameProfiles.map((gameProfile) => gameProfile.game.id);
  const [loading, setLoading] = useState(false);
  const [enroll] = useMutation<enrollMutation>(ENROLL);
  const { add: addNotification } = useNotifications();

  const enrollInGame = async (id: string) => {
    setLoading(true);
    try {
      await enroll({
        variables: {
          gameId: id,
        },
      });
    } catch (err: any) {
      if (
        (err as ApolloError).graphQLErrors[0].message ===
        "The archival game cannot be accessed."
      ) {
        addNotification({
          status: "error",
          title: t("You cannot just an archival game"),
        });
      } else {
        addNotification({
          status: "error",
          title: t("error.title"),
        });
      }
    }
    await refetch();
    setLoading(false);
  };

  return (
    <Box>
      <TableComponent
        loading={loading}
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
            Header: t("settings.action"),
            // accessor: "id",
            accessor: (row: PlayerGameProfiles_games) => {
              return gameProfileIds.includes(row.id) ? (
                <Button size="sm" variant="outline" disabled={true}>
                  {t("You're assigned")}
                </Button>
              ) : row.archival ? (
                <Tooltip
                  label={t("This is an archival game")}
                  aria-label="A tooltip"
                  bg="gray.300"
                  color="black"
                  hasArrow
                >
                  <Box>
                    <Button
                      size="sm"
                      colorScheme="gray"
                      disabled={row.archival}
                    >
                      {t("Assign me")}
                    </Button>
                  </Box>
                </Tooltip>
              ) : (
                <Button
                  size="sm"
                  colorScheme="blue"
                  onClick={() => enrollInGame(row.id)}
                >
                  {t("Assign me")}
                </Button>
              );
            },
            disableFilters: true,
            // accessor: (row: any) => {
            //   // console.log("row", row);
            //   const acceptedSubmissions =
            //     row.nrOfSubmissionsByActivityAndResult.ACCEPT || 0;
            //   const totalSubmissions = row.nrOfSubmissionsByActivity;

            //   return `${
            //     totalSubmissions > 0
            //       ? `${(
            //           100 -
            //           (acceptedSubmissions / totalSubmissions) * 100
            //         ).toFixed(1)}%`
            //       : "-"
            //   }`;
            // },
          },
        ]}
        data={gamesData}
      />
    </Box>
  );
};

export default PublicGames;
