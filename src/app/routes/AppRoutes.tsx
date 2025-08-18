import { Routes, Route, Navigate } from 'react-router-dom';
import LoginPage from '@/features/auth/pages/LoginPage';
import SignUpPage from '@/features/auth/pages/SignUpPage';
import MessagesPage from '@/features/messages/pages/MessagesPage';
import HomePage from '@/shared/components/layout/HomePage';
import MessageLayout from '@/features/messages/pages/MessageLayout';
import CodeOtpForm from '@/features/auth/components/CodeOtpForm';
import UserProfilePage from '@/features/user/pages/UserProfilePage';

import FriendContactPage from '@/features/friends/pages/contacts/pages/FriendContactPage';
import FriendRequestPage from '@/features/friends/pages/requests/pages/FriendRequestPage';
import FriendContactLayout from '@/features/friends/pages/contacts/pages/FriendContactLayout'
import FriendRequestLayout from '@/features/friends/pages/requests/pages/FriendRequestLayout';
// import NewMessage from '@/features/messages/pages/NewMessage';
import { AuthRoute } from '@/app/routes/AuthRoute';
import { ProtectedRoute } from '@/app/routes//ProtectedRoute';



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

        {/* User Profile Route */}
        <Route path="/profile/:userId" element={<UserProfilePage />} />
      </Route>


      <Route element={<FriendRequestLayout />}>
        <Route path="/friends/requests" element={<FriendRequestPage />} />
        {/* Thêm các route khác trong FriendRequest feature */}
        {/* <Route path="/friends/requests/:id" element={<FriendRequestDetail />} />
        <Route path="/friends/requests/new" element={<NewFriendRequest />} /> */}
      </Route>


      <Route element={<FriendContactLayout />}>
        <Route path="/friends/contacts" element={<FriendContactPage />} />
        {/* Thêm các route khác trong FriendContact feature */}
        {/* <Route path="/friends/contacts/:id" element={<FriendContactDetail />} />
        <Route path="/friends/contacts/new" element={<NewFriendRequest />} /> */}
      </Route>

      <Route path='/otp' element={<CodeOtpForm />} />
      {/* Redirect root to login */}
      <Route path="/" element={<Navigate to="/login" replace />} />
      {/* 404 fallback */}
      <Route path="*" element={<div>404 - Page Not Found</div>} />
    </Routes>
  );
};
