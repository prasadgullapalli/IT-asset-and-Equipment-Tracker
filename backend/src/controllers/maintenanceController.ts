import { Request, Response } from "express";
import MaintenanceLog from "../models/MaintenanceLog";
import { asyncHandler } from "../utils/asyncHandler";

// ADD LOG
export const addLog = asyncHandler(async (req: Request, res: Response) => {
  const log = await MaintenanceLog.create(req.body);

  res.json({ success: true, data: log });
});

// GET LOGS
export const getLogs = asyncHandler(async (req: Request, res: Response) => {
  const logs = await MaintenanceLog.findAll({
    where: { asset_id: req.params.assetId }
  });

  // Map the data to match frontend expectations
  const formattedLogs = logs.map(log => ({
    id: log.id,
    asset_id: log.asset_id,
    date: log.maintenance_date,
    description: log.description,
    cost: parseFloat(log.cost as any),
    technician: log.technician,
    createdAt: log.createdAt
  }));

  res.json({ success: true, data: formattedLogs });
});