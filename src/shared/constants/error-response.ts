import { RESPONSE_STATUS } from "./response-status";

export const UserError = {
  USER_01: {
    status: RESPONSE_STATUS.BAD_REQUEST,
    message: 'Ngươi dùng không tồn tại',
  },
  USER_02: {
    status: RESPONSE_STATUS.BAD_REQUEST,
    message: 'Cập nhật thông tin người dùng thất bại.',
  },
};

export const ValidateError = {
  VALIDATE_01:{
    message: 'Email không hợp lệ.',
    status: RESPONSE_STATUS.BAD_REQUEST,
}
}