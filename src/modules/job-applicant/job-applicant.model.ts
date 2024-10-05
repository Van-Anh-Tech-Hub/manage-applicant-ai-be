import{ DataTypes, Model } from 'sequelize';

import sequelize from '#shared/database/sequelize';
import { User } from '#modules/user';
import { I_JobApplicant } from './job-applicant.types';
import { Job } from '#modules/job/job.model';


export class JobApplicant extends Model<I_JobApplicant> implements I_JobApplicant {
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
      fields: ['job_id', 'user_id'],
      name: 'unique_job_user',
    },
  ],
});

JobApplicant.beforeCreate(async (record: JobApplicant) => {
  if (record.isDel === undefined) {
    record.dataValues.isDel = false;
  }
});

JobApplicant.belongsTo(Job, { foreignKey: 'jobId', as: 'job' });
JobApplicant.belongsTo(User, { foreignKey: 'userId', as: 'user' });
