import { Route, Routes } from 'react-router-dom';
import HomePage from '@/shared/components/layout/HomePage';
import LoginPage from '@/features/auth/pages/LoginPage';
import SignUpPage from '@/features/auth/pages/SignUpPage';
import MessagesPage from '@/features/messages/pages/MessagesPage';
import MessageContent from '@/features/messages/components/MessageContent';
import MessageEmpty from '@/features/messages/components/MessageEmpty';
import { MessagesProvider } from '@/features/messages/hooks/useMessagesProvider';

/**
 * App Routes - Định nghĩa tất cả routes của ứng dụng
 * Sử dụng feature-based routing organization
 */
export const AppRoutes = () => {
  return (
    <Routes>
      {/* Home route */}
      <Route path="/" element={<HomePage />} />

      {/* Auth routes */}
      <Route path="/login" element={<LoginPage />} />
      <Route path="/signup" element={<SignUpPage />} />

      {/* Messages routes - với nested routing */}
      <Route path="/messages" element={
        <MessagesProvider>
          <MessagesPage />
        </MessagesProvider>
      }>
        {/* Default empty state khi chưa chọn conversation */}
        <Route index element={<MessageEmpty />} />
        {/* Conversation detail route */}
        <Route path=":id" element={<MessageContent />} />
      </Route>

      {/* 404 fallback */}
      <Route path="*" element={<div>404 - Page Not Found</div>} />
    </Routes>
  );
};
