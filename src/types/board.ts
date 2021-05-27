import { List } from './list'

export interface Board {
  name: string
  lists: List[]
  isLoadded: boolean
  isActive: boolean
}
