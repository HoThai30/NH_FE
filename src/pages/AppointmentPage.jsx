import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { appointmentAPI, visitAPI } from '../services/api';

export default function AppointmentPage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [appointment, setAppointment] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [checkingIn, setCheckingIn] = useState(false);
  const [confirming, setConfirming] = useState(false);

  useEffect(() => {
    if (id) {
      loadAppointment();
    }
  }, [id]);

  const loadAppointment = async () => {
    try {
      setLoading(true);
      const response = await appointmentAPI.getById(id);
      setAppointment(response.data);
      // If appointment is already confirmed, redirect to list
      if (response.data.status === 'CONFIRMED') {
        navigate('/appointments');
        return;
      }
    } catch (err) {
      setError('Lỗi tải cuộc hẹn');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleCheckIn = async () => {
    setCheckingIn(true);
    try {
      const response = await appointmentAPI.checkIn(id);
      setAppointment(response.data);
      alert('Kiểm tra vào thành công');
    } catch (err) {
      alert('Lỗi: ' + (err.response?.data || 'Không thể kiểm tra vào'));
    } finally {
      setCheckingIn(false);
    }
  };

  const handleConfirm = async () => {
    if (!window.confirm('Bạn có chắc muốn xác nhận cuộc hẹn này và tạo hồ sơ khám?')) return;

    setConfirming(true);
    try {
      // Confirm appointment and create visit record in one transaction
      const visitData = {
        notes: appointment.consultationNeeds || '',
        procedures: '',
      };
      const visit = await appointmentAPI.confirm(id, visitData);

      // Navigate back to appointment list
      navigate('/appointments');
    } catch (err) {
      alert('Lỗi: ' + (err.response?.data || 'Không thể xác nhận cuộc hẹn'));
    } finally {
      setConfirming(false);
    }
  };

  if (loading) return <div className="container mt-8"><p className="text-center text-gray-700">Đang tải...</p></div>;
  if (error) return <div className="container mt-8"><div className="error-message">{error}</div></div>;

  return (
    <div className="container mt-8">
      <h1 className="text-3xl font-bold mb-6 text-gray-900">Chi Tiết Cuộc Hẹn</h1>
      <button onClick={() => navigate(-1)} className="btn-secondary mb-6">← Quay Lại</button>

      {appointment && (
        <div className="appointment-card">
          <div className="card-header">
            <h2>Cuộc hẹn #{appointment.id}</h2>
            <span className={`status ${appointment.status?.toLowerCase()}`}>
              {appointment.status || 'UNKNOWN'}
            </span>
          </div>

          <div className="appointment-info">
            <div className="info-row">
              <span className="label">Bệnh Nhân:</span>
              <span>{appointment.patientName || appointment.patient?.user?.name || 'N/A'}</span>
            </div>

            <div className="info-row">
              <span className="label">Số Điện Thoại:</span>
              <span>{appointment.patientPhone || appointment.patient?.user?.phone || 'N/A'}</span>
            </div>

            <div className="info-row">
              <span className="label">Giới Tính:</span>
              <span>{appointment.patientGender || 'N/A'}</span>
            </div>

            <div className="info-row">
              <span className="label">Tuổi:</span>
              <span>{appointment.patientAge != null ? appointment.patientAge : 'N/A'}</span>
            </div>

            <div className="info-row">
              <span className="label">Bác Sĩ:</span>
              <span>{appointment.doctor?.user?.name || 'Không chỉ định'}</span>
            </div>

            <div className="info-row">
              <span className="label">Thời Gian:</span>
              <span>{appointment.startTime ? new Date(appointment.startTime).toLocaleString('vi-VN') : 'Chưa có'}</span>
            </div>

            <div className="info-row">
              <span className="label">Lý Do:</span>
              <span>{appointment.consultationNeeds || 'Không có'}</span>
            </div>

            <div className="info-row">
              <span className="label">Ghi Chú:</span>
              <span>{appointment.notes || 'Không có'}</span>
            </div>
          </div>

          {appointment.status === 'PENDING' && (
            <div className="mt-6 space-y-4">
              <button
                onClick={handleConfirm}
                disabled={confirming}
                className="btn-primary mr-4"
              >
                {confirming ? 'Đang tải...' : 'Xác Nhận & Tạo Hồ Sơ Khám'}
              </button>
              <button
                onClick={handleCheckIn}
                disabled={checkingIn}
                className="btn-success"
              >
                {checkingIn ? 'Đang tải...' : 'Kiểm Tra Vào'}
              </button>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
