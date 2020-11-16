import React from "react";
import ReactDOM from "react-dom";
import App from "./src/App";
import { StateProvider } from "./src/state/Store";

const Root = () => (
  <StateProvider>
    <App />
  </StateProvider>
);

ReactDOM.render(<Root />, document.getElementById("root"));
