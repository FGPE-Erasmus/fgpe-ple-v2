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
import React from "react";
import { useTranslation } from "react-i18next";
import { Link } from "react-router-dom";
import withChangeAnimation from "../utilities/withChangeAnimation";
import InstructorGames from "./InstructorGames";
import TeacherStudents from "./TeacherStudents";

const TeacherProfile = () => {
  const { t } = useTranslation();

  return (
    <div>
      <Flex justifyContent="flex-end" alignItems="center" marginBottom={4}>
        {/* <Heading as="h3" size="md" marginTop={5} marginBottom={5}>
            {t("Your games")}
          </Heading> */}

        <Link to="/teacher/manage-games">
          <Button marginRight={5}>{t("Manage games")}</Button>
        </Link>
      </Flex>
      <Accordion allowToggle allowMultiple>
        <AccordionItem>
          {({ isExpanded }: { isExpanded: boolean }) => (
            <>
              <AccordionButton>
                <Box flex="1" textAlign="left">
                  <Heading as="h3" size="md" marginTop={5} marginBottom={5}>
                    {t("Your games")}
                  </Heading>
                </Box>
                <AccordionIcon />
              </AccordionButton>

              <AccordionPanel pb={4} marginTop={2} marginBottom={10}>
                {isExpanded && <InstructorGames />}
              </AccordionPanel>
            </>
          )}
        </AccordionItem>
        <AccordionItem>
          {({ isExpanded }: { isExpanded: boolean }) => (
            <>
              <AccordionButton>
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
  );
};

export default withChangeAnimation(TeacherProfile);
