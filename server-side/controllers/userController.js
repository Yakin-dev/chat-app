import User from "../models/user.js";
import generateToken from "../lib/utils.js";
import bcrypt from "bcryptjs";
import cloudinary from "../lib/cloudinary.js";

//Controller for user sign up
export const signUp = async (req, res) => {
  try {
    const { fullName, email, password, bio } = req.body;
    if (!fullName || !email || !password || !bio) {
      res.json({ success: false, message: "Missing User Credentials" });
    }
    const user = await User.findOne({ email });
    if (user) {
      res.json({ success: false, message: "Already Account Exist" });
    }

    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);
    const newUser = await User.create({
      fullName,
      email,
      password: hashedPassword,
      bio,
    });
    const token = generateToken(newUser._id);
    return res.json({
      success: true,
      message: "Account Created Successfully",
      token,
      userData: newUser,
    });
  } catch (error) {
    console.log(error.message);
    res.json({
      success: false,
      message: error.message,
    });
  }
};
// controller for user login
export const login = async (req, res) => {
  try {
    const { email, password } = req.body;
    const userData = await User.findOne({ email });
    const checkPassword = await bcrypt.compare(password, userData.password);
    if (checkPassword === false) {
      return res.json({ success: false, message: "Invalid Credentials" });
    }
    if (!userData) {
      return res.json({ success: false, message: "User not found" });
    }
    const token = generateToken(userData._id);
    return res.json({
      success: true,
      message: "Login Successfully",
      userData,
      token,
    });
  } catch (error) {
    console.log(error.message);
    res.json({
      success: false,
      message: error.message,
    });
  }
};
// controller for authentication checking
export const checkAuth = async (req, res) => {
  res.json({ success: true, user: req.user });
};
//controller to change profile pic
export const updateProfile = async (req, res) => {
  try {
    console.log("Fullname ", req.body.fullName);
    const { profilePic, fullName, bio } = req.body;

    const userId = req.user._id;
    console.log("user id ", req.user._id);

    const user = await User.findById(userId);
    if (!user) {
      return res.json({ message: "User not found " });
    }
    let updateUser;
    if (!profilePic) {
      updateUser = await User.findByIdAndUpdate(
        userId,
        { fullName, bio },
        { new: true }
      );
    } else {
      const upload = await cloudinary.uploader.upload(profilePic);
      // console.log("Cloudinary upload result:", upload);
      updateUser = await User.findByIdAndUpdate(
        userId,
        { profilePic: upload.secure_url,fullName,bio },
        { new: true }
      );
    }
    return res.json({ success: true, user: updateUser });
  } catch (error) {
    console.error("Cloudinary upload failed:", error.message);
    return res.json({ success: false, message: error.message });
  }
};
