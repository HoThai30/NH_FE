import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { receptionistAPI } from '../services/api';

export default function ReceptionistCreatePage() {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [imagePreview, setImagePreview] = useState(null);
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    department: '',
    phonenumber: '',
    profilePicture: '',
    user: {
      email: '',
      passwordHash: '',
      profilePicture: '',
    },
  });

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
    setLoading(true);

    try {
      const submitData = {
        ...formData,
        profilePicture: formData.profilePicture || formData.user.profilePicture || '',
        user: {
          ...formData.user,
          profilePicture: formData.user.profilePicture || formData.profilePicture || '',
        },
      };
      await receptionistAPI.create(submitData);
      alert('Tạo lễ tân thành công');
      navigate('/receptionists');
    } catch (err) {
      alert('Lỗi: ' + (err.response?.data || 'Không thể tạo lễ tân'));
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="container">
      <h1>Tạo Tài Khoản Lễ Tân</h1>
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
          <label>Phòng Ban:</label>
          <input
            type="text"
            name="department"
            value={formData.department}
            onChange={handleInputChange}
            placeholder="Phòng ban"
          />
        </div>

        <div className="form-group">
          <label>Số Điện Thoại:</label>
          <input
            type="text"
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
          <label>Mật Khẩu:</label>
          <input
            type="password"
            name="user.passwordHash"
            value={formData.user.passwordHash}
            onChange={handleInputChange}
            required
            placeholder="Mật khẩu"
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

        <button type="submit" disabled={loading} className="btn-primary">
          {loading ? 'Đang tạo...' : 'Tạo Lễ Tân'}
        </button>
      </form>
    </div>
  );
}