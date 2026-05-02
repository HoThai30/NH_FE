import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { doctorAPI } from '../services/api';

export default function DoctorEditPage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [doctor, setDoctor] = useState(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState('');
  const [imagePreview, setImagePreview] = useState(null);
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    specialization: '',
    phonenumber: '',
    profilePicture: '',
    user: {
      email: '',
      profilePicture: '',
      phone: '',
    },
  });

  useEffect(() => {
    if (!id) return;
    const loadDoctor = async () => {
      try {
        const response = await doctorAPI.getById(id);
        const data = response.data;
        setDoctor(data);
        const nameParts = (data.user?.name || '').trim().split(' ');
        const firstName = nameParts.shift() || '';
        const lastName = nameParts.join(' ') || '';

        setFormData({
          firstName,
          lastName,
          specialization: data.specialty || '',
          phonenumber: data.user?.phone || '',
          profilePicture: data.profilePicture || data.user?.profilePicture || '',
          user: {
            email: data.user?.email || '',
            profilePicture: data.user?.profilePicture || data.profilePicture || '',
            phone: data.user?.phone || '',
          },
        });
        if (data.user?.profilePicture) {
          setImagePreview(`data:image/jpeg;base64,${data.user.profilePicture}`);
        }
      } catch (err) {
        setError('Không thể tải dữ liệu bác sĩ.');
      } finally {
        setLoading(false);
      }
    };

    loadDoctor();
  }, [id]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    if (name.startsWith('user.')) {
      const field = name.split('.')[1];
      setFormData({
        ...formData,
        user: { ...formData.user, [field]: value },
      });
    } else {
      setFormData({ ...formData, [name]: value });
    }
  };

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onloadend = () => {
      const base64String = reader.result.split(',')[1];
      setImagePreview(reader.result);
      setFormData({
        ...formData,
        profilePicture: base64String,
        user: { ...formData.user, profilePicture: base64String },
      });
    };
    reader.readAsDataURL(file);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSaving(true);
    setError('');

    try {
      const submitData = {
        firstName: formData.firstName,
        lastName: formData.lastName,
        specialization: formData.specialization,
        phonenumber: formData.phonenumber,
        profilePicture: formData.profilePicture,
        user: {
          email: formData.user.email,
          phone: formData.user.phone,
          profilePicture: formData.user.profilePicture || formData.profilePicture || '',
        },
      };
      await doctorAPI.update(id, submitData);
      alert('Cập nhật bác sĩ thành công');
      navigate(`/doctors/${id}`);
    } catch (err) {
      setError(err.response?.data || 'Lỗi khi cập nhật bác sĩ.');
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <div className="container mt-8">
        <p className="text-center text-gray-700">Đang tải dữ liệu bác sĩ...</p>
      </div>
    );
  }

  return (
    <div className="container mt-8">
      <h1 className="text-3xl font-bold mb-6">Chỉnh Sửa Bác Sĩ</h1>
      <button onClick={() => navigate(-1)} className="btn-secondary mb-6">← Quay Lại</button>

      {error && <div className="error-message mb-4">{error}</div>}

      <form onSubmit={handleSubmit} className="form-card">
        <div className="form-group">
          <label>Tên:</label>
          <input
            type="text"
            name="firstName"
            value={formData.firstName}
            onChange={handleInputChange}
            required
            placeholder="Tên"
          />
        </div>

        <div className="form-group">
          <label>Họ:</label>
          <input
            type="text"
            name="lastName"
            value={formData.lastName}
            onChange={handleInputChange}
            required
            placeholder="Họ"
          />
        </div>

        <div className="form-group">
          <label>Chuyên Khoa:</label>
          <input
            type="text"
            name="specialization"
            value={formData.specialization}
            onChange={handleInputChange}
            placeholder="Chuyên khoa"
          />
        </div>

        <div className="form-group">
          <label>Số Điện Thoại:</label>
          <input
            type="tel"
            name="phonenumber"
            value={formData.phonenumber}
            onChange={handleInputChange}
            placeholder="Số điện thoại"
          />
        </div>

        <div className="form-group">
          <label>Email:</label>
          <input
            type="email"
            name="user.email"
            value={formData.user.email}
            onChange={handleInputChange}
            required
            placeholder="Email"
          />
        </div>

        <div className="form-group">
          <label>Ảnh Đại Diện:</label>
          <div className="image-upload-section">
            <input
              type="file"
              accept="image/*"
              onChange={handleImageChange}
              className="image-input"
              id="edit-profile-photo"
            />
            <label htmlFor="edit-profile-photo" className="image-upload-label">
              📷 Chọn Ảnh Đại Diện
            </label>
          </div>
          {imagePreview && (
            <div className="image-preview">
              <img src={imagePreview} alt="Preview" />
              <p>Ảnh đã chọn</p>
            </div>
          )}
        </div>

        <button type="submit" disabled={saving} className="btn-primary">
          {saving ? 'Đang lưu...' : 'Lưu thay đổi'}
        </button>
      </form>
    </div>
  );
}
