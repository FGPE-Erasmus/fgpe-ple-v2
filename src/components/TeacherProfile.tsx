import { QuestionOutlineIcon } from "@chakra-ui/icons";
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
  IconButton,
} from "@chakra-ui/react";
import React, { useCallback, useRef, useState } from "react";
import { useTranslation } from "react-i18next";
import { Link } from "react-router-dom";
import withChangeAnimation from "../utilities/withChangeAnimation";
import InstructorGames from "./InstructorGames";
import TeacherStudents from "./TeacherStudents";
import TutorialWizard from "./TutorialWizard";
import { teacherProfileTutorialData } from "./TutorialWizard/teacherProfileTutorialData";

const TeacherProfile = () => {
  const { t } = useTranslation();
  const [usedFilter, setUsedFilter] = useState(false);
  const [isTutorialWizardOpen, setTutorialWizardOpen] = useState(false);
  const [tutorialState, setTutorialState] = useState({
    yourGames: false,
    yourStudents: false,
  });
  const tutorialStepGames = useRef<HTMLInputElement>();
  const tutorialStepStudents = useRef<HTMLInputElement>();
  const tutorialStepTableMenu = useRef<HTMLInputElement>();
  const tutorialStepSort = useRef<HTMLInputElement>();
  const tutorialStepFilter = useRef<HTMLInputElement>();

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

  const setRefStepFilter = useCallback((node: any) => {
    tutorialStepFilter.current = node;
  }, []);

  return (
    <>
      <TutorialWizard
        isTutorialWizardOpen={isTutorialWizardOpen}
        setTutorialWizardOpen={setTutorialWizardOpen}
        steps={[
          {
            content: `The tutorial will present itself as a series of modals with annotations and prompts on how to progress.`,
          },
          {
            ref: tutorialStepGames as any,
            content:
              "Teacher UI consists of multiple expandable tables like this one. You can filter and sort all records by clicking on the table headers.",
            canGoNext: tutorialState.yourGames,
          },
          {
            ref: tutorialStepSort as any,
            content:
              "You can sort and filter the table by clicking on the table headers or by typing in one of the filter fields.",
            top: 180,
          },
          {
            ref: tutorialStepTableMenu as any,
            content:
              "Tables also have a menu on the right side. You can use it to refresh cached data, export CSV or more.\n\nWe cache data to improve performance.",
            top: 70,
            right: -10,
            textAlign: "center",
          },
          {
            ref: tutorialStepStudents as any,
            content:
              "Main panel also contains a list of all your students profiles.\n\nStudents can be assigned to multiple games, so you can see them numerous times.",
            top: -130,
            menuOnTop: true,
            // textAlign: "center",
          },
          {
            content:
              "This concludes this tutorial. You can always access it by clicking on the question mark icon. \n\nExplore to find more - start by checking one of your games.",
          },
        ]}
      />
      <div>
        <Flex justifyContent="flex-end" alignItems="center" marginBottom={4}>
          {/* <IconButton
            onClick={() => setTutorialWizardOpen(true)}
            aria-label="Open tutorial"
            icon={<QuestionOutlineIcon />}
            marginRight={4}
          /> */}
          <Link to="/teacher/manage-games">
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
          <AccordionItem ref={setRefStepStudents}>
            {({ isExpanded }: { isExpanded: boolean }) => (
              <>
                <AccordionButton data-cy="all-your-students">
                  <Box flex="1" textAlign="left">
                    <Heading as="h3" size="md" marginTop={5} marginBottom={5}>
                      {t("All your students")}
                    </Heading>
                  </Box>
                  <AccordionIcon />
                </AccordionButton>

                <AccordionPanel pb={4} marginTop={2} marginBottom={10}>
                  {isExpanded && <TeacherStudents />}
                </AccordionPanel>
              </>
            )}
          </AccordionItem>
        </Accordion>
      </div>
    </>
  );
};

export default withChangeAnimation(TeacherProfile);
