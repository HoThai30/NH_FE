import React from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import Navigation from './components/Navigation';
import PrivateRoute from './components/PrivateRoute';

// Pages
import LoginPage from './pages/LoginPage';
import Dashboard from './pages/Dashboard';
import PatientPage from './pages/PatientPage';
import DoctorPage from './pages/DoctorPage';
import DoctorCreatePage from './pages/DoctorCreatePage';
import DoctorEditPage from './pages/DoctorEditPage';
import DoctorListPage from './pages/DoctorListPage';
import AppointmentCreatePage from './pages/AppointmentCreatePage';
import AppointmentPage from './pages/AppointmentPage';
import AppointmentListPage from './pages/AppointmentListPage';
import VisitCreatePage from './pages/VisitCreatePage';
import VisitListPage from './pages/VisitListPage';
import VisitDetailPage from './pages/VisitDetailPage';
import NotificationSendPage from './pages/NotificationSendPage';
import HomePage from './pages/HomePage';
import AnonymousAppointmentPage from './pages/AnonymousAppointmentPage';
import PostListPage from './pages/PostListPage';
import PostCreatePage from './pages/PostCreatePage';
import PostEditPage from './pages/PostEditPage';
import ReceptionistListPage from './pages/ReceptionistListPage';
import ReceptionistCreatePage from './pages/ReceptionistCreatePage';
import ReceptionistEditPage from './pages/ReceptionistEditPage';
import ServiceListPage from './pages/ServiceListPage';
import PostDetailPage from './pages/PostDetailPage';

function App() {
  return (
    <BrowserRouter>
      <AuthProvider>
        <Navigation />
        <Routes>
          <Route path="/login" element={<LoginPage />} />
          
          <Route
            path="/dashboard"
            element={
              <PrivateRoute>
                <Dashboard />
              </PrivateRoute>
            }
          />

          {/* Doctor Routes */}
          <Route path="/doctors" element={<DoctorListPage />} />

          <Route
            path="/doctors/create"
            element={
              <PrivateRoute requiredRoles={['RECEPTIONIST', 'ADMIN']}>
                <DoctorCreatePage />
              </PrivateRoute>
            }
          />

          <Route
            path="/doctors/:id/edit"
            element={
              <PrivateRoute requiredRoles={['RECEPTIONIST', 'ADMIN']}>
                <DoctorEditPage />
              </PrivateRoute>
            }
          />

          <Route path="/doctors/:id" element={<DoctorPage />} />

          {/* Appointment Routes */}
          <Route
            path="/appointments"
            element={
              <PrivateRoute requiredRoles={['DOCTOR', 'RECEPTIONIST', 'ADMIN']}>
                <AppointmentListPage />
              </PrivateRoute>
            }
          />

          <Route
            path="/appointments/new"
            element={
              <PrivateRoute requiredRoles={['PATIENT', 'RECEPTIONIST', 'ADMIN']}>
                <AppointmentCreatePage />
              </PrivateRoute>
            }
          />

          <Route
            path="/appointments/:id"
            element={
              <PrivateRoute>
                <AppointmentPage />
              </PrivateRoute>
            }
          />

          {/* Receptionist Routes */}
          <Route
            path="/receptionists"
            element={
              <PrivateRoute requiredRoles={['ADMIN']}>
                <ReceptionistListPage />
              </PrivateRoute>
            }
          />

          <Route
            path="/receptionists/create"
            element={
              <PrivateRoute requiredRoles={['ADMIN']}>
                <ReceptionistCreatePage />
              </PrivateRoute>
            }
          />

          <Route
            path="/receptionists/:id/edit"
            element={
              <PrivateRoute requiredRoles={['ADMIN']}>
                <ReceptionistEditPage />
              </PrivateRoute>
            }
          />

          {/* Visit Routes */}
          <Route
            path="/visits"
            element={
              <PrivateRoute requiredRoles={['DOCTOR', 'RECEPTIONIST', 'ADMIN']}>
                <VisitListPage />
              </PrivateRoute>
            }
          />

          <Route
            path="/visits/:id"
            element={
              <PrivateRoute requiredRoles={['DOCTOR', 'RECEPTIONIST', 'ADMIN']}>
                <VisitDetailPage />
              </PrivateRoute>
            }
          />

          {/* Notification Routes */}
          <Route
            path="/notifications/send"
            element={
              <PrivateRoute requiredRoles={['RECEPTIONIST', 'ADMIN']}>
                <NotificationSendPage />
              </PrivateRoute>
            }
          />

          <Route
            path="/services"
            element={
              <PrivateRoute requiredRoles={['RECEPTIONIST', 'ADMIN']}>
                <ServiceListPage />
              </PrivateRoute>
            }
          />

          {/* Public Routes */}
          <Route path="/" element={<HomePage />} />
          <Route path="/book-appointment" element={<AnonymousAppointmentPage />} />

          {/* Post Management Routes */}
          <Route
            path="/posts"
            element={
              <PrivateRoute requiredRoles={['ADMIN']}>
                <PostListPage />
              </PrivateRoute>
            }
          />

          <Route
            path="/posts/create"
            element={
              <PrivateRoute requiredRoles={['ADMIN']}>
                <PostCreatePage />
              </PrivateRoute>
            }
          />

          <Route
            path="/posts/:id/edit"
            element={
              <PrivateRoute requiredRoles={['ADMIN']}>
                <PostEditPage />
              </PrivateRoute>
            }
          />

          {/* Public Post Detail - Hiển thị bài viết nổi bật mới nhất hoặc chi tiết bài viết */}
          <Route path="/posts/:id" element={<PostDetailPage />} />
          <Route path="/tin-tuc" element={<PostDetailPage />} />
        </Routes>
      </AuthProvider>
    </BrowserRouter>
  );
}

export default App;
