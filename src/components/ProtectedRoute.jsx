// components/ProtectedRoute.js
import { useUser, SignedIn, SignedOut } from "@clerk/clerk-react";
import AuthPage from "../pages/AuthPage";
import { useNavigate } from "react-router-dom";

// const ProtectedRoute = ({ children }) => {
//   const { user, isSignedIn, isLoaded } = useUser();
//   const navigate = useNavigate();

//   if (!isLoaded) {
//     return null; // or a loading spinner
//   }

//   if (!isSignedIn || !user) {
//     console.log("not signed in");
//     navigate("/");
//   } else {
//     navigate("/home");
//   }

//   return children;
// };

const ProtectedRoute = ({ children }) => {

  console.log("In protected route. redirecting ... ")

  return (
    <>
      <SignedOut>
        <AuthPage />
      </SignedOut>
      <SignedIn>
        {children}
      </SignedIn>
    </>
  );
};

export default ProtectedRoute;