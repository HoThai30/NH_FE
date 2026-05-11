import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { doctorAPI } from "../services/api";

export default function DoctorCreatePage() {
  const navigate = useNavigate();

  const [loading, setLoading] = useState(false);

  const [imagePreview, setImagePreview] = useState(null);

  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    specialization: "",
    phonenumber: "",
    profilePicture: "",

    user: {
      email: "",
      passwordHash: "",
      profilePicture: "",
    },
  });

  const handleInputChange = (e) => {
    const { name, value } = e.target;

    if (name.startsWith("user.")) {
      const field = name.split(".")[1];

      setFormData({
        ...formData,
        user: {
          ...formData.user,
          [field]: value,
        },
      });
    } else {
      setFormData({
        ...formData,
        [name]: value,
      });
    }
  };

  const handleImageChange = (e) => {
    const file = e.target.files[0];

    if (file) {
      const reader = new FileReader();

      reader.onloadend = () => {
        const base64String =
          reader.result.split(",")[1];

        setImagePreview(reader.result);

        setFormData({
          ...formData,
          profilePicture: base64String,

          user: {
            ...formData.user,
            profilePicture: base64String,
          },
        });
      };

      reader.readAsDataURL(file);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    setLoading(true);

    try {
      const submitData = {
        ...formData,

        profilePicture:
          formData.profilePicture ||
          formData.user.profilePicture ||
          "",

        user: {
          ...formData.user,

          profilePicture:
            formData.user.profilePicture ||
            formData.profilePicture ||
            "",
        },
      };

      await doctorAPI.create(submitData);

      alert("Tạo bác sĩ thành công");

      navigate("/dashboard");
    } catch (err) {
      alert(
        "Lỗi: " +
          (err.response?.data?.error ||
            "Không thể tạo bác sĩ")
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div
      className="min-h-screen"
      style={{ backgroundColor: "#1a0000" }}
    >
      {/* TOPBAR */}
      <div className="border-b border-white/10">
        <div className="max-w-[1300px] mx-auto px-6 h-[78px] flex items-center justify-between">

          {/* LEFT */}
          <div>
            <p className="text-[10px] tracking-[0.25em] uppercase text-yellow-400 font-bold mb-1">
              Doctor Management
            </p>

            <h1
              className="text-2xl font-black text-white"
              style={{ fontFamily: "serif" }}
            >
              Tạo Tài Khoản Bác Sĩ
            </h1>
          </div>

          {/* RIGHT */}
          <button
            onClick={() => navigate(-1)}
            className="h-11 px-5 rounded-full border border-white/10 text-white/70 hover:text-white hover:bg-white/[0.05] transition text-sm font-medium"
          >
            ← Quay lại
          </button>
        </div>
      </div>

      {/* CONTENT */}
      <div className="max-w-[1300px] mx-auto px-6 py-8">

        {/* HERO */}
        <div
          className="relative overflow-hidden rounded-[30px] border border-white/10 p-8 mb-8"
          style={{
            background:
              "linear-gradient(135deg, rgba(255,255,255,0.05), rgba(255,255,255,0.02))",
          }}
        >
          {/* GLOW */}
          <div
            className="absolute -top-24 -right-24 w-[320px] h-[320px] rounded-full blur-3xl"
            style={{
              background: "rgba(212,168,67,0.10)",
            }}
          />

          <div className="relative z-10 flex flex-col lg:flex-row lg:items-center lg:justify-between gap-8">

            {/* LEFT */}
            <div className="max-w-2xl">
              <p className="text-[11px] uppercase tracking-[0.25em] text-yellow-400 font-bold mb-3">
                Luxury Dental Doctor System
              </p>

              <h2
                className="text-4xl md:text-5xl font-black text-white leading-tight"
                style={{ fontFamily: "serif" }}
              >
                Tạo Hồ Sơ
                <br />
                Bác Sĩ
              </h2>

              <p className="text-white/50 text-sm leading-relaxed mt-5 max-w-xl">
                Thêm bác sĩ mới vào hệ thống quản lý nha khoa cao cấp với giao diện hiện đại, trực quan và đồng bộ theo phong cách luxury dental.
              </p>
            </div>

            {/* STATS */}
            <div className="grid grid-cols-2 gap-4 min-w-[320px]">

              <div className="rounded-2xl border border-white/10 bg-white/[0.03] p-5">
                <p className="text-white/40 text-xs uppercase mb-2">
                  Status
                </p>

                <h3 className="text-2xl font-black text-green-400">
                  Ready
                </h3>
              </div>

              <div className="rounded-2xl border border-white/10 bg-white/[0.03] p-5">
                <p className="text-white/40 text-xs uppercase mb-2">
                  Role
                </p>

                <h3 className="text-2xl font-black text-yellow-400">
                  Doctor
                </h3>
              </div>

              <div className="rounded-2xl border border-white/10 bg-white/[0.03] p-5">
                <p className="text-white/40 text-xs uppercase mb-2">
                  System
                </p>

                <h3 className="text-lg font-black text-white">
                  Stable
                </h3>
              </div>

              <div className="rounded-2xl border border-white/10 bg-white/[0.03] p-5">
                <p className="text-white/40 text-xs uppercase mb-2">
                  Theme
                </p>

                <h3 className="text-lg font-black text-white">
                  Luxury
                </h3>
              </div>

            </div>
          </div>
        </div>

        {/* FORM */}
        <form onSubmit={handleSubmit}>

          <div className="grid lg:grid-cols-[380px,1fr] gap-6">

            {/* LEFT IMAGE */}
            <div
              className="rounded-[28px] border border-white/10 p-7 h-fit"
              style={{
                background:
                  "linear-gradient(180deg, rgba(255,255,255,0.04), rgba(255,255,255,0.02))",
              }}
            >
              <p className="text-[11px] uppercase tracking-[0.22em] text-yellow-400 font-bold mb-6">
                Doctor Avatar
              </p>

              <div className="flex flex-col items-center">

                {/* IMAGE */}
                <div className="w-[220px] h-[280px] rounded-[28px] overflow-hidden border border-white/10 bg-white/[0.03] flex items-center justify-center">

                  {imagePreview ? (
                    <img
                      src={imagePreview}
                      alt="Preview"
                      className="w-full h-full object-cover"
                    />
                  ) : (
                    <div className="text-center px-6">
                      <p className="text-white/25 text-sm leading-relaxed">
                        Chưa có ảnh đại diện
                      </p>
                    </div>
                  )}

                </div>

                {/* UPLOAD */}
                <div className="w-full mt-6">

                  <input
                    type="file"
                    accept="image/*"
                    onChange={handleImageChange}
                    id="doctor-photo"
                    className="hidden"
                  />

                  <label
                    htmlFor="doctor-photo"
                    className="h-12 rounded-2xl border border-white/10 bg-white/[0.03] hover:bg-white/[0.05] transition text-white text-sm font-semibold flex items-center justify-center cursor-pointer"
                  >
                    📷 Chọn Ảnh Đại Diện
                  </label>

                  <p className="text-white/25 text-xs text-center mt-3 leading-relaxed">
                    Ảnh sẽ hiển thị trên hồ sơ bác sĩ trong hệ thống.
                  </p>

                </div>

              </div>
            </div>

            {/* RIGHT FORM */}
            <div
              className="rounded-[28px] border border-white/10 p-7"
              style={{
                background:
                  "linear-gradient(180deg, rgba(255,255,255,0.04), rgba(255,255,255,0.02))",
              }}
            >
              <p className="text-[11px] uppercase tracking-[0.22em] text-yellow-400 font-bold mb-6">
                Doctor Information
              </p>

              <div className="grid md:grid-cols-2 gap-5">

                {/* FIRST NAME */}
                <div>
                  <label className="block text-white/35 text-xs uppercase tracking-[0.18em] mb-3">
                    Tên
                  </label>

                  <input
                    type="text"
                    name="firstName"
                    value={formData.firstName}
                    onChange={handleInputChange}
                    required
                    placeholder="Nhập tên"
                    className="w-full h-14 rounded-2xl border border-white/10 bg-white/[0.03] px-5 text-white placeholder:text-white/25 outline-none focus:border-yellow-400/40 transition"
                  />
                </div>

                {/* LAST NAME */}
                <div>
                  <label className="block text-white/35 text-xs uppercase tracking-[0.18em] mb-3">
                    Họ
                  </label>

                  <input
                    type="text"
                    name="lastName"
                    value={formData.lastName}
                    onChange={handleInputChange}
                    required
                    placeholder="Nhập họ"
                    className="w-full h-14 rounded-2xl border border-white/10 bg-white/[0.03] px-5 text-white placeholder:text-white/25 outline-none focus:border-yellow-400/40 transition"
                  />
                </div>

                {/* SPECIALIZATION */}
                <div>
                  <label className="block text-white/35 text-xs uppercase tracking-[0.18em] mb-3">
                    Chuyên khoa
                  </label>

                  <input
                    type="text"
                    name="specialization"
                    value={formData.specialization}
                    onChange={handleInputChange}
                    placeholder="Ví dụ: Implant, Niềng răng..."
                    className="w-full h-14 rounded-2xl border border-white/10 bg-white/[0.03] px-5 text-white placeholder:text-white/25 outline-none focus:border-yellow-400/40 transition"
                  />
                </div>

                {/* PHONE */}
                <div>
                  <label className="block text-white/35 text-xs uppercase tracking-[0.18em] mb-3">
                    Số điện thoại
                  </label>

                  <input
                    type="tel"
                    name="phonenumber"
                    value={formData.phonenumber}
                    onChange={handleInputChange}
                    placeholder="Nhập số điện thoại"
                    className="w-full h-14 rounded-2xl border border-white/10 bg-white/[0.03] px-5 text-white placeholder:text-white/25 outline-none focus:border-yellow-400/40 transition"
                  />
                </div>

                {/* EMAIL */}
                <div className="md:col-span-2">
                  <label className="block text-white/35 text-xs uppercase tracking-[0.18em] mb-3">
                    Email
                  </label>

                  <input
                    type="email"
                    name="user.email"
                    value={formData.user.email}
                    onChange={handleInputChange}
                    required
                    placeholder="doctor@email.com"
                    className="w-full h-14 rounded-2xl border border-white/10 bg-white/[0.03] px-5 text-white placeholder:text-white/25 outline-none focus:border-yellow-400/40 transition"
                  />
                </div>

                {/* PASSWORD */}
                <div className="md:col-span-2">
                  <label className="block text-white/35 text-xs uppercase tracking-[0.18em] mb-3">
                    Mật khẩu
                  </label>

                  <input
                    type="password"
                    name="user.passwordHash"
                    value={formData.user.passwordHash}
                    onChange={handleInputChange}
                    required
                    placeholder="Nhập mật khẩu"
                    className="w-full h-14 rounded-2xl border border-white/10 bg-white/[0.03] px-5 text-white placeholder:text-white/25 outline-none focus:border-yellow-400/40 transition"
                  />
                </div>

              </div>

              {/* ACTIONS */}
              <div className="flex gap-4 mt-8">

                <button
                  type="submit"
                  disabled={loading}
                  className="h-12 px-7 rounded-2xl text-sm font-bold transition hover:scale-[1.02] disabled:opacity-50"
                  style={{
                    background: "#D4A843",
                    color: "#1a0000",
                  }}
                >
                  {loading
                    ? "Đang xử lý..."
                    : "Tạo Bác Sĩ"}
                </button>

                <button
                  type="button"
                  onClick={() => navigate(-1)}
                  className="h-12 px-7 rounded-2xl border border-white/10 text-white/70 hover:text-white hover:bg-white/[0.05] transition text-sm font-semibold"
                >
                  Huỷ
                </button>

              </div>

            </div>
          </div>
        </form>
      </div>
    </div>
  );
}