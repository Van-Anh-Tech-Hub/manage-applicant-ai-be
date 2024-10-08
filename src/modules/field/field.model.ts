import{ DataTypes, Model } from 'sequelize';

import sequelize from '#shared/database/sequelize';
import { I_Field } from './field.types';

export class Field extends Model<I_Field> implements I_Field {
    public id!: string;
    public name!: string;
    public isDel!: boolean
    public readonly created_at!: Date;
    public readonly updated_at!: Date;
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

Field.beforeCreate(async (record: Field) => {
    if (record.isDel === undefined) {
        record.dataValues.isDel = false;
    }
  });