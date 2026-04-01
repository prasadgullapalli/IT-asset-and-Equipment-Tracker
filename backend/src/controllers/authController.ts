import { Request, Response } from "express";
import User from "../models/User";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";

export const login = async (req: Request, res: Response) => {
  try {
    const { email, password } = req.body;

    // check user
    const user = await User.findOne({ where: { email } });
    if (!user) return res.status(400).json({ message: "User not found" });

    // check active
    if (!user.getDataValue("isActive")) {
      return res.status(403).json({ message: "Account deactivated" });
    }

    // compare password
    const isMatch = await bcrypt.compare(
      password,
      user.getDataValue("password")
    );

    if (!isMatch)
      return res.status(400).json({ message: "Invalid credentials" });

    // generate token
    const token = jwt.sign(
      {
        id: user.getDataValue("id"),
        role: user.getDataValue("role")
      },
      process.env.JWT_SECRET as string,
      {  expiresIn: process.env.JWT_EXPIRES_IN as jwt.SignOptions["expiresIn"] }
    );

    // update last login
    user.setDataValue("lastLogin", new Date());
    await user.save();

    res.json({
      message: "Login successful",
      token
    });
  } catch (error) {
    res.status(500).json({ message: "Server error", error });
  }
};

export const getMe = async (req: Request, res: Response) => {
  try {
    const userId = (req as any).user.id;
    const user = await User.findByPk(userId, {
      attributes: { exclude: ['password'] }
    });

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    res.json({
      message: "User data retrieved successfully",
      data: user
    });
  } catch (error) {
    res.status(500).json({ message: "Server error", error });
  }
};