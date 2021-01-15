import React, { useState, useEffect, useContext } from "react";
import { useKeycloak } from "@react-keycloak/web";
import { Flex, Box } from "reflexbox";
import styled from "@emotion/styled";
import { NavLink } from "react-router-dom";
import UserIcon from "../images/user.svg";

import NavContext from "../context/NavContext";

const Navbar = () => {
  const activeGameAndChallenge = useContext(NavContext);
  const { keycloak, initialized } = useKeycloak();
  const resetActiveGameAndChallenge = () => {
    activeGameAndChallenge.setActiveChallenge(null);
    activeGameAndChallenge.setActiveGame(null);
  };

  const [
    userProfile,
    setUserProfile,
  ] = useState<null | Keycloak.KeycloakProfile>(null);

  const loadUserProfile = async () => {
    setUserProfile(await keycloak.loadUserProfile());
  };

  useEffect(() => {
    if (initialized) {
      loadUserProfile();
    }
  }, [initialized]);

  return (
    <NavbarStyled>
      <Flex px={2} alignItems="center" height="100%">
        <Box width={1 / 2}>
          <NavLink to="/" onClick={resetActiveGameAndChallenge}>
            <b>FGPE</b>
          </NavLink>

          <NavLink
            to={{
              pathname: "/profile/game",
              state: {
                gameId: activeGameAndChallenge.activeGame?.id,
                challengeId: activeGameAndChallenge.activeChallenge?.id,
              },
            }}
            onClick={() => {
              activeGameAndChallenge.setActiveChallenge(null);
            }}
          >
            {activeGameAndChallenge.activeGame &&
              activeGameAndChallenge.activeGame.name}
            {activeGameAndChallenge.activeChallenge &&
              " > " + activeGameAndChallenge.activeChallenge.name}
          </NavLink>
          {/* {keycloak.authenticated && (
            <NavLink to="/profile">
              {userProfile?.firstName} {userProfile?.lastName}
            </NavLink>
          )} */}
        </Box>
        <Box width={1 / 2} textAlign="right">
          <UserMenu>
            <NavLink to="/profile" onClick={resetActiveGameAndChallenge}>
              {/* {userProfile?.firstName} {userProfile?.lastName} */}

              {keycloak.authenticated && <UserIconStyled src={UserIcon} />}
            </NavLink>

            {keycloak.authenticated ? (
              <button onClick={() => keycloak.logout()}>Logout</button>
            ) : (
              <button
                onClick={() => {
                  keycloak.login({
                    redirectUri: process.env.REACT_APP_ORIGIN + "/profile",
                  });
                }}
              >
                Login
              </button>
            )}
          </UserMenu>
        </Box>
      </Flex>
    </NavbarStyled>
  );
};

const UserMenu = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  width: 150px;
  float: right;

  * {
    margin-left: 15px;
  }
`;

const UserIconStyled = styled.img`
  height: 25px;
  cursor: pointer;
  transition: transform 0.5s;

  &:hover {
    transform: scale(1.2);
  }
`;

const NavbarStyled = styled.div`
  a {
    margin-right: 15px;
    color: black;
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
