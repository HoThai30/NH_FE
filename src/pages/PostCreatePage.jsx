import React, { useState } from "react";

import { useNavigate } from "react-router-dom";

import api from "../services/api";

const PostCreatePage = () => {
  const navigate = useNavigate();

  const [loading, setLoading] =
    useState(false);

  const [uploading, setUploading] =
    useState(false);

  const [formData, setFormData] =
    useState({
      title: "",
      content: "",
      imageUrl: "",
      published: false,
      active: false,
      promotion: false,
    });

  const [previewImage, setPreviewImage] =
    useState(null);

  const [errors, setErrors] =
    useState({});

  const handleInputChange = (e) => {
    const {
      name,
      value,
      type,
      checked,
    } = e.target;

    setFormData((prev) => ({
      ...prev,
      [name]:
        type === "checkbox"
          ? checked
          : value,
    }));

    if (errors[name]) {
      setErrors((prev) => ({
        ...prev,
        [name]: "",
      }));
    }
  };

  const handleFileChange = async (
    e
  ) => {
    const file = e.target.files[0];

    if (!file) return;

    if (
      !file.type.startsWith(
        "image/"
      )
    ) {
      alert(
        "Vui lòng chọn file hình ảnh"
      );
      return;
    }

    if (
      file.size >
      5 * 1024 * 1024
    ) {
      alert(
        "Kích thước file không được vượt quá 5MB"
      );
      return;
    }

    const reader = new FileReader();

    reader.onloadend = () => {
      setPreviewImage(
        reader.result
      );
    };

    reader.readAsDataURL(file);

    setUploading(true);

    try {
      const formDataFile =
        new FormData();

      formDataFile.append(
        "file",
        file
      );

      const response =
        await api.post(
          "/posts/upload",
          formDataFile
        );

      const filename =
        response.data?.filename ||
        response.data;

      if (
        !filename ||
        typeof filename !==
          "string"
      ) {
        throw new Error(
          "Không nhận được tên file từ server."
        );
      }

      setFormData((prev) => ({
        ...prev,
        imageUrl: filename,
      }));
    } catch (error) {
      console.error(
        "Error uploading file:",
        error
      );

      alert(
        "Lỗi upload hình ảnh: " +
          (error.response?.data ||
            error.message)
      );

      setPreviewImage(null);
    } finally {
      setUploading(false);
    }
  };

  const validateForm = () => {
    const newErrors = {};

    if (!formData.title.trim()) {
      newErrors.title =
        "Vui lòng nhập tiêu đề";
    }

    if (
      !formData.content.trim()
    ) {
      newErrors.content =
        "Vui lòng nhập nội dung";
    }

    setErrors(newErrors);

    return (
      Object.keys(newErrors)
        .length === 0
    );
  };

  const handleSubmit = async (
    e
  ) => {
    e.preventDefault();

    if (!validateForm()) return;

    setLoading(true);

    try {
      const payload = {
        title:
          formData.title.trim(),

        content:
          formData.content.trim(),

        imageUrl:
          formData.imageUrl ||
          null,

        published:
          formData.published,

        active:
          formData.active,

        promotion:
          formData.promotion,
      };

      await api.post(
        "/posts",
        payload,
        {
          headers: {
            "Content-Type":
              "application/json",
          },
        }
      );

      navigate("/posts");
    } catch (error) {
      console.error(
        "Error creating post:",
        error
      );

      if (
        error.response?.data
      ) {
        alert(
          "Lỗi: " +
            JSON.stringify(
              error.response.data
            )
        );
      } else {
        alert(
          "Có lỗi xảy ra. Vui lòng thử lại."
        );
      }
    } finally {
      setLoading(false);
    }
  };

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
              Content Management
            </p>

            <h1
              className="text-2xl font-black text-white"
              style={{
                fontFamily:
                  "serif",
              }}
            >
              Tạo Bài Viết
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
                Luxury Dental CMS
              </p>

              <h2
                className="text-4xl md:text-5xl font-black text-white leading-tight"
                style={{
                  fontFamily:
                    "serif",
                }}
              >
                Tạo Nội Dung
                <br />
                Mới
              </h2>

              <p className="text-white/50 text-sm leading-relaxed mt-5 max-w-xl">
                Quản lý bài viết,
                quảng bá dịch vụ và
                nội dung truyền
                thông nha khoa theo
                phong cách luxury
                hiện đại.
              </p>
            </div>

            {/* STATS */}
            <div className="grid grid-cols-2 gap-4 min-w-[320px]">

              <div className="rounded-2xl border border-white/10 bg-white/[0.03] p-5">
                <p className="text-white/40 text-xs uppercase mb-2">
                  Type
                </p>

                <h3 className="text-2xl font-black text-white">
                  Post
                </h3>
              </div>

              <div className="rounded-2xl border border-white/10 bg-white/[0.03] p-5">
                <p className="text-white/40 text-xs uppercase mb-2">
                  Upload
                </p>

                <h3 className="text-2xl font-black text-green-400">
                  Enabled
                </h3>
              </div>

              <div className="rounded-2xl border border-white/10 bg-white/[0.03] p-5">
                <p className="text-white/40 text-xs uppercase mb-2">
                  Theme
                </p>

                <h3 className="text-lg font-black text-yellow-400">
                  Luxury
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
        <form onSubmit={handleSubmit}>

          <div className="grid lg:grid-cols-[420px,1fr] gap-6">

            {/* LEFT */}
            <div
              className="rounded-[30px] border border-white/10 p-7 h-fit"
              style={{
                background:
                  "linear-gradient(180deg, rgba(255,255,255,0.04), rgba(255,255,255,0.02))",
              }}
            >
              <p className="text-[11px] uppercase tracking-[0.22em] text-yellow-400 font-bold mb-6">
                Thumbnail Preview
              </p>

              <div className="rounded-[28px] overflow-hidden border border-white/10 bg-[#2b0202] h-[380px]">

                {previewImage ? (
                  <img
                    src={
                      previewImage
                    }
                    alt="Preview"
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <div className="w-full h-full flex flex-col items-center justify-center text-white/30 px-6 text-center">

                    <div className="text-5xl mb-4">
                      🖼️
                    </div>

                    <p className="text-sm">
                      Chưa có ảnh bài
                      viết
                    </p>

                  </div>
                )}

              </div>

              {/* UPLOAD */}
              <div className="mt-6">

                <input
                  id="imageFile"
                  type="file"
                  accept="image/*"
                  onChange={
                    handleFileChange
                  }
                  disabled={
                    uploading
                  }
                  className="hidden"
                />

                <label
                  htmlFor="imageFile"
                  className="h-12 rounded-2xl border border-white/10 bg-white/[0.03] hover:bg-white/[0.05] transition text-white text-sm font-semibold flex items-center justify-center cursor-pointer"
                >
                  {uploading
                    ? "Đang upload..."
                    : "📷 Chọn Ảnh"}
                </label>

                <p className="text-white/25 text-xs text-center mt-3 leading-relaxed">
                  Hỗ trợ PNG, JPG,
                  GIF tối đa 5MB.
                </p>

              </div>

              {/* SWITCHES */}
              <div className="space-y-4 mt-8">

                {/* PUBLISHED */}
                <label className="flex items-start gap-4 rounded-2xl border border-white/10 bg-white/[0.03] p-4 cursor-pointer">

                  <input
                    type="checkbox"
                    name="published"
                    checked={
                      formData.published
                    }
                    onChange={
                      handleInputChange
                    }
                    className="mt-1 h-4 w-4"
                  />

                  <div>
                    <p className="text-white font-semibold text-sm">
                      Xuất bản ngay
                    </p>

                    <p className="text-white/40 text-xs mt-1">
                      Hiển thị công
                      khai ngay sau
                      khi tạo.
                    </p>
                  </div>

                </label>

                {/* ACTIVE */}
                <label className="flex items-start gap-4 rounded-2xl border border-white/10 bg-white/[0.03] p-4 cursor-pointer">

                  <input
                    type="checkbox"
                    name="active"
                    checked={
                      formData.active
                    }
                    onChange={
                      handleInputChange
                    }
                    className="mt-1 h-4 w-4"
                  />

                  <div>
                    <p className="text-white font-semibold text-sm">
                      Bài viết nổi
                      bật
                    </p>

                    <p className="text-white/40 text-xs mt-1">
                      Hiển thị tại
                      khu vực nổi bật
                      trang chủ.
                    </p>
                  </div>

                </label>

                {/* PROMOTION */}
                <label className="flex items-start gap-4 rounded-2xl border border-white/10 bg-white/[0.03] p-4 cursor-pointer">

                  <input
                    type="checkbox"
                    name="promotion"
                    checked={
                      formData.promotion
                    }
                    onChange={
                      handleInputChange
                    }
                    className="mt-1 h-4 w-4"
                  />

                  <div>
                    <p className="text-white font-semibold text-sm">
                      Khuyến mãi
                    </p>

                    <p className="text-white/40 text-xs mt-1">
                      Đánh dấu bài
                      viết ưu đãi hoặc
                      giảm giá.
                    </p>
                  </div>

                </label>

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
              <p className="text-[11px] uppercase tracking-[0.22em] text-yellow-400 font-bold mb-6">
                Post Information
              </p>

              {/* TITLE */}
              <div className="mb-6">

                <label className="block text-white/35 text-xs uppercase tracking-[0.18em] mb-3">
                  Tiêu đề bài viết
                </label>

                <input
                  type="text"
                  name="title"
                  value={
                    formData.title
                  }
                  onChange={
                    handleInputChange
                  }
                  placeholder="Nhập tiêu đề bài viết..."
                  className={`w-full h-14 rounded-2xl border bg-white/[0.03] px-5 text-white placeholder:text-white/25 outline-none transition ${
                    errors.title
                      ? "border-red-500/40"
                      : "border-white/10 focus:border-yellow-400/40"
                  }`}
                />

                {errors.title && (
                  <p className="text-red-400 text-sm mt-2">
                    {
                      errors.title
                    }
                  </p>
                )}

              </div>

              {/* CONTENT */}
              <div>

                <label className="block text-white/35 text-xs uppercase tracking-[0.18em] mb-3">
                  Nội dung bài viết
                </label>

                <textarea
                  name="content"
                  rows={14}
                  value={
                    formData.content
                  }
                  onChange={
                    handleInputChange
                  }
                  placeholder="Nhập nội dung bài viết..."
                  className={`w-full rounded-[24px] border bg-white/[0.03] px-5 py-4 text-white placeholder:text-white/25 outline-none transition resize-none ${
                    errors.content
                      ? "border-red-500/40"
                      : "border-white/10 focus:border-yellow-400/40"
                  }`}
                />

                {errors.content && (
                  <p className="text-red-400 text-sm mt-2">
                    {
                      errors.content
                    }
                  </p>
                )}

              </div>

              {/* ACTIONS */}
              <div className="flex gap-4 mt-8">

                <button
                  type="button"
                  onClick={() =>
                    navigate(
                      "/posts"
                    )
                  }
                  className="h-12 px-6 rounded-2xl border border-white/10 text-white/70 hover:text-white hover:bg-white/[0.05] transition text-sm font-semibold"
                >
                  Hủy
                </button>

                <button
                  type="submit"
                  disabled={
                    loading ||
                    uploading
                  }
                  className="h-12 px-7 rounded-2xl text-sm font-bold transition hover:scale-[1.02] disabled:opacity-50"
                  style={{
                    background:
                      "#D4A843",
                    color:
                      "#1a0000",
                  }}
                >
                  {loading
                    ? "Đang lưu..."
                    : "Lưu bài viết"}
                </button>

              </div>

            </div>
          </div>
        </form>
      </div>
    </div>
  );
};

export default PostCreatePage;