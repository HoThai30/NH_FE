import React, { useState, useEffect } from "react";
import { useNavigate, Link } from "react-router-dom";
import api from "../services/api";

const PostListPage = () => {
  const [posts, setPosts] = useState([]);
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    fetchPosts();
  }, []);

  const fetchPosts = async () => {
    try {
      const response = await api.get("/posts/admin");
      setPosts(response.data);
    } catch (error) {
      console.error("Error fetching posts:", error);
      setError(error.response?.data || "Không thể tải dữ liệu bài viết");
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm("Bạn có chắc muốn xóa bài viết này?")) return;

    try {
      await api.delete(`/posts/${id}`);
      setPosts(posts.filter((post) => post.id !== id));
    } catch (error) {
      console.error("Error deleting post:", error);
      alert("Có lỗi xảy ra khi xóa bài viết");
    }
  };

  const togglePublished = async (post) => {
    try {
      const updatedPost = {
        ...post,
        published: !post.published,
      };

      await api.put(`/posts/${post.id}`, updatedPost);

      setPosts(
        posts.map((p) =>
          p.id === post.id ? updatedPost : p
        )
      );
    } catch (error) {
      console.error("Error updating post:", error);
      alert("Có lỗi xảy ra khi cập nhật trạng thái");
    }
  };

  const toggleActive = async (post) => {
    try {
      const updatedPost = {
        ...post,
        active: !post.active,
      };

      await api.put(`/posts/${post.id}`, updatedPost);

      setPosts(
        posts.map((p) =>
          p.id === post.id ? updatedPost : p
        )
      );
    } catch (error) {
      console.error("Error updating post:", error);
      alert("Có lỗi xảy ra khi cập nhật trạng thái nổi bật");
    }
  };

  const togglePromotion = async (post) => {
    try {
      const updatedPost = {
        ...post,
        promotion: !post.promotion,
      };

      await api.put(`/posts/${post.id}`, updatedPost);

      setPosts(
        posts.map((p) =>
          p.id === post.id ? updatedPost : p
        )
      );
    } catch (error) {
      console.error("Error updating post:", error);
      alert("Có lỗi xảy ra khi cập nhật trạng thái khuyến mãi");
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
              Luxury Dental CMS
            </p>

            <h1
              className="text-2xl text-white font-black"
              style={{ fontFamily: "serif" }}
            >
              Quản Lý Bài Viết
            </h1>
          </div>

          {/* RIGHT */}
          <div className="flex items-center gap-3">
            <button
              onClick={() => navigate("/dashboard")}
              className="h-11 px-5 rounded-full border border-white/10 text-white/70 hover:text-white hover:bg-white/[0.05] transition text-sm font-medium"
            >
              ← Quay lại
            </button>

            <Link
              to="/posts/create"
              className="h-11 px-5 rounded-full text-sm font-bold flex items-center justify-center transition hover:scale-[1.02]"
              style={{
                background: "#D4A843",
                color: "#1a0000",
              }}
            >
              + Thêm bài viết
            </Link>
          </div>
        </div>
      </div>

      {/* CONTENT */}
      <div className="max-w-[1400px] mx-auto px-6 py-8">

        {/* HERO */}
        <div
          className="relative overflow-hidden rounded-[28px] border border-white/10 p-8 mb-8"
          style={{
            background:
              "linear-gradient(135deg, rgba(255,255,255,0.05), rgba(255,255,255,0.02))",
          }}
        >
          {/* GLOW */}
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
                Content Management
              </p>

              <h2
                className="text-4xl md:text-5xl font-black text-white leading-tight"
                style={{ fontFamily: "serif" }}
              >
                Hệ Thống
                <br />
                Bài Viết
              </h2>

              <p className="text-white/50 text-sm leading-relaxed mt-5 max-w-xl">
                Quản lý bài viết quảng cáo, thông báo và nội dung truyền thông
                theo phong cách luxury dental dashboard hiện đại.
              </p>
            </div>

            {/* STATS */}
            <div className="grid grid-cols-2 gap-4 min-w-[320px]">

              <div className="rounded-2xl border border-white/10 bg-white/[0.03] p-5">
                <p className="text-white/40 text-xs uppercase mb-2">
                  Tổng bài viết
                </p>

                <h3 className="text-3xl font-black text-white">
                  {posts.length}
                </h3>
              </div>

              <div className="rounded-2xl border border-white/10 bg-white/[0.03] p-5">
                <p className="text-white/40 text-xs uppercase mb-2">
                  Đã xuất bản
                </p>

                <h3 className="text-3xl font-black text-green-400">
                  {posts.filter((p) => p.published).length}
                </h3>
              </div>

              <div className="rounded-2xl border border-white/10 bg-white/[0.03] p-5">
                <p className="text-white/40 text-xs uppercase mb-2">
                  Nổi bật
                </p>

                <h3 className="text-3xl font-black text-blue-400">
                  {posts.filter((p) => p.active).length}
                </h3>
              </div>

              <div className="rounded-2xl border border-white/10 bg-white/[0.03] p-5">
                <p className="text-white/40 text-xs uppercase mb-2">
                  Khuyến mãi
                </p>

                <h3 className="text-3xl font-black text-yellow-400">
                  {posts.filter((p) => p.promotion).length}
                </h3>
              </div>

            </div>
          </div>
        </div>

        {/* LOADING */}
        {loading && (
          <div className="py-24 flex justify-center">
            <div
              className="w-14 h-14 rounded-full border-2 border-yellow-400/20 border-t-yellow-400 animate-spin"
            />
          </div>
        )}

        {/* ERROR */}
        {error && (
          <div className="rounded-3xl border border-red-500/20 bg-red-500/10 p-6 text-red-300">
            {error}
          </div>
        )}

        {/* EMPTY */}
        {!loading && !error && posts.length === 0 && (
          <div className="rounded-3xl border border-white/10 bg-white/[0.03] py-24 text-center">
            <p className="text-white/40 mb-5">
              Chưa có bài viết nào trong hệ thống
            </p>

            <Link
              to="/posts/create"
              className="inline-flex items-center justify-center h-11 px-5 rounded-full font-bold"
              style={{
                background: "#D4A843",
                color: "#1a0000",
              }}
            >
              + Tạo bài viết đầu tiên
            </Link>
          </div>
        )}

        {/* TABLE */}
        {!loading && !error && posts.length > 0 && (
          <div
            className="overflow-hidden rounded-[28px] border border-white/10"
            style={{
              background:
                "linear-gradient(180deg, rgba(255,255,255,0.04), rgba(255,255,255,0.02))",
            }}
          >

            <div className="overflow-x-auto">

              <table className="min-w-full">

                <thead className="border-b border-white/10">
                  <tr>

                    <th className="px-6 py-5 text-left text-[11px] uppercase tracking-[0.18em] text-white/40">
                      Tiêu đề
                    </th>

                    <th className="px-6 py-5 text-left text-[11px] uppercase tracking-[0.18em] text-white/40">
                      Xuất bản
                    </th>

                    <th className="px-6 py-5 text-left text-[11px] uppercase tracking-[0.18em] text-white/40">
                      Nổi bật
                    </th>

                    <th className="px-6 py-5 text-left text-[11px] uppercase tracking-[0.18em] text-white/40">
                      Khuyến mãi
                    </th>

                    <th className="px-6 py-5 text-left text-[11px] uppercase tracking-[0.18em] text-white/40">
                      Ngày tạo
                    </th>

                    <th className="px-6 py-5 text-right text-[11px] uppercase tracking-[0.18em] text-white/40">
                      Hành động
                    </th>

                  </tr>
                </thead>

                <tbody>
                  {posts.map((post, index) => (
                    <tr
                      key={post.id}
                      className={`border-b border-white/5 hover:bg-white/[0.03] transition ${
                        index === posts.length - 1
                          ? "border-b-0"
                          : ""
                      }`}
                    >

                      {/* TITLE */}
                      <td className="px-6 py-5">
                        <div>
                          <p className="text-white font-semibold line-clamp-1">
                            {post.title}
                          </p>

                          <p className="text-white/35 text-xs mt-1">
                            ID #{post.id}
                          </p>
                        </div>
                      </td>

                      {/* PUBLISHED */}
                      <td className="px-6 py-5">
                        <button
                          onClick={() => togglePublished(post)}
                          className={`h-8 px-4 rounded-full text-xs font-bold transition ${
                            post.published
                              ? "bg-green-500/15 text-green-400 border border-green-500/20"
                              : "bg-white/[0.05] text-white/40 border border-white/10"
                          }`}
                        >
                          {post.published ? "Published" : "Draft"}
                        </button>
                      </td>

                      {/* ACTIVE */}
                      <td className="px-6 py-5">
                        <button
                          onClick={() => toggleActive(post)}
                          className={`h-8 px-4 rounded-full text-xs font-bold transition ${
                            post.active
                              ? "bg-blue-500/15 text-blue-400 border border-blue-500/20"
                              : "bg-white/[0.05] text-white/40 border border-white/10"
                          }`}
                        >
                          {post.active ? "Featured" : "Hidden"}
                        </button>
                      </td>

                      {/* PROMOTION */}
                      <td className="px-6 py-5">
                        <button
                          onClick={() => togglePromotion(post)}
                          className={`h-8 px-4 rounded-full text-xs font-bold transition ${
                            post.promotion
                              ? "bg-yellow-500/15 text-yellow-400 border border-yellow-500/20"
                              : "bg-white/[0.05] text-white/40 border border-white/10"
                          }`}
                        >
                          {post.promotion ? "Promotion" : "Normal"}
                        </button>
                      </td>

                      {/* DATE */}
                      <td className="px-6 py-5 text-sm text-white/50">
                        {new Date(
                          post.createdAt || post.updatedAt
                        ).toLocaleString("vi-VN")}
                      </td>

                      {/* ACTIONS */}
                      <td className="px-6 py-5">
                        <div className="flex justify-end gap-2">

                          <Link
                            to={`/posts/${post.id}/edit`}
                            className="h-10 px-4 rounded-xl text-sm font-bold flex items-center justify-center transition hover:scale-[1.02]"
                            style={{
                              background: "#D4A843",
                              color: "#1a0000",
                            }}
                          >
                            Sửa
                          </Link>

                          <button
                            onClick={() => handleDelete(post.id)}
                            className="h-10 px-4 rounded-xl border border-red-500/20 bg-red-500/10 text-red-400 text-sm font-bold hover:bg-red-500/20 transition"
                          >
                            Xóa
                          </button>

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
};

export default PostListPage;