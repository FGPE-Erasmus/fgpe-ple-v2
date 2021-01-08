import React from "react";
import { useKeycloak } from "@react-keycloak/web";
import { Flex, Box } from "reflexbox";
import styled from "@emotion/styled";
import { NavLink } from "react-router-dom";

const Navbar = () => {
  const { keycloak } = useKeycloak();

  return (
    <NavbarStyled>
      <Flex px={2} alignItems="center" height="100%">
        <Box width={1 / 2}>
          <NavLink to="/">
            {keycloak.authenticated ? "FGPE (logged in)" : "FGPE"}
          </NavLink>
          <NavLink to="/profile">Check your profile</NavLink>
        </Box>
        <Box width={1 / 2} textAlign="right">
          {keycloak.authenticated ? (
            <button onClick={() => keycloak.logout()}>Logout</button>
          ) : (
            <button onClick={() => keycloak.login()}>Login</button>
          )}
        </Box>
      </Flex>
    </NavbarStyled>
  );
};

const NavbarStyled = styled.div`
  a {
    margin-right: 15px;
  }

  background-color: ${({ theme }) => theme.backgroundVariant};
  height: 65px;
  z-index: 999;
  box-shadow: 0px 0px 5px 1px rgba(0, 0, 0, 0.05);
  & > div {
    max-width: 1140px;
    margin: auto;
  }
`;

export default Navbar;
