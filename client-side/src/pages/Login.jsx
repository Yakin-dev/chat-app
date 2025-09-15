import React, { useContext, useState } from "react";
import assets from "../assets/assets";
import { AuthContext } from "../../Context/AuthContext";
const Login = () => {
  const [currentState, setCurrentState] = useState("Sign Up");
  const [fullName,setFullName] = useState("");
  const [email,setEmail] = useState("");
  const [password,setPassword] = useState("");
  const [bio,setBio] = useState("");
  const [isDataSubmitted,setIsDataSubmitted] = useState(false);
  const {login} = useContext(AuthContext)
   const submitHandler = (e) => {
     e.preventDefault();
     if (currentState === "Sign Up" && !isDataSubmitted) {
       setIsDataSubmitted(true);
       return;
     }
     login(currentState === "Sign Up" ? "signup" :"login",{fullName,email,password,bio});
     
   };
   
  return (
   
    <div className="min-h-screen bg-cover bg-center backdrop-blur-2xl flex items-center justify-center gap-8 sm:justify-evenly max-sm:flex-col">
      {/**-------Left------ */}
      <img src={assets.logo_big} alt="" className="w-[min(30vw,250px)]" />
      {/**-------Right----- */}
      <form onSubmit={submitHandler} className="text-white bg-white/8 flex flex-col gap-6 border-2  border-gray-600 p-6 rounded-lg shadowlg">
        <h2 className="flex justify-between items-center font-medium text-2xl">
          {currentState}
          {isDataSubmitted && (
            <img
              onClick={()=> setIsDataSubmitted(false)}
              src={assets.arrow_icon}
              alt=""
              className="w-5 cursor-pointer"
            />
          )}
        </h2>
        {currentState === "Sign Up" && !isDataSubmitted && (
          <input
            type="text"
            onChange={(e) => setFullName(e.target.value)}
            value={fullName}
            className="border border-gray-600 p-2 rounded-md focus:outline-none text-lg"
            placeholder="FullName"
            required
          />
        )}
        {!isDataSubmitted && (
          <>
            <input
              type="text"
              onChange={(e) => setEmail(e.target.value)}
              value={email}
              className="border border-gray-600 p-2 text-lg rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500"
              placeholder="Email Address"
              required
            />
            <input
              type="password"
              onChange={(e) => setPassword(e.target.value)}
              value={password}
              className="border border-gray-600 p-2  text-lg rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500"
              placeholder="Password"
              required
            />
          </>
        )}
        {currentState === "Sign Up" && isDataSubmitted && (
          <textarea
            rows={4}
            type="text"
            onChange={(e) => setBio(e.target.value)}
            value={bio}
            className="border border-gray-600 p-2 text-lg rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500"
            placeholder="provide short bio ..."
            required
          ></textarea>
        )}
        <button className="py-2 rounded-md text-lg bg-gradient-to-b from-purple-400 to-violet-600 cursor-pointer">
          {currentState === "Sign Up" ? "Create An Account" : "Login Now"}
        </button>
        <div className="flex items-center gap-2 text-sm text-gray-500">
          <input type="checkbox" className="cursor-pointer" />
          <p>Agree to terms of use & privacy policy</p>
        </div>
        <div>
          {currentState === "Sign Up" ? (
            <p className="text-sm text-gray-600">
              Already have an account{" "}
              <span
                onClick={() => {
                  setCurrentState("Login"), setIsDataSubmitted(false);
                }}
                className="font-medium text-purple-500 cursor-pointer"
              >
                Login Here
              </span>
            </p>
          ) : (
            <p className="text-sm text-gray-600">
              Create An Account{" "}
              <span
                onClick={() => {
                  setCurrentState("Sign Up");
                }}
                className="font-medium text-purple-500 cursor-pointer"
              >
                Click Here
              </span>
            </p>
          )}
        </div>
      </form>
    </div>
  );
};

export default Login;
