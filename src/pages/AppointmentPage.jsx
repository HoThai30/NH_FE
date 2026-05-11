import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { appointmentAPI } from "../services/api";

export default function AppointmentPage() {
  const { id } = useParams();
  const navigate = useNavigate();

  const [appointment, setAppointment] = useState(null);

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const [confirming, setConfirming] = useState(false);

  useEffect(() => {
    if (id) {
      loadAppointment();
    }
  }, [id]);

  const loadAppointment = async () => {
    try {
      setLoading(true);

      const response = await appointmentAPI.getById(id);

      setAppointment(response.data);

      if (response.data.status === "CONFIRMED") {
        navigate("/appointments");
        return;
      }
    } catch (err) {
      setError("Lỗi tải cuộc hẹn");
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleConfirm = async () => {
    if (
      !window.confirm(
        "Bạn có chắc muốn xác nhận cuộc hẹn này và tạo hồ sơ khám?"
      )
    )
      return;

    setConfirming(true);

    try {
      const visitData = {
        notes: appointment.consultationNeeds || "",
        procedures: "",
      };

      await appointmentAPI.confirm(id, visitData);

      navigate("/appointments");
    } catch (err) {
      alert(
        "Lỗi: " +
          (err.response?.data ||
            "Không thể xác nhận cuộc hẹn")
      );
    } finally {
      setConfirming(false);
    }
  };

  const getStatusStyle = (status) => {
    switch (status) {
      case "PENDING":
        return "bg-yellow-500/15 text-yellow-400 border border-yellow-500/20";

      case "COMPLETED":
        return "bg-green-500/15 text-green-400 border border-green-500/20";

      case "CANCELLED":
        return "bg-red-500/15 text-red-400 border border-red-500/20";

      default:
        return "bg-white/[0.05] text-white/40 border border-white/10";
    }
  };

  if (loading) {
    return (
      <div
        className="min-h-screen flex items-center justify-center"
        style={{ backgroundColor: "#1a0000" }}
      >
        <div className="w-14 h-14 rounded-full border-2 border-yellow-400/20 border-t-yellow-400 animate-spin" />
      </div>
    );
  }

  if (error) {
    return (
      <div
        className="min-h-screen px-6 py-10"
        style={{ backgroundColor: "#1a0000" }}
      >
        <div className="max-w-[900px] mx-auto">
          <div className="rounded-3xl border border-red-500/20 bg-red-500/10 p-6 text-red-300">
            {error}
          </div>
        </div>
      </div>
    );
  }

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
              Appointment Management
            </p>

            <h1
              className="text-2xl font-black text-white"
              style={{ fontFamily: "serif" }}
            >
              Chi Tiết Cuộc Hẹn
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

        {appointment && (
          <>
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
                    Appointment Details
                  </p>

                  <h2
                    className="text-4xl md:text-5xl font-black text-white leading-tight"
                    style={{ fontFamily: "serif" }}
                  >
                    Cuộc Hẹn
                    <br />
                    #{appointment.id}
                  </h2>

                  <p className="text-white/50 text-sm leading-relaxed mt-5 max-w-xl">
                    Theo dõi thông tin bệnh nhân, bác sĩ điều trị và trạng thái
                    cuộc hẹn trong hệ thống luxury dental clinic.
                  </p>
                </div>

                {/* STATUS */}
                <div className="flex flex-col items-start lg:items-end gap-4">

                  <div
                    className={`inline-flex items-center h-11 px-5 rounded-full text-sm font-bold ${getStatusStyle(
                      appointment.status
                    )}`}
                  >
                    {appointment.status || "UNKNOWN"}
                  </div>

                  {appointment.status === "PENDING" && (
                    <button
                      onClick={handleConfirm}
                      disabled={confirming}
                      className="h-12 px-6 rounded-2xl text-sm font-bold transition hover:scale-[1.02] disabled:opacity-50"
                      style={{
                        background: "#D4A843",
                        color: "#1a0000",
                      }}
                    >
                      {confirming
                        ? "Đang xử lý..."
                        : "Xác Nhận & Tạo Hồ Sơ"}
                    </button>
                  )}
                </div>
              </div>
            </div>

            {/* INFO GRID */}
            <div className="grid lg:grid-cols-2 gap-6">

              {/* LEFT CARD */}
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

                <div className="space-y-5">

                  <div>
                    <p className="text-white/35 text-xs uppercase mb-2">
                      Bệnh nhân
                    </p>

                    <p className="text-white text-lg font-semibold">
                      {appointment.patientName ||
                        appointment.patient?.user?.name ||
                        "N/A"}
                    </p>
                  </div>

                  <div>
                    <p className="text-white/35 text-xs uppercase mb-2">
                      Số điện thoại
                    </p>

                    <p className="text-white/80">
                      {appointment.patientPhone ||
                        appointment.patient?.user?.phone ||
                        "N/A"}
                    </p>
                  </div>

                  <div className="grid grid-cols-2 gap-5">

                    <div>
                      <p className="text-white/35 text-xs uppercase mb-2">
                        Giới tính
                      </p>

                      <p className="text-white/80">
                        {appointment.patientGender || "N/A"}
                      </p>
                    </div>

                    <div>
                      <p className="text-white/35 text-xs uppercase mb-2">
                        Tuổi
                      </p>

                      <p className="text-white/80">
                        {appointment.patientAge != null
                          ? appointment.patientAge
                          : "N/A"}
                      </p>
                    </div>

                  </div>

                  <div>
                    <p className="text-white/35 text-xs uppercase mb-2">
                      Bác sĩ phụ trách
                    </p>

                    <p className="text-white/80">
                      {appointment.doctor?.user?.name ||
                        "Không chỉ định"}
                    </p>
                  </div>

                </div>
              </div>

              {/* RIGHT CARD */}
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

                  <div>
                    <p className="text-white/35 text-xs uppercase mb-2">
                      Thời gian hẹn
                    </p>

                    <p className="text-white text-lg font-semibold">
                      {appointment.startTime
                        ? new Date(
                            appointment.startTime
                          ).toLocaleString("vi-VN")
                        : "Chưa có"}
                    </p>
                  </div>

                  <div>
                    <p className="text-white/35 text-xs uppercase mb-2">
                      Lý do khám
                    </p>

                    <div className="rounded-2xl border border-white/10 bg-white/[0.03] p-4 text-white/70 leading-relaxed">
                      {appointment.consultationNeeds ||
                        "Không có"}
                    </div>
                  </div>

                  <div>
                    <p className="text-white/35 text-xs uppercase mb-2">
                      Ghi chú
                    </p>

                    <div className="rounded-2xl border border-white/10 bg-white/[0.03] p-4 text-white/70 leading-relaxed">
                      {appointment.notes || "Không có"}
                    </div>
                  </div>

                </div>
              </div>

            </div>
          </>
        )}
      </div>
    </div>
  );
}