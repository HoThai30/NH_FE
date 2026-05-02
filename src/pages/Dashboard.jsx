import React from 'react';
import { useAuth } from '../context/AuthContext';
import { Link } from 'react-router-dom';

export default function Dashboard() {
  const { user } = useAuth();

  const menuItems = [
   
    { title: 'Danh Sách Bác Sĩ', path: '/doctors', roles: ['ADMIN'] },
    { title: 'Tạo Bác Sĩ', path: '/doctors/create', roles: ['ADMIN'] },
    { title: 'Danh Sách Lễ Tân', path: '/receptionists', roles: ['ADMIN'] },
    { title: 'Tạo Lễ Tân', path: '/receptionists/create', roles: ['ADMIN'] },
    { title: 'Quản Lý Dịch Vụ', path: '/services', roles: ['ADMIN', 'RECEPTIONIST'] },
    { title: 'Đặt Cuộc Hẹn', path: '/appointments/new', roles: ['PATIENT', 'RECEPTIONIST', 'ADMIN'] },
    { title: 'Danh Sách Cuộc Hẹn', path: '/appointments', roles: ['DOCTOR', 'RECEPTIONIST', 'ADMIN'] },
    { title: 'Hồ Sơ Khám', path: '/visits', roles: ['DOCTOR', 'ADMIN'] },
    { title: 'Gửi Thông Báo', path: '/notifications/send', roles: ['RECEPTIONIST', 'ADMIN'] },
    { title: 'Quản Lý Bài Viết', path: '/posts', roles: ['ADMIN'] },

  ];

  const allowedItems = menuItems.filter((item) => item.roles.includes(user?.role));

  return (
    <div className="dashboard-container">
      <h1>Xin Chào, {user?.name}</h1>
      <p className="role-badge">Vai trò: <strong>{user?.role}</strong></p>

      <div className="menu-grid">
        {allowedItems.map((item) => (
          <Link key={item.path} to={item.path} className="menu-card">
            <h3>{item.title}</h3>
            <p>→</p>
          </Link>
        ))}
      </div>
    </div>
  );
}
