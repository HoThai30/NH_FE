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

  // MOBILE MENU
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [mobileServicesOpen, setMobileServicesOpen] = useState(false);

  useEffect(() => {
  setMobileServicesOpen(false);
  }, [mobileMenuOpen]);

  const dropdownRef = useRef(null);
  const timeoutRef = useRef(null);

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

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

  const handleEnter = () => {
    clearTimeout(timeoutRef.current);
    setShowServicesDropdown(true);
  };

  const handleLeave = () => {
    timeoutRef.current = setTimeout(() => {
      setShowServicesDropdown(false);
    }, 150);
  };

  const navItem =
    "py-3 px-2 transition duration-300 rounded text-white " +
    "hover:text-yellow-200 " +
    "hover:[text-shadow:0_0_5px_#fff,0_0_10px_#ffd700,0_0_20px_#ffd700] " +
    "hover:-translate-y-0.5";

  const mobileNavItem =
  "py-3 px-2 text-white transition duration-200 active:text-yellow-200";

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
        <div className="flex items-center justify-between px-4 py-2">
          
          <div className="flex items-center gap-3">
            <div className="w-16 h-16 rounded-full overflow-hidden bg-white flex items-center justify-center">
               <Link to="/" className={navItem}>
              <img
                src="/uploads/logo.jpg"
                alt="logo"
                className="w-full h-full object-contain"
              />
              </Link>
            </div>
          </div>

          {isAuthenticated && (
            <div className="flex items-center gap-4">
              <span className="text-white text-sm hidden sm:block">
                👤 {user?.email}
              </span>
            </div>
          )}
        </div>
      </nav>
    );
  }

  return (
    <nav className="bg-primaryDark sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">

        {/* TOP BAR */}
        <div className="flex items-center justify-between text-white text-sm font-semibold">

          {/* LOGO */}
          <div className="flex items-center gap-3 py-2">
            <div className="w-16 h-16 md:w-20 md:h-20 rounded-full overflow-hidden bg-white flex items-center justify-center">
               <Link to="/" className={navItem}>
              <img
                src="/uploads/logo.jpg"
                alt="logo"
                className="w-full h-full object-contain"
              />
              </Link>
            </div>
          </div>

          {/* DESKTOP MENU */}
          <div className="hidden md:flex items-center gap-6">

            <Link to="/" className={navItem}>
              GIỚI THIỆU
            </Link>

            {/* DROPDOWN */}
            <div
              className="relative"
              ref={dropdownRef}
              onMouseEnter={handleEnter}
              onMouseLeave={handleLeave}
            >
              <div className={navItem + " cursor-pointer flex items-center gap-1"}>
                DỊCH VỤ

                <svg
                  className={`w-4 h-4 transition-transform ${
                    showServicesDropdown ? 'rotate-180' : ''
                  }`}
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    d="M19 9l-7 7-7-7"
                  />
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

            <a href="/#pricing" className={navItem}>
              BẢNG GIÁ
            </a>

            <Link to="/khuyen-mai" className={navItem}>
              KHUYẾN MẠI
            </Link>

            <Link to="/tin-tuc" className={navItem}>
              TIN TỨC
            </Link>

            <div className={navItem}>HỎI ĐÁP</div>
          </div>

          {/* RIGHT SIDE */}
          <div className="flex items-center gap-4">

            {/* DESKTOP USER */}
            <div className="hidden md:flex items-center gap-4">
              {isAuthenticated && (
                <>
                  <Link to="/dashboard" className={navItem}>
                    Dashboard
                  </Link>
                </>
              )}
            </div>

            {/* MOBILE BUTTON */}
            <button
              className="md:hidden text-white"
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-8 w-8"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                {mobileMenuOpen ? (
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M6 18L18 6M6 6l12 12"
                  />
                ) : (
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M4 6h16M4 12h16M4 18h16"
                  />
                )}
              </svg>
            </button>
          </div>
        </div>

        {/* MOBILE MENU */}
        {mobileMenuOpen && (
          <div className="md:hidden flex flex-col pb-4 text-white font-semibold">

            <Link
              to="/"
              className={mobileNavItem}
              onClick={() => setMobileMenuOpen(false)}
            >
              GIỚI THIỆU
            </Link>

            {/* MOBILE SERVICES DROPDOWN */}
            <div className="flex flex-col">

              <button
                onClick={() => setMobileServicesOpen(!mobileServicesOpen)}
                className="flex items-center justify-between px-2 py-3 text-white"
              >
                <span>DỊCH VỤ</span>

                <svg
                  className={`w-5 h-5 transition-transform ${
                    mobileServicesOpen ? 'rotate-180' : ''
                  }`}
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    d="M19 9l-7 7-7-7"
                  />
                </svg>
              </button>

              {mobileServicesOpen && (
                <div className="ml-4 flex flex-col pb-2">

                  {services.map((service) => (
                    <div
                      key={service.id}
                      className="py-2 text-sm text-gray-200 border-l border-gray-500 pl-3"
                    >
                      {service.name}
                    </div>
                  ))}

                </div>
              )}
            </div>
            <a
              href="/#pricing"
              className={mobileNavItem}
              onClick={() => setMobileMenuOpen(false)}
            >
              BẢNG GIÁ
            </a>

            <Link
              to="/khuyen-mai"
              className={mobileNavItem}
              onClick={() => setMobileMenuOpen(false)}
            >
              KHUYẾN MẠI
            </Link>

            <Link
              to="/tin-tuc"
              className={mobileNavItem}
              onClick={() => setMobileMenuOpen(false)}
            >
              TIN TỨC
            </Link>

            <div className={mobileNavItem}>HỎI ĐÁP</div>

            {isAuthenticated && (
              <>
                <Link
                  to="/dashboard"
                  className={mobileNavItem}
                  onClick={() => setMobileMenuOpen(false)}
                >
                  Dashboard
                </Link>
              </>
            )}
          </div>
        )}
      </div>
    </nav>
  );
}