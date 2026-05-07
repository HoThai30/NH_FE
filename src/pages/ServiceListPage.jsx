import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import api, { dentalServiceAPI } from '../services/api';
import { useAuth } from '../context/AuthContext';

const ServiceListPage = () => {
  const { user } = useAuth();

  const navigate = useNavigate();

  const [services, setServices] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  const [modalOpen, setModalOpen] = useState(false);
  const [saving, setSaving] = useState(false);

  const [form, setForm] = useState({
    id: null,
    name: '',
    description: '',
    price: '',
    active: true,
    imgService: '',
  });

  const [selectedFile, setSelectedFile] = useState(null);
  const [previewImage, setPreviewImage] = useState(null);

  useEffect(() => {
    loadServices();
  }, []);

  const loadServices = async () => {
    setLoading(true);
    setError('');
    try {
      const res = await api.get('/services/admin');
      setServices(res.data);
    } catch (err) {
      console.error(err);
      setError('Không thể tải danh sách dịch vụ.');
    } finally {
      setLoading(false);
    }
  };

  // handle input
  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;

    setForm((prev) => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value,
    }));
  };

  // chọn ảnh
  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (!file) return;

    if (!file.type.startsWith('image/')) {
      setError('Vui lòng chọn file ảnh.');
      return;
    }

    setSelectedFile(file);
    setPreviewImage(URL.createObjectURL(file));
  };

  const openCreate = () => {
    setForm({
      id: null,
      name: '',
      description: '',
      price: '',
      active: true,
      imgService: '',
    });
    setSelectedFile(null);
    setPreviewImage(null);
    setModalOpen(true);
  };

  const openEdit = (service) => {
    setForm({
      id: service.id,
      name: service.name || '',
      description: service.description || '',
      price: service.price?.toString() || '',
      active: service.active ?? true,
      imgService: service.imgService || '',
    });

    setSelectedFile(null);
    setPreviewImage(service.imgService ? `/uploads/${service.imgService}` : null);
    setModalOpen(true);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!form.name.trim()) {
      setError('Vui lòng nhập tên dịch vụ.');
      return;
    }

    if (!form.price || isNaN(form.price)) {
      setError('Giá không hợp lệ.');
      return;
    }

    setSaving(true);
    setError('');

    try {
      const payload = {
        name: form.name.trim(),
        description: form.description.trim(),
        price: Number(form.price),
        active: form.active,
      };

      const formData = new FormData();
      formData.append('data', new Blob([JSON.stringify(payload)], { type: 'application/json' }));
      if (selectedFile) {
        formData.append('file', selectedFile);
      }

      if (form.id) {
        await api.put(`/services/${form.id}`, formData);
      } else {
        await api.post('/services', formData);
      }

      setModalOpen(false);
      loadServices();
    } catch (err) {
      console.error(err);
      setError('Lưu thất bại.');
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Bạn chắc chắn xóa?')) return;

    try {
      await api.delete(`/services/${id}`);
      setServices((prev) => prev.filter((s) => s.id !== id));
    } catch (err) {
      console.error(err);
      alert('Xóa thất bại');
    }
  };

  // check quyền
  if (!user || (user.role !== 'ADMIN' && user.role !== 'RECEPTIONIST')) {
    return <div className="p-6">Không có quyền truy cập</div>;
  }

  return (
    <div className="p-6">
      <div className="flex justify-between mb-6">
        <h1 className="text-xl font-bold">Quản lý dịch vụ</h1>
        <button onClick={() => navigate(-1)} className="btn-secondary mb-6">← Quay Lại</button>

        <button
          onClick={openCreate}
          className="bg-teal-600 text-white px-4 py-2 rounded"
        >
          Thêm
        </button>
      </div>

      {error && <div className="text-red-500 mb-4">{error}</div>}

      {loading ? (
        <p>Đang tải...</p>
      ) : (
        <table className="w-full border">
          <thead>
            <tr className="bg-gray-100">
              <th>Tên</th>
              <th>Giá</th>
              <th>Ảnh</th>
              <th>Hành động</th>
            </tr>
          </thead>
          <tbody>
            {services.map((s) => (
              <tr key={s.id}>
                <td>{s.name}</td>
                <td>{s.price}</td>
                <td>
                  {s.imgService && (
                    <img
                      src={`/uploads/${s.imgService}`}
                      className="w-16"
                    />
                  )}
                </td>
                <td>
                  <button onClick={() => openEdit(s)}>Sửa</button>
                  <button onClick={() => handleDelete(s.id)}>Xóa</button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}

      {/* MODAL */}
      {modalOpen && (
        <div className="fixed inset-0 bg-black/50 flex justify-center items-center">
          <form
            onSubmit={handleSubmit}
            className="bg-white p-6 rounded w-96 space-y-3"
          >
            <input
              name="name"
              value={form.name}
              onChange={handleChange}
              placeholder="Tên dịch vụ"
              className="w-full border p-2"
            />

            <input
              name="price"
              value={form.price}
              onChange={handleChange}
              placeholder="Giá"
              type="number"
              className="w-full border p-2"
            />

            <textarea
              name="description"
              value={form.description}
              onChange={handleChange}
              className="w-full border p-2"
            />

            <input type="file" onChange={handleImageChange} />

            {previewImage && <img src={previewImage} className="w-20" />}

            <div className="flex gap-2">
              <button type="submit" disabled={saving}>
                {saving ? 'Saving...' : 'Lưu'}
              </button>
              <button type="button" onClick={() => setModalOpen(false)}>
                Hủy
              </button>
            </div>
          </form>
        </div>
      )}
    </div>
  );
};

export default ServiceListPage;