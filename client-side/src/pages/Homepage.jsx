import React, { useContext} from "react";
import ChatContainer from "../components/ChatContainer";
import RightSidebar from "../components/RightSidebar";
import Sidebar from "../components/Sidebar";

import { ChatContext } from "../../Context/ChatContext";
const Homepage = () => {
  const { selectedUser } = useContext(ChatContext);

  return (
    <div className="w-full h-screen sm:px-[15%] sm:py-[5%]">
      <div
        className={`backdrop-blur-2xl border-2 border-gray-600 rounded-2xl h-[100%] overflow-hidden relative grid grid-cols-1 ${
          selectedUser
            ? "md:grid-cols-[1fr_1.5fr_1fr] xl:grid-cols-[1fr_2fr_1fr]"
            : "md:grid-cols-2"
        }`}
      >
        <Sidebar />
        <ChatContainer />
        <RightSidebar />
      </div>
    </div>
  );
};

export default Homepage;
