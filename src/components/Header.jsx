import React from "react";
import { Heading, Flex, Divider } from "@chakra-ui/react";


const Header = () => {
  return (
    <Flex
      as="nav"
      align="center"
      justify="space-between"
      wrap="wrap"
      paddingY="1rem"
      paddingX="1rem"
      bg="twitter.500"
      color="white"
      boxShadow="0px 2px 4px rgba(0, 0, 0, 0.2)" // Add a subtle box shadow
    >
      <Flex align="center" mr={5}>
        <Heading as="h1" size="lg" fontWeight="bold">Task Manager</Heading>
      </Flex>
    </Flex>
  );
};


export default Header;
