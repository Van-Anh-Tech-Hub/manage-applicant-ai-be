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

export const AuthError = {
  AUTH_01: {
    message: 'Email này đã tồn tại.',
    status: RESPONSE_STATUS.BAD_REQUEST,
  },
  AUTH_02: {
    message: 'Thông tin đăng nhập không đúng.',
    status: RESPONSE_STATUS.BAD_REQUEST,
  },
  AUTH_03: {
    message: 'Phiên đăng nhập đã hết hạn.',
    status: RESPONSE_STATUS.UNAUTHORIZED,
  },
  AUTH_04: {
    message: 'Token không hợp lệ.',
    status: RESPONSE_STATUS.UNAUTHORIZED,
  },
  AUTH_05: {
    message: 'Token không hợp lệ hoặc hết hạn.',
    status: RESPONSE_STATUS.UNAUTHORIZED,
  },
  AUTH_06: {
    message: 'Đăng xuất thất bại.',
    status: RESPONSE_STATUS.BAD_REQUEST
  },
  AUTH_07: {
    message: 'Bạn chưa đăng nhập.',
    status: RESPONSE_STATUS.UNAUTHORIZED,
  },
  AUTH_08: {
    message: 'Bạn không có quyền.',
    status: RESPONSE_STATUS.UNAUTHORIZED,
  }
}

export const ValidateError = {
  VALIDATE_01: {
    message: 'Email không hợp lệ.',
    status: RESPONSE_STATUS.BAD_REQUEST,
  }
}