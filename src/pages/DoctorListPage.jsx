import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { doctorAPI } from "../services/api";
import { useAuth } from "../context/AuthContext";

export default function DoctorListPage() {
  const navigate = useNavigate();
  const { user } = useAuth();
  const [doctors, setDoctors] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const getDoctorAvatar = (doctor) => {
    const base64 = doctor.user?.profilePicture || doctor.profilePicture;
    if (!base64) return null;
    return base64.startsWith("data:")
      ? base64
      : `data:image/jpeg;base64,${base64}`;
  };

  const handleDelete = async (doctorId) => {
    if (!window.confirm("Bạn có chắc chắn muốn xóa bác sĩ này?")) return;

    try {
      await doctorAPI.delete(doctorId);
      setDoctors(doctors.filter((d) => d.id !== doctorId));
      alert("Xóa bác sĩ thành công");
    } catch {
      alert("Không thể xóa bác sĩ");
    }
  };

  useEffect(() => {
    const loadDoctors = async () => {
      try {
        const res = await doctorAPI.getAll();
        setDoctors(res.data);
      } catch {
        setError("Không thể tải danh sách bác sĩ");
      } finally {
        setLoading(false);
      }
    };
    loadDoctors();
  }, []);

  return (
    <div className="min-h-screen px-6 py-12" style={{ background: "#2b0202" }}>
      
      <div className="max-w-[1100px] mx-auto">

        {/* HEADER */}
        <div className="flex justify-between items-center mb-10">
          <div>
            <p className="text-xs tracking-widest uppercase text-yellow-400 mb-2">
              Đội ngũ chuyên môn
            </p>
            <h1 className="text-3xl font-black text-white font-serif">
              Bác Sĩ Nha Khoa
            </h1>
          </div>

          <div className="flex gap-3">
            <button
              onClick={() => navigate(-1)}
              className="px-5 py-2 rounded-full text-sm font-semibold border border-white/30 text-white hover:bg-white/10 transition"
            >
              ← Quay lại
            </button>

            {(user?.role === "RECEPTIONIST" || user?.role === "ADMIN") && (
              <button
                onClick={() => navigate("/doctors/create")}
                className="px-5 py-2 rounded-full text-sm font-semibold"
                style={{ background: "#D4A843", color: "#1a0000" }}
              >
                + Tạo bác sĩ
              </button>
            )}
          </div>
        </div>

        {/* STATE */}
        {loading && (
          <div className="text-white/50 py-10 text-center">Đang tải...</div>
        )}

        {error && (
          <div className="text-red-400 text-center py-6">{error}</div>
        )}

        {/* LIST */}
        {!loading && !error && (
          <>
            {doctors.length === 0 ? (
              <div className="text-white/50 text-center py-10">
                Chưa có bác sĩ nào
              </div>
            ) : (
              <div className="grid sm:grid-cols-2 md:grid-cols-3 gap-6">
                {doctors.map((doctor) => (
                  <div
                    key={doctor.id}
                    className="rounded-2xl overflow-hidden bg-white flex flex-col transition hover:-translate-y-1 hover:shadow-xl"
                    style={{ boxShadow: "0 6px 20px rgba(0,0,0,0.2)" }}
                  >
                    
                    {/* AVATAR */}
                    <div className="h-[220px] bg-[#f5ede6] flex items-center justify-center">
                      {getDoctorAvatar(doctor) ? (
                        <img
                          src={getDoctorAvatar(doctor)}
                          alt={doctor.user?.name}
                          className="w-full h-full object-cover"
                        />
                      ) : (
                        <div className="text-gray-400 text-sm">
                          Không có ảnh
                        </div>
                      )}
                    </div>

                    {/* INFO */}
                    <div className="p-4 flex flex-col flex-1">
                      <p className="text-xs uppercase tracking-widest text-gray-500 mb-1">
                        Bác sĩ
                      </p>

                      <h3 className="font-bold text-gray-900 text-sm line-clamp-2">
                        {doctor.user?.name || "Chưa có tên"}
                      </h3>

                      <p className="text-xs text-gray-500 mt-1">
                        {doctor.specialty || "Chưa cập nhật"}
                      </p>

                      <p className="text-xs text-gray-400 mt-1 line-clamp-1">
                        {doctor.user?.email}
                      </p>

                      {/* ACTION */}
                      <div className="flex gap-2 mt-auto pt-4">
                        <button
                          onClick={() =>
                            navigate(`/doctors/${doctor.id}`)
                          }
                          className="flex-1 py-2 rounded-lg text-xs font-semibold border"
                        >
                          Xem
                        </button>

                        {(user?.role === "RECEPTIONIST" ||
                          user?.role === "ADMIN") && (
                          <>
                            <button
                              onClick={() =>
                                navigate(`/doctors/${doctor.id}/edit`)
                              }
                              className="flex-1 py-2 rounded-lg text-xs font-semibold"
                              style={{
                                background: "#D4A843",
                                color: "#1a0000",
                              }}
                            >
                              Sửa
                            </button>

                            <button
                              onClick={() =>
                                handleDelete(doctor.id)
                              }
                              className="px-3 py-2 rounded-lg text-xs bg-red-500 text-white hover:bg-red-600"
                            >
                              Xóa
                            </button>
                          </>
                        )}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
}