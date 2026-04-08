import { Request, Response } from "express";
import User from "../models/User";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import { sendOTPEmail } from "../utils/emailService";

const generateOTP = (): string => {
  return Math.floor(100000 + Math.random() * 900000).toString();
};

export const forgotPassword = async (req: Request, res: Response) => {
  try {
    const { email } = req.body;

    const user = await User.findOne({ where: { email } });
    if (!user) return res.status(404).json({ msg: "User not found" });

    const otp = generateOTP();

    user.otp = otp;
    user.otpExpiry = new Date(Date.now() + 5 * 60 * 1000);

    await user.save();

    await sendOTPEmail(email, otp);

    res.json({ msg: "OTP sent to email" });
  } catch (error: any) {
  console.error("ERROR:", error);   // 👈 ADD THIS
  res.status(500).json({ msg: error.message });
}
};
export const resetPassword = async (req: Request, res: Response) => {
  try {
    const { email, otp, newPassword } = req.body;

    const user = await User.findOne({ where: { email } });

    if (!user || user.otp !== otp || !user.otpExpiry || user.otpExpiry < new Date()) {
      return res.status(400).json({ msg: "Invalid or expired OTP" });
    }
    
    // 🔒 Check if new password is same as old password
const isSamePassword = await bcrypt.compare(newPassword, user.password);

if (isSamePassword) {
  return res.status(400).json({
    msg: "New password cannot be same as old password"
  });
}
    const hashedPassword = await bcrypt.hash(newPassword, 10);

    user.password = hashedPassword;
    user.otp = undefined;
    user.otpExpiry = undefined;

    await user.save();

    res.json({ msg: "Password reset successful" });
  } catch (error) {
    res.status(500).json({ msg: "Server error" });
  }
};
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