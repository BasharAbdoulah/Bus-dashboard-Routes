import ModalContainer from "Component/ModalContanier/ModalContainer";
import "./App.css";

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
