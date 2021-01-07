import React from "react";
import { useKeycloak } from "@react-keycloak/web";
import Loading from "../components/Loading";
import { useTranslation } from "react-i18next";

const MainLoading = () => {
  const { ready } = useTranslation();
  const { initialized } = useKeycloak();

  return <Loading fullscreen show={!ready || !initialized} />;
};

export default MainLoading;
