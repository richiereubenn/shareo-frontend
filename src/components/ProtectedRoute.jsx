import React from "react";
import { Navigate } from "react-router-dom";
import { useUser } from "@clerk/clerk-react";

const ProtectedRoute = ({ children }) => {
  const { isSignedIn } = useUser();

  if (!isSignedIn) {
    return <Navigate to="/" replace />;
  }

  return children;
};

export default ProtectedRoute;
