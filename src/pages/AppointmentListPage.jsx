import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { appointmentAPI } from '../services/api';

export default function AppointmentListPage() {
  const navigate = useNavigate();
  const [appointments, setAppointments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const loadAppointments = async () => {
      try {
        const response = await appointmentAPI.getAll();
        setAppointments(response.data.filter(app => app.status !== 'CONFIRMED'));
      } catch (err) {
        setError('Không thể tải danh sách cuộc hẹn');
      } finally {
        setLoading(false);
      }
    };

    loadAppointments();
  }, []);

  return (
    <div className="container mt-8">
      <h1 className="text-3xl font-bold mb-6 text-gray-900">Danh Sách Cuộc Hẹn</h1>
      <button onClick={() => navigate('/dashboard')} className="btn-secondary mb-6">← Quay Lại</button>

      {loading && <p>Đang tải...</p>}
      {error && <div className="error-message">{error}</div>}

      {!loading && !error && (
        <div className="table-card">
          {appointments.length === 0 ? (
            <p>Chưa có cuộc hẹn nào.</p>
          ) : (
            <table>
              <thead>
                <tr>
                  <th>ID</th>
                  <th>Bệnh Nhân</th>
                  <th>Điện Thoại</th>
                  <th>Bác Sĩ</th>
                  <th>Thời Gian</th>
                  <th>Trạng Thái</th>
                  <th>Hành Động</th>
                </tr>
              </thead>
              <tbody>
                {appointments.map((appointment) => (
                  <tr key={appointment.id}>
                    <td>{appointment.id}</td>
                    <td>{appointment.patientName || appointment.patient?.user?.name || 'N/A'}</td>
                    <td>{appointment.patientPhone || 'N/A'}</td>
                    <td>{appointment.doctor?.user?.name || 'Không chỉ định'}</td>
                    <td>{appointment.startTime ? new Date(appointment.startTime).toLocaleString('vi-VN') : 'Chưa có'}</td>
                    <td>{appointment.status || 'UNKNOWN'}</td>
                    <td>
                      <button onClick={() => navigate(`/appointments/${appointment.id}`)} className="btn-secondary">
                        Xem
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>
      )}
    </div>
  );
}
