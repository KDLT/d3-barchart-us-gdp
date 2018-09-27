import React, { Component } from "react";
import BarChart from "./components/BarChart";
import { render } from "react-dom";
import "./styles/main.scss";

class App extends Component {
  render() {
    return (
      <div class="main-container">
        <BarChart />
      </div>
    );
  };
}

render(
  <App />,
  document.getElementById("root")
);