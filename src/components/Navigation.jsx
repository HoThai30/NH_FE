import React, { useState, useEffect, useRef } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { dentalServiceAPI } from '../services/api';

export default function Navigation() {
  const { user, logout, isAuthenticated } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  const [services, setServices] = useState([]);
  const [showServicesDropdown, setShowServicesDropdown] = useState(false);

  const dropdownRef = useRef(null);
  const timeoutRef = useRef(null);

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  // Load services
  useEffect(() => {
    const loadServices = async () => {
      try {
        const res = await dentalServiceAPI.getAll();
        setServices(res.data || []);
      } catch (err) {
        console.error('Error loading services:', err);
      }
    };
    loadServices();
  }, []);

  // Hover handlers (chống giật)
  const handleEnter = () => {
    clearTimeout(timeoutRef.current);
    setShowServicesDropdown(true);
  };

  const handleLeave = () => {
    timeoutRef.current = setTimeout(() => {
      setShowServicesDropdown(false);
    }, 150);
  };

  // Menu style (chỉ glow chữ, không nền)
  const navItem =
    "py-3 px-2 transition duration-300 rounded text-white " +
    "hover:text-yellow-200 " +
    "hover:[text-shadow:0_0_5px_#fff,0_0_10px_#ffd700,0_0_20px_#ffd700] " +
    "hover:-translate-y-0.5";

  // Ẩn nav ở trang admin (nhưng hiển thị ở trang tin tức công khai)
  // Các trang admin: /dashboard, /patients, /doctors, /appointments, /visits, /notifications, /services
  // Các trang admin posts: /posts (list), /posts/create, /posts/:id/edit
  // Các trang công khai: /, /tin-tuc, /posts/:id (chi tiết bài viết), /book-appointment
  const isAdminPage = 
    location.pathname.startsWith('/dashboard') ||
    location.pathname.startsWith('/patients') ||
    location.pathname.startsWith('/doctors') ||
    location.pathname.startsWith('/appointments') ||
    location.pathname.startsWith('/visits') ||
    location.pathname.startsWith('/notifications') ||
    location.pathname.startsWith('/services') ||
    location.pathname === '/posts' ||
    location.pathname.startsWith('/posts/create') ||
    location.pathname.endsWith('/edit');
    
  if (isAdminPage) {
    return (
      <nav className="bg-primaryDark sticky top-0 z-50">
       <div className="flex items-center gap-3">
          <div className="w-20 h-20 rounded-full overflow-hidden bg-white flex items-center justify-center">
            <img
              src="public/uploads/logo.jpg"
              alt="logo"
              className="w-full h-full object-contain"
            />
          </div>
        

          {isAuthenticated && (
            <div className="flex items-center gap-4">
              <span className="text-white text-sm">👤 {user?.email}</span>
              <button onClick={handleLogout} className={navItem}>
                Đăng Xuất
              </button>
            </div>
          )}
        </div>
      </nav>
    );
  }

  return (
    <nav className="bg-primaryDark sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex items-center justify-between text-white text-sm font-semibold">

        {/* LOGO */}
        <div className="flex items-center gap-3">
          <div className="w-20 h-20 rounded-full overflow-hidden bg-white flex items-center justify-center">
            <img
              src="public/uploads/logo.jpg"
              alt="logo"
              className="w-full h-full object-contain"
            />
          </div>
        </div>

        {/* MENU */}
        <div className="hidden md:flex items-center gap-6">

          <Link to="/" className={navItem}>
            GIỚI THIỆU
          </Link>

          {/* DROPDOWN DỊCH VỤ */}
          <div
            className="relative"
            ref={dropdownRef}
            onMouseEnter={handleEnter}
            onMouseLeave={handleLeave}
          >
            <div className={navItem + " cursor-pointer flex items-center gap-1"}>
              DỊCH VỤ
              <svg
                className={`w-4 h-4 transition-transform ${showServicesDropdown ? 'rotate-180' : ''}`}
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7" />
              </svg>
            </div>

            {showServicesDropdown && services.length > 0 && (
              <div className="absolute top-full left-0 mt-2 w-56 bg-white rounded-xl shadow-2xl z-50 py-2">
                {services.map((service) => (
                  <div
                    key={service.id}
                    className="px-4 py-2 text-gray-800 hover:text-teal-600 hover:bg-teal-50 cursor-pointer transition"
                  >
                    <div className="font-semibold text-sm">
                      {service.name}
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>

          <a href="/#pricing" className={navItem}>BẢNG GIÁ</a>
          <Link to="/khuyen-mai" className={navItem}>KHUYẾN MẠI</Link>
          <Link to="/tin-tuc" className={navItem}>TIN TỨC</Link>
          <div className={navItem}>HỎI ĐÁP</div>

        </div>

        {/* USER */}
        <div className="flex items-center gap-4">
          {isAuthenticated && (
            <>
              <Link to="/dashboard" className={navItem}>
                Dashboard
              </Link>
              <button onClick={handleLogout} className={navItem}>
                Đăng xuất
              </button>
            </>
          )}
        </div>
      </div>
    </nav>
  );
}