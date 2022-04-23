import { type PathLike } from 'node:fs'
import { stat } from 'node:fs/promises'

export const exists: (path: PathLike) => Promise<boolean> = async path => {
  try {
    await stat(path)
    return true
  } catch {
    return false
  }
}
