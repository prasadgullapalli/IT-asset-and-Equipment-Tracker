import { Request, Response } from "express";
import AssetAssignment from "../models/AssetAssignment";
import Asset from "../models/Asset";
import { asyncHandler } from "../utils/asyncHandler";

// ASSIGN
export const assignAsset = asyncHandler(async (req: Request, res: Response) => {
  const { asset_id, employee_id } = req.body;

  await Asset.update(
    { status: "Assigned", assignedTo: employee_id },
    { where: { id: asset_id } }
  );

  const assign = await AssetAssignment.create({
    asset_id,
    employee_id,
    status: "assigned"
  });

  res.json({ success: true, data: assign });
});

// RETURN
export const returnAsset = asyncHandler(async (req: Request, res: Response) => {
  const assignment = await AssetAssignment.findByPk(Number(req.params.id));

  if (!assignment) throw new Error("Assignment not found");

  assignment.setDataValue("returnedAt", new Date());
  assignment.setDataValue("status", "returned");

  await assignment.save();

  await Asset.update(
    { status: "Available", assignedTo: null },
    { where: { id: assignment.getDataValue("asset_id") } }
  );

  res.json({ success: true, message: "Asset returned" });
});

// GET ASSIGNMENT BY ASSET ID
export const getAssignmentByAssetId = asyncHandler(async (req: Request, res: Response) => {
  const { assetId } = req.params;

  const assignment = await AssetAssignment.findOne({
    where: {
      asset_id: assetId,
      status: "assigned"
    }
  });

  if (!assignment) {
    return res.json({ success: true, data: null });
  }

  res.json({ success: true, data: assignment });
});