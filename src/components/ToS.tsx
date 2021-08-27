import React, { useEffect, useState } from "react";
import withChangeAnimation from "../utilities/withChangeAnimation";

const ToS = () => {
  //   const { t, i18n } = useTranslation();
  const [tosHtml, setTosHtml] = useState("");

  useEffect(() => {
    getDataForActiveLanguage();
  }, []);

  const getDataForActiveLanguage = () => {
    fetch(`${process.env.PUBLIC_URL}/tos.html`, {
      headers: {
        "Content-Type": "text/html",
        Accept: "text/html",
      },
    })
      .then(function (response) {
        return response.text();
      })
      .then(function (response) {
        if (response) {
          setTosHtml(response);
        }
      })
      .catch((err) => {
        setTosHtml("");
      });
  };

  return <div dangerouslySetInnerHTML={{ __html: tosHtml }}></div>;
};

export default withChangeAnimation(ToS);
