import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import api from '../services/api';
import { uploadToCloudinary, validateImage } from '../services/cloudinaryUtils';

const PostEditPage = () => {
  const navigate = useNavigate();
  const { id } = useParams();

  const [loading, setLoading] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [initialLoading, setInitialLoading] = useState(true);

  const [formData, setFormData] = useState({
    title: '',
    content: '',
    imageUrl: '',
    published: false,
    active: false,
    promotion: false
  });

  const [previewImage, setPreviewImage] = useState(null);
  const [errors, setErrors] = useState({});

  useEffect(() => {
    const fetchPost = async () => {
      try {
        const response = await api.get(`/posts/${id}`);
        const post = response.data;

        setFormData({
          title: post.title || '',
          content: post.content || '',
          imageUrl: post.imageUrl || '',
          published: post.published || false,
          active: post.active || false,
          promotion: post.promotion || false,
        });

        if (post.imageUrl) {
          // Check if it's already a full URL or just a filename
          if (post.imageUrl.startsWith('http')) {
            setPreviewImage(post.imageUrl);
          } else {
            setPreviewImage(`/uploads/${post.imageUrl}`);
          }
        }
      } catch (error) {
        console.error('Error fetching post:', error);
        alert('Không thể tải bài viết');
        navigate('/posts');
      } finally {
        setInitialLoading(false);
      }
    };

    fetchPost();
  }, [id, navigate]);

  const handleInputChange = (e) => {
    const { name, value, type, checked } = e.target;

    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }));

    if (errors[name]) {
      setErrors(prev => ({
        ...prev,
        [name]: ''
      }));
    }
  };

  const handleFileChange = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    // Validate image
    const validation = validateImage(file);
    if (!validation.valid) {
      alert("Lỗi: " + validation.error);
      return;
    }

    const reader = new FileReader();

    reader.onloadend = () => {
      setPreviewImage(reader.result);
    };

    reader.readAsDataURL(file);

    setUploading(true);

    try {
      // Upload to Cloudinary
      const imageUrl = await uploadToCloudinary(file);

      setFormData(prev => ({
        ...prev,
        imageUrl: imageUrl
      }));
    } catch (error) {
      console.error('Error uploading file:', error);
      alert('Lỗi upload hình ảnh: ' + error.message);
      setPreviewImage(null);
    } finally {
      setUploading(false);
    }
  };

  const validateForm = () => {
    const newErrors = {};

    if (!formData.title.trim()) {
      newErrors.title = 'Vui lòng nhập tiêu đề';
    }

    if (!formData.content.trim()) {
      newErrors.content = 'Vui lòng nhập nội dung';
    }

    setErrors(newErrors);

    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!validateForm()) return;

    setLoading(true);

    try {
      await api.put(`/posts/${id}`, formData);

      alert('Cập nhật bài viết thành công');

      navigate('/posts');
    } catch (error) {
      console.error('Error updating post:', error);

      if (error.response?.data) {
        alert('Lỗi: ' + error.response.data);
      } else {
        alert('Có lỗi xảy ra. Vui lòng thử lại.');
      }
    } finally {
      setLoading(false);
    }
  };

  if (initialLoading) {
    return (
      <div
        className="min-h-screen flex items-center justify-center"
        style={{ backgroundColor: '#1a0000' }}
      >
        <div className="text-center">
          <div
            className="w-14 h-14 border-4 border-yellow-400/30 border-t-yellow-400 rounded-full animate-spin mx-auto mb-4"
          />
          <p className="text-white/60">
            Đang tải bài viết...
          </p>
        </div>
      </div>
    );
  }

  return (
    <div
      className="min-h-screen"
      style={{ backgroundColor: '#1a0000' }}
    >
      {/* TOPBAR */}
      <div className="border-b border-white/10">
        <div className="max-w-[1400px] mx-auto px-6 h-[78px] flex items-center justify-between">
          <div>
            <p className="text-[10px] tracking-[0.25em] uppercase text-yellow-400 font-bold mb-1">
              Luxury Dental CMS
            </p>

            <h1
              className="text-2xl font-black text-white"
              style={{ fontFamily: 'serif' }}
            >
              Chỉnh Sửa Bài Viết
            </h1>
          </div>

          <button
            onClick={() => navigate('/posts')}
            className="h-11 px-5 rounded-full border border-white/10 text-white/70 hover:text-white hover:bg-white/[0.05] transition text-sm font-medium"
          >
            ← Quay lại
          </button>
        </div>
      </div>

      <div className="max-w-[1400px] mx-auto px-6 py-8">
        {/* HERO */}
        <div
          className="relative overflow-hidden rounded-[32px] border border-white/10 p-8 mb-8"
          style={{
            background:
              'linear-gradient(135deg, rgba(255,255,255,0.05), rgba(255,255,255,0.02))'
          }}
        >
          <div
            className="absolute -top-24 -right-24 w-[320px] h-[320px] rounded-full blur-3xl"
            style={{
              background: 'rgba(212,168,67,0.10)'
            }}
          />

          <div className="relative z-10 flex flex-col lg:flex-row lg:items-center lg:justify-between gap-8">
            <div className="max-w-2xl">
              <p className="text-[11px] uppercase tracking-[0.25em] text-yellow-400 font-bold mb-3">
                Post Management
              </p>

              <h2
                className="text-4xl md:text-5xl font-black text-white leading-tight"
                style={{ fontFamily: 'serif' }}
              >
                Chỉnh Sửa
                <br />
                Nội Dung
              </h2>

              <p className="text-white/50 text-sm leading-relaxed mt-5 max-w-xl">
                Cập nhật bài viết quảng cáo, thông báo và nội dung truyền thông
                theo giao diện luxury dental hiện đại.
              </p>
            </div>

            <div className="grid grid-cols-2 gap-4 min-w-[320px]">
              <div className="rounded-2xl border border-white/10 bg-white/[0.04] p-5">
                <p className="text-white/40 text-xs uppercase mb-2">
                  Trạng thái
                </p>

                <h3 className="text-2xl font-black text-green-400">
                  Editing
                </h3>
              </div>

              <div className="rounded-2xl border border-white/10 bg-white/[0.04] p-5">
                <p className="text-white/40 text-xs uppercase mb-2">
                  Upload
                </p>

                <h3 className="text-2xl font-black text-yellow-400">
                  {uploading ? 'Uploading...' : 'Ready'}
                </h3>
              </div>

              <div className="rounded-2xl border border-white/10 bg-white/[0.04] p-5">
                <p className="text-white/40 text-xs uppercase mb-2">
                  Published
                </p>

                <h3 className="text-lg font-black text-white">
                  {formData.published ? 'YES' : 'NO'}
                </h3>
              </div>

              <div className="rounded-2xl border border-white/10 bg-white/[0.04] p-5">
                <p className="text-white/40 text-xs uppercase mb-2">
                  Promotion
                </p>

                <h3 className="text-lg font-black text-white">
                  {formData.promotion ? 'ACTIVE' : 'OFF'}
                </h3>
              </div>
            </div>
          </div>
        </div>

        {/* FORM */}
        <form onSubmit={handleSubmit}>
          <div className="grid lg:grid-cols-[1fr_380px] gap-6">
            {/* LEFT */}
            <div
              className="rounded-[32px] border border-white/10 overflow-hidden"
              style={{
                background:
                  'linear-gradient(180deg, rgba(255,255,255,0.05), rgba(255,255,255,0.03))'
              }}
            >
              <div className="p-8 border-b border-white/10">
                <h3
                  className="text-2xl font-black text-white mb-2"
                  style={{ fontFamily: 'serif' }}
                >
                  Nội Dung Bài Viết
                </h3>

                <p className="text-white/40 text-sm">
                  Chỉnh sửa tiêu đề, mô tả và hình ảnh bài viết.
                </p>
              </div>

              <div className="p-8 space-y-6">
                {/* TITLE */}
                <div>
                  <label className="block text-sm font-bold text-white mb-3 uppercase tracking-[0.15em]">
                    Tiêu đề bài viết
                  </label>

                  <input
                    type="text"
                    name="title"
                    value={formData.title}
                    onChange={handleInputChange}
                    placeholder="Nhập tiêu đề bài viết..."
                    className={`w-full h-14 rounded-2xl px-5 bg-white/[0.04] border text-white placeholder:text-white/30 outline-none transition ${
                      errors.title
                        ? 'border-red-400'
                        : 'border-white/10 focus:border-yellow-400/40'
                    }`}
                  />

                  {errors.title && (
                    <p className="text-red-400 text-sm mt-2">
                      {errors.title}
                    </p>
                  )}
                </div>

                {/* CONTENT */}
                <div>
                  <label className="block text-sm font-bold text-white mb-3 uppercase tracking-[0.15em]">
                    Nội dung
                  </label>

                  <textarea
                    name="content"
                    rows={10}
                    value={formData.content}
                    onChange={handleInputChange}
                    placeholder="Nhập nội dung bài viết..."
                    className={`w-full rounded-2xl px-5 py-4 bg-white/[0.04] border text-white placeholder:text-white/30 outline-none transition resize-none ${
                      errors.content
                        ? 'border-red-400'
                        : 'border-white/10 focus:border-yellow-400/40'
                    }`}
                  />

                  {errors.content && (
                    <p className="text-red-400 text-sm mt-2">
                      {errors.content}
                    </p>
                  )}
                </div>

                {/* IMAGE */}
                <div>
                  <label className="block text-sm font-bold text-white mb-3 uppercase tracking-[0.15em]">
                    Hình ảnh bài viết
                  </label>

                  <div className="border border-dashed border-white/15 rounded-3xl p-6 bg-white/[0.02]">
                    {previewImage ? (
                      <div>
                        <img
                          src={previewImage}
                          alt="Preview"
                          className="w-full h-[320px] object-cover rounded-2xl"
                        />

                        <div className="flex items-center justify-between mt-4">
                          <p className="text-white/40 text-sm">
                            Hình ảnh xem trước
                          </p>

                          <button
                            type="button"
                            onClick={() => {
                              setPreviewImage(null);

                              setFormData(prev => ({
                                ...prev,
                                imageUrl: ''
                              }));
                            }}
                            className="text-red-400 hover:text-red-300 text-sm"
                          >
                            Xóa ảnh
                          </button>
                        </div>
                      </div>
                    ) : (
                      <div className="py-10 text-center">
                        <div className="text-5xl mb-4">
                          🖼️
                        </div>

                        <p className="text-white font-semibold mb-2">
                          Upload hình ảnh bài viết
                        </p>

                        <p className="text-white/40 text-sm mb-6">
                          PNG, JPG hoặc WEBP tối đa 5MB
                        </p>

                        <label
                          htmlFor="imageFile"
                          className="inline-flex items-center justify-center h-12 px-6 rounded-2xl font-bold cursor-pointer transition hover:scale-[1.02]"
                          style={{
                            background: '#D4A843',
                            color: '#1a0000'
                          }}
                        >
                          Chọn hình ảnh
                        </label>

                        <input
                          id="imageFile"
                          type="file"
                          accept="image/*"
                          onChange={handleFileChange}
                          disabled={uploading}
                          className="hidden"
                        />
                      </div>
                    )}

                    {uploading && (
                      <div className="mt-6 flex items-center gap-3 text-yellow-400">
                        <div className="w-5 h-5 border-2 border-yellow-400/30 border-t-yellow-400 rounded-full animate-spin" />
                        <span className="text-sm font-medium">
                          Đang upload hình ảnh...
                        </span>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            </div>

            {/* RIGHT */}
            <div className="space-y-6">
              {/* SETTINGS */}
              <div
                className="rounded-[32px] border border-white/10 overflow-hidden"
                style={{
                  background:
                    'linear-gradient(180deg, rgba(255,255,255,0.05), rgba(255,255,255,0.03))'
                }}
              >
                <div className="p-6 border-b border-white/10">
                  <h3
                    className="text-2xl font-black text-white"
                    style={{ fontFamily: 'serif' }}
                  >
                    Cài Đặt
                  </h3>
                </div>

                <div className="p-6 space-y-5">
                  {/* PUBLISHED */}
                  <label className="flex items-start gap-4 p-4 rounded-2xl border border-white/10 bg-white/[0.03] cursor-pointer">
                    <input
                      type="checkbox"
                      name="published"
                      checked={formData.published}
                      onChange={handleInputChange}
                      className="mt-1 w-5 h-5 accent-yellow-400"
                    />

                    <div>
                      <p className="text-white font-semibold">
                        Xuất bản bài viết
                      </p>

                      <p className="text-white/40 text-sm mt-1">
                        Hiển thị bài viết công khai trên website.
                      </p>
                    </div>
                  </label>

                  {/* ACTIVE */}
                  <label className="flex items-start gap-4 p-4 rounded-2xl border border-white/10 bg-white/[0.03] cursor-pointer">
                    <input
                      type="checkbox"
                      name="active"
                      checked={formData.active}
                      onChange={handleInputChange}
                      className="mt-1 w-5 h-5 accent-yellow-400"
                    />

                    <div>
                      <p className="text-white font-semibold">
                        Bài viết nổi bật
                      </p>

                      <p className="text-white/40 text-sm mt-1">
                        Hiển thị tại khu vực featured ở trang chủ.
                      </p>
                    </div>
                  </label>

                  {/* PROMOTION */}
                  <label className="flex items-start gap-4 p-4 rounded-2xl border border-white/10 bg-white/[0.03] cursor-pointer">
                    <input
                      type="checkbox"
                      name="promotion"
                      checked={formData.promotion}
                      onChange={handleInputChange}
                      className="mt-1 w-5 h-5 accent-yellow-400"
                    />

                    <div>
                      <p className="text-white font-semibold">
                        Khuyến mãi
                      </p>

                      <p className="text-white/40 text-sm mt-1">
                        Đánh dấu bài viết thuộc chương trình ưu đãi.
                      </p>
                    </div>
                  </label>
                </div>
              </div>

              {/* ACTIONS */}
              <div
                className="rounded-[32px] border border-white/10 p-6"
                style={{
                  background:
                    'linear-gradient(180deg, rgba(255,255,255,0.05), rgba(255,255,255,0.03))'
                }}
              >
                <div className="flex flex-col gap-3">
                  <button
                    type="submit"
                    disabled={loading || uploading}
                    className="h-14 rounded-2xl font-black text-sm transition hover:scale-[1.01] disabled:opacity-50"
                    style={{
                      background: '#D4A843',
                      color: '#1a0000'
                    }}
                  >
                    {loading ? 'Đang lưu...' : 'Lưu Thay Đổi'}
                  </button>

                  <button
                    type="button"
                    onClick={() => navigate('/posts')}
                    className="h-14 rounded-2xl border border-white/10 text-white/70 hover:text-white hover:bg-white/[0.05] transition font-semibold"
                  >
                    Hủy chỉnh sửa
                  </button>
                </div>
              </div>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
};

export default PostEditPage;