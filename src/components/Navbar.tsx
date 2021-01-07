import React from "react";
import { useKeycloak } from "@react-keycloak/web";
import { Flex, Box } from "reflexbox";
import styled from "@emotion/styled";

const Navbar = () => {
  const { keycloak, initialized } = useKeycloak();

  return (
    <NavbarStyled>
      <Flex px={2} alignItems="center" height="100%">
        <Box width={1 / 2}>{keycloak.authenticated ? "Username" : "FGPE"}</Box>
        <Box width={1 / 2} textAlign="right">
          <button onClick={() => keycloak.login()}>Login</button>
        </Box>
      </Flex>
    </NavbarStyled>
  );
};

const NavbarStyled = styled.div`
  background-color: ${({ theme }) => theme.backgroundVariant};
  height: 65px;
  z-index: 999;
  box-shadow: 0px 0px 5px 1px rgba(0, 0, 0, 0.05);
  & > div {
    max-width: 1920px;
    margin: auto;
  }
`;

export default Navbar;
