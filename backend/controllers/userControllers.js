import asyncHandler from "express-async-handler";
import User from "../models/userModel.js";
import Token from "../models/tokenModel.js";
import generateToken from "../utils/generateToken.js";
import sendMail from "../utils/sendMail.js";
import generateGravatar from "../utils/generateGravatar.js";
import jwt from "jsonwebtoken";

const getAllUsers = asyncHandler(async (req, res) => {
  const page = Number(req.query.pageNumber) || 1;
  const pageSize = 20;
  const count = await User.countDocuments({});

  const allUsers = await User.find({})
    .limit(pageSize)
    .skip(pageSize * (page - 1))
    .sort("-createdAt");

  res.json({
    users: allUsers,
    page,
    pages: Math.ceil(count / pageSize),
    total: count,
  });
});

const deleteUser = asyncHandler(async (req, res) => {
  const user = await User.findById(req.params.id);
  if (user) {
    await user.remove();
    res.json({
      message: "User removed from DB",
    });
  } else {
    res.status(404);
    throw new Error("User not found");
  }
});

const getUserById = asyncHandler(async (req, res) => {
  const user = await User.findById(req.params.id).select("-password");
  if (user) res.json(user);
  else {
    res.status(404);
    throw new Error("User does not exist");
  }
});

const updateUser = asyncHandler(async (req, res) => {
  const user = await User.findById(req.params.id).select("-password");
  if (user) {
    user.name = req.body.name || user.name;
    user.isConfirmed = req.body.email === user.email;
    user.email = req.body.email || user.email;
    user.isAdmin = req.body.isAdmin;
    const updatedUser = await user.save();
    if (updatedUser) {
      res.json({
        id: updatedUser._id,
        email: updatedUser.email,
        name: updatedUser.name,
        isAdmin: updatedUser.isAdmin,
        isConfirmed: updatedUser.isConfirmed,
      });
    }
  } else {
    res.status(400);
    throw new Error("User not found.");
  }
});

const authUser = asyncHandler(async (req, res) => {
  const { email, password } = req.body;

  let user = await User.findOne({ email });
  const accessToken = generateToken(user._id, "access");
  const refreshToken = generateToken(user._id, "refresh");

  if (user && (await user.matchPassword(password))) {
    const existingToken = await Token.findOne({ email });
    if (!existingToken) {
      const newToken = await Token.create({
        email,
        token: refreshToken,
      });
    } else {
      existingToken.token = refreshToken;
      existingToken.save();
    }

    res.json({
      id: user._id,
      email: user.email,
      name: user.name,
      isAdmin: user.isAdmin,
      isConfirmed: user.isConfirmed,
      avatar: user.avatar,
      accessToken,
      refreshToken,
    });
  } else {
    res.status(401);
    throw new Error(user ? "Invalid Password" : "Invalid email");
  }
});

const registerUser = asyncHandler(async (req, res) => {
  const { name, email, password, dateOfBirth } = req.body;

  const userExists = await User.findOne({ email });

  if (userExists) {
    res.status(400);
    throw new Error("Email already registered");
  }

  const avatar = generateGravatar(email);

  const user = await User.create({
    name,
    email,
    password,
    dateOfBirth,
    avatar,
  });

  if (user) {
    await sendMail(user._id, email, "email verification");

    const refreshToken = generateToken(user._id, "refresh");
    res.status(201).json({
      id: user._id,
      email: user.email,
      name: user.name,
      dateOfBirth: user.dateOfBirth,
      avatar,
      isAdmin: user.isAdmin,
      isConfirmed: user.isConfirmed,
      accessToken: generateToken(user._id, "access"),
      refreshToken,
    });
  } else {
    res.status(400);
    throw new Error("User not created");
  }
});

const mailForEmailVerification = asyncHandler(async (req, res) => {
  try {
    const { email } = req.body;

    const user = await User.findOne({ email });
    if (user) {
      if (!user.isConfirmed) {
        await sendMail(user._id, email, "email verification");
        res.status(201).json({
          id: user._id,
          email: user.email,
          name: user.name,
          isAdmin: user.isAdmin,
          avatar: user.avatar,
          isConfirmed: user.isConfirmed,
        });
      } else {
        res.status(400);
        throw new Error("User already confirmed");
      }
    }
  } catch (error) {
    console.log(error);
    res.status(401);
    throw new Error("Could not send the mail. Please retry.");
  }
});

const mailForPasswordReset = asyncHandler(async (req, res) => {
  try {
    const { email } = req.body;

    const user = await User.findOne({ email });

    if (user && user.isConfirmed) {
      await sendMail(user._id, email, "forgot password");

      res.status(201).json({
        id: user._id,
        email: user.email,
        name: user.name,
        isAdmin: user.isAdmin,
        avatar: user.avatar,
        isConfirmed: user.isConfirmed,
      });
    }
  } catch (error) {
    console.log(error);
    res.status(401);
    throw new Error("Could not send the mail. Please retry.");
  }
});

const resetUserPassword = asyncHandler(async (req, res) => {
  try {
    const { passwordToken, password } = req.body;
    const decodedToken = jwt.verify(
      passwordToken,
      process.env.JWT_FORGOT_PASSWORD_TOKEN_SECRET
    );
    const user = await User.findById(decodedToken.id);

    if (user && password) {
      user.password = password;
      const updatedUser = await user.save();

      if (updatedUser) {
        res.status(200).json({
          id: updatedUser._id,
          email: updatedUser.email,
          name: updatedUser.name,
          avatar: updatedUser.avatar,
          isAdmin: updatedUser.isAdmin,
        });
      } else {
        res.status(401);
        throw new Error("Unable to update password");
      }
    }
  } catch (error) {
    res.status(400);
    throw new Error("User not found.");
  }
});

const confirmUser = asyncHandler(async (req, res) => {
  try {
    const emailToken = req.params.token;
    const decodedToken = jwt.verify(
      emailToken,
      process.env.JWT_EMAIL_TOKEN_SECRET
    );
    const user = await User.findById(decodedToken.id).select("-password");
    user.isConfirmed = true;
    const updatedUser = await user.save();
    const foundToken = await Token.findOne({ email: updatedUser.email });
    res.json({
      id: updatedUser._id,
      email: updatedUser.email,
      name: updatedUser.name,
      isAdmin: updatedUser.isAdmin,
      avatar: updatedUser.avatar,
      isConfirmed: updatedUser.isConfirmed,
      accessToken: generateToken(user._id, "access"),
      refreshToken: foundToken,
    });
  } catch (error) {
    console.log(error);
    res.status(401);
    throw new Error("Not authorised. Token failed");
  }
});

const getAccessToken = asyncHandler(async (req, res) => {
  const refreshToken = req.body.token;
  const email = req.body.email;
  const currentAccessToken = await Token.findOne({ email });

  if (!refreshToken || refreshToken !== currentAccessToken.token) {
    res.status(400);
    throw new Error("Refresh token not found, login again");
  }

  jwt.verify(
    refreshToken,
    process.env.JWT_REFRESH_TOKEN_SECRET,
    (err, user) => {
      if (!err) {
        const accessToken = generateToken(user.id, "access");
        return res.json({ success: true, accessToken });
      } else {
        return res.json({
          success: false,
          message: "Invalid refresh token",
        });
      }
    }
  );
});

const getUserData = asyncHandler(async (req, res) => {
  const { id } = req.body;
  const user = await User.findById(id);
  if (user) {
    res.json({
      id: user._id,
      email: user.email,
      name: user.name,
      avatar: user.avatar,
      isAdmin: user.isAdmin,
      isConfirmed: user.isConfirmed,
    });
  } else {
    res.status(400);
    throw new Error("User not authorised to view this page");
  }
});

const getUserProfile = asyncHandler(async (req, res) => {
  const user = await User.findById(req.user.id);
  if (user) {
    res.json({
      id: user._id,
      email: user.email,
      avatar: user.avatar,
      name: user.name,
      isAdmin: user.isAdmin,
    });
  } else {
    res.status(400);
    throw new Error("User not authorised to view this page");
  }
});

const updateUserProfile = asyncHandler(async (req, res) => {
  const user = await User.findById(req.user.id);
  if (user) {
    user.name = req.body.name || user.name;
    user.avatar = req.body.avatar || user.avatar;
    if (req.body.email) user.isConfirmed = req.body.email === user.email;
    user.email = req.body.email || user.email;
    if (req.body.password) {
      user.password = req.body.password;
    }

    const updatedUser = await user.save();

    let updatedUserObj = {
      id: updatedUser._id,
      email: updatedUser.email,
      name: updatedUser.name,
      avatar: updatedUser.avatar,
      isAdmin: updatedUser.isAdmin,
      isConfirmed: updatedUser.isConfirmed,
    };

    if (updatedUser) {
      if (!isSocialLogin) {
        const refreshToken = generateToken(updatedUser._id, "refresh");
        const existingToken = await Token.findOne({
          email: updatedUser.email,
        });
        if (existingToken) {
          existingToken.token = refreshToken;
          existingToken.save();
        } else {
          Token.create({
            user: updatedUser._id,
            token: refreshToken,
          });
        }
        updatedUserObj = {
          ...updatedUserObj,
          accessToken: generateToken(updatedUser._id, "access"),
          refreshToken,
        };
      }
      res.json(updatedUserObj);
    }
  } else {
    res.status(400);
    throw new Error("User not found.");
  }
});

export {
  authUser,
  getUserProfile,
  getUserData,
  getAccessToken,
  registerUser,
  confirmUser,
  mailForEmailVerification,
  mailForPasswordReset,
  resetUserPassword,
  updateUserProfile,
  getAllUsers,
  deleteUser,
  getUserById,
  updateUser,
};
