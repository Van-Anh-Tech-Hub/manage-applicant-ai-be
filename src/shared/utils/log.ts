import { GraphQLError } from 'graphql';

import { T_ThrowResponseArgs } from '#shared/typescript/log.js';
import { RESPONSE_STATUS } from '#shared/constants';

export const throwResponse = ({
    message,
    status = RESPONSE_STATUS.INTERNAL_SERVER_ERROR,
    type = 'graphql',
}: T_ThrowResponseArgs) => {
    const responseMessage =
        message ?? status.MESSAGE ?? 'Internal server error';

    if (type === 'graphql') {
        throw new GraphQLError(responseMessage, {
            extensions: { code: status.CODE },
        });
    } else {
        throw new Error(responseMessage);
    }
};
