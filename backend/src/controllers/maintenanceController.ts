import { Request, Response } from "express";
import MaintenanceLog from "../models/MaintenanceLog";
import { asyncHandler } from "../utils/asyncHandler";
import { Op } from "sequelize";

// ADD LOG
export const addLog = asyncHandler(async (req: Request, res: Response) => {
  const { date, ...otherData } = req.body;
  const log = await MaintenanceLog.create({
    ...otherData,
    maintenance_date: date
  });

  res.json({ success: true, data: log });
});

// GET LOGS

export const getLogs = asyncHandler(async (req: Request, res: Response) => {
  const { minCost, maxCost } = req.query;

  let whereCondition: any = {
    asset_id: req.params.assetId
  };

  // 🔥 Add cost filtering
  if (minCost && maxCost) {
    whereCondition.cost = {
      [Op.between]: [parseFloat(minCost as string), parseFloat(maxCost as string)]
    };
  }

  const logs = await MaintenanceLog.findAll({
    where: whereCondition
  });

  const formattedLogs = logs.map(log => ({
    id: log.id,
    asset_id: log.asset_id,
    date: log.maintenance_date
      ? new Date(log.maintenance_date).toISOString()
      : new Date().toISOString(),
    description: log.description,
    cost: parseFloat(log.cost as any),
    technician: log.technician,
    createdAt: log.createdAt
  }));

  res.json({ success: true, data: formattedLogs });
});