import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { receptionistAPI } from '../services/api';
import { useAuth } from '../context/AuthContext';

export default function ReceptionistListPage() {
  const navigate = useNavigate();
  const { user } = useAuth();
  const [receptionists, setReceptionists] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  const getReceptionistAvatar = (receptionist) => {
    const base64 = receptionist.user?.profilePicture || receptionist.profilePicture;
    if (!base64) return null;
    return base64.startsWith('data:') ? base64 : `data:image/jpeg;base64,${base64}`;
  };

  useEffect(() => {
    const loadReceptionists = async () => {
      try {
        const response = await receptionistAPI.getAll();
        setReceptionists(response.data);
      } catch (err) {
        setError('Không thể tải danh sách lễ tân');
      } finally {
        setLoading(false);
      }
    };

    loadReceptionists();
  }, []);

  const handleDelete = async (id) => {
    if (!window.confirm('Bạn có chắc muốn xóa lễ tân này?')) return;
    try {
      await receptionistAPI.delete(id);
      setReceptionists(receptionists.filter(r => r.id !== id));
    } catch (err) {
      alert('Lỗi xóa lễ tân');
    }
  };

  return (
    <div className="container mt-8">
      <h1 className="text-3xl font-bold mb-6 text-gray-900">Danh Sách Lễ Tân</h1>
      <button onClick={() => navigate(-1)} className="btn-secondary mb-6">← Quay Lại</button>

      {loading && <p>Đang tải...</p>}
      {error && <div className="error-message">{error}</div>}

      {!loading && !error && (
        <div className="table-card">
          {user?.role === 'ADMIN' && (
            <div className="mb-4">
              <button onClick={() => navigate('/receptionists/create')} className="btn-primary">
                Tạo mới lễ tân
              </button>
            </div>
          )}

          {receptionists.length === 0 ? (
            <p>Chưa có lễ tân nào.</p>
          ) : (
            <table>
              <thead>
                <tr>
                  <th>Ảnh</th>
                  <th>Họ Tên</th>
                  <th>Email</th>
                  <th>Phòng Ban</th>
                  <th>Hành Động</th>
                </tr>
              </thead>
              <tbody>
                {receptionists.map((receptionist) => (
                  <tr key={receptionist.id}>
                    <td>
                      {getReceptionistAvatar(receptionist) ? (
                        <img
                          src={getReceptionistAvatar(receptionist)}
                          alt="Avatar"
                          className="w-12 h-12 rounded-full object-cover"
                        />
                      ) : (
                        <div className="w-12 h-12 rounded-full bg-gray-300 flex items-center justify-center">
                          <span className="text-gray-600">N/A</span>
                        </div>
                      )}
                    </td>
                    <td>{receptionist.user?.firstName} {receptionist.user?.lastName}</td>
                    <td>{receptionist.user?.email}</td>
                    <td>{receptionist.department}</td>
                    <td>
                      <button
                        onClick={() => navigate(`/receptionists/${receptionist.id}`)}
                        className="btn-secondary mr-2"
                      >
                        Xem
                      </button>
                      {user?.role === 'ADMIN' && (
                        <>
                          <button
                            onClick={() => navigate(`/receptionists/${receptionist.id}/edit`)}
                            className="btn-secondary mr-2"
                          >
                            Sửa
                          </button>
                          <button
                            onClick={() => handleDelete(receptionist.id)}
                            className="btn-danger"
                          >
                            Xóa
                          </button>
                        </>
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