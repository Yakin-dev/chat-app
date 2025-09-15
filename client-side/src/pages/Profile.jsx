import React, { useContext, useState } from "react";
import { useNavigate } from "react-router-dom";
import assets from "../assets/assets";
import { AuthContext } from "../../Context/AuthContext";

const Profile = () => {
  const { authUser, updateProfile } = useContext(AuthContext);
  const [selectedImage, setSelectedImage] = useState(null);
  const [name, setNames] = useState(authUser.fullName);
  const [bio, setBio] = useState(authUser.bio);
  const navigate = useNavigate();
  const handleSubmit = async (e) => {
    e.preventDefault();
    console.log("Submitting", { name, bio, selectedImage });

    try {
      if (!selectedImage) {
        await updateProfile({ fullName: name, bio });
        navigate("/");
      } else {
        const reader = new FileReader();
        reader.readAsDataURL(selectedImage);
        reader.onload = async () => {
          try {
            const base64Image = reader.result;
            await updateProfile({
              profilePic: base64Image,
              fullName: name,
              bio,
            });
            navigate("/");
          } catch (err) {
            console.error("Profile update failed (inside onload):", err);
          }
        };
      }
    } catch (err) {
      console.error("Profile update failed:", err);
    }
  };

  return (
    <div className="min-h-screen bg-cover bg-no-repeat flex items-center justify-center">
      <div className="w-5/6 max-w-2xl backdrop-blur-2xl max-sm:flex-col-reverse flex items-center justify-between text-gray-300  rounded-lg border-2 border-gray-600">
        <form
          onSubmit={handleSubmit}
          className="flex flex-col gap-5 p-5 flex-1"
        >
          <h3 className="text-lg ">Profile Details</h3>
          <label htmlFor="avatar" className="flex items-center gap-2">
            <input
              type="file"
              id="avatar"
              accept=".png,.jpeg,.jpg"
              hidden
              onChange={(e) => setSelectedImage(e.target.files[0])}
            />
            <img
              className={`w-12 h-12 ${selectedImage && "rounded-full"}`}
              src={
                selectedImage
                  ? URL.createObjectURL(selectedImage)
                  : assets.avatar_icon
              }
              alt=""
            />
            Upload Profile Image
          </label>
          <input
            value={name}
            type="text"
            onChange={(e) => setNames(e.target.value)}
            placeholder="FullName"
            className="border border-gray-600 p-2 text-lg rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500"
          />
          <textarea
            value={bio}
            onChange={(e) => setBio(e.target.value)}
            placeholder="provide short bio..."
            className="border border-gray-600 p-2 text-lg rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500"
          ></textarea>
          <button
            type="submit"
            className="py-2 rounded-md text-lg bg-gradient-to-b from-purple-400 to-violet-600 cursor-pointer mx-auto w-1/2"
          >
            Save
          </button>
        </form>
        <img
          className={`w-40 h-40 rounded-full object-cover mx-10 max-sm:mt-10 ${
            selectedImage && "rounded-full"
          }`}
          src={authUser?.profilePic || assets.logo_icon}
          alt=""
        />
      </div>
    </div>
  );
};

export default Profile;
