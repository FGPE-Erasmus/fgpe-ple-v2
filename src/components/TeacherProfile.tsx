import {
  Accordion,
  AccordionButton,
  AccordionIcon,
  AccordionItem,
  AccordionPanel,
  Box,
  Button,
  Flex,
  Heading,
} from "@chakra-ui/react";
import { useCallback, useContext, useRef, useState } from "react";
import { useTranslation } from "react-i18next";
import { Link } from "react-router-dom";
import NavContext from "../context/NavContext";
import withChangeAnimation from "../utilities/withChangeAnimation";
import InstructorGames from "./InstructorGames";
import { useNotifications } from "./Notifications";
import TeacherStudents from "./TeacherStudents";
import TutorialWizard from "./TutorialWizard";
import {
  teacherProfileStudentsData,
  teacherProfileTutorialData,
} from "./TutorialWizard/teacherProfileTutorialData";

const TeacherProfile = () => {
  const {
    shouldBaseTutorialStart: isTutorialWizardOpen,
    setShouldBaseTutorialStart: setTutorialWizardOpen,
    toggledDarkMode,
  } = useContext(NavContext);
  const { add: addNotification } = useNotifications();
  const { t } = useTranslation();
  const [usedFilter, setUsedFilter] = useState(false);
  const [finalTutorialStep, setFinalTutorialStep] = useState(false);
  const [tutorialState, setTutorialState] = useState({
    yourGames: false,
    yourStudents: false,
  });
  const tutorialStepGames = useRef<HTMLInputElement>();
  const tutorialStepStudents = useRef<HTMLInputElement>();
  const tutorialStepTableMenu = useRef<HTMLInputElement>();
  const tutorialStepSort = useRef<HTMLInputElement>();
  const tutorialStepNavigation = useRef<HTMLInputElement>();

  const setRefStepNavigation = useCallback((node: any) => {
    tutorialStepNavigation.current = node;
  }, []);

  const setRefStepGame = useCallback((node: any) => {
    tutorialStepGames.current = node;
  }, []);

  const setRefStepStudents = useCallback((node: any) => {
    tutorialStepStudents.current = node;
  }, []);

  const setRefStepTableMenu = useCallback((node: any) => {
    tutorialStepTableMenu.current = node;
  }, []);

  const setRefStepSort = useCallback((node: any) => {
    tutorialStepSort.current = node;
  }, []);

  return (
    <>
      <TutorialWizard
        isTutorialWizardOpen={isTutorialWizardOpen}
        setTutorialWizardOpen={setTutorialWizardOpen}
        steps={[
          {
            content: `This tutorial will show basics of the PLE UI. You can always access this tutorial  from the dashboard by clicking on the "?" button in the top right corner.\n\nYou can also find other tutorials across the whole platform - look for the "?" icon.`,
          },
          {
            ref: tutorialStepNavigation as any,
            content:
              "Let's start with the navigation. You can always access the main menu, because it's fixed to the top of the screen.\n\n- The profile icon is your dashboard - we are here.\n- The gear icon is the settings menu.\n- You can toggle the dark mode using the contrast icon.\n- You can change the language using the language icon.\n- The question mark icon opens this tutorial.\n\nToggle dark mode to proceed.",
            scrollToTop: true,
            top: 80,
            canGoNext: toggledDarkMode,
            pointerEvents: "none",
            htmlPointerEvents: "all",
            forceNext: toggledDarkMode,
          },
          {
            ref: tutorialStepNavigation as any,
            content:
              "You can toggle it once again if you want to go back to the light mode.",
            scrollToTop: true,
            top: 80,
            canGoNext: toggledDarkMode,
            pointerEvents: "none",
            htmlPointerEvents: "all",
          },
          {
            ref: tutorialStepGames as any,
            content:
              "Teacher UI consists of multiple expandable tables like this one. You can filter and sort all records by clicking on the table headers.\n\nExpand the table to continue.",
            canGoNext: tutorialState.yourGames,
            additionalMargin: 100,
          },
          {
            ref: tutorialStepSort as any,
            content:
              "You can sort and filter the table by clicking on the table headers or by typing in one of the filter fields.",
            top: 180,
            pointerEvents: "none",
          },
          {
            ref: tutorialStepTableMenu as any,
            content:
              "Tables also have a menu on the right side. You can use it to refresh cached data, export CSV or more.\n\n Click the CSV button to export the table to a CSV file.",
            top: 70,
            right: -10,
            textAlign: "center",
            // pointerEvents: "none",
          },
          {
            canGoNext: tutorialState.yourStudents,
            ref: tutorialStepStudents as any,
            content:
              "Main panel also contains a list of all your students profiles.\n\nStudents can be assigned to multiple games, so you can see them numerous times.\n\nExpand this table to continue.",
            top: -145,
            menuOnTop: true,
            // textAlign: "center",
          },
          {
            ref: tutorialStepGames as any,
            content:
              'Let\'s check the game details. Click on any game to continue or click "Cancel" to close this tutorial.',
            onStepEnter: () => {
              setFinalTutorialStep(true);
            },
          },
        ]}
      />

      {/* Navigation tutorial */}
      <Box
        position="fixed"
        top={0}
        right={0}
        zIndex={9999}
        pointerEvents={"none !important" as any}
        cursor="not-allowed"
      >
        <Box
          width="340px"
          height="60px"
          ref={setRefStepNavigation}
          pointerEvents={"none !important" as any}
        />
      </Box>

      <div>
        <Flex justifyContent="flex-end" alignItems="center" marginBottom={4}>
          <Link
            to="/teacher/manage-games"
            style={{
              pointerEvents: isTutorialWizardOpen ? "none" : "all",
            }}
          >
            <Button marginRight={5}>{t("Manage games")}</Button>
          </Link>
        </Flex>
        <Accordion allowToggle allowMultiple>
          <AccordionItem position="relative" ref={setRefStepGame}>
            {({ isExpanded }: { isExpanded: boolean }) => {
              if (isExpanded) {
                !tutorialState.yourGames &&
                  setTutorialState({
                    ...tutorialState,
                    yourGames: true,
                  });
              } else {
                tutorialState.yourGames &&
                  setTutorialState({
                    ...tutorialState,
                    yourGames: false,
                  });
              }
              return (
                <>
                  {isTutorialWizardOpen &&
                    tutorialState.yourGames &&
                    !finalTutorialStep && (
                      <Box
                        position="absolute"
                        width="100%"
                        height="calc(100% - 200px)"
                        top="220px"
                        pointerEvents="all"
                        zIndex={100}
                        cursor="not-allowed"
                        onClick={() => {
                          // alert that you can't click here yet
                          addNotification({
                            title: "Tutorial",
                            description: "You can't click here yet",
                            status: "warning",
                          });
                        }}
                      />
                    )}
                  <AccordionButton data-cy="your-games">
                    <Box flex="1" textAlign="left">
                      <Heading as="h3" size="md" marginTop={5} marginBottom={5}>
                        <Box>{t("Your games")}</Box>
                      </Heading>
                    </Box>
                    <AccordionIcon />
                  </AccordionButton>
                  {/* Tutorial Only elements */}
                  {isTutorialWizardOpen && (
                    <Box
                      ref={setRefStepSort}
                      position={"absolute !important" as any}
                      width="100%"
                      height="160px"
                      top="120px"
                      pointerEvents={"none !important" as any}
                    />
                  )}
                  {isTutorialWizardOpen && (
                    <Box
                      ref={setRefStepTableMenu}
                      position={"absolute !important" as any}
                      width="180px"
                      height="62px"
                      right="10px"
                      pointerEvents={"none !important" as any}
                    />
                  )}
                  {isTutorialWizardOpen && (
                    <Box
                      ref={setRefStepTableMenu}
                      position={"absolute !important" as any}
                      width="180px"
                      height="62px"
                      right="10px"
                      pointerEvents={"none !important" as any}
                    />
                  )}
                  <AccordionPanel pb={4} marginTop={2} marginBottom={10}>
                    {isExpanded && (
                      <InstructorGames
                        setUsedFilter={setUsedFilter}
                        tutorialData={teacherProfileTutorialData}
                        showTutorialData={isTutorialWizardOpen}
                      />
                    )}
                  </AccordionPanel>
                </>
              );
            }}
          </AccordionItem>
          <AccordionItem ref={setRefStepStudents} position="relative">
            {({ isExpanded }: { isExpanded: boolean }) => {
              if (isExpanded) {
                !tutorialState.yourStudents &&
                  setTutorialState({
                    ...tutorialState,
                    yourStudents: true,
                  });
              } else {
                tutorialState.yourStudents &&
                  setTutorialState({
                    ...tutorialState,
                    yourStudents: false,
                  });
              }

              return (
                <>
                  {isTutorialWizardOpen && tutorialState.yourStudents && (
                    <Box
                      position="absolute"
                      width="100%"
                      height="calc(100% - 200px)"
                      top="200px"
                      pointerEvents="all"
                      zIndex={100}
                      cursor="not-allowed"
                      onClick={() => {
                        // alert that you can't click here yet
                        addNotification({
                          title: "Tutorial",
                          description: "You can't click here yet",
                          status: "warning",
                        });
                      }}
                    />
                  )}
                  <AccordionButton data-cy="all-your-students">
                    <Box flex="1" textAlign="left">
                      <Heading as="h3" size="md" marginTop={5} marginBottom={5}>
                        {t("All your students")}
                      </Heading>
                    </Box>
                    <AccordionIcon />
                  </AccordionButton>

                  <AccordionPanel pb={4} marginTop={2} marginBottom={10}>
                    {isExpanded && (
                      <TeacherStudents
                        tutorialData={teacherProfileStudentsData}
                        showTutorialData={isTutorialWizardOpen}
                      />
                    )}
                  </AccordionPanel>
                </>
              );
            }}
          </AccordionItem>
        </Accordion>
      </div>
    </>
  );
};

export default withChangeAnimation(TeacherProfile);
