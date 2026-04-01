import { Request, Response } from "express";
import User from "../models/User";
import bcrypt from "bcryptjs";

// ✅ Get all users
export const getUsers = async (req: Request, res: Response) => {
  const users = await User.findAll({
    attributes: { exclude: ["password"] }
  });

  res.json({ success: true, data: users });
};

// ✅ Create admin
export const createUser = async (req: Request, res: Response) => {
  try {
    const { name, email, password, role } = req.body;

    const hashedPassword = await bcrypt.hash(password, 10);

    const user = await User.create({
      name,
      email,
      password: hashedPassword,
      role
    });

    res.status(201).json({ success: true, data: user });
  } catch (error) {
    res.status(500).json({ message: "Error creating user", error });
  }
};

// ✅ Toggle active/inactive
export const toggleUser = async (req: Request, res: Response) => {
  const { id } = req.params;

  const user = await User.findByPk(Number(id));
  if (!user) return res.status(404).json({ message: "User not found" });

  user.setDataValue("isActive", !user.getDataValue("isActive"));
  await user.save();

  res.json({ success: true, message: "User status updated", data: user });
};

// ✅ Update user
export const updateUser = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const { name, email, role } = req.body;

    console.log("Updating user:", { id, name, email, role });

    const user = await User.findByPk(Number(id));
    if (!user) {
      console.log("User not found:", id);
      return res.status(404).json({ message: "User not found" });
    }

    // Update user fields (excluding password for security)
    user.setDataValue("name", name);
    user.setDataValue("email", email);
    user.setDataValue("role", role);
    
    await user.save();
    console.log("User updated successfully:", user.toJSON());

    res.json({ success: true, message: "User updated successfully", data: user });
  } catch (error: any) {
    console.error("Error updating user:", error);
    res.status(500).json({ message: "Error updating user", error: error.message });
  }
};
export const deleteUser = async (req: Request, res: Response) => {
  const { id } = req.params;

  const user = await User.findByPk(Number(id));
  if (!user) return res.status(404).json({ message: "User not found" });

  await user.destroy();

  res.json({ success: true, message: "User deleted" });
};