import React, { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { visitAPI } from "../services/api";

export default function VisitListPage() {
  const navigate = useNavigate();

  const [visits, setVisits] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const loadVisits = async () => {
      try {
        const response = await visitAPI.getAll();
        setVisits(response.data);
      } catch (err) {
        setError("Không thể tải danh sách hồ sơ khám");
      } finally {
        setLoading(false);
      }
    };

    loadVisits();
  }, []);

  const totalRevenue = visits.reduce(
    (sum, visit) => sum + (visit.cost || 0),
    0
  );

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
              Luxury Dental Records
            </p>

            <h1
              className="text-2xl font-black text-white"
              style={{ fontFamily: "serif" }}
            >
              Hồ Sơ Khám Bệnh
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
                Medical Visit Management
              </p>

              <h2
                className="text-4xl md:text-5xl font-black text-white leading-tight"
                style={{ fontFamily: "serif" }}
              >
                Danh Sách
                <br />
                Hồ Sơ Khám
              </h2>

              <p className="text-white/50 text-sm leading-relaxed mt-5 max-w-xl">
                Theo dõi lịch sử khám bệnh, chi phí điều trị và thông tin
                bệnh nhân trong hệ thống quản lý nha khoa cao cấp.
              </p>
            </div>

            {/* STATS */}
            <div className="grid grid-cols-2 gap-4 min-w-[320px]">

              <div className="rounded-2xl border border-white/10 bg-white/[0.03] p-5">
                <p className="text-white/40 text-xs uppercase mb-2">
                  Tổng hồ sơ
                </p>

                <h3 className="text-3xl font-black text-white">
                  {visits.length}
                </h3>
              </div>

              <div className="rounded-2xl border border-white/10 bg-white/[0.03] p-5">
                <p className="text-white/40 text-xs uppercase mb-2">
                  Doanh thu
                </p>

                <h3 className="text-2xl font-black text-yellow-400">
                  {totalRevenue.toLocaleString("vi-VN")}
                </h3>
              </div>

              <div className="rounded-2xl border border-white/10 bg-white/[0.03] p-5">
                <p className="text-white/40 text-xs uppercase mb-2">
                  Đã thanh toán
                </p>

                <h3 className="text-3xl font-black text-green-400">
                  {
                    visits.filter(
                      (v) => v.cost && v.cost > 0
                    ).length
                  }
                </h3>
              </div>

              <div className="rounded-2xl border border-white/10 bg-white/[0.03] p-5">
                <p className="text-white/40 text-xs uppercase mb-2">
                  Hệ thống
                </p>

                <h3 className="text-lg font-black text-white">
                  Stable
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
        {!loading && !error && visits.length === 0 && (
          <div className="rounded-3xl border border-white/10 bg-white/[0.03] py-24 text-center">
            <p className="text-white/40">
              Chưa có hồ sơ khám nào trong hệ thống
            </p>
          </div>
        )}

        {/* TABLE */}
        {!loading && !error && visits.length > 0 && (
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
                      Thời gian khám
                    </th>

                    <th className="px-6 py-5 text-left text-[11px] uppercase tracking-[0.18em] text-white/40">
                      Chi phí
                    </th>

                    <th className="px-6 py-5 text-right text-[11px] uppercase tracking-[0.18em] text-white/40">
                      Hành động
                    </th>

                  </tr>
                </thead>

                <tbody>
                  {visits.map((visit, index) => (
                    <tr
                      key={visit.id}
                      className={`border-b border-white/5 hover:bg-white/[0.03] transition ${
                        index === visits.length - 1
                          ? "border-b-0"
                          : ""
                      }`}
                    >

                      {/* ID */}
                      <td className="px-6 py-5">
                        <p className="text-white font-semibold">
                          #{visit.id}
                        </p>
                      </td>

                      {/* PATIENT */}
                      <td className="px-6 py-5">
                        <div>
                          <p className="text-white font-semibold">
                            {visit.patient?.user?.name ||
                              visit.appointment?.patientName ||
                              "N/A"}
                          </p>

                          <p className="text-white/35 text-xs mt-1">
                            Patient Record
                          </p>
                        </div>
                      </td>

                      {/* PHONE */}
                      <td className="px-6 py-5 text-sm text-white/60">
                        {visit.patient?.user?.phone ||
                          visit.appointment?.patientPhone ||
                          "N/A"}
                      </td>

                      {/* TIME */}
                      <td className="px-6 py-5 text-sm text-white/50">
                        {visit.appointment?.startTime
                          ? new Date(
                              visit.appointment.startTime
                            ).toLocaleString("vi-VN")
                          : "N/A"}
                      </td>

                      {/* COST */}
                      <td className="px-6 py-5">
                        {visit.cost ? (
                          <div className="inline-flex items-center h-9 px-4 rounded-full bg-green-500/15 border border-green-500/20 text-green-400 text-sm font-bold">
                            {visit.cost.toLocaleString("vi-VN")} VND
                          </div>
                        ) : (
                          <div className="inline-flex items-center h-9 px-4 rounded-full bg-white/[0.05] border border-white/10 text-white/40 text-sm font-medium">
                            Chưa có
                          </div>
                        )}
                      </td>

                      {/* ACTION */}
                      <td className="px-6 py-5">
                        <div className="flex justify-end">
                          <Link
                            to={`/visits/${visit.id}`}
                            className="h-10 px-5 rounded-xl text-sm font-bold flex items-center justify-center transition hover:scale-[1.02]"
                            style={{
                              background: "#D4A843",
                              color: "#1a0000",
                            }}
                          >
                            Xem Chi Tiết
                          </Link>
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