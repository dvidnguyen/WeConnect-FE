import { AppProvider } from '@/app/providers/AppProvider'
import { AppRoutes } from '@/app/routes/AppRoutes'
import { ThemeProvider } from '@/shared/components/ThemeProvider';

function App() {
  return (
    <AppProvider>
      <ThemeProvider>
        <AppRoutes />
      </ThemeProvider>
    </AppProvider>
  )
}

export default App
