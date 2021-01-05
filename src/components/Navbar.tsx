import React from "react";
import { useKeycloak } from "@react-keycloak/web";

const Navbar = () => {
  const { keycloak, initialized } = useKeycloak();

  return (
    <ul>
      <li>
        <a href="/">Home Page </a>
      </li>

      {keycloak && !keycloak.authenticated && (
        <li>
          <a className="btn-link" onClick={() => keycloak.login()}>
            Login
          </a>
        </li>
      )}

      {keycloak && keycloak.authenticated && (
        <li>
          <a className="btn-link" onClick={() => keycloak.logout()}>
            Logout
          </a>
        </li>
      )}
    </ul>
  );
};

export default Navbar;
