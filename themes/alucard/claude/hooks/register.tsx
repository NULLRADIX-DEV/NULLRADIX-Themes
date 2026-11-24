// Claude-Theme „Alucard“: setzt den Look aus look.ts mit den Einstellungen, die NULLRADIX schreibt.
import type { Register } from 'claude-code'

import { lookFor } from './look'
import { registerLook } from './nullradix-look'
import { settings } from './nullradix-settings'

export const register: Register = on => {
  registerLook(on, lookFor(settings))
}
