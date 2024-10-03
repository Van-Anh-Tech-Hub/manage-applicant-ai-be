import { CreateOptions, DataTypes, Model, Optional } from 'sequelize';

import sequelize from '#shared/database/sequelize';
import { User } from '#modules/user';
import { E_Experience, I_CandidateProfile } from './candidate-profile.types';

interface I_CandidateProfile_Creation extends Optional<I_CandidateProfile, 'id' | 'created_at' | 'updated_at'> { }

export class CandidateProfile extends Model<I_CandidateProfile, I_CandidateProfile_Creation> implements I_CandidateProfile {
  public id!: string;
  public experience!: E_Experience;
  public userId!: string;
  public isDel!: boolean;
  public readonly created_at!: Date;
  public readonly updated_at!: Date;
}

CandidateProfile.init({
  id: {
    type: DataTypes.UUID,
    defaultValue: DataTypes.UUIDV4,
    primaryKey: true,
  },
  experience: {
    type: DataTypes.STRING,
    allowNull: false,
    validate: {
      isIn: {
        args: [Object.values(E_Experience)],
        msg: "Kinh nghiệm không hợp lệ",
      },
    },
  },
  userId: {
    type: DataTypes.UUID,
    allowNull: false,
  },
  isDel: {
    type: DataTypes.BOOLEAN 
  }
}, {
  sequelize,
  modelName: 'CandidateProfile',
  tableName: 'candidate_profiles',
  timestamps: true,
  underscored: true,
});

CandidateProfile.beforeCreate(async (record: CandidateProfile, options: CreateOptions) => {
  if (record.isDel === undefined) {
    record.dataValues.isDel = false;
  }
});

CandidateProfile.belongsTo(User, { foreignKey: 'userId', as: 'user' });
