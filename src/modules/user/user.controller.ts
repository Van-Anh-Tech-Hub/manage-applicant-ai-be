import { User } from './user.model';
import { I_Context, I_FindPaging } from '#shared/typescript';
import { paginate } from '#shared/utils/paginate';
import { throwResponse } from '#shared/utils/log';
import { UserError } from '#shared/constants/error-response';
import { I_Input_Create_User } from './user.types';

export const userCtr = {
    getUser: async (_: I_Context, { userId }: { userId: string }) => {
        const user = await User.findOne({
            where: {
                id: userId
            },
        });

        if (!user) {
            throwResponse({ ...UserError.USER_1 })
        }

        return {
            success: true,
            result: user,
        };
    },
    getUsers: async (_: I_Context, args: I_FindPaging) => {
        const { page = 1, limit = 10, isPagination = true } = args;

        let users;
        let totalDocs;
        let pagination = {};

        if (isPagination) {
            const result = await User.findAndCountAll({
                limit,
                offset: (page - 1) * limit,
            });

            users = result.rows;
            totalDocs = result.count;
            pagination = paginate(totalDocs, page, limit);
        } else {
            users = await User.findAll();
            totalDocs = users.length;
        }

        return {
            success: true,
            result: users,
            ...pagination,
        };
    },
    createUser: async (_: I_Context, { input }: { input: I_Input_Create_User }) => {
        const newUser = await User.create({
            ...input
        });

        return {
            success: true,
            result: newUser,
        };
    },
};