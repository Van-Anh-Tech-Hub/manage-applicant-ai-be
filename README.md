# Hướng dẫn

## Yêu cầu

- nvm (node version manager):
  - MacOS: <https://github.com/nvm-sh/nvm>
  - Windows: <https://github.com/coreybutler/nvm-windows>
- Node: 20.15.0 (nvm sẽ tự động cài đặt phiên bản này nếu chưa có)
  - MacOS: <https://nodejs.org/dist/v20.15.0/node-v20.15.0.pkg>
  - Windows: <https://nodejs.org/dist/v20.15.0/node-v20.15.0-x64.msi>
- Dùng npm, không dùng các công cụ khác để tránh xung đột

## Cài đặt

Sao chép file `.env.example` ra một file tương tự, đổi tên file thành `.env`

Chỉnh sửa một số trường `.env` cho phù hợp với môi trường máy cá nhân, có thể để như mặc định

```bash
UPLOAD_FOLDER=thư mục dùng riêng cho upload file
CORS_WHITELIST= các tên miền cho phép truy cập vào BE, viết dính liền, cách nhau bởi dấu phẩy
PORT=cổng của BE
RESTAPI_ENDPOINT=đường dẫn để truy cập rest api
DB_USER=tên người dùng đăng nhập vào database
DB_PASSWORD=mật khẩu người dùng đăng nhập vào database
DB_SERVER=host truy cập vào database
DB_DATABASE=database muốn truy cập
```

Chạy lệnh

```bash
npm i
```

<h2 style="color:red;"> Lưu ý(tạo database trong Sql Server trước)</h2>
## Chạy ở môi trường development (cần bật mongodb trước).

```bash
npm run dev
```

Khi thành công sẽ thấy terminal/console hiển thị thông báo:

```bash
🚀🚀 Connected Connected to the database successfully 🚀🚀
🚀🚀 Running RestAPI on http://localhost:8000/rest 🚀🚀
```

Nếu muốn tắt đồng bộ bảng khi thay đổi cấu trúc thì vào file server.ts thay đổi alter: true => false

```bash
  sequelize.sync({ alter: true }) => sequelize.sync({ alter: false })
```

## Tạo file migration
```bash
npx sequelize-cli migration:generate --name <Tên file>
```

## Một số quy ước

### Quy ước đặt tên

- Tên biến: `camelCase`
- Tên hàm: `camelCase`
- Tên biến parameter: `camelCase`
- Tên biến argument: `camelCase`
- Tên biến private: `_camelCase`
- Tên class: `PascalCase`
- Tên hằng số: `UPPER_CASE`
- Tên file: `kebab-case`
- Tên thư mục: `kebab-case`

### Quy ước đặt tên chung

- Tiền tố tuỳ thuộc vào từ khoá của typescript hoặc graphql
- Quy tắc: Tiền tố + tên kiểu dữ liệu (ví dụ: `interface I_User`, `interface I_Role`)

### Quy ước tiền tố typescript

- Dùng tiền tố `I_` cho interface (ví dụ: `interface I_User`)
- Dùng tiền tố `T_` cho type (ví dụ: `type T_User`)
- Dùng tiền tố `E_` cho enum (ví dụ: `enum E_User`)

### Quy ước đặt tên type graphql

- Dùng tiền tố `T_` cho type (ví dụ: `type T_User`)
- Dùng tiền tố `I_` cho input (ví dụ: `input I_Input_CreateUser`)

## Cấu trúc thư mục và ý nghĩa

```text
.
├── src
│   ├── modules
│   │   ├── [moduleName] => đặt tên dựa theo database entity và những domain liên quan đến nó
│   │   │   ├── index.ts => export tất cả các file khác vào index.ts
│   │   │   ├── moduleName.route.ts => nơi chứa các route của module
│   │   │   ├── moduleName.controller.ts => chứa logic chính, kết nối đến model
│   │   │   ├── moduleName.model.ts => cấu hình cấu trúc database
│   │   │   ├── moduleName.types.ts => chứa typescript
│   ├── shared => Các file dùng chung
│   │   ├── constants => folder chứa các hằng số dùng chung, export tất cả các file con vào index.ts
│   |   └── typescript => => folder chứa các typescript dùng chung, export tất cả các file con vào index.ts
│   │   └── utils => => folder chứa các hàm dùng chung, export tất cả các file con vào index.ts
│   ├── config.ts => định nghĩa các biến môi trường
│   └── rootRouter.ts => nơi chứa toàn bộ route của dự án
│   └── server.ts => khởi tạo server và import các file cần thiết vào server
├── .env => biến môi trường
├── .env.example => mẫu biến môi trường
├── .gitignore => cấu hình bỏ qua file/folder cho git
├── package-lock.json => cấu hình npm sau khi cài đặt
├── package.json => cấu hình npm
├── README.md => hướng dẫn
└── tsconfig.json => cấu hình typescript
```
