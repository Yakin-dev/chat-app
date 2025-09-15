import { useContext, useState, useEffect } from "react";
import { ChatContext } from "./ChatContext";
import { AuthContext } from "./AuthContext";
import toast from "react-hot-toast";

export const ChatProvider = ({ children }) => {
  const [message, setMessage] = useState([]);
  const [users, setUsers] = useState([]);
  const [selectedUser, setSelectedUser] = useState(null);
  const [unseenMessage, setUnseenMessage] = useState({});

  const { socket, axios } = useContext(AuthContext);

  // Fetch all users
  const getUsers = async () => {
    try {
      const { data } = await axios.get("/api/messages/users");
      setUsers(data.users || []);
      setUnseenMessage(data.unseenMessage || {});
    } catch (error) {
      toast.error(error.message);
    }
  };

  // Fetch messages for a selected user
  const getMessage = async (userId) => {
    try {
      const { data } = await axios.get(`/api/messages/${userId}`);
      setMessage(Array.isArray(data.getMessage) ? data.getMessage : []);
    } catch (error) {
      toast.error(error.message);
    }
  };

  // Send a message
  const sendMessage = async (messageData) => {
    if (!socket || !selectedUser) {
      toast.error("Socket not connected or user not selected");
      return;
    }

    try {
      const token = localStorage.getItem("token");
      const { data } = await axios.post(
        `/api/messages/send/${selectedUser._id}`,
        messageData,
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );

      if (data.success) {
        setMessage((prev) => [...(prev || []), data.newMessage]);
      } else {
        toast.error(data.message);
      }
    } catch (error) {
      toast.error(error.message);
    }
  };

  // Subscribe to socket messages
  const subscribeMessages = () => {
    if (!socket) return;

    socket.on("newMessage", (newMessage) => {
      const senderId = newMessage.sender.toString();

      if (selectedUser && senderId === selectedUser._id.toString()) {
        // Message from currently selected user
        setMessage((prev) => [...(prev || []), newMessage]);
        axios.put(`/api/messages/mark/${newMessage._id}`);
      } else {
        // Message from other users (unseen)
        setUnseenMessage((prev) => ({
          ...prev,
          [senderId]: prev[senderId] ? prev[senderId] + 1 : 1,
        }));
      }
    });
  };

  // Unsubscribe to prevent memory leaks
  const unsubscribeMessages = () => {
    if (socket) socket.off("newMessage");
  };

  // Initialize subscription whenever socket or selectedUser changes
  useEffect(() => {
    if (!socket) return;
    subscribeMessages();
    return () => unsubscribeMessages();
  }, [socket, selectedUser]);

  const value = {
    message,
    users,
    selectedUser,
    setSelectedUser,
    getMessage,
    sendMessage,
    getUsers,
    unseenMessage,
    setUnseenMessage,
  };

  return <ChatContext.Provider value={value}>{children}</ChatContext.Provider>;
};
