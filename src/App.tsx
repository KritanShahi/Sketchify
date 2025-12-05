import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Login from "./pages/Login";
import Signup from "./pages/Signup";
import ForgotPassword from "./pages/ForgotPassword";
import Home from "./pages/Home";
import AdminPage from "./admin/home";
import Gallery from "./components/Gallery";
import PublicGallery from "./components/PublicGallery";

export default function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Login />} />
        <Route path="/signup" element={<Signup />} />
        <Route path="/forgot-password" element={<ForgotPassword />} />
        <Route path="/home" element={<Home />} />
        <Route path="/gallery" element={<Gallery />} />
               <Route path="/public_gallery" element={<PublicGallery />} />
       <Route path="/admin/home" element={<AdminPage/>} />
      </Routes>
    </Router>
  );
}
