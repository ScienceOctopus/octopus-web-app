import React from "react";
import styled from "styled-components";
import Rating from "react-rating";

const CustomRating = props => (
  <StyledRating
    emptySymbol={<i className="ratingIcon icon star outline" />}
    fullSymbol={<i className="ratingIcon icon star" />}
    placeholderSymbol={<i className="ratingIcon icon star" />}
    {...props}
  />
);

export default CustomRating;

const StyledRating = styled(Rating)`
  & > span > span > span {
    background: #9954de !important;
  }
`;
