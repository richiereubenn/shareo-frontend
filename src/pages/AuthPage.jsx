import React, { useState } from "react";
import { User, Mail, Phone, Lock, Eye, EyeOff } from "lucide-react";
import shareoLogo from "../assets/images/Shareo.png";
import { useSignIn, useSignUp } from "@clerk/clerk-react";
import { useNavigate } from "react-router-dom";

import { createNewUser } from "../controllers/UserController";

export default function AuthPage() {
  const [currentView, setCurrentView] = useState("login");

  if (currentView === "login") {
    return <LoginForm onSwitch={() => setCurrentView("register")} />;
  }
  return <RegisterForm onSwitch={() => setCurrentView("login")} />;
}

function LoginForm({ onSwitch }) {
  const { signIn, setActive } = useSignIn();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [showPassword, setShowPassword] = useState(false);

  const navigate = useNavigate()

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const result = await signIn.create({
        identifier: email,
        password,
      });

      if (result.status === "complete") {
        // Successfully signed in
        alert("Login successful!");

        await setActive({ session: result.createdSessionId })
        // Navigate to the desired page
        navigate("/home");
      } else {
        // Handle additional sign-in factors
        console.log("Additional sign-in factors may be required");
        console.log(result);
      }
    } catch (err) {
      console.error(err);
      setError(err.errors ? err.errors[0].message : "Login failed.");
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-indigo-50 to-white px-4 py-8 sm:px-6">
      <div className="flex flex-col items-center justify-center">
        {/* Logo */}
        <div className="mb-8 text-center">
          <div className="h-16 w-32 rounded-xl flex items-center ml-4 justify-center mb-3">
            <img src={shareoLogo} alt="logo" />
          </div>
          <h2 className="text-2xl font-bold text-gray-900">Welcome back</h2>
          <p className="text-gray-500 mt-1">Sign in to your account</p>
        </div>

        <div className="w-full max-w-md bg-white rounded-2xl shadow-lg p-6 sm:p-8">
          <form className="space-y-5" onSubmit={handleSubmit}>
            {error && <div className="text-red-500 text-sm">{error}</div>}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Email/Phone Number
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <Mail size={18} className="text-gray-400" />
                </div>
                <input
                  type="text"
                  className="w-full pl-10 px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-600"
                  placeholder="Enter your email or phone"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Password
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <Lock size={18} className="text-gray-400" />
                </div>
                <input
                  type={showPassword ? "text" : "password"}
                  className="w-full pl-10 pr-10 px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-600"
                  placeholder="Enter your password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute inset-y-0 right-0 pr-3 flex items-center"
                >
                  {showPassword ? (
                    <EyeOff size={18} className="text-gray-400" />
                  ) : (
                    <Eye size={18} className="text-gray-400" />
                  )}
                </button>
              </div>
            </div>

            <div className="flex items-center justify-between">
              <div className="flex items-center">
                <input
                  id="remember-me"
                  type="checkbox"
                  className="h-4 w-4 text-indigo-600 border-gray-300 rounded"
                />
                <label
                  htmlFor="remember-me"
                  className="ml-2 block text-sm text-gray-700"
                >
                  Remember me
                </label>
              </div>
              <button className="text-sm text-indigo-600 hover:text-indigo-500">
                Forgot password?
              </button>
            </div>

            <button
              type="submit"
              className="w-full bg-indigo-600 text-white py-2.5 rounded-lg hover:bg-indigo-700 transition-colors font-medium"
            >
              Sign in
            </button>
          </form>

          <div className="mt-6">
            <div className="relative">
              <div className="absolute inset-0 flex items-center">
                <div className="w-full border-t border-gray-300"></div>
              </div>
              <div className="relative flex justify-center text-sm">
                <span className="px-2 bg-white text-gray-500">
                  Or continue with
                </span>
              </div>
            </div>

            <div className="mt-6">
              <button className="flex w-full justify-center items-center px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors">
                <img
                  className="h-5 w-5"
                  src="https://upload.wikimedia.org/wikipedia/commons/thumb/c/c1/Google_%22G%22_logo.svg/800px-Google_%22G%22_logo.svg.png"
                  alt="Google"
                />
                <span className="ml-2 text-sm font-medium text-gray-700">
                  Google
                </span>
              </button>
            </div>
          </div>

          <div className="mt-6 text-center">
            <p className="text-sm text-gray-600">
              Don't have an account?{" "}
              <button
                onClick={onSwitch}
                className="text-indigo-600 font-medium hover:text-indigo-500"
              >
                Sign up
              </button>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}

function RegisterForm({ onSwitch }) {
  const [username, setUsername] = useState("");
  const [phone, setPhone] = useState("");
  const [error, setError] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const { isLoaded, signUp, setActive } = useSignUp();
  const [email, setEmail] = useState('');
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [password, setPassword] = useState('');
  const [pendingVerification, setPendingVerification] = useState(false);
  const [code, setCode] = useState('');
  const router = useNavigate()

  // Form Submit
  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!isLoaded) {
      return;
    }

    try {
      const signUpResponse = await signUp.create({
        first_name: firstName,
        last_name: lastName,
        email_address: email,
        password,
      });

      // send the email.
      await signUp.prepareEmailAddressVerification({ strategy: 'email_code' });

      // change the UI to our pending section.
      setPendingVerification(true);
    } catch (err) {
      console.error(err);
    }
  };

  // Verify User Email Code
  const onPressVerify = async (e) => {
    e.preventDefault();
    if (!isLoaded) {
      return;
    }

    try {
      const completeSignUp = await signUp.attemptEmailAddressVerification({
        code,
      });
      if (completeSignUp.status !== 'complete') {
        /*  investigate the response, to see if there was an error
         or if the user needs to complete more steps.*/
        console.log(JSON.stringify(completeSignUp, null, 2));
      }
      if (completeSignUp.status === 'complete') {

        const clerkUserId = completeSignUp.createdUserId;
        console.log("Sign up response id : " + completeSignUp.id)
        console.log("clerkUserId : " + clerkUserId)
  
        // Save the user to Firebase Firestore
        const firebaseUser = {
          user_id: clerkUserId,
          firstname: firstName,
          lastname: lastName,
          username: username, // Default username from email prefix
          email,
          phone_number: phone, // Default empty phone number if not provided
          password, // Optional: You may choose not to save the raw password in Firestore
          balance: 0, // Default initial balance
        };
  
        const firebaseResponse = await createNewUser(firebaseUser);
  
        if (!firebaseResponse.success) {
          console.error("Failed to save user in Firebase:", firebaseResponse.message);
        }

        await setActive({ session: completeSignUp.createdSessionId });
        router('/home');
      }
    } catch (err) {
      console.error(JSON.stringify(err, null, 2));
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-indigo-50 to-white px-4 py-8 sm:px-6">
      <div className="flex flex-col items-center justify-center">
        {/* Logo */}
        <div className="mb-8 text-center">
          <div className="h-16 w-32 rounded-xl flex items-center ml-14 justify-center mb-3">
            <img src={shareoLogo} alt="logo" />
          </div>
          <h2 className="text-2xl font-bold text-gray-900">Create account</h2>
          <p className="text-gray-500 mt-1">
            Get started with your free account
          </p>
        </div>

        {!pendingVerification && (

          <div className="w-full max-w-md bg-white rounded-2xl shadow-lg p-6 sm:p-8">
            <form className="space-y-5" onSubmit={handleSubmit}>
              {error && <div className="text-red-500 text-sm">{error}</div>}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  First Name
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <User size={18} className="text-gray-400" />
                  </div>
                  <input
                    type="text"
                    className="w-full pl-10 px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-600"
                    placeholder="Enter your full name"
                    value={firstName}
                    onChange={(e) => setFirstName(e.target.value)}
                    required={true}
                  />
                </div>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Last Name
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <User size={18} className="text-gray-400" />
                  </div>
                  <input
                    type="text"
                    className="w-full pl-10 px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-600"
                    placeholder="Enter your full name"
                    value={lastName}
                    onChange={(e) => setLastName(e.target.value)}
                    required={true}
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Username
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <User size={18} className="text-gray-400" />
                  </div>
                  <input
                    type="text"
                    className="w-full pl-10 px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-600"
                    placeholder="Enter your username"
                    value={username}
                    onChange={(e) => setUsername(e.target.value)}
                    required={true}
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Email
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <Mail size={18} className="text-gray-400" />
                  </div>
                  <input
                    type="email"
                    className="w-full pl-10 px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-600"
                    placeholder="Enter your email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required={true}
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Phone Number
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <Phone size={18} className="text-gray-400" />
                  </div>
                  <input
                    type="tel"
                    className="w-full pl-10 px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-600"
                    placeholder="Enter your phone number"
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Password
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <Lock size={18} className="text-gray-400" />
                  </div>
                  <input
                    type={showPassword ? "text" : "password"}
                    className="w-full pl-10 pr-10 px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-600"
                    placeholder="Create a password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute inset-y-0 right-0 pr-3 flex items-center"
                  >
                    {showPassword ? (
                      <EyeOff size={18} className="text-gray-400" />
                    ) : (
                      <Eye size={18} className="text-gray-400" />
                    )}
                  </button>
                </div>
              </div>

              <div className="flex items-center">
                <input
                  id="terms"
                  type="checkbox"
                  className="h-4 w-4 text-indigo-600 border-gray-300 rounded"
                />
                <label
                  htmlFor="terms"
                  className="ml-2 block text-sm text-gray-700"
                >
                  I agree to the Terms of Service and Privacy Policy
                </label>
              </div>

              <div id="clerk-captcha"></div>

              <button
                type="submit"
                className="w-full bg-indigo-600 text-white py-2.5 rounded-lg hover:bg-indigo-700 transition-colors font-medium"
              >
                Create Account
              </button>
            </form>

            <div className="mt-6">
              <div className="relative">
                <div className="absolute inset-0 flex items-center">
                  <div className="w-full border-t border-gray-300"></div>
                </div>
                <div className="relative flex justify-center text-sm">
                  <span className="px-2 bg-white text-gray-500">
                    Or continue with
                  </span>
                </div>
              </div>

              <div className="mt-6">
                <button className="flex w-full justify-center items-center px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors">
                  <img
                    className="h-5 w-5"
                    src="https://upload.wikimedia.org/wikipedia/commons/thumb/c/c1/Google_%22G%22_logo.svg/800px-Google_%22G%22_logo.svg.png"
                    alt="Google"
                  />
                  <span className="ml-2 text-sm font-medium text-gray-700">
                    Google
                  </span>
                </button>
              </div>
            </div>

            <div className="mt-6 text-center">
              <p className="text-sm text-gray-600">
                Already have an account?{" "}
                <button
                  onClick={onSwitch}
                  className="text-indigo-600 font-medium hover:text-indigo-500"
                >
                  Sign in
                </button>
              </p>
            </div>
          </div>
        )}

        {pendingVerification && (
          <div>
            <form className='space-y-4 md:space-y-6'>
              <input
                value={code}
                className='bg-gray-50 border border-gray-300 text-gray-900 sm:text-sm rounded-lg block w-full p-2.5'
                placeholder='Enter Verification Code...'
                onChange={(e) => setCode(e.target.value)}
              />
              <button
                type='submit'
                onClick={onPressVerify}
                className='w-full text-white bg-blue-600 hover:bg-blue-700 font-medium rounded-lg text-sm px-5 py-2.5 text-center'
              >
                Verify Email
              </button>
            </form>
          </div>
        )}

      </div>
    </div>
  );
}
