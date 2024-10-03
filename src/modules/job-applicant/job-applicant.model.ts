import { CreateOptions, DataTypes, Model, Optional } from 'sequelize';

import sequelize from '#shared/database/sequelize';
import { User } from '#modules/user';
import { I_JobApplicant } from './job-applicant.types';
import { Job } from '#modules/job/job.model';

interface I_JobApplicant_Creation extends Optional<I_JobApplicant, 'id' | 'created_at' | 'updated_at'> { }

export class JobApplicant extends Model<I_JobApplicant, I_JobApplicant_Creation> implements I_JobApplicant {
  public id!: string;
  public jobId!: string;
  public userId!: string;
  public cvUrl!: string;
  public isDel!: boolean;
  public readonly created_at!: Date;
  public readonly updated_at!: Date;
}

JobApplicant.init({
  id: {
    type: DataTypes.UUID,
    defaultValue: DataTypes.UUIDV4,
    primaryKey: true,
  },
  jobId: {
    type: DataTypes.UUID,
    allowNull: false,
  },
  userId: {
    type: DataTypes.UUID,
    allowNull: false,
  },
  cvUrl: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  isDel: {
    type: DataTypes.BOOLEAN,
  }
}, {
  sequelize,
  modelName: 'JobApplicant',
  tableName: 'job_applicants',
  timestamps: true,
  underscored: true,
  indexes: [
    {
      unique: true,
      fields: ['jobId', 'userId'],
      name: 'unique_job_user',
    },
  ],
});

JobApplicant.beforeCreate(async (record: JobApplicant, options: CreateOptions) => {
  if (record.isDel === undefined) {
    record.dataValues.isDel = false;
  }
});

JobApplicant.belongsTo(Job, { foreignKey: 'jobId', as: 'job' });
JobApplicant.belongsTo(User, { foreignKey: 'userId', as: 'user' });
