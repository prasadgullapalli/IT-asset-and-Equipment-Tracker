import { Request, Response } from "express";
import Employee from "../models/Employee";
import { asyncHandler } from "../utils/asyncHandler";

// CREATE
export const createEmployee = asyncHandler(async (req: Request, res: Response) => {
  const employee = await Employee.create(req.body);

  res.json({ success: true, data: employee });
});

// GET ALL
export const getEmployees = asyncHandler(async (req: Request, res: Response) => {
  const employees = await Employee.findAll();

  res.json({ success: true, data: employees });
});

// GET ONE
export const getEmployee = asyncHandler(async (req: Request, res: Response) => {
  const emp = await Employee.findByPk(Number(req.params.id));

  if (!emp) throw new Error("Employee not found");

  res.json({ success: true, data: emp });
});

// UPDATE
export const updateEmployee = asyncHandler(async (req: Request, res: Response) => {
  const emp = await Employee.findByPk(Number(req.params.id));

  if (!emp) throw new Error("Employee not found");

  await emp.update(req.body);

  res.json({ success: true, data: emp });
});

// DELETE
export const deleteEmployee = asyncHandler(async (req: Request, res: Response) => {
  const emp = await Employee.findByPk(Number(req.params.id));

  if (!emp) throw new Error("Employee not found");

  await emp.destroy();

  res.json({ success: true, message: "Employee deleted" });
});