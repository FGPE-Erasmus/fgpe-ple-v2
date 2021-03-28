import React from "react";
import styled from "@emotion/styled";

import withChangeAnimation from "../utilities/withChangeAnimation";
import { useTranslation } from "react-i18next";
import { useNotifications } from "./Notifications";

const HomePage = () => {
  const { t } = useTranslation();

  return (
    <div>
      <div>
        <h3>{t("home.title")}</h3>
        <p>{t("home.description")}</p>
      </div>
    </div>
  );
};

export default withChangeAnimation(HomePage);
