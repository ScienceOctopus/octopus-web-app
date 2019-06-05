import React, { Component } from "react";
import styled, { css } from "styled-components";
import OctopusLogo from "../components/OctopusLogo";
import { createGlobalStyle } from "styled-components";
import { Link } from "react-router-dom";
import WebURI from "../urls/WebsiteURIs";
export default class IndexPage extends Component {
  render() {
    return (
      <Container>
        <GlobalStyle />
        <TitleContainer>
          <MainTitle>Built for scientists</MainTitle>
          <SubTitle>
            Octopus is a publication platform inspired by the way you research.
            Lorem ipsum dolor sit amet, consectetur adipisicing elit. Esse,
            doloremque minus. In minima nemo accusantium iste crporis sit ut
            vero.
            <LinkContainer>
              <StyledAnchor href={WebURI.OrcidLogin(1337)}>
                Log In via ORCID
              </StyledAnchor>
              <StyledLink to={WebURI.Upload}>Explore Science</StyledLink>
            </LinkContainer>
          </SubTitle>
        </TitleContainer>
        <StyledGraph size={450} style={styles.logo} />
      </Container>
    );
  }
}

const styles = {
  logo: {
    maxWidth: "60vw",
    maxHeight: "60vh",
  },
};

const StackableGrid = ({ children }) => (
  <div className="ui stackable four column grid">
    {children.map(x => (
      <div className="column">{x}</div>
    ))}
  </div>
);

const linkStyle = css`
  padding-right: 2rem;
  color: white;
  text-decoration: underline;

  :after {
    content: " >";
  }

  :hover {
    color: lightgreen;
  }
`;

const StyledLink = styled(Link)`
  ${linkStyle}
`;

const StyledAnchor = styled.a`
  ${linkStyle}
`;

const LinkContainer = styled.div`
  margin-top: 1em;
  width: 100%;
  display: flex;
  flex-wrap: wrap;
  @media screen and (max-width: 750px) {
    flex-direction: column;
    justify-content: space-evenly;
  }
`;

const GlobalStyle = createGlobalStyle`
  body {
    height: 100%;
    background-color:teal;
  }

  #root {
    height: 100%;
  }

  .App {
    display: flex;
    flex-flow: column;
    height: 100%;
    @media screen and (max-height: 400px) {
      height:unset;
    }
  }
`;

const Container = styled.div`
  display: flex;
  padding: 0 10%;
  background-color: teal;
  flex-direction: row;
  justify-content: space-around;
  align-items: center;
  /* height: ${p => (p.height ? p.height : "100%")}; */
  flex-grow: 1;
  /* max-height: 600px; */
  /* flex: 1 1 auto; */

  @media screen and (max-width: 750px) {
    /* flex-direction: column; */
    padding: 0 2.5%;
    /* height: 100%; */
    /* max-height: 750px; */
  }

  @media screen and (max-height: 500px) {
    /* flex-direction: column; */
    /* padding: 0 25%; */
    flex-grow: 0;
    height:200%;
    padding: 0 10%;
  }
`;

const StyledGraph = styled(OctopusLogo)`
  @media screen and (max-width: 750px) {
    display: none;
  }
`;

const TitleContainer = styled.div`
  display: flex;
  flex-direction: column;
  flex-grow: 1;
  flex-basis: 0;
`;

const MainTitle = styled.div`
  padding: 1rem 0;
  font-size: 5em;
  line-height: 1em;
  font-weight: 500;
  color: white;

  @media screen and (max-width: 750px) {
    font-size: 8em;
    text-align: center;
  }

  @media screen and (max-height: 500px) {
    font-size: 4em;
  }
`;

const SubTitle = styled.div`
  padding: 1rem 0;
  font-size: 1.4em;
  line-height: 1.4em;
  color: lightgray;

  @media screen and (max-width: 750px) {
    text-align: center;
    font-size: 2.5em;
  }

  @media screen and (max-height: 500px) {
    font-size: 1.5em;
  }
`;
