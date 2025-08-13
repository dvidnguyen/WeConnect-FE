import { Button } from '@/shared/components/ui/button';
import { useState } from 'react';

const friendRequests = [
  {
    id: 1,
    name: 'Nhật Trường',
    avatar: 'https://randomuser.me/api/portraits/men/32.jpg',
    message: 'Xin chào, mình là Nhật Trường. Kết bạn với mình nhé!',
    source: 'Từ số điện thoại',
    date: '30/07'
  },
  {
    id: 2,
    name: 'Nhật Trường',
    avatar: 'https://randomuser.me/api/portraits/men/32.jpg',
    message: 'Xin chào, mình là Nhật Trường. Kết bạn với mình nhé!',
    source: 'Từ số điện thoại',
    date: '30/07'
  },
  {
    id: 3,
    name: 'Nhật Trường',
    avatar: 'https://randomuser.me/api/portraits/men/32.jpg',
    message: 'Xin chào, mình là Nhật Trường. Kết bạn với mình nhé!',
    source: 'Từ số điện thoại',
    date: '30/07'
  },
  {
    id: 4,
    name: 'Nhật Trường',
    avatar: 'https://randomuser.me/api/portraits/men/32.jpg',
    message: 'Xin chào, mình là Nhật Trường. Kết bạn với mình nhé!',
    source: 'Từ số điện thoại',
    date: '30/07'
  },
  


];

const FriendRequestPage = () => {
  const [requests, setRequests] = useState(friendRequests);

  const handleAccept = (id: number) => {
    setRequests(requests.filter(req => req.id !== id));
    // TODO: Implement accept logic
  };

  const handleReject = (id: number) => {
    setRequests(requests.filter(req => req.id !== id));
    // TODO: Implement reject logic
  };

  return (
    <div className="flex flex-col items-center h-screen p-1 transition-colors">
      <div className="w-full max-w-7xl mx-auto h-full flex flex-col ml-2">
        <div className="sticky top-0 z-10 pb-6 pt-2">
          <h1 className="text-xl font-semibold text-gray-900 dark:text-gray-100 flex items-center ml-3">
            <span>Lời mời đã nhận</span>
            <span className="ml-2 text-blue-500 dark:text-blue-400">({requests.length})</span>
          </h1>
        </div>

        {requests.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-12 px-4 animate-fadeIn">
            <div className="w-24 h-24 mb-6 text-gray-300 dark:text-gray-600 animate-float">
              <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor"
                className="transform transition-all duration-700 hover:scale-110 hover:text-blue-400 dark:hover:text-blue-500 cursor-pointer">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M18 9v3m0 0v3m0-3h3m-3 0h-3m-2-5a4 4 0 11-8 0 4 4 0 018 0zM3 20a6 6 0 0112 0v1H3v-1z" />
              </svg>
            </div>
            <h3 className="text-xl font-medium text-gray-900 dark:text-gray-100 mb-2 animate-fadeSlideUp delay-100">
              Chưa có lời mời kết bạn nào
            </h3>
            <p className="text-gray-500 dark:text-gray-400 text-center max-w-sm animate-fadeSlideUp delay-200 hover:text-blue-500 dark:hover:text-blue-400 transition-colors duration-300">
              Hãy chia sẻ mã QR hoặc liên kết hồ sơ của bạn để kết nối với nhiều bạn bè hơn
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 p-4 overflow-y-auto scrollbar-thin scrollbar-thumb-gray-300 hover:scrollbar-thumb-gray-400 dark:scrollbar-thumb-gray-600 dark:hover:scrollbar-thumb-gray-500 scrollbar-track-transparent">
            {requests.map(request => (
              <div
                key={request.id}
                className="bg-white dark:bg-[#23232a] rounded-lg shadow-sm border dark:border-gray-700 p-4 w-full transform transition-all duration-500 hover:shadow-lg hover:-translate-y-1 animate-fadeSlideUp"
                style={{ animationDelay: `${request.id * 100}ms` }}
              >
                <div className="flex items-center gap-3 mb-3">
                  <img
                    src={request.avatar}
                    alt={request.name}
                    className="w-12 h-12 rounded-full object-cover border dark:border-gray-700 transform transition-all duration-500 hover:scale-110 flex-shrink-0"
                  />
                  <div className="flex-1 min-w-0">
                    <h3 className="font-medium text-gray-900 dark:text-gray-100 truncate">{request.name}</h3>
                    <div className="flex items-center gap-1 text-xs text-gray-500">
                      <span>{request.date}</span>
                      <span>-</span>
                      <span className="truncate">{request.source}</span>
                    </div>
                  </div>
                  <div className="w-6 h-6 text-gray-400 hover:text-gray-600 dark:hover:text-gray-300 cursor-pointer flex-shrink-0">
                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-3.582 8-8 8a8.959 8.959 0 01-4.906-1.471L3 21l2.471-5.094A8.959 8.959 0 013 12c0-4.418 3.582-8 8-8s8 3.582 8 8z" />
                    </svg>
                  </div>
                </div>

                <div className="mb-4">
                  <p className="text-sm text-gray-600 dark:text-gray-300 bg-gray-50 dark:bg-gray-800 p-2 rounded text-left line-clamp-2 transition-colors duration-200 hover:bg-gray-100 dark:hover:bg-gray-700">
                    {request.message}
                  </p>
                </div>

                <div className="flex gap-2">
                  <Button
                    onClick={() => handleReject(request.id)}
                    variant="outline"
                    className="flex-1 h-8 text-sm transition-all duration-200 ease-in-out hover:bg-red-50 dark:hover:bg-red-900/30 hover:text-red-600 dark:hover:text-red-400"
                  >
                    Reject
                  </Button>
                  <Button
                    onClick={() => handleAccept(request.id)}
                    className="flex-1 h-8 text-sm bg-blue-500 hover:bg-blue-600 text-white transition-all duration-200 ease-in-out"
                  >
                    Accept
                  </Button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default FriendRequestPage;
