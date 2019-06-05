import React from "react";
import logo from "../logo.svg";

const OctopusLogo = props => {
  return (
    <img
      //   className="logo"
      className={props.className}
      src={logo}
      alt="Octopus Logo"
      style={props.style}
    />
  );
};

export default OctopusLogo;
