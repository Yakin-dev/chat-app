import {Routes,Route, Navigate} from "react-router-dom"
import Homepage from "./pages/Homepage"
import Login from "./pages/Login"
import Profile from "./pages/Profile"
import {Toaster} from "react-hot-toast";
import { useContext } from "react";
import { AuthContext } from "../Context/AuthContext";
const App = () => {
  const {authUser} = useContext(AuthContext);
  return (
    <div className="bg-[url('/bgImage.svg')] bg-contain ">
      <Toaster />
      <Routes>
        <Route
          path="/"
          element={authUser ? <Homepage /> : <Navigate to="/login" />}
        />
        <Route
          path="/login"
          element={!authUser ? <Login /> : <Navigate to="/" />}
        />
        <Route
          path="/profile"
          element={authUser ? <Profile /> : <Navigate to="/login" />}
        />
      </Routes>
    </div>
  );
}

export default App