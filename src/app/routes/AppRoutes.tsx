import { Routes, Route, Navigate } from 'react-router-dom';
import LoginPage from '@/features/auth/pages/LoginPage';
import SignUpPage from '@/features/auth/pages/SignUpPage';
import MessagesPage from '@/features/messages/pages/MessagesPage';
import HomePage from '@/shared/components/layout/HomePage';
import MessageLayout from '@/features/messages/pages/MessageLayout';
// import MessageDetail from '@/features/messages/pages/MessageDetail';
// TODO: Replace with proper auth check from context
const isAuthenticated = true; // Tạm thời set true để test MessagesPage

/**
 * App Routes - Định nghĩa tất cả routes của ứng dụng
 * Sử dụng feature-based routing organization
 */
export const AppRoutes = () => {
  return (
    <Routes>
      {/* Auth routes */}
      <Route path="/login" element={<LoginPage />} />
      <Route path="/signup" element={<SignUpPage />} />
      <Route path="/homepage" element={<HomePage />} />
      {/* Protected routes */}
      <Route path="/" element={<Navigate to="/homepage" replace />} />

      <Route element={<MessageLayout />}>
        <Route path="/messages" element={<MessagesPage />} />
        {/* Thêm các route khác trong message feature */}
        {/* <Route path="/messages/:id" element={<MessageDetail />} />
        <Route path="/messages/new" element={<NewMessage />} /> */}
      </Route>
      {/* 404 fallback */}
      <Route path="*" element={<div>404 - Page Not Found</div>} />
    </Routes>
  );
};
