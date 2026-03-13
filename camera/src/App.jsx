import { BrowserRouter, Routes, Route } from "react-router-dom";
import Login from "./components/Login";
import CameraPage from "./components/CameraPage";

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Login />} />
        <Route path="/camera" element={<CameraPage />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
