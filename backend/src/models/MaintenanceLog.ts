import { DataTypes, Model } from "sequelize";
import { sequelize } from "../config/db";

class MaintenanceLog extends Model {
  public id!: number;
  public asset_id!: number;
  public maintenance_date!: Date;
  public description!: string;
  public cost!: number;
  public technician!: string;
    public nextMaintenanceDate!: Date;
    public status!: string;
  public readonly createdAt!: Date;
  public readonly updatedAt!: Date;
}

MaintenanceLog.init(
  {
    id: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      primaryKey: true
    },
    asset_id: {
      type: DataTypes.INTEGER,
      allowNull: false
    },
    maintenance_date: {
      type: DataTypes.DATE
    },
    description: {
      type: DataTypes.TEXT
    },
    cost: {
      type: DataTypes.DECIMAL(10, 2)
    },
    technician: {
      type: DataTypes.STRING
    },
   nextMaintenanceDate: {
  type: DataTypes.DATE
},
status: {
  type: DataTypes.STRING
}
  },
  {
    sequelize,
    tableName: "maintenance_logs",
    timestamps: true
  }
);

export default MaintenanceLog;