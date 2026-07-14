import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'

// Core Styles
import './styles/new-ui-tokens.css'
import './styles/app-foundation.css'

// Themes
import './theme/themes/light.theme.css'
import './theme/themes/dark.theme.css'
import './theme/themes/scientific-night.theme.css'
import './theme/themes/laboratory.theme.css'
import './theme/themes/high-contrast.theme.css'

import { ThemeProvider } from './theme/ThemeProvider'
import './i18n'; // Initialize i18next
import App from './App.tsx'

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <ThemeProvider>
      <App />
    </ThemeProvider>
  </StrictMode>,
)
