import { useState, useCallback } from 'react'
import { friendApi, type Contact } from '@/api/friend.api'
import { toast } from 'sonner'
import NotificationAlert from '@/shared/components/NotificationAlert'

export function useContacts() {
  const [loading, setLoading] = useState(false)
  const [contacts, setContacts] = useState<Contact[]>([])

  // Lấy danh sách contacts
  const getContacts = useCallback(async () => {
    setLoading(true)
    try {
      const response = await friendApi.getContacts()
      if (response.code === 200 && response.result) {
        setContacts(response.result)
        return { success: true, data: response.result }
      } else {
        console.error('Failed to get contacts:', response.message)
        toast.custom(() => (
          <NotificationAlert
            title="Lỗi"
            description={response.message || 'Không thể tải danh sách bạn bè'}
            type="error"
          />
        ))
        return { success: false, message: response.message }
      }
    } catch (error) {
      console.error('Error getting contacts:', error)
      toast.custom(() => (
        <NotificationAlert
          title="Lỗi"
          description="Đã xảy ra lỗi khi tải danh sách bạn bè"
          type="error"
        />
      ))
      return { success: false, message: 'Network error' }
    } finally {
      setLoading(false)
    }
  }, [])

  return {
    loading,
    contacts,
    getContacts
  }
}
