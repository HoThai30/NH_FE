import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { doctorAPI } from '../services/api';

export default function DoctorCreatePage() {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [imagePreview, setImagePreview] = useState(null);
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    specialization: '',
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
      await doctorAPI.create(submitData);
      alert('Tạo bác sĩ thành công');
      navigate('/dashboard');
    } catch (err) {
      alert('Lỗi: ' + (err.response?.data?.error || 'Không thể tạo bác sĩ'));
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="container">
      <h1>Tạo Tài Khoản Bác Sĩ</h1>
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
          <div className="image-upload-section">
            <input
              type="file"
              accept="image/*"
              onChange={handleImageChange}
              className="image-input"
              id="profile-photo"
            />
            <label htmlFor="profile-photo" className="image-upload-label">
              📷 Chọn Ảnh Đại Diện
            </label>
          </div>
          {imagePreview && (
            <div className="image-preview">
              <img src={imagePreview} alt="Preview" />
              <p>Ảnh đã chọn (ảnh mặc định nếu không chọn)</p>
            </div>
          )}
        </div>

        <button type="submit" disabled={loading} className="btn-primary">
          {loading ? 'Đang tải...' : 'Tạo Bác Sĩ'}
        </button>
      </form>
    </div>
  );
}
