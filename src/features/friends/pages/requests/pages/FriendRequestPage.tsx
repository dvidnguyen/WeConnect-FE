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

  
];

const FriendRequestPage = () => {
  const [requests, setRequests] = useState(friendRequests);
  const [searchQuery, setSearchQuery] = useState('');

  const filteredRequests = requests.filter(request => 
    request.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    request.message.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const handleAccept = (id: number) => {
    setRequests(requests.filter(req => req.id !== id));
    // TODO: Implement accept logic
  };

  const handleReject = (id: number) => {
    setRequests(requests.filter(req => req.id !== id));
    // TODO: Implement reject logic
  };

  return (
        <div className="flex flex-col items-center h-screen p-4 transition-colors">
      <div className="w-full max-w-7xl mx-auto h-full flex flex-col">
        <div className="sticky top-0 z-10 bg-white dark:bg-black pb-8 pt-2">
          <h1 className="text-xl font-semibold mb-6 text-gray-900 dark:text-gray-100 flex items-center">
            <span>Lời mời đã nhận</span>
            <span className="ml-2 text-blue-500 dark:text-blue-400">({requests.length})</span>
          </h1>
          <div className="flex justify-center gap-3 backdrop-blur-sm bg-white/50 dark:bg-black/50 p-2 rounded-2xl">
            <div className="relative w-full max-w-md">
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Tìm kiếm bạn bè..."
                className="w-full px-6 py-3 rounded-full border border-gray-200 dark:border-gray-700 bg-white dark:bg-[#23232a] text-gray-900 dark:text-gray-100 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all text-base shadow-sm"
              />
            </div>
            <Button
              type="button"
              className="bg-white dark:bg-[#23232a] hover:bg-gray-50 dark:hover:bg-gray-800 text-gray-900 dark:text-gray-100 rounded-full px-6 py-2 min-w-[120px]"
              variant="outline"
            >
              Tìm kiếm
            </Button>
          </div>
        </div>
        
        {filteredRequests.length === 0 ? (
            <div className="text-center py-8 text-gray-500 dark:text-gray-400">
              Không có lời mời kết bạn nào
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 p-4 justify-items-center overflow-y-auto scrollbar-thin scrollbar-thumb-gray-300 hover:scrollbar-thumb-gray-400 dark:scrollbar-thumb-gray-600 dark:hover:scrollbar-thumb-gray-500 scrollbar-track-transparent">
            {filteredRequests.map(request => (
              <div 
                key={request.id}
                className="bg-white dark:bg-[#23232a] rounded-md shadow-sm border dark:border-gray-700 p-6 mb-4 w-full max-w-md transform transition-all duration-300 hover:shadow-md hover:-translate-y-1"
              >
                <div className="flex flex-col items-center text-center">
                  <img
                    src={request.avatar}
                    alt={request.name}
                    className="w-16 h-16 rounded-full object-cover border dark:border-gray-700 mb-3 transform transition-transform duration-300 hover:scale-105"
                  />
                  <div className="space-y-2">
                    <h3 className="font-medium text-gray-900 dark:text-gray-100">{request.name}</h3>
                    <div className="flex items-center justify-center gap-2">
                      <span className="text-sm text-gray-500">{request.date}</span>
                      <span className="text-sm text-gray-500">-</span>
                      <span className="text-sm text-gray-500">{request.source}</span>
                    </div>
                    <p className="text-left bg-gray-200 dark:bg-gray-800 text-gray-600 dark:text-gray-300 text-sm p-3 rounded-sm transition-colors duration-200 hover:bg-gray-300 dark:hover:bg-gray-700">{request.message}</p>
                  </div>
                </div>
                
                <div className="flex justify-center gap-3 mt-6">
                  <Button
                    onClick={() => handleReject(request.id)}
                    variant="outline"
                    className="w-24 transition-all duration-200 ease-in-out hover:bg-red-50 dark:hover:bg-red-900/30 hover:text-red-600 dark:hover:text-red-400 hover:scale-105"
                  >
                    Từ chối
                  </Button>
                  <Button
                    onClick={() => handleAccept(request.id)}
                    className="w-24 bg-blue-500 hover:bg-blue-600 text-white transition-all duration-200 ease-in-out hover:scale-105"
                  >
                    Đồng ý
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
