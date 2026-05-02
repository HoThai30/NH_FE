# Hệ Thống Quản Lý Bệnh Viện - Frontend (React + Vite)

## Tổng Quan

Đây là ứng dụng React frontend cho hệ thống quản lý bệnh viện, có giao diện người dùng tương ứng với tất cả các endpoint trong backend Java Spring.

## Cài Đặt & Chạy

### Prerequisites
- Node.js (v16+)
- npm hoặc yarn
- Backend Spring Boot đang chạy trên `http://localhost:8080`

### Installation
```bash
cd UImssdemo
npm install
```

### Development
```bash
npm run dev
```
Ứng dụng sẽ chạy trên `http://localhost:5173` với proxy API được cấu hình trong `vite.config.js`

### Build
```bash
npm run build
```

---

## Danh Sách Endpoints & UI Pages

### 1. **Authentication (Xác Thực)**

#### `POST /auth/login` → **Login Page** (`/login`)
**File:** `src/pages/LoginPage.jsx`

**Mô tả:** Trang đăng nhập người dùng
- Nhập email và mật khẩu
- Xác thực thông tin
- Lưu token và thông tin người dùng
- Chuyển hướng đến Dashboard

**Vai trò có quyền:** Tất cả người dùng

---

### 2. **Dashboard**

#### Dashboard Page (`/dashboard`)
**File:** `src/pages/Dashboard.jsx`

**Mô tả:** Trang chính sau khi đăng nhập
- Hiển thị menu tuỳ theo vai trò người dùng
- Điều hướng đến các chức năng khác nhau
- Hiển thị thông tin người dùng hiện tại

**Vai trò có quyền:** Tất cả người dùng đã xác thực

---

### 3. **Patient (Bệnh Nhân)**

#### `GET/PUT /patients/{id}` → **Patient Page** (`/patients/:id`)
**File:** `src/pages/PatientPage.jsx`

**Mô tả:** Xem và chỉnh sửa thông tin bệnh nhân
- Xem thông tin cá nhân (Ngày sinh, Địa chỉ, v.v.)
- Chỉnh sửa dị ứng và tiền sử bệnh
- Lưu thay đổi

**Vai trò có quyền:** PATIENT, DOCTOR, RECEPTIONIST, ADMIN

**Dữ liệu:**
- Date of Birth (DOB)
- Address
- Allergies
- Medical History

---

### 4. **Doctor (Bác Sĩ)**

#### `POST /doctors` → **Doctor Create Page** (`/doctors`)
**File:** `src/pages/DoctorCreatePage.jsx`

**Mô tả:** Tạo tài khoản bác sĩ mới
- Nhập thông tin cá nhân (Tên, Họ, Chuyên khoa)
- Nhập thông tin tài khoản (Email, Mật khẩu)
- Tạo tài khoản bác sĩ trong hệ thống

**Vai trò có quyền:** ADMIN

**Dữ liệu:**
- firstName, lastName
- specialization
- phonenumber
- user.email
- user.passwordHash (role = DOCTOR)

#### `GET /doctors/{id}` → **Doctor Page** (`/doctors/:id`)
**File:** `src/pages/DoctorPage.jsx`

**Mô tả:** Xem thông tin chi tiết của bác sĩ
- Hiển thị tên, chuyên khoa, số điện thoại
- Hiển thị email

**Vai trò có quyền:** DOCTOR, RECEPTIONIST, ADMIN

---

### 5. **Appointment (Cuộc Hẹn)**

#### `POST /appointments` → **Appointment Create Page** (`/appointments`)
**File:** `src/pages/AppointmentCreatePage.jsx`

**Mô tả:** Đặt cuộc hẹn mới
- Nhập ID bệnh nhân và ID bác sĩ
- Chọn thời gian hẹn
- Nhập lý do và ghi chú
- Tạo cuộc hẹn trong hệ thống

**Vai trò có quyền:** PATIENT, RECEPTIONIST, ADMIN

**Dữ liệu:**
- appointmentTime (ISO 8601 format)
- reason
- notes
- patient.id
- doctor.id

#### `GET /appointments/{id}` → **Appointment Page** (`/appointments/:id`)
**File:** `src/pages/AppointmentPage.jsx`

**Mô tả:** Xem chi tiết cuộc hẹn
- Hiển thị thông tin cuộc hẹn
- Hiển thị trạng thái (PENDING, CHECKED_IN, COMPLETED)
- Nút "Kiểm Tra Vào" nếu chưa check-in

**Vai trò có quyền:** PATIENT, DOCTOR, RECEPTIONIST, ADMIN

**Trạng thái:**
- PENDING
- CHECKED_IN
- COMPLETED
- CANCELLED

#### `POST /appointments/{id}/checkin` → **Appointment Check-In Page** (`/appointments/checkin`)
**File:** `src/pages/AppointmentCheckInPage.jsx`

**Mô tả:** Kiểm tra vào (check-in) cuộc hẹn
- Nhập ID cuộc hẹn
- Thực hiện check-in
- Cập nhật trạng thái từ PENDING → CHECKED_IN

**Vai trò có quyền:** RECEPTIONIST, DOCTOR, ADMIN

---

### 6. **Visit (Hồ Sơ Khám)**

#### `POST /visits` → **Visit Create Page** (`/visits`)
**File:** `src/pages/VisitCreatePage.jsx`

**Mô tả:** Tạo hồ sơ khám bệnh
- Nhập ID cuộc hẹn (phải ở trạng thái CHECKED_IN)
- Nhập chẩn đoán, phương pháp điều trị
- Thêm ghi chú
- Tạo hồ sơ khám

**Vai trò có quyền:** DOCTOR, ADMIN

**Dữ liệu:**
- appointment.id (required, must be CHECKED_IN)
- diagnosis
- treatment
- notes

#### `GET /visits/{id}` → **Visit Page** (`/visits/:id`)
**File:** `src/pages/VisitPage.jsx`

**Mô tả:** Xem chi tiết hồ sơ khám
- Hiển thị thông tin khám bệnh
- Hiển thị chẩn đoán, điều trị
- Liệt kê các tệp đính kèm với nút tải xuống

**Vai trò có quyền:** DOCTOR, ADMIN

---

### 7. **Notification (Thông Báo)**

#### `POST /notifications/send` → **Notification Send Page** (`/notifications/send`)
**File:** `src/pages/NotificationSendPage.jsx`

**Mô tả:** Gửi thông báo cho bệnh nhân
- Nhập ID cuộc hẹn
- Chọn kênh gửi (Email, SMS, Push)
- Chọn mẫu thông báo (Default, Reminder, Confirmation)
- Gửi thông báo

**Vai trò có quyền:** RECEPTIONIST, ADMIN

**Dữ liệu:**
- appointmentId (required)
- channel (email, sms, push) - default: email
- template (default, reminder, confirmation) - default: default

**Kênh gửi:**
- Email
- SMS
- Push Notification

**Mẫu:**
- Default
- Reminder
- Confirmation

---

### 8. **Attachment (Tệp Đính Kèm)**

#### `POST /attachments/upload` → **Attachment Upload Section** (`/attachments`)
**File:** `src/pages/AttachmentPage.jsx`

**Mô tả:** Tải tệp lên (hình ảnh, tài liệu, v.v.)
- Nhập ID hồ sơ khám (Visit ID)
- Chọn tệp từ máy tính
- Tải lên server
- Hiển thị URL tệp, loại, kích thước

**Vai trò có quyền:** DOCTOR, ADMIN

**Dữ liệu:**
- visitId (required)
- file (multipart/form-data)

#### `GET /attachments/{id}/download` → **Attachment Download Section** (`/attachments`)
**File:** `src/pages/AttachmentPage.jsx`

**Mô tả:** Tải tệp xuống
- Nhập ID tệp
- Tải tệp từ server
- Lưu tệp vào máy tính

**Vai trò có quyền:** PATIENT, DOCTOR, RECEPTIONIST, ADMIN

---

## Cấu Trúc Thư Mục

```
src/
├── pages/
│   ├── LoginPage.jsx              # Trang đăng nhập
│   ├── Dashboard.jsx              # Dashboard chính
│   ├── PatientPage.jsx            # Xem/chỉnh sửa bệnh nhân
│   ├── DoctorPage.jsx             # Xem bác sĩ
│   ├── DoctorCreatePage.jsx       # Tạo bác sĩ
│   ├── AppointmentCreatePage.jsx  # Đặt cuộc hẹn
│   ├── AppointmentPage.jsx        # Xem cuộc hẹn
│   ├── AppointmentCheckInPage.jsx # Check-in cuộc hẹn
│   ├── VisitCreatePage.jsx        # Tạo hồ sơ khám
│   ├── VisitPage.jsx              # Xem hồ sơ khám
│   ├── NotificationSendPage.jsx   # Gửi thông báo
│   └── AttachmentPage.jsx         # Tải tệp lên/xuống
├── components/
│   ├── Navigation.jsx             # Thanh điều hướng
│   └── PrivateRoute.jsx           # Route được bảo vệ
├── context/
│   └── AuthContext.jsx            # Quản lý xác thực
├── services/
│   └── api.js                     # Gọi API
├── App.jsx                        # Định tuyến chính
├── main.jsx                       # Điểm vào
└── style.css                      # Kiểu toàn cục
```

---

## Quản Lý Xác Thực & Vai Trò

### Vai Trò Người Dùng
- **ADMIN**: Quản trị viên - Truy cập tất cả chức năng
- **DOCTOR**: Bác sĩ - Khám bệnh, tạo hồ sơ
- **RECEPTIONIST**: Lễ tân - Đặt hẹn, check-in, gửi thông báo
- **PATIENT**: Bệnh nhân - Xem hồ sơ và hẹn khám

### AuthContext
- Quản lý token JWT
- Lưu thông tin người dùng
- Xác thực quyền truy cập

---

## Tính Năng & Luồng

### Luồng Đặt Hẹn
1. **Lễ tân** → Đặt cuộc hẹn (AppointmentCreatePage)
2. **Lễ tân** → Check-in cuộc hẹn (AppointmentCheckInPage)
3. **Lễ tân** → Gửi thông báo cho bệnh nhân (NotificationSendPage)

### Luồng Khám Bệnh
1. **Bác sĩ** → Xem cuộc hẹn (AppointmentPage)
2. **Bác sĩ** → Tạo hồ sơ khám (VisitCreatePage)
3. **Bác sĩ** → Tải tệp lên (AttachmentPage)

### Luồng Quản Lý Bệnh Nhân
1. **Bác sĩ/Lễ tân** → Xem hồ sơ bệnh nhân (PatientPage)
2. **Lễ tân** → Chỉnh sửa thông tin bệnh nhân (PatientPage)

---

## API Service Layer

**File:** `src/services/api.js`

Cung cấp các hàm gọi API cho tất cả endpoint:
```javascript
// Auth
authAPI.login(email, password)

// Patient
patientAPI.getById(id)
patientAPI.update(id, data)

// Doctor
doctorAPI.create(data)
doctorAPI.getById(id)

// Appointment
appointmentAPI.create(data)
appointmentAPI.getById(id)
appointmentAPI.checkIn(id)

// Visit
visitAPI.create(data)
visitAPI.getById(id)

// Notification
notificationAPI.send(appointmentId, channel, template)

// Attachment
attachmentAPI.upload(visitId, file)
attachmentAPI.download(id)
```

---

## Troubleshooting

### "Cannot GET /page"
- Đảm bảo bạn đang sử dụng React Router (BrowserRouter)
- Kiểm tra các route trong `App.jsx`

### API 401 Unauthorized
- Kiểm tra xem token có được lưu trong localStorage
- Đăng xuất và đăng nhập lại
- Kiểm tra backend JWT configuration

### API 403 Forbidden
- Kiểm tra vai trò người dùng
- Kiểm tra `requiredRoles` trong route

### CORS Errors
- Kiểm tra proxy configuration trong `vite.config.js`
- Kiểm tra backend CORS settings

---

**Dự án:** Hệ thống Quản Lý Bệnh Viện
**Frontend:** React + Vite
**Backend:** Java Spring Boot

