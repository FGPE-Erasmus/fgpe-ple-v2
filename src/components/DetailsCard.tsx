import { Badge, Flex, Heading, useColorMode } from "@chakra-ui/react";
import React from "react";

const DetailsCard = ({
  title,
  content,
  flexDirection,
  badgeContent,
}: {
  title: string;
  content: string;
  flexDirection?: "column" | "row";
  badgeContent?: boolean;
}) => {
  const { colorMode } = useColorMode();

  return (
    <Flex
      width="100%"
      border="1px solid"
      borderColor={colorMode === "dark" ? "gray.700" : "gray.200"}
      padding={2}
      fontSize={14}
      margin={{ base: 0, md: 2 }}
      marginBottom={{ base: 2, md: 2 }}
      borderRadius={4}
      direction={flexDirection ? flexDirection : "column"}
      justifyContent={flexDirection !== "row" ? "center" : "space-between"}
      alignItems={flexDirection !== "row" ? "flex-start" : "center"}
    >
      <Heading as="h4" size="sm" fontSize={16}>
        {title}
      </Heading>
      {badgeContent ? <Badge>{content}</Badge> : content}
    </Flex>
  );
};

export default DetailsCard;
