import { Button } from '@/shared/components/ui/button';
import { useNavigate } from 'react-router-dom';
const MessagesPage = () => {
  const navigate = useNavigate();

  const handleLogout = () => {
    // TODO: Add proper logout logic here
    navigate('/login');
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen p-4">
      <h1 className="text-2xl font-bold mb-4">Trang tin nhắn</h1>
      <p className="mb-4">Bạn đã đăng nhập thành công!</p>
      <Button onClick={handleLogout} variant="outline">
        Đăng xuất
      </Button>
    </div>
  );
};

export default MessagesPage;
