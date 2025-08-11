
import { useEffect, useId, useState } from 'react'

import { LoaderCircleIcon, SearchIcon } from 'lucide-react'

import { Input } from '@/shared/components/ui/input'

import { Avatar, AvatarFallback, AvatarImage } from '@/shared/components/ui/avatar'
import { Button } from '@/components/ui/button'
import { Popover, PopoverContent, PopoverTrigger } from '@/shared/components/ui/popover'
export const InputSearchLoaderDemo = () => {
  const [value, setValue] = useState('')
  const [isLoading, setIsLoading] = useState(false)

  const id = useId()

  useEffect(() => {
    if (value) {
      setIsLoading(true)

      const timer = setTimeout(() => {
        setIsLoading(false)
      }, 500)

      return () => clearTimeout(timer)
    }

    setIsLoading(false)
  }, [value])

  return (
    <div className="py-4 px-6 border-b">
      <div className="relative flex items-center">
        {/* Left line */}
        <div className="flex-grow h-[1px] bg-border" />

        {/* Search box container */}
        <div className='w-full max-w-xs mx-4'>
          <div className='relative'>
            <div className='text-muted-foreground pointer-events-none absolute inset-y-0 start-0 flex items-center justify-center ps-3 peer-disabled:opacity-50'>
              <SearchIcon className='size-4' />
              <span className='sr-only'>Search</span>
            </div>
            <Input
              id={id}
              type='search'
              placeholder='Search user...'
              value={value}
              onChange={e => setValue(e.target.value)}
              className='peer px-9 [&::-webkit-search-cancel-button]:appearance-none [&::-webkit-search-decoration]:appearance-none [&::-webkit-search-results-button]:appearance-none [&::-webkit-search-results-decoration]:appearance-none'
            />
            {isLoading && (
              <div className='text-muted-foreground pointer-events-none absolute inset-y-0 end-0 flex items-center justify-center pe-3 peer-disabled:opacity-50'>
                <LoaderCircleIcon className='size-4 animate-spin' />
                <span className='sr-only'>Loading...</span>
              </div>
            )}
          </div>
        </div>

        {/* Right line */}
        <div className="flex-grow h-[1px] bg-border" />
      </div>
    </div>
  )
}

export default InputSearchLoaderDemo
