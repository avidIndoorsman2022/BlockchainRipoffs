import React from "react";
import ReactDOM from "react-dom";
import { WalletReputationsProvider } from "./context/WalletReputationsContext";
import "./index.css";
import App from "./App";

ReactDOM.render(
  <WalletReputationsProvider>
    <React.StrictMode>
      <App />
    </React.StrictMode>
  </WalletReputationsProvider>,
  document.getElementById("root")
);
