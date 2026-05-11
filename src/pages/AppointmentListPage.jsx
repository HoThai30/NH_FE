import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { appointmentAPI } from "../services/api";

export default function AppointmentListPage() {
  const navigate = useNavigate();

  const [appointments, setAppointments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const loadAppointments = async () => {
      try {
        const response = await appointmentAPI.getAll();

        setAppointments(
          response.data.filter(
            (app) => app.status !== "CONFIRMED"
          )
        );
      } catch (err) {
        setError("Không thể tải danh sách cuộc hẹn");
      } finally {
        setLoading(false);
      }
    };

    loadAppointments();
  }, []);

  const getStatusStyle = (status) => {
    switch (status) {
      case "PENDING":
        return "bg-yellow-500/15 text-yellow-400 border border-yellow-500/20";

      case "CANCELLED":
        return "bg-red-500/15 text-red-400 border border-red-500/20";

      case "COMPLETED":
        return "bg-green-500/15 text-green-400 border border-green-500/20";

      default:
        return "bg-white/[0.05] text-white/40 border border-white/10";
    }
  };

  return (
    <div
      className="min-h-screen"
      style={{ backgroundColor: "#1a0000" }}
    >
      {/* TOPBAR */}
      <div className="border-b border-white/10">
        <div className="max-w-[1400px] mx-auto px-6 h-[78px] flex items-center justify-between">

          {/* LEFT */}
          <div>
            <p className="text-[10px] tracking-[0.25em] uppercase text-yellow-400 font-bold mb-1">
              Luxury Dental System
            </p>

            <h1
              className="text-2xl font-black text-white"
              style={{ fontFamily: "serif" }}
            >
              Danh Sách Cuộc Hẹn
            </h1>
          </div>

          {/* RIGHT */}
          <button
            onClick={() => navigate("/dashboard")}
            className="h-11 px-5 rounded-full border border-white/10 text-white/70 hover:text-white hover:bg-white/[0.05] transition text-sm font-medium"
          >
            ← Quay lại
          </button>
        </div>
      </div>

      {/* CONTENT */}
      <div className="max-w-[1400px] mx-auto px-6 py-8">

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
                Appointment Management
              </p>

              <h2
                className="text-4xl md:text-5xl font-black text-white leading-tight"
                style={{ fontFamily: "serif" }}
              >
                Quản Lý
                <br />
                Cuộc Hẹn
              </h2>

              <p className="text-white/50 text-sm leading-relaxed mt-5 max-w-xl">
                Theo dõi lịch hẹn bệnh nhân, bác sĩ và trạng thái điều trị
                thông qua hệ thống luxury dental dashboard hiện đại.
              </p>
            </div>

            {/* STATS */}
            <div className="grid grid-cols-2 gap-4 min-w-[320px]">

              <div className="rounded-2xl border border-white/10 bg-white/[0.03] p-5">
                <p className="text-white/40 text-xs uppercase mb-2">
                  Tổng cuộc hẹn
                </p>

                <h3 className="text-3xl font-black text-white">
                  {appointments.length}
                </h3>
              </div>

              <div className="rounded-2xl border border-white/10 bg-white/[0.03] p-5">
                <p className="text-white/40 text-xs uppercase mb-2">
                  Đang chờ
                </p>

                <h3 className="text-3xl font-black text-yellow-400">
                  {
                    appointments.filter(
                      (a) => a.status === "PENDING"
                    ).length
                  }
                </h3>
              </div>

              <div className="rounded-2xl border border-white/10 bg-white/[0.03] p-5">
                <p className="text-white/40 text-xs uppercase mb-2">
                  Hoàn thành
                </p>

                <h3 className="text-3xl font-black text-green-400">
                  {
                    appointments.filter(
                      (a) => a.status === "COMPLETED"
                    ).length
                  }
                </h3>
              </div>

              <div className="rounded-2xl border border-white/10 bg-white/[0.03] p-5">
                <p className="text-white/40 text-xs uppercase mb-2">
                  Đã hủy
                </p>

                <h3 className="text-3xl font-black text-red-400">
                  {
                    appointments.filter(
                      (a) => a.status === "CANCELLED"
                    ).length
                  }
                </h3>
              </div>

            </div>
          </div>
        </div>

        {/* LOADING */}
        {loading && (
          <div className="py-24 flex justify-center">
            <div className="w-14 h-14 rounded-full border-2 border-yellow-400/20 border-t-yellow-400 animate-spin" />
          </div>
        )}

        {/* ERROR */}
        {error && (
          <div className="rounded-3xl border border-red-500/20 bg-red-500/10 p-6 text-red-300">
            {error}
          </div>
        )}

        {/* EMPTY */}
        {!loading && !error && appointments.length === 0 && (
          <div className="rounded-3xl border border-white/10 bg-white/[0.03] py-24 text-center">
            <p className="text-white/40">
              Chưa có cuộc hẹn nào trong hệ thống
            </p>
          </div>
        )}

        {/* TABLE */}
        {!loading && !error && appointments.length > 0 && (
          <div
            className="overflow-hidden rounded-[28px] border border-white/10"
            style={{
              background:
                "linear-gradient(180deg, rgba(255,255,255,0.04), rgba(255,255,255,0.02))",
            }}
          >
            <div className="overflow-x-auto">

              <table className="min-w-full">

                <thead className="border-b border-white/10">
                  <tr>

                    <th className="px-6 py-5 text-left text-[11px] uppercase tracking-[0.18em] text-white/40">
                      ID
                    </th>

                    <th className="px-6 py-5 text-left text-[11px] uppercase tracking-[0.18em] text-white/40">
                      Bệnh nhân
                    </th>

                    <th className="px-6 py-5 text-left text-[11px] uppercase tracking-[0.18em] text-white/40">
                      Điện thoại
                    </th>

                    <th className="px-6 py-5 text-left text-[11px] uppercase tracking-[0.18em] text-white/40">
                      Bác sĩ
                    </th>

                    <th className="px-6 py-5 text-left text-[11px] uppercase tracking-[0.18em] text-white/40">
                      Thời gian
                    </th>

                    <th className="px-6 py-5 text-left text-[11px] uppercase tracking-[0.18em] text-white/40">
                      Trạng thái
                    </th>

                    <th className="px-6 py-5 text-right text-[11px] uppercase tracking-[0.18em] text-white/40">
                      Hành động
                    </th>

                  </tr>
                </thead>

                <tbody>
                  {appointments.map((appointment, index) => (
                    <tr
                      key={appointment.id}
                      className={`border-b border-white/5 hover:bg-white/[0.03] transition ${
                        index === appointments.length - 1
                          ? "border-b-0"
                          : ""
                      }`}
                    >

                      {/* ID */}
                      <td className="px-6 py-5">
                        <p className="text-white font-semibold">
                          #{appointment.id}
                        </p>
                      </td>

                      {/* PATIENT */}
                      <td className="px-6 py-5">
                        <div>
                          <p className="text-white font-semibold">
                            {appointment.patientName ||
                              appointment.patient?.user?.name ||
                              "N/A"}
                          </p>

                          <p className="text-white/35 text-xs mt-1">
                            Patient
                          </p>
                        </div>
                      </td>

                      {/* PHONE */}
                      <td className="px-6 py-5 text-sm text-white/60">
                        {appointment.patientPhone || "N/A"}
                      </td>

                      {/* DOCTOR */}
                      <td className="px-6 py-5">
                        <p className="text-white/80">
                          {appointment.doctor?.user?.name ||
                            "Không chỉ định"}
                        </p>
                      </td>

                      {/* TIME */}
                      <td className="px-6 py-5 text-sm text-white/50">
                        {appointment.startTime
                          ? new Date(
                              appointment.startTime
                            ).toLocaleString("vi-VN")
                          : "Chưa có"}
                      </td>

                      {/* STATUS */}
                      <td className="px-6 py-5">
                        <div
                          className={`inline-flex items-center h-8 px-4 rounded-full text-xs font-bold ${getStatusStyle(
                            appointment.status
                          )}`}
                        >
                          {appointment.status || "UNKNOWN"}
                        </div>
                      </td>

                      {/* ACTION */}
                      <td className="px-6 py-5">
                        <div className="flex justify-end">
                          <button
                            onClick={() =>
                              navigate(
                                `/appointments/${appointment.id}`
                              )
                            }
                            className="h-10 px-5 rounded-xl text-sm font-bold transition hover:scale-[1.02]"
                            style={{
                              background: "#D4A843",
                              color: "#1a0000",
                            }}
                          >
                            Xem chi tiết
                          </button>
                        </div>
                      </td>

                    </tr>
                  ))}
                </tbody>

              </table>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}