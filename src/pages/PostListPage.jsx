import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Link } from 'react-router-dom';
import api from '../services/api';

const PostListPage = () => {
  const [posts, setPosts] = useState([]);
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    fetchPosts();
  }, []);

  const fetchPosts = async () => {
    try {
      const response = await api.get('/posts/admin');
      setPosts(response.data);
    } catch (error) {
      console.error('Error fetching posts:', error);
      setError(error.response?.data || 'Không thể tải dữ liệu bài viết');
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Bạn có chắc muốn xóa bài viết này?')) return;

    try {
      await api.delete(`/posts/${id}`);
      setPosts(posts.filter(post => post.id !== id));
    } catch (error) {
      console.error('Error deleting post:', error);
      alert('Có lỗi xảy ra khi xóa bài viết');
    }
  };

  const togglePublished = async (post) => {
    try {
      const updatedPost = { ...post, published: !post.published };
      await api.put(`/posts/${post.id}`, updatedPost);
      setPosts(posts.map(p => p.id === post.id ? updatedPost : p));
    } catch (error) {
      console.error('Error updating post:', error);
      alert('Có lỗi xảy ra khi cập nhật trạng thái');
    }
  };

  const toggleActive = async (post) => {
    try {
      const updatedPost = { ...post, active: !post.active };
      await api.put(`/posts/${post.id}`, updatedPost);
      setPosts(posts.map(p => p.id === post.id ? updatedPost : p));
    } catch (error) {
      console.error('Error updating post:', error);
      alert('Có lỗi xảy ra khi cập nhật trạng thái nổi bật');
    }
  };
  const togglePromotion = async (post) => {
    try {
      const updatedPost = { ...post, promotion: !post.promotion };
      await api.put(`/posts/${post.id}`, updatedPost);
      setPosts(posts.map(p => p.id === post.id ? updatedPost : p));
    } catch (error) {
      console.error('Error updating post:', error);
      alert('Có lỗi xảy ra khi cập nhật trạng thái khuyến mãi');
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  return (
    <div className="px-4 sm:px-6 lg:px-8">
      <div className="sm:flex sm:items-center">
        <div className="sm:flex-auto">
          <h1 className="text-2xl font-semibold text-gray-900">Quản lý bài viết</h1>

          <button onClick={() => navigate(-1)} className="btn-secondary mb-6">← Quay Lại</button>

          <p className="mt-2 text-sm text-gray-700">
            Quản lý các bài viết quảng cáo và thông báo của bệnh viện
          </p>
        </div>
        <div className="mt-4 sm:mt-0 sm:ml-16 sm:flex-none">
          <Link
            to="/posts/create"
            className="inline-flex items-center justify-center rounded-md border border-transparent bg-blue-600 px-4 py-2 text-sm font-medium text-white shadow-sm hover:bg-blue-700"
          >
            Thêm bài viết mới
          </Link>
        </div>
      </div>

      {error ? (
        <div className="mt-8 rounded-lg border border-red-200 bg-red-50 p-6 text-red-700">
          <strong>Lỗi:</strong> {error}
        </div>
      ) : (
        <div className="mt-8 flex flex-col">
          <div className="-my-2 -mx-4 overflow-x-auto sm:-mx-6 lg:-mx-8">
          <div className="inline-block min-w-full py-2 align-middle md:px-6 lg:px-8">
            <div className="overflow-hidden shadow ring-1 ring-black ring-opacity-5 md:rounded-lg">
              <table className="min-w-full divide-y divide-gray-300">
                <thead className="bg-gray-50">
                  <tr>
                    <th scope="col" className="py-3.5 pl-4 pr-3 text-left text-sm font-semibold text-gray-900 sm:pl-6">
                      Tiêu đề
                    </th>
                    <th scope="col" className="px-3 py-3.5 text-left text-sm font-semibold text-gray-900">
                      Xuất bản
                    </th>
                    <th scope="col" className="px-3 py-3.5 text-left text-sm font-semibold text-gray-900">
                      Nổi bật
                    </th>
                    <th scope="col" className="px-3 py-3.5 text-left text-sm font-semibold text-gray-900">
                      Ngày tạo
                    </th>
                    <th scope="col" className="relative py-3.5 pl-3 pr-4 sm:pr-6">
                      <span className="sr-only">Actions</span>
                    </th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-200 bg-white">
                  {posts.map((post) => (
                    <tr key={post.id}>
                      <td className="whitespace-nowrap py-4 pl-4 pr-3 text-sm font-medium text-gray-900 sm:pl-6">
                        {post.title}
                      </td>
                      <td className="whitespace-nowrap px-3 py-4 text-sm text-gray-500">
                        <button
                          onClick={() => togglePublished(post)}
                          className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                            post.published
                              ? 'bg-green-100 text-green-800'
                              : 'bg-gray-100 text-gray-800'
                          }`}
                        >
                          {post.published ? 'Có' : 'Không'}
                        </button>
                      </td>
                      <td className="whitespace-nowrap px-3 py-4 text-sm text-gray-500">
                        <button
                          onClick={() => toggleActive(post)}
                          className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                            post.active
                              ? 'bg-blue-100 text-blue-800'
                              : 'bg-gray-100 text-gray-800'
                          }`}
                        >
                          {post.active ? 'Có' : 'Không'}
                        </button>
                      </td>
                      <td className="whitespace-nowrap px-3 py-4 text-sm text-gray-500">
                        {new Date(post.createdAt || post.updatedAt).toLocaleString('vi-VN')}
                      </td>
                      <td className="relative whitespace-nowrap py-4 pl-3 pr-4 text-right text-sm font-medium sm:pr-6">
                        <Link
                          to={`/posts/${post.id}/edit`}
                          className="text-blue-600 hover:text-blue-900 mr-4"
                        >
                          Sửa
                        </Link>
                        <button
                          onClick={() => handleDelete(post.id)}
                          className="text-red-600 hover:text-red-900"
                        >
                          Xóa
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </div>
      )}

      {posts.length === 0 && (
        <div className="text-center py-12">
          <p className="text-gray-500">Chưa có bài viết nào.</p>
          <Link
            to="/posts/create"
            className="mt-4 inline-flex items-center px-4 py-2 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700"
          >
            Tạo bài viết đầu tiên
          </Link>
        </div>
      )}
    </div>
  );
};

export default PostListPage;