import { z } from 'zod'

export const themeSchema = z.enum(['light', 'dark'])

export type Theme = z.infer<typeof themeSchema>

export const THEME_SETTING_ID = 'theme'

export const themeSettingSchema = z.object({
  id: z.literal(THEME_SETTING_ID),
  value: themeSchema,
})

export type ThemeSetting = z.infer<typeof themeSettingSchema>
