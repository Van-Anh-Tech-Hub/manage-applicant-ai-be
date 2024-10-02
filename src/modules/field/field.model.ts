// src/modules/company/models/fieldModel.ts
import { DataTypes, Model, Optional } from 'sequelize';

import sequelize from '#shared/database/sequelize';
import { I_Field } from './field.types';

interface I_Field_Creation extends Optional<I_Field, 'id'> { }

export class Field extends Model<I_Field, I_Field_Creation> implements I_Field {
    public id!: string;
    public isDel!: boolean
    public name!: string;
}

Field.init({
    id: {
        type: DataTypes.UUID,
        defaultValue: DataTypes.UUIDV4,
        primaryKey: true,
    },
    name: {
        type: DataTypes.STRING,
        allowNull: false,
        unique: {
            name: 'uniqueFieldName',
            msg: "Lĩnh vực đã tồn tại"
        },
    },
    isDel: {
        type: DataTypes.BOOLEAN,
    }
}, {
    sequelize,
    modelName: 'Field',
    tableName: 'fields',
    timestamps: true,
    underscored: true,
});