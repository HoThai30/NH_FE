import React, {
  useState,
  useEffect,
} from "react";

import {
  useParams,
  useNavigate,
} from "react-router-dom";

import { doctorAPI } from "../services/api";

import { useAuth } from "../context/AuthContext";

export default function DoctorPage() {
  const { id } = useParams();

  const navigate = useNavigate();

  const { user } = useAuth();

  const [doctor, setDoctor] =
    useState(null);

  const [loading, setLoading] =
    useState(true);

  const [error, setError] =
    useState("");

  const getDoctorAvatar = (
    doctorData
  ) => {
    const base64 =
      doctorData?.user
        ?.profilePicture ||
      doctorData?.profilePicture;

    if (!base64) return null;

    return base64.startsWith(
      "data:"
    )
      ? base64
      : `data:image/jpeg;base64,${base64}`;
  };

  useEffect(() => {
    if (id) {
      loadDoctor();
    }
  }, [id]);

  const loadDoctor = async () => {
    try {
      setLoading(true);

      const response =
        await doctorAPI.getById(id);

      setDoctor(response.data);
    } catch (err) {
      setError(
        "Lỗi tải thông tin bác sĩ"
      );

      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div
        className="min-h-screen flex items-center justify-center"
        style={{
          backgroundColor:
            "#1a0000",
        }}
      >
        <p className="text-white/50">
          Đang tải thông tin bác
          sĩ...
        </p>
      </div>
    );
  }

  if (error) {
    return (
      <div
        className="min-h-screen flex items-center justify-center px-6"
        style={{
          backgroundColor:
            "#1a0000",
        }}
      >
        <div className="rounded-2xl border border-red-500/20 bg-red-500/10 px-6 py-5 text-red-300">
          {error}
        </div>
      </div>
    );
  }

  return (
    <div
      className="min-h-screen"
      style={{
        backgroundColor:
          "#1a0000",
      }}
    >
      {/* TOPBAR */}
      <div className="border-b border-white/10">
        <div className="max-w-[1350px] mx-auto px-6 h-[78px] flex items-center justify-between">

          {/* LEFT */}
          <div>
            <p className="text-[10px] tracking-[0.25em] uppercase text-yellow-400 font-bold mb-1">
              Luxury Dental System
            </p>

            <h1
              className="text-2xl font-black text-white"
              style={{
                fontFamily:
                  "serif",
              }}
            >
              Hồ Sơ Bác Sĩ
            </h1>
          </div>

          {/* RIGHT */}
          <button
            onClick={() =>
              navigate(-1)
            }
            className="h-11 px-5 rounded-full border border-white/10 text-white/70 hover:text-white hover:bg-white/[0.05] transition text-sm font-medium"
          >
            ← Quay lại
          </button>
        </div>
      </div>

      {/* CONTENT */}
      <div className="max-w-[1350px] mx-auto px-6 py-8">

        {/* HERO */}
        <div
          className="relative overflow-hidden rounded-[32px] border border-white/10 p-8 mb-8"
          style={{
            background:
              "linear-gradient(135deg, rgba(255,255,255,0.05), rgba(255,255,255,0.02))",
          }}
        >
          {/* glow */}
          <div
            className="absolute -top-24 -right-24 w-[320px] h-[320px] rounded-full blur-3xl"
            style={{
              background:
                "rgba(212,168,67,0.10)",
            }}
          />

          <div className="relative z-10 flex flex-col lg:flex-row lg:items-center lg:justify-between gap-8">

            {/* LEFT */}
            <div className="max-w-2xl">
              <p className="text-[11px] uppercase tracking-[0.25em] text-yellow-400 font-bold mb-3">
                Doctor Profile
              </p>

              <h2
                className="text-4xl md:text-5xl font-black text-white leading-tight"
                style={{
                  fontFamily:
                    "serif",
                }}
              >
                {doctor?.user
                  ?.name ||
                  "Bác sĩ"}
              </h2>

              <p className="text-white/50 text-sm leading-relaxed mt-5 max-w-xl">
                Thông tin chi tiết
                bác sĩ trong hệ
                thống quản lý nha
                khoa cao cấp theo
                phong cách luxury
                dental hiện đại.
              </p>
            </div>

            {/* STATS */}
            <div className="grid grid-cols-2 gap-4 min-w-[320px]">

              <div className="rounded-2xl border border-white/10 bg-white/[0.03] p-5">
                <p className="text-white/40 text-xs uppercase mb-2">
                  Doctor ID
                </p>

                <h3 className="text-3xl font-black text-white">
                  #{doctor?.id}
                </h3>
              </div>

              <div className="rounded-2xl border border-white/10 bg-white/[0.03] p-5">
                <p className="text-white/40 text-xs uppercase mb-2">
                  Status
                </p>

                <h3 className="text-3xl font-black text-green-400">
                  Active
                </h3>
              </div>

              <div className="rounded-2xl border border-white/10 bg-white/[0.03] p-5">
                <p className="text-white/40 text-xs uppercase mb-2">
                  Specialty
                </p>

                <h3 className="text-lg font-black text-yellow-400">
                  {doctor?.specialty ||
                    "Dental"}
                </h3>
              </div>

              <div className="rounded-2xl border border-white/10 bg-white/[0.03] p-5">
                <p className="text-white/40 text-xs uppercase mb-2">
                  Role
                </p>

                <h3 className="text-lg font-black text-white">
                  {doctor?.user
                    ?.role ||
                    "N/A"}
                </h3>
              </div>

            </div>
          </div>
        </div>

        {/* MAIN */}
        {doctor && (
          <div className="grid lg:grid-cols-[380px,1fr] gap-6">

            {/* LEFT */}
            <div
              className="rounded-[30px] overflow-hidden border border-white/10"
              style={{
                background:
                  "linear-gradient(180deg, rgba(255,255,255,0.04), rgba(255,255,255,0.02))",
              }}
            >
              {/* IMAGE */}
              <div className="relative h-[450px] bg-[#2b0202] overflow-hidden">

                {getDoctorAvatar(
                  doctor
                ) ? (
                  <img
                    src={getDoctorAvatar(
                      doctor
                    )}
                    alt={
                      doctor.user
                        ?.name
                    }
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <div className="w-full h-full flex items-center justify-center text-white/30">
                    Không có ảnh
                  </div>
                )}

                {/* overlay */}
                <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/10 to-transparent" />

                {/* specialty */}
                <div className="absolute top-5 left-5">
                  <div
                    className="px-4 h-9 rounded-full flex items-center text-xs font-bold backdrop-blur-md"
                    style={{
                      background:
                        "rgba(212,168,67,0.18)",
                      color:
                        "#fff",
                      border:
                        "1px solid rgba(255,255,255,0.12)",
                    }}
                  >
                    {doctor.specialty ||
                      "Nha khoa"}
                  </div>
                </div>

                {/* bottom */}
                <div className="absolute bottom-0 left-0 right-0 p-6">

                  <p className="text-[11px] uppercase tracking-[0.2em] text-yellow-400 font-bold mb-2">
                    Luxury Doctor
                  </p>

                  <h3 className="text-3xl font-black text-white leading-tight">
                    {doctor.user
                      ?.name ||
                      "Bác sĩ"}
                  </h3>

                  <p className="text-white/60 text-sm mt-3">
                    {doctor.user
                      ?.email ||
                      "Chưa cập nhật"}
                  </p>

                </div>
              </div>
            </div>

            {/* RIGHT */}
            <div
              className="rounded-[30px] border border-white/10 p-7"
              style={{
                background:
                  "linear-gradient(180deg, rgba(255,255,255,0.04), rgba(255,255,255,0.02))",
              }}
            >
              <div className="flex items-center justify-between gap-4 mb-8">

                <div>
                  <p className="text-[11px] uppercase tracking-[0.22em] text-yellow-400 font-bold mb-2">
                    Doctor Information
                  </p>

                  <h3
                    className="text-3xl font-black text-white"
                    style={{
                      fontFamily:
                        "serif",
                    }}
                  >
                    Thông Tin Chi
                    Tiết
                  </h3>
                </div>

                {(user?.role ===
                  "RECEPTIONIST" ||
                  user?.role ===
                    "ADMIN") && (
                  <button
                    onClick={() =>
                      navigate(
                        `/doctors/${doctor.id}/edit`
                      )
                    }
                    className="h-12 px-6 rounded-2xl text-sm font-bold transition hover:scale-[1.02]"
                    style={{
                      background:
                        "#D4A843",
                      color:
                        "#1a0000",
                    }}
                  >
                    Chỉnh sửa
                  </button>
                )}

              </div>

              {/* INFO GRID */}
              <div className="grid md:grid-cols-2 gap-5">

                {/* EMAIL */}
                <div className="rounded-2xl border border-white/10 bg-white/[0.03] p-5">
                  <p className="text-white/35 text-xs uppercase tracking-[0.18em] mb-3">
                    Email
                  </p>

                  <h4 className="text-white font-semibold break-all">
                    {doctor.user
                      ?.email ||
                      "Chưa cập nhật"}
                  </h4>
                </div>

                {/* PHONE */}
                <div className="rounded-2xl border border-white/10 bg-white/[0.03] p-5">
                  <p className="text-white/35 text-xs uppercase tracking-[0.18em] mb-3">
                    Số điện thoại
                  </p>

                  <h4 className="text-white font-semibold">
                    {doctor.user
                      ?.phone ||
                      "Chưa cập nhật"}
                  </h4>
                </div>

                {/* SPECIALTY */}
                <div className="rounded-2xl border border-white/10 bg-white/[0.03] p-5">
                  <p className="text-white/35 text-xs uppercase tracking-[0.18em] mb-3">
                    Chuyên khoa
                  </p>

                  <h4 className="text-yellow-400 font-semibold">
                    {doctor.specialty ||
                      "Chưa cập nhật"}
                  </h4>
                </div>

                {/* ROLE */}
                <div className="rounded-2xl border border-white/10 bg-white/[0.03] p-5">
                  <p className="text-white/35 text-xs uppercase tracking-[0.18em] mb-3">
                    Vai trò
                  </p>

                  <h4 className="text-white font-semibold">
                    {doctor.user
                      ?.role ||
                      "N/A"}
                  </h4>
                </div>

              </div>

              {/* BIO CARD */}
              <div className="mt-6 rounded-2xl border border-white/10 bg-white/[0.03] p-6">
                <p className="text-[11px] uppercase tracking-[0.18em] text-yellow-400 font-bold mb-4">
                  About Doctor
                </p>

                <p className="text-white/55 text-sm leading-relaxed">
                  Bác sĩ chuyên
                  khoa nha khoa với
                  hệ thống quản lý
                  hiện đại, hỗ trợ
                  điều trị và chăm
                  sóc bệnh nhân theo
                  tiêu chuẩn luxury
                  dental clinic.
                </p>
              </div>

            </div>
          </div>
        )}
      </div>
    </div>
  );
}