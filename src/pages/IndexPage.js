import React, { Component } from "react";
import styled from "styled-components";
import OctopusLogo from "../components/OctopusLogo";
import { createGlobalStyle } from "styled-components";

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
            doloremque minus. In minima nemo accusantium iste corporis sit ut
            vero.
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

const GlobalStyle = createGlobalStyle`
  body {
    height: 100%;
  }

  #root {
    height: 100%;
  }

  .App {
    display: flex;
    flex-flow: column;
    height: 100%;
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
  flex: 1 1 auto;

  @media screen and (max-width: 750px) {
    /* flex-direction: column; */
    padding: 0 2.5%;
    /* height: 100%; */
    /* max-height: 750px; */
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
    text-align: center;
  }
`;

const SubTitle = styled.div`
  padding: 1rem 0;
  font-size: 1.4em;
  line-height: 1.4em;
  color: lightgray;

  @media screen and (max-width: 750px) {
    text-align: center;
  }
`;
