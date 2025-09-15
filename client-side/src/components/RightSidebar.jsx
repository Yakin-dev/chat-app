import { useContext, useEffect, useState } from "react";
import assets from "../assets/assets";
import { ChatContext } from "../../Context/ChatContext";
import { AuthContext } from "../../Context/AuthContext";
const RightSidebar = () => {
   const {selectedUser,message} = useContext(ChatContext);
   const {logout,onlineUsers} = useContext(AuthContext);
   const [msgImages,setMsgImages] = useState([]);


   //get images messages for selected user and mark them to their state

   useEffect(()=>{
    setMsgImages(
      message.filter((msg) => msg.image).map((msg)=>msg.image));
    
   },[message])

  return (
    selectedUser && (
      <div
        className={`bg-[#8185B2]/10 text-white w-full relative overflow-y-auto ${
          selectedUser ? "max-md:hidden" : ""
        }`}
      >
        <div className="pt-6  text-xs font-light flex flex-col items-center gap-2 mx-auto">
          <img
            src={selectedUser?.profilePic || assets.avatar_icon}
            alt=""
            className="w-20 rounded-full aspect-[1/1]"
          />
          <h1 className="text-xl font-medium flex items-center gap-2">
            {Array.isArray(onlineUsers) && onlineUsers.includes(selectedUser._id) && (
              <p className="w-2 h-2 bg-green-500 rounded-full"></p>
            )}
            {selectedUser?.fullName}
          </h1>
          <h1 className="">{selectedUser?.bio}</h1>
        </div>
        <hr className="border-[#ffffff50] my-4" />
        <div className="text-xs px-5">
          <p>Media</p>
          <div className="mt-4 grid grid-cols-2 gap-4 opacity-80">
            {msgImages.map((url, index) => (
              <div
                key={index}
                onClick={() => window.open(url)}
                className="rounded-lg cursor-pointer"
              >
                <img src={url} alt="images" className="rounded-lg" />
              </div>
            ))}
          </div>
        </div>

        <button
          onClick={() => logout()}
          className="absolute bottom-5 left-1/2 border-0 outline-0 text-sm transform -translate-1/2
    font-light bg-gradient-to-r from-purple-400 to-violet-600 py-4 px-20 rounded-full cursor-pointer"
        >
          Logout
        </button>
      </div>
    )
  );
}

export default RightSidebar