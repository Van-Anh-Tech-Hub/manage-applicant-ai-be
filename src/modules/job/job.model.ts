import { CreateOptions, DataTypes, Model, Optional } from 'sequelize';
import sequelize from '#shared/database/sequelize';
import { I_Job } from './job.types';
import { User } from '#modules/user';

interface I_Job_Creation extends Optional<I_Job, 'id' | 'created_at' | 'updated_at'> {}

export class Job extends Model<I_Job, I_Job_Creation> implements I_Job {
  public id!: string;
  public recruiterId!: string;
  public title!: string;
  public description!: string;
  public salary!: number;
  public position!: string;
  public readonly created_at!: Date;
  public readonly updated_at!: Date;
}

Job.init({
  id: {
    type: DataTypes.UUID,
    defaultValue: DataTypes.UUIDV4,
    primaryKey: true,
  },
  recruiterId: {
    type: DataTypes.UUID,
    allowNull: false,
  },
  title: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  description: {
    type: DataTypes.TEXT,
    allowNull: false,
  },
  salary: {
    type: DataTypes.DECIMAL(15, 2),
    allowNull: false,
  },
  position: {
    type: DataTypes.STRING,
    allowNull: false,
  },
}, {
  sequelize,
  modelName: 'Job',
  tableName: 'jobs',
  timestamps: true,
  underscored: true,
});

Job.belongsTo(User, { foreignKey: 'recruiterId', as: 'recruiter' });
