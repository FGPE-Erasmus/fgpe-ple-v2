import { Box, Flex } from "@chakra-ui/react";
import styled from "@emotion/styled";
import React from "react";
import { useTranslation } from "react-i18next";
import withChangeAnimation from "../utilities/withChangeAnimation";
import ErasmusLogo from "../images/erasmus.png";

const HomePage = () => {
  const { t } = useTranslation();

  return (
    <Flex justifyContent="center" alignItems="center">
      <Box>
        {/* <h3>{t("home.title")}</h3>
        <p>{t("home.description")}</p> */}
        <ErasmusImage />
        <Erasmus>
          The contents of this website are the sole responsibility of the
          authors and can in no way be taken to reflect the views of the
          European Union or the Erasmus+ programme.
        </Erasmus>
        <hr style={{ margin: "8px 0px" }} />
        <LinkStyled href="https://fgpe.usz.edu.pl/">
          <span>
            Framework for Gamified Programming Education (Erasmus+ Programme)
          </span>
        </LinkStyled>
      </Box>
    </Flex>
  );
};

const LinkStyled = styled.a`
  font-size: 14px;
  color: #49b3e0;
  transition: color 0.5s;
  width: 100%;
  /* display: flex;
  justify-content: center;
  align-items: center; */
  text-align: center;
  &:hover {
    color: #00b3ff;
  }
`;

const ErasmusImage = styled.div`
  width: 100%;
  height: 100px;
  background-color: white;
  background-position: center;
  background-size: contain;
  background-repeat: no-repeat;
  background-image: url(${ErasmusLogo});
  border-radius: 8px;
  margin-bottom: 16px;
  margin-top: 48px;
`;

const Erasmus = styled.div`
  max-width: 500px;
  padding: 4px 0px;
  margin: 4px 0px;
  font-size: 14px;
  text-align: justify;
`;

export default withChangeAnimation(HomePage);
