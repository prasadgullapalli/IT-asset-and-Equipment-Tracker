import { DataTypes, Model } from "sequelize";
import { sequelize } from "../config/db"; // ✅ correct

class User extends Model {
  public id!: number;
  public name!: string;
  public email!: string;
  public password!: string;
  public role!: "admin" | "super admin";
  public isActive!: boolean;
  public lastLogin!: Date;
  public otp?: string;
public otpExpiry?: Date;
}

User.init(
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
      unique: true,
      allowNull: false,
      validate: {
        isEmail: true
      }
    },
    password: {
      type: DataTypes.STRING,
      allowNull: false
    },
    role: {
      type: DataTypes.ENUM("admin", "superadmin"),
      defaultValue: "admin"
    },
    isActive: {
      type: DataTypes.BOOLEAN,
      defaultValue: true
    },
    lastLogin: {
      type: DataTypes.DATE
    },
    otp: {
  type: DataTypes.STRING,
  allowNull: true
},
otpExpiry: {
  type: DataTypes.DATE,
  allowNull: true
}
  },
  {
    sequelize,
    tableName: "users",
    timestamps: true
  }
);

export default User;