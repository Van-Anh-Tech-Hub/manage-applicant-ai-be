import{ DataTypes, Model } from 'sequelize';

import sequelize from '#shared/database/sequelize';
import { E_Role, I_User } from './user.types';
export class User extends Model<I_User> implements I_User {
    public id!: string;
    public fullName!: string;
    public email!: string;
    public password!: string;
    public role!: E_Role;
    public isDel!: boolean
    public readonly created_at!: Date;
    public readonly updated_at!: Date;
}


User.init({
    id: {
        type: DataTypes.UUID,
        defaultValue: DataTypes.UUIDV4,
        primaryKey: true,
    },
    fullName: {
        type: DataTypes.STRING,
        allowNull: false,
    },
    email: {
        type: DataTypes.STRING,
        allowNull: false,
        unique: {
            name: 'uniqueEmail',
            msg: "Email đã tồn tại"
        },
        validate: {
            isEmail: {
                msg: "Định dạng email không đúng"
            },
        },
    },
    password: {
        type: DataTypes.STRING,
        allowNull: false,
    },
    role: {
        type: DataTypes.STRING,
        allowNull: false,
        validate: {
            isIn: {
                args: [Object.values(E_Role)],
                msg: "Role không hợp lệ"
            }
        }
    },
    isDel: {
        type: DataTypes.BOOLEAN,
    }
}, {
    sequelize,
    modelName: 'User',
    tableName: 'users',
    timestamps: true,
    underscored: true,
});


User.beforeCreate(async (record: User) => {
    if (record.isDel === undefined) {
        record.dataValues.isDel = false;
    }
});