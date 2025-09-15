import React, { useContext, useEffect, useRef, useState } from "react";
import assets from "../assets/assets";
import { FormatMessageTime } from "../lib/utils";
import { AuthContext } from "../../Context/AuthContext";
import { ChatContext } from "../../Context/ChatContext";
import toast from "react-hot-toast";

const ChatContainer = () => {
  const { message, getMessage, sendMessage, selectedUser, setSelectedUser } =
    useContext(ChatContext);
  const { authUser, onlineUser } = useContext(AuthContext);
  const [input, setInput] = useState("");

  const handleSendMessage = async (e) => {
    e.preventDefault();
    if (input.trim() === "") return null;
    await sendMessage({ text: input.trim() });
    setInput("");
  };
  const handleSendImage = async (e) => {
    const file = e.target.files[0];
    if (!file || !file.type.startsWith("image/")) {
      toast.error("select image file");
      return;
    }
    const reader = new FileReader();
    reader.onloadend = async () => {
      await sendMessage({ image: reader.result });
      e.target.value = "";
    };
    reader.readAsDataURL(file);
  };
  useEffect(() => {
    if (selectedUser) {
      getMessage(selectedUser._id);
    }
  }, [selectedUser]);

  const chatContainerRef = useRef();
  useEffect(() => {
    if (chatContainerRef.current) {
      chatContainerRef.current.scrollTop =
        chatContainerRef.current.scrollHeight;
    }
  }, [message]);
  return selectedUser ? (
    <div className="h-full overflow-y-auto flex flex-col relative backdrop-blur-lg">
      <div className="flex items-center gap-3 border-b border-stone-500 py-3 mx-4">
        <img
          src={selectedUser.profilePic || assets.avatar_icon}
          alt="user"
          className="w-13 rounded-full"
        />
        <p className="flex-1 text-lg text-white flex items-center gap-2">
          {selectedUser.fullName}
          {Array.isArray(onlineUser) &&
            onlineUser.includes(selectedUser._id) && (
              <span className="w-3 h-3 bg-green-500 rounded-full"></span>
            )}
        </p>
        <img
          onClick={() => setSelectedUser(null)}
          src={assets.arrow_icon}
          alt=""
          className="md:hidden max-w-5 "
        />
        <img
          src={assets.help_icon}
          alt="help"
          className="max-md:hidden max-w-5"
        />
      </div>
      {/** ----------------------------------chat area------------------------------------------------------------ */}
      <div
        ref={chatContainerRef}
        className="flex-1 flex flex-col overflow-y-auto p-3 pb-6"
      >
        {Array.isArray(message) &&
          message.map((msg, index) => (
            <div
              key={index}
              className={`flex items-end gap-2 ${
                msg.sender !== authUser._id ? "flex-row-reverse " : ""
              }`}
            >
              {msg.image ? (
                <img
                  src={msg.image}
                  className="max-w-[230px] border border-gray-700 rounded-lg  mb-8"
                ></img>
              ) : (
                <p
                  className={`bg-violet-500/30 break-all text-white md:text-sm font-light m-3 rounded-lg p-3 ${
                    msg.sender !== authUser._id
                      ? "rounded-br-none"
                      : "rounded-bl-none"
                  }`}
                >
                  {msg.text}
                </p>
              )}

              <div className="text-center text-xs">
                <img
                  className="w-7 rounded-full"
                  src={
                    msg.sender !== authUser._id
                      ? selectedUser.profilePic || assets.avatar_icon
                      : authUser?.profilePic || assets.avatar_icon
                  }
                  alt="user"
                />
                <p className="text-gray-600">
                  {FormatMessageTime(msg.createdAt)}
                </p>
              </div>
            </div>
          ))}
      </div>

      <div className="bottom-0 z-20 left-0 right-0 flex items-center gap-3 p-3">
        <div className="flex-1 flex items-center bg-gray-100/12 px-3 rounded-full ">
          <input
            onKeyDown={(e) => (e.key === "Enter" ? handleSendMessage(e) : null)}
            value={input}
            onChange={(e) => setInput(e.target.value)}
            type="text"
            placeholder="Send Message..."
            className="flex-1 text-sm text-white placeholder-gray-400 border-0 outline-0 rounded-lg p-3"
          />
          <input
            type="file"
            id="image"
            accept="image/png,image/jpeg"
            hidden
            onChange={handleSendImage}
          />
          <label htmlFor="image">
            <img
              src={assets.gallery_icon}
              alt="icon"
              className="w-5 cursor-pointer mr-5"
            />
          </label>
        </div>
        <img
          onClick={handleSendMessage}
          src={assets.send_button}
          alt="Search Icon"
          className="w-7 cursor-pointer"
        />
      </div>
    </div>
  ) : (
    <div className="flex flex-col items-center justify-center gap-2 text-gray-500 max-md:hidden bg-white/10">
      <img src={assets.logo_icon} alt="" className="max-w-16" />
      <p className="text-lg font-medium text-white">Chat Anytime,Anywhere</p>
    </div>
  );
};

export default ChatContainer;
