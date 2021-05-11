import React from "react";
import { useTranslation } from "react-i18next";
import withChangeAnimation from "../utilities/withChangeAnimation";

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
