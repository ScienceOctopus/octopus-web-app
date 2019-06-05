import React from "react";
import logo from "../logo.svg";

const DEFAULT_SIZE = 40;

const OctopusLogo = props => {
  return (
    <img
      //   className="logo"
      className={props.className}
      src={logo}
      alt="Octopus Logo"
      style={props.style}
      width={props.size || DEFAULT_SIZE}
      height={props.size || DEFAULT_SIZE}
    />
  );
};

export default OctopusLogo;
