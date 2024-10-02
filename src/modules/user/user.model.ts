import { CreateOptions, DataTypes, Model, Optional } from 'sequelize';

import sequelize from '#shared/database/sequelize';
import { E_Role, I_User } from './user.types';

// Khi tạo mới sẽ không bắt buộc các trường 'id' | 'created_at' | 'updated_at'
interface I_User_Creation extends Optional<I_User, 'id' | 'created_at' | 'updated_at'> { }

export class User extends Model<I_User, I_User_Creation> implements I_User {
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


User.beforeCreate(async (record: User, options: CreateOptions) => {
    if (record.isDel === undefined) {
        record.dataValues.isDel = false;
    }
});