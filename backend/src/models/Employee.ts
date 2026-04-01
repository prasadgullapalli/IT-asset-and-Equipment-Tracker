import { DataTypes, Model } from "sequelize";
import { sequelize } from "../config/db";

class Employee extends Model {
  public id!: number;
  public name!: string;
  public email!: string;
  public department!: string;
  public mobile!: string;
}

Employee.init(
  {
    id: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      primaryKey: true
    },
    name: {
      type: DataTypes.STRING,
      allowNull: false
    },
    email: {
      type: DataTypes.STRING,
      unique: true
    },
    department: {
      type: DataTypes.STRING
    },
    mobile: {
      type: DataTypes.STRING
    }
  },
  {
    sequelize,
    tableName: "employees",
    timestamps: true
  }
);

export default Employee;