import { useEffect } from "react";
import { useNavigate } from "react-router-dom";

const OAuthCallback = () => {
  const navigate = useNavigate();

  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const token = params.get("token");
    const name = params.get("name");
  
    // Only run effect if URL has a token param
 
    
    if (token) {
      console.log("Came here dashboard")
      localStorage.setItem("access_token", token);
      if (name) localStorage.setItem("name", name);
      navigate("/dashboard", { replace: true });
    }
  }, [navigate]);
  
  

  return <p>Logging you in...</p>;
};

export default OAuthCallback;
