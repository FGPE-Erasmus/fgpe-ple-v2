import { ChevronRightIcon } from "@chakra-ui/icons";
import { Badge, Flex, Heading, useColorMode } from "@chakra-ui/react";
import React from "react";

const DetailsCard = ({
  title,
  content,
  flexDirection,
  badgeContent,
  active,
  noMargins,
  darkerBorder,
  onClick,
}: {
  title: string;
  content: string;
  flexDirection?: "column" | "row";
  badgeContent?: boolean;
  active?: boolean;
  noMargins?: boolean;
  darkerBorder?: boolean;
  onClick?: () => void;
}) => {
  const { colorMode } = useColorMode();

  return (
    <Flex
      data-cy="details-card"
      cursor={active ? "pointer" : "unset"}
      onClick={onClick}
      width="100%"
      border="1px solid"
      borderColor={
        colorMode === "dark"
          ? darkerBorder
            ? "gray.800"
            : "gray.700"
          : "gray.200"
      }
      padding={2}
      fontSize={14}
      margin={{ base: 0, md: noMargins ? 0 : 2 }}
      marginBottom={{ base: 2, md: noMargins ? 0 : 2 }}
      borderRadius={4}
      direction={flexDirection ? flexDirection : "column"}
      justifyContent={flexDirection !== "row" ? "center" : "space-between"}
      alignItems={flexDirection !== "row" ? "flex-start" : "center"}
      position="relative"
      _hover={
        active
          ? { borderColor: colorMode === "dark" ? "gray.500" : "gray.400" }
          : undefined
      }
      transition="border-color 0.5s"
    >
      <Heading as="h4" size="sm" fontSize={16} data-cy="details-card-title">
        {title}
      </Heading>
      {badgeContent ? <Badge>{content}</Badge> : content}
      {active && (
        <ChevronRightIcon position="absolute" fontSize={24} right={4} />
      )}
    </Flex>
  );
};

export default DetailsCard;
