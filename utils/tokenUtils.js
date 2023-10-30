import jwt from "jsonwebtoken";

export const creatJWT = (payload) => {
  const token = jwt.sign(payload, process.env.JWT_SECRET, {
    expiresIn: process.env.JWT_EXPIRES_IN,
  });
  return token;
};

export const verifyJWT = (token) => {
  const data = jwt.verify(token, process.env.JWT_SECRET);
  // console.log(data);
  return data;
};
