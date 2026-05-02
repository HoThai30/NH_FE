import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { patientAPI } from '../services/api';

export default function PatientPage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [patient, setPatient] = useState(null);
  const [isEditing, setIsEditing] = useState(false);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [formData, setFormData] = useState({
    dob: '',
    address: '',
    allergies: '',
    medicalHistory: '',
  });

  useEffect(() => {
    if (id) {
      loadPatient();
    }
  }, [id]);

  const loadPatient = async () => {
    try {
      setLoading(true);
      const response = await patientAPI.getById(id);
      setPatient(response.data);
      setFormData({
        dob: response.data.dob || '',
        address: response.data.address || '',
        allergies: response.data.allergies || '',
        medicalHistory: response.data.medicalHistory || '',
      });
    } catch (err) {
      setError('Lỗi tải hồ sơ bệnh nhân');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleSave = async () => {
    try {
      const response = await patientAPI.update(id, formData);
      setPatient(response.data);
      setIsEditing(false);
      alert('Cập nhật thành công');
    } catch (err) {
      alert('Lỗi: ' + (err.response?.data?.error || 'Không thể cập nhật'));
    }
  };

  if (loading) return <div className="container mt-8"><p className="text-center text-gray-700">Đang tải...</p></div>;
  if (error) return <div className="container mt-8"><div className="error-message">{error}</div></div>;

  return (
    <div className="container">
      <h1>Hồ Sơ Bệnh Nhân</h1>
      <button onClick={() => navigate(-1)} className="btn-secondary">← Quay Lại</button>

      {patient && (
        <div className="patient-card">
          <div className="card-header">
            <h2 className="patient-name">{patient.user?.email}</h2>
            <button
              onClick={() => setIsEditing(!isEditing)}
              className="btn-primary"
            >
              {isEditing ? 'Hủy' : 'Chỉnh Sửa'}
            </button>
          </div>

          <div className="patient-info">
            <div className="info-row">
              <span className="label">Ngày Sinh:</span>
              {isEditing ? (
                <input
                  type="date"
                  name="dob"
                  value={formData.dob}
                  onChange={handleInputChange}
                />
              ) : (
                <span>{patient.dob || 'Chưa cập nhật'}</span>
              )}
            </div>

            <div className="info-row">
              <span className="label">Địa Chỉ:</span>
              {isEditing ? (
                <input
                  type="text"
                  name="address"
                  value={formData.address}
                  onChange={handleInputChange}
                  placeholder="Địa chỉ"
                />
              ) : (
                <span>{patient.address || 'Chưa cập nhật'}</span>
              )}
            </div>

            <div className="info-row">
              <span className="label">Dị Ứng:</span>
              {isEditing ? (
                <textarea
                  name="allergies"
                  value={formData.allergies}
                  onChange={handleInputChange}
                  placeholder="Danh sách dị ứng"
                />
              ) : (
                <span>{patient.allergies || 'Không có'}</span>
              )}
            </div>

            <div className="info-row">
              <span className="label">Tiền Sử Bệnh:</span>
              {isEditing ? (
                <textarea
                  name="medicalHistory"
                  value={formData.medicalHistory}
                  onChange={handleInputChange}
                  placeholder="Tiền sử bệnh"
                />
              ) : (
                <span>{patient.medicalHistory || 'Không có'}</span>
              )}
            </div>
          </div>

          {isEditing && (
            <button onClick={handleSave} className="btn-success">
              Lưu Thay Đổi
            </button>
          )}
        </div>
      )}
    </div>
  );
}
