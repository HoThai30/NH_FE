import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { appointmentAPI } from '../services/api';
import { useAuth } from '../context/AuthContext';

export default function AppointmentCreatePage() {
  const navigate = useNavigate();
  const { user } = useAuth();
  const [loading, setLoading] = useState(false);
  const [patientInfo, setPatientInfo] = useState({
    email: '',
    name: '',
    phone: '',
  });
  const [formData, setFormData] = useState({
    patientName: '',
    patientPhone: '',
    appointmentTime: '',
    reason: '',
    notes: '',
  });

  useEffect(() => {
    if (user && user.role === 'PATIENT') {
      setPatientInfo({
        email: user.email || '',
        name: user.name || '',
        phone: user.phone || '',
      });
      setFormData((prev) => ({
        ...prev,
        patientName: user.name || '',
        patientPhone: user.phone || '',
      }));
    }
  }, [user]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      const payload = {
        patientName: formData.patientName,
        patientPhone: formData.patientPhone,
        appointmentTime: formData.appointmentTime,
        consultationNeeds: formData.reason,
        notes: formData.notes,
      };

      await appointmentAPI.createAnonymous(payload);
      alert('Tạo cuộc hẹn thành công');
      navigate('/dashboard');
    } catch (err) {
      alert('Lỗi: ' + (err.response?.data || 'Không thể tạo cuộc hẹn'));
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="container mt-8">
      <h1 className="text-3xl font-bold mb-6 text-gray-900">Đặt Cuộc Hẹn</h1>
      <button onClick={() => navigate(-1)} className="btn-secondary mb-6">← Quay Lại</button>

      <form onSubmit={handleSubmit} className="form-card">
        {/* Appointment Details Section */}
        <div className="mb-8">
          <h2 className="text-xl font-bold text-gray-900 mb-4">Thông Tin Bệnh Nhân</h2>
          {user?.role === 'PATIENT' ? (
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 bg-blue-50 p-4 rounded-lg">
              <div className="p-3 bg-white border-l-4 border-blue-500 rounded">
                <label className="text-xs font-bold text-gray-600 uppercase">Tên bệnh nhân:</label>
                <div className="text-gray-900 font-medium mt-1">{patientInfo.name}</div>
              </div>
              <div className="p-3 bg-white border-l-4 border-blue-500 rounded">
                <label className="text-xs font-bold text-gray-600 uppercase">Số điện thoại:</label>
                <div className="text-gray-900 font-medium mt-1">{patientInfo.phone}</div>
              </div>
              <div className="p-3 bg-white border-l-4 border-blue-500 rounded">
                <label className="text-xs font-bold text-gray-600 uppercase">Email:</label>
                <div className="text-gray-900 font-medium mt-1">{patientInfo.email}</div>
              </div>
            </div>
          ) : (
            <>
              <div className="form-group">
                <label>Họ và tên bệnh nhân:</label>
                <input
                  type="text"
                  name="patientName"
                  value={formData.patientName}
                  onChange={handleInputChange}
                  placeholder="Nhập họ và tên"
                  required
                />
              </div>
              <div className="form-group">
                <label>Số điện thoại bệnh nhân:</label>
                <input
                  type="tel"
                  name="patientPhone"
                  value={formData.patientPhone}
                  onChange={handleInputChange}
                  placeholder="Nhập số điện thoại"
                  required
                />
              </div>
            </>
          )}

          <div className="form-group">
            <label>Thời Gian Hẹn:</label>
            <input
              type="datetime-local"
              name="appointmentTime"
              value={formData.appointmentTime}
              onChange={handleInputChange}
              required
            />
          </div>

          <div className="form-group">
            <label>Lý Do:</label>
            <input
              type="text"
              name="reason"
              value={formData.reason}
              onChange={handleInputChange}
              placeholder="Lý do cuộc hẹn"
            />
          </div>

          <div className="form-group">
            <label>Ghi Chú:</label>
            <textarea
              name="notes"
              value={formData.notes}
              onChange={handleInputChange}
              placeholder="Ghi chú thêm"
              rows="4"
            />
          </div>
        </div>

        <button type="submit" disabled={loading} className="btn-primary">
          {loading ? 'Đang tải...' : 'Đặt Cuộc Hẹn'}
        </button>
      </form>
    </div>
  );
}
