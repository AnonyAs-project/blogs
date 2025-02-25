import {
  BrowserRouter as Router,
  Routes,
  Route,
  useLocation,
} from "react-router-dom";
import Posts from "./screens/Posts";
import Login from "./screens/Login";
import Signup from "./screens/Signup";
import Navbar from "./components/Navbar";
import Footer from "./components/Footer";
import GoogleAuthHandler from "./config/GoogleAuthHandler";
import AuthSuccess from "./components/AuthChecking";

function App() {
  return (
    <Router>
      {/* <GoogleAuthHandler /> */}
      <ConditionalNavbar />
      <Routes>
        <Route path="/" element={<Posts />} />
        <Route path="/auth-success" element={<AuthSuccess />} />
        <Route path="/login" element={<Login />} />
        <Route path="/signup" element={<Signup />} />
      </Routes>
      <ConditionalFooter />
    </Router>
  );
}

function ConditionalNavbar() {
  const location = useLocation();
  const hideNavbarPaths = ["/login", "/signup"];

  return !hideNavbarPaths.includes(location.pathname) ? <Navbar /> : null;
}

function ConditionalFooter() {
  const location = useLocation();
  const hideFooterPaths = ["/login", "/signup"];

  return !hideFooterPaths.includes(location.pathname) ? <Footer /> : null;
}

export default App;
