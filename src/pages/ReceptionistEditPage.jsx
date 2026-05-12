import React, {
  useState,
  useEffect,
} from "react";

import {
  useParams,
  useNavigate,
} from "react-router-dom";

import {
  receptionistAPI,
} from "../services/api";

import {
  uploadToCloudinary,
  validateImage,
} from "../services/cloudinaryUtils";

export default function ReceptionistEditPage() {
  const { id } = useParams();

  const navigate = useNavigate();

  const [
    receptionist,
    setReceptionist,
  ] = useState(null);

  const [loading, setLoading] =
    useState(true);

  const [saving, setSaving] =
    useState(false);

  const [error, setError] =
    useState("");

  const [imagePreview, setImagePreview] =
    useState(null);

  const [formData, setFormData] =
    useState({
      firstName: "",
      lastName: "",
      department: "",
      phonenumber: "",
      profilePicture: "",

      user: {
        email: "",
        profilePicture: "",
      },
    });

  useEffect(() => {
    if (!id) return;

    const loadReceptionist =
      async () => {
        try {
          const response =
            await receptionistAPI.getById(
              id
            );

          const data =
            response.data;

          setReceptionist(data);

          setFormData({
            firstName:
              data.user
                ?.firstName || "",

            lastName:
              data.user
                ?.lastName || "",

            department:
              data.department ||
              "",

            phonenumber:
              data.user
                ?.phonenumber ||
              data.user
                ?.phone ||
              "",

            profilePicture:
              data.profilePicture ||
              data.user
                ?.profilePicture ||
              "",

            user: {
              email:
                data.user
                  ?.email ||
                "",

              profilePicture:
                data.user
                  ?.profilePicture ||
                data.profilePicture ||
                "",
            },
          });

          if (
            data.user
              ?.profilePicture
          ) {
            // Check if it's already a URL or needs prefix
            if (data.user.profilePicture.startsWith('http')) {
              setImagePreview(
                data.user.profilePicture
              );
            } else if (
              data.user.profilePicture.startsWith(
                "data:"
              )
            ) {
              setImagePreview(
                data.user
                    .profilePicture
              );
            } else {
              setImagePreview(
                `data:image/jpeg;base64,${data.user.profilePicture}`
              );
            }
          }
        } catch (err) {
          console.error(err);

          setError(
            "Không thể tải thông tin lễ tân"
          );
        } finally {
          setLoading(false);
        }
      };

    loadReceptionist();
  }, [id]);

  const handleInputChange = (
    e
  ) => {
    const { name, value } =
      e.target;

    if (
      name.startsWith("user.")
    ) {
      const field =
        name.split(".")[1];

      setFormData((prev) => ({
        ...prev,

        user: {
          ...prev.user,
          [field]: value,
        },
      }));
    } else {
      setFormData((prev) => ({
        ...prev,
        [name]: value,
      }));
    }
  };

  const handleImageChange = async (
    e
  ) => {
    const file =
      e.target.files[0];

    if (!file) return;

    // Validate image
    const validation = validateImage(file);
    if (!validation.valid) {
      alert("Lỗi: " + validation.error);
      return;
    }

    // Show preview
    const reader =
      new FileReader();

    reader.onloadend = () => {
      setImagePreview(
        reader.result
      );
    };

    reader.readAsDataURL(file);

    try {
      // Upload to Cloudinary
      const imageUrl = await uploadToCloudinary(file);

      setFormData((prev) => ({
        ...prev,

        profilePicture:
          imageUrl,

        user: {
          ...prev.user,

          profilePicture:
            imageUrl,
        },
      }));
    } catch (error) {
      alert("Lỗi upload ảnh: " + error.message);
      setImagePreview(null);
    }
  };

  const handleSubmit = async (
    e
  ) => {
    e.preventDefault();

    setSaving(true);

    try {
      const submitData = {
        ...receptionist,

        user: {
          ...receptionist.user,

          firstName:
            formData.firstName,

          lastName:
            formData.lastName,

          email:
            formData.user.email,

          phonenumber:
            formData.phonenumber,

          profilePicture:
            formData.user
              .profilePicture ||
            formData.profilePicture ||
            "",
        },

        department:
          formData.department,

        profilePicture:
          formData.profilePicture ||
          formData.user
            .profilePicture ||
          "",
      };

      await receptionistAPI.update(
        id,
        submitData
      );

      alert(
        "Cập nhật lễ tân thành công"
      );

      navigate(
        "/receptionists"
      );
    } catch (err) {
      console.error(err);

      alert(
        "Lỗi: " +
          (err.response?.data ||
            "Không thể cập nhật lễ tân")
      );
    } finally {
      setSaving(false);
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
          Đang tải dữ liệu lễ tân...
        </p>
      </div>
    );
  }

  if (error) {
    return (
      <div
        className="min-h-screen flex items-center justify-center"
        style={{
          backgroundColor:
            "#1a0000",
        }}
      >
        <div className="rounded-2xl border border-red-500/20 bg-red-500/10 px-5 py-4 text-red-300 text-sm">
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
        <div className="max-w-[1300px] mx-auto px-6 h-[78px] flex items-center justify-between">

          {/* LEFT */}
          <div>
            <p className="text-[10px] tracking-[0.25em] uppercase text-yellow-400 font-bold mb-1">
              Receptionist
              Management
            </p>

            <h1
              className="text-2xl font-black text-white"
              style={{
                fontFamily:
                  "serif",
              }}
            >
              Chỉnh Sửa Lễ Tân
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
      <div className="max-w-[1300px] mx-auto px-6 py-8">

        {/* HERO */}
        <div
          className="relative overflow-hidden rounded-[30px] border border-white/10 p-8 mb-8"
          style={{
            background:
              "linear-gradient(135deg, rgba(255,255,255,0.05), rgba(255,255,255,0.02))",
          }}
        >
          {/* GLOW */}
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
                Luxury Dental
                Reception System
              </p>

              <h2
                className="text-4xl md:text-5xl font-black text-white leading-tight"
                style={{
                  fontFamily:
                    "serif",
                }}
              >
                Cập Nhật
                <br />
                Hồ Sơ Lễ Tân
              </h2>

              <p className="text-white/50 text-sm leading-relaxed mt-5 max-w-xl">
                Chỉnh sửa thông
                tin lễ tân trong
                hệ thống quản lý
                nha khoa cao cấp
                với giao diện
                luxury hiện đại và
                chuyên nghiệp.
              </p>
            </div>

            {/* STATS */}
            <div className="grid grid-cols-2 gap-4 min-w-[320px]">

              <div className="rounded-2xl border border-white/10 bg-white/[0.03] p-5">
                <p className="text-white/40 text-xs uppercase mb-2">
                  Receptionist
                  ID
                </p>

                <h3 className="text-2xl font-black text-white">
                  #{id}
                </h3>
              </div>

              <div className="rounded-2xl border border-white/10 bg-white/[0.03] p-5">
                <p className="text-white/40 text-xs uppercase mb-2">
                  Status
                </p>

                <h3 className="text-2xl font-black text-green-400">
                  Active
                </h3>
              </div>

              <div className="rounded-2xl border border-white/10 bg-white/[0.03] p-5">
                <p className="text-white/40 text-xs uppercase mb-2">
                  Department
                </p>

                <h3 className="text-lg font-black text-yellow-400">
                  {formData.department ||
                    "Reception"}
                </h3>
              </div>

              <div className="rounded-2xl border border-white/10 bg-white/[0.03] p-5">
                <p className="text-white/40 text-xs uppercase mb-2">
                  System
                </p>

                <h3 className="text-lg font-black text-white">
                  Stable
                </h3>
              </div>

            </div>
          </div>
        </div>

        {/* FORM */}
        <form
          onSubmit={
            handleSubmit
          }
        >
          <div className="grid lg:grid-cols-[380px,1fr] gap-6">

            {/* LEFT */}
            <div
              className="rounded-[28px] border border-white/10 p-7 h-fit"
              style={{
                background:
                  "linear-gradient(180deg, rgba(255,255,255,0.04), rgba(255,255,255,0.02))",
              }}
            >
              <p className="text-[11px] uppercase tracking-[0.22em] text-yellow-400 font-bold mb-6">
                Receptionist
                Avatar
              </p>

              <div className="flex flex-col items-center">

                {/* IMAGE */}
                <div className="w-[220px] h-[280px] rounded-[28px] overflow-hidden border border-white/10 bg-[#2b0202]">

                  {imagePreview ? (
                    <img
                      src={
                        imagePreview
                      }
                      alt="Preview"
                      className="w-full h-full object-cover"
                    />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center text-white/30 text-sm">
                      Không có ảnh
                    </div>
                  )}

                </div>

                {/* BUTTON */}
                <div className="w-full mt-6">

                  <input
                    type="file"
                    accept="image/*"
                    onChange={
                      handleImageChange
                    }
                    className="hidden"
                    id="edit-profile-photo"
                  />

                  <label
                    htmlFor="edit-profile-photo"
                    className="h-12 rounded-2xl border border-white/10 bg-white/[0.03] hover:bg-white/[0.05] transition text-white text-sm font-semibold flex items-center justify-center cursor-pointer"
                  >
                    📷 Chọn Ảnh Mới
                  </label>

                  <p className="text-white/25 text-xs text-center mt-3 leading-relaxed">
                    Ảnh đại diện sẽ
                    hiển thị trên hồ
                    sơ lễ tân trong
                    hệ thống.
                  </p>

                </div>

              </div>
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
                Receptionist
                Information
              </p>

              <div className="grid md:grid-cols-2 gap-5">

                {/* FIRST NAME */}
                <div>
                  <label className="block text-white/35 text-xs uppercase tracking-[0.18em] mb-3">
                    Tên
                  </label>

                  <input
                    type="text"
                    name="firstName"
                    value={
                      formData.firstName
                    }
                    onChange={
                      handleInputChange
                    }
                    required
                    placeholder="Nhập tên"
                    className="w-full h-14 rounded-2xl border border-white/10 bg-white/[0.03] px-5 text-white placeholder:text-white/25 outline-none focus:border-yellow-400/40 transition"
                  />
                </div>

                {/* LAST NAME */}
                <div>
                  <label className="block text-white/35 text-xs uppercase tracking-[0.18em] mb-3">
                    Họ
                  </label>

                  <input
                    type="text"
                    name="lastName"
                    value={
                      formData.lastName
                    }
                    onChange={
                      handleInputChange
                    }
                    required
                    placeholder="Nhập họ"
                    className="w-full h-14 rounded-2xl border border-white/10 bg-white/[0.03] px-5 text-white placeholder:text-white/25 outline-none focus:border-yellow-400/40 transition"
                  />
                </div>

                {/* DEPARTMENT */}
                <div>
                  <label className="block text-white/35 text-xs uppercase tracking-[0.18em] mb-3">
                    Phòng ban
                  </label>

                  <input
                    type="text"
                    name="department"
                    value={
                      formData.department
                    }
                    onChange={
                      handleInputChange
                    }
                    placeholder="Ví dụ: Tiếp nhận..."
                    className="w-full h-14 rounded-2xl border border-white/10 bg-white/[0.03] px-5 text-white placeholder:text-white/25 outline-none focus:border-yellow-400/40 transition"
                  />
                </div>

                {/* PHONE */}
                <div>
                  <label className="block text-white/35 text-xs uppercase tracking-[0.18em] mb-3">
                    Số điện thoại
                  </label>

                  <input
                    type="text"
                    name="phonenumber"
                    value={
                      formData.phonenumber
                    }
                    onChange={
                      handleInputChange
                    }
                    placeholder="Nhập số điện thoại"
                    className="w-full h-14 rounded-2xl border border-white/10 bg-white/[0.03] px-5 text-white placeholder:text-white/25 outline-none focus:border-yellow-400/40 transition"
                  />
                </div>

                {/* EMAIL */}
                <div className="md:col-span-2">
                  <label className="block text-white/35 text-xs uppercase tracking-[0.18em] mb-3">
                    Email
                  </label>

                  <input
                    type="email"
                    name="user.email"
                    value={
                      formData.user.email
                    }
                    onChange={
                      handleInputChange
                    }
                    required
                    placeholder="reception@email.com"
                    className="w-full h-14 rounded-2xl border border-white/10 bg-white/[0.03] px-5 text-white placeholder:text-white/25 outline-none focus:border-yellow-400/40 transition"
                  />
                </div>

              </div>

              {/* ACTIONS */}
              <div className="flex gap-4 mt-8">

                <button
                  type="submit"
                  disabled={saving}
                  className="h-12 px-7 rounded-2xl text-sm font-bold transition hover:scale-[1.02] disabled:opacity-50"
                  style={{
                    background:
                      "#D4A843",
                    color:
                      "#1a0000",
                  }}
                >
                  {saving
                    ? "Đang lưu..."
                    : "Lưu thay đổi"}
                </button>

                <button
                  type="button"
                  onClick={() =>
                    navigate(-1)
                  }
                  className="h-12 px-7 rounded-2xl border border-white/10 text-white/70 hover:text-white hover:bg-white/[0.05] transition text-sm font-semibold"
                >
                  Huỷ
                </button>

              </div>

            </div>
          </div>
        </form>
      </div>
    </div>
  );
}