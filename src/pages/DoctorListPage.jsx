import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { doctorAPI } from '../services/api';
import { useAuth } from '../context/AuthContext';

export default function DoctorListPage() {
  const navigate = useNavigate();
  const { user } = useAuth();
  const [doctors, setDoctors] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  const getDoctorAvatar = (doctor) => {
    const base64 = doctor.user?.profilePicture || doctor.profilePicture;
    if (!base64) return null;
    return base64.startsWith('data:') ? base64 : `data:image/jpeg;base64,${base64}`;
  };


  useEffect(() => {
    const loadDoctors = async () => {
      try {
        const response = await doctorAPI.getAll();
        setDoctors(response.data);
      } catch (err) {
        setError('Không thể tải danh sách bác sĩ');
      } finally {
        setLoading(false);
      }
    };

    loadDoctors();
  }, []);

  return (
    <div className="container mt-8">
      <h1 className="text-3xl font-bold mb-6 text-gray-900">Danh Sách Bác Sĩ</h1>
      <button onClick={() => navigate(-1)} className="btn-secondary mb-6">← Quay Lại</button>

      {loading && <p>Đang tải...</p>}
      {error && <div className="error-message">{error}</div>}

      {!loading && !error && (
        <div className="table-card">
          {user?.role === 'RECEPTIONIST' || user?.role === 'ADMIN' ? (
            <div className="mb-4">
              <button onClick={() => navigate('/doctors/create')} className="btn-primary">
                Tạo mới bác sĩ
              </button>
            </div>
          ) : null}

          {doctors.length === 0 ? (
            <p>Chưa có bác sĩ nào.</p>
          ) : (
            <table>
              <thead>
                <tr>
                  <th>ID</th>
                  <th>Họ Tên</th>
                  <th>Chuyên Khoa</th>
                  <th>Email</th>
                  <th>Hành Động</th>
                </tr>
              </thead>
              <tbody>
                {doctors.map((doctor) => (
                  <tr key={doctor.id}>
                    <td>{doctor.id}</td>
                    <td>
                      <div>{doctor.user?.name || 'Chưa có tên'}</div>
                      {getDoctorAvatar(doctor) ? (
                        <img
                          src={getDoctorAvatar(doctor)}
                          alt={doctor.user?.name || 'Avatar bác sĩ'}
                          className="mt-2 rounded-md object-cover"
                          style={{ width: 80, height: 80 }}
                        />
                      ) : (
                        <div className="mt-2 text-sm text-gray-500">Không có ảnh</div>
                      )}
                    </td>
                    <td>{doctor.specialty || 'Chưa cập nhật'}</td>
                    <td>{doctor.user?.email || 'Chưa cập nhật'}</td>
                    <td>
                      <button onClick={() => navigate(`/doctors/${doctor.id}`)} className="btn-secondary mr-2">
                        Xem
                      </button>
                      {(user?.role === 'RECEPTIONIST' || user?.role === 'ADMIN') && (
                        <button onClick={() => navigate(`/doctors/${doctor.id}/edit`)} className="btn-primary">
                          Sửa
                        </button>
                      )}
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
