import React, { useState, useEffect, useContext } from "react";
import { useKeycloak } from "@react-keycloak/web";
// import { Flex, Box } from "reflexbox";
import styled from "@emotion/styled";
import { NavLink } from "react-router-dom";
import UserIcon from "../images/user.svg";

import { BiUserCircle } from "react-icons/bi";
import { VscColorMode } from "react-icons/vsc";
import { IoLanguage } from "react-icons/io5";

import NavContext from "../context/NavContext";
import LogoSVG from "../images/logo.svg";

import {
  Button,
  useColorMode,
  IconButton,
  Flex,
  Box,
  Text,
  useDisclosure,
} from "@chakra-ui/react";
import { SunIcon, MoonIcon } from "@chakra-ui/icons";
import useBreadcrumbs from "use-react-router-breadcrumbs";
import { useTranslation } from "react-i18next";
import ChangeLanguageModal from "./ChangeLanguageModal";

const Logo = styled.div`
  background: url(${LogoSVG});
  width: 100px;
  height: 50px;
  background-position: center;
  background-repeat: no-repeat;
  background-size: contain;
  position: absolute;
  top: 8px;
`;

const Navbar = () => {
  const breadcrumbs = useBreadcrumbs();
  const {
    isOpen: isOpenLanguageModal,
    onOpen: onOpenLanguageModal,
    onClose: onCloseLanguageModal,
  } = useDisclosure();

  const { t, i18n } = useTranslation();

  const activeGameAndChallenge = useContext(NavContext);
  const { keycloak, initialized } = useKeycloak();
  const resetActiveGameAndChallenge = () => {
    activeGameAndChallenge.setActiveChallenge(null);
    activeGameAndChallenge.setActiveGame(null);
  };
  const { colorMode, toggleColorMode } = useColorMode();
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
    <>
      <ChangeLanguageModal
        onClose={onCloseLanguageModal}
        onOpen={onOpenLanguageModal}
        isOpen={isOpenLanguageModal}
      />
      <NavbarStyled>
        <Flex px={2} alignItems="center" height="100%">
          <Box width={1 / 2}>
            <NavLink to="/" onClick={resetActiveGameAndChallenge}>
              <Logo />
              {/* <b>
              <Text as="span" color={colorMode == "dark" ? "white" : "black"}>
                FGPE
              </Text>
            </b> */}
            </NavLink>
            {/* {breadcrumbs.map(({ match, breadcrumb }) => {
            return (
              <NavLink key={match.url} to={match.url}>
                {breadcrumb}
              </NavLink>
            );
          })} */}

            {/* <NavLink
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
          </NavLink> */}

            {/* {keycloak.authenticated && (
            <NavLink to="/profile">
              {userProfile?.firstName} {userProfile?.lastName}
            </NavLink>
          )} */}
          </Box>
          {/* <UserMenu> */}
          <Flex width={1 / 2} justifyContent="flex-end" alignItems="flex-end">
            {keycloak.authenticated && (
              // <Box>
              <NavLink to="/profile" onClick={resetActiveGameAndChallenge}>
                {/* {userProfile?.firstName} {userProfile?.lastName} */}

                <BiUserCircle
                  fontSize={24}
                  color={colorMode == "dark" ? "white" : "black"}
                />
              </NavLink>
              // </Box>
            )}

            <Box marginLeft={5}>
              <VscColorMode
                fontSize={24}
                color={colorMode == "dark" ? "white" : "black"}
                onClick={toggleColorMode}
                cursor="pointer"
              />
            </Box>
            <Box marginLeft={5}>
              <IoLanguage
                fontSize={24}
                color={colorMode == "dark" ? "white" : "black"}
                onClick={onOpenLanguageModal}
                cursor="pointer"
              />
            </Box>

            <Box marginLeft={5}>
              {keycloak.authenticated ? (
                <button onClick={() => keycloak.logout()}>{t("Logout")}</button>
              ) : (
                <button
                  onClick={() => {
                    keycloak.login({
                      redirectUri: `${window.location.origin}${process.env.PUBLIC_URL}/profile`,
                    });
                  }}
                >
                  {t("Login")}
                </button>
              )}
            </Box>

            {/* <IconButton
              onClick={toggleColorMode}
              aria-label="Toggle theme"
              icon={colorMode === "light" ? <SunIcon /> : <MoonIcon />}
            /> */}
          </Flex>
          {/* </UserMenu> */}
        </Flex>
      </NavbarStyled>
    </>
  );
};

const UserMenu = styled.div`
  /* display: flex; */
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
    /* margin-right: 15px; */
    color: black;
  }

  height: 65px;
  z-index: 999;
  box-shadow: 0px 0px 5px 1px rgba(0, 0, 0, 0.05);
  & > div {
    max-width: 1140px;
    margin: auto;
  }
`;

export default Navbar;
