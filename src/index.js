import React from "react";
import ReactDOM from "react-dom";
import "./index.css";
import App from "./App";
// router
import { BrowserRouter } from "react-router-dom";

/* Setup Re/dux */
import { Provider } from "react-redux";
// redux-persist
import { PersistGate } from "redux-persist/integration/react";
import { store, persistor } from "./redux";
/* Setup Redux */

// style
import "antd/dist/antd.css";
import "./styles/glb.css";

ReactDOM.render(
  <Provider store={store}>
    <BrowserRouter>
      <PersistGate persistor={persistor}>
        <App />
      </PersistGate>
    </BrowserRouter>
  </Provider>,
  document.getElementById("root")
);
