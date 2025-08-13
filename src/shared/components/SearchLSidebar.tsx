
'use client'

import { useEffect, useState } from 'react'
import { LoaderCircleIcon, SearchIcon, UserRoundSearch } from 'lucide-react'
import { Avatar, AvatarFallback, AvatarImage } from '@/shared/components/ui/avatar'
import { Button } from '@/shared/components/ui/button'
import { Input } from '@/shared/components/ui/input'
import { Popover, PopoverContent, PopoverTrigger } from '@/shared/components/ui/popover'
import { useNavigate } from 'react-router-dom'

const users = [
  {
    image: 'https://cdn.shadcnstudio.com/ss-assets/avatar/avatar-3.png',
    name: 'Howard Lloyd',
    fallback: 'HL'
  },
  {
    image: 'https://cdn.shadcnstudio.com/ss-assets/avatar/avatar-6.png',
    name: 'Olivia Sparks',
    fallback: 'OS'
  },
  {
    image: 'https://cdn.shadcnstudio.com/ss-assets/avatar/avatar-5.png',
    name: 'Hallie Richards',
    fallback: 'HR'
  },
  {
    image: 'https://cdn.shadcnstudio.com/ss-assets/avatar/avatar-4.png',
    name: 'John Cooper',
    fallback: 'JC'
  },
  {
    image: 'https://cdn.shadcnstudio.com/ss-assets/avatar/avatar-2.png',
    name: 'Sarah Wilson',
    fallback: 'SW'
  },
  {
    image: 'https://cdn.shadcnstudio.com/ss-assets/avatar/avatar-1.png',
    name: 'Mike Johnson',
    fallback: 'MJ'
  },
  {
    image: 'https://cdn.shadcnstudio.com/ss-assets/avatar/avatar-7.png',
    name: 'Emma Davis',
    fallback: 'ED'
  }
]

const useDebounce = (value: string, delay: number = 450) => {
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
const SearchSidebar = () => {
  const [inputValue, setInputValue] = useState('')
  const [isLoading, setIsLoading] = useState(false)
  const debouncedSearch = useDebounce(inputValue)
  const [filteredUsers, setFilteredUsers] = useState(users)
  const [showAll, setShowAll] = useState(false)
  const navigate = useNavigate()

  const displayedUsers = showAll ? filteredUsers : filteredUsers.slice(0, 5)
  const hasMore = filteredUsers.length > 5

  useEffect(() => {
    if (inputValue) {
      setIsLoading(true)
    } else {
      setIsLoading(false)
    }
  }, [inputValue])

  useEffect(() => {
    if (debouncedSearch.trim() === '') {
      setFilteredUsers(users)
      setIsLoading(false)
    } else {
      const searchTerm = debouncedSearch.toLowerCase()
      const filtered = users.filter(user => user.name.toLowerCase().includes(searchTerm))
      setFilteredUsers(filtered)
      setIsLoading(false)
    }
    // Reset showAll khi search thay đổi
    setShowAll(false)
  }, [debouncedSearch])

  return (
    <div className="py-4 px-6 border-b">
      <div className="relative flex items-center">
        {/* Left line */}
        <div className="flex-grow h-[1px] bg-border" />

        {/* Search box container */}
        <div className='w-full max-w-lg mx-4'>
          <Popover>
            <PopoverTrigger className="w-full">
              <div className='relative w-full'>
                <div className='text-muted-foreground pointer-events-none absolute inset-y-0 start-0 flex items-center justify-center ps-3'>
                  <SearchIcon className='size-4' />
                  <span className='sr-only'>Search</span>
                </div>
                <Input
                  type='search'
                  placeholder='Search users...'
                  value={inputValue}
                  onChange={e => setInputValue(e.target.value)}
                  className='w-full peer px-9 [&::-webkit-search-cancel-button]:appearance-none [&::-webkit-search-decoration]:appearance-none [&::-webkit-search-results-button]:appearance-none [&::-webkit-search-results-decoration]:appearance-none'
                />
                {isLoading && (
                  <div className='text-muted-foreground pointer-events-none absolute inset-y-0 end-0 flex items-center justify-center pe-3'>
                    <LoaderCircleIcon className='size-4 animate-spin' />
                    <span className='sr-only'>Loading...</span>
                  </div>
                )}
              </div>
            </PopoverTrigger>
            <PopoverContent className='w-[400px] p-2'>
              <ul className='space-y-2 max-h-[300px] overflow-y-auto scrollbar-thin scrollbar-thumb-gray-300 scrollbar-track-gray-100 hover:scrollbar-thumb-gray-400 dark:scrollbar-thumb-gray-600 dark:scrollbar-track-gray-800 [&::-webkit-scrollbar]:w-2 [&::-webkit-scrollbar-track]:bg-gray-100 [&::-webkit-scrollbar-thumb]:bg-gray-300 [&::-webkit-scrollbar-thumb]:rounded-full [&::-webkit-scrollbar-thumb:hover]:bg-gray-400'>
                {displayedUsers.length > 0 ? (
                  displayedUsers.map((user, index) => (
                    <li key={index} className='flex items-center gap-3 p-2 rounded-md hover:bg-accent'>
                      <Avatar className='size-8'>
                        <AvatarImage src={user.image} alt={user.name} />
                        <AvatarFallback className='text-xs'>{user.fallback}</AvatarFallback>
                      </Avatar>
                      <div className='flex-1 text-sm font-medium'>{user.name}</div>
                      <div className='flex items-center gap-2'>
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => navigate('/')}
                          className="h-8 w-8 p-0"
                        >
                          <UserRoundSearch className="h-4 w-4" />
                        </Button>
                        <Button
                          variant='outline'
                          className='h-7  px-3 py-1 text-xs'
                          onClick={() => navigate('/')}
                        >
                          Request
                        </Button>
                      </div>
                    </li>
                  ))
                ) : (
                  <li className='py-2 text-center text-sm text-muted-foreground'>No users found</li>
                )}
              </ul>
              {hasMore && !showAll && (
                <div className="pt-2 border-t">
                  <Button
                    variant="ghost"
                    className="w-full text-xs text-muted-foreground hover:text-foreground"
                    onClick={() => setShowAll(true)}
                  >
                    Xem thêm ({filteredUsers.length - 5} người khác)
                  </Button>
                </div>
              )}
            </PopoverContent>
          </Popover>
        </div>

        {/* Right line */}
        <div className="flex-grow h-[1px] bg-border" />
      </div>
    </div>
  )
}

export default SearchSidebar
