import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { visitAPI } from '../services/api';

export default function VisitDetailPage() {
  const navigate = useNavigate();
  const { id } = useParams();
  const [visit, setVisit] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [formData, setFormData] = useState({
    notes: '',
    procedures: '',
    cost: 0,
  });

  useEffect(() => {
    const loadVisit = async () => {
      try {
        const response = await visitAPI.getById(id);
        setVisit(response.data);
        setFormData({
          notes: response.data.notes || '',
          procedures: response.data.procedures || '',
          cost: response.data.cost || 0,
        });
      } catch (err) {
        setError('Không thể tải hồ sơ khám');
      } finally {
        setLoading(false);
      }
    };

    loadVisit();
  }, [id]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await visitAPI.update(id, formData);
      alert('Cập nhật thành công');
      // Reload visit data
      const response = await visitAPI.getById(id);
      setVisit(response.data);
    } catch (err) {
      alert('Lỗi: ' + (err.response?.data || 'Không thể cập nhật'));
    }
  };

  const handleExport = () => {
    // Simple export as text file
    const content = `
Hồ Sơ Khám Bệnh

ID: ${visit.id}
Bệnh Nhân: ${visit.patient?.user?.name || visit.appointment?.patientName || 'N/A'}
Điện Thoại: ${visit.patient?.user?.phone || visit.appointment?.patientPhone || 'N/A'}
Tuổi: ${visit.patient?.age || visit.appointment?.patientAge || 'N/A'}
Giới Tính: ${visit.patient?.gender || visit.appointment?.patientGender || 'N/A'}
Thời Gian Khám: ${visit.appointment?.startTime ? new Date(visit.appointment.startTime).toLocaleString('vi-VN') : 'N/A'}

Ghi Chú:
${formData.notes}

Thủ Thuật:
${formData.procedures}

Chi Phí: ${formData.cost.toLocaleString('vi-VN')} VND

Ngày Tạo: ${visit.createdAt ? new Date(visit.createdAt).toLocaleString('vi-VN') : 'N/A'}
    `.trim();

    const blob = new Blob([content], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `hosokham-${visit.id}.txt`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  if (loading) return <div className="container mt-8">Đang tải...</div>;
  if (error) return <div className="container mt-8 error-message">{error}</div>;
  if (!visit) return <div className="container mt-8">Không tìm thấy hồ sơ khám</div>;

  return (
    <div className="container mt-8">
      <h1 className="text-3xl font-bold mb-6 text-gray-900">Chi Tiết Hồ Sơ Khám</h1>
      <button onClick={() => navigate(-1)} className="btn-secondary mb-6">← Quay Lại</button>

      <div className="form-card">
        <div className="mb-6">
          <h2 className="text-xl font-bold mb-4">Thông Tin Bệnh Nhân</h2>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700">Tên:</label>
              <p className="mt-1">{visit.patient?.user?.name || visit.appointment?.patientName || 'N/A'}</p>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700">Điện Thoại:</label>
              <p className="mt-1">{visit.patient?.user?.phone || visit.appointment?.patientPhone || 'N/A'}</p>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700">Tuổi:</label>
              <p className="mt-1">{visit.patient?.age || visit.appointment?.patientAge || 'N/A'}</p>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700">Giới Tính:</label>
              <p className="mt-1">{visit.patient?.gender || visit.appointment?.patientGender || 'N/A'}</p>
            </div>
          </div>
        </div>

        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label>Ghi Chú:</label>
            <textarea
              name="notes"
              value={formData.notes}
              onChange={handleInputChange}
              rows="4"
              placeholder="Ghi chú về tình trạng bệnh nhân"
            />
          </div>

          <div className="form-group">
            <label>Thủ Thuật:</label>
            <textarea
              name="procedures"
              value={formData.procedures}
              onChange={handleInputChange}
              rows="4"
              placeholder="Các thủ thuật đã thực hiện"
            />
          </div>

          <div className="form-group">
            <label>Chi Phí (VND):</label>
            <input
              type="number"
              name="cost"
              value={formData.cost}
              onChange={handleInputChange}
              min="0"
            />
          </div>

          <div className="flex gap-4">
            <button type="submit" className="btn-primary">
              Cập Nhật
            </button>
            <button type="button" onClick={handleExport} className="btn-secondary">
              Xuất File
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}