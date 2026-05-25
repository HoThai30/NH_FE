import React, { useState, useEffect } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import api, { postAPI } from '../services/api';

const PostPromotionPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  
  const [post, setPost] = useState(null);
  const [recentPosts, setRecentPosts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  const [modalOpen, setModalOpen] = useState(false);
  const [booking, setBooking] = useState({
    patientName: '',
    patientPhone: '',
    appointmentTime: '',
    reason: '',
  });
  const [errors, setErrors] = useState({});
  const [submitting, setSubmitting] = useState(false);

  const validateBooking = () => {
    const nextErrors = {};
    if (!booking.patientName.trim()) nextErrors.patientName = 'Vui lòng nhập họ tên';
    if (!booking.patientPhone.trim()) nextErrors.patientPhone = 'Vui lòng nhập số điện thoại';
    if (!booking.appointmentTime) nextErrors.appointmentTime = 'Vui lòng chọn thời gian';

    setErrors(nextErrors);
    return Object.keys(nextErrors).length === 0;
  };

  const handleBookingChange = (e) => {
    const { name, value } = e.target;
    setBooking((prev) => ({ ...prev, [name]: value }));
    if (errors[name]) {
      setErrors((prev) => ({ ...prev, [name]: undefined }));
    }
  };

  const handleBookingSubmit = async (e) => {
    e.preventDefault();
    if (!validateBooking()) return;

    setSubmitting(true);
    try {
      await api.post('/appointments/anonymous', {
        patientName: booking.patientName,
        patientPhone: booking.patientPhone,
        appointmentTime: booking.appointmentTime,
        consultationNeeds: booking.reason,
      });

      alert('Đặt lịch thành công');
      setModalOpen(false);
      setBooking((prev) => ({
        ...prev,
        appointmentTime: '',
        reason: '',
      }));
    } catch (err) {
      alert('Đặt lịch thất bại');
    } finally {
      setSubmitting(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, [id]);

  const fetchData = async () => {
    setLoading(true);
    setError('');
    
    try {
      if (id) {
        // Xem chi tiết bài viết cụ thể
        // const response = await postAPI.getById(id);
        // setPost(response.data);
        
        // Lấy thêm các bài viết gần đây (loại trừ bài hiện tại)
        const recentRes = await postAPI.getAllPromotion();
        const currentId = parseInt(id, 10);
        const uniqueRecent = (recentRes.data || []).reduce((acc, post) => {
          if (post.id !== currentId && !acc.some((item) => item.id === post.id)) {
            acc.push(post);
          }
          return acc;
        }, []);

        setRecentPosts(uniqueRecent.slice(0, 4));
      } else {
        // Xem bài viết nổi bật mới nhất (từ navigation)
        const promotionRes = await postAPI.getAllPromotion();
        
        const allPostsMap = new Map();
        [...(promotionRes.data || [])].forEach((post) => {
          if (!allPostsMap.has(post.id)) {
            allPostsMap.set(post.id, post);
          }
        });
        const allPosts = Array.from(allPostsMap.values());
        // Lấy bài mới nhất
        const latestPost = allPosts.sort((a, b) => 
          new Date(b.createdAt) - new Date(a.createdAt)
        )[0];
        
        if (latestPost) {
          setPost(latestPost);
          // Lấy các bài khác (loại trừ bài đang hiển thị)
          setRecentPosts(
            allPosts
              .filter(p => p.id !== latestPost.id)
              .slice(0, 4)
          );
        }
      }
    } catch (err) {
      console.error('Error fetching post:', err);
      setError('Không thể tải bài viết. Vui lòng thử lại sau.');
    } finally {
      setLoading(false);
    }
  };

  const formatDate = (dateString) => {
    if (!dateString) return '';
    return new Date(dateString).toLocaleDateString('vi-VN', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric'
    });
  };

  const formatPrice = (value) => {
    if (!value) return '';
    return new Intl.NumberFormat('vi-VN', {
      style: 'currency',
      currency: 'VND'
    }).format(value);
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-yellow-50">
        <div className="max-w-[1100px] mx-auto px-4 py-12">
          <div className="animate-pulse">
            <div className="h-8 bg-gray-200 rounded w-1/3 mb-4"></div>
            <div className="h-96 bg-gray-200 rounded mb-8"></div>
            <div className="space-y-3">
              <div className="h-4 bg-gray-200 rounded"></div>
              <div className="h-4 bg-gray-200 rounded"></div>
              <div className="h-4 bg-gray-200 rounded w-5/6"></div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-yellow-50 flex items-center justify-center">
        <div className="text-center">
          <p className="text-red-600 text-lg mb-4">{error}</p>
          <Link to="/" className="text-teal-600 hover:underline">
            ← Quay về trang chủ
          </Link>
        </div>
      </div>
    );
  }

  if (!post) {
    return (
      <div className="min-h-screen bg-yellow-50 flex items-center justify-center">
        <div className="text-center">
          <p className="text-gray-600 text-lg mb-4">Không có bài viết nào</p>
          <Link to="/" className="text-teal-600 hover:underline">
            ← Quay về trang chủ
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-yellow-50">
  {/* Hero Banner */}
  <div
    className="py-10 sm:py-14 md:py-16 text-white"
    style={{ backgroundColor: "#2b0202" }}
  >
    <div className="max-w-[1100px] mx-auto px-4">

      {/* BREADCRUMB */}
      <div className="flex flex-wrap items-center gap-2 text-xs sm:text-sm mb-4">

        <Link
          to="/"
          className="text-yellow-400 hover:underline"
        >
          Trang chủ
        </Link>

        <span className="text-white/50">/</span>

        <span className="text-white/70">
          Tin tức
        </span>

        <span className="text-white/50">/</span>

        <span className="text-white line-clamp-1 break-all">
          {post.title}
        </span>
      </div>

      {/* TITLE */}
      <h1 className="text-2xl sm:text-3xl md:text-4xl font-extrabold leading-tight break-words">
        {post.title}
      </h1>

      {/* META */}
      <div className="flex flex-wrap items-center gap-3 sm:gap-4 mt-4 text-xs sm:text-sm text-white/70">

        <span>
          📅 {formatDate(post.createdAt)}
        </span>

        {post.category && (
          <span>
            📁 {post.category}
          </span>
        )}
      </div>
    </div>
  </div>

  {/* Main Content */}
  <div className="max-w-[1100px] mx-auto px-4 py-6 sm:py-8 md:py-10">

    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 lg:gap-8">

      {/* Article Content */}
      <div className="lg:col-span-2">

        <div className="bg-white rounded-2xl shadow-lg overflow-hidden">

          {/* Featured Image */}
          <div className="relative w-full min-h-[260px] sm:min-h-[380px] md:min-h-[520px] overflow-hidden flex items-center justify-center bg-black">

            {post.imageUrl ? (
              <>
                {/* BLUR BACKGROUND */}
                <img
                  src={post.imageUrl}
                  alt={post.title}
                  className="absolute inset-0 w-full h-full object-cover scale-110 blur-3xl opacity-40"
                  onError={(e) => {
                    e.target.src = "/no-image.png";
                  }}
                />

                {/* DARK OVERLAY */}
                <div
                  className="absolute inset-0"
                  style={{
                    background:
                      "linear-gradient(to top, rgba(0,0,0,0.65), rgba(0,0,0,0.15))",
                  }}
                />

                {/* MAIN IMAGE */}
                <img
                  src={post.imageUrl}
                  alt={post.title}
                  className="relative z-10 max-w-full max-h-[260px] sm:max-h-[420px] md:max-h-[520px] object-contai rounded-xl sm:rounded-2xl shadow-2xl px-2"
                  onError={(e) => {
                    e.target.src = "/no-image.png";
                  }}
                />
              </>
            ) : (
              <div className="w-full h-[260px] sm:h-[420px] flex items-center justify-center text-white/30 text-5xl sm:text-6xl">
                🦷
              </div>
            )}

            {/* CATEGORY */}
            {post.category && (
              <div
                className="absolute top-3 sm:top-5 left-3 sm:left-5 z-20 px-3 sm:px-4 py-1.5 sm:py-2 rounded-full text-xs sm:text-sm font-bold text-white  backdrop-blur-md"
                style={{
                  background: "rgba(212,168,67,0.25)",
                  border: "1px solid rgba(255,255,255,0.15)",
                }}
              >
                {post.category}
              </div>
            )}
          </div>

          {/* Content */}
          <div className="p-4 sm:p-6 md:p-8">

            <h2 className="text-lg sm:text-xl font-bold text-gray-800 mb-4 break-words">
              {post.title}
            </h2>

            <div className="text-gray-600 leading-relaxed space-y-4">

              {post.description && (
                <p className="text-sm sm:text-base md:text-lg font-medium text-gray-700 border-l-4 border-teal-600 pl-4 break-words">
                  {post.description}
                </p>
              )}

              {post.content ? (
                <div
                  className="prose prose-sm sm:prose-base max-w-none overflow-hidden break-words prose-img:rounded-xl prose-img:w-full prose-img:max-w-full  prose-img:h-auto prose-table:block prose-table:overflow-x-auto"
                  dangerouslySetInnerHTML={{
                    __html: post.content,
                  }}
                />
              ) : (
                <p className="text-gray-500 italic text-sm sm:text-base">
                  Nội dung đang được cập nhật...
                </p>
              )}
            </div>

            {/* Price if available */}
            {post.price && (
              <div
                className="mt-6 sm:mt-8 p-4 sm:p-6 rounded-xl"
                style={{ backgroundColor: "#f5ede6" }}
              >
                <p className="text-xs sm:text-sm font-semibold text-gray-600 mb-2">
                  Giá dịch vụ:
                </p>

                <p
                  className="text-2xl sm:text-3xl font-black break-words"
                  style={{ color: "#2b0202" }}
                >
                  {formatPrice(post.price)}
                </p>
              </div>
            )}

            {/* Back Button */}
            <div className="mt-6 sm:mt-8 pt-6 border-t">

              <button
                onClick={() => navigate(-1)}
                className="flex items-center gap-2 text-sm sm:text-base text-teal-600 hover:text-teal-800 transition"
              >
                ← Quay lại
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Sidebar */}
      <div className="lg:col-span-1">

        {/* Recent Posts */}
        <div className="bg-white rounded-2xl shadow-lg p-4 sm:p-6">

          <h3 className="text-base sm:text-lg font-bold text-gray-800 mb-4 pb-3 border-b">
            Tin tức khác
          </h3>

          <div className="space-y-4">

            {recentPosts.length > 0 ? (
              recentPosts.map((p) => (
                <Link
                  key={p.id}
                  to={`/posts/${p.id}`}
                  className="flex gap-3 group"
                >
                  {/* IMAGE */}
                  <div className="w-20 h-16 sm:w-24 sm:h-20 rounded-lg overflow-hidden flex-shrink-0">

                    {p.imageUrl ? (
                      <img
                        src={p.imageUrl}
                        alt={p.title}
                        className="w-full h-full object-cover group-hover:scale-110 transition"
                        onError={(e) => {
                          e.target.src =
                            "https://via.placeholder.com/80x64?text=No+Image";
                        }}
                      />
                    ) : (
                      <div className="w-full h-full bg-gray-100 flex items-center justify-center">
                        <span className="text-xl">
                          📰
                        </span>
                      </div>
                    )}
                  </div>

                  {/* TEXT */}
                  <div className="flex-1 min-w-0">

                    <p className="text-xs sm:text-sm font-semibold text-gray-800 line-clamp-2 group-hover:text-teal-600 transition">
                      {p.title}
                    </p>

                    <p className="text-[11px] sm:text-xs text-gray-500 mt-1">
                      {formatDate(p.createdAt)}
                    </p>
                  </div>
                </Link>
              ))
            ) : (
              <p className="text-gray-500 text-sm">
                Không có tin tức khác
              </p>
            )}
          </div>

          {/* View All Link */}
          <Link
            to="/"
            className="block mt-6 text-center text-sm font-semibold text-teal-600 hover:text-teal-800 transition"
          >
            Xem tất cả tin tức →
          </Link>
        </div>

        {/* Contact Box */}
        <div className="bg-white rounded-2xl shadow-lg p-4 sm:p-6 mt-6">

          <h3 className="text-base sm:text-lg font-bold text-gray-800 mb-4">
            Đặt lịch khám
          </h3>

          <p className="text-gray-600 text-sm leading-relaxed mb-4">
            Liên hệ ngay để được tư vấn miễn phí về các dịch vụ nha khoa.
          </p>

          <button
            onClick={() => setModalOpen(true)}
            className="w-full mt-2 text-white px-6 py-3 rounded-xl transition hover:opacity-90 text-sm sm:text-base font-semibold"
            style={{ backgroundColor: "#D4A843" }}
          >
            Đặt lịch khám
          </button>
        </div>
      </div>
    </div>
  </div>

      {modalOpen && (
              <div className="fixed inset-0 z-[999] bg-black/60 backdrop-blur-sm flex items-center justify-center p-3 sm:p-5">

                {/* MODAL */}
                <div className="relative w-full max-w-lg bg-white rounded-2xl sm:rounded-3xl shadow-2xl overflow-hidden animate-fadeIn">

                  {/* HEADER */}
                  <div
                    className="px-5 sm:px-7 py-5 sm:py-6 text-white"
                    style={{
                      background:
                        "linear-gradient(135deg, #2b0202 0%, #4a0505 100%)",
                    }}
                  >
                    <div className="flex items-start justify-between gap-4">

                      <div>
                        <p className="text-yellow-400 text-[11px] sm:text-xs uppercase tracking-[0.2em] font-bold mb-2">
                          Nha Khoa Quốc Tế Á Châu II
                        </p>

                        <h2 className="text-xl sm:text-2xl font-black">
                          Đặt lịch khám
                        </h2>

                        <p className="text-white/70 text-xs sm:text-sm mt-2">
                          Vui lòng điền thông tin để được tư vấn nhanh nhất
                        </p>
                      </div>

                      {/* CLOSE */}
                      <button
                        onClick={() => setModalOpen(false)}
                        className="w-9 h-9 rounded-full bg-white/10 hover:bg-white/20 transition flex items-center justify-center text-white text-lg flex-shrink-0"
                      >
                        ✕
                      </button>
                    </div>
                  </div>

                  {/* BODY */}
                  <div className="p-5 sm:p-7 max-h-[80vh] overflow-y-auto">

                    <form
                      onSubmit={handleBookingSubmit}
                      className="space-y-5"
                    >

                      {/* PHONE */}
                      <div>
                        <label className="block text-sm font-semibold text-gray-700 mb-2">
                          Số điện thoại
                        </label>

                        <input
                          name="patientPhone"
                          value={booking.patientPhone}
                          onChange={handleBookingChange}
                          placeholder="Nhập số điện thoại"
                          className="w-full h-12 sm:h-13 rounded-xl border border-gray-200 bg-gray-50 px-4 text-sm outline-none transition focus:border-yellow-500 focus:bg-white focus:ring-4 focus:ring-yellow-100"
                        />

                        {errors.patientPhone && (
                          <p className="text-red-500 text-xs mt-2">
                            {errors.patientPhone}
                          </p>
                        )}
                      </div>

                      {/* NAME */}
                      <div>
                        <label className="block text-sm font-semibold text-gray-700 mb-2">
                          Họ và tên
                        </label>

                        <input
                          name="patientName"
                          value={booking.patientName}
                          onChange={handleBookingChange}
                          placeholder="Nhập họ và tên"
                          className="w-full h-12 sm:h-13 rounded-xl border border-gray-200 bg-gray-50 px-4 text-sm outline-none transition  focus:border-yellow-500 focus:bg-white focus:ring-4 focus:ring-yellow-100"
                        />

                        {errors.patientName && (
                          <p className="text-red-500 text-xs mt-2">
                            {errors.patientName}
                          </p>
                        )}
                      </div>

                      {/* DATETIME */}
                      <div>
                        <label className="block text-sm font-semibold text-gray-700 mb-2">
                          Ngày giờ khám
                        </label>

                        <div className="relative">

                          <input
                            type="datetime-local"
                            name="appointmentTime"
                            value={booking.appointmentTime}
                            onChange={handleBookingChange}
                            className="w-full min-h-[52px] rounded-xl border border-gray-200 bg-gray-50 px-4 text-sm outline-none transition focus:border-yellow-500 focus:bg-white focus:ring-4 focus:ring-yellow-100
                              appearance-none
                              text-gray-700

                              [&::-webkit-calendar-picker-indicator]:opacity-100
                              [&::-webkit-calendar-picker-indicator]:cursor-pointer
                              [&::-webkit-calendar-picker-indicator]:block
                              [&::-webkit-calendar-picker-indicator]:absolute
                              [&::-webkit-calendar-picker-indicator]:right-4
                            "
                          />
                        </div>

                        <p className="text-[11px] text-gray-400 mt-2">
                          Chọn ngày và giờ bạn muốn đặt lịch
                        </p>

                        {errors.appointmentTime && (
                          <p className="text-red-500 text-xs mt-2">
                            {errors.appointmentTime}
                          </p>
                        )}
                      </div>

                      {/* REASON */}
                      <div>
                        <label className="block text-sm font-semibold text-gray-700 mb-2">
                          Lý do khám
                        </label>

                        <textarea
                          name="reason"
                          value={booking.reason}
                          onChange={handleBookingChange}
                          placeholder="Mô tả tình trạng hoặc nhu cầu khám..."
                          rows="4"
                          className=" w-full rounded-xl border border-gray-200 bg-gray-50 px-4 py-3 text-sm outline-none transition resize-none  focus:border-yellow-500 focus:bg-white focus:ring-4 focus:ring-yellow-100"
                        />
                      </div>

                      {/* BUTTONS */}
                      <div className="flex flex-col-reverse sm:flex-row justify-end gap-3 pt-2">

                        <button
                          type="button"
                          onClick={() => setModalOpen(false)}
                          className=" w-full sm:w-auto px-5 h-11 rounded-xl border border-gray-300 text-gray-700 font-semibold hover:bg-gray-100  transition"
                        >
                          Hủy
                        </button>

                        <button
                          type="submit"
                          disabled={submitting}
                          className=" w-full sm:w-auto px-6 h-11 rounded-xl text-white font-bold shadow-lg transition hover:scale-[1.02] disabled:opacity-60 disabled:cursor-not-allowed"
                          style={{
                            background:
                              "linear-gradient(135deg, #D4A843 0%, #b98d2d 100%)",
                          }}
                        >
                          {submitting ? "Đang gửi..." : "Xác nhận đặt lịch"}
                        </button>
                      </div>
                    </form>
                  </div>
                </div>
              </div>
            )}
    </div>
  );
};

export default PostPromotionPage;