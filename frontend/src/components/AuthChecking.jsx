import { useEffect } from "react";
import { useNavigate } from "react-router-dom";

const AuthSuccess = () => {
  const navigate = useNavigate();

  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const token = params.get("token");

    if (token) {
      localStorage.setItem("blogs-token", token);

      // Clear the URL to remove the token after storing
      window.history.replaceState({}, document.title, "/");

      // Redirect to the main dashboard
      navigate("/");
    } else {
      // Redirect to login if no token found
      navigate("/login");
    }
  }, [navigate]);

  return <div>Authenticating...</div>;
};

export default AuthSuccess;
