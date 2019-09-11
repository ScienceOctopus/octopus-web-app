import React from "react";
import styled from "styled-components";
import Rating from "react-rating";

const CustomRating = props => <StyledRating {...props}/>;

export default CustomRating;

// & > span > span > span {
//   max-width: ${props => (props.size ? props.size : "30px")};
//   max-height: ${props => (props.size ? props.size : "30px")};
// }
const StyledRating = styled(Rating)`
  & > span > span > span {
    background: #9954de !important;
  }

`;
