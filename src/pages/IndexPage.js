import React, { Component } from "react";
import styled from "styled-components";
import OctopusLogo from "../components/OctopusLogo";

export default class IndexPage extends Component {
  render() {
    return (
      <div>
        <Container>
          <TitleContainer>
            <MainTitle>Built for scientists</MainTitle>
            <SubTitle>
              Octopus is a publication platform inspired by the way you
              research. Lorem ipsum dolor sit amet, consectetur adipisicing
              elit. Esse, doloremque minus. In minima nemo accusantium iste
              corporis sit ut vero.
            </SubTitle>
          </TitleContainer>
          <OctopusLogo size={600} />
        </Container>

        <Container height="-">
          <OctopusLogo size={400} />
          <TitleContainer>
            <SubTitle>
              A lot of very useful information about octopus and the way it
              works
            </SubTitle>
          </TitleContainer>
        </Container>
      </div>
    );
  }
}

const Container = styled.div`
  display: flex;
  padding: 0 12em;
  background-color: teal;
  flex-direction: row;
  justify-content: space-between;
  align-items: center;
  height: ${p => (p.height ? p.height : "80vh")};
  flex-grow: 1;
`;

const TitleContainer = styled.div`
  /* display: flex;
  flex-direction: column; */
  flex-grow: 1;
  flex-basis: 0;
`;

const MainTitle = styled.div`
  padding: 3rem 1rem;
  font-size: 5em;
  line-height: 1em;
  font-weight: 500;
  color: white;
`;

const SubTitle = styled.div`
  margin: 1rem 1rem;
  font-size: 1.4em;
  line-height: 1.4em;
  color: lightgray;
`;
