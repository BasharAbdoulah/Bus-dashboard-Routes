import ModalContainer from "Component/ModalContanier/ModalContainer";
import "./App.css";
import "./styles/global.scss";

// main Route
import Router from "./routes/index";

function App() {
  return (
    <div className="App">
      <Router />
      <ModalContainer />
    </div>
  );
}

export default App;
