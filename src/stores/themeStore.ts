import { create } from 'zustand'
import { themeStorage } from '../services/storage/storageService'
import { THEME_SETTING_ID, type Theme } from '../types/theme'

type ThemeStore = {
  theme: Theme
  loadTheme: () => Promise<void>
  toggleTheme: () => void
}

export const useThemeStore = create<ThemeStore>((set, get) => ({
  theme: 'light',

  loadTheme: async () => {
    const setting = await themeStorage.get()
    if (setting !== null) {
      set({ theme: setting.value })
    }
  },

  toggleTheme: () => {
    const theme: Theme = get().theme === 'light' ? 'dark' : 'light'
    set({ theme })
    void themeStorage.save({ id: THEME_SETTING_ID, value: theme })
  },
}))
