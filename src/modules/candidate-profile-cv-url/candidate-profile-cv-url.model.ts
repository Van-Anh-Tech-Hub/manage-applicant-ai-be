import{ DataTypes, Model } from 'sequelize';

import sequelize from '#shared/database/sequelize';
import { CandidateProfile } from '../candidate-profile/candidate-profile.model';
import { I_CandidateProfileCVUrl } from './candidate-profile-cv-url.types';

export class CandidateProfileCVUrl extends Model<I_CandidateProfileCVUrl> implements I_CandidateProfileCVUrl {
  public id!: string;
  public profileId!: string;
  public cvUrl!: string;
  public isDel!: boolean;
  public readonly created_at!: Date;
  public readonly updated_at!: Date;
}

CandidateProfileCVUrl.init({
  id: {
    type: DataTypes.UUID,
    defaultValue: DataTypes.UUIDV4,
    primaryKey: true,
  },
  profileId: {
    type: DataTypes.UUID,
    allowNull: false,
  },
  cvUrl: {
    type: DataTypes.STRING,
    allowNull: true,
  },
  isDel: {
    type: DataTypes.BOOLEAN
  }
}, {
  sequelize,
  modelName: 'CandidateProfileCVUrl',
  tableName: 'candidate_profile_cv_urls',
  timestamps: true,
  underscored: true,
});

CandidateProfileCVUrl.beforeCreate(async (record: CandidateProfileCVUrl) => {
  if (record.isDel === undefined) {
    record.dataValues.isDel = false;
  }
});

CandidateProfileCVUrl.belongsTo(CandidateProfile, { foreignKey: 'profileId', as: 'profile' });