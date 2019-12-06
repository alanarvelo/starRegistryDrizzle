import React, { Component } from "react";
import { DrizzleProvider } from "@drizzle/react-plugin";
import { LoadingContainer } from "@drizzle/react-components";

import "./App.css";

import drizzleOptions from "./drizzleOptions";
import MainComponent from "./MainComponent";

class App extends Component {
  render() {
    return (
      <DrizzleProvider options={drizzleOptions}>
        <LoadingContainer>
          <MainComponent />
        </LoadingContainer>
      </DrizzleProvider>
    );
  }
}

export default App;
