import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { receptionistAPI } from '../services/api';

export default function ReceptionistEditPage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [receptionist, setReceptionist] = useState(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState('');
  const [imagePreview, setImagePreview] = useState(null);
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    department: '',
    phonenumber: '',
    profilePicture: '',
    user: {
      email: '',
      profilePicture: '',
    },
  });

  useEffect(() => {
    if (!id) return;
    const loadReceptionist = async () => {
      try {
        const response = await receptionistAPI.getById(id);
        const data = response.data;
        setReceptionist(data);

        setFormData({
          firstName: data.user?.firstName || '',
          lastName: data.user?.lastName || '',
          department: data.department || '',
          phonenumber: data.user?.phonenumber || '',
          profilePicture: data.profilePicture || data.user?.profilePicture || '',
          user: {
            email: data.user?.email || '',
            profilePicture: data.user?.profilePicture || data.profilePicture || '',
          },
        });
        if (data.user?.profilePicture) {
          setImagePreview(`data:image/jpeg;base64,${data.user.profilePicture}`);
        }
      } catch (err) {
        setError('Không thể tải thông tin lễ tân');
      } finally {
        setLoading(false);
      }
    };

    loadReceptionist();
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
    if (file) {
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
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSaving(true);

    try {
      const submitData = {
        ...receptionist,
        user: {
          ...receptionist.user,
          firstName: formData.firstName,
          lastName: formData.lastName,
          email: formData.user.email,
          phonenumber: formData.phonenumber,
          profilePicture: formData.user.profilePicture,
        },
        department: formData.department,
        profilePicture: formData.profilePicture,
      };
      await receptionistAPI.update(id, submitData);
      alert('Cập nhật lễ tân thành công');
      navigate('/receptionists');
    } catch (err) {
      alert('Lỗi: ' + (err.response?.data || 'Không thể cập nhật lễ tân'));
    } finally {
      setSaving(false);
    }
  };

  if (loading) return <div className="container mt-8"><p className="text-center text-gray-700">Đang tải...</p></div>;
  if (error) return <div className="container mt-8"><div className="error-message">{error}</div></div>;

  return (
    <div className="container">
      <h1>Chỉnh Sửa Lễ Tân</h1>
      <button onClick={() => navigate(-1)} className="btn-secondary">← Quay Lại</button>

      <form onSubmit={handleSubmit} className="form-card">
        <div className="form-group">
          <label>Tên:</label>
          <input
            type="text"
            name="firstName"
            value={formData.firstName}
            onChange={handleInputChange}
            required
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
          />
        </div>

        <div className="form-group">
          <label>Phòng Ban:</label>
          <input
            type="text"
            name="department"
            value={formData.department}
            onChange={handleInputChange}
          />
        </div>

        <div className="form-group">
          <label>Số Điện Thoại:</label>
          <input
            type="text"
            name="phonenumber"
            value={formData.phonenumber}
            onChange={handleInputChange}
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
          />
        </div>

        <div className="form-group">
          <label>Ảnh Đại Diện:</label>
          <input
            type="file"
            accept="image/*"
            onChange={handleImageChange}
          />
          {imagePreview && (
            <img
              src={imagePreview}
              alt="Preview"
              className="mt-2 w-32 h-32 object-cover rounded"
            />
          )}
        </div>

        <button type="submit" disabled={saving} className="btn-primary">
          {saving ? 'Đang lưu...' : 'Cập Nhật'}
        </button>
      </form>
    </div>
  );
}