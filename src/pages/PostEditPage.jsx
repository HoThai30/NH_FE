import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import api from '../services/api';

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
          setPreviewImage(`/uploads/${post.imageUrl}`);
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

    if (!file.type.startsWith('image/')) {
      alert('Vui lòng chọn file hình ảnh');
      return;
    }

    if (file.size > 5 * 1024 * 1024) {
      alert('Kích thước file không được vượt quá 5MB');
      return;
    }

    const reader = new FileReader();
    reader.onloadend = () => {
      setPreviewImage(reader.result);
    };
    reader.readAsDataURL(file);

    setUploading(true);
    try {
      const formDataFile = new FormData();
      formDataFile.append('file', file);
      
      const response = await api.post('/posts/upload', formDataFile, {
        headers: {
          'Content-Type': 'multipart/form-data'
        }
      });

      setFormData(prev => ({
        ...prev,
        imageUrl: response.data.filename || response.data
      }));
    } catch (error) {
      console.error('Error uploading file:', error);
      alert('Lỗi upload hình ảnh: ' + (error.response?.data || error.message));
      setPreviewImage(null);
    } finally {
      setUploading(false);
    }
  };

  const validateForm = () => {
    const newErrors = {};

    if (!formData.title.trim()) newErrors.title = 'Vui lòng nhập tiêu đề';
    if (!formData.content.trim()) newErrors.content = 'Vui lòng nhập nội dung';

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!validateForm()) return;

    setLoading(true);
    try {
      await api.put(`/posts/${id}`, formData);
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
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  return (
    <div className="px-4 sm:px-6 lg:px-8">
      <div className="md:grid md:grid-cols-3 md:gap-6">
        <div className="md:col-span-1">
          <div className="px-4 sm:px-0">
            <h3 className="text-lg font-medium leading-6 text-gray-900">Chỉnh sửa bài viết</h3>
            <p className="mt-1 text-sm text-gray-600">
              Cập nhật nội dung bài viết quảng cáo hoặc thông báo.
            </p>
          </div>
        </div>
        <div className="mt-5 md:col-span-2 md:mt-0">
          <form onSubmit={handleSubmit}>
            <div className="shadow sm:overflow-hidden sm:rounded-md">
              <div className="space-y-6 bg-white px-4 py-5 sm:p-6">
                {/* Title */}
                <div>
                  <label htmlFor="title" className="block text-sm font-medium text-gray-700">
                    Tiêu đề *
                  </label>
                  <input
                    type="text"
                    id="title"
                    name="title"
                    value={formData.title}
                    onChange={handleInputChange}
                    className={`mt-1 block w-full rounded-md shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm border ${
                      errors.title ? 'border-red-300' : 'border-gray-300'
                    }`}
                    placeholder="Nhập tiêu đề bài viết"
                  />
                  {errors.title && (
                    <p className="mt-1 text-sm text-red-600">{errors.title}</p>
                  )}
                </div>

                {/* Content */}
                <div>
                  <label htmlFor="content" className="block text-sm font-medium text-gray-700">
                    Nội dung *
                  </label>
                  <textarea
                    id="content"
                    name="content"
                    rows={6}
                    value={formData.content}
                    onChange={handleInputChange}
                    className={`mt-1 block w-full rounded-md shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm border ${
                      errors.content ? 'border-red-300' : 'border-gray-300'
                    }`}
                    placeholder="Nhập nội dung bài viết"
                  />
                  {errors.content && (
                    <p className="mt-1 text-sm text-red-600">{errors.content}</p>
                  )}
                </div>

                {/* Image Upload */}
                <div>
                  <label htmlFor="imageFile" className="block text-sm font-medium text-gray-700">
                    Hình ảnh quảng cáo (JPG, PNG, tối đa 5MB)
                  </label>
                  <div className="mt-1 flex justify-center rounded-md border-2 border-dashed border-gray-300 px-6 pt-5 pb-6">
                    <div className="space-y-1 text-center">
                      {previewImage ? (
                        <div className="relative">
                          <img
                            src={previewImage}
                            alt="Preview"
                            className="mx-auto h-32 w-auto rounded"
                          />
                          <button
                            type="button"
                            onClick={() => {
                              setPreviewImage(null);
                              setFormData(prev => ({ ...prev, imageUrl: '' }));
                            }}
                            className="mt-2 text-sm text-red-600 hover:text-red-700"
                          >
                            Xóa ảnh
                          </button>
                        </div>
                      ) : (
                        <>
                          <svg
                            className="mx-auto h-12 w-12 text-gray-400"
                            stroke="currentColor"
                            fill="none"
                            viewBox="0 0 48 48"
                          >
                            <path
                              d="M28 8H12a4 4 0 00-4 4v20m32-12v8m0 0v8a4 4 0 01-4 4H12a4 4 0 01-4-4v-4m32-8l-3.172-3.172a4 4 0 00-5.656 0L28 20M8 28l3.172-3.172a4 4 0 015.656 0L20 28"
                              strokeWidth={2}
                              strokeLinecap="round"
                              strokeLinejoin="round"
                            />
                          </svg>
                          <div className="flex text-sm text-gray-600">
                            <label
                              htmlFor="imageFile"
                              className="relative cursor-pointer rounded-md bg-white font-medium text-blue-600 hover:text-blue-500 focus-within:outline-none"
                            >
                              <span>Chọn file</span>
                              <input
                                id="imageFile"
                                name="imageFile"
                                type="file"
                                accept="image/*"
                                onChange={handleFileChange}
                                disabled={uploading}
                                className="sr-only"
                              />
                            </label>
                            <p className="pl-1">hoặc kéo thả vào đây</p>
                          </div>
                          <p className="text-xs text-gray-500">PNG, JPG, GIF tối đa 5MB</p>
                        </>
                      )}
                      {uploading && (
                        <div className="mt-2">
                          <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-blue-600 mx-auto"></div>
                          <p className="text-sm text-gray-600 mt-2">Đang upload...</p>
                        </div>
                      )}
                    </div>
                  </div>
                </div>

                {/* Published */}
                <div className="flex items-start">
                  <div className="flex h-5 items-center">
                    <input
                      id="published"
                      name="published"
                      type="checkbox"
                      checked={formData.published}
                      onChange={handleInputChange}
                      className="h-4 w-4 rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                    />
                  </div>
                  <div className="ml-3 text-sm">
                    <label htmlFor="published" className="font-medium text-gray-700">
                      Xuất bản
                    </label>
                    <p className="text-gray-500">
                      Bài viết được chia sẻ công khai hoặc được lưu dưới dạng nháp
                    </p>
                  </div>
                </div>

                {/* Active */}
                <div className="flex items-start">
                  <div className="flex h-5 items-center">
                    <input
                      id="active"
                      name="active"
                      type="checkbox"
                      checked={formData.active}
                      onChange={handleInputChange}
                      className="h-4 w-4 rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                    />
                  </div>
                  <div className="ml-3 text-sm">
                    <label htmlFor="active" className="font-medium text-gray-700">
                      Bài viết nổi bật
                    </label>
                    <p className="text-gray-500">
                      Bài viết nổi bật sẽ được hiển thị ở trang chủ
                    </p>
                  </div>
                </div>
                {/* promotion */}
                <div className="flex items-start">
                  <div className="flex h-5 items-center">
                    <input
                      id="promotion"
                      name="promotion"
                      type="checkbox"
                      checked={formData.promotion}
                      onChange={handleInputChange}
                      className="h-4 w-4 rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                    />
                  </div>
                  <div className="ml-3 text-sm">
                    <label htmlFor="promotion" className="font-medium text-gray-700">
                      Khuyến mãi
                    </label>
                    <p className="text-gray-500">
                      Bài viết khuyến mãi
                    </p>
                  </div>
                </div>
              </div>

              <div className="bg-gray-50 px-4 py-3 text-right sm:px-6">
                <button
                  type="button"
                  onClick={() => navigate('/posts')}
                  className="inline-flex justify-center rounded-md border border-gray-300 bg-white py-2 px-4 text-sm font-medium text-gray-700 shadow-sm hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 mr-3"
                >
                  Hủy
                </button>
                <button
                  type="submit"
                  disabled={loading || uploading}
                  className="inline-flex justify-center rounded-md border border-transparent bg-blue-600 py-2 px-4 text-sm font-medium text-white shadow-sm hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {loading ? 'Đang lưu...' : 'Lưu thay đổi'}
                </button>
              </div>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default PostEditPage;