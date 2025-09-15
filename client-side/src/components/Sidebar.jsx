import { useContext, useEffect, useState } from "react";
import assets from "../assets/assets";
import { useNavigate } from "react-router-dom";
import { AuthContext } from "../../Context/AuthContext";
import { ChatContext } from "../../Context/ChatContext";
const Sidebar = () => {
  const { logout, onlineUser } = useContext(AuthContext);
  const {
    getUsers,
    users,
    unseenMessage,
    selectedUser,
    setSelectedUser,
  } = useContext(ChatContext);
  const [input, setInput] = useState("");
  const filteredUser = input
    ? users.filter((user) =>
        user.fullName.toLowerCase().includes(input.toLowerCase())
      )
    : users;
    useEffect(()=>{
       getUsers();
    },[onlineUser])
  const navigate = useNavigate();
  return (
    
    <div
      className={`bg-[#8185B2]/10 h-full rounded-r-2xl text-white p-5 relative overflow-y-auto`}
    >
      <div className="pb-5">
        <div className="flex justify-between items-center">
          <img src={assets.logo} alt="logo" className="max-w-40" />
          <div className="relative group">
            <img src={assets.menu_icon} alt="Menu" className="max-h-5" />
            <div
              className="absolute top-full right-0  w-35 p-5 border border-gray-500
          hidden group-hover:block bg-[#212442]/10 rounded-md text-gray-100 "
            >
              <p
                onClick={() => navigate("/profile")}
                className="cursor-pointer text-sm"
              >
                Edit Profile
              </p>
              <hr className="my-2 border border-gray-600" />
              <p onClick={() => logout()} className="cursor-pointer text-sm">
                Logout
              </p>
            </div>
          </div>
        </div>
        <div className="bg-[#212442] p-2 rounded-full flex items-center gap-2 m-2">
          <img src={assets.search_icon} alt="Search" className="w-3" />
          <input
            onChange={(e) => setInput(e.target.value)}
            type="text"
            placeholder="Search Here..."
            className="flex-1 border-none outline-none bg-transparent text-white placeholder-[#c8c8c8] text-xs"
          />
        </div>
      </div>

      <div className="flex flex-col">
        {filteredUser.map((user, index) => (
          <div
            key={index}
            onClick={() => setSelectedUser(user)}
            className={`relative max-sm:text-sm  cursor-pointer rounded p-2 pl-4 flex items-center gap-2 ${
              selectedUser?._id === user._id && "bg-[#212442]/50"
            }`}
          >
            <img
              src={user?.profilePic || assets.avatar_icon}
              alt="Users"
              className="w-[35px] aspect-[1/1] rounded-full"
            />
            {console.log("user._id", user._id, "onlineUser", onlineUser)}
            <div className="flex flex-col leading-5">
              <p>{user.fullName}</p>
              {(onlineUser || []).includes(user._id) ? (
                <p className="text-green-500 text-sm">Online</p>
              ) : (
                <p className="text-neutral-500 text-sm">Offline</p>
              )}
            </div>

            {unseenMessage[user._id] > 0 && (
              <p className="bg-violet-500/50 text-xs absolute top-4 right-4  rounded-full h-5 w-5 flex justify-center items-center">
                {unseenMessage[user._id]}
              </p>
            )}
          </div>
        ))}
      </div>
    </div>
  );
};

export default Sidebar;
