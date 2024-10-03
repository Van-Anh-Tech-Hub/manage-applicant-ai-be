import { CreateOptions, DataTypes, Model, Optional } from 'sequelize';

import sequelize from '#shared/database/sequelize';
import { CandidateProfile } from '../candidate-profile/candidate-profile.model';
import { I_CandidateProfileSkill } from './candidate-profile-skill.types';


interface I_CandidateProfileSkill_Creation extends Optional<I_CandidateProfileSkill, 'id' | 'created_at' | 'updated_at'> { }

export class CandidateProfileSkill extends Model<I_CandidateProfileSkill, I_CandidateProfileSkill_Creation> implements I_CandidateProfileSkill {
  public id!: string;
  public profileId!: string;
  public skill!: string;
  public isDel!: boolean;
  public readonly created_at!: Date;
  public readonly updated_at!: Date;
}

CandidateProfileSkill.init({
  id: {
    type: DataTypes.UUID,
    defaultValue: DataTypes.UUIDV4,
    primaryKey: true,
  },
  profileId: {
    type: DataTypes.UUID,
    allowNull: false,
  },
  skill: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  isDel: {
    type: DataTypes.BOOLEAN
  }
}, {
  sequelize,
  modelName: 'CandidateProfileSkill',
  tableName: 'candidate_profile_skills',
  timestamps: true,
  underscored: true,
});

CandidateProfileSkill.beforeCreate(async (record: CandidateProfileSkill, options: CreateOptions) => {
  if (record.isDel === undefined) {
    record.dataValues.isDel = false;
  }
});

CandidateProfileSkill.belongsTo(CandidateProfile, { foreignKey: 'profileId', as: 'profile' });
