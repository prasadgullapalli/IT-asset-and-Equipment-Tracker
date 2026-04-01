import { DataTypes, Model } from "sequelize";
import { sequelize } from "../config/db";

class Asset extends Model {
  public id!: number;
  public assetTag!: string;
  public serialNumber!: string;
  public name!: string;
  public type!: string;
  public brand!: string;
  public model!: string;
  public purchaseDate!: Date;
  public warrantyDate!: Date;
  public price!: number;
  public condition!: string;
  public status!: string;
  public assignedTo!: number;
}

Asset.init(
  {
    id: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      primaryKey: true
    },
    assetTag: {
      type: DataTypes.STRING,
      unique: true
    },
    serialNumber: {
      type: DataTypes.STRING
    },
    name: {
      type: DataTypes.STRING
    },
    type: {
      type: DataTypes.ENUM("Hardware", "Software")
    },
    brand: {
      type: DataTypes.STRING
    },
    model: {
      type: DataTypes.STRING
    },
    purchaseDate: {
      type: DataTypes.DATE
    },
    warrantyDate: {
      type: DataTypes.DATE
    },
    price: {
      type: DataTypes.DECIMAL(10, 2)
    },
    condition: {
      type: DataTypes.ENUM("Good", "Needs Repair", "Retired"),
      defaultValue: "Good"
    },
    status: {
      type: DataTypes.ENUM("Available", "Assigned", "Retired"),
      defaultValue: "Available"
    },
    assignedTo: {
  type: DataTypes.INTEGER,
  allowNull: true
}
  },
  {
    sequelize,
    tableName: "assets",
    timestamps: true
  }
);

export default Asset;