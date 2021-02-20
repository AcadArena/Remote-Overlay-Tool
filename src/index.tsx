import React from "react";
import ReactDOM from "react-dom";
import "./index.css";
import App from "./App";
import reportWebVitals from "./reportWebVitals";
import { BrowserRouter as Router } from "react-router-dom";

import MyTheme from "./Theme";
import CssBaseline from "@material-ui/core/CssBaseline";
import WebsocketProvider from "./config/websocket/WebsocketProvider";

import { createStore } from "redux";
import Reducers from "./config/redux/AllReducers";
import { Provider } from "react-redux";
import { composeWithDevTools } from "redux-devtools-extension";

export let store = createStore(Reducers, composeWithDevTools());

ReactDOM.render(
  <React.StrictMode>
    <Provider store={store}>
      <Router>
        <WebsocketProvider>
          <MyTheme>
            <CssBaseline />
            <App />
          </MyTheme>
        </WebsocketProvider>
      </Router>
    </Provider>
  </React.StrictMode>,
  document.getElementById("root")
);

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();
