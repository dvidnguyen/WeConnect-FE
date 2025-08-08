import { Button } from '@/shared/components/ui/button';
import { useState, useRef, useEffect, memo, useCallback, Fragment } from 'react';
import { Dialog, Transition } from '@headlessui/react';
import { CheckCircle2, MessageCircle, User, Pencil, UserX, Shield, Search, X, AlertTriangle } from 'lucide-react';

interface Friend {
  id: number;
  name: string;
  avatar: string;
}

const friends: Friend[] = [
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

interface ConfirmDialogProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => void;
  title: string;
  description: string;
  type: 'block' | 'unfriend';
}

const ConfirmDialog = ({ isOpen, onClose, onConfirm, title, description, type }: ConfirmDialogProps) => (
  <Transition appear show={isOpen} as={Fragment}>
    <Dialog as="div" className="relative z-50" onClose={onClose}>
      <Transition.Child
        as={Fragment}
        enter="ease-out duration-300"
        enterFrom="opacity-0"
        enterTo="opacity-100"
        leave="ease-in duration-200"
        leaveFrom="opacity-100"
        leaveTo="opacity-0"
      >
        <div className="fixed inset-0 bg-black/25 backdrop-blur-sm" />
      </Transition.Child>

      <div className="fixed inset-0 overflow-y-auto">
        <div className="flex min-h-full items-center justify-center p-4 text-center">
          <Transition.Child
            as={Fragment}
            enter="ease-out duration-300"
            enterFrom="opacity-0 scale-95"
            enterTo="opacity-100 scale-100"
            leave="ease-in duration-200"
            leaveFrom="opacity-100 scale-100"
            leaveTo="opacity-0 scale-95"
          >
            <Dialog.Panel className="w-full max-w-md transform overflow-hidden rounded-2xl bg-white dark:bg-[#1a1a1f] p-6 text-left align-middle shadow-xl transition-all">
              <Dialog.Title className="flex items-center gap-3 text-lg font-medium leading-6 text-gray-900 dark:text-gray-100">
                <AlertTriangle className={`w-6 h-6 ${type === 'block' ? 'text-orange-500' : 'text-red-500'}`} />
                {title}
              </Dialog.Title>
              <div className="mt-2">
                <p className="text-sm text-gray-500 dark:text-gray-400">{description}</p>
              </div>

              <div className="mt-4 flex gap-3 justify-end">
                <button
                  type="button"
                  className="inline-flex justify-center rounded-xl px-4 py-2 text-sm font-medium text-gray-700 dark:text-gray-200 hover:bg-gray-50 dark:hover:bg-gray-800/50"
                  onClick={onClose}
                >
                  Hủy
                </button>
                <button
                  type="button"
                  className={`inline-flex justify-center rounded-xl px-4 py-2 text-sm font-medium text-white ${
                    type === 'block'
                      ? 'bg-orange-500 hover:bg-orange-600'
                      : 'bg-red-500 hover:bg-red-600'
                  }`}
                  onClick={() => {
                    onConfirm();
                    onClose();
                  }}
                >
                  {type === 'block' ? 'Chặn' : 'Xóa bạn'}
                </button>
              </div>
            </Dialog.Panel>
          </Transition.Child>
        </div>
      </div>
    </Dialog>
  </Transition>
);

interface FriendProfileDialogProps {
  isOpen: boolean;
  onClose: () => void;
  friend: Friend | null;
}

const FriendProfileDialog = ({ isOpen, onClose, friend }: FriendProfileDialogProps) => {
  const [showNickname, setShowNickname] = useState(false);
  return (
  <Transition appear show={isOpen} as={Fragment}>
    <Dialog as="div" className="relative z-50" onClose={onClose}>
      <Transition.Child
        as={Fragment}
        enter="ease-out duration-300"
        enterFrom="opacity-0"
        enterTo="opacity-100"
        leave="ease-in duration-200"
        leaveFrom="opacity-100"
        leaveTo="opacity-0"
      >
        <div className="fixed inset-0 bg-black/25 backdrop-blur-sm" />
      </Transition.Child>

      <div className="fixed inset-0 overflow-y-auto">
        <div className="flex min-h-full items-center justify-center p-4 text-center">
          <Transition.Child
            as={Fragment}
            enter="ease-out duration-300"
            enterFrom="opacity-0 scale-95"
            enterTo="opacity-100 scale-100"
            leave="ease-in duration-200"
            leaveFrom="opacity-100 scale-100"
            leaveTo="opacity-0 scale-95"
          >
            <Dialog.Panel className="w-full max-w-md transform overflow-hidden rounded-2xl bg-white dark:bg-[#1a1a1f] p-6 text-left align-middle shadow-xl transition-all relative">
              <div className="absolute inset-0 bg-gradient-to-br from-blue-500/5 via-transparent to-purple-500/5 dark:from-blue-500/10 dark:to-purple-500/10" />
              
              <div className="relative">
                <div className="flex flex-col items-center">
                  <div className="relative group">
                    <div className="absolute -inset-0.5 bg-gradient-to-r from-blue-500 to-purple-500 rounded-full opacity-50 group-hover:opacity-70 blur transition duration-300" />
                    <div className="relative">
                      <img
                        src={friend?.avatar}
                        alt={friend?.name}
                        className="w-28 h-28 rounded-full object-cover border-4 border-white dark:border-gray-800 shadow-xl transform group-hover:scale-105 transition duration-300"
                      />
                      <div className="absolute bottom-1 right-1 w-5 h-5 bg-green-500 rounded-full border-2 border-white dark:border-gray-800 shadow-lg animate-pulse" />
                    </div>
                  </div>
                  <div className="flex items-center gap-3 justify-center">
                    <Dialog.Title className="mt-4 text-2xl font-bold bg-gradient-to-r from-gray-900 to-gray-700 dark:from-white dark:to-gray-300 bg-clip-text text-transparent">
                      {friend?.name}
                    </Dialog.Title>
                    <button
                      onClick={() => setShowNickname(true)}
                      className="mt-4 p-2 rounded-xl bg-gray-100 dark:bg-gray-800/50 hover:bg-gray-200 dark:hover:bg-gray-700/50 text-gray-600 dark:text-gray-400 transition-all duration-200 group hover:scale-105"
                      title="Đặt tên gợi nhớ"
                    >
                      <Pencil className="w-4 h-4 transition-transform duration-200 group-hover:rotate-12" />
                    </button>
                  </div>
                  <p className="mt-1 px-3 py-1 rounded-full bg-green-500/10 dark:bg-green-500/20 text-green-700 dark:text-green-400 text-sm font-medium flex items-center gap-1.5">
                    <span className="w-1.5 h-1.5 rounded-full bg-green-500 animate-pulse" />
                    Đang hoạt động
                  </p>

                  <NicknameDialog 
                    isOpen={showNickname}
                    onClose={() => setShowNickname(false)}
                    friend={friend}
                    onConfirm={(nickname) => {
                      console.log(`Đã đổi tên gợi nhớ của ${friend?.name} thành ${nickname}`);
                    }}
                  />
                </div>

                <div className="mt-8 space-y-3">
                  <div className="group p-4 bg-gradient-to-r from-gray-50 to-white dark:from-gray-800/50 dark:to-gray-900/50 rounded-2xl hover:from-blue-50 hover:to-blue-50/50 dark:hover:from-blue-900/20 dark:hover:to-blue-800/20 transition-all duration-300">
                    <div className="flex items-center gap-3">
                      <div className="p-2 rounded-xl bg-blue-500/10 dark:bg-blue-500/20 text-blue-600 dark:text-blue-400 group-hover:scale-110 transition-transform duration-300">
                        <User className="w-5 h-5" />
                      </div>
                      <div className="flex-1">
                        <p className="text-sm font-medium text-gray-600 dark:text-gray-400">Giới tính</p>
                        <p className="text-base font-semibold text-gray-900 dark:text-gray-100">Nam</p>
                      </div>
                    </div>
                  </div>

                  <div className="group p-4 bg-gradient-to-r from-gray-50 to-white dark:from-gray-800/50 dark:to-gray-900/50 rounded-2xl hover:from-purple-50 hover:to-purple-50/50 dark:hover:from-purple-900/20 dark:hover:to-purple-800/20 transition-all duration-300">
                    <div className="flex items-center gap-3">
                      <div className="p-2 rounded-xl bg-purple-500/10 dark:bg-purple-500/20 text-purple-600 dark:text-purple-400 group-hover:scale-110 transition-transform duration-300">
                        <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 15.5458C21 19.0458 19.5 21.0458 15.5 21.0458H8.5C4.5 21.0458 3 19.0458 3 15.5458V15.0458C3 11.5458 4.5 9.54578 8.5 9.54578H15.5C19.5 9.54578 21 11.5458 21 15.0458V15.5458Z M8 4.54578V6.54578 M16 4.54578V6.54578 M8 5.54578C8 3.54578 9 2.54578 11 2.54578H13C15 2.54578 16 3.54578 16 5.54578" />
                        </svg>
                      </div>
                      <div className="flex-1">
                        <p className="text-sm font-medium text-gray-600 dark:text-gray-400">Ngày sinh</p>
                        <p className="text-base font-semibold text-gray-900 dark:text-gray-100">10 tháng 11, 2005</p>
                      </div>
                    </div>
                  </div>

                  <div className="group p-4 bg-gradient-to-r from-gray-50 to-white dark:from-gray-800/50 dark:to-gray-900/50 rounded-2xl hover:from-green-50 hover:to-green-50/50 dark:hover:from-green-900/20 dark:hover:to-green-800/20 transition-all duration-300">
                    <div className="flex items-center gap-3">
                      <div className="p-2 rounded-xl bg-green-500/10 dark:bg-green-500/20 text-green-600 dark:text-green-400 group-hover:scale-110 transition-transform duration-300">
                        <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5.5C3 14.0604 9.93959 21 18.5 21C18.8862 21 19.2691 20.9859 19.6483 20.9581C20.4277 20.9023 21 20.2091 21 19.4273V16.5C21 15.6716 20.3284 15 19.5 15H17.3598C16.6945 15 16.0886 15.4171 15.8291 16.0279L15.25 17.185C15.25 17.185 13 16.5 11 14.5C9 12.5 8.31499 10.25 8.31499 10.25L9.47206 9.67094C10.0829 9.41142 10.5 8.80553 10.5 8.14024V5.96017C10.5 5.13174 9.82826 4.46 9 4.46H6.07267C5.29087 4.46 4.59771 5.03231 4.54193 5.81173C4.51413 6.19091 4.5 6.57378 4.5 6.96017" />
                        </svg>
                      </div>
                      <div className="flex-1">
                        <p className="text-sm font-medium text-gray-600 dark:text-gray-400">Điện thoại</p>
                        <p className="text-base font-semibold text-gray-900 dark:text-gray-100">+84 899 501 067</p>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="mt-8 flex gap-3 justify-end">
                  <button
                    type="button"
                    className="px-5 py-2.5 rounded-xl bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-200 font-medium hover:bg-gray-200 dark:hover:bg-gray-700 transition-all duration-300 flex items-center gap-2"
                    onClick={onClose}
                  >
                    <X className="w-4 h-4" />
                    Đóng
                  </button>
                  <button
                    type="button"
                    className="px-5 py-2.5 rounded-xl bg-gradient-to-r from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700 text-white font-medium shadow-lg hover:shadow-xl hover:shadow-blue-500/25 transition-all duration-300 flex items-center gap-2 transform hover:scale-105"
                    onClick={onClose}
                  >
                    <MessageCircle className="w-4 h-4" />
                    Nhắn tin
                  </button>
                </div>
              </div>
            </Dialog.Panel>
          </Transition.Child>
        </div>
      </div>
    </Dialog>
  </Transition>
  );
};

interface NicknameDialogProps {
  isOpen: boolean;
  onClose: () => void;
  friend: Friend;
  onConfirm: (nickname: string) => void;
}

const NicknameDialog = ({ isOpen, onClose, friend, onConfirm }: NicknameDialogProps) => {
  const [nickname, setNickname] = useState('');

  useEffect(() => {
    if (isOpen) {
      setNickname(friend.name);
    }
  }, [isOpen, friend]);

  return (
    <Transition appear show={isOpen} as={Fragment}>
      <Dialog as="div" className="relative z-50" onClose={onClose}>
        <Transition.Child
          as={Fragment}
          enter="ease-out duration-300"
          enterFrom="opacity-0"
          enterTo="opacity-100"
          leave="ease-in duration-200"
          leaveFrom="opacity-100"
          leaveTo="opacity-0"
        >
          <div className="fixed inset-0 bg-black/25 backdrop-blur-sm" />
        </Transition.Child>

        <div className="fixed inset-0 overflow-y-auto">
          <div className="flex min-h-full items-center justify-center p-4 text-center">
            <Transition.Child
              as={Fragment}
              enter="ease-out duration-300"
              enterFrom="opacity-0 scale-95"
              enterTo="opacity-100 scale-100"
              leave="ease-in duration-200"
              leaveFrom="opacity-100 scale-100"
              leaveTo="opacity-0 scale-95"
            >
              <Dialog.Panel className="w-full max-w-md transform overflow-hidden rounded-2xl bg-white dark:bg-[#1a1a1f] p-6 text-left align-middle shadow-xl transition-all">
                <Dialog.Title className="text-lg font-medium leading-6 text-gray-900 dark:text-gray-100">
                  Đặt tên gợi nhớ
                </Dialog.Title>
                
                <div className="mt-4">
                  <div className="space-y-2">
                    <label htmlFor="nickname" className="text-sm font-medium text-gray-700 dark:text-gray-300">
                      Tên gợi nhớ cho {friend.name}
                    </label>
                    <input
                      type="text"
                      id="nickname"
                      value={nickname}
                      onChange={(e) => setNickname(e.target.value)}
                      className="w-full px-4 py-3 rounded-xl border border-gray-200 dark:border-gray-800 bg-white dark:bg-gray-900 text-gray-900 dark:text-gray-100 placeholder-gray-400 dark:placeholder-gray-600 focus:ring-2 focus:ring-blue-500 dark:focus:ring-blue-400 focus:border-transparent transition-shadow duration-200"
                      placeholder="Nhập tên gợi nhớ..."
                    />
                    <p className="text-sm text-gray-500 dark:text-gray-400">
                      Tên gợi nhớ sẽ chỉ hiển thị với riêng bạn.
                    </p>
                  </div>
                </div>

                <div className="mt-6 flex gap-3 justify-end">
                  <button
                    type="button"
                    className="px-4 py-2 rounded-xl text-gray-700 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-800 font-medium transition-colors duration-200"
                    onClick={onClose}
                  >
                    Hủy
                  </button>
                  <button
                    type="button"
                    className="px-4 py-2 rounded-xl bg-gradient-to-r from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700 text-white font-medium shadow-lg hover:shadow-xl hover:shadow-blue-500/25 transition-all duration-300"
                    onClick={() => {
                      onConfirm(nickname);
                      onClose();
                    }}
                  >
                    Lưu thay đổi
                  </button>
                </div>
              </Dialog.Panel>
            </Transition.Child>
          </div>
        </div>
      </Dialog>
    </Transition>
  );
};

const FriendMenu = memo(
  ({
    open,
    onClose,
    anchorRef,
    friend,
  }: {
    open: boolean;
    onClose: () => void;
    anchorRef: { current: HTMLDivElement | null };
    friend: Friend;
  }) => {
    const [confirmDialog, setConfirmDialog] = useState<{
      isOpen: boolean;
      type: 'block' | 'unfriend';
    }>({
      isOpen: false,
      type: 'unfriend',
    });
    const [showProfile, setShowProfile] = useState(false);
    const [showNickname, setShowNickname] = useState(false);
    const menuRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
      const handleClickOutside = (event: MouseEvent) => {
        if (
          !menuRef.current?.contains(event.target as Node) &&
          !anchorRef.current?.contains(event.target as Node)
        ) {
          onClose();
        }
      };

      if (open) {
        document.addEventListener('mousedown', handleClickOutside);
        // Prevent scrolling when menu is open
        document.body.style.overflow = 'hidden';
      }

      return () => {
        document.removeEventListener('mousedown', handleClickOutside);
        document.body.style.overflow = 'unset';
      };
    }, [open, anchorRef, onClose]);

    return (
      <div
        ref={menuRef}
        className={`absolute right-0 mt-2 w-56 bg-white dark:bg-[#1a1a1f] rounded-2xl shadow-2xl border border-gray-100 dark:border-gray-800 z-10 transition-all duration-200 transform origin-top-right overflow-hidden backdrop-blur-lg bg-opacity-95 dark:bg-opacity-95 ${
          open
            ? 'opacity-100 translate-y-0 scale-100 visible'
            : 'opacity-0 -translate-y-2 scale-95 invisible pointer-events-none'
        }`}
        tabIndex={-1}
        aria-modal="true"
        role="menu"
      >
        <button 
          className="w-full text-left px-5 py-4 bg-gradient-to-r from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700 text-white font-medium flex items-center gap-3 transition-colors duration-200"
          onClick={(e) => {
            e.stopPropagation();
            onClose();
          }}
        >
          <MessageCircle className="w-5 h-5 text-white/90" />
          <span className="flex-1">Nhắn tin</span>
        </button>
        <div className="p-1.5 space-y-0.5">
          <button 
            className="w-full text-left px-4 py-3 rounded-xl hover:bg-gray-50 dark:hover:bg-gray-800/50 text-gray-700 dark:text-gray-200 font-medium transition-colors duration-200 flex items-center gap-3"
            onClick={(e) => {
              e.stopPropagation();
              setShowProfile(true);
              onClose();
            }}
          >
            <User className="w-5 h-5 text-gray-500" />
            <span className="flex-1">Xem thông tin</span>
          </button>

          <FriendProfileDialog
            isOpen={showProfile}
            onClose={() => setShowProfile(false)}
            friend={friend}
          />
          <button 
            className="w-full text-left px-4 py-3 rounded-xl hover:bg-gray-50 dark:hover:bg-gray-800/50 text-gray-700 dark:text-gray-200 font-medium transition-colors duration-200 flex items-center gap-3"
            onClick={(e) => {
              e.stopPropagation();
              setShowNickname(true);
              onClose();
            }}
          >
            <Pencil className="w-5 h-5 text-gray-500" />
            <span className="flex-1">Đặt tên gợi nhớ</span>
          </button>

          <NicknameDialog 
            isOpen={showNickname}
            onClose={() => setShowNickname(false)}
            friend={friend}
            onConfirm={(nickname) => {
              // Xử lý logic thay đổi tên gợi nhớ ở đây
              console.log(`Đã đổi tên gợi nhớ của ${friend.name} thành ${nickname}`);
            }}
          />
          <button 
            className="w-full text-left px-4 py-3 rounded-xl hover:bg-red-50 dark:hover:bg-red-900/30 text-red-600 dark:text-red-500 font-medium transition-colors duration-200 flex items-center gap-3"
            onClick={(e) => {
              e.stopPropagation();
              setConfirmDialog({ isOpen: true, type: 'unfriend' });
            }}
          >
            <UserX className="w-5 h-5 text-red-500" />
            <span className="flex-1">Xóa bạn</span>
          </button>
          <button 
            className="w-full text-left px-4 py-3 rounded-xl hover:bg-gray-50 dark:hover:bg-gray-800/50 text-gray-700 dark:text-gray-200 font-medium transition-colors duration-200 flex items-center gap-3"
            onClick={(e) => {
              e.stopPropagation();
              setConfirmDialog({ isOpen: true, type: 'block' });
            }}
          >
            <Shield className="w-5 h-5 text-gray-500" />
            <span className="flex-1">Chặn người này</span>
          </button>

          <ConfirmDialog
            isOpen={confirmDialog.isOpen}
            onClose={() => setConfirmDialog({ ...confirmDialog, isOpen: false })}
            onConfirm={() => {
              // Xử lý logic xóa bạn hoặc chặn ở đây
              if (confirmDialog.type === 'unfriend') {
                console.log('Đã xóa bạn');
              } else {
                console.log('Đã chặn người dùng');
              }
              onClose();
            }}
            title={confirmDialog.type === 'block' ? 'Chặn người này?' : 'Xóa bạn?'}
            description={
              confirmDialog.type === 'block'
                ? 'Người này sẽ không thể nhắn tin hoặc tìm thấy bạn trên WeConnect. Họ sẽ không được thông báo về việc bị chặn.'
                : 'Bạn và người này sẽ không còn là bạn bè trên WeConnect. Các tin nhắn trước đây vẫn sẽ được giữ lại.'
            }
            type={confirmDialog.type}
          />
        </div>
      </div>
    );
  }
);

const FriendContactPage = () => {
  const [search, setSearch] = useState('');
  const [openMenuId, setOpenMenuId] = useState<number | null>(null);
  const [selectedFriend, setSelectedFriend] = useState<Friend | null>(null);
  const menuRefs = useRef<{ [key: number]: HTMLDivElement | null }>({});

  // Close menu when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (openMenuId && !menuRefs.current[openMenuId]?.contains(event.target as Node)) {
        setOpenMenuId(null);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, [openMenuId]);

  const handleMenuToggle = useCallback(
    (id: number) => {
      setOpenMenuId(openMenuId === id ? null : id);
    },
    [openMenuId]
  );

  return (
    <div className="min-h-screen w-full bg-gradient-to-b from-gray-50 to-white dark:from-gray-900 dark:to-black">
      <div className="flex flex-col items-center max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
      {/* Search bar */}
      <div className="w-full mb-8 max-w-md sticky top-0 z-20 pt-4">
        <div className="relative group">
          <div className="absolute inset-0 bg-gradient-to-r from-blue-500/20 to-purple-500/20 rounded-2xl blur-xl group-hover:blur-2xl opacity-0 group-hover:opacity-100 transition-all duration-500" />
          <div className="relative bg-white/80 dark:bg-[#1a1a1f]/80 backdrop-blur-xl rounded-2xl shadow-lg transition-all duration-300 group-hover:shadow-xl border border-gray-200/50 dark:border-gray-800/50 group-hover:border-blue-500/20 dark:group-hover:border-blue-500/20">
            <div className="relative">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400 dark:text-gray-500 group-hover:text-blue-500 transition-colors duration-300" />
              <input
                type="text"
                value={search}
                onChange={e => setSearch(e.target.value)}
                placeholder="Tìm kiếm bạn bè bằng số điện thoại..."
                className="w-full bg-transparent px-12 py-4 text-gray-700 dark:text-gray-200 placeholder:text-gray-400 dark:placeholder:text-gray-500 focus:outline-none focus:ring-0 text-base"
                aria-label="Tìm kiếm bạn bè"
              />
              {search && (
                <button
                  onClick={() => setSearch('')}
                  className="absolute right-4 top-1/2 -translate-y-1/2 p-1 rounded-full hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors duration-200"
                >
                  <X className="w-4 h-4 text-gray-400 dark:text-gray-500" />
                </button>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Friend list */}
      <div className="w-full max-w-lg space-y-6 h-[80vh] overflow-y-auto hover:scrollbar-thin scrollbar-none hover:scrollbar-thumb-gray-300 dark:hover:scrollbar-thumb-gray-600 px-4">
        {friends.length === 0 ? (
          <div className="flex flex-col items-center justify-center h-full text-center py-10 space-y-6">
            <div className="w-40 h-40 rounded-full bg-gradient-to-br from-blue-50 to-blue-100 dark:from-blue-900/20 dark:to-blue-800/20 flex items-center justify-center">
              <User className="w-20 h-20 text-blue-500/50 dark:text-blue-400/50" />
            </div>
            <div className="space-y-2 max-w-sm">
              <h3 className="text-xl font-semibold text-gray-900 dark:text-gray-100">
                Chưa có bạn bè nào
              </h3>
              <p className="text-gray-500 dark:text-gray-400">
                Hãy kết bạn với những người khác để bắt đầu cuộc trò chuyện và chia sẻ khoảnh khắc với họ.
              </p>
              <button className="mt-4 px-6 py-3 rounded-xl bg-gradient-to-r from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700 text-white font-medium shadow-lg hover:shadow-xl hover:shadow-blue-500/25 transition-all duration-300">
                Tìm bạn bè
              </button>
            </div>
          </div>
        ) : (
          friends.map(friend => {
            return (
            <div
              key={friend.id}
              className="group flex items-center justify-between bg-white dark:bg-[#1a1a1f] rounded-2xl px-6 py-5 hover:bg-gray-50 dark:hover:bg-[#23232a] transition-colors duration-300 shadow-lg relative border border-gray-100 dark:border-gray-800 hover:border-blue-500/20 dark:hover:border-blue-500/20"
            >
              <div className="flex items-center gap-4">
                <div 
                  className="relative group/avatar cursor-pointer"
                  onClick={() => setSelectedFriend(friend)}
                >
                  <div className="absolute -inset-1 bg-gradient-to-r from-blue-500 to-purple-500 rounded-full opacity-0 group-hover/avatar:opacity-50 blur transition duration-300" />
                  <img
                    src={friend.avatar}
                    alt={friend.name}
                    className="relative w-14 h-14 rounded-full object-cover border-2 border-white dark:border-gray-800 shadow-lg transform group-hover/avatar:scale-105 transition duration-300"
                  />
                  <div className="absolute bottom-0 right-0 w-4 h-4 bg-green-500 rounded-full border-2 border-white dark:border-gray-800 animate-pulse"></div>
                </div>
                <div className="flex flex-col">
                  <span 
                    className="font-semibold text-gray-900 dark:text-gray-100 transition-colors duration-300 group-hover:text-blue-600 dark:group-hover:text-blue-400 cursor-pointer hover:text-blue-600 dark:hover:text-blue-400"
                    onClick={() => setSelectedFriend(friend)}
                  >
                    {friend.name}
                  </span>
                  <span className="text-sm text-gray-500 dark:text-gray-400 transition-opacity duration-300 group-hover:text-blue-500/70">Đang hoạt động</span>
                </div>
              </div>
              <div 
                className="relative" 
                ref={(el: HTMLDivElement | null) => {
                  if (el) menuRefs.current[friend.id] = el;
                }}
              >
                <button
                  className="flex items-center gap-2 px-6 py-3 rounded-xl bg-gradient-to-r from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700 text-white shadow-lg hover:shadow-xl hover:shadow-blue-500/25 transition-all duration-300 transform hover:scale-105"
                  onClick={(e) => {
                    e.stopPropagation();
                    handleMenuToggle(friend.id);
                  }}
                  aria-haspopup="menu"
                  aria-expanded={openMenuId === friend.id}
                  aria-label="Mở menu"
                >
                  Bạn bè
                  <CheckCircle2 className="w-5 h-5 text-white transition-transform duration-300 group-hover:rotate-12" />
                </button>
                <FriendMenu
                  open={openMenuId === friend.id}
                  onClose={() => setOpenMenuId(null)}
                  anchorRef={{ current: menuRefs.current[friend.id] }}
                  friend={friend}
                />
              </div>
            </div>
          );
        }))}
      </div>
      </div>

      {/* Profile Dialog */}
      <FriendProfileDialog
        isOpen={selectedFriend !== null}
        onClose={() => setSelectedFriend(null)}
        friend={selectedFriend}
      />
    </div>
  );
};

export default FriendContactPage;