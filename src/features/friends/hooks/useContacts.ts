import { useState, useCallback } from 'react';
import { friendApi, type Contact } from '@/api/friend.api';
import { toast } from 'sonner';

export const useContacts = () => {
  const [loading, setLoading] = useState(false);
  const [contacts, setContacts] = useState<Contact[]>([]);

  // Lấy danh sách contacts
  const getContacts = useCallback(async () => {
    setLoading(true);
    try {
      const response = await friendApi.getContacts();
      if (response.code === 200 && response.result) {
        setContacts(response.result);
        return { success: true, data: response.result };
      } else {
        toast.error(response.message || 'Không thể tải danh sách bạn bè', {
          duration: 3000,
          dismissible: true,
        });
        return { success: false, message: response.message };
      }
    } catch (error) {
      console.error('Error getting contacts:', error);
      toast.error('Đã xảy ra lỗi khi tải danh sách bạn bè', {
        duration: 3000,
        dismissible: true,
      });
      return { success: false, message: 'Network error' };
    } finally {
      setLoading(false);
    }
  }, []);

  // Hủy kết bạn
  const cancelFriend = useCallback(async (friendId: string) => {
    try {
      const response = await friendApi.cancelFriend(friendId);
      if (response.code === 200) {
        // Xóa contact khỏi danh sách
        setContacts(prevContacts =>
          prevContacts.filter(contact => contact.id !== friendId)
        );
        
        // Toast với timeout ngắn và không block UI
        setTimeout(() => {
          toast.success('Đã hủy kết bạn thành công', {
            duration: 2000,
            dismissible: true,
            position: 'top-right'
          });
        }, 100);
        
        return { success: true };
      } else {
        toast.error(response.message || 'Không thể hủy kết bạn', {
          duration: 3000,
          dismissible: true,
        });
        return { success: false, message: response.message };
      }
    } catch (error) {
      console.error('Error canceling friend:', error);
      toast.error('Đã xảy ra lỗi khi hủy kết bạn', {
        duration: 3000,
        dismissible: true,
      });
      return { success: false, message: 'Network error' };
    }
  }, []);

  // Chặn contact
  const blockContact = useCallback(async (contactId: string) => {
    try {
      const response = await friendApi.blockContact(contactId);
      if (response.code === 200) {
        // Cập nhật trạng thái block trong danh sách
        setContacts(prevContacts =>
          prevContacts.map(contact =>
            contact.id === contactId
              ? { ...contact, block: true }
              : contact
          )
        );
        
        // Toast với timeout ngắn
        setTimeout(() => {
          toast.success('Đã chặn người dùng thành công', {
            duration: 2000,
            dismissible: true,
            position: 'top-right'
          });
        }, 100);
        
        return { success: true };
      } else {
        toast.error(response.message || 'Không thể chặn người dùng', {
          duration: 3000,
          dismissible: true,
        });
        return { success: false, message: response.message };
      }
    } catch (error) {
      console.error('Error blocking contact:', error);
      toast.error('Đã xảy ra lỗi khi chặn người dùng', {
        duration: 3000,
        dismissible: true,
      });
      return { success: false, message: 'Network error' };
    }
  }, []);

  // Bỏ chặn contact
  const unblockContact = useCallback(async (contactId: string) => {
    try {
      const response = await friendApi.unblockContact(contactId);
      if (response.code === 200) {
        // Cập nhật trạng thái unblock trong danh sách
        setContacts(prevContacts =>
          prevContacts.map(contact =>
            contact.id === contactId
              ? { ...contact, block: false }
              : contact
          )
        );
        
        // Toast với timeout ngắn
        setTimeout(() => {
          toast.success('Đã bỏ chặn người dùng thành công', {
            duration: 2000,
            dismissible: true,
            position: 'top-right'
          });
        }, 100);
        
        return { success: true };
      } else {
        toast.error(response.message || 'Không thể bỏ chặn người dùng', {
          duration: 3000,
          dismissible: true,
        });
        return { success: false, message: response.message };
      }
    } catch (error) {
      console.error('Error unblocking contact:', error);
      toast.error('Đã xảy ra lỗi khi bỏ chặn người dùng', {
        duration: 3000,
        dismissible: true,
      });
      return { success: false, message: 'Network error' };
    }
  }, []);

  return {
    loading,
    contacts,
    getContacts,
    cancelFriend,
    blockContact,
    unblockContact,
    setContacts
  };
};

export default useContacts;