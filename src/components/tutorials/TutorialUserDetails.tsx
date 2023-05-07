import { QuestionOutlineIcon } from "@chakra-ui/icons";
import { Box, Flex, Heading, IconButton, Tooltip } from "@chakra-ui/react";
import { useCallback, useContext, useMemo, useRef, useState } from "react";
import { useTranslation } from "react-i18next";
import { useHistory, useParams } from "react-router-dom";
import NavContext from "../../context/NavContext";
import { allGameProfilesQuery_allGameProfiles } from "../../generated/allGameProfilesQuery";
import withChangeAnimation from "../../utilities/withChangeAnimation";
import DetailsCard from "../DetailsCard";
import Error from "../Error";
import { useNotifications } from "../Notifications";
import RefreshCacheMenu from "../RefreshCacheMenu";
import TableComponent from "../TableComponent";
import ColumnFilter from "../TableComponent/ColumnFilter";
import TutorialWizard from "../TutorialWizard";
import mockGameProfiles from "./tutorialGameProfiles";
import mockUserData from "./tutorialUserData";

const userData = mockUserData;
const gameProfilesData = mockGameProfiles;

const TutorialUserDetails = () => {
  const { setShouldBaseTutorialStart } = useContext(NavContext);

  const [isTutorialWizardOpen, setTutorialWizardOpen] = useState(true);
  const { add: addNotification } = useNotifications();
  const { userId } = useParams<{ userId: string }>();
  const history = useHistory();
  const memoizedSorting = useMemo(
    () => (rowA: any, rowB: any) => {
      const a =
        rowA.original.learningPath
          .flatMap((learningPath: any) => learningPath.progress)
          .reduce((a: any, b: any) => a + b, 0) /
        rowA.original.learningPath.length;

      const b =
        rowB.original.learningPath
          .flatMap((learningPath: any) => learningPath.progress)
          .reduce((a: any, b: any) => a + b, 0) /
        rowB.original.learningPath.length;

      if (a > b) return 1;

      if (b > a) return -1;

      return 0;
    },
    []
  );

  const { t } = useTranslation();

  const tutorialStepUserDetails = useRef<HTMLInputElement>();
  const setRefStepUserDetails = useCallback((node: any) => {
    tutorialStepUserDetails.current = node;
  }, []);

  const tutorialStepGameProfiles = useRef<HTMLInputElement>();
  const setRefStepGameProfiles = useCallback((node: any) => {
    tutorialStepGameProfiles.current = node;
  }, []);

  if (!userId) {
    return <Error />;
  }

  return (
    <>
      <TutorialWizard
        isTutorialWizardOpen={isTutorialWizardOpen}
        setTutorialWizardOpen={setTutorialWizardOpen}
        onClose={() => {
          // redirect to homepage
          setShouldBaseTutorialStart(false);
          history.push("/profile");
        }}
        steps={[
          {
            content: `This is the user details page. Here you can see all the details of a user and all the game profiles - all the games that the user has played.`,
            scrollToTop: true,
          },
          {
            content: `Here are the details of the user. You can see the full name, email, username and check if the email is verified.`,
            scrollToTop: true,
            ref: tutorialStepUserDetails as any,
            top: 80,
          },
          {
            content: `This table shows all the game profiles of the user - all the games that the user has played.\n\nYou can click on a row to see the details of the game profile or close this tutorial. This is the end of the basics.`,
            scrollToTop: true,
            ref: tutorialStepGameProfiles as any,
            top: -130,
          },
        ]}
      />
      <div>
        <Flex justifyContent="space-between" alignItems="center">
          <Heading as="h3" size="md" marginTop={5} marginBottom={5}>
            {t("User")}: {userData?.user.firstName} {userData?.user.lastName}
          </Heading>
          <Tooltip label={t("Show basic user profile tutorial")}>
            <IconButton
              onClick={() => {
                addNotification({
                  title: t("Tutorial"),
                  description: t("This button opens this exact tutorial!"),
                });
              }}
              aria-label="Open tutorial"
              icon={<QuestionOutlineIcon />}
            />
          </Tooltip>
        </Flex>

        <Flex
          ref={setRefStepUserDetails}
          margin="auto"
          width="100%"
          justifyContent="space-between"
          flexDirection={{ base: "column", md: "row" }}
        >
          <DetailsCard
            title={t("Full name")}
            content={`${userData?.user.firstName} ${userData?.user.lastName}`}
          />

          <DetailsCard
            title={"E-Mail"}
            content={userData?.user.email || "N/A"}
          />

          <DetailsCard
            title={t("E-Mail verified")}
            content={userData?.user.emailVerified ? t("Yes") : t("No")}
          />

          <DetailsCard
            title={t("Username")}
            content={userData?.user.username || "N/A"}
          />
        </Flex>

        <Flex justifyContent="space-between" alignItems="center"></Flex>
        <Box ref={setRefStepGameProfiles}>
          <TableComponent
            tableHeader={
              <Heading as="h3" size="md" marginTop={5} marginBottom={5}>
                {t("All game profiles")}
              </Heading>
            }
            refreshData={(() => {}) as any}
            contextMenu={
              <RefreshCacheMenu loading={false} refetch={(() => {}) as any} />
            }
            onRowClick={(row: allGameProfilesQuery_allGameProfiles) => {
              history.push({
                pathname: `/teacher/tutorial/player-details/${userData?.user.id}/${row.game.id}`,
              });
            }}
            columns={[
              {
                Header: t("Game"),
                accessor: "game.name",
                Filter: ({ column }: { column: any }) => (
                  <ColumnFilter column={column} placeholder={"abc"} />
                ),
              },
              {
                Header: t("table.group"),
                accessor: "group.name",
                Filter: ({ column }: { column: any }) => (
                  <ColumnFilter column={column} placeholder={"abc"} />
                ),
              },
              {
                Header: t("points"),
                accessor: "points",
                Filter: ({ column }: { column: any }) => (
                  <ColumnFilter column={column} placeholder={"abc"} />
                ),
              },
              {
                Header: t("table.submissions"),
                accessor: (
                  row: allGameProfilesQuery_allGameProfiles | undefined
                ) => {
                  if (row) {
                    return row.stats.nrOfSubmissions;
                  }
                },
                Filter: ({ column }: { column: any }) => (
                  <ColumnFilter column={column} placeholder={"abc"} />
                ),
              },
              {
                Header: t("table.validations"),
                accessor: (
                  row: allGameProfilesQuery_allGameProfiles | undefined
                ) => {
                  if (row) {
                    return row.stats.nrOfValidations;
                  }
                },
                Filter: ({ column }: { column: any }) => (
                  <ColumnFilter column={column} placeholder={"abc"} />
                ),
              },
              {
                Header: t("Rewards"),
                accessor: (
                  row: allGameProfilesQuery_allGameProfiles | undefined
                ) => {
                  if (row) {
                    return row.rewards.length;
                  }
                },
                Filter: ({ column }: { column: any }) => (
                  <ColumnFilter column={column} placeholder={"abc"} />
                ),
              },
              {
                Header: t("table.progress"),
                accessor: "learningPath",
                Cell: ({ value }: { value: any }) => {
                  const totalChallengesCount = value.length || 1;

                  const progressCombined =
                    value
                      .flatMap((learningPath: any) => learningPath.progress)
                      .reduce((a: any, b: any) => a + b, 0) /
                    totalChallengesCount;

                  return (progressCombined * 100).toFixed(1) + "%";
                },
                disableFilters: true,
                sortType: memoizedSorting,
              },
            ]}
            data={gameProfilesData?.allGameProfiles}
          />
        </Box>
      </div>
    </>
  );
};

export default withChangeAnimation(TutorialUserDetails);
