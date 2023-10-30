import mongoose, { model } from "mongoose";

const UserSchema = mongoose.Schema({
  name: String,
  lastName: {
    type: String,
    default: "lastName",
  },
  location: {
    type: String,
    default: "city",
  },
  email: String,
  password: String,
  role: {
    type: String,
    enum: ["admin", "user"],
    default: "user",
  },
  avatar: String,
  avatarPublicId: String,
});

UserSchema.methods.toJSON = function () {
  let obj = this.toObject();
  delete obj.password;
  return obj;
};

export const User = mongoose.model("User", UserSchema);

// avatarPublicId identifies the previous image that has to be removed
