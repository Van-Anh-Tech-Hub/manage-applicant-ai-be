// src/modules/company/models/companyModel.ts
import{ DataTypes, Model } from 'sequelize';

import sequelize from '#shared/database/sequelize';
import { I_Company } from './company.types';
import { Field } from '#modules/field';
import { User } from '#modules/user';
export class Company extends Model<I_Company> implements I_Company {
  public id!: string;
  public userId!: string;
  public name!: string;
  public description!: string;
  public workingAddress!: string;
  public fieldId!: string;
  public employeeSize!: string;
  public isDel!: boolean;
  public readonly created_at!: Date;
  public readonly updated_at!: Date;
}


Company.init({
  id: {
    type: DataTypes.UUID,
    defaultValue: DataTypes.UUIDV4,
    primaryKey: true,
  },
  userId: {
    type: DataTypes.UUID,
    allowNull: false,
    unique: {
      name: 'U_userId_Company',
      msg: "Người dùng này đã tạo công ty"
    },
  },
  name: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  description: {
    type: DataTypes.STRING,
    allowNull: true,
  },
  workingAddress: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  fieldId: {
    type: DataTypes.UUID,
    allowNull: false,
  },
  employeeSize: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  isDel: {
    type: DataTypes.BOOLEAN,
  }
}, {
  sequelize,
  modelName: 'Company',
  tableName: 'companies',
  timestamps: true,
  underscored: true,
});


Company.beforeCreate(async (record: Company) => {
  if (record.isDel === undefined) {
      record.dataValues.isDel = false;
  }
});

Company.belongsTo(Field, { foreignKey: 'fieldId', as: 'field' });
Company.belongsTo(User, { foreignKey: 'userId', as: 'user' });