import './App.css'
import { Route, Routes } from 'react-router-dom'
import Login from './auth/Login'
import SignUp from './auth/SignUp'
import HomePage from './pages/HomePage'
import Messages from './pages/Messages'
import MessageContent from './pages/MessageContent'
import MessageEmpty from './pages/MessageEmpty'
import { MessagesProvider } from './contexts/MessagesProvider'
import { Toaster } from "@/components/ui/sonner"
function App() {
  return (
    <>
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/login" element={<Login />} />
        <Route path="/signup" element={<SignUp />} />

        {/* Messages routes - nested routes với Outlet */}
        <Route path="/messages" element={
          <MessagesProvider>
            <Messages />
          </MessagesProvider>
        }>
          {/* Route mặc định khi không có message id */}
          <Route index element={<MessageEmpty />} />
          {/* Route có message id - hiển thị nội dung tin nhắn */}
          <Route path=":id" element={<MessageContent />} />
        </Route>

        <Route path='*' element={<div>Error</div>} />
      </Routes>
      <Toaster />
    </>
  )
}

export default App
