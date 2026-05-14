import React, { useState } from "react";
import { useAuth } from "../context/AuthContext";
import { Link, useNavigate } from "react-router-dom";

export default function Dashboard() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const [mobileSidebarOpen, setMobileSidebarOpen] = useState(false);

  const menuItems = [
    {
      title: "Danh Sách Bác Sĩ",
      path: "/doctors",
      roles: ["ADMIN"],
      icon: "👨‍⚕️",
    },
    {
      title: "Danh Sách Lễ Tân",
      path: "/receptionists",
      roles: ["ADMIN"],
      icon: "🧾",
    },
    {
      title: "Quản Lý Dịch Vụ",
      path: "/services",
      roles: ["ADMIN", "RECEPTIONIST"],
      icon: "🦷",
    },
    {
      title: "Đặt Cuộc Hẹn",
      path: "/appointments/new",
      roles: ["RECEPTIONIST", "ADMIN"],
      icon: "📅",
    },
    {
      title: "Danh Sách Cuộc Hẹn",
      path: "/appointments",
      roles: ["DOCTOR", "RECEPTIONIST", "ADMIN"],
      icon: "📋",
    },
    {
      title: "Hồ Sơ Khám",
      path: "/visits",
      roles: ["DOCTOR", "ADMIN"],
      icon: "🩺",
    },
    {
      title: "Gửi Thông Báo",
      path: "/notifications/send",
      roles: ["RECEPTIONIST", "ADMIN"],
      icon: "🔔",
    },
    {
      title: "Quản Lý Bài Viết",
      path: "/posts",
      roles: ["ADMIN"],
      icon: "📰",
    },
  ];

  const handleLogout = () => {
    logout();
    navigate("/login");
  };

  const allowedItems = menuItems.filter((item) =>
    item.roles.includes(user?.role)
  );

  return (
    <div
      className="min-h-screen flex"
      style={{ backgroundColor: "#1a0000" }}
    >
      {/* MOBILE OVERLAY */}
      {mobileSidebarOpen && (
        <div
          className="fixed inset-0 bg-black/60 z-40 md:hidden"
          onClick={() => setMobileSidebarOpen(false)}
        />
      )}

      {/* SIDEBAR */}
      <div
        className={`
          fixed md:static top-0 left-0 z-50
          h-screen md:h-auto
          w-[280px] lg:w-[250px]
          transform transition-transform duration-300
          ${
            mobileSidebarOpen
              ? "translate-x-0"
              : "-translate-x-full"
          }
          md:translate-x-0
          flex flex-col
          border-r border-white/10
        `}
        style={{ backgroundColor: "#220202" }}
      >
        {/* MOBILE CLOSE */}
        <div className="md:hidden flex justify-end p-4">
          <button
            onClick={() => setMobileSidebarOpen(false)}
            className="text-white text-2xl"
          >
            ✕
          </button>
        </div>

        {/* LOGO */}
        <div className="px-4 sm:px-5 md:px-6 py-5 sm:py-6 md:py-7 border-b border-white/10">
          <p className="text-[9px] sm:text-[10px] tracking-[0.2em] sm:tracking-[0.25em] uppercase text-yellow-400 font-bold mb-1.5 sm:mb-2">
            Nha Khoa Quốc Tế
          </p>

          <h1
            className="text-lg sm:text-2xl text-white font-black leading-tight"
            style={{ fontFamily: "serif" }}
          >
            Á Châu II
          </h1>
        </div>

        {/* MENU */}
        <div className="flex-1 px-2 sm:px-3 md:px-4 py-3 sm:py-4 md:py-5 space-y-0.5 sm:space-y-1 overflow-y-auto">
          {allowedItems.map((item) => (
            <Link
              key={item.path}
              to={item.path}
              onClick={() => setMobileSidebarOpen(false)}
              className="group flex items-center gap-2 sm:gap-3 px-2 sm:px-3 h-10 sm:h-[52px] rounded-xl md:rounded-2xl text-white/65 hover:text-white transition hover:bg-white/[0.05]"
            >
              <div
                className="w-8 sm:w-10 h-8 sm:h-10 rounded-lg md:rounded-xl flex items-center justify-center text-base md:text-lg"
                style={{
                  background: "rgba(212,168,67,0.10)",
                }}
              >
                {item.icon}
              </div>

              <div className="flex-1">
                <p className="text-xs md:text-sm font-semibold">
                  {item.title}
                </p>
              </div>

              <span className="text-white/20 group-hover:text-yellow-400 transition">
                →
              </span>
            </Link>
          ))}
        </div>

        {/* USER */}
        <div className="p-3 sm:p-4 border-t border-white/10">
          <div
            className="rounded-lg sm:rounded-2xl p-3 sm:p-4"
            style={{
              background: "rgba(255,255,255,0.04)",
            }}
          >
            <p className="text-[10px] sm:text-[11px] uppercase tracking-widest text-yellow-400 mb-2">
              Tài khoản
            </p>

            <div className="flex items-center gap-2 sm:gap-3">
              <div className="w-8 sm:w-11 h-8 sm:h-11 rounded-full bg-white/10 flex items-center justify-center text-white font-bold text-xs sm:text-base">
                {user?.name?.charAt(0)}
              </div>

              <div>
                <h3 className="text-xs md:text-sm font-bold text-white">
                  {user?.name}
                </h3>

                <p className="text-xs text-white/40">
                  {user?.role}
                </p>
              </div>
            </div>

            {/* LOGOUT */}
            <button
              onClick={handleLogout}
              className="mt-4 w-full h-10 rounded-xl bg-red-500/10 hover:bg-red-500/20 text-red-400 text-sm font-semibold transition"
            >
              Đăng xuất
            </button>
          </div>
        </div>
      </div>

      {/* MAIN */}
      <div className="flex-1 overflow-hidden flex flex-col">

        {/* TOPBAR */}
        <div className="h-16 sm:h-[72px] border-b border-white/10 px-4 sm:px-6 flex items-center justify-between">

          {/* LEFT */}
          <div className="flex items-center gap-3">

            {/* MOBILE MENU BUTTON */}
            <button
              onClick={() => setMobileSidebarOpen(true)}
              className="md:hidden text-white"
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-7 w-7"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M4 6h16M4 12h16M4 18h16"
                />
              </svg>
            </button>

            <div>
              <h2 className="text-base sm:text-lg font-bold text-white">
                Dashboard
              </h2>

              <p className="text-[11px] sm:text-xs text-white/40 mt-0.5">
                Luxury Dental Management System
              </p>
            </div>
          </div>

          {/* RIGHT */}
          <div className="flex items-center gap-2 sm:gap-3">
            <div
              className="px-3 sm:px-4 h-9 sm:h-10 rounded-full hidden sm:flex items-center text-[11px] sm:text-xs font-bold"
              style={{
                background: "rgba(212,168,67,0.12)",
                color: "#D4A843",
              }}
            >
              {user?.role}
            </div>

            <div className="w-9 sm:w-10 h-9 sm:h-10 rounded-full bg-white/10 flex items-center justify-center text-white font-bold text-xs sm:text-base">
              {user?.name?.charAt(0)}
            </div>
          </div>
        </div>

        {/* CONTENT */}
        <div className="flex-1 p-3 sm:p-4 md:p-6 overflow-y-auto">

          {/* HERO */}
          <div
            className="relative overflow-hidden rounded-2xl md:rounded-3xl border border-white/10 p-4 sm:p-6 md:p-8 mb-4 sm:mb-6"
            style={{
              background:
                "linear-gradient(135deg, rgba(255,255,255,0.06), rgba(255,255,255,0.02))",
            }}
          >
            {/* glow */}
            <div
              className="absolute -top-20 -right-20 w-[200px] sm:w-[280px] h-[200px] sm:h-[280px] rounded-full blur-3xl"
              style={{
                background: "rgba(212,168,67,0.12)",
              }}
            />

            <div className="relative z-10 flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4 sm:gap-6">

              {/* LEFT */}
              <div className="max-w-2xl">
                <p className="text-[10px] sm:text-[11px] uppercase tracking-[0.15em] sm:tracking-[0.25em] text-yellow-400 font-bold mb-2 sm:mb-3">
                  Xin chào trở lại
                </p>

                <h1
                  className="text-2xl sm:text-3xl md:text-4xl font-black text-white leading-tight"
                  style={{ fontFamily: "serif" }}
                >
                  {user?.name}
                </h1>

                <p className="text-white/50 mt-2 sm:mt-4 leading-relaxed text-xs sm:text-sm max-w-xl">
                  Quản lý toàn bộ hệ thống nha khoa Á Châu II với giao diện hiện đại,
                  trực quan và chuyên nghiệp.
                </p>

                <div className="flex flex-wrap gap-2 sm:gap-3 mt-4 sm:mt-6">
                  <Link
                    to="/appointments/new"
                    className="px-4 sm:px-5 h-9 sm:h-11 rounded-full flex items-center text-xs sm:text-sm font-bold"
                    style={{
                      background: "#D4A843",
                      color: "#1a0000",
                    }}
                  >
                    + Tạo lịch hẹn
                  </Link>

                  <Link
                    to="/appointments"
                    className="px-4 sm:px-5 h-9 sm:h-11 rounded-full flex items-center text-xs sm:text-sm font-semibold border border-white/10 text-white hover:bg-white/[0.05] transition"
                  >
                    Xem cuộc hẹn
                  </Link>
                </div>
              </div>

              {/* RIGHT STATS */}
              <div className="grid grid-cols-2 gap-3 sm:gap-4 min-w-full sm:min-w-[320px]">

                <div className="rounded-lg sm:rounded-2xl bg-white/[0.05] border border-white/10 p-3 sm:p-4">
                  <p className="text-white/40 text-[10px] sm:text-xs uppercase mb-2">
                    Modules
                  </p>

                  <h3 className="text-2xl sm:text-3xl font-black text-white">
                    {allowedItems.length}
                  </h3>
                </div>

                <div className="rounded-lg sm:rounded-2xl bg-white/[0.05] border border-white/10 p-3 sm:p-4">
                  <p className="text-white/40 text-[10px] sm:text-xs uppercase mb-2">
                    Status
                  </p>

                  <h3 className="text-2xl sm:text-3xl font-black text-green-400">
                    Online
                  </h3>
                </div>

                <div className="rounded-lg sm:rounded-2xl bg-white/[0.05] border border-white/10 p-3 sm:p-4">
                  <p className="text-white/40 text-[10px] sm:text-xs uppercase mb-2">
                    Role
                  </p>

                  <h3 className="text-base sm:text-lg font-black text-yellow-400">
                    {user?.role}
                  </h3>
                </div>

                <div className="rounded-lg sm:rounded-2xl bg-white/[0.05] border border-white/10 p-3 sm:p-4">
                  <p className="text-white/40 text-[10px] sm:text-xs uppercase mb-2">
                    System
                  </p>

                  <h3 className="text-base sm:text-lg font-black text-white">
                    Active
                  </h3>
                </div>
              </div>
            </div>
          </div>

          {/* BOTTOM GRID */}
          <div className="grid grid-cols-1 lg:grid-cols-[1.4fr_0.9fr] gap-4 sm:gap-6">

            {/* LEFT */}
            <div className="space-y-4 sm:space-y-6">

              {/* QUICK ACTION */}
              <div className="rounded-2xl md:rounded-3xl border border-white/10 bg-white/[0.03] p-4 sm:p-6">

                <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 sm:gap-4 mb-4 sm:mb-5">
                  <div>
                    <h3 className="text-base sm:text-lg font-bold text-white">
                      Truy cập nhanh
                    </h3>

                    <p className="text-white/40 text-xs sm:text-sm mt-0.5 sm:mt-1">
                      Các thao tác quản lý phổ biến
                    </p>
                  </div>
                </div>

                <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-2 sm:gap-3 md:gap-4">
                  {allowedItems.slice(0, 4).map((item) => (
                    <Link
                      key={item.path}
                      to={item.path}
                      className="group rounded-lg md:rounded-2xl border border-white/10 bg-white/[0.03] p-3 sm:p-4 hover:bg-white/[0.06] transition"
                    >
                      <div
                        className="w-9 sm:w-11 h-9 sm:h-11 rounded-lg md:rounded-xl flex items-center justify-center text-lg md:text-xl mb-3 sm:mb-4"
                        style={{
                          background: "rgba(212,168,67,0.12)",
                        }}
                      >
                        {item.icon}
                      </div>

                      <h4 className="text-xs sm:text-sm font-bold text-white line-clamp-2">
                        {item.title}
                      </h4>

                      <div className="mt-2 sm:mt-3 md:mt-4 text-yellow-400 text-sm">
                        →
                      </div>
                    </Link>
                  ))}
                </div>
              </div>

              {/* RECENT */}
              <div className="rounded-2xl md:rounded-3xl border border-white/10 bg-white/[0.03] p-4 sm:p-6">

                <div className="mb-4 sm:mb-5">
                  <h3 className="text-base sm:text-lg font-bold text-white">
                    Hoạt động gần đây
                  </h3>

                  <p className="text-white/40 text-xs sm:text-sm mt-0.5 sm:mt-1">
                    Theo dõi hệ thống hôm nay
                  </p>
                </div>

                <div className="space-y-2 sm:space-y-3">

                  {[1, 2, 3, 4].map((item) => (
                    <div
                      key={item}
                      className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2 rounded-lg md:rounded-2xl border border-white/10 bg-white/[0.03] px-3 sm:px-4 py-2.5 sm:py-3"
                    >
                      <div className="flex items-center gap-2 sm:gap-3">

                        <div
                          className="w-8 sm:w-10 h-8 sm:h-10 rounded-lg md:rounded-xl flex items-center justify-center flex-shrink-0"
                          style={{
                            background: "rgba(212,168,67,0.10)",
                          }}
                        >
                          📋
                        </div>

                        <div>
                          <p className="text-xs sm:text-sm font-semibold text-white">
                            Cuộc hẹn mới được tạo
                          </p>

                          <p className="text-[10px] sm:text-xs text-white/40">
                            09:30 AM hôm nay
                          </p>
                        </div>
                      </div>

                      <span className="text-[10px] sm:text-xs text-green-400 whitespace-nowrap">
                        Active
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* RIGHT */}
            <div className="space-y-4 sm:space-y-6">

              {/* SYSTEM */}
              <div className="rounded-2xl md:rounded-3xl border border-white/10 bg-white/[0.03] p-4 sm:p-6">

                <h3 className="text-base sm:text-lg font-bold text-white mb-4 sm:mb-5">
                  Hệ thống
                </h3>

                <div className="space-y-3 sm:space-y-4">

                  <div>
                    <div className="flex items-center justify-between text-xs sm:text-sm mb-2">
                      <span className="text-white/60">
                        Hiệu suất
                      </span>

                      <span className="text-white">
                        92%
                      </span>
                    </div>

                    <div className="h-2 rounded-full bg-white/10 overflow-hidden">
                      <div
                        className="h-full rounded-full"
                        style={{
                          width: "92%",
                          background: "#D4A843",
                        }}
                      />
                    </div>
                  </div>

                  <div>
                    <div className="flex items-center justify-between text-xs sm:text-sm mb-2">
                      <span className="text-white/60">
                        Máy chủ
                      </span>

                      <span className="text-white">
                        78%
                      </span>
                    </div>

                    <div className="h-2 rounded-full bg-white/10 overflow-hidden">
                      <div
                        className="h-full rounded-full"
                        style={{
                          width: "78%",
                          background: "#D4A843",
                        }}
                      />
                    </div>
                  </div>
                </div>
              </div>

              {/* INFO */}
              <div className="rounded-2xl md:rounded-3xl border border-white/10 bg-white/[0.03] p-4 sm:p-6">

                <h3 className="text-base sm:text-lg font-bold text-white mb-4 sm:mb-5">
                  Thông tin nhanh
                </h3>

                <div className="space-y-3 sm:space-y-4">

                  <div className="flex items-center justify-between">
                    <span className="text-white/50 text-xs sm:text-sm">
                      Người dùng
                    </span>

                    <span className="text-white font-semibold text-xs sm:text-sm">
                      {user?.name}
                    </span>
                  </div>

                  <div className="flex items-center justify-between">
                    <span className="text-white/50 text-xs sm:text-sm">
                      Quyền hạn
                    </span>

                    <span className="text-yellow-400 font-semibold text-xs sm:text-sm">
                      {user?.role}
                    </span>
                  </div>

                  <div className="flex items-center justify-between">
                    <span className="text-white/50 text-xs sm:text-sm">
                      Trạng thái
                    </span>

                    <span className="text-green-400 font-semibold text-xs sm:text-sm">
                      Online
                    </span>
                  </div>

                  <div className="flex items-center justify-between">
                    <span className="text-white/50 text-xs sm:text-sm">
                      Hệ thống
                    </span>

                    <span className="text-white font-semibold text-xs sm:text-sm">
                      Stable
                    </span>
                  </div>
                </div>
              </div>

            </div>
          </div>

        </div>
      </div>
    </div>
  );
}