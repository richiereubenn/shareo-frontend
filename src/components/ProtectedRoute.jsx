// components/ProtectedRoute.js
import { useUser } from "@clerk/clerk-react";
import { useNavigate } from "react-router-dom";

const ProtectedRoute = ({ children }) => {
  const { user, isSignedIn, isLoaded } = useUser();
  const navigate = useNavigate();

  if (!isLoaded) {
    return null; // or a loading spinner
  }

  if (!isSignedIn || !user) {
    console.log("not signed in");
    navigate("/");
  } else {
    navigate("/home");
  }

  return children;
};

export default ProtectedRoute;