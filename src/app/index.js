import React, { Component } from "react";
import BarChart from "./components/BarChart";
import { render } from "react-dom";
import "./styles/main.scss";

class App extends Component {
  render() {
    return (
      <div className="main-container">
      <h1>US Quarterly GDP in Billions of Dollars</h1>
        <BarChart />
      </div>
    );
  };
}

render(
  <App />,
  document.getElementById("root")
);