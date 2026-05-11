import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { appointmentAPI } from "../services/api";
import { useAuth } from "../context/AuthContext";

export default function AppointmentCreatePage() {
  const navigate = useNavigate();
  const { user } = useAuth();

  const [loading, setLoading] = useState(false);

  const [patientInfo, setPatientInfo] = useState({
    email: "",
    name: "",
    phone: "",
  });

  const [formData, setFormData] = useState({
    patientName: "",
    patientPhone: "",
    appointmentTime: "",
    reason: "",
    notes: "",
  });

  useEffect(() => {
    if (user && user.role === "PATIENT") {
      setPatientInfo({
        email: user.email || "",
        name: user.name || "",
        phone: user.phone || "",
      });

      setFormData((prev) => ({
        ...prev,
        patientName: user.name || "",
        patientPhone: user.phone || "",
      }));
    }
  }, [user]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;

    setFormData({
      ...formData,
      [name]: value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    setLoading(true);

    try {
      const payload = {
        patientName: formData.patientName,
        patientPhone: formData.patientPhone,
        appointmentTime: formData.appointmentTime,
        consultationNeeds: formData.reason,
        notes: formData.notes,
      };

      await appointmentAPI.createAnonymous(payload);

      alert("Tạo cuộc hẹn thành công");

      navigate("/dashboard");
    } catch (err) {
      alert(
        "Lỗi: " +
          (err.response?.data ||
            "Không thể tạo cuộc hẹn")
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
        <div className="max-w-[1200px] mx-auto px-6 h-[78px] flex items-center justify-between">

          {/* LEFT */}
          <div>
            <p className="text-[10px] tracking-[0.25em] uppercase text-yellow-400 font-bold mb-1">
              Appointment Booking
            </p>

            <h1
              className="text-2xl font-black text-white"
              style={{ fontFamily: "serif" }}
            >
              Đặt Cuộc Hẹn
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
      <div className="max-w-[1200px] mx-auto px-6 py-8">

        {/* HERO */}
        <div
          className="relative overflow-hidden rounded-[28px] border border-white/10 p-8 mb-8"
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
                Luxury Dental Appointment
              </p>

              <h2
                className="text-4xl md:text-5xl font-black text-white leading-tight"
                style={{ fontFamily: "serif" }}
              >
                Tạo
                <br />
                Cuộc Hẹn
              </h2>

              <p className="text-white/50 text-sm leading-relaxed mt-5 max-w-xl">
                Đặt lịch khám nhanh chóng với hệ thống nha khoa cao cấp,
                hiện đại và đồng bộ theo phong cách luxury dental clinic.
              </p>
            </div>

            {/* QUICK INFO */}
            <div className="grid grid-cols-2 gap-4 min-w-[320px]">

              <div className="rounded-2xl border border-white/10 bg-white/[0.03] p-5">
                <p className="text-white/40 text-xs uppercase mb-2">
                  Trạng thái
                </p>

                <h3 className="text-2xl font-black text-green-400">
                  Ready
                </h3>
              </div>

              <div className="rounded-2xl border border-white/10 bg-white/[0.03] p-5">
                <p className="text-white/40 text-xs uppercase mb-2">
                  Hệ thống
                </p>

                <h3 className="text-2xl font-black text-white">
                  Stable
                </h3>
              </div>

              <div className="rounded-2xl border border-white/10 bg-white/[0.03] p-5">
                <p className="text-white/40 text-xs uppercase mb-2">
                  Loại lịch hẹn
                </p>

                <h3 className="text-lg font-black text-yellow-400">
                  Dental
                </h3>
              </div>

              <div className="rounded-2xl border border-white/10 bg-white/[0.03] p-5">
                <p className="text-white/40 text-xs uppercase mb-2">
                  User Role
                </p>

                <h3 className="text-lg font-black text-white">
                  {user?.role || "Guest"}
                </h3>
              </div>

            </div>
          </div>
        </div>

        {/* FORM */}
        <form onSubmit={handleSubmit}>

          <div className="grid lg:grid-cols-2 gap-6">

            {/* LEFT */}
            <div
              className="rounded-[28px] border border-white/10 p-7"
              style={{
                background:
                  "linear-gradient(180deg, rgba(255,255,255,0.04), rgba(255,255,255,0.02))",
              }}
            >
              <p className="text-[11px] uppercase tracking-[0.22em] text-yellow-400 font-bold mb-6">
                Patient Information
              </p>

              {user?.role === "PATIENT" ? (
                <div className="space-y-5">

                  <div className="rounded-2xl border border-white/10 bg-white/[0.03] p-5">
                    <p className="text-white/35 text-xs uppercase mb-2">
                      Họ tên bệnh nhân
                    </p>

                    <p className="text-white text-lg font-semibold">
                      {patientInfo.name}
                    </p>
                  </div>

                  <div className="rounded-2xl border border-white/10 bg-white/[0.03] p-5">
                    <p className="text-white/35 text-xs uppercase mb-2">
                      Số điện thoại
                    </p>

                    <p className="text-white/80">
                      {patientInfo.phone}
                    </p>
                  </div>

                  <div className="rounded-2xl border border-white/10 bg-white/[0.03] p-5">
                    <p className="text-white/35 text-xs uppercase mb-2">
                      Email
                    </p>

                    <p className="text-white/80">
                      {patientInfo.email}
                    </p>
                  </div>

                </div>
              ) : (
                <div className="space-y-5">

                  {/* NAME */}
                  <div>
                    <label className="block text-white/35 text-xs uppercase mb-3 tracking-[0.18em]">
                      Họ và tên
                    </label>

                    <input
                      type="text"
                      name="patientName"
                      value={formData.patientName}
                      onChange={handleInputChange}
                      placeholder="Nhập họ tên bệnh nhân"
                      required
                      className="w-full h-14 rounded-2xl border border-white/10 bg-white/[0.03] px-5 text-white placeholder:text-white/25 outline-none focus:border-yellow-400/40 transition"
                    />
                  </div>

                  {/* PHONE */}
                  <div>
                    <label className="block text-white/35 text-xs uppercase mb-3 tracking-[0.18em]">
                      Số điện thoại
                    </label>

                    <input
                      type="tel"
                      name="patientPhone"
                      value={formData.patientPhone}
                      onChange={handleInputChange}
                      placeholder="Nhập số điện thoại"
                      required
                      className="w-full h-14 rounded-2xl border border-white/10 bg-white/[0.03] px-5 text-white placeholder:text-white/25 outline-none focus:border-yellow-400/40 transition"
                    />
                  </div>

                </div>
              )}
            </div>

            {/* RIGHT */}
            <div
              className="rounded-[28px] border border-white/10 p-7"
              style={{
                background:
                  "linear-gradient(180deg, rgba(255,255,255,0.04), rgba(255,255,255,0.02))",
              }}
            >
              <p className="text-[11px] uppercase tracking-[0.22em] text-yellow-400 font-bold mb-6">
                Appointment Details
              </p>

              <div className="space-y-5">

                {/* TIME */}
                <div>
                  <label className="block text-white/35 text-xs uppercase mb-3 tracking-[0.18em]">
                    Thời gian hẹn
                  </label>

                  <input
                    type="datetime-local"
                    name="appointmentTime"
                    value={formData.appointmentTime}
                    onChange={handleInputChange}
                    required
                    className="w-full h-14 rounded-2xl border border-white/10 bg-white/[0.03] px-5 text-white outline-none focus:border-yellow-400/40 transition"
                  />
                </div>

                {/* REASON */}
                <div>
                  <label className="block text-white/35 text-xs uppercase mb-3 tracking-[0.18em]">
                    Lý do khám
                  </label>

                  <input
                    type="text"
                    name="reason"
                    value={formData.reason}
                    onChange={handleInputChange}
                    placeholder="Nhập lý do khám"
                    className="w-full h-14 rounded-2xl border border-white/10 bg-white/[0.03] px-5 text-white placeholder:text-white/25 outline-none focus:border-yellow-400/40 transition"
                  />
                </div>

                {/* NOTES */}
                <div>
                  <label className="block text-white/35 text-xs uppercase mb-3 tracking-[0.18em]">
                    Ghi chú
                  </label>

                  <textarea
                    name="notes"
                    value={formData.notes}
                    onChange={handleInputChange}
                    placeholder="Nhập ghi chú thêm"
                    rows="5"
                    className="w-full rounded-2xl border border-white/10 bg-white/[0.03] px-5 py-4 text-white placeholder:text-white/25 outline-none focus:border-yellow-400/40 transition resize-none"
                  />
                </div>

              </div>
            </div>

          </div>

          {/* ACTION */}
          <div className="mt-8 flex justify-end">
            <button
              type="submit"
              disabled={loading}
              className="h-14 px-8 rounded-2xl text-sm font-bold transition hover:scale-[1.02] disabled:opacity-50"
              style={{
                background: "#D4A843",
                color: "#1a0000",
              }}
            >
              {loading
                ? "Đang xử lý..."
                : "Đặt Cuộc Hẹn"}
            </button>
          </div>

        </form>
      </div>
    </div>
  );
}