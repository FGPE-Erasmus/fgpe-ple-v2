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
            ref: tutorialStepTableMenu as any,
            content:
              "Tables also have a menu on the right side. You can use it to refresh data, export CSV or more.",
            top: 70,
            right: -10,
            textAlign: "center",
          },
        ]}
      />
      <div>
        <Flex justifyContent="flex-end" alignItems="center" marginBottom={4}>
          {/* <Heading as="h3" size="md" marginTop={5} marginBottom={5}>
            {t("Your games")}
          </Heading> */}
          <IconButton
            onClick={() => setTutorialWizardOpen(true)}
            aria-label="Open tutorial"
            icon={<QuestionOutlineIcon />}
            marginRight={4}
          />
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
                  {isTutorialWizardOpen && (
                    <Box
                      ref={setRefStepTableMenu}
                      position={"absolute !important" as any}
                      width="180px"
                      height="62px"
                      right="10px"
                    />
                  )}
                  {isTutorialWizardOpen && (
                    <Box
                      ref={setRefStepTableMenu}
                      position={"absolute !important" as any}
                      width="180px"
                      height="62px"
                      right="10px"
                    />
                  )}
                  <AccordionPanel pb={4} marginTop={2} marginBottom={10}>
                    {isExpanded && (
                      <InstructorGames
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
