import React from "react";
import { useKeycloak } from "@react-keycloak/web";
import styled from "@emotion/styled";

import withChangeAnimation from "../utilities/withChangeAnimation";

const HomePage = () => {
  const { keycloak, initialized } = useKeycloak();

  return (
    <div>
      <div>
        <h3>Home Page</h3>
        <p>Anyone can access this page</p>
      </div>

      {/* {initialized ? (
        keycloak.authenticated && (
          <pre>{JSON.stringify(keycloak, undefined, 2)}</pre>
        )
      ) : (
        <h2>keycloak's initializing...</h2>
      )} */}
    </div>
  );
};

const Info = styled.div``;

export default withChangeAnimation(HomePage);
