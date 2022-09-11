import { combineReducers } from "redux";

// for redux-persist /store our state (caches);
import { persistReducer } from "redux-persist";
// storage type
import storage from "redux-persist/lib/storage";

// reducers
import { siderReducer } from "./sider/reducer";
import { modalReducer } from "./modal/reducer";
import { authReducer } from "./auth/reducer";

// config our persist-redux
const config = {
  key: "root",
  storage,
  whitelist: ["sider", "auth"],
  blacklist: ["modal"],
};

// setup combine reducer
const rootReducer = combineReducers({
  sider: siderReducer,
  modal: modalReducer,
  auth: authReducer,
});

// export it as persist reducer
export default persistReducer(config, rootReducer);
