import { useState, useEffect } from 'react';
import { MessageCircle, User, Search, X, LoaderCircle } from 'lucide-react';
import { useContacts } from '@/features/friends/hooks/useContacts';
import type { Contact } from '@/api/friend.api';
import { DropdownMenu, DropdownMenuTrigger, DropdownMenuContent, DropdownMenuItem, DropdownMenuSeparator, DropdownMenuLabel } from '@/shared/components/ui/dropdown-menu';
import { Settings, Shield, ShieldBan, UserRoundMinus } from 'lucide-react';
import { toast } from 'sonner';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter, DialogClose } from '@/shared/components/ui/dialog';
import { Button } from '@/shared/components/ui/button';

const FriendContactPage = () => {
  const [search, setSearch] = useState('');
  const { contacts, loading, getContacts, cancelFriend, blockContact, unblockContact } = useContacts();
  const [confirmDialogOpen, setConfirmDialogOpen] = useState(false);
  const [selectedContact, setSelectedContact] = useState<Contact | null>(null);
  const [action, setAction] = useState<'unfriend' | 'block' | 'unblock' | null>(null);

  useEffect(() => {
    getContacts();
  }, [getContacts]);

  // Tách contacts thành 2 nhóm: bình thường và đã bị chặn
  const activeContacts = contacts.filter((contact: Contact) => !contact.block);
  const blockedContacts = contacts.filter((contact: Contact) => contact.block);

  // Filter cho cả 2 nhóm
  const filteredActiveContacts = activeContacts.filter((contact: Contact) =>
    (contact.name && contact.name.toLowerCase().includes(search.toLowerCase())) ||
    (contact.email && contact.email.toLowerCase().includes(search.toLowerCase()))
  );

  const filteredBlockedContacts = blockedContacts.filter((contact: Contact) =>
    (contact.name && contact.name.toLowerCase().includes(search.toLowerCase())) ||
    (contact.email && contact.email.toLowerCase().includes(search.toLowerCase()))
  );

  const handleMessage = (contactId: string) => {
    toast.info("Chức năng chat sẽ được triển khai sau");
  };

  const openConfirmDialog = (contact: Contact, actionType: 'unfriend' | 'block' | 'unblock') => {
    setSelectedContact(contact);
    setAction(actionType);
    setConfirmDialogOpen(true);
  };

  const handleConfirmAction = async () => {
    if (!selectedContact || !action) return;

    try {
      if (action === 'unfriend') {
        await cancelFriend(selectedContact.id);
      } else if (action === 'block') {
        await blockContact(selectedContact.id);
      } else if (action === 'unblock') {
        await unblockContact(selectedContact.id);
      }
    } catch (error) {
      console.error('Error in handleConfirmAction:', error);
    } finally {
      setConfirmDialogOpen(false);
      setSelectedContact(null);
      setAction(null);
    }
  };

  const handleUnblock = async (contactId: string) => {
    try {
      await unblockContact(contactId);
    } catch (error) {
      console.error('Error unblocking contact:', error);
    }
  };

  // Component để render contact card
  const ContactCard = ({ contact, isBlocked = false }: { contact: Contact; isBlocked?: boolean }) => (
    <div
      key={contact.id}
      className={`flex items-center justify-between rounded-xl p-4 border transition-all duration-200 ${
        isBlocked
          ? 'bg-gray-50 dark:bg-gray-900/50 border-red-200 dark:border-red-800 opacity-60' 
          : 'bg-white dark:bg-gray-800 border-gray-200 dark:border-gray-700/50 hover:border-blue-500/20'
      }`}
    >
      <div className="flex items-center gap-4">
        <div className={`w-12 h-12 rounded-full object-cover border flex items-center justify-center ${
          isBlocked
            ? 'border-red-300 dark:border-red-700 bg-gray-300 dark:bg-gray-600 grayscale' 
            : 'border-gray-200 dark:border-gray-700 bg-gray-200 dark:bg-gray-700'
        }`}>
          {contact.avatarUrl ? (
            <img
              src={contact.avatarUrl}
              alt={contact.name}
              className={`w-full h-full rounded-full object-cover ${isBlocked ? 'grayscale' : ''}`}
            />
          ) : (
            <span className={`text-xl font-medium ${
              isBlocked
                ? 'text-gray-500 dark:text-gray-400' 
                : 'text-gray-700 dark:text-gray-200'
            }`}>
              {contact.name?.charAt(0)?.toUpperCase() || 'U'}
            </span>
          )}
        </div>
        <div>
          <div className="flex items-center gap-2">
            <h3 className={`font-medium ${
              isBlocked
                ? 'text-gray-500 dark:text-gray-400' 
                : 'text-gray-900 dark:text-gray-100'
            }`}>
              {contact.name}
            </h3>
          </div>
          <p className={`text-sm ${
            isBlocked
              ? 'text-gray-400 dark:text-gray-500' 
              : 'text-gray-500'
          }`}>
            {contact.email}
          </p>
        </div>
      </div>
      <div className="flex items-center gap-2">
        {isBlocked ? (
          // Nút gỡ chặn cho contacts đã bị chặn
          <button
            onClick={() => handleUnblock(contact.id)}
            className="px-3 py-1.5 text-sm bg-green-500 hover:bg-green-600 text-white rounded-lg transition-colors duration-200"
          >
            Gỡ chặn
          </button>
        ) : (
          // Nút nhắn tin cho contacts bình thường
          <button
            onClick={() => handleMessage(contact.id)}
            className="p-2 text-gray-500 hover:text-blue-500 dark:hover:text-blue-400 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700/50 transition-colors duration-200"
            title="Message"
          >
            <MessageCircle className="h-5 w-5" />
          </button>
        )}
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <button className="p-2 text-gray-500 hover:text-blue-500 dark:hover:text-blue-400 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700/50 transition-colors duration-200">
              <Settings className="w-5 h-5" />
            </button>
          </DropdownMenuTrigger>
          <DropdownMenuContent className="w-56" align="end" side="top">
            <DropdownMenuLabel>Tùy chọn</DropdownMenuLabel>
            <DropdownMenuSeparator />
            {!isBlocked && (
              <DropdownMenuItem onSelect={() => handleMessage(contact.id)}>
                <MessageCircle className="mr-2 h-4 w-4" />
                Nhắn tin
              </DropdownMenuItem>
            )}
            <DropdownMenuItem onSelect={() => openConfirmDialog(contact, 'unfriend')}>
              <UserRoundMinus className="mr-2 h-4 w-4" />
              Hủy kết bạn
            </DropdownMenuItem>
            <DropdownMenuItem onSelect={() =>
              openConfirmDialog(contact, isBlocked ? 'unblock' : 'block')
            }>
              {isBlocked ? (
                <Shield className="mr-2 h-4 w-4" />
              ) : (
                <ShieldBan className="mr-2 h-4 w-4" />
              )}
              {isBlocked ? 'Bỏ chặn' : 'Chặn'}
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    </div>
  );

  return (
    <div className="flex flex-col h-full">
      {/* Search bar */}
      <div className="w-full mb-8 sticky top-0 z-20 px-4 pt-4">
        <div className="max-w-3xl mx-auto">
          <div className="relative bg-white dark:bg-gray-800 rounded-xl shadow-lg transition-all duration-300 border border-gray-200/50 dark:border-gray-700/50">
            <div className="relative">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400 dark:text-gray-500" />
              <input
                type="text"
                value={search}
                onChange={e => setSearch(e.target.value)}
                placeholder="Tìm kiếm bạn bè..."
                className="w-full bg-transparent px-12 py-4 text-gray-700 dark:text-gray-200 placeholder:text-gray-400 dark:placeholder:text-gray-500 focus:outline-none focus:ring-0 text-base"
                aria-label="Tìm kiếm bạn bè"
              />
              {search && (
                <button
                  onClick={() => setSearch('')}
                  className="absolute right-4 top-1/2 -translate-y-1/2 p-1 rounded-full hover:bg-gray-100 dark:hover:bg-gray-700/50"
                >
                  <X className="w-4 h-4 text-gray-400 dark:text-gray-500" />
                </button>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Contact list */}
      <div className="flex-1 overflow-y-auto px-4">
        <div className="max-w-3xl mx-auto">
          {loading ? (
            <div className="flex flex-col items-center justify-center py-12">
              <LoaderCircle className="w-8 h-8 animate-spin text-blue-500 mb-4" />
              <p className="text-gray-500 dark:text-gray-400">Đang tải danh sách bạn bè...</p>
            </div>
          ) : (filteredActiveContacts.length === 0 && filteredBlockedContacts.length === 0) ? (
            <div className="flex flex-col items-center justify-center py-12">
              <div className="w-20 h-20 text-gray-300 dark:text-gray-600 mb-4">
                <User className="w-full h-full" />
              </div>
              <h3 className="text-xl font-medium text-gray-900 dark:text-gray-100 mb-2">
                {search ? 'Không tìm thấy kết quả' : 'Chưa có bạn bè nào'}
              </h3>
              <p className="text-gray-500 dark:text-gray-400 text-center max-w-sm">
                {search
                  ? 'Thử tìm kiếm với từ khóa khác'
                  : 'Hãy kết bạn với mọi người để trò chuyện và chia sẻ những khoảnh khắc thú vị nhé!'}
              </p>
            </div>
          ) : (
            <div className="space-y-6 pb-6">
              {/* Danh sách bạn bè bình thường */}
              {filteredActiveContacts.length > 0 && (
                <div>
                  <div className="flex items-center justify-between mb-4">
                    <h2 className="text-lg font-semibold text-gray-900 dark:text-gray-100">
                      Bạn bè ({filteredActiveContacts.length})
                    </h2>
                  </div>
                  <div className="space-y-4">
                    {filteredActiveContacts.map((contact) => (
                      <ContactCard key={contact.id} contact={contact} isBlocked={false} />
                    ))}
                  </div>
                </div>
              )}

              {/* Thanh ngang và danh sách đã chặn */}
              {filteredBlockedContacts.length > 0 && (
                <div>
                  <div className="flex items-center justify-between mb-4 pt-6 border-t border-gray-200 dark:border-gray-700">
                    <h2 className="text-lg font-semibold text-red-600 dark:text-red-400 flex items-center gap-2">
                      <ShieldBan className="w-5 h-5" />
                      Đã chặn ({filteredBlockedContacts.length})
                    </h2>
                  </div>
                  <div className="space-y-4">
                    {filteredBlockedContacts.map((contact) => (
                      <ContactCard key={contact.id} contact={contact} isBlocked={true} />
                    ))}
                  </div>
                </div>
              )}
            </div>
          )}
        </div>
      </div>

      {/* Confirm Dialog */}
      <Dialog open={confirmDialogOpen} onOpenChange={setConfirmDialogOpen}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle>
              {action === 'unfriend' ? 'Xác nhận hủy kết bạn' :
                action === 'block' ? 'Xác nhận chặn người dùng' :
                  'Xác nhận bỏ chặn người dùng'}
            </DialogTitle>
            <DialogDescription>
              {action === 'unfriend' && `Bạn có chắc muốn hủy kết bạn với ${selectedContact?.name}?`}
              {action === 'block' && `Sau khi chặn, ${selectedContact?.name} sẽ không thể nhắn tin hoặc thấy bạn trực tuyến.`}
              {action === 'unblock' && `Bạn có chắc muốn bỏ chặn ${selectedContact?.name}?`}
            </DialogDescription>
          </DialogHeader>
          <DialogFooter className="gap-2">
            <DialogClose asChild>
              <Button variant="outline">
                Hủy
              </Button>
            </DialogClose>
            <Button
              variant={action === 'block' ? 'destructive' : 'default'}
              onClick={handleConfirmAction}
            >
              {action === 'unfriend' ? 'Hủy kết bạn' :
                action === 'block' ? 'Chặn' :
                  'Bỏ chặn'}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default FriendContactPage;