import React, { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { visitAPI } from "../services/api";

export default function VisitListPage() {
  const navigate = useNavigate();

  const [visits, setVisits] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  // FILTER
  const [filterOpen, setFilterOpen] = useState(false);
  const [filterDate, setFilterDate] = useState("");
  const [filteredVisits, setFilteredVisits] = useState([]);
  const [showFilterResults, setShowFilterResults] = useState(false);

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

  // FILTER DATE
  const handleDateFilterChange = (e) => {
    setFilterDate(e.target.value);
  };

  const handleFilterSubmit = async (e) => {
    e.preventDefault();

    if (!filterDate) {
      alert("Vui lòng chọn ngày");
      return;
    }

    try {
      setLoading(true);

      const response = await visitAPI.getByDate(filterDate);

      setFilteredVisits(response.data);
      setShowFilterResults(true);
      setFilterOpen(false);
    } catch (err) {
      alert("Không thể lọc hồ sơ");
    } finally {
      setLoading(false);
    }
  };

  const handleClearFilter = () => {
    setFilterDate("");
    setFilteredVisits([]);
    setShowFilterResults(false);
  };

  // TOTAL REVENUE
  const totalRevenue = visits.reduce(
    (sum, visit) => sum + (visit.cost || 0),
    0
  );

  // DISPLAY LIST
  const displayVisits = !showFilterResults
    ? [...visits].sort((a, b) => {
        const timeA = a.appointment?.startTime
          ? new Date(a.appointment.startTime).getTime()
          : 0;

        const timeB = b.appointment?.startTime
          ? new Date(b.appointment.startTime).getTime()
          : 0;

        return timeB - timeA;
      })
    : filteredVisits;

  return (
    <div
      className="min-h-screen overflow-hidden"
      style={{ backgroundColor: "#1a0000" }}
    >
      {/* TOPBAR */}
      <div className="sticky top-0 z-50 border-b border-white/10 backdrop-blur-xl bg-[#1a0000]/90">
        <div className="w-full px-4 sm:px-6 lg:px-10 2xl:px-16">
          <div className="h-[72px] sm:h-[78px] flex items-center justify-between gap-4">

            {/* LEFT */}
            <div className="min-w-0">
              <p className="text-[9px] sm:text-[10px] tracking-[0.25em] uppercase text-yellow-400 font-bold mb-1 truncate">
                Luxury Dental Records
              </p>

              <h1
                className="text-xl sm:text-2xl lg:text-3xl font-black text-white truncate"
                style={{ fontFamily: "serif" }}
              >
                Hồ Sơ Khám Bệnh
              </h1>
            </div>

            {/* RIGHT */}
            <div className="shrink-0">
              <button
                onClick={() => navigate(-1)}
                className="h-10 sm:h-11 px-4 sm:px-5 rounded-full border border-white/10 text-white/70 hover:text-white hover:bg-white/[0.05] transition text-xs sm:text-sm font-medium"
              >
                ← Quay lại
              </button>
            </div>

          </div>
        </div>
      </div>

      {/* MAIN */}
      <div className="w-full px-4 sm:px-6 lg:px-10 2xl:px-16 py-5 sm:py-8">

        {/* HERO */}
        <div className="max-w-[1700px] mx-auto mb-6 sm:mb-8">

          <div
            className="relative overflow-hidden rounded-[24px] sm:rounded-[30px] border border-white/10 p-5 sm:p-8 lg:p-10"
            style={{
              background:
                "linear-gradient(135deg, rgba(255,255,255,0.05), rgba(255,255,255,0.02))",
            }}
          >

            {/* GLOW */}
            <div
              className="absolute -top-24 -right-24 w-[320px] h-[320px] rounded-full blur-3xl"
              style={{
                background: "rgba(212,168,67,0.12)",
              }}
            />

            <div className="relative z-10 flex flex-col xl:flex-row xl:items-center xl:justify-between gap-8">

              {/* LEFT */}
              <div className="max-w-2xl">

                <p className="text-[10px] sm:text-[11px] uppercase tracking-[0.25em] text-yellow-400 font-bold mb-3">
                  Medical Visit Management
                </p>

                <h2
                  className="text-3xl sm:text-4xl lg:text-5xl xl:text-6xl font-black text-white leading-tight"
                  style={{ fontFamily: "serif" }}
                >
                  Danh Sách
                  <br />
                  Hồ Sơ Khám
                </h2>

                <p className="text-white/50 text-sm sm:text-[15px] leading-relaxed mt-5 max-w-xl">
                  Theo dõi lịch sử khám bệnh, chi phí điều trị và thông tin
                  bệnh nhân trong hệ thống quản lý nha khoa cao cấp.
                </p>

              </div>

              {/* STATS */}
              <div className="grid grid-cols-2 gap-3 sm:gap-4 w-full xl:max-w-[430px]">

                {/* TOTAL */}
                <div className="rounded-2xl border border-white/10 bg-white/[0.03] p-4 sm:p-5 backdrop-blur-xl">
                  <p className="text-white/40 text-[10px] sm:text-xs uppercase mb-2">
                    Tổng hồ sơ
                  </p>

                  <h3 className="text-2xl sm:text-3xl font-black text-white">
                    {visits.length}
                  </h3>
                </div>

                {/* REVENUE */}
                <div className="rounded-2xl border border-white/10 bg-white/[0.03] p-4 sm:p-5 backdrop-blur-xl">
                  <p className="text-white/40 text-[10px] sm:text-xs uppercase mb-2">
                    Doanh thu
                  </p>

                  <h3 className="text-lg sm:text-2xl font-black text-yellow-400 break-words">
                    {totalRevenue.toLocaleString("vi-VN")}
                  </h3>
                </div>

                {/* PAID */}
                <div className="rounded-2xl border border-white/10 bg-white/[0.03] p-4 sm:p-5 backdrop-blur-xl">
                  <p className="text-white/40 text-[10px] sm:text-xs uppercase mb-2">
                    Đã thanh toán
                  </p>

                  <h3 className="text-2xl sm:text-3xl font-black text-green-400">
                    {
                      visits.filter(
                        (v) => v.cost && v.cost > 0
                      ).length
                    }
                  </h3>
                </div>

                {/* STATUS */}
                <div className="rounded-2xl border border-white/10 bg-white/[0.03] p-4 sm:p-5 backdrop-blur-xl">
                  <p className="text-white/40 text-[10px] sm:text-xs uppercase mb-2">
                    Hệ thống
                  </p>

                  <h3 className="text-sm sm:text-lg font-black text-white">
                    Stable
                  </h3>
                </div>

              </div>

            </div>
          </div>
        </div>

        {/* FILTER BAR */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 mb-6">

          <div className="flex flex-wrap items-center gap-3">

            <button
              onClick={() => setFilterOpen(!filterOpen)}
              className="h-10 px-5 sm:px-6 rounded-full border border-yellow-400/50 bg-yellow-400/10 text-yellow-400 hover:bg-yellow-400/20 transition text-xs sm:text-sm font-semibold whitespace-nowrap"
            >
              🔍 Lọc theo ngày
            </button>

            {showFilterResults && (
              <div className="h-10 px-4 rounded-full border border-yellow-400/30 bg-yellow-400/10 text-yellow-400 text-xs sm:text-sm flex items-center">
                {filteredVisits.length} kết quả
              </div>
            )}

          </div>

          {showFilterResults && (
            <button
              onClick={handleClearFilter}
              className="h-10 px-5 rounded-full border border-white/10 text-white/60 hover:text-white hover:bg-white/[0.05] transition text-xs sm:text-sm"
            >
              Xóa lọc
            </button>
          )}

        </div>

        {/* FILTER FORM */}
        {filterOpen && (
          <div
            className="rounded-[22px] border border-yellow-400/20 p-4 sm:p-5 mb-6 backdrop-blur-xl"
            style={{
              background:
                "linear-gradient(135deg, rgba(212,168,67,0.08), rgba(212,168,67,0.03))",
            }}
          >
            <form onSubmit={handleFilterSubmit}>
              <div className="flex flex-col lg:flex-row gap-3 lg:items-end">

                {/* INPUT */}
                <div className="flex-1">
                  <label className="block text-white/40 text-[10px] uppercase tracking-[0.18em] mb-2">
                    Chọn ngày
                  </label>

                  <input
                    type="date"
                    value={filterDate}
                    onChange={handleDateFilterChange}
                    className="w-full h-11 rounded-xl border border-white/10 bg-white/[0.03] px-4 text-white text-sm outline-none focus:border-yellow-400/40 transition"
                  />
                </div>

                {/* ACTIONS */}
                <div className="flex flex-col sm:flex-row gap-2">

                  <button
                    type="submit"
                    className="h-11 px-6 rounded-xl text-sm font-bold transition hover:scale-[1.02]"
                    style={{
                      background: "#D4A843",
                      color: "#1a0000",
                    }}
                  >
                    Lọc
                  </button>

                  <button
                    type="button"
                    onClick={() => setFilterOpen(false)}
                    className="h-11 px-6 rounded-xl border border-white/10 text-white/60 hover:text-white hover:bg-white/[0.05] transition text-sm"
                  >
                    Đóng
                  </button>

                </div>

              </div>
            </form>
          </div>
        )}

        {/* LOADING */}
        {loading && (
          <div className="py-24 flex justify-center">
            <div className="w-14 h-14 rounded-full border-2 border-yellow-400/20 border-t-yellow-400 animate-spin" />
          </div>
        )}

        {/* ERROR */}
        {!loading && error && (
          <div className="rounded-2xl border border-red-500/20 bg-red-500/10 p-6 text-red-300 text-sm">
            {error}
          </div>
        )}

        {/* EMPTY */}
        {!loading && !error && displayVisits.length === 0 && (
          <div className="rounded-2xl border border-white/10 bg-white/[0.03] py-20 text-center">
            <p className="text-white/40 text-sm">
              Không có hồ sơ khám
            </p>
          </div>
        )}

        {/* TABLE */}
        {!loading && !error && displayVisits.length > 0 && (
          <div
            className="w-full overflow-hidden rounded-[22px] border border-white/10 backdrop-blur-xl"
            style={{
              background:
                "linear-gradient(180deg, rgba(255,255,255,0.04), rgba(255,255,255,0.02))",
            }}
          >

            <div className="overflow-x-auto">

              <table className="min-w-[950px] w-full">

                {/* HEADER */}
                <thead className="border-b border-white/10 bg-white/[0.02]">

                  <tr>

                    <th className="px-6 py-5 text-left text-[11px] uppercase tracking-[0.18em] text-white/55">
                      ID
                    </th>

                    <th className="px-6 py-5 text-left text-[11px] uppercase tracking-[0.18em] text-white/55">
                      Bệnh nhân
                    </th>

                    <th className="px-6 py-5 text-left text-[11px] uppercase tracking-[0.18em] text-white/55">
                      Điện thoại
                    </th>

                    <th className="px-6 py-5 text-left text-[11px] uppercase tracking-[0.18em] text-white/55">
                      Thời gian khám
                    </th>

                    <th className="px-6 py-5 text-left text-[11px] uppercase tracking-[0.18em] text-white/55">
                      Chi phí
                    </th>

                    <th className="px-6 py-5 text-right text-[11px] uppercase tracking-[0.18em] text-white/55">
                      Hành động
                    </th>

                  </tr>

                </thead>

                {/* BODY */}
                <tbody>

                  {displayVisits.map((visit, index) => (
                    <tr
                      key={visit.id}
                      className={`border-b border-white/5 hover:bg-white/[0.03] transition ${
                        index === displayVisits.length - 1
                          ? "border-b-0"
                          : ""
                      }`}
                    >

                      {/* ID */}
                      <td className="px-6 py-5">
                        <p className="text-white font-semibold text-sm">
                          #{visit.id}
                        </p>
                      </td>

                      {/* PATIENT */}
                      <td className="px-6 py-5">
                        <div>
                          <p className="text-white font-semibold text-sm">
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
                      <td className="px-6 py-5 text-sm text-white/50 whitespace-nowrap">
                        {visit.appointment?.startTime
                          ? new Date(
                              visit.appointment.startTime
                            ).toLocaleString("vi-VN")
                          : "N/A"}
                      </td>

                      {/* COST */}
                      <td className="px-6 py-5">
                        {visit.cost ? (
                          <div className="inline-flex items-center h-8 px-4 rounded-full bg-green-500/15 border border-green-500/20 text-green-400 text-xs font-bold whitespace-nowrap">
                            {visit.cost.toLocaleString("vi-VN")} VND
                          </div>
                        ) : (
                          <div className="inline-flex items-center h-8 px-4 rounded-full bg-white/[0.05] border border-white/10 text-white/40 text-xs font-medium">
                            Chưa có
                          </div>
                        )}
                      </td>

                      {/* ACTION */}
                      <td className="px-6 py-5">
                        <div className="flex justify-end">
                          <Link
                            to={`/visits/${visit.id}`}
                            className="h-9 px-5 rounded-xl text-xs font-bold flex items-center justify-center transition hover:scale-[1.02]"
                            style={{
                              background: "#D4A843",
                              color: "#1a0000",
                            }}
                          >
                            Chi Tiết
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