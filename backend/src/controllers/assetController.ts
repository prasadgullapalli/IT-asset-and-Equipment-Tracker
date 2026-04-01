import { Request, Response } from "express";
import Asset from "../models/Asset";
import { asyncHandler } from "../utils/asyncHandler";

// CREATE
export const createAsset = asyncHandler(async (req: Request, res: Response) => {
  const asset = await Asset.create(req.body);

  res.json({ success: true, data: asset });
});

// GET ALL + FILTER
export const getAssets = asyncHandler(async (req: Request, res: Response) => {
  const { type, condition } = req.query;

  const where: any = {};
  if (type) where.type = type;
  if (condition) where.condition = condition;

  const assets = await Asset.findAll({ where });

  res.json({ success: true, data: assets });
});

// GET ONE
export const getAsset = asyncHandler(async (req: Request, res: Response) => {
  const asset = await Asset.findByPk(Number(req.params.id));

  if (!asset) throw new Error("Asset not found");

  res.json({ success: true, data: asset });
});

// UPDATE
export const updateAsset = asyncHandler(async (req: Request, res: Response) => {
  const asset = await Asset.findByPk(Number(req.params.id));

  if (!asset) throw new Error("Asset not found");

  await asset.update(req.body);

  res.json({ success: true, data: asset });
});

// DELETE
export const deleteAsset = asyncHandler(async (req: Request, res: Response) => {
  const asset = await Asset.findByPk(Number(req.params.id));

  if (!asset) throw new Error("Asset not found");

  await asset.destroy();

  res.json({ success: true, message: "Asset deleted" });
});

// UPDATE CONDITION
export const updateCondition = asyncHandler(async (req: Request, res: Response) => {
  const asset = await Asset.findByPk(Number(req.params.id));

  if (!asset) throw new Error("Asset not found");

  asset.setDataValue("condition", req.body.condition);
  await asset.save();

  res.json({ success: true, data: asset });
});