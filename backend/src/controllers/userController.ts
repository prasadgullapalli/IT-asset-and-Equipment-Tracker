import { Request, Response } from "express";
import User from "../models/User";
import bcrypt from "bcryptjs";

// ✅ Get all users
export const getUsers = async (req: Request, res: Response) => {
  const users = await User.findAll({
    attributes: { exclude: ["password"] }
  });

  res.json(users);
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

    res.status(201).json(user);
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

  res.json({ message: "User status updated", user });
};

// ✅ Delete user
export const deleteUser = async (req: Request, res: Response) => {
  const { id } = req.params;

  const user = await User.findByPk(Number(id));
  if (!user) return res.status(404).json({ message: "User not found" });

  await user.destroy();

  res.json({ message: "User deleted" });
};