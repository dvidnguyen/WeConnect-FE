import { useState } from 'react'

import { useTheme } from "@/shared/components/ThemeProvider"
import { MoonIcon, SunIcon } from 'lucide-react'

import { Label } from '@/shared//components/ui/label'
import { Switch } from '@/shared//components/ui/switch'
export function ModeToggle() {
  const { setTheme } = useTheme()
  const [checked, setChecked] = useState<boolean>(true)

  const handleThemeChange = (isChecked: boolean) => {
    setChecked(isChecked);
    setTheme(isChecked ? "dark" : "light");
  }

  return (
    <>
      <div className='inline-flex items-center gap-2 '>
        <Switch
          id='icon-label'
          checked={checked}
          onCheckedChange={handleThemeChange}
          aria-label='Toggle switch'
        />
        <Label htmlFor='icon-label'>
          <span className='sr-only'>Toggle switch</span>
          {checked ? (
            <MoonIcon className='size-4' aria-hidden='true' />
          ) : (
            <SunIcon className='size-4' aria-hidden='true' />
          )}
        </Label>
      </div>
    </>
  )
}