import React from "react";
import styled from "styled-components";

import logo from "../../logo.svg";

export const OctopusIcon = props => (
  <img src={logo} alt="Octopus Icon" {...props} />
);

export default styled(OctopusIcon)`
  margin-right: 8px;
`;
