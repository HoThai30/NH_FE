import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../services/api';

const AnonymousAppointmentPage = () => {
  const navigate = useNavigate();
  const [doctors, setDoctors] = useState([]);
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    doctorId: '',
    patientName: '',
    patientAge: '',
    patientGender: '',
    patientPhone: '',
    appointmentTime: '',
    reason: ''
  });
  const [errors, setErrors] = useState({});

  useEffect(() => {
    const fetchDoctors = async () => {
      try {
        const response = await api.get('/doctors');
        setDoctors(response.data);
      } catch (error) {
        console.error('Error fetching doctors:', error);
      }
    };

    fetchDoctors();
  }, []);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
    if (errors[name]) {
      setErrors(prev => ({
        ...prev,
        [name]: ''
      }));
    }
  };

  const validateForm = () => {
    const newErrors = {};

    if (!formData.doctorId) newErrors.doctorId = 'Vui lòng chọn bác sĩ';
    if (!formData.patientName.trim()) newErrors.patientName = 'Vui lòng nhập tên';
    if (!formData.patientPhone.trim()) newErrors.patientPhone = 'Vui lòng nhập số điện thoại';
    if (!formData.appointmentTime) newErrors.appointmentTime = 'Vui lòng chọn thời gian';

    const phoneRegex = /^(\+84|84|0)[3|5|7|8|9][0-9]{8}$/;
    if (formData.patientPhone && !phoneRegex.test(formData.patientPhone.replace(/\s/g, ''))) {
      newErrors.patientPhone = 'Số điện thoại không hợp lệ';
    }

    if (formData.appointmentTime) {
      const selectedTime = new Date(formData.appointmentTime);
      const now = new Date();
      if (selectedTime <= now) {
        newErrors.appointmentTime = 'Thời gian phải trong tương lai';
      }
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!validateForm()) return;

    setLoading(true);
    try {
      const appointmentData = {
        ...formData,
        patientAge: formData.patientAge ? parseInt(formData.patientAge) : null,
        appointmentTime: new Date(formData.appointmentTime).toISOString()
      };

      await api.post('/appointments/anonymous', appointmentData);
      alert('Đặt lịch thành công! Chúng tôi sẽ liên hệ với bạn sớm.');
      navigate('/');
    } catch (error) {
      console.error('Error creating appointment:', error);
      if (error.response?.data) {
        alert('Lỗi: ' + error.response.data);
      } else {
        alert('Có lỗi xảy ra. Vui lòng thử lại.');
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md mx-auto bg-white rounded-lg shadow-md p-6 border-t-4 border-teal-700">
        <div className="mb-8">
          <h2 className="text-2xl font-bold text-teal-700 text-center">
            Đặt Lịch Khám Bệnh
          </h2>
          <p className="mt-2 text-center text-sm text-gray-600">
            Vui lòng điền thông tin để đặt lịch
          </p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-5">
          {/* Doctor Selection */}
          <div>
            <label htmlFor="doctorId" className="block text-sm font-medium text-gray-700">
              Chọn bác sĩ *
            </label>
            <select
              id="doctorId"
              name="doctorId"
              value={formData.doctorId}
              onChange={handleInputChange}
              className={`mt-1 block w-full px-3 py-2 border rounded-md shadow-sm focus:outline-none focus:ring-teal-500 focus:border-teal-500 ${
                errors.doctorId ? 'border-red-300' : 'border-gray-300'
              }`}
            >
              <option value="">-- Chọn bác sĩ --</option>
              {doctors.map((doctor) => (
                <option key={doctor.id} value={doctor.id}>
                  {doctor.user?.name} - {doctor.specialty}
                </option>
              ))}
            </select>
            {errors.doctorId && (
              <p className="mt-1 text-sm text-red-600">{errors.doctorId}</p>
            )}
          </div>

          {/* Patient Name */}
          <div>
            <label htmlFor="patientName" className="block text-sm font-medium text-gray-700">
              Họ và tên *
            </label>
            <input
              type="text"
              id="patientName"
              name="patientName"
              value={formData.patientName}
              onChange={handleInputChange}
              className={`mt-1 block w-full px-3 py-2 border rounded-md shadow-sm focus:outline-none focus:ring-teal-500 focus:border-teal-500 ${
                errors.patientName ? 'border-red-300' : 'border-gray-300'
              }`}
              placeholder="Nhập họ và tên"
            />
            {errors.patientName && (
              <p className="mt-1 text-sm text-red-600">{errors.patientName}</p>
            )}
          </div>

          {/* Age and Gender Row */}
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label htmlFor="patientAge" className="block text-sm font-medium text-gray-700">
                Tuổi
              </label>
              <input
                type="number"
                id="patientAge"
                name="patientAge"
                value={formData.patientAge}
                onChange={handleInputChange}
                min="1"
                max="150"
                className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-teal-500 focus:border-teal-500"
                placeholder="Tuổi"
              />
            </div>
            <div>
              <label htmlFor="patientGender" className="block text-sm font-medium text-gray-700">
                Giới tính
              </label>
              <select
                id="patientGender"
                name="patientGender"
                value={formData.patientGender}
                onChange={handleInputChange}
                className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-teal-500 focus:border-teal-500"
              >
                <option value="">-- Chọn --</option>
                <option value="Nam">Nam</option>
                <option value="Nữ">Nữ</option>
                <option value="Khác">Khác</option>
              </select>
            </div>
          </div>

          {/* Phone */}
          <div>
            <label htmlFor="patientPhone" className="block text-sm font-medium text-gray-700">
              Số điện thoại *
            </label>
            <input
              type="tel"
              id="patientPhone"
              name="patientPhone"
              value={formData.patientPhone}
              onChange={handleInputChange}
              className={`mt-1 block w-full px-3 py-2 border rounded-md shadow-sm focus:outline-none focus:ring-teal-500 focus:border-teal-500 ${
                errors.patientPhone ? 'border-red-300' : 'border-gray-300'
              }`}
              placeholder="0987654321"
            />
            {errors.patientPhone && (
              <p className="mt-1 text-sm text-red-600">{errors.patientPhone}</p>
            )}
          </div>

          {/* Appointment Time */}
          <div>
            <label htmlFor="appointmentTime" className="block text-sm font-medium text-gray-700">
              Thời gian hẹn *
            </label>
            <input
              type="datetime-local"
              id="appointmentTime"
              name="appointmentTime"
              value={formData.appointmentTime}
              onChange={handleInputChange}
              className={`mt-1 block w-full px-3 py-2 border rounded-md shadow-sm focus:outline-none focus:ring-teal-500 focus:border-teal-500 ${
                errors.appointmentTime ? 'border-red-300' : 'border-gray-300'
              }`}
            />
            {errors.appointmentTime && (
              <p className="mt-1 text-sm text-red-600">{errors.appointmentTime}</p>
            )}
          </div>

          {/* Reason */}
          <div>
            <label htmlFor="reason" className="block text-sm font-medium text-gray-700">
              Lý do khám bệnh
            </label>
            <textarea
              id="reason"
              name="reason"
              value={formData.reason}
              onChange={handleInputChange}
              rows={3}
              className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-teal-500 focus:border-teal-500"
              placeholder="Mô tả triệu chứng hoặc lý do khám"
            />
          </div>

          {/* Submit Button */}
          <div>
            <button
              type="submit"
              disabled={loading}
              className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-teal-700 hover:bg-teal-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-teal-500 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {loading ? 'Đang xử lý...' : 'Đặt lịch'}
            </button>
          </div>
        </form>

        {/* Back to Home */}
        <div className="mt-6 text-center">
          <button
            onClick={() => navigate('/')}
            className="text-sm text-teal-600 hover:text-teal-700 font-medium"
          >
            ← Quay lại trang chủ
          </button>
        </div>
      </div>
    </div>
  );
};

export default AnonymousAppointmentPage;