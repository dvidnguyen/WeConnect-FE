import { Button } from '@/shared/components/ui/button';
import { useNavigate } from 'react-router-dom';
import { useState, useRef, useEffect, useCallback, memo } from 'react';
import { CheckCircle2 } from 'lucide-react';

const friends = [
  {
    id: 1,
    name: 'Bảo Ngọc',
    avatar: 'https://randomuser.me/api/portraits/women/65.jpg',
  },
  {
    id: 2,
    name: 'Bảo Ngọc',
    avatar: 'https://randomuser.me/api/portraits/women/65.jpg',
  },
  {
    id: 3,
    name: 'Bùi Quang Huy',
    avatar: 'https://randomuser.me/api/portraits/men/67.jpg',
  },
];

type Friend = typeof friends[number];

const FriendMenu = memo(
  ({
    open,
    onClose,
    anchorRef,
  }: {
    open: boolean;
    onClose: () => void;
    anchorRef: React.RefObject<HTMLDivElement>;
  }) => {
    useEffect(() => {
      if (!open) return;
      const handleClickOutside = (event: MouseEvent) => {
        if (
          anchorRef.current &&
          !anchorRef.current.contains(event.target as Node)
        ) {
          onClose();
        }
      };
      document.addEventListener('mousedown', handleClickOutside);
      return () => {
        document.removeEventListener('mousedown', handleClickOutside);
      };
    }, [open, anchorRef, onClose]);

    if (!open) return null;
    return (
      <div
        className="absolute right-0 mt-2 w-52 bg-white dark:bg-[#1a1a1f] rounded-xl shadow-xl border border-gray-100 dark:border-gray-800 z-10 transition-all duration-200 overflow-hidden"
        tabIndex={-1}
        aria-modal="true"
        role="menu"
      >
        <button className="w-full text-left px-4 py-3 hover:bg-blue-500 text-white bg-blue-500 dark:text-gray-100 font-medium flex items-center gap-2">
          <span className="flex-1">Nhắn tin</span>
        </button>
        <button className="w-full text-left px-4 py-3 hover:bg-gray-50 dark:hover:bg-gray-800/50 text-gray-700 dark:text-gray-200 font-medium transition-colors flex items-center gap-2">
          <span className="flex-1">Xem thông tin</span>
        </button>
        <button className="w-full text-left px-4 py-3 hover:bg-gray-50 dark:hover:bg-gray-800/50 text-gray-700 dark:text-gray-200 font-medium transition-colors flex items-center gap-2">
          <span className="flex-1">Đặt tên gợi nhớ</span>
        </button>
        <button className="w-full text-left px-4 py-3 hover:bg-red-50 dark:hover:bg-red-900/30 text-red-600 dark:text-red-500 font-medium transition-colors flex items-center gap-2">
          <span className="flex-1">Xóa bạn</span>
        </button>
        <button className="w-full text-left px-4 py-3 hover:bg-gray-50 dark:hover:bg-gray-800/50 text-gray-700 dark:text-gray-200 font-medium transition-colors flex items-center gap-2">
          <span className="flex-1">Chặn người này</span>
        </button>
      </div>
    );
  }
);

const FriendContactPage = () => {
  const navigate = useNavigate();
  const [search, setSearch] = useState('');
  const [openMenuId, setOpenMenuId] = useState<number | null>(null);
  const menuRefs = useRef<{ [key: number]: HTMLDivElement | null }>({});

  const handleSearch = useCallback(() => {
    alert(`Tìm kiếm: ${search}`);
  }, [search]);

  const handleMenuToggle = useCallback(
    (id: number) => {
      setOpenMenuId(openMenuId === id ? null : id);
    },
    [openMenuId]
  );

  return (
    <div className="flex flex-col items-center justify-top min-h-screen p-4 transition-colors">
      {/* Pill search bar */}
      <div className="w-full mb-8 max-w-md flex gap-3 sticky top-0 z-20 pt-4 transition-colors bg-white/80 dark:bg-black/80 backdrop-blur-md p-4 rounded-lg shadow-lg">
        <input
          type="text"
          value={search}
          onChange={e => setSearch(e.target.value)}
          placeholder="Tìm kiếm bạn bè..."
          className="w-full rounded-lg border border-gray-200 dark:border-gray-800 bg-white dark:bg-[#1a1a1f] px-5 py-2.5 text-gray-700 dark:text-gray-200 focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 focus:outline-none shadow-sm transition-all"
          aria-label="Tìm kiếm bạn bè"
        />
        <Button 
          className="px-6 bg-blue-500 hover:bg-blue-600 text-white shadow-md hover:shadow-lg transition-all duration-200" 
          onClick={handleSearch}
        >
          Tìm kiếm
        </Button>
      </div>

      {/* Friend list */}
      <div className="w-full max-w-lg space-y-4 h-[80vh] overflow-y-auto hover:scrollbar-thin scrollbar-none hover:scrollbar-thumb-gray-300 dark:hover:scrollbar-thumb-gray-600 px-2">
        {friends.map(friend => {
          const ref = (el: HTMLDivElement | null) => {
            menuRefs.current[friend.id] = el;
          };
          return (
            <div
              key={friend.id}
              className="flex items-center justify-between bg-white dark:bg-[#1a1a1f] rounded-xl px-5 py-4 hover:bg-gray-50 dark:hover:bg-[#23232a] transition-all duration-200 shadow-sm hover:shadow-md relative border border-gray-100 dark:border-gray-800"
            >
              <div className="flex items-center gap-4">
                <div className="relative">
                  <img
                    src={friend.avatar}
                    alt={friend.name}
                    className="w-12 h-12 rounded-full object-cover border-2 border-white dark:border-gray-800 shadow-sm"
                  />
                  <div className="absolute bottom-0 right-0 w-3 h-3 bg-green-500 rounded-full border-2 border-white dark:border-gray-800"></div>
                </div>
                <div className="flex flex-col">
                  <span className="font-semibold text-gray-900 dark:text-gray-100">{friend.name}</span>
                  <span className="text-sm text-gray-500 dark:text-gray-400">Đang hoạt động</span>
                </div>
              </div>
              <div className="relative" ref={ref}>
                <button
                  className="flex items-center gap-2 px-5 py-2.5 rounded-lg bg-blue-500 hover:bg-blue-600 text-white shadow-sm hover:shadow-md transition-all duration-200"
                  onClick={() => handleMenuToggle(friend.id)}
                  aria-haspopup="menu"
                  aria-expanded={openMenuId === friend.id}
                  aria-label="Mở menu"
                >
                  Bạn bè
                  <CheckCircle2 className="w-5 h-5 text-white" />
                </button>
                <FriendMenu
                  open={openMenuId === friend.id}
                  onClose={() => setOpenMenuId(null)}
                  anchorRef={{
                    current: menuRefs.current[friend.id],
                  }}
                />
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default FriendContactPage;