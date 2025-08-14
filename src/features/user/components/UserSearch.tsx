import { useEffect, useState, useRef } from 'react'
import { LoaderCircleIcon, SearchIcon, UserRoundSearch, UserPlus, UserCheck, X } from 'lucide-react'
import { Avatar, AvatarFallback, AvatarImage } from '@/shared/components/ui/avatar'
import { Button } from '@/shared/components/ui/button'
import { Input } from '@/shared/components/ui/input'
import { useNavigate } from 'react-router-dom'
import { userApi } from '@/api/user.api'
import type { User } from '@/api/user.api'

const useDebounce = (value: string, delay: number = 750) => {
  const [debouncedValue, setDebouncedValue] = useState(value)

  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedValue(value)
    }, delay)

    return () => {
      clearTimeout(timer)
    }
  }, [value, delay])

  return debouncedValue
}

export const UserSearch = () => {
  const [inputValue, setInputValue] = useState('')
  const [isLoading, setIsLoading] = useState(false)
  const [isFocused, setIsFocused] = useState(false)
  const debouncedSearch = useDebounce(inputValue)
  const [users, setUsers] = useState<User[]>([])
  const [showAll, setShowAll] = useState(false)
  const navigate = useNavigate()
  const searchRef = useRef<HTMLDivElement>(null)

  const displayedUsers = showAll ? users : users.slice(0, 5)
  const hasMore = users.length > 5
  const showDropdown = (isFocused || inputValue.trim()) && (users.length > 0 || isLoading || (inputValue.trim() && !isLoading))

  // Handle click outside to close dropdown
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (searchRef.current && !searchRef.current.contains(event.target as Node)) {
        setIsFocused(false)
      }
    }

    document.addEventListener('mousedown', handleClickOutside)
    return () => {
      document.removeEventListener('mousedown', handleClickOutside)
    }
  }, [])

  // Handle loading state when input changes
  useEffect(() => {
    if (inputValue.trim()) {
      setIsLoading(true)
    } else {
      setIsLoading(false)
      setUsers([])
    }
  }, [inputValue])

  // API call when debounced search changes
  useEffect(() => {
    const searchUsers = async () => {
      try {
        if (!debouncedSearch.trim()) {
          setUsers([])
          setIsLoading(false)
          return
        }

        const response = await userApi.searchUsers(debouncedSearch)

        if (response.code === 200) {
          setUsers(response.result)
        } else {
          console.error('Search failed:', response.message)
          setUsers([])
        }
      } catch (error) {
        console.error('Search error:', error)
        setUsers([])
      } finally {
        setIsLoading(false)
      }
    }

    searchUsers()
    setShowAll(false) // Reset show all when search changes
  }, [debouncedSearch])

  const handleViewProfile = (userId: string) => {
    navigate(`/profile/${userId}`)
    setIsFocused(false) // Hide dropdown after navigation
  }

  const handleSendFriendRequest = (userId: string) => {
    // TODO: Implement friend request logic with socket
    console.log('Sending friend request to:', userId)
    // Don't hide dropdown for friend request to allow multiple actions
  }

  // Handle keyboard navigation
  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Escape') {
      setIsFocused(false)
      setInputValue('')
    }
  }

  const handleClearSearch = () => {
    setInputValue('')
    setUsers([])
    setShowAll(false)
    setIsFocused(false)
  }

  return (
    <div className="py-4 px-6 border-b">
      <div className="relative flex items-center">
        {/* Left line */}
        <div className="flex-grow h-[1px] bg-border" />

        {/* Search box container */}
        <div className='w-full max-w-lg mx-4 relative' ref={searchRef}>
          <div className='relative w-full'>
            <div className='text-muted-foreground pointer-events-none absolute inset-y-0 start-0 flex items-center justify-center ps-3 z-10'>
              <SearchIcon className='size-4' />
              <span className='sr-only'>Search</span>
            </div>
            <Input
              type='search'
              placeholder='Search users by email, phone, or username...'
              value={inputValue}
              onChange={e => setInputValue(e.target.value)}
              onFocus={() => setIsFocused(true)}
              onKeyDown={handleKeyDown}
              className='w-full peer px-9 [&::-webkit-search-cancel-button]:appearance-none [&::-webkit-search-decoration]:appearance-none [&::-webkit-search-results-button]:appearance-none [&::-webkit-search-results-decoration]:appearance-none'
            />
            {!isLoading && inputValue && (
              <button
                onClick={handleClearSearch}
                className='text-muted-foreground hover:text-foreground absolute inset-y-0 end-0 flex items-center justify-center pe-3 z-10 transition-colors'
              >
                <X className='size-4' />
                <span className='sr-only'>Clear search</span>
              </button>
            )}
            {isLoading && (
              <div className='text-muted-foreground pointer-events-none absolute inset-y-0 end-0 flex items-center justify-center pe-3 z-10'>
                <LoaderCircleIcon className='size-4 animate-spin' />
                <span className='sr-only'>Loading...</span>
              </div>
            )}
          </div>

          {/* Search Results Dropdown */}
          {showDropdown && (
            <div className='absolute top-full left-0 right-0 z-50 mt-1 bg-popover border rounded-md shadow-lg p-2 max-h-[400px]'>
              <ul className='space-y-2 max-h-[300px] overflow-y-auto scrollbar-thin scrollbar-thumb-gray-300 scrollbar-track-gray-100 hover:scrollbar-thumb-gray-400 dark:scrollbar-thumb-gray-600 dark:scrollbar-track-gray-800 [&::-webkit-scrollbar]:w-2 [&::-webkit-scrollbar-track]:bg-gray-100 [&::-webkit-scrollbar-thumb]:bg-gray-300 [&::-webkit-scrollbar-thumb]:rounded-full [&::-webkit-scrollbar-thumb:hover]:bg-gray-400'>
                {isLoading ? (
                  <li className='py-4 text-center text-sm text-muted-foreground'>
                    <LoaderCircleIcon className='size-4 animate-spin inline-block mr-2' />
                    Searching...
                  </li>
                ) : displayedUsers.length > 0 ? (
                  displayedUsers.map((user) => (
                    <li key={user.userId} className='flex items-center gap-3 p-2 rounded-md hover:bg-accent transition-colors cursor-pointer'>
                      <Avatar className='size-8'>
                        <AvatarImage src={user.avatarUrl} alt={user.username} />
                        <AvatarFallback className='text-xs'>
                          {user.username?.charAt(0)?.toUpperCase() || 'U'}
                        </AvatarFallback>
                      </Avatar>
                      <div className='flex-1 min-w-0'>
                        <div className='text-sm font-medium truncate'>{user.username}</div>
                        <div className='text-xs text-muted-foreground truncate'>{user.email}</div>
                        {user.phoneNumber && (
                          <div className='text-xs text-muted-foreground truncate'>{user.phoneNumber}</div>
                        )}
                      </div>
                      <div className='flex items-center gap-2'>
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => handleViewProfile(user.userId)}
                          className="h-8 w-8 p-0"
                        >
                          <UserRoundSearch className="h-4 w-4" />
                        </Button>
                        {user.isFriend ? (
                          <Button
                            variant='outline'
                            className='h-7 px-3 py-1 text-xs'
                            disabled
                          >
                            <UserCheck className="h-3 w-3 mr-1" />
                            Friends
                          </Button>
                        ) : (
                          <Button
                            variant='outline'
                            className='h-7 px-3 py-1 text-xs'
                            onClick={() => handleSendFriendRequest(user.userId)}
                          >
                            <UserPlus className="h-3 w-3 mr-1" />
                            Add
                          </Button>
                        )}
                      </div>
                    </li>
                  ))
                ) : inputValue.trim() && !isLoading ? (
                  <li className='py-8 text-center'>
                    <div className='text-muted-foreground text-sm mb-1'>
                      <UserRoundSearch className='size-8 mx-auto mb-2 opacity-50' />
                      <div className='font-medium'>Không tìm thấy người dùng</div>
                      <div className='text-xs mt-1'>
                        Không có kết quả cho "{inputValue}"
                      </div>
                    </div>
                  </li>
                ) : null}
              </ul>
              {hasMore && !showAll && displayedUsers.length > 0 && (
                <div className="pt-2 border-t">
                  <Button
                    variant="ghost"
                    className="w-full text-xs text-muted-foreground hover:text-foreground"
                    onClick={() => setShowAll(true)}
                  >
                    Show more ({users.length - 5} others)
                  </Button>
                </div>
              )}
            </div>
          )}
        </div>

        {/* Right line */}
        <div className="flex-grow h-[1px] bg-border" />
      </div>
    </div>
  )
}

export default UserSearch
