import React from "react";
import styled from "styled-components";
import Rating from "react-rating";

const CustomRating = props => <StyledRating {...props} />;

export default CustomRating;

const StyledRating = styled(Rating)`
  & > span > span > span {
    background: #9954de !important;
  }
`;
