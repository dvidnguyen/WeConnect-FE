import { useState, useCallback } from 'react';
import { friendApi, type Contact } from '@/api/friend.api';
import { toast } from 'sonner';
import { conversationAPI, type ConversationMessage } from '@/api/conversation.api';

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

  // Tạo hoặc lấy cuộc trò chuyện trực tiếp
  const createOrGetDirectConversation = useCallback(async (contactId: string): Promise<{ conversationId: string; messages: ConversationMessage[] } | null> => {
    try {
      setLoading(true);
      const response = await friendApi.createDirectConversation(contactId);

      if (response.code === 200 && response.result) {
        const conversationId = response.result.conversationId;
        toast.success('Đã tạo hoặc mở cuộc trò chuyện! 111');

        // Fetch messages for the conversation
        const messagesResponse = await conversationAPI.getConversationMessages(conversationId);
        if (messagesResponse.code === 200) {
          return { conversationId, messages: messagesResponse.result.items };
        } else {
          toast.error('Không thể tải tin nhắn của cuộc trò chuyện');
          return { conversationId, messages: [] };
        }
      } else {
        toast.error(response.message || 'Không thể tạo hoặc mở cuộc trò chuyện');
        return null;
      }
    } catch {
      toast.error('Đã xảy ra lỗi khi tạo hoặc mở cuộc trò chuyện 1111');
      return null;
    } finally {
      setLoading(false);
    }
  }, []);

  return {
    loading,
    contacts,
    getContacts,
    cancelFriend,
    blockContact,
    unblockContact,
    createOrGetDirectConversation,
    setContacts
  };
};

export default useContacts;