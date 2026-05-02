import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { notificationAPI, appointmentAPI } from '../services/api';

export default function NotificationSendPage() {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [appointments, setAppointments] = useState([]);
  const [formData, setFormData] = useState({
    appointmentId: '',
    channel: 'email',
    template: 'default',
  });
  const [result, setResult] = useState(null);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchAppointments = async () => {
      try {
        const response = await appointmentAPI.getAll();
        setAppointments(response.data);
      } catch (err) {
        console.error('Failed to load appointments', err);
      }
    };
    fetchAppointments();
  }, []);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    setResult(null);

    try {
      const response = await notificationAPI.send(
        formData.appointmentId,
        formData.channel,
        formData.template
      );
      setResult(response.data);
      setFormData({ appointmentId: '', channel: 'email', template: 'default' });
      alert('Gửi thông báo thành công!');
    } catch (err) {
      setError(err.response?.data?.message || 'Lỗi gửi thông báo');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="container">
      <h1>Gửi Thông Báo</h1>
      <button onClick={() => navigate(-1)} className="btn-secondary">← Quay Lại</button>

      <div className="form-card">
        <form onSubmit={handleSubmit}>
            <div className="form-group">
            <label>Chọn cuộc hẹn:</label>
            <select
              name="appointmentId"
              value={formData.appointmentId}
              onChange={handleInputChange}
              required
            >
              <option value="">-- Chọn cuộc hẹn --</option>
              {appointments.map((appt) => (
                <option key={appt.id} value={appt.id}>
                  {appt.patientName || appt.patient?.user?.name || 'N/A'} - {appt.patientPhone || appt.patient?.user?.phone || 'N/A'} ({appt.startTime ? new Date(appt.startTime).toLocaleString('vi-VN') : 'Chưa có'})
                </option>
              ))}
            </select>
          </div>

          <div className="form-group">
            <label>Kênh Gửi:</label>
            <select name="channel" value={formData.channel} onChange={handleInputChange}>
              <option value="email">Email</option>
              <option value="sms">SMS</option>
              <option value="push">Push Notification</option>
            </select>
          </div>

          <div className="form-group">
            <label>Mẫu Thông Báo:</label>
            <select name="template" value={formData.template} onChange={handleInputChange}>
              <option value="default">Mẫu Mặc Định</option>
              <option value="reminder">Nhắc Nhở</option>
              <option value="confirmation">Xác Nhận</option>
            </select>
          </div>

          <button type="submit" disabled={loading} className="btn-primary">
            {loading ? 'Đang tải...' : 'Gửi Thông Báo'}
          </button>
        </form>

        {error && <div className="error-message">{error}</div>}

        {result && (
          <div className="success-message">
            <h3>Gửi thành công!</h3>
            <p>Thông báo đã được gửi qua {formData.channel}</p>
          </div>
        )}
      </div>
    </div>
  );
}
