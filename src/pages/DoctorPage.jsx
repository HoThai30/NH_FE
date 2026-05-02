import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { doctorAPI } from '../services/api';
import { useAuth } from '../context/AuthContext';

export default function DoctorPage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { user } = useAuth();
  const [doctor, setDoctor] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  const getDoctorAvatar = (doctorData) => {
    const base64 = doctorData?.user?.profilePicture || doctorData?.profilePicture;
    if (!base64) return null;
    return base64.startsWith('data:') ? base64 : `data:image/jpeg;base64,${base64}`;
  };

  useEffect(() => {
    if (id) {
      loadDoctor();
    }
  }, [id]);

  const loadDoctor = async () => {
    try {
      setLoading(true);
      const response = await doctorAPI.getById(id);
      setDoctor(response.data);
    } catch (err) {
      setError('Lỗi tải thông tin bác sĩ');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  if (loading) return <div className="container mt-8"><p className="text-center text-gray-700">Đang tải...</p></div>;
  if (error) return <div className="container mt-8"><div className="error-message">{error}</div></div>;

  return (
    <div className="container mt-8">
      <h1 className="text-3xl font-bold mb-6 text-gray-900">Thông Tin Bác Sĩ</h1>
      <button onClick={() => navigate(-1)} className="btn-secondary mb-6">← Quay Lại</button>

      {doctor && (
        <div className="patient-card">
          <div className="card-header">
            <h2 className="patient-name">
              {doctor.user?.name || 'Bác sĩ không rõ tên'}
            </h2>
          </div>

          {getDoctorAvatar(doctor) && (
            <div className="mb-4">
              <img
                src={getDoctorAvatar(doctor)}
                alt={doctor.user?.name || 'Avatar bác sĩ'}
                className="rounded-md object-cover"
                style={{ width: 160, height: 160 }}
              />
            </div>
          )}

          <div className="patient-info">
            <div className="info-row">
              <span className="label">Email:</span>
              <span>{doctor.user?.email || 'Chưa cập nhật'}</span>
            </div>

            <div className="info-row">
              <span className="label">Chuyên Khoa:</span>
              <span>{doctor.specialty || 'Chưa cập nhật'}</span>
            </div>

            <div className="info-row">
              <span className="label">Số Điện Thoại:</span>
              <span>{doctor.user?.phone || 'Chưa cập nhật'}</span>
            </div>

            <div className="info-row">
              <span className="label">Vai Trò:</span>
              <span>{doctor.user?.role || 'N/A'}</span>
            </div>

            {(user?.role === 'RECEPTIONIST' || user?.role === 'ADMIN') && (
              <div className="info-row mt-4">
                <button onClick={() => navigate(`/doctors/${doctor.id}/edit`)} className="btn-primary">
                  Chỉnh sửa bác sĩ
                </button>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
