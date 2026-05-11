import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import api from "../services/api";
import { useAuth } from "../context/AuthContext";

const ServiceListPage = () => {
  const { user } = useAuth();
  const navigate = useNavigate();

  const [services, setServices] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const [modalOpen, setModalOpen] = useState(false);
  const [saving, setSaving] = useState(false);

  const [form, setForm] = useState({
    id: null,
    name: "",
    description: "",
    price: "",
    active: true,
    imgService: "",
  });

  const [selectedFile, setSelectedFile] = useState(null);
  const [previewImage, setPreviewImage] = useState(null);

  useEffect(() => {
    loadServices();
  }, []);

  const loadServices = async () => {
    setLoading(true);
    setError("");

    try {
      const res = await api.get("/services/admin");
      setServices(res.data);
    } catch (err) {
      console.error(err);
      setError("Không thể tải danh sách dịch vụ.");
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;

    setForm((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value,
    }));
  };

  const handleImageChange = (e) => {
    const file = e.target.files[0];

    if (!file) return;

    if (!file.type.startsWith("image/")) {
      setError("Vui lòng chọn file ảnh.");
      return;
    }

    setSelectedFile(file);
    setPreviewImage(URL.createObjectURL(file));
  };

  const openCreate = () => {
    setForm({
      id: null,
      name: "",
      description: "",
      price: "",
      active: true,
      imgService: "",
    });

    setSelectedFile(null);
    setPreviewImage(null);
    setModalOpen(true);
  };

  const openEdit = (service) => {
    setForm({
      id: service.id,
      name: service.name || "",
      description: service.description || "",
      price: service.price?.toString() || "",
      active: service.active ?? true,
      imgService: service.imgService || "",
    });

    setSelectedFile(null);

    setPreviewImage(
      service.imgService
        ? `/uploads/${service.imgService}`
        : null
    );

    setModalOpen(true);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!form.name.trim()) {
      setError("Vui lòng nhập tên dịch vụ.");
      return;
    }

    if (!form.price || isNaN(form.price)) {
      setError("Giá không hợp lệ.");
      return;
    }

    setSaving(true);
    setError("");

    try {
      const payload = {
        name: form.name.trim(),
        description: form.description.trim(),
        price: Number(form.price),
        active: form.active,
      };

      const formData = new FormData();

      formData.append(
        "data",
        new Blob([JSON.stringify(payload)], {
          type: "application/json",
        })
      );

      if (selectedFile) {
        formData.append("file", selectedFile);
      }

      if (form.id) {
        await api.put(`/services/${form.id}`, formData);
      } else {
        await api.post("/services", formData);
      }

      setModalOpen(false);
      loadServices();
    } catch (err) {
      console.error(err);
      setError("Lưu thất bại.");
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm("Bạn chắc chắn muốn xóa dịch vụ này?"))
      return;

    try {
      await api.delete(`/services/${id}`);

      setServices((prev) =>
        prev.filter((s) => s.id !== id)
      );
    } catch (err) {
      console.error(err);
      alert("Xóa thất bại");
    }
  };

  const formatPrice = (value) => {
    if (!value) return "0đ";

    return new Intl.NumberFormat("vi-VN", {
      style: "currency",
      currency: "VND",
    }).format(value);
  };

  if (
    !user ||
    (user.role !== "ADMIN" &&
      user.role !== "RECEPTIONIST")
  ) {
    return (
      <div className="p-10 text-white">
        Không có quyền truy cập
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
        <div className="max-w-[1400px] mx-auto px-6 h-[78px] flex items-center justify-between">
          
          <div>
            <p className="text-[10px] tracking-[0.25em] uppercase text-yellow-400 font-bold mb-1">
              Nha khoa quốc tế
            </p>

            <h1
              className="text-2xl font-black text-white"
              style={{ fontFamily: "serif" }}
            >
              Quản Lý Dịch Vụ
            </h1>
          </div>

          <div className="flex items-center gap-3">
            
            <button
              onClick={() => navigate(-1)}
              className="h-11 px-5 rounded-full border border-white/10 text-white/70 hover:text-white hover:bg-white/[0.05] transition text-sm font-medium"
            >
              ← Quay lại
            </button>

            <button
              onClick={openCreate}
              className="h-11 px-5 rounded-full text-sm font-bold transition hover:scale-[1.02]"
              style={{
                background: "#D4A843",
                color: "#1a0000",
              }}
            >
              + Thêm dịch vụ
            </button>
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
                Dental services management
              </p>

              <h2
                className="text-4xl md:text-5xl font-black text-white leading-tight"
                style={{ fontFamily: "serif" }}
              >
                Dịch Vụ
                <br />
                Nha Khoa
              </h2>

              <p className="text-white/50 text-sm leading-relaxed mt-5 max-w-xl">
                Quản lý toàn bộ dịch vụ nha khoa với giao diện
                hiện đại, trực quan và đồng bộ theo phong cách
                luxury dental system.
              </p>
            </div>

            {/* STATS */}
            <div className="grid grid-cols-2 gap-4 min-w-[320px]">
              
              <div className="rounded-2xl border border-white/10 bg-white/[0.04] p-5">
                <p className="text-white/40 text-xs uppercase mb-2">
                  Tổng dịch vụ
                </p>

                <h3 className="text-3xl font-black text-white">
                  {services.length}
                </h3>
              </div>

              <div className="rounded-2xl border border-white/10 bg-white/[0.04] p-5">
                <p className="text-white/40 text-xs uppercase mb-2">
                  Đang hoạt động
                </p>

                <h3 className="text-3xl font-black text-green-400">
                  {
                    services.filter((s) => s.active)
                      .length
                  }
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

        {/* ERROR */}
        {error && (
          <div className="mb-5 rounded-2xl border border-red-500/20 bg-red-500/10 px-5 py-4 text-red-300 text-sm">
            {error}
          </div>
        )}

        {/* LOADING */}
        {loading ? (
          <div className="py-20 text-center text-white/40">
            Đang tải danh sách dịch vụ...
          </div>
        ) : services.length === 0 ? (
          <div className="rounded-3xl border border-white/10 bg-white/[0.03] py-20 text-center">
            <p className="text-white/40">
              Chưa có dịch vụ nào
            </p>
          </div>
        ) : (
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5">
            
            {services.map((service) => (
              <div
                key={service.id}
                className="group rounded-3xl overflow-hidden border border-white/10 transition hover:-translate-y-1"
                style={{
                  background:
                    "linear-gradient(180deg, rgba(255,255,255,0.05), rgba(255,255,255,0.03))",
                }}
              >
                {/* IMAGE */}
                <div className="relative h-[250px] overflow-hidden bg-[#2b0202]">
                  
                  {service.imgService ? (
                    <img
                      src={`/uploads/${service.imgService}`}
                      alt={service.name}
                      className="w-full h-full object-cover transition duration-500 group-hover:scale-105"
                    />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center text-white/30">
                      Không có ảnh
                    </div>
                  )}

                  {/* overlay */}
                  <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/10 to-transparent" />

                  {/* status */}
                  <div className="absolute top-4 left-4">
                    <div
                      className="px-3 h-8 rounded-full flex items-center text-[11px] font-bold backdrop-blur-md"
                      style={{
                        background: service.active
                          ? "rgba(34,197,94,0.18)"
                          : "rgba(239,68,68,0.18)",
                        color: "#fff",
                        border:
                          "1px solid rgba(255,255,255,0.12)",
                      }}
                    >
                      {service.active
                        ? "Đang hoạt động"
                        : "Đã ẩn"}
                    </div>
                  </div>

                  {/* bottom */}
                  <div className="absolute bottom-0 left-0 right-0 p-5">
                    
                    <p className="text-[11px] tracking-[0.2em] uppercase text-yellow-400 font-bold mb-2">
                      Dental service
                    </p>

                    <h3 className="text-xl font-black text-white leading-tight line-clamp-2">
                      {service.name}
                    </h3>

                    <p className="text-yellow-400 font-bold mt-3 text-lg">
                      {formatPrice(service.price)}
                    </p>
                  </div>
                </div>

                {/* CONTENT */}
                <div className="p-5">
                  
                  <p className="text-white/50 text-sm leading-relaxed line-clamp-3 min-h-[65px]">
                    {service.description ||
                      "Dịch vụ nha khoa chuyên nghiệp chất lượng cao."}
                  </p>

                  {/* ACTIONS */}
                  <div className="flex gap-2 mt-5">
                    
                    <button
                      onClick={() => openEdit(service)}
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
                        handleDelete(service.id)
                      }
                      className="w-11 h-11 rounded-2xl bg-red-500/90 text-white hover:bg-red-500 transition"
                    >
                      ✕
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* MODAL */}
      {modalOpen && (
        <div className="fixed inset-0 z-50 bg-black/70 backdrop-blur-sm flex items-center justify-center p-4">
          
          <form
            onSubmit={handleSubmit}
            className="w-full max-w-[650px] rounded-3xl border border-white/10 overflow-hidden flex flex-col max-h-[90vh]"
            style={{
              background: "#1f0505",
            }}
          >
            {/* header */}
            <div className="px-8 py-6 border-b border-white/10 flex items-center justify-between flex-shrink-0">
              
              <div>
                <p className="text-[11px] uppercase tracking-[0.2em] text-yellow-400 font-bold mb-2">
                  Service Form
                </p>

                <h2
                  className="text-2xl font-black text-white"
                  style={{ fontFamily: "serif" }}
                >
                  {form.id
                    ? "Chỉnh sửa dịch vụ"
                    : "Tạo dịch vụ mới"}
                </h2>
              </div>

              <button
                type="button"
                onClick={() => setModalOpen(false)}
                className="w-10 h-10 rounded-full bg-white/5 text-white hover:bg-white/10"
              >
                ✕
              </button>
            </div>

            {/* body */}
            <div className="p-8 space-y-5 overflow-y-auto flex-1">
              
              {/* image */}
              <div>
                <p className="text-sm text-white/70 mb-3">
                  Hình ảnh dịch vụ
                </p>

                <div className="flex items-center gap-5">
                  
                  <div className="w-[140px] h-[140px] rounded-2xl overflow-hidden bg-[#2b0202] border border-white/10 flex items-center justify-center">
                    {previewImage ? (
                      <img
                        src={previewImage}
                        alt="preview"
                        className="w-full h-full object-cover"
                      />
                    ) : (
                      <div className="text-white/30 text-sm">
                        No Image
                      </div>
                    )}
                  </div>

                  <label
                    className="cursor-pointer px-5 h-11 rounded-2xl flex items-center text-sm font-semibold"
                    style={{
                      background: "#D4A843",
                      color: "#1a0000",
                    }}
                  >
                    Chọn ảnh

                    <input
                      type="file"
                      onChange={handleImageChange}
                      className="hidden"
                    />
                  </label>
                </div>
              </div>

              {/* name */}
              <div>
                <p className="text-sm text-white/70 mb-2">
                  Tên dịch vụ
                </p>

                <input
                  name="name"
                  value={form.name}
                  onChange={handleChange}
                  placeholder="Nhập tên dịch vụ..."
                  className="w-full h-12 rounded-2xl bg-white/[0.04] border border-white/10 px-5 text-white outline-none focus:border-yellow-400"
                />
              </div>

              {/* price */}
              <div>
                <p className="text-sm text-white/70 mb-2">
                  Giá dịch vụ
                </p>

                <input
                  name="price"
                  type="number"
                  value={form.price}
                  onChange={handleChange}
                  placeholder="Nhập giá..."
                  className="w-full h-12 rounded-2xl bg-white/[0.04] border border-white/10 px-5 text-white outline-none focus:border-yellow-400"
                />
              </div>

              {/* description */}
              <div>
                <p className="text-sm text-white/70 mb-2">
                  Mô tả
                </p>

                <textarea
                  name="description"
                  value={form.description}
                  onChange={handleChange}
                  rows={4}
                  placeholder="Mô tả dịch vụ..."
                  className="w-full rounded-2xl bg-white/[0.04] border border-white/10 p-5 text-white outline-none focus:border-yellow-400 resize-none"
                />
              </div>

              {/* active */}
              <label className="flex items-center gap-3">
                <input
                  type="checkbox"
                  name="active"
                  checked={form.active}
                  onChange={handleChange}
                  className="w-4 h-4"
                />

                <span className="text-white/80 text-sm">
                  Hiển thị dịch vụ
                </span>
              </label>
            </div>

            {/* footer */}
            <div className="px-8 py-6 border-t border-white/10 flex justify-end gap-3 flex-shrink-0">
              
              <button
                type="button"
                onClick={() => setModalOpen(false)}
                className="h-11 px-5 rounded-2xl border border-white/10 text-white hover:bg-white/[0.05] transition"
              >
                Hủy
              </button>

              <button
                type="submit"
                disabled={saving}
                className="h-11 px-6 rounded-2xl font-bold transition hover:scale-[1.02]"
                style={{
                  background: "#D4A843",
                  color: "#1a0000",
                }}
              >
                {saving ? "Đang lưu..." : "Lưu dịch vụ"}
              </button>
            </div>
          </form>
        </div>
      )}
    </div>
  );
};

export default ServiceListPage;