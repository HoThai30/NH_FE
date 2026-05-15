import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { visitAPI } from '../services/api';

export default function VisitCreatePage() {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    diagnosis: '',
    treatment: '',
    notes: '',
    appointment: { id: '',       

    },
  });

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    if (name === 'appointmentId') {
      setFormData({
        ...formData,
        appointment: { id: value },
      });
    } else {
      setFormData({ ...formData, [name]: value });
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      await visitAPI.create({
        diagnosis: formData.diagnosis,
        treatment: formData.treatment,
        notes: formData.notes,
        appointment: { id: parseInt(formData.appointment.id) },
      });
      alert('Tạo hồ sơ khám thành công');
      navigate('/dashboard');
    } catch (err) {
      alert('Lỗi: ' + (err.response?.data || 'Không thể tạo hồ sơ khám'));
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="container mt-8">
      <h1 className="text-3xl font-bold mb-6 text-gray-900">Tạo Hồ Sơ Khám</h1>
      <button onClick={() => navigate(-1)} className="btn-secondary mb-6">← Quay Lại</button>

      <form onSubmit={handleSubmit} className="form-card">
        <div className="form-group">
          <label>ID Cuộc Hẹn:</label>
          <input
            type="number"
            name="appointmentId"
            value={formData.appointment.id}
            onChange={handleInputChange}
            required
            placeholder="ID cuộc hẹn"
          />
        </div>

        <div className="form-group">
          <label>Chẩn Đoán:</label>
          <textarea
            name="diagnosis"
            value={formData.diagnosis}
            onChange={handleInputChange}
            placeholder="Chẩn đoán bệnh"
            rows={4}
          />
        </div>

        <div className="form-group">
          <label>Điều Trị:</label>
          <textarea
            name="treatment"
            value={formData.treatment}
            onChange={handleInputChange}
            placeholder="Phương pháp điều trị"
            rows={4}
          />
        </div>

        <div className="form-group">
          <label>Ghi Chú:</label>
          <textarea
            name="notes"
            value={formData.notes}
            onChange={handleInputChange}
            placeholder="Ghi chú thêm"
            rows={3}
          />
        </div>

        <button type="submit" disabled={loading} className="btn-primary">
          {loading ? 'Đang tải...' : 'Tạo Hồ Sơ Khám'}
        </button>
      </form>
    </div>
  );
}
