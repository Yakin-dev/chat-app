import { useEffect, useState, useCallback } from "react";
import axios from "axios";
import toast from "react-hot-toast";
import { io } from "socket.io-client";
import { AuthContext } from "./AuthContext";

const backendUrl = import.meta.env.VITE_BACKEND_URL;
axios.defaults.baseURL = backendUrl;

export const AuthProvider = ({ children }) => {
  const [token, setToken] = useState(localStorage.getItem("token"));
  const [authUser, setAuthUser] = useState(null);
  const [onlineUser, setOnlineUser] = useState([]);
  const [socket, setSocket] = useState(null);

  const connectSocket = useCallback(
    (userData) => {
      if (!userData || socket?.connected) return;
      const newSocket = io(backendUrl, {
        query: { userId: userData._id },
      });
      newSocket.connect();
      setSocket(newSocket);
      newSocket.on("getOnlineUser", (userIds) => {
        setOnlineUser(userIds);
      });
    },
    [socket]
  );

  const login = async (state, credentials) => {
    try {
      const { data } = await axios.post(`/api/auth/${state}`, credentials);
      if (data.success) {
        const userWithToken = { ...data.userData, token: data.token }; // ✅ add token here
        setAuthUser(userWithToken);
        setToken(data.token);
        localStorage.setItem("token", data.token);

        // Set default header for Axios
        axios.defaults.headers.common["Authorization"] = `Bearer ${data.token}`;
        toast.success(data.message);
      } else {
        toast.error(data.message);
      }
    } catch (error) {
      toast.error(error.message);
    }
  };

  const logout = async () => {
    localStorage.removeItem("token");
    setAuthUser(null);
    setToken(null);
    setOnlineUser([]);
    axios.defaults.headers.common["Authorization"] = null;
    toast.success("Logged Out Successfully");
    socket?.disconnect();
  };

  const updateProfile = async (body) => {
    try {
      const { data } = await axios.put("/api/auth/update", body, 
      );
      console.log("API response:", data);
      if (data.success) {
        setAuthUser({ ...data.user, token: authUser.token }); // keep the token in authUser
        toast.success("Profile Updated Successfully");
      } else {
        toast.error(data.message || "Update failed");
      }
    } catch (error) {
      toast.error(error.message);
    }
  };

  useEffect(() => {
    const checkAuth = async () => {
      try {
        if(!token){
          setAuthUser(null);
          return;
        }
        const { data } = await axios.get("/api/auth/check");
        if (data.success) {
          setAuthUser(data.user);
          connectSocket(data.user);
        }
      } catch (error) {
        toast.error(error.message);
      }
    };

    if (token) {
      axios.defaults.headers.common["Authorization"] = `Bearer ${token}`;
    }else{
      setAuthUser(null)
    }
    checkAuth();
  }, [token, connectSocket]); // now includes connectSocket as a dependency

  const value = {
    axios,
    authUser,
    token,
    socket,
    onlineUser,
    login,
    logout,
    updateProfile,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};
