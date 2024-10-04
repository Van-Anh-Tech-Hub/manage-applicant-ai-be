import bcrypt from "bcrypt";

import { User } from "./user.model";
import {
    I_Context,
    I_FindOne,
    I_FindPaging,
    I_Return,
    T_PaginateResult,
} from "#shared/typescript";
import { convertWhereCondition, isValidEmail, paginate } from "#shared/utils";
import { throwResponse } from "#shared/utils/log";
import { UserError, ValidateError } from "#shared/constants/error-response";
import { I_Input_Create_User, I_Input_Update_User, I_User } from "./user.types";

export const userCtr = {
    getUser: async (_: I_Context, { where, orderBy }: I_FindOne) => {
        const userFound = await User.findOne({
            where,
            order: orderBy
        });

        if (!userFound) {
            throwResponse({ ...UserError.USER_01 });
        }

        return {
            success: true,
            result: userFound?.dataValues,
        };
    },
    getUsers: async (
        _: I_Context,
        { input }: { input: I_FindPaging }
    ): Promise<T_PaginateResult<I_User>> => {
        const { page = 1, pageSize = 10, isPagination = true, orderBy } = input;
        let { where } = input;
        where = convertWhereCondition(where);
        let users: User[];
        let totalDocs;
        let pagination = {};

        if (isPagination) {
            const result = await User.findAndCountAll({
                where,
                order: orderBy,
                limit: pageSize,
                offset: (page - 1) * pageSize,
            });

            users = result.rows;
            totalDocs = result.count;
            pagination = paginate(totalDocs, page, pageSize);
        } else {
            const result = await User.findAndCountAll({
                where,
                order: orderBy,
            });

            users = result.rows;
            totalDocs = result.count;
            pagination = paginate(totalDocs, page, totalDocs);
        }

        return {
            success: true,
            result: {
                docs: users.map((user) => user.dataValues),
                ...pagination,
            },
        };
    },
    createUser: async (
        _: I_Context,
        { input }: { input: I_Input_Create_User }
    ): Promise<I_Return<I_User>> => {
        const { email, password, ...rest } = input;

        if (email && !isValidEmail(email)) {
            throwResponse({ ...ValidateError.VALIDATE_01 });
        }

        const userCreated = await User.create({
            email,
            password: bcrypt.hashSync(password, 10),
            ...rest,
        });

        return {
            success: true,
            result: userCreated.dataValues,
        };
    },
    updateUser: async (
        _: I_Context,
        { id, update }: { id: string; update: I_Input_Update_User }
    ): Promise<I_Return<I_User>> => {
        const { password, ...rest } = update;

        const userFound = await User.findByPk(id);

        if (!userFound) {
            throwResponse({ ...UserError.USER_01 });
        }

        await userFound?.update({
            ...(password && { password: bcrypt.hashSync(password, 10) }),
            ...rest
        });

        return {
            success: true,
            result: userFound?.dataValues,
        };
    },
    deleteUser: async (_: I_Context, { id }: { id: string }) => {
        const userFound = await User.findByPk(id);

        if (!userFound) {
            throwResponse({ ...UserError.USER_01 });
        }

        await userFound?.destroy();

        return {
            success: true,
            result: userFound?.dataValues,
        };
    },
    softDeleteUser: async (_: I_Context, { id }: { id: string }) => {
        const userFound = await User.findByPk(id);

        if (!userFound) {
            throwResponse({ ...UserError.USER_01 });
        }

        await userFound?.update({
            isDel: true
        });

        return {
            success: true,
            result: userFound?.dataValues,
        };
    },
    restoreUser: async (_: I_Context, { id }: { id: string }) => {
        const userFound = await User.findByPk(id);

        if (!userFound) {
            throwResponse({ ...UserError.USER_01 });
        }

        await userFound?.update({
            isDel: false
        });

        return {
            success: true,
            result: userFound?.dataValues,
        };
    },
};
