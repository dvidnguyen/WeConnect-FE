import { Routes, Route, Navigate } from 'react-router-dom';
import LoginPage from '@/features/auth/pages/LoginPage';
import SignUpPage from '@/features/auth/pages/SignUpPage';
import MessagesPage from '@/features/messages/pages/MessagesPage';
import HomePage from '@/shared/components/layout/HomePage';
import MessageLayout from '@/features/messages/pages/MessageLayout';
import CodeOtpForm from '@/features/auth/components/CodeOtpForm';
import { AuthRoute } from '@/app/routes/AuthRoute';
import { ProtectedRoute } from '@/app/routes//ProtectedRoute';
// import MessageDetail from '@/features/messages/pages/MessageDetail';
// TODO: Replace with proper auth check from context
// const isAuthenticated = true; // Tạm thời set true để test MessagesPage

/**
 * App Routes - Định nghĩa tất cả routes của ứng dụng
 * Sử dụng feature-based routing organization
 */
export const AppRoutes = () => {
  return (
    <Routes>
      {/* Public route */}
      <Route path="/homepage" element={<HomePage />} />

      {/* Auth routes - không cho phép user đã đăng nhập truy cập */}
      <Route element={<AuthRoute />}>
        <Route path="/login" element={<LoginPage />} />
        <Route path="/signup" element={<SignUpPage />} />
        <Route path="/otp" element={<CodeOtpForm />} />
      </Route>

      {/* Protected routes - yêu cầu đăng nhập */}
      <Route element={<ProtectedRoute />}>
        <Route element={<MessageLayout />}>
          <Route path="/messages" element={<MessagesPage />} />
          {/* Các route messages khác */}
        </Route>
      </Route>

      {/* Redirect root to login */}
      <Route path="/" element={<Navigate to="/login" replace />} />

      {/* 404 fallback */}
      <Route path="*" element={<div>404 - Page Not Found</div>} />
    </Routes>
  );
};
