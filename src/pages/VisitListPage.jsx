import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { visitAPI } from '../services/api';

export default function VisitListPage() {
  const navigate = useNavigate();
  const [visits, setVisits] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const loadVisits = async () => {
      try {
        const response = await visitAPI.getAll();
        setVisits(response.data);
      } catch (err) {
        setError('Không thể tải danh sách hồ sơ khám');
      } finally {
        setLoading(false);
      }
    };

    loadVisits();
  }, []);

  return (
    <div className="container mt-8">
      <h1 className="text-3xl font-bold mb-6 text-gray-900">Danh Sách Hồ Sơ Khám</h1>
      <button onClick={() => navigate(-1)} className="btn-secondary mb-6">← Quay Lại</button>

      {loading && <p>Đang tải...</p>}
      {error && <div className="error-message">{error}</div>}

      {!loading && !error && (
        <div className="table-card">
          {visits.length === 0 ? (
            <p>Chưa có hồ sơ khám nào.</p>
          ) : (
            <table>
              <thead>
                <tr>
                  <th>ID</th>
                  <th>Bệnh Nhân</th>
                  <th>Điện Thoại</th>
                  <th>Thời Gian Khám</th>
                  <th>Chi Phí</th>
                  <th>Hành Động</th>
                </tr>
              </thead>
              <tbody>
                {visits.map((visit) => (
                  <tr key={visit.id}>
                    <td>{visit.id}</td>
                    <td>{visit.patient?.user?.name || visit.appointment?.patientName || 'N/A'}</td>
                    <td>{visit.patient?.user?.phone || visit.appointment?.patientPhone || 'N/A'}</td>
                    <td>{visit.appointment?.startTime ? new Date(visit.appointment.startTime).toLocaleString('vi-VN') : 'N/A'}</td>
                    <td>{visit.cost ? visit.cost.toLocaleString('vi-VN') + ' VND' : 'Chưa có'}</td>
                    <td>
                      <Link to={`/visits/${visit.id}`} className="btn-secondary">
                        Xem Chi Tiết
                      </Link>
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