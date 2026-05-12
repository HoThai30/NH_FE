import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { receptionistAPI } from "../services/api";
import { useAuth } from "../context/AuthContext";

export default function ReceptionistListPage() {
  const navigate = useNavigate();
  const { user } = useAuth();

  const [receptionists, setReceptionists] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const getReceptionistAvatar = (receptionist) => {
    const avatar =
        receptionist.user?.profilePicture ||
        receptionist.profilePicture;
        if (!avatar || avatar === "null") {
        return "/default-avatar.png";
      }

      return avatar;
  };

  useEffect(() => {
    const loadReceptionists = async () => {
      try {
        const response = await receptionistAPI.getAll();
        setReceptionists(response.data);
      } catch {
        setError("Không thể tải danh sách lễ tân");
      } finally {
        setLoading(false);
      }
    };

    loadReceptionists();
  }, []);

  const handleDelete = async (id) => {
    if (!window.confirm("Bạn có chắc muốn xóa lễ tân này?")) return;

    try {
      await receptionistAPI.delete(id);

      setReceptionists((prev) =>
        prev.filter((r) => r.id !== id)
      );

      alert("Xóa lễ tân thành công");
    } catch {
      alert("Lỗi xóa lễ tân");
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
              Nha khoa quốc tế
            </p>

            <h1
              className="text-2xl font-black text-white"
              style={{ fontFamily: "serif" }}
            >
              Đội Ngũ Lễ Tân
            </h1>
          </div>

          {/* RIGHT */}
          <div className="flex items-center gap-3">
            
            <button
              onClick={() => navigate(-1)}
              className="h-11 px-5 rounded-full border border-white/10 text-white/70 hover:text-white hover:bg-white/[0.05] transition text-sm font-medium"
            >
              ← Quay lại
            </button>

            {user?.role === "ADMIN" && (
              <button
                onClick={() =>
                  navigate("/receptionists/create")
                }
                className="h-11 px-5 rounded-full text-sm font-bold transition hover:scale-[1.02]"
                style={{
                  background: "#D4A843",
                  color: "#1a0000",
                }}
              >
                + Thêm lễ tân
              </button>
            )}
          </div>
        </div>
      </div>

      {/* CONTENT */}
      <div className="max-w-[1400px] mx-auto px-6 py-8">

        {/* HERO */}
        <div
          className="relative overflow-hidden rounded-3xl border border-white/10 p-8 mb-8"
          style={{
            background:
              "linear-gradient(135deg, rgba(255,255,255,0.05), rgba(255,255,255,0.02))",
          }}
        >
          {/* glow */}
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
                Hệ thống quản lý
              </p>

              <h2
                className="text-4xl md:text-5xl font-black text-white leading-tight"
                style={{ fontFamily: "serif" }}
              >
                Đội Ngũ
                <br />
                Lễ Tân
              </h2>

              <p className="text-white/50 text-sm leading-relaxed mt-5 max-w-xl">
                Quản lý đội ngũ lễ tân chuyên nghiệp với giao diện hiện đại,
                trực quan và đồng bộ cùng hệ thống nha khoa cao cấp.
              </p>
            </div>

            {/* STATS */}
            <div className="grid grid-cols-2 gap-4 min-w-[320px]">
              
              <div className="rounded-2xl border border-white/10 bg-white/[0.04] p-5">
                <p className="text-white/40 text-xs uppercase mb-2">
                  Tổng lễ tân
                </p>

                <h3 className="text-3xl font-black text-white">
                  {receptionists.length}
                </h3>
              </div>

              <div className="rounded-2xl border border-white/10 bg-white/[0.04] p-5">
                <p className="text-white/40 text-xs uppercase mb-2">
                  Trạng thái
                </p>

                <h3 className="text-3xl font-black text-green-400">
                  Active
                </h3>
              </div>

              <div className="rounded-2xl border border-white/10 bg-white/[0.04] p-5">
                <p className="text-white/40 text-xs uppercase mb-2">
                  Role
                </p>

                <h3 className="text-lg font-black text-yellow-400">
                  {user?.role}
                </h3>
              </div>

              <div className="rounded-2xl border border-white/10 bg-white/[0.04] p-5">
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

        {/* STATES */}
        {loading && (
          <div className="py-20 text-center text-white/40">
            Đang tải danh sách lễ tân...
          </div>
        )}

        {error && (
          <div className="py-20 text-center text-red-400">
            {error}
          </div>
        )}

        {/* EMPTY */}
        {!loading && !error && receptionists.length === 0 && (
          <div className="rounded-3xl border border-white/10 bg-white/[0.03] py-20 text-center">
            <p className="text-white/40">
              Chưa có lễ tân nào trong hệ thống
            </p>
          </div>
        )}

        {/* GRID */}
        {!loading &&
          !error &&
          receptionists.length > 0 && (
            <div className="grid sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5">
              
              {receptionists.map((receptionist) => (
                <div
                  key={receptionist.id}
                  className="group rounded-3xl overflow-hidden border border-white/10 transition hover:-translate-y-1"
                  style={{
                    background:
                      "linear-gradient(180deg, rgba(255,255,255,0.05), rgba(255,255,255,0.03))",
                  }}
                >
                  {/* IMAGE */}
                  <div className="relative h-[300px] overflow-hidden bg-[#2b0202]">
                    
                    {getReceptionistAvatar(receptionist) ? (
                      <img
                        src={getReceptionistAvatar(
                          receptionist
                        )}
                        alt={receptionist.user?.name || "Reception"}
                        className="w-full h-full object-cover transition duration-500 group-hover:scale-105"
                           onError={(e) => {
                           e.target.src = "/default-avatar.png";
                     }}
                    />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center text-white/30">
                        Không có ảnh
                      </div>
                    )}

                    {/* overlay */}
                    <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/10 to-transparent" />

                    {/* department */}
                    <div className="absolute top-4 left-4">
                      <div
                        className="px-3 h-8 rounded-full flex items-center text-[11px] font-bold backdrop-blur-md"
                        style={{
                          background:
                            "rgba(212,168,67,0.18)",
                          color: "#fff",
                          border:
                            "1px solid rgba(255,255,255,0.12)",
                        }}
                      >
                        {receptionist.department ||
                          "Lễ tân"}
                      </div>
                    </div>

                    {/* bottom info */}
                    <div className="absolute bottom-0 left-0 right-0 p-5">
                      
                      <p className="text-[11px] tracking-[0.2em] uppercase text-yellow-400 font-bold mb-2">
                        Receptionist
                      </p>

                      <h3 className="text-xl font-black text-white leading-tight">
                        {receptionist.user?.name ||
                          "Chưa cập nhật"}
                      </h3>

                      <p className="text-white/60 text-sm mt-2 line-clamp-1">
                        {receptionist.user?.email ||
                          "Chưa cập nhật email"}
                      </p>
                    </div>
                  </div>

                  {/* CONTENT */}
                  <div className="p-5">
                    
                    {/* quick info */}
                    <div className="flex items-center justify-between mb-5">
                      
                      <div>
                        <p className="text-white/30 text-xs uppercase mb-1">
                          Receptionist ID
                        </p>

                        <p className="text-white font-semibold">
                          #{receptionist.id}
                        </p>
                      </div>

                      <div className="text-right">
                        <p className="text-white/30 text-xs uppercase mb-1">
                          Status
                        </p>

                        <p className="text-green-400 font-semibold text-sm">
                          Active
                        </p>
                      </div>
                    </div>

                    {/* ACTIONS */}
                    <div className="flex gap-2">
                      
                      <button
                        onClick={() =>
                          navigate(
                            `/receptionists/${receptionist.id}`
                          )
                        }
                        className="flex-1 h-11 rounded-2xl border border-white/10 text-white text-sm font-semibold hover:bg-white/[0.05] transition"
                      >
                        Xem
                      </button>

                      {user?.role === "ADMIN" && (
                        <>
                          <button
                            onClick={() =>
                              navigate(
                                `/receptionists/${receptionist.id}/edit`
                              )
                            }
                            className="flex-1 h-11 rounded-2xl text-sm font-bold transition hover:scale-[1.02]"
                            style={{
                              background: "#D4A843",
                              color: "#1a0000",
                            }}
                          >
                            Sửa
                          </button>

                          <button
                            onClick={() =>
                              handleDelete(
                                receptionist.id
                              )
                            }
                            className="w-11 h-11 rounded-2xl bg-red-500/90 text-white hover:bg-red-500 transition"
                          >
                            ✕
                          </button>
                        </>
                      )}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
      </div>
    </div>
  );
}