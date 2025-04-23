import { BrowserRouter, Route, Routes } from "react-router-dom";
import "./App.css";
import Dashboard from "./pages/Dashboard";
import Signin from "./pages/signin";
import SignUp from "./pages/signup";

function App() {
  return (
    <>
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<SignUp></SignUp>} />
          <Route path="/signin" element={<Signin></Signin>} />
          <Route path="/dashboard" element={<Dashboard></Dashboard>} />
        </Routes>
      </BrowserRouter>
    </>
  );
}

export default App;
