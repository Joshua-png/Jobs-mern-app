import { StatusCodes } from "http-status-codes";
import { User } from "../models/UserModel.js";
import Job from "../models/JobModel.js";
import cloudinary from "cloudinary";
import { promises as fs } from "fs"; // method to remove the file

export const getCurrentUser = async (req, res) => {
  const user = await User.findOne({ _id: req.user.userId });
  const userWithPassword = user.toJSON();
  res.status(StatusCodes.OK).json({ user: userWithPassword });
};

export const getApplicationStats = async (req, res) => {
  const users = await User.countDocuments();
  const jobs = await Job.countDocuments();
  res.status(StatusCodes.OK).json({ users, jobs });
};

export const updateUser = async (req, res) => {
  // multer converts the form-data to req.body containing req.file
  // console.log(req);
  let newUser = { ...req.body };
  delete newUser.password;

  if (req.file) {
    const response = await cloudinary.v2.uploader.upload(req.file.path); // returns an object since there are some values we would want to get from the object
    console.log(response);
    await fs.unlink(req.file.path); // removes the image
    newUser.avatar = response.secure_url; // the secure url would always point to the image and this link would be used on the frontend to display the image
    newUser.avatarPublicId = response.public_id; // publicId because I dont want to keep the old images around and I would want to remove them if the user already uploaded
  }

  const updateUser = await User.findByIdAndUpdate(req.user.userId, newUser);

  // return the old instance to get access to the old public id
  if (req.file && updateUser.avatarPublicId) {
    await cloudinary.v2.uploader.destroy(updateUser.avatarPublicId);
  }

  res.status(StatusCodes.OK).json({ msg: "User updated" });
};

// When the image is uploaded, there is no reason to keep the image hence would be deleted
// Some hosting platform donot keep the image when they go to sleep hence keep the path of the image as a string
// may not be useful hence would be uploaded to cloudinary
