import { Response } from 'express';

interface I_Data {
  success: boolean,
  message?: string,
  result?: any,
}
/**
 * Gửi phản hồi thành công.
 * @param res Đối tượng Response từ Express.
 * @param data Dữ liệu để gửi trong phản hồi.
 * @param status Mã trạng thái HTTP (mặc định là 200).
 */
export const ResponseData = (res: Response, status: number = 200, data: I_Data): void => {
  res.status(status).json(data);
};
