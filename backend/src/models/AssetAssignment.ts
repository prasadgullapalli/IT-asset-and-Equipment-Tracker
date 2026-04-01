import { DataTypes, Model } from "sequelize";
import { sequelize } from "../config/db";

class AssetAssignment extends Model {
  public id!: number;
  public asset_id!: number;
  public employee_id!: number;
  public assignedAt!: Date;
  public returnedAt!: Date;
  public status!: string;
}

AssetAssignment.init(
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
    employee_id: {
      type: DataTypes.INTEGER,
      allowNull: false
    },
    assignedAt: {
      type: DataTypes.DATE,
      defaultValue: DataTypes.NOW
    },
    returnedAt: {
      type: DataTypes.DATE,
      allowNull: true
    },
    status: {
  type: DataTypes.STRING,
  defaultValue: "assigned"
}
  },
  {
    sequelize,
    tableName: "asset_assignments",
    timestamps: true
  }
);

export default AssetAssignment;